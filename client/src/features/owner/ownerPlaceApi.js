import { baseApi } from "../../services/api/baseApi";

export const ownerPlaceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOwnerPlaces: builder.query({
      query: () => "/places/owner",
      providesTags:["Place"]
    }),

    deletePlace: builder.mutation({
      query: (id) => ({
        url: `places/${id}`,
        method:"DELETE"
      }),
      invalidatesTags:["Place"]
    }),

    createPlace: builder.mutation({
      query: (formData) => ({
        url: "/places",
        method: "POST",
        body:formData
      }),
      invalidatesTags:["Place"]
    }),
    getOwnerPlace: builder.query({
      query:(id)=>`/places/${id}`
    }),

    updatePlace: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/places/${id}`,
        method: "PUT",
        body:formData
      }),
      invalidatesTags:["Place"]
    }),
    getOwnerReviews: builder.query({
      query: (params) => ({
        url: "/owners/reviews",
        params
      }),
      providesTags:["Review"]
    }),
    replyToReview: builder.mutation({
      query: ({ reviewId, text }) => ({
        url: `/owners/reviews/${reviewId}/reply`,
        method: "POST",
        body:{text}
      }),
      invalidatesTags:["Review"]
    }),
    updateReply: builder.mutation({
      query: ({ reviewId, text }) => ({
        url: `/owners/reviews/${reviewId}/reply`,
        method: "PUT",
        body:{text}
      }),
      invalidatesTags:["Review"]
    }),
    deleteReply: builder.mutation({
      query: (reviewId) => ({
        url: `/owners/reviews/${reviewId}/reply`,
        method:"DELETE"
      }),
      invalidatesTags:["Review"]
    })
  })
});

export const {useGetOwnerPlacesQuery,useDeletePlaceMutation,useCreatePlaceMutation,useGetOwnerPlaceQuery,useUpdatePlaceMutation,useGetOwnerReviewsQuery,useReplyToReviewMutation,useUpdateReplyMutation,useDeleteReplyMutation}=ownerPlaceApi