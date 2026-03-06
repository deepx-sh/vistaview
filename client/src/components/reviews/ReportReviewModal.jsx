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
        }

        try {
            await reportReview({
                targetType: "review",
                targetId: reviewId,
                reason,
                message
                
            }).unwrap();
            toast.success("Report submitted successfully")
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
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg  w-full max-w-md p-6">
              <div className="flex justify-between mb-4">
                  <h3 className="font-semibold">
                      Report Review
                  </h3>

                  <button onClick={onClose}><X size={18}/></button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                  <select value={reason} onChange={(e) => setReason(e.target.value)} className="w-full border border-border rounded-md px-3 py-2">
                      <option value="">Select reason</option>

                      {reasons.map((r) => (
                          <option key={r} value={r}>
                              {r.charAt(0).toUpperCase()+r.slice(1)}
                          </option>
                      ))}
                  </select>

                  <textarea placeholder="Additional details (optional)" value={message} onChange={(e) => setMessage(e.target.value)} className="w-full border border-border rounded-md px-3 py-2" rows="3">
                      
                  </textarea>
                  <button disabled={isLoading} className="w-full bg-danger text-white py-2 rounded-md">
                          {isLoading ? "Submitting...":"Submit Report"}
                      </button>
              </form>
          </div>
    </div>
  )
}

export default ReportReviewModal