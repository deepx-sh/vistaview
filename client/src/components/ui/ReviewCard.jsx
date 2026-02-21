import React from 'react'

const ReviewCard = ({name}) => {
  return (
      <div className='bg-background border border-border rounded-lg p-6 text-left'>
          <div className='flex items-center gap-3 mb-3'>
              <div className='w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-semibold'>
                  {name.charAt(0)}
              </div>

              <div>
                  <p className='font-medium'>{name}</p>
                  <div className='text-warning text-sm'>★★★★★</div>
              </div>
          </div>

          <p className='text-sm text-text-secondary'>
              Amazing platform! Found hidden gems I never knew existed. Highly recommended!
          </p>
    </div>
  )
}

export default ReviewCard