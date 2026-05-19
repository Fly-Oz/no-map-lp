'use client'

import { useState, useEffect, useRef } from 'react'

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
  const [inViewSet, setInViewSet] = useState<Set<number>>(new Set())
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    if (!('IntersectionObserver' in window)) {
      setInViewSet(new Set(features.map((_, i) => i)))
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const idx = Number((entry.target as HTMLElement).dataset.idx)
            setInViewSet(prev => new Set([...prev, idx]))
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )
    itemRefs.current.forEach(el => { if (el) observer.observe(el) })
    return () => observer.disconnect()
  }, [])

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
              <div
                key={f.title}
                ref={el => { itemRefs.current[i] = el }}
                data-idx={i}
                className={['value-acc-item', openIndex === i ? 'open' : '', inViewSet.has(i) ? 'in-view' : ''].filter(Boolean).join(' ')}
              >
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
