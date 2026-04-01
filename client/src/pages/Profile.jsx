import { useState } from "react";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useUploadAvatarMutation,
  useDeleteAvatarMutation,
} from "../features/user/userApi";
import React from "react";
import toast from "react-hot-toast";
import ApplyForOwnerModal from "../components/owner/ApplyForOwnerModal";
import ChangePasswordForm from "../components/ui/ChangePasswordForm";

const OwnerStatusBadge = ({ status }) => {
  const map = {
    not_applied: null,
    pending:{label:"Pending Review",cls:"bg-amber-100 text-amber-700"},
    approved:{label:"Verified Owner",cls:"bg-green-100 text-green-700"},
    rejected:{label:"Application Rejected",cls:"bg-red-100 text-red-700"}
  }

  const badge = map[status]
  if (!badge) return null
  
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${badge.cls}`}>{badge.label}</span>
  )
}
const Profile = () => {
  const { data, isLoading } = useGetProfileQuery();
  const [updateProfile,{isLoading:isUpdatingProfile}] = useUpdateProfileMutation();
  const [uploadAvatar] = useUploadAvatarMutation();
  const [deleteAvatar] = useDeleteAvatarMutation();

  const [name, setName] = useState("");
  const [showOwnerModal, setShowOwnerModal] = useState(false);

  if (isLoading) return <p className="text-center py-20 text-text-muted">Loading...</p>;
  const user = data?.data?.user;
  const ownerProfile = user?.ownerProfile;
  const ownerStatus = ownerProfile?.status ?? "not_applied"

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      await updateProfile({ name:name.trim() }).unwrap();
      toast.success("Name updated successfully");
    } catch (error) {
      if (error?.data?.errors.length > 0) {
        error.data.errors.map((e) => toast.error(e));
      } else {
        toast.error(error?.data?.message || "Failed to update name");
      }
    }
  };

  const handleAvatarUpload = async (e) => {
    e.preventDefault();

    const file = e.target.files[0];
    if (!file) return;
    const allowed = ["image/png", "image/jpg", "image/jpeg"];

    if (!allowed.includes(file.type)) {
      toast.error("Only JPG and PNG images are allowed")
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Profile picture must be under 2MB")
      return
    }
    const formData = new FormData();
    formData.append("avatar", file);

    try {
      await uploadAvatar(formData).unwrap();
      toast.success("Avatar updated successfully");
    } catch (error) {
      toast.error(error?.data?.message || "Avatar upload failed");
    }
  };

  const handleAvatarDelete = async () => {
    try {
      await deleteAvatar().unwrap();
      toast.success("Avatar deleted successfully and reverted to default");
    } catch (error) {
      toast.error(error?.data?.message || "You can't remove default");
    }
  };

  const canApply = ownerStatus === "not_applied" || ownerStatus === "rejected";
  const isPending=ownerStatus==="pending"
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="mb-8 text-2xl font-semibold">My Profile</h1>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Avatar Section */}
        <div className="bg-surface max-h-max border-border flex flex-col items-center rounded-lg border p-6">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt="User Avatar"
              className="h-28 w-28 rounded-full object-cover"
            />
          ) : (
            <div className="bg-primary flex h-28 w-28 items-center justify-center rounded-full text-3xl font-semibold text-white">
              {user.name?.[0]}
            </div>
          )}

          <div className="mt-6 flex gap-3">
            <label className="border-border cursor-pointer rounded-md border px-4 py-2 text-sm hover:bg-gray-100 transition">
              Upload
              <input
                type="file"
                accept="image/jpeg,image/png,image/jpg"
                hidden
                onChange={handleAvatarUpload}
              />
            </label>

            {user.avatarPublicId && (
              <button
                onClick={handleAvatarDelete}
                className="border-border rounded-md border px-4 py-2 text-sm hover:bg-gray-100 transition"
              >
                Remove
              </button>
            )}
          </div>
          <p className="text-xs text-text-muted mt-3 text-center">JPG, PNG max 2MB</p>
        </div>

        {/* Profile Info */}

        <div className="space-y-5 md:col-span-2">
          <div className="bg-surface border-border space-y-5 rounded-lg border p-6">
          {/* Name */}
          <div>
            <label className="text-text-muted text-sm block mb-1">Name</label>
            <input
              defaultValue={user.name}
              onChange={(e) => setName(e.target.value)}
              className="border-border mt-1 w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-text-muted text-sm block mb-1">Email</label>
            <input
              value={user.email}
              disabled
              className="border-border mt-1 w-full cursor-not-allowed rounded-md border text-sm bg-gray-100 px-3 py-2"
            />
          </div>

          {/* Role */}
          <div>
            <p className="text-text-muted text-sm">Account Role</p>
            <span className="bg-primary/10 text-primary mt-1 inline-block rounded-full px-3 py-1 text-sm">
              {user.role}
            </span>
          </div>
            {/* Apply Owner */}

            {user.role === "user" && (
            <div className="border-t border-gray-100 pt-4">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <p className="text-sm font-medium text-gray-700">Owner Verification</p>
                  <p className="text-xs text-gray-400 mt-0.5">List and manage your own places on VistaView</p>
                  {ownerStatus !== "not_applied" && (
                    <div className="mt-2">
                      <OwnerStatusBadge status={ownerStatus}/>
                    </div>
                  )}
                </div>
                {canApply && (
                  <button onClick={() => setShowOwnerModal(true)} className="bg-primary text-white rounded-md px-4 py-2 text-sm hover:bg-primary-hover transition duration-200 shrink-0">
                    {ownerStatus==="rejected"?"Reapply":"Apply for owner"}
                  </button>
                )}

                {isPending && (
                  <button onClick={() => setShowOwnerModal(true)} className="border border-amber-400 text-amber-600 rounded-md px-4 py-2 text-sm hover:bg-amber-50 transition duration-200 shrink-0">
                    View Status
                  </button>
                )}
                </div>
                {ownerStatus === "rejected" && ownerProfile?.rejectedReason && (
                  <p className="mt-2 text-xs text-red-500">
                    Rejection reason: {ownerProfile.rejectedReason}
                  </p>
                )}
              </div>
              
            )}
    
          <button onClick={handleUpdate} className="bg-primary hover:bg-primary-hover cursor-pointer rounded-md px-6 py-2 text-white transition duration-200 text-sm">{isUpdatingProfile ? "Updating...": "Update Profile"}</button>
    
          </div>
          
          <ChangePasswordForm/>
        </div>
      </div>

      {showOwnerModal && (
        <ApplyForOwnerModal onClose={()=>setShowOwnerModal(false)} ownerProfile={ownerProfile} />
      )}
    </div>
  );
};

export default Profile;
