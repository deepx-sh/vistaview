import { Outlet } from "react-router-dom";
import AdminSidebar from "../admin/AdminSidebar";

import React from 'react'

const AdminLayout = () => {
  return (
      <div className="flex min-h-screen">
          <AdminSidebar />
          <main className="flex-1 p-6 bg-background">
              <Outlet/>
          </main>
    </div>
  )
}

export default AdminLayout