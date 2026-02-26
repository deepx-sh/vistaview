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
            providesTags:["Places"]
        })
    })
});

export const {useGetPlacesQuery,useGetPlaceByIdQuery}=placeApi