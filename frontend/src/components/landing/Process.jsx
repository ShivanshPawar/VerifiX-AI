import React from 'react'
import { BookCheck, BrainCircuit, ImagePlay, ImageUp, Microscope, ScanFace, } from 'lucide-react'

const Features = () => {

  const featuresData = [
    {
      icon: <ImageUp />,
      title: "Upload & Protect",
      description:
        "Upload any image you want to verify. Your data is instantly secured with end-to-end encryption before analysis begins.",
    },
    {
      icon: <BrainCircuit />,
      title: "AI Deep Analysis",
      description:
        "Our multi-layered AI scans for deepfake signals—detecting AI generation, face swaps, and hidden manipulations by analyzing textures, lighting, and digital patterns.",
    },
    {
      icon: <BookCheck />,
      title: "Get Verified Results",
      description:
        "Receive a clear Truth Score with a detailed report. Instantly understand whether the image is real, manipulated, or AI-generated—so you can act with confidence.",
    },
  ]

  return (
    <section
      id="how-it-works"
      className="flex flex-col justify-center items-center py-10 sm:py-20"
    >
      <div className="max-w-300 w-full lg:w-[80%] px-5 sm:px-10 lg:px-0">

        {/* Heading */}
        <div className="text-center mb-10">
          <h2 className="text-3xl lg:text-4xl font-bold">
            How VerifiX Works
          </h2>

          <p className="mt-4 text-(--gray) max-w-2xl mx-auto">
            Verify any image in three seamless steps. Our AI handles the complexity—so you get clarity in seconds.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-5 lg:gap-10">
          {featuresData.map((feature, index) => (
            <div
              key={index}
              className="glass p-6 rounded-2xl mb-3 hover:scale-102 transition-all"
            >
              <button className='p-3 mb-3 text-(--primary) bg-(--primary)/10 border border-(--primary) rounded-xl'>
                {feature.icon}
              </button>
              <h3 className="text-xl font-semibold mb-3">
                {feature.title}
              </h3>

              <p className="text-(--gray) text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

export default Features