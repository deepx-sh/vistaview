import React from 'react'
import PlacesFilters from '../components/common/PlacesFilters';
import { useSearchParams } from 'react-router-dom';
import { useGetPlacesQuery } from '../features/places/placeApi';
import LoadingSkeleton from './../components/common/LoadingSkeleton';
import PlaceCard from './../components/common/PlaceCard';

const Place = () => {
    const [searchParams] = useSearchParams();

    const { data, isLoading } = useGetPlacesQuery(Object.fromEntries(searchParams));
  return (
      <div className='max-w-7xl mx-auto px-6 py-12'>
          <h1 className='text-3xl font-semibold mb-6'>
              Explore Places
          </h1>

          <PlacesFilters />
          
          {isLoading ? (
              <LoadingSkeleton/>
          ) : (
                  <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8'>
                      {data?.data?.places?.length === 0 ? (
                          <h5>No Places Found</h5>
                      ) : (
                              data?.data?.places?.map((place) => (
                                  <PlaceCard key={place._id} place={place}/>
                              ))
                      )} 
                  </div>
          )}
    </div>
  )
}

export default Place