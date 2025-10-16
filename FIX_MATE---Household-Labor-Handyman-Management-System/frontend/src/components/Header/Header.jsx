import React from 'react'
import { assets } from '../../assets/assets'
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  return (
    <div className='relative h-[34vw] md:h-[20vw] lg:h-[18vw] min-h-[200px] md:min-h-[350px] mx-auto bg-contain '>
     
      <div className="absolute left-4 md:left-[6vw] bottom-[15%] md:bottom-[10%] flex flex-col items-start gap-3 md:gap-[1.5vw] max-w-[90%] md:max-w-[50%] z-10">
        <p className="text-sm md:text-[max(1.2vw,14px)] text-gray-600 font-medium mb-2 md:mb-5">
          One platform, all the home services you need
        </p>
        <h2 className="text-2xl md:text-[max(5.3vw,22px)] lg:text-5xl font-semibold text-black leading-tight">
          Your Trusted <br /> 
          Tasker for Every <br className='hidden md:block' /> 
          <span className='md:hidden'>Task</span>
          <span className='hidden md:inline'>Task</span>
        </h2>
        <button className="border-none text-white font-medium py-2 px-4 md:py-[1vw] md:px-[2.3vw] bg-blue-600 text-xs md:text-[max(1vw,13px)] rounded-full mt-2 md:mt-[10px] hover:bg-black hover:text-white transition-all duration-300 ease-in-out cursor-pointer shadow-lg" onClick={() => navigate('/AllServicesPage')}>
          Book A Service
        </button>
         {/* <div className="icon flex gap-3 mt-3 md:-mt-2 text-gray-600 text-xl md:text-2xl">
                    <a  href="https://www.linkedin.com/in/kavi-dissanayake/" ><i className='bx bxl-linkedin'></i></a>
                    <a href="https://github.com/kavinda44"><i className='bx bxl-github'></i></a>
                    <a href="#"><i className='bx bxl-instagram' ></i></a>
                    <a href="https://x.com/kevin_coding_"><i className='bx bxl-twitter'></i></a>
                </div> */}
      </div>

      <img 
        src={assets.hero_img} 
        alt="hero" 
        className='absolute right-5 bottom-[-1%] h-48 w-52 md:h-[430px] md:w-[470px] lg:h-[430px] lg:w-[450px] -z-10 opacity-80 md:opacity-100' 
      />
      
    </div>

  )
}

export default Header