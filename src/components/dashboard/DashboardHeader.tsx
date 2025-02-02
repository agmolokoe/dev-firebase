import React from 'react';

export function DashboardHeader() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard Overview</h1>
      <p className="text-muted-foreground">
        Welcome to your shop dashboard. Here's an overview of your business.
      </p>
    </div>
  );
}