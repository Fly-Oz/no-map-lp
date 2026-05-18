const cards = [
  {
    icon: '🥇',
    title: 'תהיו הראשונים',
    desc: 'לנסות את NoMap לפני כולם ולהיות חלק מהפרק הראשון של המסע שלנו.',
  },
  {
    icon: '🤝',
    title: 'קבוצה סגורה',
    desc: 'תצטרפו לקבוצה של מטיילים ישראלים שנמצאים עכשיו בתאילנד ומחליפים טיפים והמלצות.',
  },
  {
    icon: '💡',
    title: 'תשפיעו על משהו גדול',
    desc: 'בזכות התובנות וההמלצות שלכם תעזרו בקרוב ממש למאות אלפי מטיילים.',
  },
]

export default function WhyPilot() {
  return (
    <section className="section why-pilot">
      <div className="container">
        <div className="text-center">
          <span className="tag">למה להצטרף לפיילוט?</span>
          <h2 style={{ marginBottom: 14 }}>מה ייצא לך מזה?</h2>
          <p className="why-intro">
            תהיו חלק מקבוצה סגורה ומגניבה של מטיילים שנמצאים איתכם בתאילנד
            ממש באותו הזמן ומגלים את המקומות הכי מיוחדים.
          </p>
        </div>
        <div className="why-grid">
          {cards.map((card) => (
            <div key={card.title} className="why-card">
              <div className="why-icon">{card.icon}</div>
              <div className="why-card-text">
                <h3>{card.title}</h3>
                <p>{card.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
