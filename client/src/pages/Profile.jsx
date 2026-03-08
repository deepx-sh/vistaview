import { useState } from "react";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useUploadAvatarMutation,
  useDeleteAvatarMutation,
} from "../features/user/userApi";
import React from "react";
import toast from "react-hot-toast";

const Profile = () => {
  const { data, isLoading } = useGetProfileQuery();
  const [updateProfile] = useUpdateProfileMutation();
  const [uploadAvatar] = useUploadAvatarMutation();
  const [deleteAvatar] = useDeleteAvatarMutation();

  const [name, setName] = useState("");

  if (isLoading) return <p>Loading...</p>;
  const user = data?.data?.user;

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!name) return;
    try {
      await updateProfile({ name }).unwrap();
      toast.success("Name updated successfully");
    } catch (error) {
      if (error?.data?.errors.length > 0) {
        error.data.errors.map((e) => toast.error(e));
      } else {
        toast.error(error?.data?.message);
      }
    }
  };

  const handleAvatarUpload = async (e) => {
    e.preventDefault();

    const file = e.target.files[0];
    console.log(file);
    if (!file) return;

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
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="mb-4 text-2xl font-semibold">My Profile</h1>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Avatar Section */}
        <div className="bg-surface border-border flex flex-col items-center rounded-lg border p-6">
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
            <label className="border-border cursor-pointer rounded-md border px-4 py-2 text-sm hover:bg-gray-100">
              Upload
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleAvatarUpload}
              />
            </label>

            {user.avatar && (
              <button
                onClick={handleAvatarDelete}
                className="border-border rounded-md border px-4 py-2 text-sm hover:bg-gray-100"
              >
                Remove
              </button>
            )}
          </div>
        </div>

        {/* Profile Info */}

        <div className="bg-surface border-border space-y-5 rounded-lg border p-6 md:col-span-2">
          {/* Name */}
          <div>
            <label className="text-text-muted text-sm">Name</label>
            <input
              defaultValue={user.name}
              onChange={(e) => setName(e.target.value)}
              className="border-border mt-1 w-full rounded-md border px-3 py-2"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-text-muted text-sm">Email</label>
            <input
              value={user.email}
              disabled
              className="border-border mt-1 w-full cursor-not-allowed rounded-md border bg-gray-100 px-3 py-2"
            />
          </div>

          {/* Role */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-muted text-sm">Account Role</p>
              <span className="bg-primary/10 text-primary mt-1 inline-block rounded-full px-3 py-1 text-sm">
                {user.role}
              </span>
            </div>

            {/* Apply Owner */}

            {user.role === "user" && (
              <button className="bg-primary sm:word-break rounded-md px-4 py-2 text-sm text-white">
                Apply for Owner
              </button>
            )}
          </div>

          {/* Update Button */}
          <button
            onClick={handleUpdate}
            className="bg-primary hover:bg-primary-hover cursor-pointer rounded-md px-6 py-2 text-white transition duration-200"
          >
            Update Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
