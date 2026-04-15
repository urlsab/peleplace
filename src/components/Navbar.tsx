import { useState } from "react";
import { LogOut, User, Shield, Search, CalendarCheck, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user, isAdmin, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isApproved = profile?.registration_status === "approved";

  return (
    <nav className="fixed top-0 right-0 left-0 z-50 bg-cream/80 backdrop-blur-xl border-b border-border/40">
      <div className="container mx-auto flex items-center justify-between px-6 py-3.5">
        <button onClick={() => navigate("/")} className="group flex items-center gap-1.5">
          <span className="text-2xl font-black font-display tracking-tight">
            פל<span className="text-gradient-warm">״</span>א
          </span>
          <span className="hidden sm:block text-[11px] text-muted-foreground font-medium mt-0.5">פשוט לבחור איפה</span>
        </button>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          <a href="/#about" className="px-3 py-1.5 rounded-full text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all">
            הסיפור שלנו
          </a>
          <a href="/#faq" className="px-3 py-1.5 rounded-full text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all">
            שאלות ותשובות
          </a>
          <a href="/#contact" className="px-3 py-1.5 rounded-full text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all">
            כתבו לנו
          </a>
          {user && isApproved && (
            <button onClick={() => navigate("/explore")} className="px-3 py-1.5 rounded-full text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all flex items-center gap-1.5">
              <Search className="h-3.5 w-3.5" />
              חיפוש
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <span className="text-sm font-medium text-foreground hidden sm:block">
                שלום, {profile?.full_name || user.email?.split('@')[0] || 'אורח/ת'}
              </span>
              {isAdmin && (
                <Button size="sm" variant="outline" className="rounded-full gap-1.5 text-xs h-8 hidden md:flex" onClick={() => navigate("/admin")}>
                  <Shield className="h-3.5 w-3.5" /> ניהול
                </Button>
              )}
              {isApproved && (
                <Button size="sm" variant="outline" className="rounded-full gap-1.5 text-xs h-8 hidden md:flex" onClick={() => navigate("/my-bookings")}>
                  <CalendarCheck className="h-3.5 w-3.5" /> הזמנות
                </Button>
              )}
              <Button size="sm" variant="outline" className="rounded-full gap-1.5 text-xs h-8 hidden md:flex" onClick={() => navigate("/profile")}>
                <User className="h-3.5 w-3.5" /> פרופיל
              </Button>
              <Button size="sm" variant="ghost" className="rounded-full h-8 w-8 p-0 hidden md:flex" onClick={async () => { await signOut(); navigate("/"); }} title="התנתקות">
                <LogOut className="h-3.5 w-3.5" />
              </Button>
              {/* Mobile hamburger */}
              <Button size="sm" variant="ghost" className="rounded-full h-8 w-8 p-0 md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </Button>
            </>
          ) : (
            <Button size="sm" className="rounded-full font-semibold h-8 px-5 text-xs" onClick={() => navigate("/auth")}>
              הצטרפו עכשיו
            </Button>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && user && (
        <div className="md:hidden border-t border-border/40 bg-cream/95 backdrop-blur-xl px-6 py-4 space-y-2">
          <a href="/#about" className="block px-3 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted/60" onClick={() => setMobileMenuOpen(false)}>
            הסיפור שלנו
          </a>
          <a href="/#faq" className="block px-3 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted/60" onClick={() => setMobileMenuOpen(false)}>
            שאלות ותשובות
          </a>
          <a href="/#contact" className="block px-3 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted/60" onClick={() => setMobileMenuOpen(false)}>
            כתבו לנו
          </a>
          {isApproved && (
            <>
              <button onClick={() => { navigate("/explore"); setMobileMenuOpen(false); }} className="flex w-full items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted/60">
                <Search className="h-3.5 w-3.5" /> חיפוש
              </button>
              <button onClick={() => { navigate("/my-bookings"); setMobileMenuOpen(false); }} className="flex w-full items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted/60">
                <CalendarCheck className="h-3.5 w-3.5" /> הזמנות
              </button>
            </>
          )}
          {isAdmin && (
            <button onClick={() => { navigate("/admin"); setMobileMenuOpen(false); }} className="flex w-full items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted/60">
              <Shield className="h-3.5 w-3.5" /> ניהול
            </button>
          )}
          <button onClick={() => { navigate("/profile"); setMobileMenuOpen(false); }} className="flex w-full items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted/60">
            <User className="h-3.5 w-3.5" /> פרופיל
          </button>
          <div className="border-t border-border/40 pt-2 mt-2">
            <button
              onClick={async () => { await signOut(); navigate("/"); setMobileMenuOpen(false); }}
              className="flex w-full items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10"
            >
              <LogOut className="h-3.5 w-3.5" /> התנתקות
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
