import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MapPinOff,ArrowLeft,Home } from 'lucide-react'
const NotFound = () => {
    const navigate=useNavigate()
  return (
      <div className='min-h-screen bg-background flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 relative overflow-hidden'>
          
          <div className='absolute top-0 left-0 -z-10 w-full h-full overflow-hidden pointer-events-none'>
              <div className='absolute -top-12 -left-12 sm:-top-24 sm:-left-24 w-64 h-64 sm:w-96 sm:h-96 bg-primary/5 rounded-full blur-3xl'></div>
              <div className='absolute bottom-4 -right-12 sm:bottom-10 sm:-right-24 w-56 h-56 sm:w-80 sm:h-80 bg-primary/10 rounded-full blur3xl'></div>
          </div>

          <div className='max-w-md sm:max-w-lg lg:max-w-xl w-full space-y-6 sm:space-y-8 text-center bg-white p-6 sm:p-10 rounded-2xl sm:rounded-3xl shadow-xl border border-gray-100 z-10 mx-auto'>

          <div className='flex justify-center'>
              <div className='relative'>
                  <div className='absolute inset-0 bg-primary/20 blur-2xl rounded-full animate-pulse'></div>

                  <MapPinOff className='relative h-20 w-20 sm:h-28 sm:w-28 text-primary mx-auto drop-shadow-md transition-all duration-300' strokeWidth={1.5}/>
              </div>
          </div>

          <div className='space-y-3 sm:space-y-4 text-center px-2 sm:px-0'>
              <h1 className='text-6xl sm:text-8xl font-extrabold text-gray-900 tracking-tighter'>
                  404
              </h1>

              <h2 className='text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight'>
                  Destination Not Found
              </h2>

              <p className='text-gray-500 text-sm sm:text-base font-medium max-w-xs sm:max-w-sm mx-auto leading-relaxed'>
                  Oops! The place you are looking for seems to have fallen off our map. It might have been moved, renamed, or perhaps it never existed
              </p>
          </div>

          <div className='flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mt-6 sm:mt-8 pt-2 sm:pt-4'>
              <button onClick={() => navigate(-1)} className='flex items-center justify-center gap-2 w-full sm:w-auto px-5 sm:px-6 py-3 border-2 border-gray-200 shadow-sm text-sm sm:text-base font-semibold rounded-xl text-gray-700 bg-white hover:border-gray-300 transition-all duration-150 cursor-pointer'>
                  <ArrowLeft className='w-4 h-4 sm:w-5 sm:h-5' />
                  Go Back
              </button>
              <Link to="/" className='flex items-center justify-center gap-2 w-full sm:w-auto px-5 sm:px-6 py-3 shadow-md text-sm sm:text-base font-semibold rounded-xl text-white bg-primary hover:bg-primary-hover hover:shadow-lg transition-all duration-200 cursor-pointer'>
                  <Home className='w-4 h-4 sm:w-5 sm:h-5' />
                  Back to Home
              </Link>
              </div>
              </div>
    </div>
  )
}

export default NotFound