import { baseApi } from "../../services/api/baseApi";

export const placeApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getPlaces: builder.query({
            query: (params) => ({
                url: "/places/search",
                params
            }),
            providesTags:["Place"]
        }),
        getPlaceById: builder.query({
            query: (id) => `/places/${id}`,
            providesTags:["Place"]
        }),
        getNearbyPlaces: builder.query({
            query: ({ lat, lng, distance = 20 }) => `/places/nearby?lat=${lat}&lng=${lng}&distance=${distance}`,
            providesTags:["Place"]
        }),
        getFeaturedPlaces: builder.query({
            query: () => ({
                url: "/places/search",
                params:{isFeatured:true,limit:6}
            }),
            providesTags:["Place"]
        })
    })
});

export const {useGetPlacesQuery,useGetPlaceByIdQuery,useGetNearbyPlacesQuery,useGetFeaturedPlacesQuery}=placeApi