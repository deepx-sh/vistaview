import { baseApi } from './../../services/api/baseApi';

export const reportApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        reportReview: builder.mutation({
            query: (data) => ({
                url: "/reports",
                method: "POST",
                body:data
            }),
            invalidatesTags: (result, error, { targetId }) => [
                { type: "Review", id: targetId },
                {type:"Place",id:targetId}
            ]
        })
    })
})


export const {useReportReviewMutation}=reportApi