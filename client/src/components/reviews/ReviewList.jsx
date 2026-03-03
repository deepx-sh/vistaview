import React from 'react'
import ReviewCards from './ReviewCards'
const ReviewList = ({ reviews, isLoading }) => {
    if (isLoading) return <p>Loading reviews...</p>
    
    if (!reviews.length) {
        return <p className='text-text-muted'>No reviews yet</p>
    }
  return (
      <div className='space-y-6'>
          {reviews.map((review) => (
              <ReviewCards key={review._id} review={review}/>
          ))}
    </div>
  )
}

export default ReviewList