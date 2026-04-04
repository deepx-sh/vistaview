import React from 'react'
import { useForm } from 'react-hook-form';

const BlockModal = ({ user, onClose, onConfirm, isLoading }) => {
    const {register,handleSubmit,formState:{errors}}=useForm()
  return (
      <div className='fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4'>
          <div className='bg-white rounded-xl w-full max-w-md p-6'>
              <h3 className='font-semibold mb-1'>Block {user.name}</h3>
              <p className='text-sm text-gray-500 mb-4'>Provide a reason for blocking this user</p>

              <form onSubmit={handleSubmit(onConfirm)} className='space-y-3'>
                  <textarea rows={3}
                      placeholder='Reason for blocking...'
                      className={`w-full border rounded-md px-3 py-2 text-sm resize-none ${errors.reason ? "border-red-400" : "border-gray-300"}`}
                      {...register("reason", {
                          required: "Reason is required",
                          minLength: { value: 5, message: "At least 5 characters" },
                          maxLength:{value:200,message:"Max 200 characters"}
                      })}
                  />
                  {errors.reason && <p className='text-xs text-red-500'>{errors.reason.message}</p>}
                  <div className='flex gap-3'>
                      <button type='submit' disabled={isLoading} className='flex-1 bg-danger hover:bg-red-500 transition-colors duration-200 cursor-pointer text-white rounded-md py-2 text-sm disabled:opacity-50'>
                          {isLoading ?"Blocking...":"Block User"}
                      </button>

                      <button type='button' onClick={onClose} className='flex-1 border border-gray-300 rounded-md py-2 text-sm cursor-pointer hover:bg-gray-100 transition-colors duration-200'>
                          Cancel
                      </button>
                  </div>
              </form>
          </div>
    </div>
  )
}

export default BlockModal