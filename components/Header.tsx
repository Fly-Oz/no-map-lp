export default function Header() {
  return (
    <header className="site-header">
      <div className="container">
        <div className="header-inner">
          <a className="logo" href="#">
            <span>No</span>Map
          </a>
          <nav className="header-nav">
            <a href="#what">מה זה NoMap?</a>
            <a href="#how">איך זה עובד?</a>
            <a href="#about">נעים להכיר</a>
          </nav>
          <div className="header-cta">
            <a href="#join" className="btn btn-secondary btn-sm">
              לקבלת עדכון על ההשקה
            </a>
            <a href="#join" className="btn btn-primary btn-sm">
              בתאילנד בקרוב? הצטרפו לפיילוט!
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}
