import React from 'react'

const MetricCard = ({label,value,sub}) => {
  return (
      <div className='bg-gray-50 rounded-lg p-4 border-2 border-primary'>
          <p className='text-xs text-gray-500 mb-1'>{label}</p>
          <p className='text-2xl font-medium text-gray-900'>{value}</p>
          {sub && <p className='text-xs text-gray-500 mt-1'>{sub}</p>}
    </div>
  )
}

export default MetricCard