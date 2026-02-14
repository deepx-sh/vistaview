import { baseApi } from "../../services/api/baseApi";

export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials) => ({
                url: "/auth/login",
                method: "POST",
                body:credentials
            })
        }),

        getMe: builder.query({
            query:()=>"/auth/me"
        }),

        logout: builder.mutation({
            query: () => ({
                url: "/auth/logout",
                method:"POST"
            })
        })
    })
});


export const {useLoginMutation,useGetMeQuery,useLogoutMutation}=authApi