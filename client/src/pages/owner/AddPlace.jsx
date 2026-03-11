import { useState } from "react";
import { useCreatePlaceMutation } from "../../features/owner/ownerPlaceApi";
import { useNavigate } from "react-router-dom";

import React from 'react'
import toast from "react-hot-toast";
import MapPicker from "../../components/common/MapPicker";
import { X } from "lucide-react";

const AddPlace = () => {
    const navigate = useNavigate();
    const [createPlace, { isLoading }] = useCreatePlaceMutation();

    const [form, setForm] = useState({
        name: "",
        description: "",
        category: "",
        address: "",
        city:"",
        state: "",
        lat: "",
        lng: "",
        minPrice: "",
        maxPrice: "",
        openTime: "",
        closeTime: "",
        bestTimeToVisit:""
    })
    const [coordinates, setCoordinates] = useState(null);
    const [images, setImages] = useState([]);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]:e.target.value
        })
    }

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + images.length > 5) {
            toast.error("You can upload up to 5 images");
            return;
        }
    setImages((prev)=>[...prev,...files])
  }
  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.name.trim()) {
            toast.error("Place name is required");
            return;
        }
        if (form.name.trim().length < 3 || form.name.trim().length > 100) {
            toast.error("Place name must be between 3 and 100 characters");
            return;
        }
        if (!form.description.trim()) {
            toast.error("Description is required");
            return;
        }
        if(form.description.trim().length<20 || form.description.trim().length>2000){
            toast.error("Description must be between 20 and 2000 characters");
            return
        }
        if (!form.category) {
            toast.error("Category is required");
            return;
        }

        if (!form.address.trim()) {
            toast.error("Address is required");
            return;
        }

        if (!form.city.trim()) {
            toast.error("City is required");
            return;
        }

        if (!form.state.trim()) {
            toast.error("State is required");
            return;
        }

        if (!coordinates?.lat || !coordinates?.lng) {
            toast.error("Latitude and Longitude are required");
            return;
        }

        if (form.minPrice && form.maxPrice && parseInt(form.minPrice) > parseInt(form.maxPrice)) {
            toast.error("Min price cannot be greater than max price");
            return;
        }

        if (form.minPrice && parseInt(form.minPrice) < 0) {
            toast.error("Min price cannot be negative");
            return;
        }

        if (form.maxPrice && parseInt(form.maxPrice) < 0) {
            toast.error("Max price cannot be negative");
            return;
        }
        if (images.length === 0) {
            toast.error("At least one place image is required");
            return;
        }

        if (images.length > 5) {
            toast.error("You can upload up to 5 images");
            return;
        }
        const formData = new FormData();

        formData.append("name", form.name.trim());
        formData.append("description", form.description.trim());
        formData.append("category", form.category);
        formData.append("location[address]", form.address.trim());
        formData.append("location[type]","Point")
        formData.append("location[city]", form.city.trim());
        formData.append("location[state]", form.state.trim());
        formData.append("location[coordinates][0]", coordinates.lng);
        formData.append("location[coordinates][1]", coordinates.lat);
        formData.append("pricing[min]", parseInt(form.minPrice));
        formData.append("pricing[max]", parseInt(form.maxPrice));
        formData.append("bestTimeToVisit", form.bestTimeToVisit.trim());
        
        images.forEach((img) => {
            formData.append("images", img);
        })

        try {
            await createPlace(formData).unwrap();
            toast.success("Place created successfully");
            navigate("/owner/places")
        } catch (error) {
             if (error?.data?.errors?.length > 0) {
                    error.data.errors.map((e)=> toast.error(e))
            } else {
                toast.error(error?.data?.message || "Failed to create place")
                }
        }
    }
  return (
      <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-semibold mb-6">
              Add New Place
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5">
              <input type="text" name="name" placeholder="Place Name" onChange={handleChange} required className="w-full border p-2 rounded" />
              
              <textarea name="description" placeholder="Description" onChange={handleChange} required className="w-full border p-2 rounded"></textarea>

              <select name="category" onChange={handleChange} className="w-full border p-2 rounded">
                  <option value="">Select category</option>
                  <option value="beach">Beach</option>
                  <option value="temple">Temple</option>
                  <option value="hill">Hill</option>
                  <option value="hotel">Hotel</option>
                  <option value="heritage">Heritage</option>
                  <option value="city">City</option>
                  <option value="nature">Nature</option>
              </select>

              <input type="text" name="address" placeholder="Address" onChange={handleChange} className="w-full border p-2 rounded" required />
              
              <div className="grid grid-cols-2 gap-4">
                  <input type="text" name="city" placeholder="City" onChange={handleChange} className="border p-2 rounded" required />
                  <input type="text" name="state" placeholder="State" onChange={handleChange} className="border p-2 rounded" required/>
              </div>

              <div>
                  <p className="text-sm mb-2">Select Location</p>
                  <MapPicker setCoordinates={setCoordinates} />
                  {coordinates && (
                      <p className="text-sm text-gray-500 mt-2">
                          Selected: {coordinates.lat.toFixed(5)}, {coordinates.lng.toFixed(5)}
                      </p>
                  )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                  <input type="number" name="minPrice" placeholder="Min Budget" onChange={handleChange} className="border p-2 rounded" min={0}/>
                  <input type="number" name="maxPrice" placeholder="Max Budget" onChange={handleChange} className="border p-2 rounded" min={0}/>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                  <input type="text" name="openTime" placeholder="Open Time" onChange={handleChange} className="border p-2 rounded"/>
                  <input type="text" name="closeTime" placeholder="Close Time" onChange={handleChange} className="border p-2 rounded"/>
              </div>

              <input type="text" placeholder="Best time to visit" name="bestTimeToVisit" className="w-full border p-2 rounded" onChange={handleChange}/>
              
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
              
              <button className="bg-primary text-white px-5 py-2 rounded" disabled={isLoading}>{isLoading ? "Creating...":"Create place"}</button>
          </form>
    </div>
  )
}

export default AddPlace