import SectionTitle from "../../components/admin/SectionTitle";
import { useGetAdminDashboardQuery } from "../../features/admin/adminApi";
import StatsCards from "../../components/admin/StatsCards";
import React from 'react'

const AdminDashboard = () => {
    const { data: res, isLoading, isError } = useGetAdminDashboardQuery();
    const d = res?.data;

    if (isLoading) return <p className="text-gray-400 py-20 text-center">Loading...</p>
    if(isError || !d) return <p className="text-red-500 py-20 text-center">Failed to load dashboard</p>
  return (
      <div className="max-w-5xl mx-auto space-y-2">
          <h1 className="text-2xl font-semibold">Admin Dashboard</h1>

          <SectionTitle>Users</SectionTitle>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <StatsCards label="Total Users" value={d.users.totalUsers}/>
              <StatsCards label="Total Owners" value={d.users.totalOwners}/>
              <StatsCards label="Verified Owners" value={d.users.verifiedOwners} color="text-green-600"/>
              <StatsCards label="Blocked Users" value={d.users.blockedUsers} color="text-red-500"/>
          </div>

          <SectionTitle>Places</SectionTitle>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <StatsCards label="Total Places" value={d.places.totalPlaces}/>
              <StatsCards label="Approved" value={d.places.approvedPlaces} color="text-green-600"/>
              <StatsCards label="Pending" value={d.places.pendingPlaces} color="text-amber-500"/>
          </div>

          <SectionTitle>Reviews</SectionTitle>
          <div className="grid grid-cols-2 gap-3">
              <StatsCards label="Total Reviews" value={d.reviews.totalReviews}/>
              <StatsCards label="Flagged Reviews" value={d.reviews.flaggedReviews} color="text-red-500"/>
          </div>

          <SectionTitle>Reports</SectionTitle>
          <div className="grid grid-cols-2 gap-3">
              <StatsCards label="Total Reports" value={d.reports.totalReports}/>
              <StatsCards label="Pending Reports" value={d.reports.pendingReports} color="text-amber-500"/>
          </div>
    </div>
  )
}

export default AdminDashboard