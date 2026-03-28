import { Star,Zap } from "lucide-react";
import { Link } from "react-router-dom";
import React from 'react'
import WishlistButton from "./WishlistButton";

const PlaceCard = ({place}) => {
  return (
      <Link to={`/places/${place._id}`} className="bg-surface border border-border rounded-lg overflow-hidden hover:shadow-md transition duration-200 flex flex-col">
          
          <div className="relative">
              <img src={place.images?.[0]?.url} alt={place.name} className="w-full h-48 object-cover" />
              {place.isFeatured && (
                  <div className="absolute top-3 left-3 flex items-center gap-1 bg-warning text-white text-xs font-medium px-2 py-1 rounded-full">
                      <Zap size={11} className="fill-white" />
                      Featured
                  </div>
              )}
              <div className="absolute top-3 right-3">
                  <WishlistButton placeId={place._id} />
              </div>
          </div>
          
          <div className="p-5 flex flex-col flex-1">
              <h3 className="font-semibold text-lg mb-1 line-clamp-1">
                  {place.name}
              </h3>

              <p className="text-text-secondary text-sm line-clamp-2 mb-3 flex-1">{place.description}</p>

              <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1 text-warning">
                      <Star size={14} className="fill-warning"/>
                      {place.averageRating?.toFixed(1) || "0.0"}
                      <span className="text-text-muted ml-1">({place.totalReviews || 0})</span>
                  </span>

                  <span className="font-medium text-primary">₹{place.pricing.min}-{place.pricing.max}</span>
              </div>
          </div>
    </Link>
  )
}

export default PlaceCard