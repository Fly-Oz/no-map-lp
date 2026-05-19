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

/**
 * Maps a form option string (e.g. "iPhone 16 Pro / 16 Pro Max") to
 * one or more Airtable Devices record IDs.
 *
 * Matching rules (all case-insensitive):
 *  1. model ends with " <part>"  →  "Samsung Galaxy S25" ←← "Galaxy S25"
 *  2. model starts with "<part>" (+ space or "(")  →  "Nothing Phone (2a)" ←← "Nothing Phone"
 *  3. <part> starts with a digit AND model ends with " <part>"
 *     →  "Apple iPhone 16 Pro Max" ←← "16 Pro Max"
 *
 * Rule 1 catches both exact-name matches and brand-prefix differences.
 * Rule 2 catches brand-only selectors ("OnePlus", "Motorola") and
 *         model-line selectors ("Nothing Phone").
 * Rule 3 catches grouped options with a shared prefix ("iPhone 16 Pro / 16 Pro Max").
 */
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
        // Rule 1: model ends with " <part>" or equals <part>
        if (m === part || m.endsWith(' ' + part)) return true
        // Rule 2: model starts with "<part>" followed by space or "("
        if (
          m.startsWith(part) &&
          (m.length === part.length || m[part.length] === ' ' || m[part.length] === '(')
        )
          return true
        // Rule 3: digit-prefixed part is a suffix (for combined form options)
        if (/^\d/.test(part) && m.endsWith(' ' + part)) return true
        return false
      })
    })
    .map(d => d.id)
}

/* ─── Route handler ─────────────────────────────────────────────────────── */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { type } = body

    if (type === 'pilot') {
      // Resolve device → linked Airtable records
      const devices   = await fetchAllDevices()
      const linkedIds = matchDevices(body.device || '', devices)

      const fields: Record<string, unknown> = {
        'שם מלא':          body.name             || '',
        'אימייל':           body.email            || null,
        'ממתי בתאילנד':    body.dateFrom          || null,
        'עד מתי בתאילנד': body.dateTo            || null,
        'גרים בתאילנד':    body.livesInThailand  === true,
        'מכשיר':            body.device           || '',
        'פרטי מכשיר':      body.deviceOther       || '',
        'מה מעניין אותך':  body.curiosity         || '',
        'אישור עדכונים':   body.consent          === true,
      }
      // Phone: only include if non-empty (Airtable phoneNumber field rejects empty string)
      if (body.phone) fields['טלפון'] = body.phone
      // Log for backup (visible in Vercel Function logs)
      console.log('[submit:pilot]', JSON.stringify({ name: body.name, email: body.email, phone: body.phone, device: body.device }))
      // Only include linked field when we found matching records
      if (linkedIds.length > 0) {
        fields['מכשיר מקושר'] = linkedIds.map(id => ({ id }))
      }

      await atPost('Pilot Applicants', fields)

    } else if (type === 'update') {
      const updateFields: Record<string, unknown> = {
        'שם מלא':        body.name    || '',
        'אימייל':         body.email   || null,
        'אישור עדכונים': body.consent === true,
      }
      if (body.phone) updateFields['טלפון'] = body.phone
      console.log('[submit:update]', JSON.stringify({ name: body.name, email: body.email }))
      await atPost('Update Subscribers', updateFields)

    } else {
      return NextResponse.json({ ok: false, error: 'Unknown type' }, { status: 400 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[submit]', err)
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}
