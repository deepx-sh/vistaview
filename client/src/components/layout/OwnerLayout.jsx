import React from 'react'
import OwnerSidebar from '../owner/OwnerSidebar'
import { Outlet } from 'react-router-dom'
const OwnerLayout = () => {
  return (
      <div className='flex min-h-screen'>
          <OwnerSidebar />
          
          <main className='flex-1 p-6 bg-background'>
              <Outlet/>
          </main>
    </div>
  )
}

export default OwnerLayout