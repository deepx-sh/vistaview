import React, { useState } from 'react'
import { Star, Pencil, Trash, Form, X,ThumbsUp,Flag, ImagePlus } from 'lucide-react'
import { useUpdateReviewMutation,useDeleteReviewMutation,useToggleHelpfulMutation } from '../../features/reviews/reviewsApi'
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import ImageModal from '../common/ImageModal';
import ReportReviewModal from './ReportReviewModal';
import useFileValidation from '../../hooks/useFileValidation';
import handleApiError from '../../utils/handleApiError';

const MAX_IMAGES = 3;
const MAX_MB = 5;
const ReviewCards = ({ review,placeId }) => {
    const { user: currentUser } = useSelector((state) => state.auth);
    const user = review.user
    const isOwner = currentUser && user?._id === currentUser._id;
    const [isEditing, setIsEditing] = useState(false);
    const [comment, setComment] = useState(review.comment);
    const [rating, setRating] = useState(review.rating);

    const [updateReview,{isLoading}] = useUpdateReviewMutation();
    const [deleteReview] = useDeleteReviewMutation();
    const [toggleHelpful] = useToggleHelpfulMutation();
    const [existingImages, setExistingImages] = useState(review.images || []);
    const [newImages, setNewImages] = useState([]);
    const [deletedImages, setDeletedImages] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [showReportModal,setShowReportModal]=useState(false)
    
    const { validate, IMAGE_TYPES } = useFileValidation()
    const totalImages=existingImages.length+ newImages.length
    const handleUpdate = async () => {
        if (comment.trim().length < 10) {
            toast.error("Comment must be at least 10 characters long")
            return
        }

        if (rating === 0) {
            toast.error("Please select a rating");
            return
        }

        
        const formData = new FormData();
        formData.append("comment", comment);
        formData.append("rating", rating);

        newImages.forEach((file) => {
            formData.append("images",file)
        })
        
        formData.append("deletedImages", JSON.stringify(deletedImages));
        try {
            await updateReview({
            reviewId: review._id,
                data: formData,
            placeId
            }).unwrap()
            toast.success("Review updated")
            setIsEditing(false)
            setNewImages([])
            setDeletedImages([])
        } catch (error) {
                handleApiError(error,"Failed to update review")            
        }
        setIsEditing(false);
    }
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        e.target.value=''

        const valid = validate({
            files,
            allowedTypes: IMAGE_TYPES,
            maxSizeMB:MAX_MB,
            maxCount: MAX_IMAGES,
            currentCount:totalImages
       })

       if(valid.length>0) setNewImages((prev)=>[...prev,...valid])
    }
    const removeExistingImage = (index) => {
        const imageToDelete = existingImages[index]
        setDeletedImages((prev) => [...prev, imageToDelete.publicId]);
        setExistingImages((prev) => prev.filter((_, i) => i !== index));
    }

    const removeNewImage = (index) => {
        setNewImages((prev)=>prev.filter((_,i)=>i!==index))
    }
    const handleDelete = async () => {
        if (confirm("Are you sure you want to delete this review?")) {
            await deleteReview({reviewId:review._id,placeId});
        }
    }
    const initials = user?.name
        ? user.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
        : "U";
    
    const isHelpful = review.helpfulVotes?.some(
        (u)=>u===currentUser?._id
    )

    const handleHelpful = async () => {
        if (!currentUser) {
            toast.error("Please log in to mark as helpful")
            return
        }

        try {
            await toggleHelpful(review._id).unwrap()
            toast.success(isHelpful ? "Marked as not helpful":"Marked as helpful")
        } catch (error) {
            if (error?.data?.message) {
                toast.error(error.data.message)
            } else {
                toast.error("An error occurred Please try again")
            }
        }
    }
  return (
      <div className='border border-border rounded-lg p-6 bg-surface'>
          {/* Header */}
          <div className='flex justify-between items-start mb-4'>
              
              <div className='flex items-center gap-4'>
                  {user?.avatar ? (
                      <img src={user.avatar} alt={user.name} className='w-10 border border-purple-600 h-10 rounded-full object-cover'/>
                  ) : (
                          <div className='w-10 h-10 rounded-full bg-primary text-white flex items-center  justify-center font-medium'>{initials}</div>
                  )}

                  <div>
                      <p className='font-medium'>{user?.name}</p>

                      {/* Rating */}
                      {!isEditing ? (
                          <div className='flex items-center gap-1 text-warning text-sm'>
                              {Array.from({ length: review.rating }).map((_, i) => (
                                  <Star key={i} size={14} fill='currentColor'/>
                              ))}
                          </div>
                      ) : (
                              <select value={rating} onChange={(e) => setRating(e.target.value)} className='border border-border rounded-md px-2 py-1 text-sm'>
                                  {[5, 4, 3, 2, 1].map((r) => (
                                      <option value={r} key={r}>{r}★</option>
                                  ))}
                              </select>
                      )}
                  </div>
              </div>

              <div className='flex items-center gap-3'>
                  {/* Owner Actions */}
                  {isOwner && !isEditing && (
                      <>
                          <button onClick={() => setIsEditing(true)} className='text-primary cursor-pointer '>
                              <Pencil size={16}/>
                          </button>
                          
                          <button onClick={handleDelete} className='text-danger cursor-pointer'>
                              <Trash size={16}/>
                          </button>
                      </>
                  )}
                  
                  <p className='text-xs text-text-muted'>
                      {new Date(review.createdAt).toLocaleDateString()}
                  </p>
              </div>
          </div>

          {/* Comment */}
          {!isEditing ? (
              <p className='text-text-secondary text-sm mb-4 wrap-break-word'>
                  {review.comment}
              </p>
          ) : (
                  <div className='space-y-3'>
                      <textarea value={comment} onChange={(e) => setComment(e.target.value)} className='w-full border border-border outline-none focus:ring-2 focus:ring-primary rounded-md px-3 py-2 text-sm'></textarea>
                      <div>
                          <label className={`inline-flex items-center gap-2 text-sm border border-dashed border-border rounded-md px-3 py-1.5 cursor-pointer hover:border-primary hover:bg-primary/5 transition ${totalImages >= MAX_IMAGES ? 'opacity-40 pointer-events-none' : ''}`}>
                              <ImagePlus size={14} className='text-text-muted' />
                              Add Photos ({totalImages}/{MAX_IMAGES})

                              <input type="file"
                                  multiple
                                  accept='image/jpg,image/jpeg,image/png,image/webp'
                                  className='hidden'
                                  disabled={totalImages >= MAX_IMAGES}
                                  onChange={handleImageChange}
                              />
                          </label>
                          <p className='text-xs text-text-muted mt-1'>JPG, PNG, WEBP max {MAX_IMAGES}MB each</p>
                            </div>
                      {existingImages.length > 0 && (
                          <div>
                              <p className='text-xs text-text-muted mb-1.5'>Current Images</p>
                              <div className='flex gap-3 flex-wrap'>
                                  {existingImages.map((img, index) => (
                                      <div key={`existing-${index}`} className='relative'>
                                          <img src={img.url} alt="Preview" className='w-20 h-20 rounded-md object-cover  border border-border' />
                                          <button type="button" onClick={() => removeExistingImage(index)} className='absolute -top-2 -right-2 w-5 h-5 bg-danger text-white rounded-full flex items-center justify-center'>
                                              <X size={11}/>
                                          </button>
                                      </div>
                                  ))}
                              </div>
                          </div>
                          )}
                      {newImages.length > 0 && (
                          <div>
                              <p className='text-xs text-text-muted mb-1.5'>New Images</p>
                              <div className='flex gap-3 flex-wrap'>
                                  {newImages.map((file, index) => (
                                      <div key={`new-${index}`} className='relative'>
                                          <img src={URL.createObjectURL(file)} alt="Preview" className='w-20 h-20 object-cover rounded-md border border-border ring-2 ring-primary' />
                                          <button type="button" onClick={() => removeNewImage(index)} className='absolute -top-2 -right-2 w-5 h-5 bg-danger text-white rounded-full flex items-center justify-center'>
                                              <X size={11}/>
                                          </button>
                                      </div>
                                  ))}
                              </div>
                          </div>
                          )}
                                
                      <div className='flex gap-3'>
                          <button onClick={handleUpdate} disabled={isLoading} className='bg-primary text-white px-4 py-1 rounded-md disabled:opacity-55 text-sm hover:bg-primary-hover cursor-pointer transition-colors duration-200'>{isLoading ? "Saving..." : "Update"}</button>

                          <button onClick={() => {
                              setIsEditing(false);
                              setNewImages([]);
                              setDeletedImages([]);
                              setExistingImages(review.images || []);
                              setComment(review.comment);
                              setRating(review.rating);
                          }} className='border border-border px-4 py-1 rounded-md text-sm hover:bg-gray-100 cursor-pointer'>Cancel</button>
                      </div>
                  </div>

            )}
                  {review.images?.length>0 && !isEditing && (
              <div className='flex gap-3 mt-3 flex-wrap'>
                  {review.images.map((img, index) => (
                      <img src={img.url} alt="Review Image" key={index} onClick={() => { setCurrentImageIndex(index); setModalOpen(true)}} className='w-20 h-20 object-cover rounded-md cursor-pointer hover:opacity-80'/>
                  ))}
              </div>
                  )}
          {/* Owner Reply */}
          {review.ownerReply && !isEditing && (
              <div className='mt-4 bg-primary/5 border border-primary/20 rounded-md p-4'>
                  <p className='text-sm font-medium mb-1'>
                      Owner Response:
                  </p>

                  <p className='text-sm text-text-secondary'>
                      {review.ownerReply.text}
                  </p>
              </div>
          )}

          {/* Helpful Button */}
          <div className='mt-4 flex items-center gap-4'>
              <button onClick={handleHelpful} className={`flex items-center gap-2 text-sm cursor-pointer hover:text-primary ${isHelpful ? "text-primary" : "text-text-muted"}`}><ThumbsUp size={16} className={isHelpful ? "fill-primary" : ""} />{review.helpfulVotes?.length||0}</button>
              <button onClick={()=>setShowReportModal(true)} className='flex items-center gap-2 text-sm cursor-pointer hover:text-danger text-text-muted'><Flag size={16}/>Report</button>
          </div>
        
          
          {showReportModal && (
              <ReportReviewModal reviewId={review._id} onClose={()=>setShowReportModal(false)}/>
          )}
          {modalOpen && (
              <ImageModal images={review.images} currentIndex={currentImageIndex} setCurrentIndex={setCurrentImageIndex}onClose={()=>setModalOpen(false)}/>
          )}
      </div>
  )
}

export default ReviewCards