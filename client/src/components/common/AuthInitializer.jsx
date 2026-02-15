import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useGetMeQuery } from "../../features/auth/authApi";
import { setUser, logout } from "../../features/auth/authSlice.js";
import React from 'react'

const AuthInitializer = ({ children }) => {
    const dispatch = useDispatch();

    const { data, isSuccess, isError, isLoading } = useGetMeQuery();
    
    useEffect(() => {
        if (isSuccess && data?.user) {
            dispatch(setUser(data.user))
        }

        if (isError) {
            dispatch(logout())
        }
    }, [isError, data, isSuccess, dispatch])
    
    if (isLoading) return null;
    
    return children
}

export default AuthInitializer