import React from 'react'

const RatingBreakdown = ({ reviews }) => {
    const total = reviews.length;

    const ratingCounts = {
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1:0
    }

    reviews.forEach((r) => {
        ratingCounts[r.rating] += 1;
    })

    const average = total === 0 ? 0 : (reviews.reduce((acc, r) => acc + r.rating, 0) / total).toFixed(1);
  return (
      <div className='border border-border rounded-lg p-6 bg-surface'>
          <h3 className='font-semibold mb-4'>
              Rating Summary
          </h3>

          {/* Average */}
          <div className='flex items-center gap-4 mb-6'>
              <div className='text-4xl font-semibold'>{average}</div>

              <div className='text-sm text-text-muted'>{total} reviews</div>
          </div>

          {/* Bars */}

          <div className='space-y-3'>
              {[5, 4, 3, 2, 1].map((star) => {
                  const count = ratingCounts[star];
                  const percent = total == 0 ? 0 : (count / total) * 100;

                  return (
                      <div key={star} className='flex items-center gap-3'>
                          <span className='text-sm w-6'>
                              {star}★
                          </span>

                          <div className='flex-1 bg-border rounded-full h-2'>
                              <div className='bg-warning h-2 rounded-full' style={{ width: `${percent}%` }}></div>
                              
                          </div>
                          <span className='text-xs text-text-muted w-8'>{count}</span>
                      </div>
                  )
              })}
          </div>
    </div>
  )
}

export default RatingBreakdown