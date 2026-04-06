import { Heart, LogOut, User, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user, isAdmin, profile, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 right-0 left-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto flex items-center justify-between px-6 py-3">
        <button onClick={() => navigate("/")} className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
            <Heart className="h-5 w-5 text-primary-foreground" fill="hsl(var(--primary-foreground))" />
          </div>
          <span className="text-xl font-black font-display">פל״א</span>
        </button>
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <a href="/#categories" className="hover:text-foreground transition-colors">קטגוריות</a>
          <a href="/#opportunities" className="hover:text-foreground transition-colors">הזדמנויות</a>
          <button onClick={() => navigate("/explore")} className="hover:text-foreground transition-colors">חיפוש</button>
        </div>
        <div className="flex items-center gap-2">
          {user ? (
            <>
              {isAdmin && (
                <Button size="sm" variant="outline" className="rounded-full gap-1" onClick={() => navigate("/admin")}>
                  <Shield className="h-4 w-4" /> ניהול
                </Button>
              )}
              <Button size="sm" variant="outline" className="rounded-full gap-1" onClick={() => navigate("/profile")}>
                <User className="h-4 w-4" /> פרופיל
              </Button>
              <Button size="sm" variant="ghost" className="rounded-full gap-1" onClick={signOut}>
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <Button size="sm" className="rounded-full font-semibold" onClick={() => navigate("/auth")}>
              הרשמה / התחברות
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
