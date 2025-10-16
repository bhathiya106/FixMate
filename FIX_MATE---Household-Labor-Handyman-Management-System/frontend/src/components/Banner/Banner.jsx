import React from 'react'

const Banner = ({ title, bgImage }) => {
  return (
    <div className='h-[50vh] mt-2 flex justify-center items-center bg-center bg-cover' style={{ backgroundImage: `url(${bgImage})` }}>
        <h2 className='text-5xl text-zinc-800 bg-white p-5 rounded-xl font-bold'>{title}</h2>
        

    </div>
  )
}

export default Banner
