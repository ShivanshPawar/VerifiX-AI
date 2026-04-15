import { Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section id='hero' className='relative  w-full pt-25'>
      <div className='w-full flex flex-col items-center pt-10 px-4 md:px-10 lg:px-40'>

        {/* Tagline */}
        <div className='w-60 py-2 flex justify-center items-center backdrop-blur-2xl bg-linear-to-r from-(--primary)/60 to-(--secondary)/60 rounded-full border border-(--primary/80 gap-2 text-sm'>
          <Sparkles className='w-4 h-4 shrink-0' />
          <h1>AI-Powered Verification</h1>
        </div>

        {/* Main Heading */}
        <h1 className='mt-6 sm:mt-8 lg:mt-10 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-center leading tracking-tight text-(--white)'>
          <span className='block'>Deepfakes Are Rising</span> <span className='block'>Verification Matters</span>
        </h1>

        {/* Subheading */}
        <p className='mt-4 sm:mt-5 text-md sm:text-base lg:mt-10 lg:text-xl text-center text-(--gray) px-2 sm:px-5 max-w-xl lg:max-w-none leading-tight'>
          <span className='md:block lg:block'>VerifiX is a web platform detecting deepfake images using multi-model AI, </span>
          <span className='md:block lg:block'>examining visual inconsistencies and helping users verify authenticity </span>
          <span className='md:block lg:block'>before trusting or sharing digital media.</span>
        </p>

        {/* Call-to-Action Buttons */}
        <div className='mt-6 p-2 rounded-xl glass sm:mt-8 lg:mt-10 flex justify-between items-center lg:justify-start'>
          <Link to="/signup" className='bg-linear-to-t from-(--primary)/80 to-(--secondary)/80 text-(--white) py-2 px-4 rounded-lg font-semibold text-sm sm:text-base hover:bg-(--primary) transition-all'>
            Get Started
          </Link>
          <Link to="/scan" className='py-2 px-4 rounded-xl font-semibold text-sm text-(--gray) hover:text-(--white) sm:text-base'>
            Test-Scan
          </Link>
        </div>

      </div>
    </section>
  )
}

export default Hero
