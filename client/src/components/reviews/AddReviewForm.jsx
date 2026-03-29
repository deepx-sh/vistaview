import { useState } from "react";
import { useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
import { useAddReviewMutation } from "../../features/reviews/reviewsApi";
import StarRating from "./StarRating";
import React from 'react'
import toast from "react-hot-toast";
import { X ,ImagePlus} from "lucide-react";
import useFileValidation from "../../hooks/useFileValidation";
import handleApiError from "../../utils/handleApiError";

const MAX_IMAGES = 3;
const MAX_MB = 5;

const AddReviewForm = ({placeId,reviews}) => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  // const navigate = useNavigate();
  const {validate,IMAGE_TYPES}=useFileValidation()
  const alreadyReviewed = reviews?.some(
    (review)=>review.user?._id===user?._id
  )

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [images,setImages]=useState([])
  const [addReview, { isLoading }] = useAddReviewMutation();

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    e.target.value = "";
    
    const valid = validate({
      files,
      allowedTypes: IMAGE_TYPES,
      maxSizeMB: MAX_MB,
      maxCount: MAX_IMAGES,
      currentCount: images.length,
    })

    if (valid.length > 0) {
      setImages((prev)=>[...prev,...valid])
    }
  }
  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error("Please Log in to write a review")
      return;
    }

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (comment.trim().length < 10) {
      toast.error("Comment must be at least 10 characters long")
      return
    }
    if (images.length > 3) {
      toast.error("You can upload up to 3 images")
      return
    }
    const formData = new FormData();
    formData.append("rating", rating)
    formData.append("comment", comment);

    images.forEach((file) => {
      formData.append("images",file)
    })
    try {
      await addReview({
        placeId,
        data: formData
      }).unwrap();
      toast.success("Review submitted!");
      setRating(0);
      setComment("");
      setImages([]);
    } catch (error) {
      handleApiError(error, "Failed to submit review");
    }
  }
  if (!isAuthenticated) {
    return (
      <div className="border border-border rounded-lg p-6 bg-surface text-center">
        <p className="text-text-muted">
          Please login to write a review
        </p>
      </div>
    )
  }

  if (alreadyReviewed) {
    return (
      <div className="border border-danger mt-2 mb-2 rounded-lg p-6 bg-surface text-center">
        <p className=" text-danger">
          You have already reviewed this place
        </p>
      </div>
    )
  }
  return (
    <div className="border border-border rounded-lg p-6 bg-surface">
      <h3 className="font-semibold mb-4">
        Write a review
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <StarRating rating={rating} setRating={setRating} />
        
        <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Share your experience" className="w-full border border-border rounded-md px-3 py-2" rows="4" required></textarea>
        <div>
          <label className={`inline-flex items-center gap-2 text-sm border border-dashed border-border rounded-md px-4 py-2 cursor-pointer hover:border-primary hover:bg-primary/5 transition ${images.length >= MAX_IMAGES ? "opacity-40 pointer-events-none" : ""}`}>
            <ImagePlus size={15} className="text-text-muted" />
            Add photos ({images.length}/{MAX_IMAGES})
            <input type="file" multiple accept="image/jpeg,image/jpg,image/png,image/webp" className="hidden" onChange={handleImageChange} disabled={images.length>=MAX_IMAGES} />
          </label>
          <p className="text-xs text-text-muted mt-1">JPG, PNG, WEBP, max {MAX_MB}MB each</p>
        </div>
        {images.length > 0 && (
          <div className="flex gap-3 flex-wrap">
            {images.map((file, index) => (
              <div key={index} className="relative">
                <img src={URL.createObjectURL(file)} alt="Preview" className="w-20 h-20 object-cover rounded-md border border-border" />
                <button type="button" onClick={()=>removeImage(index)} className="absolute -top-2 -right-2 bg-black text-white rounded-full p-1 flex items-center justify-center"><X size={12}/></button>
              </div>
            ))}
          </div>
        )}
        <button type="Submit" disabled={isLoading} className="bg-primary hover:bg-primary-hover text-white px-5 py-2 rounded-md text-sm transition disabled:opacity-60">{isLoading?"Posting...":"Submit Review"}</button>
      </form>
    </div>
  )
}

export default AddReviewForm