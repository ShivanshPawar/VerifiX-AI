
import Hero from '../components/landing/Hero';
import Navbar from './../components/layout/Navbar';
import Features from './../components/landing/Features';
import Trust from './../components/landing/Trust';
import CTA from './../components/landing/CTA';
import Footer from './../components/layout/Footer';
import Problem from './../components/landing/Problem';
import Process from '../components/landing/Process';
import Solution from '../components/landing/Solution';
import shape1 from '../assets/svgs/hero-shape-1.svg'
import shape2 from '../assets/svgs/hero-shape-2.svg'
import shape3 from '../assets/svgs/hero-star-shape-1.svg'

const Landing = () => {
  return (
    <div className="relative bg-(--black) text-(--white) min-h-screen">
      {/* <img className='absolute top-30 right-0' src={shape1} alt="" />
      <img className='absolute top-30 left-0' src={shape2} alt="" />
      <img className='absolute bottom-30 right-0' src={shape3} alt="" />
      <div className="absolute inset-0 z-20 bg-(primary-900)/90 backdrop-blur-xl" > */}

        {/* Navbar */}
        <Navbar /> 

        {/* Hero Section */}
        <Hero />

        {/* Problem Section */}
        <Problem />

        {/* Solution Section */}
        <Solution />

        {/* How It Works Section */}
        <Process />

        {/* Features */}
        <Features />

        {/* CTA */}
        <CTA />

        {/* Footer */}
        <Footer />

      </div>
    // </div>
  )
}

export default Landing