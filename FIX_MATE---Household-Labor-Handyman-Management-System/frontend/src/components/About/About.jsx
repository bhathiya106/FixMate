import React, { useState, useEffect, useRef } from 'react'
import CountUp from 'react-countup';
import { assets } from '../../assets/assets'

const About = () => {
  const [startCount, setStartCount] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setStartCount(true);
          }
        });
      },
      {
        threshold: 0.3, // Trigger when 30% of the component is visible
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <div className="px-4 md:px-8 lg:px-16 py-16" ref={sectionRef}>
      <h1 className="text-3xl font-semibold text-center mx-auto mb-8">Here's Why Customers Trust Us</h1>
       
      <div className="relative max-w-6xl mx-auto">
        <div className="w-[520px] h-[520px] -top-80 left-1/2 -translate-x-1/2 rounded-full absolute blur-[300px] -z-10 bg-[#FBFFE1]"></div>
        
        <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16 pt-20">
          {/* Happy Customers */}
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 mb-4 flex items-center justify-center">
              <img src={assets.Vector} alt="Happy customers icon" className="w-12 h-12 object-contain" />
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl md:text-4xl font-bold text-gray-800">
                {startCount ? <CountUp start={0} end={49000} duration={3} /> : '0'}
                <span>+</span>
              </span>
              <span className="text-sm md:text-base text-gray-600 mt-1">Happy Customers</span>
            </div>
          </div>

          {/* Divider Line */}
          <div className="hidden md:block w-px h-24 bg-gray-300"></div>
          
          {/* Tasks Completed */}
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 mb-4 flex items-center justify-center">
              <img src={assets.mdi_city} alt="Tasks completed icon" className="w-12 h-12 object-contain" />
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl md:text-4xl font-bold text-gray-800">
                {startCount ? <CountUp start={0} end={129000} duration={3} /> : '0'}
                <span>+</span>
              </span>
              <span className="text-sm md:text-base text-gray-600 mt-1">Tasks Completed</span>
            </div>
          </div>

          {/* Divider Line */}
          <div className="hidden md:block w-px h-24 bg-gray-300"></div>
          
          {/* Service Coverage */}
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 mb-4 flex items-center justify-center">
              <img src={assets.clarity_tasks_solid} alt="Service coverage icon" className="w-12 h-12 object-contain" />
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl md:text-4xl font-bold text-gray-800">
                {startCount ? <CountUp start={0} end={8} duration={3} /> : '0'}
                <span>+</span>
              </span>
              <span className="text-sm md:text-base text-gray-600 mt-1">Service Coverage</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About