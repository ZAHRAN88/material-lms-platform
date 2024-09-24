import React from 'react'
import { Vortex } from './ui/vortex'

const HeroSection = () => {
  return (
    <div  className='relative w-full h-[70vh] mt-10  flex-col justify-center items-center text-center hidden md:flex'>
         <h1 className="mt-4 absolute top[50%] text-7xl md:text-center text-left px-3 font-bold ">
         The future belongs to those who believe in the beauty of their dreams
     </h1>
     <Vortex baseSpeed={0.3}  backgroundColor='transparent'>
        
     </Vortex>
    
    </div>
  )
}

export default HeroSection
