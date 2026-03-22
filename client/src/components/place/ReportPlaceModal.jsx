import { useState } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import { useReportReviewMutation } from "../../features/reports/reportApi";

const REASONS = ["spam", "fake", "offensive", "misleading", "copyright", "other"];

import React from 'react'

const ReportPlaceModal = ({ placeId, onClose }) => {
    const [reason, setReason] = useState("")
    const [message, setMessage] = useState("")
    const [reportPlace, { isLoading }] = useReportReviewMutation()
    
    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!reason) {
            toast.error("Please select a reason")
            return;
        }

        try {
            await reportPlace({
                targetType: "place",
                targetId: placeId,
                reason,
                message
            }).unwrap()
            toast.success("Report submitted. Thank you")
            onClose()
        } catch (error) {
            if (error?.data?.errors?.length > 0) {
                error.data.errors.forEach((e)=>toast.error(e))
            } else {
                toast.error(error?.data?.message || "You have already reported this place")
            }
        }
    }
  return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-xl w-full max-w-md p-6">
              <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Report this place</h3>
                  <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                      <X size={18}/>
                  </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                      <label className="text-sm font-medium text-gray-700 block mb-1">
                          Reason <span className="text-red-400">*</span>
                      </label>
                      <select
                          value={reason}
                          onChange={(e) => setReason(e.target.value)}
                          className="w-full border border-border rounded-md px-3 py-2 text-sm"
                      >
                          <option value="">Select a reason</option>
                          {REASONS.map((r) => (
                              <option key={r} value={r}>
                                  {r.charAt(0).toUpperCase()+r.slice(1)}
                              </option>
                          ))}
                      </select>
                  </div>

                  <div>
                      <label className="text-sm font-medium text-gray-700 block mb-1">
                          Additional details <span className="text-gray-400 font-normal">(optional)</span>
                      </label>

                      <textarea value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Describe the issue..."
                          rows={3}
                          maxLength={300}
                          className="w-full border border-border rounded-md px-3 py-2 text-sm resize-none"
                      />
                      <p className="text-xs text-gray-400 mt-1 text-right">{message.length}/300</p>
                  </div>

                  <div className="flex gap-3">
                      <button
                          type="submit"
                          disabled={isLoading}
                          className="flex-1 bg-danger text-white py-2 rounded-md text-sm disabled:opacity-60 hover:bg-danger/90 transition"
                      >
                          {isLoading? "Submitting...":"Submit Report"}
                      </button>

                      <button type="button" onClick={onClose} className="flex-1 border border-gray-300 py-2 rounded-md text-sm hover:bg-gray-50 transition">
                          Cancel
                      </button>
                  </div>
              </form>
          </div>
    </div>
  )
}

export default ReportPlaceModal