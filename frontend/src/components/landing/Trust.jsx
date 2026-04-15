import React from 'react'
import { History, Zap, Settings } from "lucide-react";
import img from '../../assets/images/image.png'
import img1 from '../../assets/images/Screenshot 2026-04-09 091435.png'
import img2 from '../../assets/images/Screenshot 2026-04-09 091435.png'
import { useState } from 'react';
const Trust = () => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const features = [
    {
      icon: History,
      title: "Scan history",
      desc: "Track previous scans, revisit results, and compare confidence scores easily.",
      img: img
    },
    {
      icon: Zap,
      title: "Real-time insights",
      desc: "Instantly analyze images with multi-model AI and get accurate results in seconds.",
      img: img1
    },
    {
      icon: Settings,
      title: "Full control",
      desc: "Manage your scans and control how your data is stored and used.",
      img: img2
    }
  ];

  return (
    <section className='flex flex-col justify-center items-center py-20'>
      <div className='max-w-300 w-full lg:w-[80%] px-5 grid gap-10 lg:grid-cols-2'>
        <div className='flex flex-col gap-5'>
          <h2 className='text-2xl lg:text-4xl font-bold'>Built for trust at every level</h2>
          <p className="text-(--gray) max-w-lg">
            VerifiX gives you complete control over how you verify, analyze,
            and manage digital content with advanced AI detection.
          </p>

          <div className="flex flex-col">
            {features.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className="flex items-start gap-4 hover:bg-(--gray)/10 rounded-2xl p-5 cursor-pointer transition-all"
                  onMouseEnter={() => setActiveImageIndex(i)}
                >
                  <div className="w-10 h-10 flex items-center justify-center rounded-lg">
                    <Icon size={20} />
                  </div>

                  <div>
                    <h3 className="text-(--white) font-semibold">
                      {item.title}
                    </h3>
                    <p className="text-(--gray) max-w-sm text-sm">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className='glass rounded-2xl overflow-hidden '>
          <img
            className='rounded-tl-2xl w-full h-full object-cover'
            src={features[activeImageIndex].img}
            alt=""
          />
        </div>
      </div>
    </section>
  )
}

export default Trust