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
        register: builder.mutation({
            query: (data) => ({
                url: "/auth/register",
                method: "POST",
                body:data
            })
        }),
        getMe: builder.query({
            query:()=>"/auth/me"
        }),
        verifyEmail: builder.mutation({
            query: (data) => ({
                url: "/auth/verify-email",
                method: "POST",
                body:data
            })
        }),
        resendVerifyOTP: builder.mutation({
            query: (data) => ({
                url: "/auth/resend-verify-otp",
                method: "POST",
                body:data
            })
        }),
        logout: builder.mutation({
            query: () => ({
                url: "/auth/logout",
                method:"POST"
            })
        })
    })
});


export const {useLoginMutation,useGetMeQuery,useLogoutMutation,useRegisterMutation,useVerifyEmailMutation,useResendVerifyOTPMutation}=authApi