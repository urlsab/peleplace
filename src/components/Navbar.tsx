import { LogOut, User, Shield, Search, CalendarCheck, Menu, FileText, Mail, CalendarRange, ChevronDown, Settings as SettingsIcon, CalendarPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import logoPele from "@/assets/logo-pela-v6.png";
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
      <div className="container mx-auto flex items-center justify-between px-6 py-3.5">
        <button onClick={() => navigate("/")} className="group flex items-center gap-2 min-w-0">
          <img
            src={logoPele}
            alt="פל״א"
            width={48}
            height={48}
            className="h-10 w-10 shrink-0 object-contain transition-transform group-hover:scale-105 rounded-full"
          />
          <span className="text-[11px] text-muted-foreground font-medium mt-0.5 truncate">— פשוט לבחור איפה</span>
        </button>

        {/* Desktop quick links */}
        <div className="hidden md:flex items-center gap-1">
          <button onClick={() => goToSection("#about")} className="px-3 py-1.5 rounded-full text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all">
            הסיפור שלנו
          </button>
          <button onClick={() => goToSection("#faq")} className="px-3 py-1.5 rounded-full text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all">
            שאלות ותשובות
          </button>
          {user && isApproved && (
            <button onClick={() => navigate("/explore")} className="px-3 py-1.5 rounded-full text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all flex items-center gap-1.5">
              <Search className="h-3.5 w-3.5" />
              חיפוש
            </button>
          )}
          {user && isApproved && (
            <button onClick={() => navigate("/calendar")} className="px-3 py-1.5 rounded-full text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all flex items-center gap-1.5">
              <CalendarRange className="h-3.5 w-3.5" />
              לוח שבתות
            </button>
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
              <span className="hidden xs:inline sm:inline">הוסיפו שבת</span>
              <span className="xs:hidden sm:hidden">שבת</span>
            </Button>
          )}
          {user ? (
            <DropdownMenu>
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
                      <CalendarRange className="h-4 w-4" /> לוח שבתות
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/explore")} className="rounded-xl gap-2 cursor-pointer md:hidden">
                      <Search className="h-4 w-4" /> חיפוש
                    </DropdownMenuItem>
                  </>
                )}

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={() => navigate("/terms")} className="rounded-xl gap-2 cursor-pointer">
                  <FileText className="h-4 w-4" /> תקנון
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => goToSection("#contact")} className="rounded-xl gap-2 cursor-pointer">
                  <Mail className="h-4 w-4" /> צור קשר
                </DropdownMenuItem>
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
              {/* Mobile menu for guests */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" variant="ghost" className="rounded-full h-8 w-8 p-0 md:hidden">
                    <Menu className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 rounded-2xl p-2">
                  <DropdownMenuItem onClick={() => goToSection("#about")} className="rounded-xl cursor-pointer">הסיפור שלנו</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => goToSection("#faq")} className="rounded-xl cursor-pointer">שאלות ותשובות</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => goToSection("#contact")} className="rounded-xl cursor-pointer">צור קשר</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/terms")} className="rounded-xl cursor-pointer">תקנון</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button size="sm" className="rounded-full font-semibold h-8 px-5 text-xs" onClick={() => navigate("/auth")}>
                הצטרפו / התחברו
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
