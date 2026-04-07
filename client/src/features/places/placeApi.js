import { baseApi } from "../../services/api/baseApi";

export const placeApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getPlaces: builder.query({
            query: (params) => ({
                url: "/places/search",
                params
            }),
            providesTags: (result) =>
                result?.data?.places ? [
                    ...result.data.places.map(({ _id }) => ({ type: "Place", id: _id })),
                    {type:"Place",id:"LIST"}
                ]
                :[{type:"Place",id:"LIST"}]
        }),
        getPlaceById: builder.query({
            query: (id) => `/places/${id}`,
            providesTags:(result,error,id)=>[{type:"Place",id}]
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