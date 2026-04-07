import React from 'react'
import {AlertTriangle} from 'lucide-react'
const ConfirmModal = ({
    isOpen,
    onClose,
    onConfirm,
    isLoading = false,
    title = "Are you sure?",
    message = "This action cannot be undone",
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    variant="danger"
}) => {

    if (!isOpen) return null
    
    const confirmStyles = {
        danger: "bg-danger hover:bg-red-500 text-white",
        warning:"bg-warning hover:bg-amber-500 text-white"
    }
  return (
      <div className='fixed inset-0  bg-black/50 z-50 flex items-center justify-center px-4'>
          <div className='bg-white rounded-xl w-full max-w-md p-6 shadow-xl'>
              
              <div className='flex items-start gap-4 mb-4'>
                  <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${variant === 'danger' ? 'bg-red-100' : 'bg-amber-100'}`}>
                      <AlertTriangle size={20} className={variant==='danger'? 'text-danger':'text-warning'} />
                  </div>
                  <div>
                      <h3 className='font-semibold text-gray-900 mb-1'>{title}</h3>
                      <p className='text-sm text-gray-500'>{message}</p>
                  </div>
              </div>

              <div className='flex gap-3 mt-6'>
                  <button onClick={onConfirm} disabled={isLoading} className={`flex-1 py-2 rounded-md text-sm font-semibold cursor-pointer transition-colors duration-200 disabled:opacity-60 ${confirmStyles[variant]}`}>
                      {isLoading ? "Please wait...":confirmLabel}
                  </button>

                  <button type="button" onClick={onClose} disabled={isLoading} className='flex-1 border border-gray-300 rounded-md py-2 text-sm cursor-pointer hover:bg-gray-100 transition-colors duration-200 disabled:opacity-60'>
                      {cancelLabel}
                  </button>
              </div>
          </div>
    </div>
  )
}

export default ConfirmModal