'use client'

import { useRef, useState } from 'react'

type Intent = 'pilot' | 'update' | null
type SuccessState = 'pilot' | 'update' | null

export default function FormBlock() {
  const [intent, setIntent]               = useState<Intent>(null)
  const [success, setSuccess]             = useState<SuccessState>(null)
  const [showOtherDevice, setShowOtherDevice] = useState(false)
  const [livesInThailand, setLivesInThailand] = useState(false)
  const [pilotConsent, setPilotConsent]   = useState(false)
  const [updateConsent, setUpdateConsent] = useState(false)
  const [loading, setLoading]             = useState(false)
  const [error, setError]                 = useState<string | null>(null)

  // Pilot form refs
  const pName      = useRef<HTMLInputElement>(null)
  const pPhone     = useRef<HTMLInputElement>(null)
  const pEmail     = useRef<HTMLInputElement>(null)
  const pFrom      = useRef<HTMLInputElement>(null)
  const pTo        = useRef<HTMLInputElement>(null)
  const pDevice    = useRef<HTMLSelectElement>(null)
  const pDeviceOther = useRef<HTMLInputElement>(null)
  const pCuriosity = useRef<HTMLTextAreaElement>(null)

  // Update form refs
  const uName  = useRef<HTMLInputElement>(null)
  const uEmail = useRef<HTMLInputElement>(null)
  const uPhone = useRef<HTMLInputElement>(null)

  function handleDeviceChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const val = e.target.value
    setShowOtherDevice(
      val === 'אחר' ||
      val === 'Oppo / Realme / Vivo' ||
      val.endsWith('אחר')
    )
  }

  async function handleSubmit(type: 'pilot' | 'update') {
    setLoading(true)
    setError(null)

    const body =
      type === 'pilot'
        ? {
            type,
            name:             pName.current?.value        || '',
            phone:            pPhone.current?.value       || '',
            email:            pEmail.current?.value       || '',
            dateFrom:         livesInThailand ? null : (pFrom.current?.value || null),
            dateTo:           livesInThailand ? null : (pTo.current?.value   || null),
            livesInThailand,
            device:           pDevice.current?.value      || '',
            deviceOther:      pDeviceOther.current?.value || '',
            curiosity:        pCuriosity.current?.value   || '',
            consent:          pilotConsent,
          }
        : {
            type,
            name:    uName.current?.value  || '',
            email:   uEmail.current?.value || '',
            phone:   uPhone.current?.value || '',
            consent: updateConsent,
          }

    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (data.ok) {
        setSuccess(type)
      } else {
        setError('משהו השתבש. נסו שוב.')
      }
    } catch {
      setError('בעיית חיבור. נסו שוב.')
    } finally {
      setLoading(false)
    }
  }

  function handleShare() {
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({ title: 'NoMap - פיילוט תאילנד', url: window.location.href })
    } else {
      navigator.clipboard.writeText(window.location.href).then(() => alert('הלינק הועתק!'))
    }
  }

  return (
    <section id="join" className="section form-block">
      <div className="container">
        <div className="form-header text-center">
          <span className="tag">הצטרפות</span>
          <h2>איך מצטרפים?</h2>
        </div>

        <div className="form-card">
          {!success && (
            <>
              {/* Two big intent buttons */}
              <div className="intent-options">
                <div
                  className={`intent-option${intent === 'pilot' ? ' selected' : ''}`}
                  onClick={() => setIntent('pilot')}
                >
                  <span className="intent-icon">✈️</span>
                  <div className="intent-text">
                    <strong>אני אהיה בתאילנד בקרוב ורוצה להצטרף לפיילוט</strong>
                  </div>
                </div>
                <div
                  className={`intent-option${intent === 'update' ? ' selected' : ''}`}
                  onClick={() => setIntent('update')}
                >
                  <span className="intent-icon">🔔</span>
                  <div className="intent-text">
                    <strong>אני רוצה לקבל עדכון כשהאפליקציה תעלה לאוויר</strong>
                  </div>
                </div>
              </div>

              {/* ── PILOT FORM ── */}
              <div className={`form-fields${intent === 'pilot' ? ' visible' : ''}`}>
                <div className="form-divider" />
                <div className="form-row">
                  <div className="field">
                    <label htmlFor="p-name">שם מלא</label>
                    <input ref={pName} id="p-name" type="text" placeholder="ישראל ישראלי" autoComplete="name" />
                  </div>
                  <div className="field">
                    <label htmlFor="p-phone">טלפון</label>
                    <input ref={pPhone} id="p-phone" type="tel" placeholder="050-0000000" autoComplete="tel" />
                  </div>
                </div>
                <div className="form-row full">
                  <div className="field">
                    <label htmlFor="p-email">אימייל</label>
                    <input ref={pEmail} id="p-email" type="email" placeholder="you@email.com" autoComplete="email" />
                  </div>
                </div>

                {/* Date fields + "גרים בתאילנד" */}
                <div className={`form-row${livesInThailand ? ' dates-hidden' : ''}`}>
                  <div className="field">
                    <label htmlFor="p-from">ממתי תהיו בתאילנד?</label>
                    <input ref={pFrom} id="p-from" type="date" />
                  </div>
                  <div className="field">
                    <label htmlFor="p-to">עד מתי?</label>
                    <input ref={pTo} id="p-to" type="date" />
                  </div>
                </div>
                <div className="form-row full">
                  <label className="checkbox-row">
                    <input
                      type="checkbox"
                      checked={livesInThailand}
                      onChange={e => setLivesInThailand(e.target.checked)}
                    />
                    <span>גר/ה בתאילנד</span>
                  </label>
                </div>

                {/* Device */}
                <div className="form-row full">
                  <div className="field">
                    <label htmlFor="p-device">איזה טלפון יש לך?</label>
                    <p className="field-hint">📱 פרטי המכשיר יעזרו לנו ללמוד על התאמת האפליקציה למגוון מכשירים.</p>
                    <select ref={pDevice} id="p-device" onChange={handleDeviceChange} defaultValue="">
                      <option value="" disabled>בחרו מכשיר</option>
                      <optgroup label="Apple">
                        <option>iPhone 16 / 16 Plus</option>
                        <option>iPhone 16 Pro / 16 Pro Max</option>
                        <option>iPhone 15 / 15 Plus</option>
                        <option>iPhone 15 Pro / 15 Pro Max</option>
                        <option>iPhone 14 / 14 Plus</option>
                        <option>iPhone 14 Pro / 14 Pro Max</option>
                        <option>iPhone 13 / 13 Pro</option>
                        <option>iPhone 12</option>
                        <option>iPhone SE</option>
                        <option>iPhone אחר</option>
                      </optgroup>
                      <optgroup label="Samsung">
                        <option>Galaxy S25 / S25+</option>
                        <option>Galaxy S25 FE</option>
                        <option>Galaxy S25 Ultra</option>
                        <option>Galaxy S24 / S24+</option>
                        <option>Galaxy S24 Ultra</option>
                        <option>Galaxy S23 / S23+</option>
                        <option>Galaxy Z Flip 6</option>
                        <option>Galaxy A56</option>
                        <option>Galaxy A55</option>
                        <option>Galaxy A35 / A26</option>
                        <option>Galaxy אחר</option>
                      </optgroup>
                      <optgroup label="Xiaomi / Redmi / POCO">
                        <option>Xiaomi 15 / 15 Pro</option>
                        <option>Redmi Note 15</option>
                        <option>Redmi Note 14 / 14 Pro</option>
                        <option>Redmi Note 13 / 13 Pro</option>
                        <option>POCO X7 / X7 Pro</option>
                        <option>POCO F6</option>
                        <option>Xiaomi / Redmi / POCO אחר</option>
                      </optgroup>
                      <optgroup label="Google Pixel">
                        <option>Pixel 10 / 10 Pro</option>
                        <option>Pixel 9 / 9 Pro</option>
                        <option>Pixel 8 / 8 Pro</option>
                        <option>Pixel אחר</option>
                      </optgroup>
                      <optgroup label="אחר">
                        <option>OnePlus</option>
                        <option>Nothing Phone</option>
                        <option>Motorola</option>
                        <option>Oppo / Realme / Vivo</option>
                        <option>אחר</option>
                      </optgroup>
                    </select>
                  </div>
                </div>
                {showOtherDevice && (
                  <div className="form-row full">
                    <div className="field">
                      <label htmlFor="p-device-other">
                        פרטו את המכשיר <span className="optional">(אופציונלי)</span>
                      </label>
                      <input ref={pDeviceOther} id="p-device-other" type="text" placeholder="למשל: Oppo Reno 10 Pro" />
                    </div>
                  </div>
                )}
                <div className="form-row full">
                  <div className="field">
                    <label htmlFor="p-curious">
                      מה מעניין אותך ב-NoMap?{' '}
                      <span className="optional">(אופציונלי)</span>
                    </label>
                    <textarea ref={pCuriosity} id="p-curious" placeholder="ספרו לנו בחופשיות..." />
                  </div>
                </div>

                {/* Consent */}
                <div className="form-row full">
                  <label className="checkbox-row">
                    <input
                      type="checkbox"
                      checked={pilotConsent}
                      onChange={e => setPilotConsent(e.target.checked)}
                    />
                    <span>מאשר/ת קבלת עדכונים ויודע/ת שאוכל לבטל מתי שארצה</span>
                  </label>
                </div>

                {error && <p className="form-error">{error}</p>}

                <div className="form-submit">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => handleSubmit('pilot')}
                    disabled={!pilotConsent || loading}
                  >
                    {loading ? 'שולח...' : 'להגשת מועמדות לפיילוט ✈️'}
                  </button>
                </div>
                <div className="form-meta">
                  <div className="form-meta-item">🔒 הפיילוט סגור ומספר המקומות מוגבל.</div>
                  <div className="form-meta-item">📞 ניצור קשר רק אם תהיה התאמה להשתתפות בפיילוט.</div>
                </div>
              </div>

              {/* ── UPDATE FORM ── */}
              <div className={`form-fields${intent === 'update' ? ' visible' : ''}`}>
                <div className="form-divider" />
                <div className="form-row">
                  <div className="field">
                    <label htmlFor="u-name">שם מלא</label>
                    <input ref={uName} id="u-name" type="text" placeholder="ישראל ישראלי" autoComplete="name" />
                  </div>
                  <div className="field">
                    <label htmlFor="u-email">אימייל</label>
                    <input ref={uEmail} id="u-email" type="email" placeholder="you@email.com" autoComplete="email" />
                  </div>
                </div>
                <div className="form-row full">
                  <div className="field">
                    <label htmlFor="u-phone">
                      טלפון <span className="optional">(אופציונלי)</span>
                    </label>
                    <input ref={uPhone} id="u-phone" type="tel" placeholder="050-0000000" autoComplete="tel" />
                  </div>
                </div>

                {/* Consent */}
                <div className="form-row full">
                  <label className="checkbox-row">
                    <input
                      type="checkbox"
                      checked={updateConsent}
                      onChange={e => setUpdateConsent(e.target.checked)}
                    />
                    <span>מאשר/ת קבלת עדכונים ויודע/ת שאוכל לבטל מתי שארצה</span>
                  </label>
                </div>

                {error && <p className="form-error">{error}</p>}

                <div className="form-submit">
                  <button
                    type="button"
                    className="btn btn-secondary btn-full"
                    style={{ fontSize: '1rem', padding: '14px' }}
                    onClick={() => handleSubmit('update')}
                    disabled={!updateConsent || loading}
                  >
                    {loading ? 'שולח...' : 'לקבלת עדכון בהשקה 🔔'}
                  </button>
                </div>
                <div className="form-meta">
                  <div className="form-meta-item">✉️ נשלח עדכון ברגע ש-NoMap תעלה לאוויר - לא יותר.</div>
                </div>
              </div>
            </>
          )}

          {/* ── SUCCESS: PILOT ── */}
          {success === 'pilot' && (
            <div className="form-success visible">
              <div className="success-icon">🎉</div>
              <h3>איזה כיף - קיבלנו את הפרטים שלכם!</h3>
              <p>אם תהיה התאמה לפיילוט הקרוב בתאילנד, ניצור איתכם קשר בהקדם.</p>
              <div className="share-cta">
                <span>יש לכם חברים שטסים לתאילנד?</span>
                <button className="btn btn-secondary btn-sm" onClick={handleShare}>
                  שתפו אותם 🔗
                </button>
              </div>
            </div>
          )}

          {/* ── SUCCESS: UPDATE ── */}
          {success === 'update' && (
            <div className="form-success visible">
              <div className="success-icon">✅</div>
              <h3>נרשמתם בהצלחה!</h3>
              <p>נעדכן אתכם כש-NoMap תעלה לאוויר.</p>
              <div className="share-cta">
                <span>יש לכם חברים שטסים לתאילנד?</span>
                <button className="btn btn-secondary btn-sm" onClick={handleShare}>
                  שתפו אותם 🔗
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
