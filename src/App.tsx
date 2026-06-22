import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Index from "./pages/Index.tsx";
import Auth from "./pages/Auth.tsx";
// test github and vercel connection
// Register page removed — registration is now part of Auth.tsx
import Profile from "./pages/Profile.tsx";
import Admin from "./pages/Admin.tsx";
import MyBookings from "./pages/MyBookings.tsx";
import ShabbatCalendar from "./pages/ShabbatCalendar.tsx";
import CalendarDate from "./pages/CalendarDate.tsx";
import NotFound from "./pages/NotFound.tsx";
import Unsubscribe from "./pages/Unsubscribe.tsx";
import Terms from "./pages/Terms.tsx";
import Settings from "./pages/Settings.tsx";
import DemoProfile from "./pages/DemoProfile.tsx";
import Accessibility from "./pages/Accessibility.tsx";
import Feedback from "./pages/Feedback.tsx";
import GoogleNotRegistered from "./pages/GoogleNotRegistered.tsx";
import PendingEmailConfirmation from "./pages/PendingEmailConfirmation.tsx";
import AuthConfirmed from "./pages/AuthConfirmed.tsx";

// Clears React Query cache when the logged-in user changes (e.g. logout → login as someone else)
const AuthCacheSync = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const prevUserIdRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    const prevId = prevUserIdRef.current;
    const nextId = user?.id;
    if (prevId !== undefined && prevId !== nextId) {
      queryClient.clear();
    }
    prevUserIdRef.current = nextId;
  }, [user?.id, queryClient]);

  return null;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AuthCacheSync />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/register" element={<Auth />} />
            <Route path="/auth/not-registered" element={<GoogleNotRegistered />} />
            <Route path="/auth/pending-confirmation" element={<PendingEmailConfirmation />} />
            <Route path="/auth/confirmed" element={<AuthConfirmed />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/calendar" element={<ShabbatCalendar />} />
            <Route path="/calendar/:date" element={<CalendarDate />} />
            <Route path="/unsubscribe" element={<Unsubscribe />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/demo/profile" element={<DemoProfile />} />
            <Route path="/accessibility" element={<Accessibility />} />
            <Route path="/feedback/:bookingId" element={<Feedback />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
