import { baseApi } from "../../services/api/baseApi";

export const wishlistApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getWishlist: builder.query({
            query: () => "/wishlist",
            providesTags:["Wishlist"]
        }),

        addToWishlist: builder.mutation({
            query: (placeId) => ({
                url: `/wishlist/${placeId}`,
                method:"POST"
            }),
            invalidatesTags:["Wishlist"]
        }),

        removeFromWishlist: builder.mutation({
            query: (placeId) => ({
                url: `/wishlist/${placeId}`,
                method:"DELETE"
            }),
            invalidatesTags:["Wishlist"]
        })
    })
});

export const {useGetWishlistQuery,useAddToWishlistMutation,useRemoveFromWishlistMutation} =wishlistApi