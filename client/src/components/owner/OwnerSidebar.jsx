import { NavLink } from "react-router-dom";
import { LayoutDashboard, MapPin, PlusCircle, MessageSquare, BarChart3, Home,X } from "lucide-react";

import React from 'react'

const OwnerSidebar = ({isOpen,setIsOpen}) => {
    const menu = [
        {
            name: "Dashboard",
            path: "/owner/dashboard",
            icon:LayoutDashboard
        },
        {
            name: "My Place",
            path: "/owner/places",
            icon:MapPin
        },
        {
            name: "Add Place",
            path: "/owner/add-place",
            icon:PlusCircle
        },
        {
            name: "Reviews",
            path: "/owner/reviews",
            icon:MessageSquare
        },
        {
            name: "Analytics",
            path: "/owner/analytics",
            icon:BarChart3
        },
        {
            name: "Home",
            path: "/",
            icon:Home
        }
    ]
  return (
      <>
            {isOpen && (
                <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity" onClick={()=>setIsOpen(false)}></div>
            )}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-surface border-r border-border transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static  lg:inset-0 h-screen flex flex-col  ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                  <div className="flex items-center justify-between p-6 border-b border-border/50 lg:border-none">
                    <h2 className="text-xl font-bold  text-primary">Owner Panel</h2>
                    <button className="lg:hidden text-text-secondary hover:text-primary transition-colors" onClick={() => setIsOpen(false)}><X size={20} /></button>
                    </div>  
          <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
              {menu.map((item) => {
                  const Icon = item.icon;
                  return (
                      <NavLink key={item.path} to={item.path} end={item.path === "/owner/dashboard"}
                          onClick={()=> setIsOpen(false)}
                          className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all ${isActive ? "bg-primary text-white shadow-sm":"text-text-secondary hover:bg-primary/10 hover:text-primary"}`
                        }
                      >
                          <Icon size={18} />
                          {item.name}
                      </NavLink>
                  )
              })}
          </nav>
     
       </aside>
      </>
  )
}

export default OwnerSidebar