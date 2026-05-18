import Image from 'next/image'

export default function PhoneMockup() {
  return (
    <div className="phone-frame">
      <div className="phone-dynamic-island" />
      <div className="phone-screen">
        <Image
          src="/screenshot-1.png"
          alt="NoMap App — מפת צ׳יאנג מאי"
          fill
          style={{ objectFit: 'cover', objectPosition: 'top' }}
          priority
        />
      </div>
    </div>
  )
}
