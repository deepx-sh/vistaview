import { Heart } from "lucide-react";
import { useSelector } from "react-redux";

import { useAddToWishlistMutation, useRemoveFromWishlistMutation, useGetWishlistQuery } from "../../features/wishlist/wishlistApi";
import { useNavigate } from 'react-router-dom';

import React from 'react'
import toast from "react-hot-toast";

const WishlistButton = ({ placeId }) => {
    const { isAuthenticated } = useSelector((state) => state.auth);
    const navigate = useNavigate()
    

    const { data } = useGetWishlistQuery(undefined, {
        skip:!isAuthenticated
    })

    const [addToWIshlist] = useAddToWishlistMutation();
    const [removeFromWishlist] = useRemoveFromWishlistMutation();

    const isSaved = data?.data?.wishlist?.some(
        (item)=>item._id===placeId
    )

    const handleToggle = async () => {
        if (!isAuthenticated) {
            navigate("/login")
            return
        }

        if (isSaved) {
            toast.success("Removed from wishlist")
            await removeFromWishlist(placeId);
        } else {
            toast.success("Added to wishlist")
            await addToWIshlist(placeId);
        }
    }
  return (
      <button onClick={handleToggle}
        className="flex items-center gap-2 border border-border px-4 py-2 rounded-md cursor-pointer hover:bg-surface transition duration-200"
      >
          
          <Heart size={18} className={isSaved ? "text-danger fill-danger" : ""} />
          {isSaved?"Saved":"Save"}
      </button>
  )
}

export default WishlistButton