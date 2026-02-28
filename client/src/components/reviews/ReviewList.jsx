import { useGetPlaceReviewsQuery } from "../../features/reviews/reviewsApi";
import React from 'react'
import ReviewCards from "./ReviewCards";

const ReviewList = ({placeId}) => {
    const { data, isLoading } = useGetPlaceReviewsQuery(placeId);

    if (isLoading) return <p>Loading reviews...</p>
    
    if (!data?.data?.length) {
        return <p className="text-text-muted">No reviews yet</p>
    }
  return (
      <div className="space-y-6">
          {data?.data?.map((review) => (
              <ReviewCards key={review._id} review={review} />
          ))}
    </div>
  )
}

export default ReviewList