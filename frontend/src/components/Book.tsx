import React from 'react'

const Book: React.FC = () => {
  return (
    <div className='bg-gray-200 rounded-lg w-full h-full p-6'>
        <div className='w-[12rem] h-full bg-stone-400 relative'>
            <div className='absolute h-full w-4 left-0 bg-white'></div>
        </div>
    </div>
  )
}

export default Book