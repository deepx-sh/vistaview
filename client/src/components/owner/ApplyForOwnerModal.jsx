import React from 'react'
import { useState } from "react";
import { useForm } from "react-hook-form";
import { X, Upload, FileText, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import { useApplyForOwnerMutation } from "../../features/owner/ownerApi";
import useFileValidation from '../../hooks/useFileValidation';
import handleApiError from '../../utils/handleApiError';


const MAX_DOCS = 3;
const MAX__MB = 5;

const ApplyForOwnerModal = ({ onClose, ownerProfile }) => {
    const [documents, setDocuments] = useState([])
    const [applyForOwner, { isLoading }] = useApplyForOwnerMutation();
    const {validate,DOC_TYPES}=useFileValidation()
    const { register, handleSubmit, formState: { errors } } = useForm();
    
    const status = ownerProfile?.status ?? "not_applied";

    const handleDocChange = (e) => {
        const files =  Array.from(e.target.files);
        e.target.value=""
        const valid = validate({
            files,
            allowedTypes: DOC_TYPES,
            maxSizeMB: MAX__MB,
            maxCount: MAX_DOCS,
            currentCount:documents.length
        })
        if (valid.length > 0) setDocuments((prev) => [...prev, ...valid]);
        }

    const removeDoc = (index) => {
        setDocuments((prev)=> prev.filter((_,i)=>i!==index))
    }

    const onSubmit = async (data) => {
        if (documents.length == 0) {
            toast.error("At least one document is required")
            return 
        }

        const formData = new FormData();
        formData.append("businessName", data.businessName.trim());
        formData.append("businessAddress", data.businessAddress.trim())
        formData.append("contactNumber", data.contactNumber.trim());
        documents.forEach((doc) => formData.append("documents", doc))
        
        try {
            await applyForOwner(formData).unwrap()
            toast.success("Application submitted We'll review it shortly")
            onClose()
        } catch (error) {
           handleApiError(error,"Failed to submit application")
      
      }
    }
    const isPending = status === "pending"
    const isRejected=status==="rejected"
  return (
      <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 overflow-y-auto'>
          <div className='w-full max-w-lg rounded-xl bg-white p-6 shadow-xl'>
              {/* Header */}
              <div className='mb-5 flex items-center justify-between'>
                  <h2 className='text-xl font-semibold'>Apply for Owner Verification</h2>
                  <button onClick={onClose} className='text-gray-400 hover:text-gray-400'>
                      <X size={20}/>
                  </button>
              </div>

              {isPending && (
                  <div className='mb-4 flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4'>
                      <AlertCircle size={18} className='mt-0.5 shrink-0 text-amber-500' />
                      <div>
                          <p className='text-sm font-medium text-amber-700'>Application Under Review</p>
                          <p className='text-sm text-amber-600'>Your application is pending admin approval. We'll notify you once it's reviewed</p>
                      </div>
                  </div>
              )}


              {isRejected && (
                  <div className='mb-4 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4'>
                      <AlertCircle size={18} className='mt-0.5 shrink-0 text-red-500' />
                      <div>
                          <p className='text-sm font-medium text-red-700'>Application Rejected</p>
                          {ownerProfile?.rejectedReason && (
                              <p className='text-sm text-red-600'>Reason: {ownerProfile.rejectedReason}</p>
                          )}
                          <p className='text-sm text-red-600 mt-1'>
                              You may reapply with updated information below
                          </p>
                      </div>

                  </div>
              )}

              {!isPending && (
                  <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
                      <div>
                          <label className='mb-1 block text-sm font-medium text-gray-700'>Business Name</label>
                          <input type="text"
                              placeholder='e.g. Royal Heritage Stays'
                              required
                              className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary ${errors.businessName ? "border-red-400":"border-gray-300"}`}
                              {...register("businessName", {
                                  required: "Business name is required",
                                  minLength: { value: 3, message: "Must be at least 3 characters" },
                                  maxLength:{value:100,message:"Must be at most 100 characters"}
                              })}
                          />
                          {errors.businessName && (
                              <p className='mt-1 text-xs text-red-500'>{errors.businessName.message}</p>
                          )}
                      </div>

                      {/* Business Address */}
                      <div>
                          <label className='mb-1 block text-sm font-medium text-gray-700'>Business Address</label>
                          <textarea rows={2}
                              required
                              placeholder='Full business address'
                              className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none ${errors.businessAddress ? "border-red-400" : "border-gray-300"}`}
                              {...register("businessAddress", {
                                  required: "Business address is required",
                                  minLength: { value: 10, message: "Must be at least 10 characters" },
                                  maxLength:{value:300,message:"Must be at most 300 characters"}
                              })}
                          />
                          {errors.businessAddress && (
                              <p className='mt-1 text-xs text-red-500'>{errors.businessAddress.message}</p>
                          )}
                      </div>

                      {/* Contact Number */}
                      <div>
                          <label className='mb-1 block text-sm font-medium text-gray-700'>
                              Contact Number
                          </label>

                          <input type="text"
                              required
                              placeholder='10 digit mobile number'
                              maxLength={10}
                              className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary ${errors.contactNumber ? "border-red-400" : "border-gray-300"}`}
                              {...register("contactNumber", {
                                  required: "Contact number is required",
                                  pattern: {
                                      value: /^[0-9]{10}$/,
                                      message:"Must be valid 10-digit number"
                                  }
                              })}
                          />
                          {errors.contactNumber && (
                              <p className='mt-1 text-xs text-red-500'>{errors.contactNumber.message}</p>
                          )}
                      </div>

                      <div>
                          <label className='mb-1 block text-sm font-medium text-gray-700'>
                              Verification Documents{" "}
                              <span className='font-normal text-gray-400'>({documents.length}/{MAX_DOCS})</span>
                          </label>
                          <p className='mb-2 text-xs text-gray-400'>
                              Upload business registration, GST, or any govt-issued ID, JPG, PDF max {MAX__MB}MB each
                          </p>

                          <label className={`flex cursor-pointer items-center gap-2 rounded-md border-2 border-dashed px-4 py-2 text-sm transition hover:border-primary hover:bg-primary/5 ${documents.length >= MAX_DOCS ? "pointer-events-none opacity-50" : "border-gray-300"}`}>
                              <Upload size={16} className='text-gray-400' />
                              <span className='text-gray-500'>Click to upload documents</span>
                              <input type="file"
                                  multiple
                                  accept='image/jpeg,image/jpg,image/png,application/pdf'
                                  className='hidden'
                                  disabled={documents.length >=  MAX_DOCS}
                                    onChange={handleDocChange}
                              />
                          </label>

                          {documents.length > 0 && (
                              <ul className='mt-2 space-y-1'>
                                  {documents.map((doc, i) => (
                                      <li key={i} className='flex items-center justify-between rounded-md bg-gray-50 px-3 py-2 text-sm'>
                                          <div className='flex items-center gap-2 min-w-0'>
                                              <FileText size={14} className='shrink-0 text-primary' />
                                              <span className='truncate text-gray-700'>{doc.name}</span>
                                              <span className='shrink-0 text-xs text-gray-400'>({(doc.size / 1024).toFixed(0)} KB)</span>
                                          </div>
                                          <button type='button' onClick={()=> removeDoc(i)} className='ml-2 shrink-0 text-gray-400 hover:text-red-500'><X size={14}/></button>
                                      </li>
                                  ))}
                              </ul>
                          )}
                      </div>

                      {/* Info */}
                      <div className='rounded-md border border-blue-100 bg-blue-50 px-3 py-2 text-xs text-blue-600'>
                          After submission your application will be reviewed by our admin team. You'll be notified once approved
                      </div>

                      <div className='flex gap-3 pt-1'>
                          <button type='submit' disabled={isLoading} className='flex-1 rounded-md bg-primary py-2 text-sm text-white disabled:opacity-60 hover:bg-primary-hover transition'>
                              {isLoading ? "Submitting...":"Submit Application"}
                          </button>
                          <button type='button' onClick={onClose} className='flex-1 rounded-md border border-gray-300 py-2 text-sm hover:bg-gray-50 transition'>
                              Cancel
                          </button>
                      </div>
                  </form>
              )}

              {isPending && (
                  <button onClick={onClose} className='mt-2 w-full rounded-md border border-gray-50 py-2 text-sm hover:bg-gray-50 transition'>Close</button>
              )}
          </div>
    </div>
  )
}

export default ApplyForOwnerModal