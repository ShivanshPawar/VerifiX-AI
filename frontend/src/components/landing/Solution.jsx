import React from 'react'

const Solution = () => {
  return (
    <section id="solution" className="flex flex-col justify-center items-center gap-10 px-5 pt-20">
      {/* Solution heading */}
      <h2 className='text-lg glass px-4 py-1 rounded-lg font-black'>The Solution</h2>

      {/* Solution description */}
      <div className='w-full flex flex-col gap-5 items-center p-5 lg:p-10 lg:w-[80%] max-w-300 glass rounded-2xl'>
        <h2 className='text-2xl lg:text-4xl text-(--gray) text-center font-bold'>When digital images can no longer be trusted, verification becomes essential. VerifiX detects deepfake images, uncovers hidden manipulation, and helps users verify digital content before believing what they see.</h2>
        <h2 className='text-2xl lg:text-4xl text-(--gray) text-center font-bold'>Powered by advanced multi-model AI, VerifiX analyzes visual patterns, facial inconsistencies, and synthetic artifacts to accurately identify manipulated or artificially generated images.</h2>
      </div>

    </section>
  )
}

export default Solution