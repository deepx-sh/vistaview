import React from 'react'
import { X } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
const ActiveFilterChips = () => {

    const [searchParams, setSearchParams] = useSearchParams();

    const filters = Object.fromEntries(searchParams);

    const removeFilter = (key) => {
        const params = { ...filters };
        delete params[key]
        params.page = 1;
        setSearchParams(params)
    }

    const chipMap = {
        q: (val) => `Search: ${val}`,
        city: (val) => `City: ${val}`,
        category: (val) => `Category: ${val}`,
        minRating: (val) => `${val}★+`,
        minPrice: (val) => `Min ₹${val}`,
        maxPrice: (val) => `Max ₹${val}`,
        
    }

    const keys = Object.keys(filters).filter(
        (key)=>chipMap[key]
    )

    if (keys.length === 0) return null;
  return (
      <div className='flex flex-wrap gap-3 mb-6'>
          {keys.map((key) => (
              <div key={key}
                className='flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm'
              >
                  {chipMap[key](filters[key])}
                  <button onClick={()=>removeFilter(key)}><X size={14}/></button>
              </div>
          ))}
    </div>
  )
}

export default ActiveFilterChips