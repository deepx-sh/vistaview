import { baseApi } from "../../services/api/baseApi";

export const ownerPlaceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOwnerPlaces: builder.query({
      query: () => "/places/owner",
      providesTags: (result) =>
        result?.data?.data 
          ? [
            ...result.data.data.map(({ _id }) => ({ type: "Place", id: _id })),
            {type:"Place",id:"OWNER_LIST"}
          ]
          :[{type:"Place",id:"OWNER_LIST"}]
    }),

    deletePlace: builder.mutation({
      query: (id) => ({
        url: `places/${id}`,
        method:"DELETE"
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Place", id },
        { type: "Place", id: "OWNER_LIST" },
        {type:"Place",id:"LIST"}
      ]
    }),

    createPlace: builder.mutation({
      query: (formData) => ({
        url: "/places",
        method: "POST",
        body:formData
      }),
      invalidatesTags: [
        { type: "Place", id: "OWNER_LIST" },
        {type:"Place",id:"LIST"}
      ]
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
      invalidatesTags: (result, error, { id }) => [
        { type: "Place", id },
        {type:"Place",id:"OWNER_LIST"}
      ]
    }),
    getOwnerReviews: builder.query({
      query: (params) => ({
        url: "/owners/reviews",
        params
      }),
      providesTags: (result) =>
        result?.data?.data
          ? [
            ...result.data.data.map(({ _id }) => ({ type: "Review", id: _id })),
            {type:"Review",id:"OWNER_LIST"}
          ]
          :[{type:"Review",id:"OWNER_LIST"}]
    }),
    replyToReview: builder.mutation({
      query: ({ reviewId, text }) => ({
        url: `/owners/reviews/${reviewId}/reply`,
        method: "POST",
        body:{text}
      }),
      invalidatesTags: (result, error, { reviewId }) => [
        { type: "Review", id: reviewId },
        {type:"Review",id:"OWNER_LIST"}
      ]
    }),
    updateReply: builder.mutation({
      query: ({ reviewId, text }) => ({
        url: `/owners/reviews/${reviewId}/reply`,
        method: "PUT",
        body:{text}
      }),
      invalidatesTags: (result, error, { reviewId }) => [
        { type: "Review", id: reviewId },
        {type:"Review",id:"OWNER_LIST"}
      ]
    }),
    deleteReply: builder.mutation({
      query: (reviewId) => ({
        url: `/owners/reviews/${reviewId}/reply`,
        method:"DELETE"
      }),
      invalidatesTags: (result, error, reviewId) => [
        { type: "Review", id: reviewId },
        {type:"Reviwe",id:"OWNER_LIST"}
      ]
    })
  })
});

export const {useGetOwnerPlacesQuery,useDeletePlaceMutation,useCreatePlaceMutation,useGetOwnerPlaceQuery,useUpdatePlaceMutation,useGetOwnerReviewsQuery,useReplyToReviewMutation,useUpdateReplyMutation,useDeleteReplyMutation}=ownerPlaceApi