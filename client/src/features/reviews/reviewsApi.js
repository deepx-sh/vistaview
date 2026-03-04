import { baseApi } from "../../services/api/baseApi";

export const reviewApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getPlaceReviews: builder.query({
            query: (placeId) => `/reviews/place/${placeId}`,
            providesTags:["Review"]
        }),

        addReview: builder.mutation({
            query: ({ placeId, data }) => ({
                url: `/reviews/${placeId}`,
                method: "POST",
                body:data
            }),
            invalidatesTags:["Review","Place"]
        }),

        updateReview: builder.mutation({
            query: ({ reviewId, data }) => ({
                url: `/reviews/${reviewId}`,
                method: "PUT",
                body:data
            }),
            invalidatesTags:["Review","Place"]
        }),

        deleteReview: builder.mutation({
            query: (reviewId) => ({
                url: `/reviews/${reviewId}`,
                method: "DELETE",
            }),
            invalidatesTags:["Review","Place"]
        }),
        toggleHelpful: builder.mutation({
            query: (reviewId) => ({
                url: `/reviews/${reviewId}/like`,
                method:"POST"
            }),
            invalidatesTags:["Review"]
        })
    })
});

export const {useGetPlaceReviewsQuery,useAddReviewMutation,useUpdateReviewMutation,useDeleteReviewMutation,useToggleHelpfulMutation}=reviewApi