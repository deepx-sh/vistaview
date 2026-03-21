import { useState } from "react";
import toast from "react-hot-toast";
import { useGetAllUsersQuery, useBlockUserMutation, useUnBlockUserMutation } from "../../features/admin/adminApi";
import React from 'react'
import RoleBadge from "../../components/admin/users/RoleBadge";
import BlockModal from "../../components/admin/users/BlockModal";

const AdminUsers = () => {
    const { data: res, isLoading } = useGetAllUsersQuery();
    const [blockUser, { isLoading: isBlocking }] = useBlockUserMutation();
    const [unblockUser, { isLoading: isUnblocking }] = useUnBlockUserMutation();
    const [blockTarget, setBlockTarget] = useState(null);
    const [search, setSearch] = useState("")
    const users = res?.data?.users ?? [];

    const filtered = users.filter((u) => (
        u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
    ))

    const handleBlock = async ({ reason }) => {
        try {
            await blockUser({ id: blockTarget._id, reason }).unwrap()
            toast.success("User blocked")
            setBlockTarget(null)
        } catch (error) {
            toast.error(error?.data?.message || "Failed to block user")
        }
    }

    const handleUnblock = async (id) => {
        if (!window.confirm("Unblock this user?")) return;
        try {
            await unblockUser(id).unwrap()
            toast.success("User unblocked")
        } catch (error) {
            toast.error(error?.data?.message || "Failed to unblock user")
        }
    }

    if(isLoading) return <p className="text-gray-400 text-center py-20">Loading...</p>
  return (
      <div className="max-w-5xl mx-auto space-y-5">
          <div className="flex items-center justify-between gap-4 flex-wrap">
              <h1 className="text-2xl font-semibold">Users</h1>
              <input type="text"
                  placeholder="Search by name or email"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="border border-border rounded-md px-3 py-1.5 text-sm w-64"
              />
          </div>
          <p className="text-sm text-gray-500">{filtered.length}</p>

          <div className="border rounded-lg bg-white overflow-hidden">
              <table className="w-full text-sm">
                  <thead className="border-b">
                      <tr>
                          <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs">Name</th>
                          <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs">Email</th>
                          <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs">Role</th>
                          <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs">Joined</th>
                          <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs">Status</th>
                          <th className="text-right px-4 py-3 font-medium text-gray-500 text-xs">Action</th>
                      </tr>
                  </thead>

                  <tbody>
                      {filtered.map((user) => (
                          <tr key={user._id} className="border-b last:border-none hover:bg-gray-50 transition">
                              <td className="px-4 py-3 font-medium">{user.name}</td>
                              <td className="px-4 py-3 text-gray-500 text-xs">{user.email}</td>
                              <td className="px-4 py-3"><RoleBadge role={user.role} /></td>
                              <td className="px-4 py-2 text-gray-400 text-xs">
                                  {new Date(user.createdAt).toLocaleDateString("en-In", {
                                      day: "numeric",
                                      month: "short",
                                      year:"numeric"
                                  })}
                              </td>

                              <td className="px-4 py-3">
                                  {user.isBlocked ? (
                                      <span className="text-xs text-red-500 font-medium">Blocked</span>
                                  ) : (
                                          <span className="text-xs text-green-600 font-medium">Active</span>
                                  )}
                              </td>

                              <td className="px-4 py-3 text-right">
                                  {user.role !== "admin" && (
                                      user.isBlocked ? (
                                          <button onClick={() => handleUnblock(user._id)} disabled={isUnblocking} className="text-xs text-green-600 hover:underline disabled:opacity-50">
                                              Unblock
                                          </button>
                                      ) : (
                                              <button onClick={()=>setBlockTarget(user)} className="text-xs text-red-500 hover:underline">Block</button>
                                      )
                                  )}
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
          {blockTarget && (
              <BlockModal user={blockTarget} onClose={()=>setBlockTarget(null)} onConfirm={handleBlock} isLoading={isBlocking} />
          )}
    </div>
  )
}

export default AdminUsers