import { baseApi } from "../../services/api/baseApi";

export const ownerApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getOwnerDashboard: builder.query({
            query: () => "/owners/dashboard",
            providesTags:["Dashboard"]
        })
    })
});

export const {useGetOwnerDashboardQuery}=ownerApi