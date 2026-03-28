import React from 'react'
import { Link } from 'react-router-dom'
import { Zap, ArrowRight } from 'lucide-react'
import { useGetFeaturedPlacesQuery } from '../../features/places/placeApi'
import PlaceCard from '../common/PlaceCard'

const FeaturedPlaces = () => {
    const { data, isLoading } = useGetFeaturedPlacesQuery();
    const places = data?.data?.places ?? []
    
    if(!isLoading && places.length===0) return null
  return (
      <section className='py-20 px-6'>
          <div className='max-w-6xl mx-auto'>
              
              {/* Header */}
              <div className='flex items-center justify-between mb-10'>
                  <div>
                      <div className='flex items-center gap-2 mb-2'>
                          <Zap size={18} className='text-warning fill-warning' />
                          <span className='text-sm font-medium text-warning uppercase tracking-wide'>
                              Featured
                          </span>
                      </div>
                      <h2 className='text-3xl font-semibold'>Hand-Picked Places</h2>
                      <p className='text-text-secondary mt-1 text-sm'>
                          Curated by our team for exceptional experiences
                      </p>
                  </div>

                  <Link to="/places" className='hidden sm:flex items-center gap-1.5 text-sm text-primary border border-primary/30 px-4 py-2 rounded-md hover:bg-primary/5 transition duration-200'>
                      View all
                      <ArrowRight size={14}/>
                  </Link>
              </div>

              {isLoading ? (
                  <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
                      {Array.from({ length: 3 }).map((_, i) => (
                          <div key={i} className='bg-surface border border-border rounded-lg p-5 animate-pulse'>
                              <div className='h-48 bg-border rounded mb-4'></div>
                              <div className='h-4 bg-border rounded w-3/4 mb-2'></div>
                              <div className='h-4 bg-border rounded w-1/2'></div>
                          </div>
                      ))}
                  </div>
              ) : (
                      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
                          {places.map((place) => (
                              <PlaceCard key={place._id} place={place} />
                          ))}
                      </div>
              )}

              <div className='mt-8 text-center sm:hidden'>
                  <Link to="/places" className='inline-flex items-center gap-1.5 text-sm text-primary border border-primary/30 px-5 py-2 rounded-md hover:bg-primary/5 transition'>
                      View all places
                    <ArrowRight size={14}/>
                  </Link>
              </div>
          </div>
    </section>
  )
}

export default FeaturedPlaces