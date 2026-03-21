import React from 'react'

const StatusBadges = ({ status }) => {
    const cls = {
        approved:"bg-green-100 text-green-700",
        pending:"bg-amber-100 text-amber-700",
        rejected:"bg-red-100 text-red-700",
    }
  return (
      <span className={`text-xs px-2 py-0.5 rounded font-medium ${cls[status] ?? cls.pending}`}>
          {status}
    </span>
  )
}

export default StatusBadges