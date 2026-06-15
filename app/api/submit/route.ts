import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const BASE_ID = process.env.AIRTABLE_BASE_ID!
const API_KEY = process.env.AIRTABLE_API_KEY!
const AT      = `https://api.airtable.com/v0/${BASE_ID}`

const AT_HEADERS = {
  Authorization: `Bearer ${API_KEY}`,
  'Content-Type': 'application/json',
}

const ADMINS = [
  { email: 'oz@flybiz.co.il' },
  { email: 'Shir.horov@gmail.com' },
]

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

async function fetchAllDevices(): Promise<Array<{ id: string; model: string }>> {
  const devices: Array<{ id: string; model: string }> = []
  let offset: string | undefined

  do {
    const url = new URL(`${AT}/${encodeURIComponent('Devices')}`)
    url.searchParams.set('fields[]', 'Device Model')
    if (offset) url.searchParams.set('offset', offset)

    const res = await fetch(url.toString(), { headers: AT_HEADERS })
    if (!res.ok) { console.warn('[devices] fetch failed', res.status); break }
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

function matchDevices(formOption: string, devices: Array<{ id: string; model: string }>): string[] {
  if (!formOption || formOption === 'אחר') return []

  const norm  = (s: string) => s.toLowerCase().trim()
  const parts = formOption.split(' / ').map(p => norm(p))

  return devices
    .filter(({ model }) => {
      const m = norm(model)
      return parts.some(part => {
        if (!part) return false
        if (m === part || m.endsWith(' ' + part)) return true
        if (m.startsWith(part) && (m.length === part.length || m[part.length] === ' ' || m[part.length] === '(')) return true
        if (/^\d/.test(part) && m.endsWith(' ' + part)) return true
        return false
      })
    })
    .map(d => d.id)
}

/* ─── Brevo email ────────────────────────────────────────────────────────── */

async function sendBrevo(subject: string, textContent: string): Promise<{ status: number; body: string }> {
  const key = process.env.BREVO_API_KEY?.trim()
  if (!key) return { status: 0, body: 'BREVO_API_KEY missing' }

  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: { 'api-key': key, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sender: { name: 'NoMap', email: 'oz@flybiz.co.il' },
      to:     ADMINS,
      subject,
      textContent,
    }),
  })
  const body = await res.text()
  return { status: res.status, body }
}

async function notifyAdmins(subject: string, lines: string[]) {
  const { status, body } = await sendBrevo(subject, lines.join('\n'))
  if (status >= 200 && status < 300) {
    console.log('[brevo] sent ok', status)
  } else {
    console.error('[brevo] FAILED', status, body)
  }
}

/* ─── Test endpoint (remove after Brevo is confirmed working) ───────────── */

export async function GET() {
  const rawKey = process.env.BREVO_API_KEY ?? ''
  const { status, body } = await sendBrevo(
    '✅ NoMap - בדיקת חיבור Brevo',
    'אם קיבלת את המייל הזה - Brevo עובד!'
  )
  return NextResponse.json({
    brevoStatus: status,
    brevoResponse: body,
    keyLength: rawKey.length,
    keyPrefix: rawKey.slice(0, 6),
    keySuffix: rawKey.slice(-4),
  })
}

/* ─── Route handler ─────────────────────────────────────────────────────── */

function set(obj: Record<string, unknown>, key: string, value: unknown, { onlyIfTruthy = false } = {}) {
  if (onlyIfTruthy && !value) return
  obj[key] = value
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown> = {}
  let type = 'unknown'

  try {
    body = await req.json()
    type = String(body.type ?? 'unknown')
    console.log('[submit:received]', JSON.stringify(body))

    if (type === 'pilot') {
      const devices   = await fetchAllDevices()
      const linkedIds = matchDevices(String(body.device ?? ''), devices)

      const fields: Record<string, unknown> = {
        'שם מלא':         body.name            || '',
        'גרים בתאילנד':   body.livesInThailand === true,
        'מכשיר':           body.device          || '',
        'פרטי מכשיר':     body.deviceOther     || '',
        'מה מעניין אותך': body.curiosity       || '',
        'אישור עדכונים':  body.consent         === true,
      }
      set(fields, 'טלפון',          body.phone,    { onlyIfTruthy: true })
      set(fields, 'אימייל',          body.email,    { onlyIfTruthy: true })
      set(fields, 'ממתי בתאילנד',   body.dateFrom, { onlyIfTruthy: true })
      set(fields, 'עד מתי בתאילנד', body.dateTo,   { onlyIfTruthy: true })
      if (linkedIds.length > 0) fields['מכשיר מקושר'] = linkedIds

      await atPost('Pilot Applicants', fields)

      await notifyAdmins(
        `✈️ NoMap - נרשם/ה לפיילוט: ${body.name}`,
        [
          `נרשמ/ה לפיילוט NoMap`,
          ``,
          `שם: ${body.name}`,
          `טלפון: ${body.phone || '-'}`,
          `אימייל: ${body.email || '-'}`,
          `מכשיר: ${body.device || '-'}`,
          `תאריכים: ${body.dateFrom || '-'} עד ${body.dateTo || '-'}`,
          `גר/ה בתאילנד: ${body.livesInThailand ? 'כן' : 'לא'}`,
          `מה מעניין: ${body.curiosity || '-'}`,
        ]
      )

    } else if (type === 'update') {
      const fields: Record<string, unknown> = {
        'שם מלא':        body.name    || '',
        'אישור עדכונים': body.consent === true,
      }
      set(fields, 'אימייל', body.email, { onlyIfTruthy: true })
      set(fields, 'טלפון',  body.phone, { onlyIfTruthy: true })

      await atPost('Update Subscribers', fields)

      await notifyAdmins(
        `🔔 NoMap - נרשם/ה לעדכונים: ${body.name}`,
        [
          `נרשמ/ה לקבלת עדכונים ב-NoMap`,
          ``,
          `שם: ${body.name}`,
          `אימייל: ${body.email || '-'}`,
          `טלפון: ${body.phone || '-'}`,
        ]
      )

    } else {
      return NextResponse.json({ ok: false, error: 'Unknown type' }, { status: 400 })
    }

    console.log('[submit:ok]', type, body.email ?? body.name)
    return NextResponse.json({ ok: true })

  } catch (err) {
    const errStr = String(err)
    console.error('[submit:FAILED]', errStr)
    console.error('[submit:FAILED-body]', JSON.stringify(body))

    await notifyAdmins(
      `⚠️ NoMap - הגשה נכשלה (${type})`,
      [
        `הגשת טופס נכשלה`,
        ``,
        `סוג: ${type}`,
        `שגיאה: ${errStr}`,
        ``,
        `נתונים (לשחזור ידני):`,
        JSON.stringify(body, null, 2),
      ]
    )

    return NextResponse.json({ ok: false, error: errStr }, { status: 500 })
  }
}
