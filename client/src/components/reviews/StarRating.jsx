import { Star } from "lucide-react";

import React from 'react'

const StarRating = ({rating,setRating}) => {
  return (
    <div className="flex items-center gap-2">
      {[1, 2, 3, 4, 5].map((value) => (
        <Star key={value} size={22} onClick={() => setRating(value)} className={`cursor-pointer ${value<=rating?"text-warning fill-warning":"text-text-muted"}`} />
      ))}
    </div>
  )
}

export default StarRating