import Image from 'next/image'

export default function PhoneMockup() {
  return (
    <div className="phone-frame">
      <div className="phone-dynamic-island" />
      <div className="phone-screen">
        <Image
          src="/screenshot-1.png"
          alt="NoMap App - מפת צ׳יאנג מאי"
          fill
          style={{ objectFit: 'cover', objectPosition: 'top' }}
          priority
          quality={100}
          sizes="(min-width: 1060px) 258px, (min-width: 820px) 240px, 220px"
        />
      </div>
    </div>
  )
}
