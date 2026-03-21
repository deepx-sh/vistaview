import React from 'react'

const StatsCards = ({label,value,color="text-gray-900"}) => {
  return (
      <div className='bg-white border border-border rounded-lg p-5'>
          <p className='text-xs text-gray-500 uppercase tracking-wide mb-1'>{label}</p>
          <p className={`text-2xl font-semibold ${color}`}>{value ?? "--"}</p>
    </div>
  )
}

export default StatsCards