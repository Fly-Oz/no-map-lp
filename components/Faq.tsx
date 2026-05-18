'use client'

import { useState } from 'react'

const faqs = [
  {
    q: 'האם האפליקציה בתשלום?',
    a: 'האפליקציה תהיה זמינה להורדה ולשימוש לגמרי בחינם! אנחנו מאמינים שלכל אחד ואחת מגיע לטייל בכיף ולעוף על העולם ✈️',
  },
  {
    q: 'בשביל מה הפיילוט?',
    a: 'אנחנו רוצים לבדוק את NoMap עם קבוצה ממוקדת של משתמשים ומשתמשות, כדי שנוכל ללמוד מכם ולשפר את החוויה לפני שנפתח את האפליקציה לכולם.',
  },
  {
    q: 'מה זה אומר "קבוצה סגורה" בפיילוט?',
    a: 'מי שישתתפו בפיילוט יצטרפו לקבוצה סגורה שבה יש מטיילים ומטיילות שנמצאים בתאילנד ממש באותו הזמן. בקבוצה תוכלו לשתף במקומות שווים ובהמלצות, וכמובן בחוויית השימוש באפליקציה - גם כדי שנוכל לתקן תקלות וגם כדי שנוכל לשפר ולשדרג את השימוש כדי שיוכל לתת לכם מענה מדויק ומקיף לטיול.',
  },
  {
    q: 'כמה זמן הפיילוט יימשך?',
    a: 'הפיילוט יימשך לאורך 3 שבועות.',
  },
  {
    q: 'האם חייבים להיות בתאילנד כדי להירשם?',
    a: 'לא. אם לא תהיו בתאילנד בקרוב, עדיין אפשר להירשם כדי לקבל עדכון כשהאפליקציה תושק - ולא לפספס את ההשקה.',
  },
  {
    q: 'מה יקרה אחרי ההרשמה?',
    a: 'נעבור על הפרטים, ואם תהיה התאמה לפיילוט - ניצור איתך קשר. אם נרשמת לעדכון, נשלח לך עדכון ברגע שהאפליקציה תהיה זמינה להורדה בחנות האפליקציות.',
  },
]

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="section faq-block">
      <div className="container">
        <div className="text-center">
          <span className="tag">רוצה לדעת יותר?</span>
          <h2>שאלות נפוצות</h2>
        </div>
        <div className="faq-list">
          {faqs.map((faq, i) => (
            <div key={i} className="faq-item">
              <button
                className="faq-q"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                {faq.q}
                <span className={`faq-icon${openIndex === i ? ' open' : ''}`}>+</span>
              </button>
              <div className={`faq-a${openIndex === i ? ' open' : ''}`}>
                <div className="faq-a-inner">{faq.a}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
