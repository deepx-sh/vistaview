import React, { useState, useRef, useEffect } from 'react'
import { Bell,MessageSquare,Star,ShieldCheck,Trash2,CheckCheck,X, Key } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useGetNotificationsQuery,useMarkAsReadMutation,useMarkAllAsReadMutation,useDeleteNotificationMutation,useClearAllNotificationsMutation } from '../../features/notification/notificationApi'

const TYPE_ICON = {
    review: <Star size={14} className='text-warning' />,
    reply: <MessageSquare size={14} className='text-primary' />,
    admin: <ShieldCheck size={14} className='text-danger' />,
}

const NotificationItem = ({ notification, onRead, onDelete }) => {
    const timeAgo= (date) => {
        const diff = Date.now() - new Date(date).getTime()
        const mins = Math.floor(diff / 60000)
        if (mins < 1) return "just now";
        if (mins < 60) return `${mins}m ago`;
        const hrs = Math.floor(mins / 60);
        if (hrs < 24) return `${hrs}h ago`
        const days = Math.floor(hrs / 24);
        if (days < 7) return `${days}d ago`
        return new Date(date).toLocaleDateString("en-IN",{day:"numeric",month:"short"})
    }

    return (
        <div className={`flex items-start gap-3 px-4 py-3 hover:bg-background transition duration-150 group ${!notification.isRead ? "bg-primary/5" : ""}`}>
            <div className='mt-1 shrink-0 w-2 h-2 rounded-full'>
                {!notification.isRead && <div className='w-2 h-2 rounded-full bg-primary'/>}
            </div>

            <div className='mt-0.5 shrink-0'>
                {TYPE_ICON[notification.type] ?? <Bell size={14} className='text-text-muted'/>}
            </div>

            <div className='flex-1 min-w-0 cursor-pointer' onClick={()=>onRead(notification)}>
                <p className={`text=-sm leading-snug ${!notification.isRead ? "font-medium" : "text-text-secondary"}`}>
                    {notification.message}
                </p>
                <p className='text-xs text-text-muted mt-0.5'>{timeAgo(notification.createdAt)}</p>
            </div>

            <button onClick={(e) => { e.stopPropagation(); onDelete(notification._id); }} className='shrink-0 opacity-0 group-hover:opacity-100 text-text-muted hover:text-danger transition'>
                <X size={14}/>
            </button>
        </div>
    )
}
const NotificationBell = () => {
    const [open, setOpen] = useState(false);
    const panelRef = useRef(null);
    const navigate = useNavigate();

    const { data, isLoading } = useGetNotificationsQuery(undefined, {
        pollingInterval:30000
    })

    const [markAsRead] = useMarkAsReadMutation();
    const [markAllAsRead] = useMarkAllAsReadMutation();
    const [deleteNotification] = useDeleteNotificationMutation();
    const [clearAll] = useClearAllNotificationsMutation()
    
    const notifications = data?.data?.notifications ?? [];
    const unreadCount = data?.data?.unreadCount ?? 0;

    useEffect(() => {
        const handler = (e) => {
            if (panelRef.current && !panelRef.current.contains(e.target)) {
                setOpen(false)
            }
        }

        if (open) document.addEventListener("mousedown", handler);
        return ()=>document.removeEventListener("mousedown",handler)
    }, [open])
    
    const handleRead = async (notification) => {
        if (!notification.isRead) {
            await markAsRead(notification._id);
        }

        if (notification.link) {
            navigate(notification.link)
            setOpen(false);
        }
    }

    const handleDelete = async (id) => {
        await deleteNotification(id);
    }

    const handleMarkAll = async () => {
        await markAllAsRead();
    }

    const handleClearAll = async () => {
        await clearAll()
    }
  return (
      <div className='relative' ref={panelRef}>
          <button onClick={() => setOpen((prev) => !prev)} className='relative cursor-pointer p-1.5 rounded-md hover:bg-border/50 transition duration-200' aria-label='Notifications'>
              <Bell size={20} />
              {unreadCount > 0 && (
                  <span className='absolute -top-0.5 -right-0.5 min-w-4.5 h-4.5 px-1 bg-danger text-white text-[10px] font-medium rounded-full flex items-center justify-center leading-none'>
                      {unreadCount > 99 ? "99+": unreadCount}
                  </span>
              )}
          </button>

          {open && (
              <div className='absolute right-0 top-full mt-2 w-80 bg-surface border border-border rounded-xl shadow-ld z-50 overflow-hidden'>
                  <div className='flex items-center justify-between px-4 py-2 border-b border-border'>
                      <h3 className='text-sm font-semibold'>Notifications</h3>
                      <div className='flex items-center gap-2'>
                          {unreadCount > 0 && (
                              <button onClick={handleMarkAll} className='flex items-center gap-1 text-xs text-primary hover:underline'>
                                  <CheckCheck size={13} />
                                  Mark all read
                              </button>
                          )}
                          {notifications.length > 0 && (
                              <button onClick={handleClearAll} className='flex items-center gap-1 text-xs text-text-muted hover:text-danger'>
                                  <Trash2 size={13} />
                                  Clear all
                              </button>
                          )}
                      </div>
                  </div>

                  <div className='max-h-90 overflow-y-auto divide-y divide-border'>
                      {isLoading ? (
                          <div className='px-4 py-8 text-center text-sm text-text-muted'>
                              Loading...
                          </div>
                      ) : notifications.length === 0 ? (
                              <div className='flex flex-col items-center gap-2 px-4 py-10 text-text-muted'>
                                  <Bell size={28} className='opacity-30' />
                                  <p className='text-sm'>No notifications yet</p>
                              </div>
                          ) : (
                                  notifications.map((n) => (
                                      <NotificationItem key={n._id} notification={n} onRead={handleRead} onDelete={handleDelete}/>
                                  ))
                      )}
                  </div>

                  {notifications.length > 0 && (
                      <div className='px-4 py-2.5 border-t border-border text-center'>
                          <p className='text-xs text-text-muted'>
                              {unreadCount > 0 ? `${unreadCount} unread`:"All caught up"}
                          </p>
                      </div>
                  )}
              </div>
          )}
    </div>
  )
}

export default NotificationBell