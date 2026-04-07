import React from 'react'
import { Link } from 'react-router-dom';
import { useGetOwnerPlacesQuery, useDeletePlaceMutation } from '../../features/owner/ownerPlaceApi';
import toast from 'react-hot-toast';
import handleApiError from '../../utils/handleApiError';
import ConfirmModal from '../../components/common/ConfirmModal';
import { useState } from 'react';
const OwnerPlaces = () => {
  const { data, isLoading } = useGetOwnerPlacesQuery();
  const [deletePlace,{isLoading:isDeleting}] = useDeletePlaceMutation();


  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    placeId: null,
    placeName:""
  })

  const openDeleteConfirm = (place) => {
    setConfirmModal({
      isOpen: true,
      placeId: place._id,
      placeName:place.name
    })
  }

  const closeDeleteConfirm = () => {
    setConfirmModal({isOpen:false,placeId:null,placeName:""})
  }
  const places = data?.data?.places || [];

  const handleDelete = async () => {
    
    try {
      await deletePlace(confirmModal.placeId).unwrap();
      toast.success("Place deleted successfully")
      closeDeleteConfirm()
    } catch (error) {
      handleApiError(error, "Failed to delete place")
      closeDeleteConfirm()
    }
  }

  if(isLoading) return <p>Loading Places...</p>
  return (
    <div>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6'>
        <h1 className='text-2xl font-semibold'>
          My Places
        </h1>

        <Link to="/owner/add-place" className='bg-primary text-white px-4 py-2 hover:bg-primary-hover transition-colors duration-200 rounded-md text-sm text-center'>
            Add Place
        </Link>
      </div>

      {places.length === 0 ? (
          <p>No places added</p>
      ) : (
          <>
            {/* Desktop Table */}

            <div className='hidden md:block overflow-x-auto'>
              <table className='w-full border border-border'>
                <thead className='bg-surface text-left text-sm'>
                  <tr>
                    <th className='p-4'>Place</th>
                    <th className='p-4'>City</th>
                    <th className='p-4'>Rating</th>
                    <th className='p-4'>Status</th>
                    <th className='p-4'>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {places.map((place) => (
                    <tr key={place._id} className='border-t border-border text-sm'>
                      <td className='p-4 flex items-center gap-3'>
                        {place.images?.[0].url && (
                          <img src={place.images[0]?.url} alt="Place Thumbnail" className='w-12 h-12 rounded object-cover' />
                        )}
                        {place.name}
                      </td>

                      <td className='p-4'>{place.location.city}</td>
                      <td className='p-4'>{place.averageRating?.toFixed(1) || "0.0"}</td>
                      <td className='p-4'><span className={`px-3 py-1 rounded-full text-xs ${place.status === "approved" ? "bg-green-100 text-green-700" : place.status === "pending" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>{place.status}</span></td>

                      <td className='p-4'>
                        <div className='flex items-baseline gap-3'>
                          <Link to={`/owner/edit-place/${place._id}`} className='text-primary'>Edit</Link>
                        <button onClick={() => openDeleteConfirm(place)} className='text-red-600'>Delete</button>
                        <Link to={`/places/${place._id}`} className='text-gray-600'>View</Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}

            <div className='grid gap-4 md:hidden'>
              {places.map((place) => (
                <div key={place._id} className='border-border rounded-lg p-4'>
                  <div className='flex items-center gap-3 mb-3'>
                    {place.images[0]?.url && (
                      <img src={place.images[0].url} alt="Place Thumbnail" className='w-14 h-14 rounded object-cover' /> 
                    )}

                    <div>
                      <p className='font-medium'>{place.name}</p>
                      <p className='text-sm text-text-muted'>{place.location.city}</p>
                    </div>
                  </div>

                  <div className='flex justify-between text-sm mb-3'>
                    <span>⭐{place.averageRating?.toFixed(1) || "0.0"}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${place.status === "approved" ? "bg-green-100 text-green-700" : place.status === "pending" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>{place.status}</span>
                  </div>

                  <div className='flex gap-4 text-sm'>
                    <Link to={`/owner/edit-place/${place._id}`} className='text-primary'>Edit</Link>
                    <button onClick={() => openDeleteConfirm(place)} className='text-red-600'>Delete</button>
                    <Link to={`/places/${place._id}`} className='text-gray-600'>View</Link>
                  </div>
                </div>
                
              ))}
            </div>
          </>
      )}

      {
        <ConfirmModal
          isOpen={confirmModal.isOpen}
          onClose={closeDeleteConfirm}
          onConfirm={handleDelete}
          isLoading={isDeleting}
          title='Delete place?'
          message={`${confirmModal.placeName} will be permanently deleted along with all its reviews and images. This cannot be undone`}
          confirmLabel='Delete Place'
          variant="danger"
        />
      }
    </div>
  )
}

export default OwnerPlaces