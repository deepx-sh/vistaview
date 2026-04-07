import {createApi,fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { logout } from '../../features/auth/authSlice';
import toast from 'react-hot-toast';


const rawBaseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    credentials: "include"
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
    let result = await rawBaseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
        const url = typeof args === 'string' ? args : args?.url ?? '';
        const isLogoutRequest = url.includes('/auth/logout');

        if(isLogoutRequest){
            return result;
        }
        const message = result.error.data?.message;

        const isExpiredToken = message === "Invalid access token" || message === "Invalid or expired access token" || message === "Not authenticated";

        if (isExpiredToken) {
            const refreshResult = await rawBaseQuery(
            { url: "/auth/refresh-token", method: "POST" },
            api,
            extraOptions
            )
             if (refreshResult.data) {
            result=await rawBaseQuery(args,api,extraOptions)
             } else {
                 const state = api.getState();
                 const wasLoggedIn = Boolean(state.auth?.user);

                 if (wasLoggedIn) {
                     toast.error("Session expired Please login again")
                 }
            
            api.dispatch(logout());
        }
        }

       
    }

    return result;
    
}
export const baseApi = createApi({
    reducerPath: "api",
    baseQuery:baseQueryWithReauth,
    tagTypes: ["User", "Place", "Review", "Wishlist","Dashboard","AdminDashboard","AdminUsers","AdminPlaces","AdminReviews","AdminOwners","AdminReports","Notifications"],
    endpoints:()=>({})
});

