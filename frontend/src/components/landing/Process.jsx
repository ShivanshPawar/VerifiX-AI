import React from 'react'

const Process = () => {

  // Steps data for cards

  const steps = [
    {
      title: "Upload & Secure",
      desc: "Drop in any image you want to check. We instantly protect your data with secure encryption before the analysis begins.",
    },
    {
      title: "Deep Scan",
      desc: "Our multi-layered AI hunts for hidden traces of AI generation, face swaps, and digital editing that the human eye misses.",
    },
    {
      title: "Detail Analysis",
      desc: "We examine the DNA of the image—checking lighting, textures, and shadows for inconsistencies that signal a fake.",
    },
    {
      title: "Get the Truth",
      desc: "Receive a simple Truth Score and a clear report. Now you can share, post, or use the image knowing exactly what’s real.",
    },
  ];

  return (
    <section id="how-it-works" className='w-full flex flex-col justify-center items-center py-20 gap-10'>

      {/* <h2 className='text-lg px-4 py-1 rounded-lg glass font-black'>Process</h2> */}

      <div className='w-full lg:w-[80%] max-w-300 rounded-2xl grid gap-10 px-5 sm:px-10 lg:px-0'>
        <div className='flex flex-col gap-5 items-center'>
          {/* Process heading */}
          <h2 className='text-2xl lg:text-4xl font-bold'>How VerifiX Works</h2>
          {/* Process description */}
          <p className='text-(--gray) text-center max-w-200'>Verify any image in four simple steps. Our AI does the heavy lifting so you can browse with confidence.</p>
        </div>

        {/* Process cards */}
        <div className="w-full grid md:grid-cols-2 lg:grid-cols-2 gap-10">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col p-5 gap-3 rounded-2xl duration-300 glass">
              {/* Process card title */}
              <div className="flex justify-between items-center text-2xl font-semibold">
                <h4>{step.title}</h4>
                <h4>0{index + 1}</h4>
              </div>
              <hr className="border-(--gray)/50" />
              {/* Process card description */}
              <p className="text-sm opacity-80">{step.desc}</p>
              <hr className="border-(--gray)/50" />
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

export default Process