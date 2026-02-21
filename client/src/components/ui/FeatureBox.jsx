import React from 'react'

const FeatureBox = ({icon,title,desc}) => {
  return (
      <div className='bg-surface border border-border rounded-lg p-8 hover:shadow-md transition text-left'>
          <div className='text-primary mb-4'>{icon}</div>
          <h3 className='font-semibold mb-2'>{title}</h3>
          <p className='text-sm text-text-secondary'>{desc}</p>
    </div>
  )
}

export default FeatureBox