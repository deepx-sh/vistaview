import { useState } from "react";
import { X } from "lucide-react";
import { useReportReviewMutation } from "../../features/reports/reportApi";

const reasons = ["spam", "fake", "offensive", "misleading", "copyright", "other"];

import React from 'react'
import toast from "react-hot-toast";

const ReportReviewModal = ({ reviewId, onClose }) => {
    const [reason, setReason] = useState("");
    const [message, setMessage] = useState("");

    const [reportReview, { isLoading }] = useReportReviewMutation();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!reason) {
            alert("Please select a reason")
            return
        }

        try {
            await reportReview({
                targetType: "review",
                targetId: reviewId,
                reason,
                message
                
            }).unwrap();
            toast.success("Report submitted successfully")
            onClose();
        } catch (error) {
             if (error?.data?.errors.length > 0) {
                    error.data.errors.map((e)=> toast.error(e))
            } else {
                toast.error(error?.data?.message || "You have already report this")
                }
            
        }
        onClose();
    }
  return (
      <div className="fixed inset-0 bg-black/50 flex items-center px-4 justify-center z-50">
          <div className="bg-white rounded-xl  w-full max-w-md p-6">
              <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">
                      Report this review
                  </h3>

                  <button onClick={onClose} className="text-gray-400  hover:text-gray-600 cursor-pointer"><X size={18}/></button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                      <label className="text-sm font-medium text-gray-700 block mb-1">
                          Reason <span className="text-red-400">*</span>
                      </label>
                      <select value={reason} onChange={(e) => setReason(e.target.value)} className="w-full border border-border rounded-md px-3 py-2 text-sm">
                      <option value="">Select areason</option>

                      {reasons.map((r) => (
                          <option key={r} value={r}>
                              {r.charAt(0).toUpperCase()+r.slice(1)}
                          </option>
                      ))}
                  </select>
                  </div>

                  <div>
                      <label className="text-sm font-medium text-gray-700 block mb-1">
                          Additional details
                      </label>

                       <textarea placeholder="Additional details (optional)" value={message} onChange={(e) => setMessage(e.target.value)} className="w-full border border-border rounded-md resize-none  text-sm px-3 py-2" rows="3">
                      
                  </textarea>
                 </div>
                  <div className="flex gap-3">
                       <button disabled={isLoading} className="flex-1 bg-danger  hover:bg-red-500 disabled:opacity-50 cursor-pointer transition-colors duration-200 text-sm text-white py-2 rounded-md">
                          {isLoading ? "Submitting...":"Submit Report"}
                      </button>
                      <button type="button" onClick={onClose} className="flex-1 border border-gray-300 py-2 rounded-md text-sm cursor-pointer hover:bg-gray-100 transition">
                          Cancel
                      </button>
                 </div>
              </form>
          </div>
    </div>
  )
}

export default ReportReviewModal