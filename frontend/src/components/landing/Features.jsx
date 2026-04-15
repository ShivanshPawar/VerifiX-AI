import React from 'react'
import { FingerprintPattern, ImagePlay, ScanFace, } from 'lucide-react'

const Features = () => {

  const featuresData = [
    {
      icon: <FingerprintPattern />,
      title: "AI Generation Detection",
      description:
        "Spots images created from scratch by AI. Our system identifies the unique digital fingerprints left behind by tools like Midjourney, DALL-E, and deep-learning models.",
    },
    {
      icon: <ScanFace />,
      title: "Face Swap & Identity Check",
      description:
        "Detects when faces have been swapped or replaced. We analyze skin textures and lighting to catch harmful impersonations and misleading profile photos.",
    },
    {
      icon: <ImagePlay />,
      title: "Digital Alteration Traces",
      description:
        "Uncovers hidden edits and manual manipulation. Whether a person was added or a background was changed, we find the invisible traces of digital tampering.",
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
          <h2 className="text-2xl lg:text-4xl font-bold">
            Advanced Features to Detect Any Fake
          </h2>

          <p className="mt-4 text-(--gray) max-w-2xl mx-auto">
            Sophisticated fakes require smarter solutions. Our multi-layered AI scans every pixel to find even the smallest changes, ensuring you only trust what is real.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-5 lg:gap-10">
          {featuresData.map((feature, index) => (
            <div
              key={index}
              className="glass p-6 rounded-2xl mb-3 hover:scale-101 transition-all"
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