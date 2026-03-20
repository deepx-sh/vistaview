import { baseApi } from "../../services/api/baseApi";

export const ownerApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getOwnerDashboard: builder.query({
            query: () => "/owners/dashboard",
            providesTags:["Dashboard"]
        }),

        applyForOwner: builder.mutation({
            query: (formData) => ({
                url: "/owners/apply",
                method: "POST",
                body:formData
            }),
            invalidatesTags:["User"]
        })
    })
});

export const {useGetOwnerDashboardQuery,useApplyForOwnerMutation}=ownerApi