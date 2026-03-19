import React from 'react'

const StatusBadge = ({ status }) => {
    const styles = {
        approved: "bg-green-100 text-green-700",
        pending: "bg-amber-100 text-amber-700",
        rejected:"bg-red-100 text-red-700"
    }
  return (
      <span className={`text-xs font-medium px-2 py-0.5 rounded ${styles[status] ?? styles.pending}`}>
          {status}
    </span>
  )
}

export default StatusBadge