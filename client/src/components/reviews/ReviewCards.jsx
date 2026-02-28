import React from 'react'
import { Star } from 'lucide-react'
const ReviewCards = ({review}) => {
    const user = review.user
    const initials = user?.name
        ? user.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
        : "U";
  return (
      <div className='border border-border rounded-lg p-6 bg-surface'>
          
          {/* Header */}
          <div className='flex justify-between items-start mb-4'>
              <div className='flex items-center gap-4'>
                  {/* Avatar */}
                  {user?.avatar ? (
                      <img src={user.avatar} alt={user.name} className='w-10 h-10 rounded-full object-cover'/>
                  ) : (
                          <div className='w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-medium'>{initials}</div>
                  )}

                  {/* Name + Rating */}
                  <div>
                      <p className='font-medium'>{user?.name || "VistaView User"}</p>

                      <div className='flex items-center gap-1 text-warning text-sm'>
                          {Array.from({ length: review.rating }).map((_, i) => (
                              <Star key={i} size={14} fill='currentColor'/>
                          ))}
                        </div>
                  </div>
              </div>

              {/* Data */}
              <p className='text-xs text-text-muted'>
                  {new Date(review.createdAt).toLocaleDateString()}
              </p>
          </div>

          {/* Comment */}
          <p className='text-text-secondary text-sm mb-4'>
              {review.comment}
          </p>

          {/* Images */}
          {review.images?.length > 0 && (
              <div className='flex gap-3'>
                  {review.images.map((img, index) => (
                      <img key={index} src={img.url} alt="Review" className='w-20 h-20 object-cover rounded-md'/>
                  ))}
              </div>
          )}

          {/* Owner Reply */}
          {review.ownerReply && (
              <div className='mt-4 bg-primary/5 border border-primary/20 rounded-md p-4'>
                  <p className='text-sm font-medium mb-1'>
                      Owner Response:
                  </p>

                  <p className='text-sm text-text-secondary'>
                      {review.ownerReply}
                  </p>
              </div>
          )}
    </div>
  )
}

export default ReviewCards