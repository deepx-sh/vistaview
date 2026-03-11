import React from "react";

export const OwnerDashboard = () => {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Owner Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-4">
        <div className="border-border rounded-lg border p-6">
          <p className="text-text-muted text-sm">Total Places</p>
          <h2 className="text-2xl font-semibold">0</h2>
              </div>
              
              <div className="border-border rounded-lg border p-6">
          <p className="text-text-muted text-sm">Total Reviews</p>
          <h2 className="text-2xl font-semibold">0</h2>
              </div>
              
              <div className="border-border rounded-lg border p-6">
          <p className="text-text-muted text-sm">Average Rating</p>
          <h2 className="text-2xl font-semibold">0</h2>
              </div>
              
              <div className="border-border rounded-lg border p-6">
          <p className="text-text-muted text-sm">Views</p>
          <h2 className="text-2xl font-semibold">0</h2>
        </div>
      </div>
    </div>
  );
};
