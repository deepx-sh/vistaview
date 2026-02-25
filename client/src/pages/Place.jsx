import React from 'react'
import PlacesFilters from '../components/common/PlacesFilters';
import { useSearchParams } from 'react-router-dom';
import { useGetPlacesQuery } from '../features/places/placeApi';
import LoadingSkeleton from './../components/common/LoadingSkeleton';
import PlaceCard from './../components/common/PlaceCard';
import Pagination from '../components/common/Pagination';
import ActiveFilterChips from '../components/common/ActiveFilterChips';

const Place = () => {
    const [searchParams] = useSearchParams();

    const { data, isLoading } = useGetPlacesQuery(Object.fromEntries(searchParams));
  return (
      <div className='max-w-7xl mx-auto px-6 py-12'>
          <h1 className='text-3xl font-semibold mb-6'>
              Explore Places
          </h1>

          <PlacesFilters />
          <ActiveFilterChips/>
          {isLoading ? (
              <LoadingSkeleton/>
          ) : (
                  <>
                      {!isLoading && (
                          <div className='flex justify-between items-center mb-6'>
                              <p className='text-sm text-text-secondary'>
                                  {data?.data?.total || 0} result found
                              </p>
                          </div>
                      )}
                      <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8'>
                      {data?.data?.places?.length === 0 ? (
                          <h5>No Places Found</h5>
                      ) : (
                              data?.data?.places?.map((place) => (
                                  <PlaceCard key={place._id} place={place}/>
                              ))
                      )} 
                      </div>
                      
                      {data?.data?.pages > 1 && (
                          <Pagination currentPage={Number(searchParams.get("page")) || 1} totalPages={data.data.pages}/>
                      )}
                  </>
          )}
    </div>
  )
}

export default Place