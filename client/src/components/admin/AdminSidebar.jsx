import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, MapPin, MessageSquare, Flag, ShieldCheck, Home,X } from "lucide-react";

import React from 'react'

const AdminSidebar = ({isOpen,setIsOpen}) => {
    const menu = [
        {name:"Dashboard",path:"/admin/dashboard",icon:LayoutDashboard},
        {name:"Users",path:"/admin/users",icon:Users},
        {name:"Places",path:"/admin/places",icon:MapPin},
        {name:"Reviews",path:"/admin/reviews",icon:MessageSquare},
        {name:"Owner Requests",path:"/admin/owners",icon:ShieldCheck},
        { name: "Reports", path: "/admin/reports", icon: Flag },
        {name:"Home", path:"/",icon:Home}
    ]
    return (
        <>
            {isOpen && (
                <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity" onClick={()=>setIsOpen(false)}></div>
            )}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-surface border-r border-border transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static  lg:inset-0 h-screen flex flex-col  ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                  <div className="flex items-center justify-between p-6 border-b border-border/50 lg:border-none">
                    <h2 className="text-xl font-bold  text-danger">Admin Panel</h2>
                    <button className="lg:hidden text-text-secondary hover:text-danger cursor-pointer transition-colors" onClick={() => setIsOpen(false)}><X size={20} /></button>
                    </div>  
          <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
              {menu.map((item) => {
                  const Icon = item.icon;
                  return (
                      <NavLink key={item.path} to={item.path} end={item.path === "/admin/dashboard"}
                          onClick={()=> setIsOpen(false)}
                          className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all ${isActive ? "bg-danger text-white shadow-sm":"text-text-secondary hover:bg-danger/10 hover:text-danger"}`
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

export default AdminSidebar