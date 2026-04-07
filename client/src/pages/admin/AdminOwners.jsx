import React, { useState } from 'react'
import { useGetPendingOwnersQuery, useReviewOwnerMutation } from '../../features/admin/adminApi';
import toast from 'react-hot-toast';
import { FileText } from 'lucide-react';
import RejectOwnerModal from '../../components/admin/owner/RejectOwnerModal';
import ConfirmModal from '../../components/common/ConfirmModal';
const AdminOwners = () => {
    const { data: res, isLoading } = useGetPendingOwnersQuery()
    const [reviewOwner, { isLoading: isReviewing }] = useReviewOwnerMutation()
    const [rejectTarget, setRejectTarget] = useState(null)
    
    const [approveModal, setApproveModal] = useState({
        isOpen: false,
        owner:null
    })
    const owners = res?.data ?? []
    const openApproveConfirm = (owner) => {
        setApproveModal({isOpen:true,owner})
    }

    const closeApproveConfirm = () => {
        setApproveModal({isOpen:false,owner:null})
    }
    const handleApprove = async () => {
       
        
        try {
            await reviewOwner({ userId:approveModal.owner._id, status: "approved" }).unwrap()
            toast.success("Owner approved")
            closeApproveConfirm()
        } catch (error) {
            toast.error(error?.data?.message || "Failed to approve")
            closeApproveConfirm()
        }
    }

    const handleReject = async ({ rejectedReason }) => {
        try {
            await reviewOwner({ userId: rejectTarget._id, status: "rejected", rejectedReason }).unwrap()
            toast.success("Owner rejected")
            setRejectTarget(null)
        } catch (error) {
            toast.error(error?.data?.message || "Failed to reject")
        }
    }

    if(isLoading) return <p className='text-gray-400 text-center py-20'>Loading...</p>
  return (
      <div className='max-w-4xl mx-auto space-y-5'>
          <h1 className='text-2xl font-semibold'>Owner Verification Requests</h1>
          <p className='text-sm text-gray-500'>{owners.length} pending application{owners.length !== 1 ? "s" : ""}</p>
          
          {owners.length == 0 && (
              <p className='text-gray-400 text-sm text-center py-20'>No pending owner requests</p>
          )}

          <div className='space-y-4'>
              {owners.map((owner) => {
                  const op = owner.ownerProfile;
                  return (
                      <div key={owner._id} className='border rounded-lg bg-white p-5 space-y-3'>
                          {/* Header */}
                          <div className='flex items-start justify-between gap-3 flex-wrap'>
                              <div>
                                  <p className='font-medium'>{owner.name}</p>
                                  <p className='text-xs text-gray-400'>{owner.email}</p>
                              </div>
                              <span className='text-xs bg-amber-50 text-amber-600 border border-amber-200 px-2 py-0.5 rounded'>
                                  Pending
                              </span>
                          </div>

                          {/* Business Info */}
                          <div className='grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm'>
                              <div>
                                  <span className='text-xs text-gray-400'>Business Name</span>
                                  <p className='font-medium'>{op?.businessName ?? "--"}</p>
                              </div>
                              <div>
                                  <span className='text-xs text-gray-400'>Contact</span>
                                  <p>{op?.contactNumber ?? "--"}</p>
                              </div>

                              <div className='sm:col-span-2'>
                                  <span className='text-xs text-gray-400'>Business Address</span>
                                  <p className='text-sm text-gray-600'>{op?.businessAddress ?? "--"}</p>
                              </div>
                          </div>

                          {/* Documents */}
                          {op?.documents?.length > 0 && (
                              <div>
                                  <p className='text-xs text-gray-400 mb-1'>Documents ({op.documents.length})</p>

                                  <div className='flex gap-2 flex-wrap'>
                                      {op.documents.map((doc, i) => (
                                          <a
                                              key={i}
                                              href={doc.url}
                                              target='_blank'
                                              rel="noreferrer"
                                              className='flex items-center gap-1 text-xs text-primary border border-primary/30 bg-primary/5 rounded px-2 py-1 hover:bg-primary/10 transition'
                                          >
                                              <FileText size={12} />
                                              Document {i+1}
                                          </a>
                                      ))}
                                  </div>
                              </div>
                          )}

                          {/* Applied Date */}
                          {op?.appliedAt && (
                              <p className='text-xs text-gray-400'>
                                  Applied:{" "}
                                  {new Date(op.appliedAt).toLocaleDateString("en-In", {
                                      day: "numeric",
                                      month: "short",
                                      year:"numeric"
                                  })}
                              </p>
                          )}

                          {/* Actions */}
                          <div className='flex gap-3 pt-1'>
                              <button onClick={() => openApproveConfirm(owner)} disabled={isReviewing} className='bg-primary text-white text-sm px-4 py-1.5 rounded-md cursor-pointer disabled:opacity-60 hover:bg-primary-hover transition'>Approve</button>
                              <button onClick={()=>setRejectTarget(owner)} className='border border-red-300 text-red-500 text-sm px-4 py-1.5 rounded-md cursor-pointer hover:bg-red-50 transition'>Reject</button>
                          </div>
                      </div>
                  )
              })}
          </div>

          <ConfirmModal
              isOpen={approveModal.isOpen}
              onClose={closeApproveConfirm}
              onConfirm={handleApprove}
              isLoading={isReviewing}
              title={`Approve ${approveModal.owner?.name}`}
              message="This will grant owner access. They'll be able to list and manage places on VistaView"
              confirmLabel="Approve Owner"
              variant="warning"
          />
          {rejectTarget && (
              <RejectOwnerModal owner={rejectTarget}
                  onClose={() => setRejectTarget(null)}
                  onConfirm={handleReject}
                  isLoading={isReviewing}
              />
          )}
    </div>
  )
}

export default AdminOwners