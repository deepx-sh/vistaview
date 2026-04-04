import { useState } from "react";
import { Star, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";

import { useGetAllReviewsAdminQuery, useAdminDeleteReviewMutation, useRestoreReviewMutation, useHardDeleteReviewMutation } from "../../features/admin/adminApi";

import React from 'react'

const Stars = ({ rating }) => (
    <div className="flex gap-0.5">
        {Array.from({ length: 5 }, (_, i) => (
            <Star key={i} size={12} className={i<rating ? "fill-amber-400 text-amber-400":"text-gray-300"} />
        ))}
    </div>
)
const AdminReviews = () => {

    const { data: res, isLoading } = useGetAllReviewsAdminQuery();
    const [softDelete, { isLoading: isSoftDeleting }] = useAdminDeleteReviewMutation()
    const [restore, { isLoading: isRestoring }] = useRestoreReviewMutation()
    const [hardDelete, { isLoading: isHardDeleting }] = useHardDeleteReviewMutation()
    const [filter, setFilter] = useState("all")
    
    const reviews = res?.data?.reviews ?? []
    console.log(reviews);
    
    const filtered = reviews.filter((r) => {
        if (filter === "flagged") return r.spamScore >= 50
        if (filter === "deleted") return r.isDeleted
        return true;
    })

    const handleSoftDelete = async (id) => {
        if (!window.confirm("Soft-delete this review")) return
        try {
            await softDelete(id).unwrap()
            toast.success("Review soft deleted")
        } catch (error) {
            toast.error(error?.data?.message || "Failed to soft delete review")
        }
    }

    const handleRestore = async (id) => {
        try {
            await restore(id).unwrap()
            toast.success("Review restored")
        } catch (error) {
            toast.error(error?.data?.message || "Failed to restore review")
        }
    }

    const handleHardDelete = async (id) => {
        if (!window.confirm("Permanently delete? This cannot be undone")) return
        try {
            await hardDelete(id).unwrap()
            toast.success("Review permanently deleted")
        } catch (error) {
            toast.error(error?.data?.message || "Failed to hard delete review")
        }
    }

    if(isLoading) return <p className="text-gray-400 text-center py-20">Loading...</p>
  return (
      <div className="max-w-5xl mx-auto space-y-5">
          <div className="flex items-center justify-between gap-3 flex-wrap">
              <h1 className="text-2xl font-semibold">Reviews</h1>
              <div className="flex gap-2">
                  {["all", "flagged", "deleted"].map((f) => (
                      <button key={f} onClick={() => setFilter(f)} className={`text-xs cursor-pointer px-3 py-1.5 rounded-md border transition ${filter === f ? "bg-primary text-white border-primary" : "border-gray-300 hover:border-gray-50"}`}>
                          {f.charAt(0).toUpperCase()+ f.slice(1)}
                      </button>
                  ))}
              </div>
          </div>

          <p className="text-sm text-gray-500">{filtered.length} reviews</p>

          <div className="space-y-3">
              {filtered.map((review) => (
                  <div key={review._id} className={`border rounded-lg p-4 bg-white ${review.isDeleted ? "opacity-60" : ""}`}>
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                          <div className="flex items-center gap-2">
                              {review.user?.avatar ? (
                                  <img src={review.user.avatar} alt="avtar" className="w-8 h-8 rounded-full object-cover overflow-hidden"/>
                              ) : (
                                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
                                  {review.user?.name?.[0]?.toUpperCase() ?? "U"}
                              </div>
                              )}
                              <div>
                                  <p className="text-sm font-medium">{review.user?.name ?? "Unknown"}</p>
                                  <p className="text-xs text-gray-400">{review.user?.email}</p>
                              </div>
                          </div>

                          <div className="flex items-center gap-3 text-right">
                              <Stars rating={review.rating} />
                              {review.spamScore >= 50 && (
                                  <span className="flex items-center gap-1 text-xs text-red-500">
                                      <AlertTriangle size={12}/> Spam {review.spamScore}
                                  </span>
                              )}

                              {review.isDeleted && (
                                  <span className="text-xs bg-red-50 text-red-500 px-2 py-0.5 rounded">Deleted</span>
                              )}
                          </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-2 mb-1 line-clamp-3">{review.comment}</p>
                      <p className="text-xs text-gray-400 mb-3">
                          Place: <span className="font-medium">{review.place?.name ?? "--"}</span> {" "}{new Date(review.createdAt).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}
                      </p>

                      <div className="flex gap-4">
                          {!review.isDeleted ? (
                              <button onClick={() => handleSoftDelete(review._id)} disabled={isSoftDeleting} className="text-xs text-amber-600 cursor-pointer hover:underline disabled:opacity-50">
                                  Soft Delete
                              </button>
                          ) : (
                                  <button
                                      onClick={() => handleRestore(review._id)}
                                      disabled={isRestoring}
                                      className="text-xs cursor-pointer text-green-600 hover:underline disabled:opacity-50"
                                  >Restore</button>
                          )}

                          <button onClick={()=> handleHardDelete(review._id)} disabled={isHardDeleting} className="text-xs cursor-pointer text-red-500 hover:underline disabled:opacity-50">Hard Delete</button>
                      </div>
                  </div>
              ))}

              {filtered.length === 0 && (
                  <p className="text-gray-400 text-sm text-center py-10">No reviews found</p>
              )}
          </div>
    </div>
  )
}

export default AdminReviews