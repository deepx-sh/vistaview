import { NavLink } from "react-router-dom";
import { LayoutDashboard, MapPin, PlusCircle, MessageSquare, BarChart3 } from "lucide-react";

import React from 'react'

const OwnerSidebar = () => {
    const menu = [
        {
            name: "Dashboard",
            path: "/owner",
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
    ]
  return (
      <div className="w-64 h-screen border-r border-border p-6 hidden md:block">
          <h2 className="text-xl font-semibold mb-8">
              Owner Panel
          </h2>

          <nav className="space-y-3">
              {menu.map((item) => {
                  const Icon = item.icon;

                  return (
                      <NavLink
                          key={item.path}
                          to={item.path}
                          className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2 rounded-md text-sm ${isActive ? "bg-primary text-white":"hover:bg-gray-200"}`
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

export default OwnerSidebar