import React from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

const SectionErrorFallback = ({error,reset}) => {
  return (
      <div className='flex flex-col items-center justify-center py-20 px-6 text-center'>
          <div className='w-12 h-12 bg-red-100 rounded-full flex items-center justify-center'>
              <AlertTriangle size={22} className='text-danger'/>
          </div>

          <h2 className='font-semibold text-text-primary mb-1'>
              Failed to load this section
          </h2>

          <p className='text-sm text-text-secondary mb-6 max-w-xs'>
              {import.meta.env.DEV && error ? error.message :"Something went wrong. Please try again"}
          </p>

          <button onClick={reset} className='flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-5 py-2 rounded-md text-sm transition-colors duration-200 cursor-pointer'>
              <RefreshCw size={14} />
              Try again
          </button>
    </div>
  )
}

export default SectionErrorFallback