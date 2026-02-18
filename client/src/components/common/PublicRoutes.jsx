import { useSelector } from "react-redux";

import { Navigate } from "react-router-dom";

import React from 'react'

const PublicRoutes = ({children}) => {
    const { isAuthenticated,role } = useSelector((state) => state.auth)
    console.log(isAuthenticated,role);
    
    if (isAuthenticated) {
        if(role==="admin") return <Navigate to="/admin/dashboard" replace/>
        if (role === "owner") return <Navigate to="/owner/dashboard" replace />
        return <Navigate to="/" replace/>
    }
  return children
}

export default PublicRoutes