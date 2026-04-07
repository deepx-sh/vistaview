import { baseApi } from "../../services/api/baseApi";

export const wishlistApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getWishlist: builder.query({
            query: () => "/wishlist",
            providesTags: (result) =>
                result?.data?.data
                    ? [
                        ...result.data.data.map(({ _id }) => ({ type: "Wishlist", id: _id })),
                        {type:"Wishlist",id:"LIST"}
                    ]
                    :[{type:"Wishlist",id:"LIST"}]
        }),

        addToWishlist: builder.mutation({
            query: (placeId) => ({
                url: `/wishlist/${placeId}`,
                method:"POST"
            }),
            async onQueryStarted(placeId, { dispatch, queryFulfilled }) {
                const patch = dispatch(
                    wishlistApi.util.updateQueryData("getWishlist", undefined, (draft) => {
                        // draft.data?.push({_id:placeId})
                        const list = draft?.data?.data;
                        if (Array.isArray(list)) {
                            list.push({ _id: placeId });
                            draft.data.count = list.length;
                        }
                    })
                )
                try { await queryFulfilled; }
                catch {patch.undo()}
            },
            invalidatesTags:[{type:"Wishlist",id:"LIST"}]
        }),

        removeFromWishlist: builder.mutation({
            query: (placeId) => ({
                url: `/wishlist/${placeId}`,
                method:"DELETE"
            }),
            async onQueryStarted(placeId, { dispatch, queryFulfilled }) {
                const patch = dispatch(
                    wishlistApi.util.updateQueryData("getWishlist", undefined, (draft) => {
                        const list = draft?.data?.data;
                        if (Array.isArray(list)) {
                            const idx = list.findIndex((p) => p._id === placeId);
                            if (idx !== -1) {
                                list.splice(idx, 1);
                                draft.data.count = list.length;
                            }
                        }
                    })
                )

                try { await queryFulfilled; }
                catch {patch.undo()}
            },
            invalidatesTags:[{type:"Wishlist",id:"LIST"}]
        })
    })
});

export const {useGetWishlistQuery,useAddToWishlistMutation,useRemoveFromWishlistMutation} =wishlistApi