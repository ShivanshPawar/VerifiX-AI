import React from 'react'
import { FingerprintPattern, ImagePlay, ScanFace, } from 'lucide-react'

const Features = () => {

  const featuresData = [
    {
      icon: <FingerprintPattern />,
      title: "AI Generation Detection",
      description:
        "Identify fully synthetic images created by AI models. Our system detects subtle digital fingerprints and generative patterns invisible to the human eye.",
    },
    {
      icon: <ScanFace />,
      title: "Face Swap & Identity Check",
      description:
        "Verify facial authenticity with deep facial analysis. We detect swaps, inconsistencies in skin texture, lighting mismatches, and identity-level anomalies.",
    },
    {
      icon: <ImagePlay />,
      title: "Digital Alteration Traces",
      description:
        "Reveal hidden edits and manipulations. From background changes to object insertions, we uncover the invisible signs of tampering.",
    },
  ]

  return (
    <section
      id="features"
      className="flex flex-col justify-center items-center py-20"
    >
      <div className="max-w-300 w-full lg:w-[80%] px-5 sm:px-10 lg:px-0">

        {/* Heading */}
        <div className="text-center mb-10">
          <h2 className="text-3xl lg:text-4xl font-bold">
            Precision Tools. Real Results.
          </h2>

          <p className="mt-4 text-(--gray) max-w-2xl mx-auto">
            Our detection engine goes beyond surface-level analysis—combining advanced AI, forensic signals, and behavioral patterns to expose even the most convincing deepfakes.
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