import React from 'react'

const RoleBadge = ({ role }) => {
    const cls = {
        admin: "bg-purple-100 text-purple-700",
        owner: "bg-blue-100 text-blue-700",
        user:"bg-gray-100 text-gray-600"
    }
  return (
      <span className={`text-xs px-2 py-0.5 rounded font-medium ${cls[role] ?? cls.user}`}>
          {role}
    </span>
  )
}

export default RoleBadge