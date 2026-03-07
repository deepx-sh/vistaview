import { baseApi } from "../../services/api/baseApi";


export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query({
      query: () => "/users/me",
      providesTags:["User"]
    }),
    
    updateProfile: builder.mutation({
      query: (data) => ({
        url: "/users/me",
        method: "PUT",
        body:data
      }),
      invalidatesTags:["User"]
    }),

    uploadAvatar: builder.mutation({
      query: (formData) => ({
        url: "/users/me/avatar",
        method: "PUT",
        body:formData
      }),
      invalidatesTags:["User"]
    }),

    deleteAvatar: builder.mutation({
      query: () => ({
        url: "/users/me/avatar",
        method:"DELETE"
      }),
      invalidatesTags:["User"]
    })
    })
});

export const {useGetProfileQuery,useUpdateProfileMutation,useUploadAvatarMutation,useDeleteAvatarMutation}=userApi