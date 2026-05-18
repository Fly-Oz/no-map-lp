import Header from '@/components/Header'
import Hero from '@/components/Hero'
import ValueBlock from '@/components/ValueBlock'
import WhyPilot from '@/components/WhyPilot'
import HowItWorks from '@/components/HowItWorks'
import CtaStrip from '@/components/CtaStrip'
import FounderStory from '@/components/FounderStory'
import Faq from '@/components/Faq'
import FormBlock from '@/components/FormBlock'
import Footer from '@/components/Footer'
import AnimationObserver from '@/components/AnimationObserver'

export default function Page() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <ValueBlock />
        <WhyPilot />
        <HowItWorks />
        <CtaStrip />
        <FounderStory />
        <Faq />
        <FormBlock />
      </main>
      <Footer />
      <AnimationObserver />
    </>
  )
}
