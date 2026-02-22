import React from 'react'
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import { useSearchParams } from 'react-router-dom';
import { useGetPlacesQuery } from '../features/places/placeApi';
import PlaceCard from '../components/common/PlaceCard';

const Place = () => {
    const [searchParams] = useSearchParams();

    const page = searchParams.get("page") || 1;
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const rating = searchParams.get("rating") || "";

    const { data, isLoading } = useGetPlacesQuery({
        page,
        search,
        category,
        rating
    })
  return (
      <div className='max-w-7xl mx-auto px-6 py-12'>
          <h1 className='text-3xl font-semibold mb-8'>
              Explore Places
          </h1>

          {isLoading ? (
              <LoadingSkeleton/>
          ) : (
                  <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
                      {data?.data?.map((place) => (
                          <PlaceCard key={place._id} place={place} />
                      ))}
                  </div>
          )}
    </div>
  )
}

export default Place