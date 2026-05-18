'use client'

import { useState } from 'react'

const features = [
  {
    icon: '🗺️',
    title: 'מפה אחת. הכל בפנים.',
    desc: 'כל המידע שקיים בגוגל - בשילוב המלצות אמיתיות של מטיילים ישראלים מהשטח. לא צריך לקפוץ בין אפליקציות. הכל במקום אחד.',
  },
  {
    icon: '🎯',
    title: 'בול לסגנון שלכם',
    desc: 'אוכל, חופים, חיי לילה או שופינג? סננו את המפה לפי איך שאתם אוהבים לטייל, ולא לפי "מה שכולם עושים".',
  },
  {
    icon: '🌟',
    title: 'המלצות בלי פילטרים',
    desc: 'עזבו אתכם מדירוגים של תיירים מכל העולם. קבלו ביקורות, טיפים ותובנות של ישראלים שכבר היו שם, מדברים בשפה שלכם ומבינים את הטעם שלכם.',
  },
  {
    icon: '⚡',
    title: 'מעודכן בזמן אמת',
    desc: 'אל תיתקעו מול דלת סגורה. מידע עדכני שכולל התראה על סגירה לרגל שיפוצים, המלצות עונתיות וכל מה שחם בדיוק עכשיו.',
  },
]

export default function ValueBlock() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section id="what" className="section value-block">
      <div className="container">
        <div className="value-inner-new">
          <div className="value-header text-center">
            <span className="tag">מה זה NoMap?</span>
            <h2>המצפן של הישראלים שמטיילים בעולם</h2>
            <p className="value-lead">
              NoMap נולדה כדי לעשות לכם סדר בטיול. בלי לקפוץ בין אפליקציות
              או ללכת לאיבוד בים של המלצות - כל מה שתצטרכו כדי למצוא את
              המקומות שמתאימים <em>לכם</em>, מחכה באפליקציה (חינמית!) אחת.
            </p>
          </div>

          <div className="value-accordion">
            {features.map((f, i) => (
              <div key={f.title} className={`value-acc-item${openIndex === i ? ' open' : ''}`}>
                <button
                  className="value-acc-btn"
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                >
                  <div className="value-acc-left">
                    <div className="value-icon">{f.icon}</div>
                    <span className="value-acc-title">{f.title}</span>
                  </div>
                  <span className={`value-acc-chevron${openIndex === i ? ' open' : ''}`}>+</span>
                </button>
                <div className="value-acc-body">
                  <div className="value-acc-body-inner">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
