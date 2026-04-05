import React from 'react'
import { useForm } from 'react-hook-form';

const RejectOwnerModal = ({ owner, onClose, onConfirm, isLoading }) => {
    const {register,handleSubmit,formState:{errors}}=useForm()
  return (
      <div className='fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4'>
          <div className='bg-white rounded-xl w-full max-w-md p-6'>
              <h3 className='font-semibold mb-1'>Reject {owner.name}'s Applications</h3>
              <p className='text-sm text-gray-500 mb-4'>Provide a rejection reason</p>
              <form onSubmit={handleSubmit(onConfirm)} className='space-y-3'>
                  <textarea rows={3}
                      placeholder='Rejection reason'
                      className={`w-full border rounded-md px-3 py-2 text-sm resize-none ${errors.rejectedReason ? "border-red-400" : "border-gray-300"}`}
                      {...register("rejectedReason", {
                          required: "Reason is required",
                          minLength:{value:5,message:"At least 5 characters"}
                      })}
                  />
                  {errors.rejectedReason && <p className='text-xs text-red-500'>{errors.rejectedReason.message}</p>}

                  <div className='flex gap-3'>
                      <button type="submit" disabled={isLoading} className='flex-1 bg-danger cursor-pointer hover:bg-red-500 transition-colors text-white rounded-md py-2 text-sm disabled:opacity-60'>
                          {isLoading?"Rejecting...":"Reject"}
                      </button>

                      <button type="button" onClick={onClose} className='flex-1 border border-gray-300 cursor-pointer hover:bg-gray-100 transition duration-200 rounded-md py-2 text-sm hover:bg-gray-150'>
                          Cancel
                      </button>
                  </div>
              </form>
          </div>
    </div>
  )
}

export default RejectOwnerModal