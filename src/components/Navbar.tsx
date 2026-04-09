import { LogOut, User, Shield, Search, CalendarCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 right-0 left-0 z-50 bg-cream/80 backdrop-blur-xl border-b border-border/40">
      <div className="container mx-auto flex items-center justify-between px-6 py-3.5">
        <button onClick={() => navigate("/")} className="group flex items-center gap-1.5">
          <span className="text-2xl font-black font-display tracking-tight">
            פל<span className="text-gradient-warm">״</span>א
          </span>
          <span className="hidden sm:block text-[11px] text-muted-foreground font-medium mt-0.5">פשוט לבחור איפה</span>
        </button>
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
          <button onClick={() => navigate("/explore")} className="px-3 py-1.5 rounded-full text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all flex items-center gap-1.5">
            <Search className="h-3.5 w-3.5" />
            חיפוש
          </button>
        </div>
        <div className="flex items-center gap-2">
          {user ? (
            <>
              {isAdmin && (
                <Button size="sm" variant="outline" className="rounded-full gap-1.5 text-xs h-8" onClick={() => navigate("/admin")}>
                  <Shield className="h-3.5 w-3.5" /> ניהול
                </Button>
              )}
              <Button size="sm" variant="outline" className="rounded-full gap-1.5 text-xs h-8" onClick={() => navigate("/my-bookings")}>
                <CalendarCheck className="h-3.5 w-3.5" /> הזמנות
              </Button>
              <Button size="sm" variant="outline" className="rounded-full gap-1.5 text-xs h-8" onClick={() => navigate("/profile")}>
                <User className="h-3.5 w-3.5" /> פרופיל
              </Button>
              <Button size="sm" variant="ghost" className="rounded-full h-8 w-8 p-0" onClick={signOut}>
                <LogOut className="h-3.5 w-3.5" />
              </Button>
            </>
          ) : (
            <Button size="sm" className="rounded-full font-semibold h-8 px-5 text-xs" onClick={() => navigate("/auth")}>
              הצטרפו עכשיו
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;