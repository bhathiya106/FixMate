import React from 'react'
import Navbar from "../components/Navbar/Navbar";
import Footer from '../components/Footer/Footer'
import Banner from "../components/Banner/Banner";
import { assets } from "../assets/assets";

const Terms = () => {
  return (
    <div>
      
      <Banner title="Terms & Conditions" bgImage={assets.banner4} />

      <div className="max-w-5xl mx-auto px-6 py-16 space-y-10">
       
        <div className="size-[520px] rounded-full absolute blur-[300px] -z-10 bg-blue-100"></div>

       
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Our Terms</h1>
          <p className="mt-4 text-gray-600 leading-relaxed">
            By using <span className="font-semibold text-blue-600">FixMate</span>, you agree to follow
            these simple terms and conditions. Please read them carefully to
            understand your rights and responsibilities.
          </p>
        </div>

    
        <div className="space-y-8">
          <Section
            title="1. Use of Service"
            text="FixMate provides a platform to book household services. We act as a connector between customers and service providers, not as the direct service provider."
          />

          <Section
            title="2. Accounts"
            text="You are responsible for the security of your account and activities under it. Please keep your login details safe."
          />

          <Section
            title="3. Payments & Refunds"
            text="All payments are processed securely. Refunds and cancellations follow the policy displayed during booking."
          />

          <Section
            title="4. Vendor Responsibilities"
            text="Vendors must provide quality, lawful, and safe services. They are independent contractors, not employees of FixMate."
          />

          <Section
            title="5. Limitation of Liability"
            text="FixMate is not responsible for damages, delays, or disputes between customers and service providers."
          />

          <Section
            title="6. Updates"
            text="We may update these terms from time to time. Continued use of FixMate means you accept the updated terms."
          />
        </div>
      </div>

      <Footer />
    </div>
  )
}

const Section = ({ title, text }) => (
  <div className="bg-white shadow-md rounded-xl p-6">
    <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
    <p className="mt-2 text-gray-600 text-sm leading-relaxed">{text}</p>
  </div>
)

export default Terms
