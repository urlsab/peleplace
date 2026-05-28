import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index.tsx";
import Auth from "./pages/Auth.tsx";
// test github and vercel connection
// Register page removed — registration is now part of Auth.tsx
import Profile from "./pages/Profile.tsx";
import Admin from "./pages/Admin.tsx";
import Explore from "./pages/Explore.tsx";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/register" element={<Auth />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/explore" element={<Explore />} />
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
