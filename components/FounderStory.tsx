'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

const founders = [
  { name: 'עוז רוט',      role: 'Co-Founder', photo: '/founder-oz.png',   photoAlt: '/founder-oz-alt.png'  },
  { name: 'שיר הורוביץ', role: 'Co-Founder', photo: '/founder-shir.png', photoAlt: '/founder-shir-alt.jpg' },
]

export default function FounderStory() {
  const gridRef = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  const [hovered, setHovered] = useState<number | null>(null)

  useEffect(() => {
    const el = gridRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { setInView(entry.isIntersecting) },
      { rootMargin: '-25% 0px -25% 0px', threshold: 0 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="about" className="section founder-block">
      <div className="container">
        <div className="founder-inner">
          <div className="founder-header text-center">
            <span className="tag">הסיפור שלנו</span>
            <h2>מי אנחנו ומה הסיפור של NoMap?</h2>
          </div>

          <div className="founder-text">
            <p>
              היי, אנחנו עוז ושיר. אנחנו אוהבים לטייל בעולם, ומאמינים
              שלתכנן טיול זה משהו שצריך להיות כיף וקליל - גם למטיילים מנוסים
              וגם למתחילים.
            </p>
            <p>
              במקום לחפש המלצות וטיפים בתוך מידע אינסופי מהאינטרנט, החלטנו
              ליצור מקום שבו כל המידע נמצא ומתעדכן, ושכל מטייל ומטיילת יוכלו
              לסנן לעצמם את ההמלצות לפי סגנון הטיול שלהם ומה שהם אוהבים -
              בין אם זו חופשת בטן גב, חוויות אותנטיות של תרמילאים או
              אטרקציות שמתאימות למשפחות עם ילדים.
            </p>
            <p>
              האפליקציה תהיה זמינה להורדה לגמרי בחינם, ויש לנו עוד המון
              רעיונות, תוכניות והפתעות בקנה. נשמח שתצטרפו לקהילה שלנו
              ותגלו את העולם בדרך שלכם.
            </p>
          </div>

          <div className="founders-grid" ref={gridRef}>
            {founders.map((f, i) => {
              const flipped = inView !== (hovered === i)
              return (
                <div
                  key={f.name}
                  className={`founder-card${flipped ? ' flipped' : ''}`}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <div className="founder-photo">
                    <div className={`founder-photo-inner${flipped ? ' flipped' : ''}`}>
                      <Image
                        src={f.photo}
                        alt={f.name}
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes="240px"
                        className="founder-photo-main"
                      />
                      <Image
                        src={f.photoAlt}
                        alt={f.name}
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes="240px"
                        className="founder-photo-hover"
                      />
                    </div>
                  </div>
                  <div className="founder-info">
                    <h3>{f.name}</h3>
                    <p>{f.role}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
