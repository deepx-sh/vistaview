import {createApi,fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { logout } from '../../features/auth/authSlice';
import toast from 'react-hot-toast';


const rawBaseQuery = fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/v1",
    credentials: "include"
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
    let result = await rawBaseQuery(args, api, extraOptions);
    console.log(result);
    
    if (result.error && result.error.status === 401 && (result.error.data.message==="Invalid access token" || result.error.data.message==="Invalid or expired access token" || result.error.data.message==="Not authenticated")) {
        const refreshResult = await rawBaseQuery(
            { url: "/auth/refresh-token", method: "POST" },
            api,
            extraOptions
        )

        if (refreshResult.data) {
            result=await rawBaseQuery(args,api,extraOptions)
        } else {
            toast.error("Session expired Please login again")
            api.dispatch(logout());
        }
    }

    return result;
    
}
export const baseApi = createApi({
    reducerPath: "api",
    baseQuery:baseQueryWithReauth,
    tagTypes: ["User", "Place", "Review", "Wishlist"],
    endpoints:()=>({})
});

