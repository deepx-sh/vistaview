import { useState } from "react";
import { useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
import { useAddReviewMutation } from "../../features/reviews/reviewsApi";
import StarRating from "./StarRating";


import React from 'react'
import toast from "react-hot-toast";
import { X } from "lucide-react";

const AddReviewForm = ({placeId,reviews}) => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  // const navigate = useNavigate();

  const alreadyReviewed = reviews?.some(
    (review)=>review.user?._id===user?._id
  )

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [images,setImages]=useState([])
  const [addReview, { isLoading }] = useAddReviewMutation();

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev)=>[...prev,...files])
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
    } catch (error) {
      if (error?.data?.errors?.length > 0) {
            error?.data?.errors.map((e)=> toast.error(e))
      } else {
        toast.error(error?.data?.message)
          }        
    }

    setRating(0);
    setComment("");
    setImages([]);
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
      <div className="border border-border rounded-lg p-6 bg-surface text-center">
        <p className="text-text-muted">
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
        <input type="file" multiple accept="image/*" onChange={handleImageChange}/>
        {images.length > 0 && (
          <div className="flex gap-3 flex-wrap">
            {images.map((file, index) => (
              <div key={index} className="relative">
                <img src={URL.createObjectURL(file)} alt="Preview" className="w-20 h-20 object-cover rounded-md" />
                <button type="button" onClick={()=>removeImage(index)} className="absolute -top-2 -right-2 bg-black text-white rounded-full p-1"><X size={12}/></button>
              </div>
            ))}
          </div>
        )}
        <button type="Submit" disabled={isLoading} className="bg-primary text-white px-5 py-2 rounded-md">{isLoading?"Posting...":"Submit Review"}</button>
      </form>
    </div>
  )
}

export default AddReviewForm