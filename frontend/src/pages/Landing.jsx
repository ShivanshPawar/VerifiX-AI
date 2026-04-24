import Hero from '../components/landing/Hero';
import Navbar from './../components/layout/Navbar';
import Features from './../components/landing/Features';
import Trust from './../components/landing/Trust';
import CTA from './../components/landing/CTA';
import Footer from './../components/layout/Footer';
import Problem from './../components/landing/Problem';
import Process from '../components/landing/Process';
import Solution from '../components/landing/Solution';

const Landing = () => {
  return (
    <div className="relative bg-(--black) text-(--white) min-h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <Hero />

      {/* Problem Section */}
      <Problem />

      {/* Solution Section */}
      <Solution />

      {/* Features */}
      <Features />

      {/* How It Works Section */}
      <Process />

      {/* Trust Section */}
      <Trust />

      {/* CTA */}
      <CTA />

      {/* Footer */}
      <Footer />

    </div>
  )
}

export default Landing
