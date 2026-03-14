import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { X } from "lucide-react";
import MapPicker from "../../components/common/MapPicker";
import {
  useGetOwnerPlaceQuery,
  useUpdatePlaceMutation,
} from "../../features/owner/ownerPlaceApi";

const CATEGORIES = [
  "beach",
  "temple",
  "hill",
  "hotel",
  "heritage",
  "city",
  "nature",
];

import React from "react";

const EditPlace = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading: isFetching, isError } = useGetOwnerPlaceQuery(id);
  const [updatePlace, { isLoading: isUpdating }] = useUpdatePlaceMutation();

  const place = data?.data;

  const [existingImages, setExistingImages] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [coordinates, setCoordinates] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const minPrice = watch("minPrice");

  useEffect(() => {
    if (!place) return;

    reset({
      name: place.name ?? "",
      description: place.description ?? "",
      category: place.category ?? "",
      address: place.location?.address ?? "",
      city: place.location?.city ?? "",
      state: place.location?.state ?? "",
      minPrice: place.pricing?.min ?? "",
      maxPrice: place.pricing?.max ?? "",
      openTime: place.timings?.open ?? "",
      closeTime: place.timings?.close ?? "",
      bestTimeToVisit: place.bestTimeToVisit ?? "",
    });

    setExistingImages(place.images ?? []);

    if (place.location?.coordinates?.length === 2) {
      setCoordinates({
        lng: place.location.coordinates[0],
        lat: place.location.coordinates[1],
      });
    }
  }, [place, reset]);

  const setAddress = ({ address, city, state }) => {
    setValue("address", address, { shouldValidate: true });
    setValue("city", city, { shouldValidate: true });
    setValue("state", state, { shouldValidate: true });
  };

  const markImageForDeletion = (publicId) => {
    setDeletedImages((prev) => [...prev, publicId]);
    setExistingImages((prev) =>
      prev.filter((img) => img.publicId !== publicId),
    );
  };

  const handleNewImageChange = (e) => {
    const files = Array.from(e.target.files);
    const total = existingImages.length + newImages.length + files.length;

    if (total > 5) {
      toast.error("A maximum of 5 images are allowed per place");
      return;
    }

    setNewImages((prev) => [...prev, ...files]);
  };

  const removeNewImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const totalImages = existingImages.length + newImages.length;

  const onSubmit = async (data) => {
    if (!coordinates?.lat || !coordinates?.lng) {
      toast.error("Please select a location on the map");
      return;
    }

    if (totalImages === 0) {
      toast.error("At least one place image is required");
      return;
    }

    const formData = new FormData();

    formData.append("name", data.name.trim());
    formData.append("description", data.description.trim());
    formData.append("category", data.category);
    formData.append("location[type]", "Point");
    formData.append("location[address]", data.address.trim());
    formData.append("location[city]", data.city.trim());
    formData.append("location[state]", data.state.trim());
    formData.append("location[coordinates][0]", coordinates.lng);
    formData.append("location[coordinates][1]", coordinates.lat);

    if (data.minPrice !== "" && data.minPrice !== undefined) {
      formData.append("pricing[min]", parseInt(data.minPrice));
    }

    if (data.maxPrice !== "" && data.maxPrice !== undefined) {
      formData.append("pricing[max]", parseInt(data.maxPrice));
    }

    if (data.openTime) formData.append("timings[open]", data.openTime);
    if (data.closeTime) formData.append("timings[close]", data.closeTime);

    if (data.bestTimeToVisit) {
      formData.append("bestTimeToVisit", data.bestTimeToVisit.trim());
    }

    if (deletedImages.length > 0) {
      formData.append("deletedImages", JSON.stringify(deletedImages));
    }

    newImages.forEach((img) => formData.append("images", img));

    try {
      await updatePlace({ id, formData }).unwrap();
      toast.success("Place updated and sent for re-approval");
      navigate("/owner/places");
    } catch (error) {
      if (error?.data?.errors?.length > 0) {
        error.data.errors.forEach((e) => toast.error(e));
      } else {
        toast.error(error?.data?.message || "Failed to update place");
      }
    }
  };
  if (isFetching)
    return <p className="py-10 text-center">Loading place details...</p>;
  if (isError || !place)
    return <p className="py-10 text-center text-red-500">Place not found</p>;
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="mb-6 text-2xl font-semibold">Edit Place</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Name */}
        <div>
          <input
            type="text"
            placeholder="Place Name"
            className={`w-full rounded border p-2 ${errors.name ? "border-red-500" : ""}`}
            {...register("name", {
              required: "Place name is required",
              minLength: {
                value: 3,
                message: "Place name must be at least 3 characters",
              },
              maxLength: {
                value: 100,
                message: "Place name must be at most 100 characters",
              },
            })}
          />

          {errors.name && (
            <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <textarea
            placeholder="Description"
            rows={4}
            className={`w-full rounded border p-2 ${errors.description ? "border-red-500" : ""}`}
            {...register("description", {
              required: "Description is required",
              minLength: {
                value: 20,
                message: "Description must be at least 20 characters",
              },
              maxLength: {
                value: 2000,
                message: "Description must be at most 2000 characters",
              },
            })}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-500">
              {errors.description.message}
            </p>
          )}
              </div>
              
              {/* Category */}
              <div>
                  <select
            className={`w-full border p-2 rounded ${errors.category ? "border-red-500" : ""}`}
            {...register("category",{required:"Category is required"})}
          >
            <option value="">Select category</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase()+ cat.slice(1)}
              </option>
            ))}
          </select>

          {errors.category && <p className='text-red-500 text-sm mt-1'>{errors.category.message}</p>}
              </div>

              {/* Address */}
              <div>
                  <input type="text"
            placeholder='Address'
            className={`w-full border p-2 rounded ${errors.address ? "border-red-500" : ""}`}
            {...register("address",{required:"Address is required"})}
          />
          {errors.address && <p className='text-red-500 text-sm mt-1'>{errors.address.message}</p>}
              </div>

              {/* City and State */}
              <div className='grid grid-cols-2 gap-4'>
          <div>
            <input type="text"
              placeholder='City'
              className={`w-full border p-2 rounded ${errors.city ? "border-red-500" : ""}`}
              {...register("city",{required:"City is required"})}
            />
            {errors.city && <p className='text-red-500 text-sm mt-1'>{errors.city.message}</p>}
          </div>
            
          <div>
            <input type="text"
              placeholder='State'
              className={`w-full border p-2 rounded ${errors.city ? "border-red-500" : ""}`}
              {...register("state",{required:"State is required"})}
            />
            {errors.state && <p className='text-red-500 text-sm mt-1'>{errors.state.message}</p>}
          </div>
              </div>
              
              {/* Map Picker */}
              <div>
                        <p className='text-sm mb-2'>Select Location on Map</p>
                        <MapPicker setCoordinates={setCoordinates} setAddress={setAddress} defaultCoordinates={coordinates}/>
                          {coordinates ? (
                            <p className='text-sm text-gray-500 mt-2'>
                              Selected: {coordinates.lat.toFixed(5)},{coordinates.lng.toFixed(5)}
                            </p>
                          ) : (
                              <p className='text-sm text-gray-400 mt-2'>No location selected</p>
                          )}
              </div>
              
              {/* Pricing */}
               <div className='grid grid-cols-2 gap-4'>
          <div>
            <input type="number"
              placeholder='Min Budget'
              min={0}
              className={`w-full border p-2 rounded ${errors.minPrice ? "border-red-500" : ""}`}
              {...register("minPrice", {
                min:{value:0,message:"Min price cannot be negative"}
              })}
            />
            {errors.minPrice && <p className='text-red-500 text-sm mt-1'>{errors.minPrice.message}</p>}
          </div>

          <div>
            <input type="number"
              placeholder='Max Budget'
              min={0}
              className={`w-full border p-2 rounded ${errors.maxPrice ? "border-red-500" : ""}`}
              {...register("maxPrice", {
                min: { value: 0, message: "Max price cannot be negative" },
                validate: (value) => {
                  if (minPrice && value && parseInt(value) < parseInt(minPrice)) {
                    return "Max price must be greater than min price"
                  }
                  return true
                }
              })}
            />
            {errors.maxPrice && <p className='text-red-500 text-sm mt-1'>{errors.maxPrice.message}</p>}
          </div>
              </div>
              
              {/* Timings */}
               <div className='grid grid-cols-2 gap-4'>
          <input type="text"
            placeholder='Open Time (e.g. 9:00 AM)'
            className='border p-2 rounded'
            {...register("openTime")}
          />

          <input type="text"
            placeholder='Close Time (e.g. 6:00 PM)'
            className='border p-2 rounded'
            {...register("closeTime")}
          />
              </div>
              
              {/* Best Time to Visit */}
              <div>
          <input type="text"
            placeholder='Best time to visit'
            className={`w-full border p-2 rounded ${errors.bestTimeToVisit ? "border-red-500" : ""}`}
            {...register('bestTimeToVisit',{maxLength:{value:200,message:"Must be at most 200 characters"}})}
          />
          {errors.bestTimeToVisit && <p className='text-red-500 text-sm mt-1'>{errors.bestTimeToVisit.message}</p>}
        </div>
              {/* Existing Images */}
              {existingImages.length > 0 && (
                  <div>
                      <p className="text-sm mb-2 font-medium">Current Images</p>
                      <div className="flex gap-3 flex-wrap">
                          {existingImages.map((img) => (
                              <div key={img.publicId} className="relative">
                                  <img src={img.url} alt="Existing" className="w-20 h-20 object-cover rounded-md" />
                                  <button type="button" onClick={()=>markImageForDeletion(img.publicId)} className="absolute -top-2 -right-2 bg-black text-white rounded-full p-1"><X size={12}/></button>
                              </div>
                          ))}
                      </div>
                  </div>
              )}

              {/* New Images Upload*/}
              <div>
                  <p className="text-sm mb-2 font-medium">Add New Images{" "} <span className="text-gray-400 font-normal">({totalImages}/5 used)</span></p>
                  <input type="file"
                      multiple
                      accept="image/*"
                      onChange={handleNewImageChange}
                      disabled={totalImages>=5}
                  />
                  {totalImages >= 5 && (
                      <p className="text-xs text-red-400 mt-1">Maximum of 5 images reached</p>
                  )}
              </div>
              {newImages.length > 0 && (
                  <div>
                      <p className="text-sm mb-2 text-gray-500">New Images to Upload</p>
                      <div className="flex gap-3 flex-wrap">
                          {newImages.map((file, index) => (
                              <div key={index} className="relative">
                                  <img src={URL.createObjectURL(file)} alt="New Preview" className="w-20 h-20 object-cover rounded-md ring-2 ring-blue-400" />
                                  <button type="button" onClick={()=>removeNewImage(index)} className="absolute -top-2 -right-2 bg-black text-white rounded-full p-1"><X size={12}/></button>
                              </div>
                          ))}
                      </div>
                  </div>
              )}

              {/* Re-approval notice */}
              <p className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded p-3">
                  Saving changes will re-submit this place for admin approval
              </p>

              <button type="submit" className="bg-primary text-white px-5 py-2 rounded disabled:opacity-60" disabled={isUpdating}>{isUpdating?"Saving...":"Save Changes"}</button>
      </form>
    </div>
  );
};

export default EditPlace;
