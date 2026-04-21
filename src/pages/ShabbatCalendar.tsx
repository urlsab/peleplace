import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { CalendarRange, MapPin, Users, Briefcase, HandHeart, Home, Sparkles, CalendarDays, ChevronRight, ChevronLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const categoryConfig: Record<string, { label: string; icon: any; color: string }> = {
  family: { label: "אירוח משפחתי", icon: Home, color: "bg-[hsl(var(--terracotta))]" },
  work: { label: "עבודה", icon: Briefcase, color: "bg-primary" },
  volunteer: { label: "התנדבות", icon: HandHeart, color: "bg-secondary" },
  singles_group: { label: "חבורת רווקים/ות", icon: Sparkles, color: "bg-[hsl(var(--olive))]" },
  organized_shabbat: { label: "שבת מאורגנת", icon: CalendarDays, color: "bg-[hsl(var(--amber-soft))]" },
};

const regionLabels: Record<string, string> = {
  north: "צפון", haifa: "חיפה", sharon: "שרון", center: "מרכז",
  tel_aviv: "תל אביב", jerusalem: "ירושלים", shfela: "שפלה",
  south: "דרום", judea_samaria: "יהודה ושומרון",
};

type DateOpportunity = {
  date: string;
  type: keyof typeof categoryConfig;
  title: string;
  region: string | null;
  city: string | null;
  userId: string;
};

const HEBREW_MONTHS = ["ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני", "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"];
const HEBREW_DAYS = ["א'", "ב'", "ג'", "ד'", "ה'", "ו'", "ש'"];

const ShabbatCalendar = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const isApproved = profile?.registration_status === "approved";
  const today = new Date();
  const [viewMonth, setViewMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const { data: opportunities = [], isLoading } = useQuery({
    queryKey: ["calendar-opportunities"],
    queryFn: async () => {
      const tables = [
        { name: "host_family_profiles" as const, type: "family" as const, titleField: "city" },
        { name: "host_work_profiles" as const, type: "work" as const, titleField: "place_name" },
        { name: "host_singles_group_profiles" as const, type: "singles_group" as const, titleField: "group_name" },
        { name: "host_organized_shabbat_profiles" as const, type: "organized_shabbat" as const, titleField: "organization_name" },
      ];

      const all: DateOpportunity[] = [];
      for (const t of tables) {
        const { data } = await supabase.from(t.name).select("*");
        (data || []).forEach((row: any) => {
          (row.available_dates || []).forEach((date: string) => {
            all.push({
              date,
              type: t.type,
              title: row[t.titleField] || categoryConfig[t.type].label,
              region: row.region,
              city: row.city,
              userId: row.user_id,
            });
          });
        });
      }
      return all;
    },
    enabled: isApproved,
  });

  const dateMap = useMemo(() => {
    const m = new Map<string, DateOpportunity[]>();
    opportunities.forEach((o) => {
      if (!m.has(o.date)) m.set(o.date, []);
      m.get(o.date)!.push(o);
    });
    return m;
  }, [opportunities]);

  // Build calendar grid
  const calendarCells = useMemo(() => {
    const year = viewMonth.getFullYear();
    const month = viewMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells: ({ date: string; day: number; isShabbat: boolean } | null)[] = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      const dateObj = new Date(year, month, d);
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      cells.push({ date: dateStr, day: d, isShabbat: dateObj.getDay() === 6 });
    }
    return cells;
  }, [viewMonth]);

  const selectedOpps = selectedDate ? dateMap.get(selectedDate) || [] : [];

  if (!isApproved) {
    return (
      <div className="min-h-screen bg-cream">
        <Navbar />
        <div className="container mx-auto px-6 pt-32 text-center">
          <CalendarRange className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-black font-display mb-2">לוח השבתות פתוח למשתמשים מאושרים</h1>
          <p className="text-muted-foreground mb-6">השלימו את ההרשמה כדי לראות שבתות פנויות</p>
          <Button onClick={() => navigate("/profile")} className="rounded-full">חזרה לפרופיל</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <div className="container mx-auto px-4 sm:px-6 pt-24 pb-12 max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-black font-display flex items-center gap-2">
            <CalendarRange className="h-8 w-8 text-primary" />
            לוח שבתות
          </h1>
          <p className="text-muted-foreground mt-1">תאריכים שבהם מארחים שיבצו שבתות פנויות</p>
        </motion.div>

        <div className="grid lg:grid-cols-[1fr,360px] gap-6">
          {/* Calendar */}
          <div className="rounded-3xl border border-border bg-card p-4 sm:p-6 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <Button variant="ghost" size="sm" className="rounded-full h-9 w-9 p-0" onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1))}>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <h2 className="font-display font-bold text-lg">
                {HEBREW_MONTHS[viewMonth.getMonth()]} {viewMonth.getFullYear()}
              </h2>
              <Button variant="ghost" size="sm" className="rounded-full h-9 w-9 p-0" onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1))}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
              {HEBREW_DAYS.map((d) => (
                <div key={d} className="text-center text-xs font-bold text-muted-foreground py-2">{d}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {calendarCells.map((cell, i) => {
                if (!cell) return <div key={i} />;
                const opps = dateMap.get(cell.date) || [];
                const hasOpps = opps.length > 0;
                const isSelected = selectedDate === cell.date;
                const isToday = cell.date === `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
                return (
                  <button
                    key={i}
                    onClick={() => hasOpps && setSelectedDate(cell.date)}
                    disabled={!hasOpps}
                    className={`
                      aspect-square rounded-xl text-sm font-medium relative transition-all
                      ${isSelected ? "bg-primary text-cream shadow-md" : ""}
                      ${!isSelected && hasOpps ? "bg-[hsl(var(--amber-soft))]/30 hover:bg-[hsl(var(--amber-soft))]/60 cursor-pointer" : ""}
                      ${!isSelected && !hasOpps && cell.isShabbat ? "bg-muted/40 text-muted-foreground" : ""}
                      ${!isSelected && !hasOpps && !cell.isShabbat ? "text-muted-foreground/60" : ""}
                      ${isToday && !isSelected ? "ring-2 ring-primary/40" : ""}
                    `}
                  >
                    {cell.day}
                    {hasOpps && (
                      <span className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-1.5 w-1.5 rounded-full ${isSelected ? "bg-cream" : "bg-primary"}`} />
                    )}
                    {hasOpps && opps.length > 1 && (
                      <span className={`absolute top-1 left-1 text-[9px] font-bold ${isSelected ? "text-cream" : "text-primary"}`}>
                        {opps.length}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 pt-4 border-t border-border flex flex-wrap gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-primary" /> תאריך פנוי
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded bg-muted/40" /> שבת
              </div>
            </div>
          </div>

          {/* Selected date details */}
          <div className="rounded-3xl border border-border bg-card p-4 sm:p-6 shadow-card">
            {selectedDate ? (
              <>
                <h3 className="font-display font-bold text-lg mb-1">
                  {new Date(selectedDate + "T00:00:00").toLocaleDateString("he-IL", { weekday: "long", day: "numeric", month: "long" })}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">{selectedOpps.length} אפשרויות זמינות</p>
                <div className="space-y-2">
                  {selectedOpps.map((opp, i) => {
                    const cfg = categoryConfig[opp.type];
                    const Icon = cfg.icon;
                    return (
                      <button
                        key={i}
                        onClick={() => navigate("/explore")}
                        className="w-full text-right rounded-2xl border border-border p-3 hover:bg-muted/30 transition-all group"
                      >
                        <div className="flex items-start gap-3">
                          <div className={`${cfg.color} h-9 w-9 rounded-xl flex items-center justify-center text-cream flex-shrink-0`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-sm truncate">{opp.title}</p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                              <MapPin className="h-3 w-3" />
                              {[opp.city, opp.region ? regionLabels[opp.region] : null].filter(Boolean).join(", ") || "מיקום לא צוין"}
                            </p>
                            <Badge variant="secondary" className="mt-1.5 text-[10px]">{cfg.label}</Badge>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
                <Button onClick={() => navigate("/explore")} className="w-full mt-4 rounded-full" size="sm">
                  צפו בכל ההזדמנויות בחיפוש
                </Button>
              </>
            ) : (
              <div className="text-center py-8">
                <CalendarDays className="h-12 w-12 mx-auto text-muted-foreground/40 mb-3" />
                <p className="font-medium text-sm">בחרו תאריך מהלוח</p>
                <p className="text-xs text-muted-foreground mt-1">תאריכים מודגשים הם שבתות שבהן מארחים שיבצו זמינות</p>
                {isLoading && <p className="text-xs text-muted-foreground mt-3">טוען נתונים...</p>}
                {!isLoading && opportunities.length === 0 && (
                  <p className="text-xs text-muted-foreground mt-3">אין כרגע תאריכים זמינים</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShabbatCalendar;
