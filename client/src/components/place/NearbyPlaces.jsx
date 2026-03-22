import React from 'react'
import { useGetNearbyPlacesQuery } from '../../features/places/placeApi'
import { Link } from 'react-router-dom'
import { Star, MapPin } from 'lucide-react'

const NearbyPlaces = ({ coordinates, excludeId }) => {
    const [lng, lat] = coordinates;

    const { data, isLoading, isError } = useGetNearbyPlacesQuery(
        { lat, lng, distance: 20 },
        {skip:!lat || !lng}
    )

    const places = (data?.data?.places ?? []).filter((p) => p._id !== excludeId).slice(0, 4);

    if (isLoading) return <p className='text-sm text-text-muted'>Loading nearby places...</p>
    if(isError || places.length==0) return null
  return (
      <div>
          <h2 className='text-xl font-semibold mb-4'>Nearby Places</h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
              {places.map((place) => (
                  <Link key={place._id} to={`/places/${place._id}`} className='bg-surface border border-border rounded-lg overflow-hidden hover:shadow-md transition duration-200'>
                      <img src={place.images?.[0]?.url}
                          alt={place.name}
                          className='w-full h-36 object-cover'
                      />

                      <div className='p-3'>
                          <h3 className='font-medium text-sm leading-tight line-clamp-1 mb-1'>
                              {place.name}
                          </h3>

                          <div className='flex items-center justify-between text-xs text-text-secondary'>
                              <span className='flex items-center gap-1'>
                                  <MapPin size={11} />
                                  {place.location?.city}
                              </span>

                              <span className='flex items-center gap-1 text-warning'>
                                  <Star size={11} className='fill-warning' />
                                  {place.averageRating?.toFixed(1) || "0.0"}
                              </span>
                          </div>
                      </div>
                 </Link>
             ))}
          </div>
    </div>
  )
}

export default NearbyPlaces