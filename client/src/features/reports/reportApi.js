import { baseApi } from './../../services/api/baseApi';

export const reportApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        reportReview: builder.mutation({
            query: (data) => ({
                url: "/reports",
                method: "POST",
                body:data
            })
        })
    })
})


export const {useReportReviewMutation}=reportApi