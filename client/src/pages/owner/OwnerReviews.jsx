import React from 'react'
import { useState } from 'react';
import { useForm } from "react-hook-form"
import {Star,MessageSquare,Pencil,Trash2,ChevronDown,ChevronUp} from "lucide-react"
import toast from "react-hot-toast"
import { useGetOwnerPlacesQuery, useGetOwnerReviewsQuery, useReplyToReviewMutation, useUpdateReplyMutation, useDeleteReplyMutation } from '../../features/owner/ownerPlaceApi';

const Stars = ({ rating }) => (
  <div className='flex gap-0.5'>
    {Array.from({ length: 5 }, (_, i) => (
      <Star key={i} size={14} className={i<rating ? "fill-amber-400 text-amber-400":"text-gray-300"} />
    ))}
  </div>
)

const ReplyForm = ({ defaultValue = "", onSubmit, onCancel, isLoading }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: { text: defaultValue } })
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className='mt-3 space-y-2'>
      <textarea rows={3}
        placeholder='Write your reply...'
        className={`w-full border rounded p-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-primary ${errors.text ? "border-red-400" : "border-gray-300"}`}
        {...register("text", {
          required: "Reply text is required",
          minLength: { value: 5, message: "Reply must be at least 5 characters" },
          maxLength:{value:1000,message:"Reply cannot exceed 1000 characters"}
        })}
      />
      {errors.text && <p className='text-red-500 text-xs'>{errors.text.message}</p>}

      <div className='flex gap-2'>
        <button type='submit' disabled={isLoading} className='bg-primary hover:bg-primary-hover transition-colors cursor-pointer duration-200 text-white text-sm px-4 py-1.5 rounded disabled:opacity-60'>{isLoading ? "Saving..." : "Submit"}</button>
        <button type='button' onClick={onCancel} className='text-sm cursor-pointer duration-200 transition-colors px-4 py-1.5 rounded border border-gray-300 hover:bg-gray-100'>Cancel</button>
      </div>
    </form>
  )
}

