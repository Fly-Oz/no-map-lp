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

  const WA_PILOT  = 'https://wa.me/?text=%D7%A0%D7%A8%D7%A9%D7%9E%D7%AA%D7%99%20%D7%9C%D7%A4%D7%99%D7%99%D7%9C%D7%95%D7%98%20%D7%9C%D7%90%D7%A4%D7%9C%D7%99%D7%A7%D7%A6%D7%99%D7%99%D7%AA%20%D7%94%D7%99%D7%A9%D7%A8%D7%90%D7%9C%D7%99%D7%9D%20%D7%A9%D7%9E%D7%98%D7%99%D7%99%D7%9C%D7%99%D7%9D%20%D7%91%D7%A2%D7%95%D7%9C%D7%9D!%20%D7%91%D7%95%D7%90%D7%95%20%D7%AA%D7%A8%D7%90%D7%95%20%F0%9F%91%87%0Ahttps%3A%2F%2Fnomap.flybiz.co.il'
  const WA_UPDATE = 'https://wa.me/?text=%D7%99%D7%A9%20%D7%A4%D7%94%20%D7%90%D7%A4%D7%9C%D7%99%D7%A7%D7%A6%D7%99%D7%99%D7%AA%20%D7%98%D7%99%D7%95%D7%9C%D7%99%D7%9D%20%D7%9E%D7%9E%D7%A9%20%D7%9E%D7%92%D7%A0%D7%99%D7%91%D7%94%20%D7%A9%D7%A9%D7%95%D7%95%D7%94%20%D7%9C%D7%9A%20%D7%9C%D7%91%D7%93%D7%95%D7%A7!%0Ahttps%3A%2F%2Fnomap.flybiz.co.il'
  const FB_URL    = 'https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fnomap.flybiz.co.il'

  function copyLink() {
    navigator.clipboard.writeText('https://nomap.flybiz.co.il').then(() => alert('הלינק הועתק! 📋'))
  }

  return (
    <section id="join" className="section form-block">
      <div className="container">
        <div className="form-header text-center">
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
                    <label htmlFor="p-name">שם מלא <span className="required-star">*</span></label>
                    <input ref={pName} id="p-name" type="text" placeholder="ישראל ישראלי" autoComplete="name" />
                  </div>
                  <div className="field">
                    <label htmlFor="p-phone">טלפון <span className="required-star">*</span></label>
                    <input ref={pPhone} id="p-phone" type="tel" placeholder="050-0000000" autoComplete="tel" />
                  </div>
                </div>
                <div className="form-row full">
                  <div className="field">
                    <label htmlFor="p-email">אימייל <span className="required-star">*</span></label>
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
                    <span>אני כל הזמן בתאילנד! אפשר לומר שגר/ה פה 😎</span>
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
                      <label htmlFor="p-device-other">פרטו את המכשיר</label>
                      <input ref={pDeviceOther} id="p-device-other" type="text" placeholder="למשל: Oppo Reno 10 Pro" />
                    </div>
                  </div>
                )}
                <div className="form-row full">
                  <div className="field">
                    <label htmlFor="p-curious">מה מעניין אותך ב-NoMap?</label>
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
                    <label htmlFor="u-name">שם מלא <span className="required-star">*</span></label>
                    <input ref={uName} id="u-name" type="text" placeholder="ישראל ישראלי" autoComplete="name" />
                  </div>
                  <div className="field">
                    <label htmlFor="u-email">אימייל <span className="required-star">*</span></label>
                    <input ref={uEmail} id="u-email" type="email" placeholder="you@email.com" autoComplete="email" />
                  </div>
                </div>
                <div className="form-row full">
                  <div className="field">
                    <label htmlFor="u-phone">טלפון</label>
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
                  <div className="form-meta-item">😊 לא באנו לחפור. נשלח רק עדכונים רלוונטיים, בהבטחה.</div>
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
                <span>יש לכם חברים שטסים לתאילנד? שתפו אותם 👇</span>
                <div className="share-buttons">
                  <a href={WA_PILOT} target="_blank" rel="noopener noreferrer" className="share-btn share-wa">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    וואטסאפ
                  </a>
                  <a href={FB_URL} target="_blank" rel="noopener noreferrer" className="share-btn share-fb">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                    פייסבוק
                  </a>
                  <button onClick={copyLink} className="share-btn share-copy">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
                    העתקת לינק
                  </button>
                </div>
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
                <span>מכירים מישהו שיאהב את NoMap? שתפו אותם 👇</span>
                <div className="share-buttons">
                  <a href={WA_UPDATE} target="_blank" rel="noopener noreferrer" className="share-btn share-wa">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    וואטסאפ
                  </a>
                  <a href={FB_URL} target="_blank" rel="noopener noreferrer" className="share-btn share-fb">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                    פייסבוק
                  </a>
                  <button onClick={copyLink} className="share-btn share-copy">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
                    העתקת לינק
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
