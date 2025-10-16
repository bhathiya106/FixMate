import React from 'react'
import { assets } from '../../assets/assets'
import { useNavigate } from 'react-router-dom'

const Store = () => {
  const navigate = useNavigate();
  return (
    <>
      
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-black mb-2' text-center mt-10 mb-4">
        Discover Our Store
      </h1>
      <p className="text-xs text-gray-600 mb-10 text-center max-w-2xl mx-auto px-4">
        Explore a wide range of high-quality construction materials. From sand and cement to pipes and more,
 Fixmate connects you with trusted suppliers for all your building needs
      </p>

    
      <section className="flex flex-wrap items-center justify-center gap-6 px-4">
       
        <a href="#" className="group w-full sm:w-56">
          <img
            className="rounded-lg w-full group-hover:shadow-xl group-hover:-translate-y-1 duration-300 transition-all h-72 object-cover object-top"
            src={assets.sand}
            alt="Sand" onClick={() => navigate('/product/68ceb5e5d7a660fbc3e36753')}
          />
          <p className="text-sm mt-2" >Sand</p>
          <p className="text-xl font-semibold" >Rs.2000</p>
        </a>

        <a href="#" className="group w-full sm:w-56">
          <img
            className="rounded-lg w-full group-hover:shadow-xl group-hover:-translate-y-1 duration-300 transition-all h-72 object-cover object-right"
            src={assets.cement}
            alt="Cement" onClick={() => navigate('/product/68d1b0a4ce4dd9c641421c0c')}
          />
          <p className="text-sm mt-2">Cement</p>
          <p className="text-xl font-semibold">Rs.3500</p>
        </a>

        <a href="#" className="group w-full sm:w-56">
          <img
            className="rounded-lg w-full group-hover:shadow-xl group-hover:-translate-y-1 duration-300 transition-all h-72 object-cover object-right"
            src={assets.metal_stones}
            alt="Metal Stones" onClick={() => navigate('/product/68ceb67cd7a660fbc3e36757')}
          />
          <p className="text-sm mt-2">Metal Stones</p>
          <p className="text-xl font-semibold">Rs.2000</p>
        </a>

        <a href="#" className="group w-full sm:w-56">
          <img
            className="rounded-lg w-full group-hover:shadow-xl group-hover:-translate-y-1 duration-300 transition-all h-72 object-cover object-right"
            src={assets.brick_rocks}
            alt="White Brick Rocks" onClick={() => navigate('/product/68cf02975e85836b553d3044')}
          />
          <p className="text-sm mt-2">White Brick Rocks</p>
          <p className="text-xl font-semibold">Rs.100</p>
        </a>
      </section>

     
      <div className="flex justify-center mt-5">
        <button
          className="text-sm px-6 py-2 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-black transition"
          onClick={() => navigate('/supplystore')}
        >
          View Our Store
        </button>
      </div>
    </>
  )
}

export default Store
