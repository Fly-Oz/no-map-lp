const steps = [
  {
    num: '1',
    title: 'נרשמים',
    desc: 'באמצעות הטופס שכאן למטה',
  },
  {
    num: '2',
    title: 'ניצור קשר',
    desc: 'אם תהיה התאמה — נחזור אליכם',
  },
  {
    num: '3',
    title: 'מצטרפים לפיילוט',
    desc: 'מקבלים גישה לאפליקציה ולקבוצה הסגורה',
  },
  {
    num: '4',
    title: 'מטיילים ומשתפים',
    desc: 'מטיילים, משתמשים ומשתפים תובנות',
  },
  {
    num: '5',
    title: 'משפיעים',
    desc: 'התובנות וההערות שלכם יעזרו לנו לשפר את האפליקציה כדי שתוכל לעזור לכם ולעוד רבים',
  },
]

export default function HowItWorks() {
  return (
    <section id="how" className="section how-block">
      <div className="container">
        <div className="text-center">
          <span className="tag">תהליך</span>
          <h2>איך זה עובד?</h2>
        </div>
        <div className="how-steps">
          {steps.map((step) => (
            <div key={step.num} className="how-step">
              <div className="how-step-num">{step.num}</div>
              <div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
