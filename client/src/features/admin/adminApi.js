import { baseApi } from "../../services/api/baseApi";

export const adminApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAdminDashboard: builder.query({
            query: () => "/admin/dashboard",
            providesTags:["AdminDashboard"]
        }),

        getAllUsers: builder.query({
            query: () => "/admin/users",
            providesTags:["AdminUsers"]
        }),
        blockUser: builder.mutation({
            query: ({ id, reason }) => ({
                url: `/admin/users/${id}/block`,
                method: "PATCH",
                body:{reason}
            }),
            invalidatesTags:["AdminUsers"]
        }),
        unBlockUser: builder.mutation({
            query: (id) => ({
                url: `/admin/users/${id}/unblock`,
                method:"PATCH"
            }),
            invalidatesTags:["AdminUsers"]
        }),
        
        // Places
        getAllPlacesAdmin: builder.query({
            query: () => "/admin/places",
            providesTags:["AdminPlaces"]
        }),
        getPendingPlaces: builder.query({
            query: () => "/admin/places/pending",
            provideTags:["AdminPlaces"]
        }),
        approvePlace: builder.mutation({
            query: (id) => ({
                url: `/admin/places/${id}/approve`,
                method:"PATCH"
            }),
            invalidatesTags:["AdminPlaces"]
        }),
        rejectedPlace: builder.mutation({
            query: ({ id, reason }) => ({
                url: `/admin/places/${id}/reject`,
                method: "PATCH",
                body:{reason}
            }),
            invalidatesTags:["AdminPlaces"]
        }),
        toggleFeaturePlace: builder.mutation({
            query: ({ id, isFeatured }) => ({
                url: `/admin/places/${id}/feature`,
                method: "PATCH",
                body:{isFeatured}
            }),
            invalidatesTags:["AdminPlaces"]
        }),

        // Reviews
        getAllReviewsAdmin: builder.query({
            query: () => "/admin/reviews",
            providesTags:["AdminReviews"]
        }),

        getFlaggedReviews: builder.query({
            query: () => "/admin/reviews/flagged",
            providesTags:["AdminReviews"]
        }),
        adminDeleteReview: builder.mutation({
            query: (id) => ({
                url: `/admin/reviews/${id}/delete`,
                method:"PATCH"
            }),
            invalidatesTags:["AdminReviews"]
        }),
        restoreReview: builder.mutation({
            query: (id) => ({
                url: `/admin/reviews/${id}/restore`,
                method:"PATCH"
            }),
            invalidatesTags:["AdminReviews"]
        }),
        hardDeleteReview: builder.mutation({
            query: (id) => ({
                url: `/admin/reviews/${id}`,
                method:"DELETE"
            }),
            invalidatesTags:["AdminReviews"]
        }),


        // Owner Verification
        getPendingOwners: builder.query({
            query: () => "/admin/owners/pending",
            providesTags:["AdminOwners"]
        }),
        reviewOwner: builder.mutation({
            query: ({ userId, status, rejectedReason }) => ({
                url: `/admin/owners/${userId}`,
                method: "PATCH",
                body:{status,rejectedReason}
            }),
            invalidatesTags:["AdminOwners","AdminUsers"]
        }),

        // Reports

        getAllReports: builder.query({
            query: () => "/admin/reports",
            providesTags:["AdminReports"]
        }),
        getPendingReports: builder.query({
            query: () => "/admin/reports/pending",
            providesTags:["AdminReports"]
        }),
        resolveReport: builder.mutation({
            query: ({ id, adminNote }) => ({
                url: `/admin/reports/${id}/resolve`,
                method: "PATCH",
                body:{adminNote}
            }),
            invalidatesTags:["AdminReports"]
        }),
        rejectReport: builder.mutation({
            query: ({ id, adminNote }) => ({
                url: `/admin/reports/${id}/reject`,
                method: "PATCH",
                body:{adminNote}
            }),
            invalidatesTags:["AdminReports"]
        })
    })
});

export const {
    useGetAdminDashboardQuery,
    useGetAllUsersQuery,
    useBlockUserMutation,
    useUnBlockUserMutation,
    useGetAllPlacesAdminQuery,
    useGetPendingPlacesQuery,
    useApprovePlaceMutation,
    useRejectedPlaceMutation,
    useToggleFeaturePlaceMutation,
    useGetAllReviewsAdminQuery,
    useGetFlaggedReviewsQuery,
    useAdminDeleteReviewMutation,
    useRestoreReviewMutation,
    useHardDeleteReviewMutation,
    useGetPendingOwnersQuery,
    useReviewOwnerMutation,
    useGetAllReportsQuery,
    useGetPendingReportsQuery,
    useResolveReportMutation,
    useRejectReportMutation
} = adminApi;