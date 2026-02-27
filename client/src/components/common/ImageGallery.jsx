import { useState } from "react";
import { ChevronLeft,ChevronRight } from "lucide-react";
import React from 'react'

const ImageGallery = ({ images = [] }) => {
    const [activeIndex, setActiveIndex] = useState(0);

    if (!images.length) {
        return (
            <div className="w-full h-[400px] bg-border rounded-xl flex items-baseline justify-center">
                <p className="text-text-muted">No images available</p>
            </div>
        )
    }

    const handlePrev = () => {
        setActiveIndex((prev) =>
            prev===0 ? images.length-1:prev-1
        )
    }
    const handleNext = () => {
        setActiveIndex((prev) =>
            prev === images.length - 1 ? 0 : prev + 1
        )
    }
  return (
      <div className="space-y-4">
          <div className="relative rounded-xl overflow-hidden">
              {/* Main Image Wrapper */}
              <img src={images[activeIndex]?.url} alt="Place" className="w-full h-[400px] object-cover transition-all duration-300" />
              
              {/* Prev Button */}
              {images.length > 1 && (
                  <>
                      <button onClick={handlePrev} className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition">
                        <ChevronLeft size={20}/>  
                      </button>
                      
                      {/* Next Button */}
                      <button onClick={handleNext} className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition">
                        <ChevronRight size={20}/>  
                      </button>
                      
                      {/* Counter */}
                      <div className="absolute bottom-3 right-3 bg-black/60 text-white text-sm px-3 py-1 rounded-full">
                        {activeIndex+1} / {images.length}
                      </div>
                  </>
              )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                  {images.map((img, index) => (
                      <button key={index} onClick={() => setActiveIndex(index)} className={`rounded-lg overflow-hidden border-2 ${activeIndex === index ? "border-primary" : "border-transparent"}`}>
                          
                          <img src={img.url} alt="Thumbnails" className="w-24 h-20 object-cover" />
                      </button>
                  ))}
              </div>
          )}
    </div>
  )
}

export default ImageGallery