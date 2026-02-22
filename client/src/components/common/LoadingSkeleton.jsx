import React from 'react'

const LoadingSkeleton = () => {
  return (
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
          {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className='bg-surface border border-border rounded-lg p-5 animate-pulse'>
                  <div className='h-40 bg-border rounded mb-4'></div>
                  <div className='h-4 bg-border rounded w-3/4 mb-2'></div>
                  <div className='h-4 bg-border rounded w-1/2'></div>
              </div>
          ))}
    </div>
  )
}

export default LoadingSkeleton