import React from 'react'
import { useEffect } from 'react'
import { ChevronLeft,ChevronRight,X } from 'lucide-react'
const ImageModal = ({ images, currentIndex, setCurrentIndex, onClose }) => {
    const handlePrev = () => {
        setCurrentIndex((prev) =>
            prev==0 ? images.length-1:prev-1
        )
    }
    const handleNext = () => {
        setCurrentIndex((prev) =>
            prev == images.length - 1 ? 0 : prev + 1
        )
    }

    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === "Escape") onClose()
            if (e.key === "ArrowLeft") handlePrev()
            if(e.key==="ArrowRight") handleNext()
        }
        
        window.addEventListener("keydown", handleKey)
        
        return ()=>window.removeEventListener("keydown",handleKey)
    },[])
  return (
      <div className='fixed inset-0 bg-black/90 z-50 flex items-center justify-center'>
          {/* Close */}
          <button onClick={onClose} className='absolute top-6 right-6 text-white'><X size={28} /></button>
          
          {/* Prev */}
          {images.length > 1 && (
              <button onClick={handlePrev} className='absolute left-6 text-white'>
                  <ChevronLeft size={40}/>
              </button>
          )}

          {/* Image */}
          <img src={images[currentIndex].url} alt="Image Preview" className='max-h-[85vh] max-w-[90vw] object-contain' />

          {/* Next */}
          {images.length > 1 && (
              <button onClick={handleNext} className='absolute right-6 text-white'><ChevronRight size={40} /></button>
          )}

          {/* Counter */}
          <div className='absolute bottom-6 text-white text-sm'>
              {currentIndex+1} / {images.length}
          </div>
    </div>
  )
}

export default ImageModal