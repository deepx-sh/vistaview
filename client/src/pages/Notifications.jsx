import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, MessageSquare, Star, ShieldCheck, Trash2, CheckCheck, X } from 'lucide-react'
import { useGetNotificationsQuery,useMarkAsReadMutation,useMarkAllAsReadMutation,useDeleteNotificationMutation,useClearAllNotificationsMutation } from '../features/notification/notificationApi'

const TYPE_ICON = {
    review: <Star size={14} className='text-warning' />,
    reply: <MessageSquare size={14} className='text-primary' />,
    admin: <ShieldCheck size={14} className='text-danger' />,
}

const TYPE_LABEL = {
    review: "New review",
    reply: "Owner replied",
    admin:"Admin notice"
}

const timeAgo= (date) => {
        const diff = Date.now() - new Date(date).getTime()
        const mins = Math.floor(diff / 60000)
        if (mins < 1) return "just now";
        if (mins < 60) return `${mins}m ago`;
        const hrs = Math.floor(mins / 60);
        if (hrs < 24) return `${hrs}h ago`
        const days = Math.floor(hrs / 24);
        if (days < 7) return `${days}d ago`
        return new Date(date).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})
    }
const Notifications = () => {
    const navigate = useNavigate();
    const { data, isLoading } = useGetNotificationsQuery();
    const [markAsRead] = useMarkAsReadMutation();
    const [markAllAsRead]=useMarkAllAsReadMutation()
    const [deleteNotification] = useDeleteNotificationMutation();
    const [clearAll] = useClearAllNotificationsMutation();

    const notifications = data?.data?.notifications ?? [];
    const unreadCount = data?.data?.unreadCount ?? 0;

    const handleClick = async (notification) => {
        if (!notification.isRead) await markAsRead(notification._id);
        if(notification.link) navigate(notification.link)
    }
    
    if (isLoading) {
        return (
            <div className='max-w-2xl mx-auto px-6 py-12'>
                <div className='space-y-3'>
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className='h-16 bg-border rounded-lg animate-pulse'/>
                    ))}
                </div>
            </div>
        )
    }
  return (
      <div className='max-w-2xl mx-auto px-6 py-12'>
          <div className='flex items-center justify-between mb-6'>
              <div>
                  <h1 className='text-2xl font-semibold'>Notifications</h1>
                  {unreadCount > 0 && (
                      <p className='text-sm text-text-muted mt-0.5'>
                          {unreadCount} unread
                      </p>
                  )}
              </div>

              <div className='flex items-center gap-3'>
                  {unreadCount > 0 && (
                      <button onClick={() => markAllAsRead()} className='flex items-center gap-1.5 text-sm text-primary border border-primary/30 px-3 py-1.5 rounded-md hover:bg-primary/5 transition'>
                          <CheckCheck size={15} />
                          Mark all read
                      </button>
                  )}

                  {notifications.length > 0 && (
                      <button onClick={() => clearAll()} className='flex items-center gap-1.5 text-sm text-text-muted border border-border px-3 py-1.5 rounded-md hover:text-danger hover:border-danger/40 transition'>
                          <Trash2 size={15} />
                          Clear all
                      </button>
                  )}
              </div>
          </div>

          {notifications.length === 0 ? (
              <div className='flex flex-col items-center gap-3 py-20 text-text-muted'>
                  <Bell size={40} className='opacity-20' />
                  <p className='text-base'>No notifications yet</p>
                  <p className='text-sm opacity-70'>
                      You'll be notified when someone reviews your place or an owner replies to you
                  </p>
              </div>
          ) : (
                  <div className='border border-border rounded-xl overflow-hidden divide-y divide-border'>
                      {notifications.map((n) => (
                          <div key={n._id} className={`flex items-start gap-4 px-5 py-4 group transition duration-150 ${n.isRead ? "bg-primary/5 hover:bg-primary/10" : "hover:bg-background"}`}>
                              <div className='mt-1.5 shrink-0 w-2'>
                                  {!n.isRead && (
                                      <div className='w-2 h-2 rounded-full bg-primary'/>
                                  )}
                              </div>

                              <div className='mt-1 shrink-0 w-6 flex items-center justify-center'>
                                  {TYPE_ICON[n.type] ?? <Bell size={16} className='text-text-muted'/>}
                              </div>

                              <div className='flex-1 min-w-0 cursor-pointer' onClick={() => handleClick(n)}>
                                  <div className='flex items-center gap-2 mb-0.5'>
                                      <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${n.type === "review" ? "bg-warning/10 text-amber-700" : n.type === "reply" ? "bg-primary/10 text-primary" : "bg-danger/10 text-danger"}`}>
                                          {TYPE_LABEL[n.type] ?? n.type}
                                      </span>
                                      <span className='text-xs text-text-muted'>{timeAgo(n.createdAt)}</span>
                                  </div>

                                  <p className={`text-sm leading-relaxed ${!n.isRead ? "font-medium" : "text-text-secondary"}`}>
                                      {n.message}
                                  </p>

                                  {n.link && (
                                      <p className='text-xs text-primary mt-1 opacity-0 group-hover:opacity-100 transition'>Click to view →</p>
                                  )}
                              </div>

                              <div className='shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition'>
                                  {!n.isRead && (
                                      <button onClick={(e) => { e.stopPropagation();  markAsRead(n._id)}} className='p-1.5 rounded-md hover:bg-primary/10 text-text-muted hover:text-primary transition' title='Mark as read'><CheckCheck size={14}/></button>
                                  )}

                                  <button onClick={(e) => { e.stopPropagation(); deleteNotification(n._id)}} className='p-1.5 rounded-md hover:bg-danger/10 text-text-muted hover:text-danger transition' title='Delete'><X size={14}/></button>
                              </div>
                          </div>
                      ))}
                  </div>
          )}
    </div>
  )
}

export default Notifications