import React, { useState } from 'react'
import { Star, Pencil, Trash, Form, X } from 'lucide-react'
import { useUpdateReviewMutation,useDeleteReviewMutation } from '../../features/reviews/reviewsApi'
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
const ReviewCards = ({ review }) => {
    const { user: currentUser } = useSelector((state) => state.auth);
    const user = review.user
    const isOwner = currentUser && user?._id === currentUser._id;
    const [isEditing, setIsEditing] = useState(false);
    const [comment, setComment] = useState(review.comment);
    const [rating, setRating] = useState(review.rating);

    const [updateReview,{isLoading}] = useUpdateReviewMutation();
    const [deleteReview] = useDeleteReviewMutation();
    const [existingImages, setExistingImages] = useState(review.images || []);
    const [newImages, setNewImages] = useState([]);
    const [deletedImages, setDeletedImages] = useState([]);
    
    console.log(existingImages);
    console.log(existingImages.length);
    console.log(deletedImages.length);
    console.log(newImages.length);
    
    
    
    const handleUpdate = async () => {
        if (comment.trim().length < 10) {
            toast.error("Comment must be at least 10 characters long")
            return
        }

        if (rating === 0) {
            toast.error("Please select a rating");
            return
        }

        if (existingImages.length - deletedImages.length + newImages.length > 3) {
            toast.error("You can upload up to 3 images per review")
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
            data:formData
           }).unwrap()
        } catch (error) {
            console.log(error);
            
        }
        setIsEditing(false);
    }
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        
        const currentTotal = existingImages.length + newImages.length;

        if (currentTotal + files.length > 3) {
            toast.error("Total images cannot exceed 3. Only the first were added")
            const allowedCount = 3 - currentTotal;
            const allowedFiles = files.slice(0, allowedCount);
            setNewImages((prev)=>[...prev,...allowedFiles])
        } else {
            setNewImages((prev) => [...prev, ...files]);
        }

    }
    const removeExistingImage = (index) => {
        const imageToDelete = existingImages[index]
        setDeletedImages((prev) => [...prev, imageToDelete.publicId]);
        setExistingImages((prev) => prev.filter((_, i) => i !== index));
    }
    const handleDelete = async () => {
        if (confirm("Are you sure you want to delete this review?")) {
            await deleteReview(review._id);
        }
    }
    const initials = user?.name
        ? user.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
        : "U";
  return (
      <div className='border border-border rounded-lg p-6 bg-surface'>
          {/* Header */}
          <div className='flex justify-between items-start mb-4'>
              
              <div className='flex items-center gap-4'>
                  {user?.avatar ? (
                      <img src={user.avatar} alt={user.name} className='w-10 h-10 rounded-full object-cover'/>
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
                          <button onClick={() => setIsEditing(true)} className='text-primary'>
                              <Pencil size={16}/>
                          </button>
                          
                          <button onClick={handleDelete} className='text-danger'>
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
              <p className='text-text-secondary text-sm mb-4'>
                  {review.comment}
              </p>
          ) : (
                  <div className='space-y-3'>
                      <textarea value={comment} onChange={(e) => setComment(e.target.value)} className='w-full border border-border rounded-md px-3 py-2 text-sm'></textarea>
                      <input type="file" multiple accept='image/*' onChange={handleImageChange}/>
                      <div className="flex gap-3 flex-wrap">
                          
                                  {existingImages.map((file, index) => (
                                    <div key={`existing-${index}`} className="relative">
                                      <img src={ file.url} alt="Existing Preview" className="w-20 h-20 object-cover rounded-md" />
                                      <button type="button" onClick={()=>removeExistingImage(index)} className="absolute -top-2 -right-2 bg-black text-white rounded-full p-1"><X size={12}/></button>
                                    </div>
                                  ))}
                          
                          {newImages.map((file, index) => (
                              <div key={`new-${index}`} className='relative'>
                                  <img src={URL.createObjectURL(file)} alt="New Preview" className='w-20 h-20 object-cover rounded-md' />
                                  <button type='button' onClick={() => setNewImages(prev => prev.filter((_, i) => i !== index))} className="absolute -top-2 -right-2 bg-black text-white rounded-full p-1"><X size={12}/></button>
                              </div>
                          ))}
                                </div>
                      <div className='flex gap-3'>
                          <button onClick={handleUpdate} className='bg-primary text-white px-4 py-1 rounded-md text-sm'>{isLoading ? "Saving..." : "Update"}</button>

                          <button onClick={()=>setIsEditing(false)} className='border border-border px-4 py-1 rounded-md text-sm'>Cancel</button>
                      </div>
                  </div>

            )}
                  {review.images?.length>0 && !isEditing && (
              <div className='flex gap-3 mt-3 flex-wrap'>
                  {review.images.map((img, index) => (
                        <img key={index} src={img.url} alt="Review" className='w-20 h-20 object-cover rounded-md' />
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
                      {review.ownerReply}
                  </p>
              </div>
          )}
      </div>
  )
}

export default ReviewCards