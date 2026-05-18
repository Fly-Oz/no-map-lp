import type { Metadata } from 'next'
import { Rubik } from 'next/font/google'
import './globals.css'

const rubik = Rubik({
  subsets: ['hebrew', 'latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-rubik',
})

export const metadata: Metadata = {
  title: 'NoMap – האפליקציה לישראלים שמטיילים בחו"ל',
  description:
    'פיילוט סגור ל-3 שבועות בתאילנד. המלצות אמיתיות, טיפים מהשטח, וחוויה שנבנית במיוחד סביב הצרכים של המטיילים הישראלים.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl" className={rubik.variable} suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
