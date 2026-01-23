import { Review } from "../models/review.model";
import { Place } from "../models/place.model";

const recalculatePlaceRating = async (placeId) => {
   const reviews = await Review.find({
        place: placeId,
        isDeleted: false,
    })

    
     const totalReviews = reviews.length;

      let averageRating = 0;
      if (totalReviews > 0) {
          const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
          averageRating = sum / totalReviews;
      }

      await Place.findByIdAndUpdate(placeId, {
          totalReviews,
          averageRating
      })
};

export default recalculatePlaceRating;