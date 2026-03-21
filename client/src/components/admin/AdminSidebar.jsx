import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, MapPin, MessageSquare, Flag, ShieldCheck } from "lucide-react";

import React from 'react'

const AdminSidebar = () => {
    const menu = [
        {name:"Dashboard",path:"/admin/dashboard",icon:LayoutDashboard},
        {name:"Users",path:"/admin/users",icon:Users},
        {name:"Places",path:"/admin/places",icon:MapPin},
        {name:"Reviews",path:"/admin/reviews",icon:MessageSquare},
        {name:"Owner Requests",path:"/admin/owners",icon:ShieldCheck},
        {name:"Reports",path:"/admin/reports",icon:Flag},
    ]
  return (
      <div className="w-64 h-screen border-r border-border p-6 hidden md:block">
          <h2 className="text-xl font-semibold mb-8 text-danger">Admin Panel</h2>
          <nav className="space-y-3">
              {menu.map((item) => {
                  const Icon = item.icon;
                  return (
                      <NavLink key={item.path} to={item.path} end={item.path === "/admin/dashboard"}
                          className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2 rounded-md text-sm ${isActive ? "bg-danger text-white":"hover:bg-gray-100"}`
                        }
                      >
                          <Icon size={18} />
                          {item.name}
                      </NavLink>
                  )
              })}
          </nav>
    </div>
  )
}

export default AdminSidebar