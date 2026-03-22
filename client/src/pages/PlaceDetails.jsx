import React, {useState} from 'react'
import {useParams} from 'react-router-dom'
import { Star, MapPin, Heart, Eye, Flag } from 'lucide-react'
import LoadingSkeleton from './../components/common/LoadingSkeleton';
import { useGetPlaceByIdQuery } from '../features/places/placeApi';
import { useGetPlaceReviewsQuery } from '../features/reviews/reviewsApi';
import ImageGallery from '../components/common/ImageGallery';
import WishlistButton from '../components/common/WishlistButton';
import ReviewList from '../components/reviews/ReviewList';
import AddReviewForm from '../components/reviews/AddReviewForm';
import RatingBreakdown from '../components/reviews/RatingBreakdown';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import ReportPlaceModal from '../components/place/ReportPlaceModal';
import NearbyPlaces from '../components/place/NearbyPlaces';


const PlaceDetails = () => {
    const { id } = useParams();
    const { data: place, isLoading } = useGetPlaceByIdQuery(id);
    const { data: reviewData, isLoading: reviewLoading } = useGetPlaceReviewsQuery(id)
    const [showReportModal,setShowReportModal]=useState(false)
    
    if (isLoading) return <LoadingSkeleton />
    
    if (!place) return <p className='text-center py-20'>Place not found</p>
    
    const p = place.data;
    const coords = p.location?.coordinates;
    const hasCoords = Array.isArray(coords) && coords.length === 2;
  return (
      <div className='max-w-6xl mx-auto px-6 py-12'>
          {/* Image */}
          <div className='mb-8'>
              <ImageGallery images={p?.images}/>
          </div>

          {/* Header */}
          <div className='flex flex-col md:flex-row md:justify-between md:items-start gap-6 mb-8'>
              
              <div>
                  <h1 className='text-3xl font-semibold mb-2'>
                      {p.name}
                  </h1>

                  <div className='flex flex-wrap items-center gap-4 text-sm text-text-secondary'>
                      <span className='flex items-center gap-1 text-warning'>
                          <Star size={16} />
                          {p.averageRating?.toFixed(1) || "0.0"}
                          <span className='text-text-muted ml-1'>({p.totalReviews ?? 0})</span>
                      </span>

                      <span className='flex items-center gap-1'>
                          <MapPin size={16} />
                          {p.location?.city},
                          {p.location?.state}
                      </span>

                      <span className='flex items-center gap-1 text-text-muted'>
                          <Eye size={16} />
                          {(p.views ?? 0).toLocaleString()} views
                      </span>
                  </div>

                  <div className='flex flex-wrap gap-2 mt-3'>
                      {p.category && (
                          <span className='text-xs bg-primary/10 text-primary px-3 py-1 rounded-full capitalize'>
                              {p.category}
                          </span>
                      )}
                      {p.timings?.open && p.timings?.close && (
                          <span className='text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full'>
                              {p.timings.open} - {p.timings.close}
                          </span>
                      )}

                      {p.bestTimeToVisit && (
                          <span className='text-xs bg-amber-50 text-amber-700 px-3 py-1 rounded-full'>
                              Best: {p.bestTimeToVisit}
                          </span>
                      )}
                  </div>
              </div>

              <div className='flex flex-col items-start md:items-end gap-3 shrink-0'>
                  {p.pricing?.min != null && (
                      <p className='text-2xl font-semibold text-primary'>
                          ₹{place.data.pricing.min}
                          {p.pricing.max ? ` - ₹${p.pricing.max}` : "+"}
                  </p>
                  )}

                  {/* Wishlist Button */}
                  <WishlistButton placeId={place.data._id} />
                  
                  <button onClick={() => setShowReportModal(true)} className='flex items-center gap-1.5 text-xs text-text-muted hover:text-danger transition'>
                      <Flag size={13} />
                      Report this place
                  </button>
              </div>
          </div>

          {/* Description */}
          <div className='mb-10'>
              <h2 className='text-xl font-semibold mb-3'>
                  About this place
              </h2>

              <p className='text-text-secondary leading-relaxed'>
                  {p.description}
              </p>
          </div>

          {/* Ṃap */}
          {hasCoords && (
              <div className='mb-10'>
                  <h2 className='text-xl font-semibold mb-3'>Location</h2>
                  <p className='text-sm text-text-secondary mb-3'>{p.location?.address}</p>

                  <MapContainer center={[coords[1], coords[0]]} zoom={14} className='h-72 w-full rounded-xl' scrollWheelZoom={false}>
                      <TileLayer attribution='&copy; OpenStreetMap' url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
                      <Marker position={[coords[1], coords[0]]}>
                          <Popup>
                              <strong>{p.name}</strong>
                              <br />
                              {p.location?.address}
                          </Popup>
                      </Marker>
                  </MapContainer>
              </div>
          )}
          <div>
              <h2 className='tex-xl font-semibold mb-6'>
                  Reviews
              </h2>
              <RatingBreakdown reviews={reviewData?.data || []}/>
                <AddReviewForm placeId={id} reviews={reviewData?.data || []}/>
              <ReviewList reviews={reviewData?.data || []} isLoading={reviewLoading} />
          </div>

          {hasCoords && (
              <div className='mt-12'>
                  <NearbyPlaces coordinates={coords} excludeId={p._id} />
              </div>
          )}
          {showReportModal && (
              <ReportPlaceModal placeId={p._id} onClose={()=>setShowReportModal(false)}/>
          )}
    </div>
  )
}

export default PlaceDetails