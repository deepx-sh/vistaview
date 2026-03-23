import { baseApi } from "../../services/api/baseApi";

export const notificationApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getNotifications: builder.query({
            query: () => "/notifications",
            providesTags:["Notifications"]
        }),

        markAsRead: builder.mutation({
            query: (id) => ({
                url: `/notifications/${id}/read`,
                method:"PATCH"
            }),

            async onQueryStarted(id, { dispatch, queryFulfilled }) {
                const patch = dispatch(
                    notificationApi.util.updateQueryData("getNotifications", undefined, (draft) => {
                        const n = draft.data?.notifications?.find((n) => n._id === id)
                        if (n) n.isRead = true;
                        if (draft.data?.unreadCount > 0) draft.data.unreadCount -= 1;
                    })
                )

                try {
                    await queryFulfilled;
                } catch  {
                    patch.undo()
                }
            }
        }),

        markAllAsRead: builder.mutation({
            query: () => ({
                url: "/notifications/read-all",
                method:"PATCH"
            }),
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                const patch = dispatch(
                    notificationApi.util.updateQueryData("getNotifications", undefined, (draft) => {
                        draft.data?.notifications?.forEach((n) => (n.isRead = true))
                        if (draft.data) draft.data.unreadCount = 0;
                    })
                )

                try {
                    await queryFulfilled;
                } catch  {
                    patch.undo()
                }
            }
        }),

        deleteNotification: builder.mutation({
            query: (id) => ({
                url: `/notifications/${id}`,
                method:"DELETE"
            }),

            async onQueryStarted(id, { dispatch, queryFulfilled }) {
                const patch = dispatch(
                    notificationApi.util.updateQueryData("getNotifications", undefined, (draft) => {
                        if (!draft.data) return;

                        const idx = draft.data.notifications.findIndex((n) => n._id === id)
                        if (idx !== -1) {
                            const wasUnread = !draft.data.notifications[idx].isRead;
                            draft.data.notifications.splice(idx, 1);
                            if(wasUnread && draft.data.unreadCount>0) draft.data.unreadCount-=1
                        }
                    })
                )

                try {
                    await queryFulfilled;
                } catch  {
                    patch.undo()
                }
            }
        }),

        clearAllNotifications:builder.mutation({
            query: () => ({
                url: "/notifications",
                method:"DELETE"
            }),
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                const patch = dispatch(
                    notificationApi.util.updateQueryData("getNotifications", undefined, (draft) => {
                        if (draft.data) {
                            draft.data.notifications = []
                            draft.data.unreadCount=0
                       }
                    })
                )

                try {
                    await queryFulfilled;
                } catch  {
                    patch.undo()
                }
            }
        })
    })
});

export const {useGetNotificationsQuery,useMarkAsReadMutation,useMarkAllAsReadMutation,useDeleteNotificationMutation,useClearAllNotificationsMutation}=notificationApi