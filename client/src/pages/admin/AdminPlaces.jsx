import React from 'react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { Star } from 'lucide-react'
import { useGetAllPlacesAdminQuery,useApprovePlaceMutation,useRejectedPlaceMutation,useToggleFeaturePlaceMutation } from '../../features/admin/adminApi'
import StatusBadges from '../../components/admin/places/StatusBadges';
import RejectModal from '../../components/admin/places/RejectModal';
const AdminPlaces = () => {
    const { data: res, isLoading } = useGetAllPlacesAdminQuery()
    const [approvePlace, { isLoading: isApproving }] = useApprovePlaceMutation()
    const [rejectPlace, { isLoading: isRejecting }] = useRejectedPlaceMutation()
    const [toggleFeature] = useToggleFeaturePlaceMutation()
    const [rejectTarget, setRejectTarget] = useState(null)
    const [filter, setFilter] = useState("all");

    const places = res?.data?.places ?? []
    const filtered = filter === "all" ? places : places.filter((p) => p.status === filter)
    
    const handleApprove = async (id) => {
        try {
            await approvePlace(id).unwrap()
            toast.success("Place approved")
        } catch (error) {
            toast.error(error?.data?.message || "Failed to approve")
        }
    }

    const handleReject = async ({ reason }) => {
        try {
            await rejectPlace({ id: rejectTarget._id, reason }).unwrap()
            toast.success("Place rejected")
            setRejectTarget(null)
        } catch (error) {
            toast.error(error?.data?.message || "Failed to reject")
        }
    }

    const handleToggleFeature = async (place) => {
        try {
            await toggleFeature({ id: place._id, isFeatured: !place.isFeatured }).unwrap()
            toast.success(place.isFeatured ? "Un-featured" : "Featured")
        } catch (error) {
            toast.error(error?.data?.message || "Failed")
        }
    }

    if(isLoading) return <p className='text-gray-400 text-center py-20'>Loading...</p>
  return (
      <div className='max-w-6xl mx-auto space-y-5'>
          <div className='flex items-center justify-between gap-3 flex-wrap'>
              <h1 className='text-2xl font-semibold'>Places</h1>
              <div className='flex gap-2'>
                  {["all", "pending", "approved", "rejected"].map((f) => (
                      <button key={f}
                          onClick={() => setFilter(f)}
                          className={`text-xs px-3 py-1.5 cursor-pointer rounded-md border transition ${filter===f ?"bg-primary text-white border-primary":"border-gray-300 hover:border-gray-50"}`}
                      >
                          {f.charAt(0).toUpperCase()+f.slice(1)}
                      </button>
                  ))}
              </div>
          </div>
          <p className='text-sm text-gray-500'>{filtered.length} Places</p>

          <div className='border rounded-lg bg-white overflow-hidden overflow-x-auto'>
              <table className='w-full text-sm min-w-[700px]'>
                  <thead className='border-b'>
                      <tr>
                          <th className='text-left px-4 py-3 font-medium text-gray-500 text-xs'>Places</th>
                      <th className='text-left px-4 py-3 font-medium text-gray-500 text-xs'>Owner</th>
                      <th className='text-left px-4 py-3 font-medium text-gray-500 text-xs'>Category</th>
                      <th className='text-left px-4 py-3 font-medium text-gray-500 text-xs'>Status</th>
                      <th className='text-left px-4 py-3 font-medium text-gray-500 text-xs'>Rating</th>
                      <th className='text-right px-4 py-3 font-medium text-gray-500 text-xs'>Actions</th>
                      </tr>
                  </thead>

                  <tbody>
                      {filtered.map((place) => (
                          <tr key={place._id} className='border-b last:border-none hover:bg-gray-50 transition'>
                              <td className='px-4 py-3'>
                                  <div className='flex items-center gap-2'>
                                      {place.images?.[0]?.url && (
                                          <img src={place.images[0].url} alt="preview" className='w-10 h-10 rounded object-cover shrink-0'/>
                                      )}
                                      <div>
                                      <p className='font-medium leading-tight'>{place.name}</p>
                                      <p className='text-xs text-gray-400'>{place.location?.city}</p>
                                  </div>
                                  </div>
                              </td>

                              <td className='px-4 py-3 text-xs text-gray-500'>{place.owner?.name ?? "--"}</td>
                              <td className='px-4 py-3 text-xs capitalize'>{place.category}</td>
                              <td className='px-4 py-3 '><StatusBadges status={place.status} /></td>
                              <td className='px-4 py-3 text-xs text-gray-500'>
                                  <span className='flex items-center gap-1'>
                                      <Star size={11} className='text-amber-400 fill-amber-400' />
                                      {place.averageRating?.toFixed(1) ?? "0.0"}
                                  </span>
                              </td>

                              <td className='px-4 py-3'>
                                  <div className='flex items-center gap-3 justify-end flex-wrap'>
                                      {place.status === "pending" && (
                                          <>
                                              <button onClick={() => handleApprove(place._id)} disabled={isApproving} className='text-xs cursor-pointer text-green-600 hover:underline disabled:opacity-50'>Approve</button>
                                              <button onClick={()=>setRejectTarget(place)} className='text-xs text-red-500 cursor-pointer hover:underline'>Reject</button>
                                          </>
                                      )}

                                      {place.status === "approved" && (
                                          <button onClick={() => handleToggleFeature(place)} className={`text-xs cursor-pointer hover:underline ${place.isFeatured ? "text-amber-500" : "text-gray-500"}`}>
                                              {place.isFeatured ? "Un-feature": "Feature"}
                                          </button>
                                      )}

                                      {place.status === "rejected" && (
                                          <button onClick={() => handleApprove(place._id)} disabled={isApproving} className='text-xs cursor-pointer text-green-600 hover:underline disabled:opacity-50'>
                                              Approve
                                          </button>
                                      )}
                                  </div>
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>

          {rejectTarget && (
              <RejectModal
                  place={rejectTarget}
                  onClose={() => setRejectTarget(null)}
                  onConfirm={handleReject}
                  isLoading={isRejecting}
              />
          )}
    </div>
  )
}

export default AdminPlaces