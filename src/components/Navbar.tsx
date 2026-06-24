import { LogOut, User, Shield, Search, CalendarCheck, Menu, FileText, Mail, Settings as SettingsIcon, CalendarPlus, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import logoPele from "@/assets/pele_heart_pele-removebg-preview.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const { user, isAdmin, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isHomePage = location.pathname === "/";
  const isAuthPage = location.pathname === "/auth";
  const isApproved = profile?.registration_status === "approved";
  const displayName = profile?.full_name?.split(" ")[0] || user?.email?.split("@")[0] || "אורח/ת";

  const goToSection = (hash: string) => {
    if (window.location.pathname === "/") {
      const el = document.querySelector(hash);
      el?.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = `/${hash}`;
    }
  };

  return (
    <nav className="fixed top-0 right-0 left-0 z-50 bg-cream/80 backdrop-blur-xl border-b border-border/40">
      {isAuthPage ? (
        <div className="container mx-auto flex items-center justify-center px-6 py-3.5">
          <button onClick={() => navigate("/")} className="group flex items-center gap-2">
            <img
              src={logoPele}
              alt="פל״א"
              width={48}
              height={48}
              className="h-10 w-10 shrink-0 object-contain transition-transform group-hover:scale-105 rounded-full"
            />
          </button>
        </div>
      ) : (
      <div className="container mx-auto flex items-center justify-between px-6 py-3.5">
        <button onClick={() => navigate("/")} className="group flex items-center gap-2 min-w-0">
          <img
            src={logoPele}
            alt="פל״א"
            width={48}
            height={48}
            className="h-10 w-10 shrink-0 object-contain transition-transform group-hover:scale-105 rounded-full"
          />

        </button>

        {/* Desktop quick links */}
        <div className="hidden lg:flex items-center gap-1">
          {isHomePage ? (
            /* Full links — home page only */
            <>
              <button onClick={() => goToSection("#hero")} className="px-3 py-1.5 rounded-full text-sm font-bold text-foreground hover:bg-muted/60 transition-all">
                בית
              </button>
              <button onClick={() => goToSection("#about")} className="px-3 py-1.5 rounded-full text-sm font-bold text-foreground hover:bg-muted/60 transition-all">
                הסיפור שלנו
              </button>
              <button onClick={() => goToSection("#faq")} className="px-3 py-1.5 rounded-full text-sm font-bold text-foreground hover:bg-muted/60 transition-all">
                שאלות ותשובות
              </button>
              <button onClick={() => goToSection("#contact")} className="px-3 py-1.5 rounded-full text-sm font-bold text-foreground hover:bg-muted/60 transition-all">
                צור קשר
              </button>
              {user && (
                <button onClick={() => navigate("/calendar")} className="px-3 py-1.5 rounded-full text-sm font-bold text-foreground hover:bg-muted/60 transition-all">
                  לוח שבתות
                </button>
              )}
              <button onClick={() => navigate("/terms")} className="px-3 py-1.5 rounded-full text-sm font-bold text-foreground hover:bg-muted/60 transition-all">
                תקנון
              </button>
            </>
          ) : (
            /* Slim links — all other pages */
            <>
              <button onClick={() => navigate("/")} className="px-3 py-1.5 rounded-full text-sm font-bold text-foreground hover:bg-muted/60 transition-all">
                בית
              </button>
              {user && (
                <button onClick={() => navigate("/calendar")} className="px-3 py-1.5 rounded-full text-sm font-bold text-foreground hover:bg-muted/60 transition-all">
                  לוח שבתות
                </button>
              )}
              <button onClick={() => navigate("/terms")} className="px-3 py-1.5 rounded-full text-sm font-bold text-foreground hover:bg-muted/60 transition-all">
                תקנון
              </button>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          {user && isApproved && profile?.user_type === "host" && (
            <Button
              size="sm"
              onClick={() => navigate("/profile#dates")}
              className="rounded-full gap-1.5 h-9 px-3 sm:px-4 text-xs sm:text-sm font-bold shadow-md shadow-primary/20"
            >
              <CalendarPlus className="h-4 w-4" />
              <span className="hidden sm:inline">הוסיפו שבת</span>
              <span className="sm:hidden">שבת</span>
            </Button>
          )}
          {user ? (
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="outline" className="rounded-full gap-2 h-9 pl-2 pr-3" aria-label="פתח תפריט">
                  <Menu className="h-4 w-4" />
                  <div className="h-6 w-6 rounded-full bg-gradient-to-br from-primary to-[hsl(var(--terracotta))] flex items-center justify-center text-cream text-xs font-bold">
                    {displayName.charAt(0)}
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2">
                <DropdownMenuLabel className="font-display text-base">שלום, {displayName} 👋</DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={() => navigate("/profile")} className="rounded-xl gap-2 cursor-pointer">
                  <User className="h-4 w-4" /> הפרופיל שלי
                </DropdownMenuItem>

                {isApproved && profile?.user_type === "host" && (
                  <DropdownMenuItem
                    onClick={() => navigate("/profile#dates")}
                    className="rounded-xl gap-2 cursor-pointer bg-primary/10 text-primary focus:bg-primary/20 focus:text-primary"
                  >
                    <CalendarPlus className="h-4 w-4" /> הוסיפו שבת לאירוח
                  </DropdownMenuItem>
                )}

                {isApproved && (
                  <>
                    <DropdownMenuItem onClick={() => navigate("/my-bookings")} className="rounded-xl gap-2 cursor-pointer">
                      <CalendarCheck className="h-4 w-4" /> שבתות שהשתתפתי
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/calendar")} className="rounded-xl gap-2 cursor-pointer">
                      לוח שבתות
                    </DropdownMenuItem>
                  </>
                )}

                <DropdownMenuSeparator />

                
                
                <DropdownMenuItem onClick={() => navigate("/settings")} className="rounded-xl gap-2 cursor-pointer">
                  <SettingsIcon className="h-4 w-4" /> הגדרות
                </DropdownMenuItem>

                {isAdmin && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate("/admin")} className="rounded-xl gap-2 cursor-pointer">
                      <Shield className="h-4 w-4" /> ניהול
                    </DropdownMenuItem>
                  </>
                )}

                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={async () => { await signOut(); navigate("/"); }}
                  className="rounded-xl gap-2 cursor-pointer text-destructive focus:text-destructive"
                >
                  <LogOut className="h-4 w-4" /> התנתקות
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              {/* Mobile menu for guests — full links on home page only */}
              {isHomePage && (
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="ghost" className="rounded-full h-8 w-8 p-0 lg:hidden">
                      <Menu className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 rounded-2xl p-2">
                      <DropdownMenuItem onClick={() => goToSection("#hero")} className="rounded-xl cursor-pointer font-bold text-foreground">בית</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => goToSection("#about")} className="rounded-xl cursor-pointer font-bold text-foreground">הסיפור שלנו</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => goToSection("#faq")} className="rounded-xl cursor-pointer font-bold text-foreground">שאלות ותשובות</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => goToSection("#contact")} className="rounded-xl cursor-pointer font-bold text-foreground">צור קשר</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate("/calendar")} className="rounded-xl cursor-pointer font-bold text-foreground">לוח שבתות</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate("/terms")} className="rounded-xl cursor-pointer font-bold text-foreground">תקנון</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              <Button size="sm" className="rounded-full font-semibold h-8 px-5 text-xs" onClick={() => navigate("/auth")}>
                הצטרפו / התחברו
              </Button>
            </>
          )}
        </div>
      </div>
      )}
    </nav>
  );
};

export default Navbar;
