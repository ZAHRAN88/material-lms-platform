import { MotionDiv } from '@/components/MotionDiv'
import React from 'react'

const page = () => {
  return (
    <div>
            <MotionDiv
            className='flex flex-col items-center animate-pulse justify-center h-screen'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 , ease: 'easeInOut' }}
              
            >
              <h1 className="text-4xl font-bold">Coming Soon!</h1>
              <p className="text-lg">We are working hard to bring you an amazing experience. Stay tuned!</p>
            </MotionDiv>
          </div>
  )
}

export default page
