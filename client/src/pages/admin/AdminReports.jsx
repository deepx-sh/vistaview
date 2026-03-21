import React, { useState } from 'react'
import { useGetAllReportsQuery, useRejectReportMutation, useResolveReportMutation } from '../../features/admin/adminApi';
import toast from 'react-hot-toast';
import ReportStatusBadge from '../../components/admin/reports/ReportStatusBadge';
import ActionModal from '../../components/admin/reports/ActionModal';

const AdminReports = () => {
    const { data: res, isLoading } = useGetAllReportsQuery();
    const [resolveReport, { isLoading: isResolving }] = useResolveReportMutation()
    const [rejectReport, { isLoading: isRejecting }] = useRejectReportMutation();
    const [modal, setModal] = useState(null)
    const [filter, setFilter] = useState("all")
    
    const reports = res?.data?.reports ?? []
    const filtered = filter === "all" ? reports : reports.filter((r) => r.status === filter)
    
    const handleConfirm = async ({ adminNote }) => {
        try {
            if (modal.action === "resolve") {
                await resolveReport({ id: modal.report._id, adminNote }).unwrap()
                toast.success("Report resolved")
            } else {
                await rejectReport({ id: modal.report._id, adminNote }).unwrap()
                toast.success("Report rejected")
            }
            setModal(null)
        } catch (error) {
            toast.error(error?.data?.message || "Failed")
        }
    }

    if(isLoading) return <p className='text-gray-400 text-center py-20'>Loading...</p>
  return (
      <div className='max-w-4xl mx-auto space-y-5'>
          <div className='flex items-center justify-between gap-3 flex-wrap'>
              <h1 className='text-2xl font-semibold'>Reports</h1>
              <div className='flex gap-2'>
                  {["all", "pending", "resolved", "rejected"].map((f) => (
                      <button key={f} onClick={() => setFilter(f)} className={`text-xs px-3 py-1.5 rounded-md border transition ${filter === f ? "bg-primary text-white border-primary" : "border-gray-300 hover:bg-gray-50"}`}>
                          {f.charAt(0).toUpperCase()+f.slice(1)}
                      </button>
                  ))}
              </div>
          </div>

          <p className='text-sm text-gray-500'>{filtered.length} reports</p>

          <div className='space-y-3'>
              {filtered.map((report) => (
                  <div key={report._id} className='border rounded-lg bg-white p-4 space-y-2'>
                      <div className='flex items-start justify-between gap-3 flex-wrap'>
                          <div>
                              <p className='text-sm font-medium capitalize'>{report.reason}</p>
                              <p className='text-xs text-gray-400'>
                                  Target: <span className='capitalize'>{report.targetType}</span> ·{" "}
                                  Reporter: {report.reporter?.name ?? "Unknown"}
                              </p>
                          </div>
                          <ReportStatusBadge status={report.status}/>
                      </div>

                      {report.message && (
                          <p className='text-xs text-gray-600 bg-gray-50 rounded p-2'>
                              {report.message}
                          </p>
                      )}

                      {report.adminNote && (
                          <p className='text-xs text-gray-500'>
                              <span className='font-medium'>Admin note: </span>{report.adminNote}
                          </p>
                      )}

                      <p className='text-xs text-gray-400'>
                          {new Date(report.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year:"numeric"
                          })}
                      </p>
                      {report.status === "pending" && (
                          <div className='flex gap-3 pt-1'>
                              <button onClick={() => setModal({ report, action: "resolve" })} className='text-xs text-green-600 hover:underline'>
                                  Mark Resolved
                              </button>

                              <button onClick={() => setModal({ report, action: "reject" })} className='text-xs text-red-500 hover:underline'>
                                  Reject
                              </button>
                          </div>
                      )}
                  </div>
              ))}

              {filtered.length === 0 && (
                  <p className='text-gray-400 text-sm text-center py-10'>No report found</p>
              )}
          </div>
          {modal && (
              <ActionModal
                  report={modal.report}
                  action={modal.action}
                  onClose={() => setModal(null)}
                  onConfirm={handleConfirm}
                  isLoading={isResolving || isRejecting}
              />
          )}
    </div>
  )
}

export default AdminReports