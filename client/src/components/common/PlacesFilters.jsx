import React from 'react'
import { useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'

const categories = [
    "beach",
    "temple",
    "hill",
    "hotel",
    "heritage",
    "city",
    "nature"
]
const PlacesFilters = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const [q, setQ] = useState(searchParams.get("q") || "");
    const [city, setCity] = useState(searchParams.get("city") || "");
    const [category, setCategory] = useState(searchParams.get("category") || "");
    const [minRating, setMinRating] = useState(searchParams.get("minRating") || "");
    const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
    const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");

    useEffect(() => {
        const timeout = setTimeout(() => {
            const params = Object.fromEntries(searchParams);
            if (q) {
                params.q = q;
            } else {
                delete params.q
            }
            params.page = 1;
            setSearchParams(params);
        }, 500)
        
        return () => clearTimeout(timeout);
    }, [q])
    
    const handleApply = () => {
        const params = {};

        if (q) params.q = q;
        if (city) {
            let capCity = city.charAt(0).toUpperCase() + city.slice(1);
            params.city=capCity
        }

        if (category) params.category = category;
        if (minRating) params.minRating = minRating;
        if (minPrice) params.minPrice = minPrice;
        if (maxPrice) params.maxPrice = maxPrice;

        params.page = 1;
        
        setSearchParams(params);
    }

    const handleClear = () => {
        setQ("");
        setCity("");
        setCategory("");
        setMinRating("");
        setMinPrice("");
        setMaxPrice("");
        setSearchParams({});
    }
  return (
      <div className='bg-surface border border-border rounded-xl p-6 mb-10 shadow-sm'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4'>
              
              <input type="text"
                  placeholder='Search Places...'
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  className='border border-border focus:right-2 focus:ring-primary rounded-md px-3 py-2'
              />

              <input type="text"
                  placeholder='City'
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className='border border-border focus:right-2 focus:ring-primary rounded-md px-3 py-2'
              />


              <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className='border border-border focus:right-2 focus:ring-primary rounded-md px-3 py-2'
              >
                  
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                  ))}
              </select>

              <select
                  value={minRating}
                  onChange={(e) => setMinRating(e.target.value)}
                  className='border border-border focus:right-2 focus:ring-primary rounded-md px-3 py-2'
              >
                  <option value="">Any Rating</option>
                  <option value="4">4 & Above</option>
                  <option value="3">3 & Above</option>
                  <option value="2">2 & Above</option>
              </select>

              <input type="number"
                  placeholder='Min Budget'
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className='border border-border focus:right-2 focus:ring-primary rounded-md px-3 py-2'
              />

              <input type="number"
                  placeholder='Max Budget'
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className='border border-border focus:right-2 focus:ring-primary rounded-md px-3 py-2'
              />

              <div className='flex gap-2'>
                  <button onClick={handleApply} className='flex-1 bg-primary text-white rounded-md py-2 hover:bg-primary-hover hover:cursor-pointer transition duration-200'>Apply</button>
                  <button onClick={handleClear} className='flex-1 bg-danger text-white rounded-md py-2 hover:bg-danger/80 hover:cursor-pointer transition duration-200'>Clear</button>
              </div>
          </div>
    </div>
  )
}

export default PlacesFilters