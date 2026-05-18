import PhoneMockup from './PhoneMockup'

export default function Hero() {
  return (
    <section className="hero-section">
      <div className="container">
        <div className="hero-inner">
          <div className="hero-content">
            <div className="hero-flag">
              <span className="dot" />
              יעד ראשון: תאילנד 🌍
            </div>

            <h1>האפליקציה לישראלים שמטיילים בחו&quot;ל</h1>

            <p className="hero-subtitle">בואו לנסות אותה ראשונים!</p>

            <p className="hero-desc">
              אנחנו בונים את המצפן של הישראלים שמטיילים בעולם. עוד מעט נצא
              לפיילוט לשלושה שבועות שמתמקד בתאילנד. אנחנו מחפשים מטיילים
              ומטיילות שרוצים, ביחד איתנו, להפיק את המקסימום מהטיול שלהם.
            </p>

            <div className="hero-cta-group">
              <a href="#join" className="btn btn-primary">
                בתאילנד בקרוב? להצטרפות לפיילוט 🌍
              </a>
              <a href="#join" className="btn btn-secondary">
                עדיין לא בתאילנד? קבלו עדכון בהשקה
              </a>
            </div>

            <div className="hero-meta">
              <div className="hero-meta-item">
                <svg className="hero-meta-icon" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
                </svg>
                פיילוט סגור ומוגבל בזמן - 3 שבועות בלבד.
              </div>
              <div className="hero-meta-item">
                <svg className="hero-meta-icon" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                מיועד למטיילים ומטיילות שיהיו בתאילנד בשבועות הקרובים.
              </div>
              <div className="hero-meta-item">
                <svg className="hero-meta-icon" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
                בהמשך נתרחב למקומות נוספים בעולם 🌍
              </div>
              <div className="hero-meta-item">
                <svg className="hero-meta-icon" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                אפשר להירשם כדי לקבל עדכון לקראת ההשקה - מבטיחים לא להספים.
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <PhoneMockup />
          </div>
        </div>
      </div>
    </section>
  )
}