const ReviewCard = ({ review }) => {
  console.log(review);
  
  const [mode, setMode] = useState(null)
  
  const [replyToReview, { isLoading: isReplying }] = useReplyToReviewMutation();
  const [updateReply, { isLoading: isUpdating }] = useUpdateReplyMutation()
  const [deleteReply, { isLoading: isDeleting }] = useDeleteReplyMutation()
  
  const hasReply = !!review.ownerReply?.text;

  const handleReply = async ({ text }) => {
    try {
      await replyToReview({ reviewId: review._id, text }).unwrap();
      toast.success("Reply added")
      setMode(null)
    } catch (error) {
      toast.error(error?.data?.message || "Failed to add reply")
    }
  }

  const handleUpdate = async ({ text }) => {
    try {
      await updateReply({ reviewId: review._id, text }).unwrap()
      toast.success("Reply updated")
      setMode(null)
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update reply")
    }
  }

  const handleDelete = async () => {
    if(!window.confirm("Delete your reply?")) return
    try {
      await deleteReply(review._id).unwrap();
      toast.success("Reply deleted")
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete reply")
    }
  }

  return (
    <div className='border rounded-lg p-4 space-y-3 bg-white'>
      {/* Reviewer Info */}
      <div className='flex items-start justify-between gap-3'>
        <div className='flex items-center gap-2'>
          <div className='w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600 uppercase'>
            {review.user?.avatar ? (
              <img src={review.user.avatar} alt="avatar"  className='w-full h-full'/>
            ):"U"}
          </div>
          <div>
            <p className='text-sm font-medium'>{review.user?.name ?? "Anonymous"}</p>
            <p className='text-xs text-gray-400'>
              {new Date(review.createdAt).toLocaleDateString("en-IN", {
                day:"numeric",month:"short",year:"numeric"
              })}
            </p>
          </div>
        </div>
        <Stars rating={review.rating}/>
      </div>

      {/* Comment */}
      <p className='text-sm text-gray-700'>{review.comment}</p>
      {review.images?.length > 0 && (
        <div className='flex gap-2 flex-wrap'>
          {review.images.map((img) => (
            <img key={img.publicId} src={img.url} alt="review" className='w-16 h-16 object-cover rounded'/>
          ))}
        </div>
      )}

      {/* Helpful Votes */}
      {review.helpfulVotes?.length > 0 && (
        <p className='text-xs text-gray-400'>
          👍🏻 {review.helpfulVotes.length} found this helpful
        </p>
      )}

      {hasReply && mode !== "edit" && (
        <div className='bg-gray-50 border-l-4 border-primary rounded p-3 space-y-1'>
          <p className='text-xs font-semibold text-primary'>Your Reply</p>
          <p className='text-sm text-gray-700'>{review.ownerReply.text}</p>
          <p className='text-xs text-gray-400'>
            {new Date(review.ownerReply.repliedAt).toLocaleDateString("en-IN", {
              day:"numeric", month:"short",year:"numeric"
            })}
          </p>

          <div className='flex gap-3 pt-1'>
            <button onClick={() => setMode("edit")} className='flex items-center gap-1 text-xs cursor-pointer text-blue-500 hover:underline'><Pencil size={12} />Edit</button>
            <button onClick={handleDelete} disabled={isDeleting} className='flex items-center cursor-pointer gap-1 text-xs text-red-500 hover:underline disabled:opacity-50'><Trash2 size={12} />{isDeleting ? "Deleting...":"Delete"}</button>
          </div>
        </div>
      )}

      {/* Edit reply form */}
      {mode === "edit" && (
        <ReplyForm
          defaultValue={review.ownerReply?.text}
          onSubmit={handleUpdate}
          onCancel={() => setMode(null)}
          isLoading={isUpdating}
        />
      )}
      {/* Add reply button */}
      {!hasReply && mode !== "reply" && (
        <button onClick={() => setMode("reply")} className='flex items-center cursor-pointer gap-1 text-xs text-primary hover:underline'>
          <MessageSquare size={13}/> Reply to this review
        </button>
      )}

      {mode === "reply" && (
        <ReplyForm onSubmit={handleReply}
          onCancel={() => setMode(null)}
          isLoading={isReplying}
        />
      )}
    </div>
  )
}
const OwnerReviews = () => {
  const [selectedPlace, setSelectedPlace] = useState("")
  const [page, setPage] = useState(1)
  const LIMIT = 10;

  const { data: placesData, isLoading: loadingPlaces } = useGetOwnerPlacesQuery();
  const places = placesData?.data?.places ?? [];

  const { data: reviewsData, isLoading: loadingReviews, isFetching } = useGetOwnerReviewsQuery({ placeId: selectedPlace, page, limit: LIMIT }, { skip: !selectedPlace })
  const reviews = reviewsData?.data?.reviews ?? [];
  const total = reviewsData?.data?.total ?? 0;
  const totalPages = Math.ceil(total / LIMIT);

  const handlePlaceChange = (e) => {
    setSelectedPlace(e.target.value)
    setPage(1);
  }
  return (
    <div className='max-w-3xl mx-auto space-y-6'>
      <h1 className='text-2xl font-semibold'>Reviews</h1>

      <div>
        <select value={selectedPlace}
          onChange={handlePlaceChange}
          className='w-full border p-2 rounded'
          disabled={loadingPlaces}
        >
          <option value="">
            {loadingPlaces ? "Loading places..." : "Select a place to view reviews"}
            </option>
            {places.map((p) => (
              <option key={p._id} value={p._id}>{p.name}</option>
            ))}
          
        </select>
      </div>

      {!selectedPlace && (
        <p className='text-gray-400 text-sm text-center py-10'>Select a place above to see its reviews</p>
      )}

      {selectedPlace && (loadingReviews || isFetching) && (
        <p className='text-center text-gray-400 text-sm py-10'>Loading reviews...</p>
      )}

      {selectedPlace && !loadingReviews && !isFetching && reviews.length === 0 && (
        <p className='text-center text-gray-400 text-sm py-10'>No reviews yet for this place</p>
      )}

      {reviews.length > 0 && (
        <>
          <p className='text-sm text-gray-500'>{total} review{total !== 1 ? "s" : ""}</p>
          <div className='space-y-4'>
            {reviews.map((review) => (
              <ReviewCard key={review._id} review={review} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className='flex items-center justify-center gap-3 pt-2'>
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className='px-3 py-1.5 text-sm border rounded disabled:opacity-40'>Previous</button>
              <span className='text-sm text-gray-500'>Page {page} of {totalPages}</span>
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page===totalPages} className='px-3 py-1.5 text-sm border rounded disabled:opacity-40'>Next</button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default OwnerReviews