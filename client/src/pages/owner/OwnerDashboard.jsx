import React from "react";
import { useGetOwnerDashboardQuery } from "../../features/owner/ownerApi";

export const OwnerDashboard = () => {
  const { data: res, isLoading, isError } = useGetOwnerDashboardQuery(); 
  const dashboard = res?.data;
  const overview = dashboard?.overview;

  if (isLoading) return <p className='text-center py-20 text-gray-400'>Loading dashboard...</p>
    if (isError || !dashboard) {
        return <p className='text-center py-20 text-red-500'>Failed to load dashboard</p>
    }
  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Owner Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-4">
        <div className="border-border rounded-lg border p-6">
          <p className="text-text-muted text-sm">Total Places</p>
          <h2 className="text-2xl font-semibold">{overview.totalPlaces}</h2>
              </div>
              
              <div className="border-border rounded-lg border p-6">
          <p className="text-text-muted text-sm">Total Reviews</p>
          <h2 className="text-2xl font-semibold">{overview.totalReviews}</h2>
              </div>
              
              <div className="border-border rounded-lg border p-6">
          <p className="text-text-muted text-sm">Average Rating</p>
          <h2 className="text-2xl font-semibold">{overview.averageRating.toFixed(1)}</h2>
              </div>
              
              <div className="border-border rounded-lg border p-6">
          <p className="text-text-muted text-sm">Views</p>
          <h2 className="text-2xl font-semibold">{overview.totalViews}</h2>
        </div>
      </div>
    </div>
  );
};
