const cards = [
  {
    emoji: '✈️',
    title: 'טסים לתאילנד 🇹🇭 בקרוב',
    desc: 'ישראלים שמתכננים להיות בתאילנד בשבועות הקרובים ורוצים חוויה מיוחדת.',
  },
  {
    emoji: '🔍',
    title: 'סקרנים ופתוחים לחדש',
    desc: 'מטיילות ומטיילים שאוהבים לנסות דברים חדשים ולגלות לפני כולם.',
  },
  {
    emoji: '💬',
    title: 'אוהבים לשתף',
    desc: 'אנשים שנהנים לשתף המלצות, תובנות וחוויות עם אחרים.',
  },
]

export default function WhoIsItFor() {
  return (
    <section className="section who-block">
      <div className="container">
        <div className="text-center">
          <span className="tag">קהל היעד</span>
          <h2>למי זה מתאים עכשיו?</h2>
        </div>
        <div className="who-grid">
          {cards.map((card) => (
            <div key={card.title} className="who-card">
              <div className="who-emoji">{card.emoji}</div>
              <h3>{card.title}</h3>
              <p>{card.desc}</p>
            </div>
          ))}
        </div>
        <p className="who-also">
          גם אם אתם לא טסים עכשיו — אפשר להירשם כדי לקבל עדכון כשהאפליקציה
          תהיה זמינה להורדה.{' '}
          <a href="#form">לרישום לעדכון ←</a>
        </p>
      </div>
    </section>
  )
}
