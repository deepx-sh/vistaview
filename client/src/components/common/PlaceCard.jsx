import { Star } from "lucide-react";
import { Link } from "react-router-dom";

import React from 'react'
import WishlistButton from "./WishlistButton";

const PlaceCard = ({place}) => {
  return (
      <Link to={`/places/${place._id}`} className="bg-surface border border-border rounded-lg overflow-hidden hover:shadow-md transition duration-200">
          
          <div className="relative">
              <img src={place.images?.[0]?.url} alt={place.name} className="w-full h-48 object-cover" />
              <div className="absolute top-3 right-3">
                  <WishlistButton placeId={place._id} />
              </div>
          </div>
          
          <div className="p-5">
              <h3 className="font-semibold text-lg mb-1">
                  {place.name}
              </h3>

              <p className="text-text-secondary text-sm line-clamp-2 mb-3">{place.description}</p>

              <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1 text-warning">
                      <Star size={14} />
                      {place.averageRating || "0.0"}
                  </span>

                  <span className="font-medium text-primary">₹{place.pricing.min}-{place.pricing.max}</span>
              </div>
          </div>
    </Link>
  )
}

export default PlaceCard