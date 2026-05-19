import { NextRequest, NextResponse } from 'next/server'

const BASE_ID  = process.env.AIRTABLE_BASE_ID!
const API_KEY  = process.env.AIRTABLE_API_KEY!
const AT       = `https://api.airtable.com/v0/${BASE_ID}`

const AT_HEADERS = {
  Authorization: `Bearer ${API_KEY}`,
  'Content-Type': 'application/json',
}

/* ─── Airtable helpers ──────────────────────────────────────────────────── */

async function atPost(table: string, fields: Record<string, unknown>) {
  const res = await fetch(`${AT}/${encodeURIComponent(table)}`, {
    method: 'POST',
    headers: AT_HEADERS,
    body: JSON.stringify({ fields }),
  })
  if (!res.ok) throw new Error(`Airtable ${res.status}: ${await res.text()}`)
  return res.json()
}

/** Fetch every record from the Devices table (usually <50 rows). */
async function fetchAllDevices(): Promise<Array<{ id: string; model: string }>> {
  const devices: Array<{ id: string; model: string }> = []
  let offset: string | undefined

  do {
    const url = new URL(`${AT}/${encodeURIComponent('Devices')}`)
    url.searchParams.set('fields[]', 'Device Model')
    if (offset) url.searchParams.set('offset', offset)

    const res = await fetch(url.toString(), { headers: AT_HEADERS })
    if (!res.ok) {
      console.warn('[devices] fetch failed', res.status)
      break
    }
    const data = await res.json()
    for (const rec of data.records ?? []) {
      const model = rec.fields?.['Device Model']
      if (model) devices.push({ id: rec.id, model })
    }
    offset = data.offset
  } while (offset)

  return devices
}

/* ─── Device matching ───────────────────────────────────────────────────── */

function matchDevices(
  formOption: string,
  devices: Array<{ id: string; model: string }>,
): string[] {
  if (!formOption || formOption === 'אחר') return []

  const norm = (s: string) => s.toLowerCase().trim()
  const parts = formOption.split(' / ').map(p => norm(p))

  return devices
    .filter(({ model }) => {
      const m = norm(model)
      return parts.some(part => {
        if (!part) return false
        if (m === part || m.endsWith(' ' + part)) return true
        if (
          m.startsWith(part) &&
          (m.length === part.length || m[part.length] === ' ' || m[part.length] === '(')
        )
          return true
        if (/^\d/.test(part) && m.endsWith(' ' + part)) return true
        return false
      })
    })
    .map(d => d.id)
}

/* ─── Email alert on failure ─────────────────────────────────────────────── */

async function sendFailureAlert(type: string, body: unknown, error: string) {
  const key = process.env.RESEND_API_KEY
  if (!key) return // silent no-op until key is configured

  const text = [
    `⚠️ הגשת טופס NoMap נכשלה ב-Airtable`,
    ``,
    `סוג: ${type}`,
    `זמן: ${new Date().toISOString()}`,
    `שגיאה: ${error}`,
    ``,
    `נתונים מלאים (לשחזור ידני):`,
    JSON.stringify(body, null, 2),
  ].join('\n')

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'NoMap Alerts <alerts@nomap.flybiz.co.il>',
        to: 'oz@flybiz.co.il',
        subject: `⚠️ NoMap - הגשה נכשלה (${type})`,
        text,
      }),
    })
  } catch (emailErr) {
    console.error('[alert-email] failed to send', emailErr)
  }
}

/* ─── Route handler ─────────────────────────────────────────────────────── */

// Helper: only add field to object if value is non-empty
function set(
  obj: Record<string, unknown>,
  key: string,
  value: unknown,
  { onlyIfTruthy = false } = {},
) {
  if (onlyIfTruthy && !value) return
  obj[key] = value
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown> = {}
  let type = 'unknown'

  try {
    body = await req.json()
    type = String(body.type ?? 'unknown')

    // ── Full submission log (always) — visible in Vercel Function Logs ──
    console.log('[submit:received]', JSON.stringify(body))

    if (type === 'pilot') {
      const devices   = await fetchAllDevices()
      const linkedIds = matchDevices(String(body.device ?? ''), devices)

      const fields: Record<string, unknown> = {
        'שם מלא':         body.name     || '',
        'גרים בתאילנד':   body.livesInThailand === true,
        'מכשיר':           body.device   || '',
        'פרטי מכשיר':     body.deviceOther || '',
        'מה מעניין אותך': body.curiosity || '',
        'אישור עדכונים':  body.consent  === true,
      }

      // Typed fields: only include when non-empty to avoid Airtable validation errors
      set(fields, 'טלפון',           body.phone,    { onlyIfTruthy: true })
      set(fields, 'אימייל',           body.email,    { onlyIfTruthy: true })
      set(fields, 'ממתי בתאילנד',    body.dateFrom, { onlyIfTruthy: true })
      set(fields, 'עד מתי בתאילנד',  body.dateTo,   { onlyIfTruthy: true })

      if (linkedIds.length > 0) {
        fields['מכשיר מקושר'] = linkedIds.map(id => ({ id }))
      }

      await atPost('Pilot Applicants', fields)

    } else if (type === 'update') {
      const fields: Record<string, unknown> = {
        'שם מלא':        body.name    || '',
        'אישור עדכונים': body.consent === true,
      }

      set(fields, 'אימייל', body.email, { onlyIfTruthy: true })
      set(fields, 'טלפון',  body.phone, { onlyIfTruthy: true })

      await atPost('Update Subscribers', fields)

    } else {
      return NextResponse.json({ ok: false, error: 'Unknown type' }, { status: 400 })
    }

    console.log('[submit:ok]', type, body.email ?? body.name)
    return NextResponse.json({ ok: true })

  } catch (err) {
    const errStr = String(err)

    // Log full submission data for manual recovery
    console.error('[submit:FAILED]', errStr)
    console.error('[submit:FAILED-body]', JSON.stringify(body))

    // Send email alert with full data
    await sendFailureAlert(type, body, errStr)

    return NextResponse.json({ ok: false, error: errStr }, { status: 500 })
  }
}
