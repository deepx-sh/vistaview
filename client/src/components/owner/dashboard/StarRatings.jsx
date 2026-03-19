import React from 'react'
import { Star } from 'lucide-react'
const StarRatings = ({rating}) => {
  return (
      <div className='flex gap-0.5'>
          {Array.from({ length: 5 }, (_, i) => (
              <Star key={i} size={12} className={i < Math.round(rating)? "fill-amber-400 text-amber-400":"text-gray-300"} />
          ))}
    </div>
  )
}

export default StarRatings