import React from 'react'
import { useGetOwnerDashboardQuery } from '../../features/owner/ownerApi'
import { useRef } from 'react'
import StarRatings from '../../components/owner/dashboard/StarRatings'
import MetricCard from '../../components/owner/dashboard/MetricCard'
import StatusBadge from '../../components/owner/dashboard/StatusBadge'
import useBarChart from '../../hooks/useBarChart'


const OwnerAnalytics = () => {
    const { data: res, isLoading, isError } = useGetOwnerDashboardQuery();
    const viewsRef = useRef(null);
    const ratingRef = useRef(null);

    const dashboard = res?.data;
    const overview = dashboard?.overview;
    const places = dashboard?.places ?? [];

    // View Bar Chart

    const placeLabels = places.map((p) =>
        p.name.length>14 ? p.name.slice(0,13)+"…":p.name
    )

    const viewColors = ["#1D9E75", "#378ADD", "#BA7517", "#D4537E", "#7F77DD"];
    useBarChart(viewsRef, placeLabels, places.map((p) => p.views), viewColors);

    // Ratings distribution chart
    const ratingBuckets = [0, 0, 0, 0, 0];
    places.forEach((p) => {
        const idx = Math.round(Math.min(5, Math.max(1, p.averageRating))) - 1;
        ratingBuckets[idx] += p.totalReviews;
    })

    const ratingColors = ["#F09595", "#FAC775", "#97C459", "#5DCAA5", "#1D9E75"];

    useBarChart(ratingRef, ["1 star", "2 stars", "3 stars", "4 stars", "5 stars"], ratingBuckets, ratingColors)
    
    if (isLoading) return <p className='text-center py-20 text-gray-400'>Loading dashboard...</p>
    if (isError || !dashboard) {
        return <p className='text-center py-20 text-red-500'>Failed to load dashboard</p>
    }
  return (
      <div className='max-w-4xl mx-auto space-y-6'>
          <h1 className='text-2xl font-semibold'>Analytics</h1>

          {/* Overview metrics */}
          <div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
              <MetricCard label="Total places" value={overview.totalPlaces}/>
              <MetricCard label="Total views" value={overview.totalViews.toLocaleString()}/>
              <MetricCard label="Total reviews" value={overview.totalReviews}/>
              <MetricCard label="Avg rating" value={overview.averageRating.toFixed(1)} sub={`out of 5`}/>
          </div>

          {/* Charts */}
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <div className='border rounded-lg p-4 bg-white'>
                  <p className='text-xs font-medium text-gray-500 uppercase tracking-wide mb-3'>
                      Views by place
                  </p>
                  <div className='relative h-52'>
                      <canvas ref={viewsRef}></canvas>
                  </div>
              </div>

              <div className='border rounded-lg p-4 bg-white'>
                  <p className='text-xs font-medium text-gray-500 uppercase tracking-wide mb-3'>
                      Ratings distribution
                  </p>
                  <div className='relative h-52'>
                      <canvas ref={ratingRef}></canvas>
                  </div>
              </div>
          </div>

          {/* Per place table */}
          <div className='border rounded-lg bg-white overflow-hidden'>
              <div className='px-4 pt-4 pb-2'>
                  <p className='text-xs font-medium text-gray-500 uppercase tracking-wide'>
                      Place breakdown
                  </p>
              </div>

              <table className='w-full text-sm'>
                  <thead>
                      <tr className='border-t border-b'>
                          <th className='text-left px-4 py-2 font-medium text-gray-500 text-xs'>Name</th>
                          <th className='text-right px-4 py-2 font-medium text-gray-500 text-xs'>Status</th>
                          <th className='text-right px-4 py-2 font-medium text-gray-500 text-xs'>Views</th>
                          <th className='text-right px-4 py-2 font-medium text-gray-500 text-xs'>Reviews</th>
                          <th className='text-right px-4 py-2 font-medium text-gray-500 text-xs'>Avg rating</th>
                      </tr>
                  </thead>

                  <tbody>
                      {places.map((p) =>(
                          <tr key={p.place} className='border-b last:border-none hover:bg-gray-50 transition'>
                              <td className='px-4 py-3 text-gray-800'>{p.name}</td>
                              <td className='px-4 py-3 text-right'><StatusBadge status={p.status} /></td>
                              <td className='px-4 py-3 text-right text-gray-500'>{p.views.toLocaleString()}</td>
                              <td className='px-4 py-3 text-right text-gray-500'>{p.totalReviews}</td>
                              <td className='px-4 py-3'>
                                  <div className='flex items-center gap-1.5 justify-end'>
                                      <StarRatings rating={p.averageRating} />
                                      <span className='text-gray-500'>{p.averageRating.toFixed(1)}</span>
                                  </div>
                              </td> 
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
    </div>
  )
}

export default OwnerAnalytics