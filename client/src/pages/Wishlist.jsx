import React from 'react'
import { useGetWishlistQuery } from '../features/wishlist/wishlistApi'
import PlaceCard from '../components/common/PlaceCard'


const Wishlist = () => {
    const { data, isLoading } = useGetWishlistQuery();

    if(isLoading) return <p className='text-center py-20'>Loading...</p>
  return (
      <div className='max-w-7xl mx-auto px-6 py-12'>
          <h1 className='text-3xl font-semibold mb-8'>
              My Wishlist
          </h1>

          {data?.data?.wishlist.length === 0 ? (
              <p>No saved places yet</p>
          ) : (
                  <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8'>
                      {data?.data?.wishlist.map((place) => (
                          <PlaceCard key={place._id} place={place} />
                      ))}
                  </div>
          )}
    </div>
  )
}

export default Wishlist