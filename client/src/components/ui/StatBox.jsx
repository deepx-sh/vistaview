import React from 'react'

const StatBox = ({number,label}) => {
  return (
      <div className='bg-surface border border-border rounded-lg p-6 text-center hover:border-primary-hover transition duration-200'>
          <h3 className='text-2xl font-semibold'>{number}</h3>
          <p className='text-sm text-text-muted mt-1'>{label}</p>
    </div>
  )
}

export default StatBox