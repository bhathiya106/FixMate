import React from 'react'
import { assets } from '../../assets/assets'

const Footer = () => {
  return (
    <footer className="flex flex-wrap justify-center lg:justify-between overflow-hidden gap-10 md:gap-20 py-16 px-6 md:px-16 lg:px-24 xl:px-32 text-[13px] text-gray-500 bg-black">
      <div className="flex flex-wrap items-start gap-10 md:gap-[60px] xl:gap-[140px]">
        <img src={assets.logo} alt="FixMate Logo" className="w-16 md:w-24" />
        
        <div>
          <p className="text-slate-100 font-semibold">Navigation</p>
          <ul className="mt-2 space-y-2">
            <li><a href="/" className="hover:text-indigo-600 transition">Home</a></li>
            <li><a href="/about" className="hover:text-indigo-600 transition">About</a></li>
            <li><a href="/AllServicesPage" className="hover:text-indigo-600 transition">Services</a></li>
            <li><a href="/supplystore" className="hover:text-indigo-600 transition">Store</a></li>
            <li><a href="/contact" className="hover:text-indigo-600 transition">Contact</a></li>
          </ul>
        </div>
        
        <div>
          <p className="text-slate-100 font-semibold">Resources</p>
          <ul className="mt-2 space-y-2">
            {/* <li><a href="/company" className="hover:text-indigo-600 transition">Company</a></li>
            <li><a href="/blogs" className="hover:text-indigo-600 transition">Blogs</a></li>
            <li><a href="/community" className="hover:text-indigo-600 transition">Community</a></li> */}
            <li>
              <a href="/deliveryregister" className="hover:text-indigo-600 transition">
                Careers
                <span className="text-xs text-white bg-indigo-600 rounded-md ml-2 px-2 py-1">
                  We're hiring!
                </span>
              </a>
            </li>
            <li><a href="/support" className="hover:text-indigo-600 transition">Support</a></li>
          </ul>
        </div>
        
        <div>
          <p className="text-slate-100 font-semibold">Legal</p>
          <ul className="mt-2 space-y-2">
            {/* <li><a href="/privacy" className="hover:text-indigo-600 transition">Privacy Policy</a></li> */}
            <li><a href="/terms" className="hover:text-indigo-600 transition">Terms of Service</a></li>
          </ul>
        </div>
      </div>
      
      <div className="flex flex-col max-md:items-center max-md:text-center gap-2 items-end">
        <p className="max-w-60 text-slate-100 font-medium">Your Trusted Partner for Every Fix</p>
        <div className="flex items-center gap-4 mt-3">
          <a 
            href="#" 
            target="_blank" 
            rel="noreferrer"
            aria-label="Follow us on Dribbble"
            className="hover:text-indigo-500 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-dribbble size-5" aria-hidden="true">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M19.13 5.09C15.22 9.14 10 10.44 2.25 10.94"></path>
              <path d="M21.75 12.84c-6.62-1.41-12.14 1-16.38 6.32"></path>
              <path d="M8.56 2.75c4.37 6 6 9.42 8 17.72"></path>
            </svg>
          </a>
          <a 
            href="#" 
            target="_blank" 
            rel="noreferrer"
            aria-label="Connect with us on LinkedIn"
            className="hover:text-indigo-500 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-linkedin size-5" aria-hidden="true">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
              <rect width="4" height="12" x="2" y="9"></rect>
              <circle cx="4" cy="4" r="2"></circle>
            </svg>
          </a>
          <a 
            href="#" 
            target="_blank" 
            rel="noreferrer"
            aria-label="Follow us on Twitter"
            className="hover:text-indigo-500 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-twitter size-5" aria-hidden="true">
              <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
            </svg>
          </a>
          <a 
            href="#" 
            target="_blank" 
            rel="noreferrer"
            aria-label="Subscribe to our YouTube channel"
            className="hover:text-indigo-500 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-youtube size-6" aria-hidden="true">
              <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"></path>
              <path d="m10 15 5-3-5-3z"></path>
            </svg>
          </a>
        </div>
      </div>
      
      <div className="pt-3 text-center text-xs w-full text-gray-400 border-t border-gray-800 mt-6">
        <p>
          Copyright {new Date().getFullYear()} © <a href="#" className="hover:text-indigo-500 transition">FixMate</a>. All Rights Reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer