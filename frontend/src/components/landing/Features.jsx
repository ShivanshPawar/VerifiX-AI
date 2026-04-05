import React from 'react'
import FeatureCard from './FeatureCard'

const Features = () => {
  return (
    <section id="features" className="relative flex flex-col justify-center items-center py-20 sm:py-24 px-6">

      <div className="max-w-300 ">

        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Powerful verification, built for speed
          </h2>

          <p className="mt-4 text-(--gray) max-w-2xl mx-auto">
            Detect AI-generated and manipulated images in seconds with a clean report you can trust.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">

          <FeatureCard
            title="AI Deepfake Detection"
            description="Advanced deep learning models analyze visual artifacts, GAN fingerprints, and manipulation traces."
          />

          <FeatureCard
            title="Instant Forensic Analysis"
            description="Upload an image and receive a detailed AI verification report within seconds."
          />

          <FeatureCard
            title="Privacy-First Scanning"
            description="Images are processed securely with hash-based analysis and minimal data retention."
          />

        </div>

      </div>

    </section>
  )
}

export default Features