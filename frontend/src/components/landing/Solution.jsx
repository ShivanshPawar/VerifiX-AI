import React from 'react'
import ModelBars from '../../assets/images/DashMockup.png'

const Solution = () => {
  return (
    <section id="solution" className="flex flex-col items-center py-10 sm:py-20 bg-linear-to-b from-(--black) via-(--white)/20 to-(--black)">

      {/* Solution content */}
      <div className='w-full flex flex-col gap-5 lg:gap-20 items-center lg:w-[80%] px-5 sm:px-10 lg:px-0 max-w-300'>
        <h2 className='text-center text-lg md:text-2xl lg:text-4xl text-(--gray) font-bold'><span className='text-(--white)'>When digital images can no longer be trusted,</span> verification becomes essential. VerifiX detects deepfake images, uncovers hidden manipulation, and helps users verify digital content before believing what they see.</h2>
        <div className='w-full'>
          <div className='w-full rounded-2xl overflow-hidden'>
            <img className='w-full' src={ModelBars} alt="Model Bars" />
          </div>
        </div>
        <h2 className='text-center text-lg md:text-2xl lg:text-4xl text-(--gray) font-bold'><span className='text-(--white)'>Powered by advanced multi-model AI,</span> VerifiX analyzes visual patterns, facial inconsistencies, and synthetic artifacts to accurately identify manipulated or artificially generated images.</h2>
      </div>

    </section>
  )
}

export default Solution