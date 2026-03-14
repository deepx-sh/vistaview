import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { useCreatePlaceMutation } from '../../features/owner/ownerPlaceApi';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import MapPicker from '../../components/common/MapPicker';
import { X } from 'lucide-react';

const CATEGORIES=["beach","temple","hill","hotel","heritage","city","nature"]
const AddPlace = () => {
  const navigate = useNavigate();
  const [createPlace, { isLoading }] = useCreatePlaceMutation();

  const [coordinates, setCoordinates] = useState(null);
  const [images, setImages] = useState([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState:{errors},
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      category: "",
      address: "",
      city: "",
      state: "",
      minPrice: "",
      maxPrice: "",
      openTime: "",
      closeTime: "",
      bestTimeToVisit:""
    }
  })

  const minPrice = watch("minPrice");

  const setAddress = ({ address, city, state }) => {
    setValue("address", address, { shouldValidate: true });
    setValue("city", city, { shouldValidate: true });
    setValue("state",state,{shouldValidate:true})
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 5) {
      toast.error("You can upload up to 5 images")
      return
    }
    setImages((prev) => [...prev, ...files]);
  }

  const removeImages = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  const onSubmit = async (data) => {
    if (!coordinates?.lat || !coordinates?.lng) {
      toast.error("Please select a location on the map");
      return;
    }

    if (images.length === 0) {
      toast.error("At least one place image is required")
      return
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

    if (data.minPrice) formData.append("pricing[min]", parseInt(data.minPrice));
    if (data.maxPrice) formData.append("pricing[max]", parseInt(data.maxPrice));
    if (data.openTime) formData.append("timings[open]", data.openTime);
    if (data.closeTime) formData.append("timings[close]", data.closeTime);
    if (data.bestTimeToVisit) formData.append("bestTimeToVisit", data.bestTimeToVisit.trim())
    
    images.forEach((img) => formData.append("images", img));

    try {
      await createPlace(formData).unwrap();
      toast.success("Place submitted for approval");
      navigate("/owner/places")
    } catch (error) {
      if (error?.data?.errors?.length > 0) {
          error.data.errors.forEach((e)=>toast.error(e))
      } else {
        toast.error(error?.data?.message || "Failed to create place")
        }
    }
  }
  return (
    <div className='max-w-3xl mx-auto'>
      <h1 className='text-2xl font-semibold mb-6'>Add New Place</h1>

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
        {/* Name */}
        <div>
          <input type="text"
            placeholder='Place Name'
            className={`w-full border p-2 rounded ${errors.name ? "border-red-500" : ""}`}
            {...register("name", {
              required: "Place name is required",
              minLength: { value: 3, message: "Place name must be at least 3 characters" },
              maxLength:{value:100,message:"Place name must be at most 100 characters"}
            })}
          />

          {errors.name && <p className='text-red-500 text-sm mt-1'>{errors.name.message}</p>}
        </div>

        {/* Description */}
        <div>
          <textarea placeholder='Description'
            rows={4}
            className={`w-full border p-2 rounded ${errors.description ? "border-red-500" : ""}`}
            {...register("description", {
              required: "Description is required",
              minLength: { value: 20, message: "Description must be at least 20 characters" },
              maxLength:{value:2000,message:"Description must be at most 2000 characters"}
            })}
          />
          {errors.description && <p className='text-red-500 text-sm mt-1'>{errors.description.message}</p>}
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

        {/* City & State */}
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
          <MapPicker setCoordinates={setCoordinates} setAddress={setAddress} />
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

        {/* Best Time To Visit */}
        <div>
          <input type="text"
            placeholder='Best time to visit'
            className={`w-full border p-2 rounded ${errors.bestTimeToVisit ? "border-red-500" : ""}`}
            {...register('bestTimeToVisit',{maxLength:{value:200,message:"Must be at most 200 characters"}})}
          />
          {errors.bestTimeToVisit && <p className='text-red-500 text-sm mt-1'>{errors.bestTimeToVisit.message}</p>}
        </div>

        {/* Image Upload */}
        <div>
          <input type="file" multiple accept='image/*' onChange={handleImageChange} />
          <p className='text-xs text-gray-400 mt-1'>Up to 5 images allowed</p>
        </div>
        {images.length > 0 && (
          <div className='flex gap-3 flex-wrap'>
            {images.map((file, index) => (
              <div key={index} className='relative'>
                <img src={URL.createObjectURL(file)} alt="Preview" className='w-20 h-20 object-cover rounded-md' />
                <button type='button' onClick={()=> removeImages(index)} className='absolute -top-2 -right-2 bg-black text-white rounded-full p-1'><X size={12}/></button>
              </div>
            ))}
          </div>
        )}

        <button type='submit' className='bg-primary text-white px-5 py-2 rounded disabled:opacity-60' disabled={isLoading}>{isLoading ? "Creating...":"Create Place"}</button>
      </form>
    </div>
  )
}

export default AddPlace