import React from 'react'
import {useParams} from 'react-router-dom'
import { Star, MapPin, Heart } from 'lucide-react'
import LoadingSkeleton from './../components/common/LoadingSkeleton';
import { useGetPlaceByIdQuery } from '../features/places/placeApi';
import ImageGallery from '../components/common/ImageGallery';
import WishlistButton from '../components/common/WishlistButton';


const PlaceDetails = () => {
    const { id } = useParams();
    const { data: place, isLoading } = useGetPlaceByIdQuery(id);

    if (isLoading) return <LoadingSkeleton />
    
    if(!place) return <p className='text-center py-20'>Place not found</p>
  return (
      <div className='max-w-6xl mx-auto px-6 py-12'>
          {/* Image */}
          <div className='mb-8'>
              <ImageGallery images={place?.data?.images}/>
          </div>

          {/* Header */}
          <div className='flex flex-col md:flex-row md:justify-between md:items-start gap-6 mb-8'>
              
              <div>
                  <h1 className='text-3xl font-semibold mb-2'>
                      {place.data.name}
                  </h1>

                  <div className='flex items-center gap-4 text-sm text-text-secondary'>
                      <span className='flex items-center gap-1 text-warning'>
                          <Star size={16} />
                          {place.data?.averageRating?.toFixed(1) || "0.0"}
                      </span>

                      <span className='flex items-center gap-1'>
                          <MapPin size={16} />
                          {place?.data?.location?.city}{", "}
                          {place?.data?.location?.state}
                      </span>
                  </div>
              </div>

              <div className='flex flex-col items-start md:items-end gap-3'>
                  <p className='text-2xl font-semibold text-primary'>
                        ${place.data.pricing.min} - ${place.data.pricing.max}
                  </p>

                  {/* Wishlist Button */}
                  <WishlistButton placeId={place.data._id}/>
              </div>
          </div>

          {/* Description */}
          <div className='mb-10'>
              <h2 className='text-xl font-semibold mb-3'>
                  About this place
              </h2>

              <p className='text-text-secondary leading-relaxed'>
                  {place?.data?.description}
              </p>
          </div>

          <div>
              <h2 className='tex-xl font-semibold mb-6'>
                  Reviews
              </h2>

              <p className='text-text-muted'>
                  Work in progress....
              </p>
          </div>
    </div>
  )
}

export default PlaceDetails