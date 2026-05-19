import Image from 'next/image'

const founders = [
  { name: 'עוז רוט',      role: 'Co-Founder', photo: '/founder-oz.png'  },
  { name: 'שיר הורוביץ', role: 'Co-Founder', photo: '/founder-shir.png' },
]

export default function FounderStory() {
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

          <div className="founders-grid">
            {founders.map((f) => (
              <div key={f.name} className="founder-card">
                <div className="founder-photo">
                  <Image
                    src={f.photo}
                    alt={f.name}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="88px"
                  />
                </div>
                <div className="founder-info">
                  <h3>{f.name}</h3>
                  <p>{f.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
