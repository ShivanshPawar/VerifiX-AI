import React from 'react'
import scanImg from '../../assets/images/HeroScanImg.avif'


const HeroScanner = () => {
  return (
    <div className='relative w-full max-w-xs sm:max-w-md md:max-w-md lg:max-w-md p-4 sm:p-5 flex justify-center items-center glass rounded-2xl'>
      {/* Wrapper for the scan image */}
      <div className='relative image-wrapper flex justify-center items-center overflow-hidden w-full rounded-2xl glass'>
        {/* Grid Overlay */}
        <div className="grid-overlay"></div>
        <div className="scan-line"></div>
        <div className="scan-points absolute z-30"></div>

        {/* Scan Image */}
        <img
          className='w-full min-h-70 border border-(--primary)/60 glass rounded-2xl drop-shadow-3xl'
          src={scanImg}
          loading='lazy'
          alt="Scan"
        />

      </div>
    </div>
  )
}

export default HeroScanner