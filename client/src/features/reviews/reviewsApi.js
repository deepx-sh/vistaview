import { baseApi } from "../../services/api/baseApi";

export const reviewApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getPlaceReviews: builder.query({
            query: ({ placeId, page = 1, limit = 5, rating, sort = "newest" }) => ({
                url: `/reviews/place/${placeId}`,
                params:{page,limit,rating,sort}
            }),
            providesTags: (result, error, { placeId }) => [
                {type:"Review",id:placeId}
            ]
        }),

        addReview: builder.mutation({
            query: ({ placeId, data }) => ({
                url: `/reviews/${placeId}`,
                method: "POST",
                body:data
            }),
            invalidatesTags: (result, error, { placeId }) => [
                { type: "Review", id: placeId },
                {type:"Place",id:placeId}
            ]
        }),

        updateReview: builder.mutation({
            query: ({ reviewId, data,placeId }) => ({
                url: `/reviews/${reviewId}`,
                method: "PUT",
                body:data
            }),
            invalidatesTags: (result, error, { placeId }) => [
                { type: "Review", id: placeId },
                {type:"Place",id:placeId}
            ]
        }),

        deleteReview: builder.mutation({
            query: ({reviewId,placeId}) => ({
                url: `/reviews/${reviewId}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, { placeId }) => [
                { type: "Review", id: placeId },
                {type:"Place",id:placeId}
            ]
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