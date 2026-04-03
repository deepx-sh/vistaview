import React from 'react'
import { Menu } from 'lucide-react'
import OwnerSidebar from '../owner/OwnerSidebar'
import { Outlet } from 'react-router-dom'
import { useState } from 'react'
const OwnerLayout = () => {
  const [sidebarOpen, setSiderBarOpen] = useState(false);
  return (
      <div className='flex h-screen overflow-hidden bg-background'>
      <OwnerSidebar isOpen={ sidebarOpen} setIsOpen={setSiderBarOpen} />
          
      <div className='flex-1 flex flex-col overflow-hidden'>
        <header className='lg:hidden flex items-center justify-between h-16 px-4 bg-surface border-b border-border z-30'>
          <button onClick={() => setSiderBarOpen(true)} className='text-text-secondary p-2 -ml-2 hover:bg-gray-100 rounded-md transition-colors'>
            <Menu size={24}/>
          </button>

          <span className='font-semibold text-text-primary'>Owner Dashboard</span>
          <div className='w-8'></div>
        </header>
         <main className='flex-1 overflow-x-hidden overflow-y-auto p-4 lg:p-8'>
              <Outlet/>
          </main>
         </div>
    </div>
  )
}

export default OwnerLayout