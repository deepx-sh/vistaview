import { baseApi } from "../../services/api/baseApi";

export const placeApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getPlaces: builder.query({
            query: (params) => ({
                url: "/places",
                params
            }),
            providesTags:["Place"]
        })
    })
});

export const {useGetPlacesQuery}=placeApi