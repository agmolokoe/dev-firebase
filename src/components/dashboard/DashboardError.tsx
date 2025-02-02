import React from 'react';
import { Alert, AlertCircle, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function DashboardError() {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        There was a problem loading your dashboard data. Please try refreshing the page.
      </AlertDescription>
    </Alert>
  );
}