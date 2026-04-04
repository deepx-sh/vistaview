import React from 'react'
import { useForm } from 'react-hook-form';

const ActionModal = ({ report, action, onClose, onConfirm, isLoading }) => {
    const {register,handleSubmit,formState:{errors}}=useForm()
  return (
      <div className='fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4'>
          <div className='bg-white rounded-xl w-full max-w-md p-6'>
              <h3 className='font-semibold mb-1 capitalize'>{action}</h3>
              <p className='text-sm text-gray-500 mb-4'>Add an admin note for this action</p>

              <form onSubmit={handleSubmit(onConfirm)} className='space-y-3'>
                  <textarea
                      rows={3}
                      placeholder='Admin note...'
                      className={`w-full border rounded-md px-3 py-2 text-sm resize-none ${errors.adminNote ? "border-red-400" : "border-gray-300"}`}
                      {...register("adminNote", {
                          required: "Admin note is required",
                          maxLength:{value:200,message:"Max 200 characters"}
                      })}
                  />
                  {errors.adminNote && <p className='text-xs text-red-500'>{errors.adminNote.message}</p>}

                  <div className='flex gap-3'>
                      <button type="submit" disabled={isLoading} className={`flex-1 text-white rounded-md py-2 text-sm disabled:opacity-60 cursor-pointer transition-colors duration-200 ${action === "resolve" ? "bg-primary hover:bg-primary-hover" : "bg-danger hover:bg-red-500"}`}>
                          {isLoading ? "Saving...": action==="resolve"?"Mark Resovled":"Reject Report"}
                      </button>
                      <button type="button" onClick={onClose} className='flex-1 border border-gray-300 rounded-md py-2 text-sm hover:bg-gray-100 transition-colors duration-200 cursor-pointer'>Cancel</button>
                  </div>
              </form>
          </div>
    </div>
  )
}

export default ActionModal