import React from 'react'

interface FilterProps {
    children: React.ReactNode;
    show: boolean;
}

const Filter: React.FC<FilterProps> = ({children, show}) => {
  return (
    <div className={`${show || 'hidden'} flex w-full h-screen bg-black bg-opacity-30 justify-center items-center fixed top-0 z-20`}>
      {children}
    </div>
  )
}

export default Filter