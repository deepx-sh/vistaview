import { useSelector } from "react-redux";
import { Navigate } from 'react-router-dom';
import React from 'react'

const ProtectedRoutes = ({ children, allowedRoles }) => {
    const { accessToken, role } = useSelector((state) => state.auth);
    
    if (!accessToken) {
        return <Navigate to="/login" replace/>
    }

    if (allowedRoles && !allowedRoles.includes(role)) {
        return <Navigate to="/" replace/>
    }

    return children;
}

export default ProtectedRoutes