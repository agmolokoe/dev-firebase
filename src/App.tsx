import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Index from "./pages/Index";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import NavBar from './components/NavBar';

const Home = lazy(() => import('./components/Home'));
const Dashboard = lazy(() => import('./components/Dashboard'));
const Settings = lazy(() => import('./components/Settings'));
const Profile = lazy(() => import('./components/Profile'));

const App = () => {
    return (
        <Router>
            <NavBar />
            <Suspense fallback={<div>Loading...</div>}>
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route path="/dashboard" component={Dashboard} />
                    <Route path="/settings" component={Settings} />
                    <Route path="/profile" component={Profile} />
                </Switch>
            </Suspense>
        </Router>
    );
};

export default App;
const queryClient = new QueryClient();

const App = () => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return null; // Or a loading spinner
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes - accessible when not logged in */}
            <Route
              path="/"
              element={
                !session ? (
                  <LandingPage />
                ) : (
                  <Navigate to="/dashboard" replace />
                )
              }
            />
            <Route
              path="/auth"
              element={
                !session ? (
                  <AuthPage mode="login" />
                ) : (
                  <Navigate to="/dashboard" replace />
                )
              }
            />

            {/* Protected dashboard routes - require authentication */}
            <Route
              path="/dashboard/*"
              element={
                session ? <Index /> : <Navigate to="/auth" replace />
              }
            />

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;