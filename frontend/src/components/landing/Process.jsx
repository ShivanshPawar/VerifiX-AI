import React from 'react'

const Process = () => {

  // Steps data for cards

  const steps = [
    {
      title: "Upload Image",
      desc: "Upload any image you want to verify. VerifiX securely processes the image and prepares it for deepfake detection analysis.",
    },
    {
      title: "AI Detection",
      desc: "Advanced multi-model AI scans the image to identify deepfake artifacts, synthetic patterns, and manipulation signals hidden within the visual data.",
    },
    {
      title: "Pattern Analysis",
      desc: "The system analyzes facial structures, textures, lighting patterns, and subtle inconsistencies often left behind by AI-generated or altered images.",
    },
    {
      title: "Verify Authenticity",
      desc: "Review the detection insights and confidently decide whether the image is authentic or potentially manipulated before trusting or sharing it.",
    },
  ];

  return (
    <section id="how-it-works" className='w-full flex flex-col justify-center items-center py-20 px-5 gap-10'>

      <h2 className='text-lg px-4 py-1 rounded-lg glass font-black'>Process</h2>

      <div className='w-full lg:w-[80%] max-w-300 rounded-2xl grid glass '>
        <div className='flex flex-col gap-5 items-center p-5'>
          {/* Process heading */}
          <h2 className='text-2xl lg:text-4xl font-bold'>Here at every step</h2>
          {/* Process description */}
          <p className='text-(--gray) text-center max-w-200'>VerifiX follows a structured AI-driven process to detect deepfake images. From upload to final verification, every step ensures accurate and reliable analysis.</p>
        </div>

        {/* Process cards */}
        <div className="p-5 w-full grid md:grid-cols-2 lg:grid-cols-2 gap-10">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col p-5 gap-3 rounded-xl duration-300 glass">
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