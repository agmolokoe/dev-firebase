
import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardHeaderProps {
  businessName: string;
  isLoading: boolean;
}

export function DashboardHeader({ businessName, isLoading }: DashboardHeaderProps) {
  return (
    <div className="flex flex-col gap-4">
      {isLoading ? (
        <>
          <Skeleton className="h-10 w-1/3 bg-gray-800" />
          <Skeleton className="h-4 w-2/3 bg-gray-800" />
        </>
      ) : (
        <>
          <h1 className="text-3xl font-bold tracking-tight text-white">{businessName} Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to your shop dashboard. Here's an overview of your business.
          </p>
        </>
      )}
    </div>
  );
}
