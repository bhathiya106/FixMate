import React from 'react'
import Footer from '../../components/Footer/Footer'
import Banner from "../../components/Banner/Banner";
import { assets } from "../../assets/assets";

const About = () => {
  return (
    <div>
      <Banner title="About Us" bgImage={assets.banner4} />

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-center gap-10 px-6 py-16">
        {/* Background Glow */}
        <div className="size-[520px] rounded-full absolute blur-[300px] -z-10 bg-indigo-50"></div>

        {/* Image */}
        <img 
          className="max-w-sm w-full rounded-xl shadow-lg h-auto"
          src={assets.aboutus}
          alt="FixMate Team at Work"
        />

        {/* Content */}
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold text-gray-900">
            Who We Are
          </h1>
          <p className="text-base text-gray-600 mt-4 leading-relaxed">
            At <span className="font-semibold text-indigo-600">FixMate</span>, we believe your home and workplace deserve 
            the best care. Our mission is to provide reliable, professional, and 
            affordable handyman services that make your life easier. 
            From plumbing and electrical repairs to deep cleaning and 
            renovations, our expert team is always ready to help.
          </p>

          {/* Features */}
          <div className="flex flex-col gap-8 mt-10">
            <div className="flex items-start gap-4">
              <div className="size-10 flex items-center justify-center bg-indigo-100 rounded-lg">
                <span className="text-xl">⚡</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Reliable & Fast Service</h3>
                <p className="text-sm text-gray-600">
                  Quick response and efficient solutions for all your repair and maintenance needs.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="size-10 flex items-center justify-center bg-indigo-100 rounded-lg">
                <span className="text-xl">🛠️</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Skilled Professionals</h3>
                <p className="text-sm text-gray-600">
                  Our certified experts bring years of experience across a variety of services.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="size-10 flex items-center justify-center bg-indigo-100 rounded-lg">
                <span className="text-xl">🤝</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Customer First Approach</h3>
                <p className="text-sm text-gray-600">
                  We value trust and transparency — your satisfaction is always our top priority.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default About
