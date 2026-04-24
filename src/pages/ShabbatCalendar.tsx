import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { CalendarRange, ChevronRight, ChevronLeft, Flame, Sparkles as SparklesIcon } from "lucide-react";
import { HDate, HebrewCalendar, Location, Event, flags } from "@hebcal/core";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import DynamicBackground from "@/components/DynamicBackground";

const HEBREW_MONTHS = ["ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני", "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"];
const HEBREW_DAYS = ["א'", "ב'", "ג'", "ד'", "ה'", "ו'", "ש'"];
const HEBREW_NUMERALS = ["", "א'", "ב'", "ג'", "ד'", "ה'", "ו'", "ז'", "ח'", "ט'", "י'", "י\"א", "י\"ב", "י\"ג", "י\"ד", "ט\"ו", "ט\"ז", "י\"ז", "י\"ח", "י\"ט", "כ'", "כ\"א", "כ\"ב", "כ\"ג", "כ\"ד", "כ\"ה", "כ\"ו", "כ\"ז", "כ\"ח", "כ\"ט", "ל'"];

const formatDateKey = (year: number, month: number, day: number) =>
  `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

type CellInfo = {
  date: string;
  day: number;
  hebrewDay: string;
  isShabbat: boolean;
  holidays: string[]; // names
  isYomTov: boolean;
  isCandleLighting: boolean;
};

const ShabbatCalendar = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const isApproved = profile?.registration_status === "approved";
  const today = new Date();
  const [viewMonth, setViewMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const { data: opportunities = [] } = useQuery({
    queryKey: ["calendar-opportunity-dates"],
    queryFn: async () => {
      const tables = ["host_family_profiles", "host_work_profiles", "host_singles_group_profiles", "host_organized_shabbat_profiles"] as const;
      const all: string[] = [];
      for (const t of tables) {
        const { data } = await supabase.from(t).select("available_dates");
        (data || []).forEach((row: any) => {
          (row.available_dates || []).forEach((d: string) => all.push(d));
        });
      }
      return all;
    },
    enabled: isApproved,
  });

  const opportunityDateSet = useMemo(() => new Set(opportunities), [opportunities]);

  // Build calendar cells with Hebrew dates and holidays for the visible month
  const calendarCells = useMemo(() => {
    const year = viewMonth.getFullYear();
    const month = viewMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Fetch all holidays for this month from hebcal
    const events = HebrewCalendar.calendar({
      start: new Date(year, month, 1),
      end: new Date(year, month, daysInMonth),
      il: true,
      candlelighting: false,
      sedrot: false,
      noMinorFast: false,
      noRoshChodesh: false,
      noModern: false,
    });
    const eventsByDate = new Map<string, Event[]>();
    events.forEach((ev) => {
      const d = ev.getDate().greg();
      const key = formatDateKey(d.getFullYear(), d.getMonth(), d.getDate());
      if (!eventsByDate.has(key)) eventsByDate.set(key, []);
      eventsByDate.get(key)!.push(ev);
    });

    const cells: (CellInfo | null)[] = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      const dateObj = new Date(year, month, d);
      const dateStr = formatDateKey(year, month, d);
      const hd = new HDate(dateObj);
      const hebrewDay = HEBREW_NUMERALS[hd.getDate()] || String(hd.getDate());
      const dayEvents = eventsByDate.get(dateStr) || [];
      const holidayEvents = dayEvents.filter((ev) => {
        const f = ev.getFlags();
        // Show major holidays, Chol HaMoed, minor holidays, fasts; skip Rosh Chodesh-only & parashat
        return (f & flags.CHAG) || (f & flags.YOM_TOV_ENDS) || (f & flags.CHOL_HAMOED) ||
               (f & flags.MINOR_HOLIDAY) || (f & flags.MAJOR_FAST) || (f & flags.MINOR_FAST) ||
               (f & flags.MODERN_HOLIDAY) || (f & flags.SPECIAL_SHABBAT);
      });
      const isYomTov = holidayEvents.some((ev) => !!(ev.getFlags() & flags.CHAG));
      cells.push({
        date: dateStr,
        day: d,
        hebrewDay,
        isShabbat: dateObj.getDay() === 6,
        holidays: holidayEvents.map((ev) => ev.render("he")),
        isYomTov,
        isCandleLighting: dateObj.getDay() === 5 || isYomTov,
      });
    }
    return cells;
  }, [viewMonth]);

  const todayStr = formatDateKey(today.getFullYear(), today.getMonth(), today.getDate());

  if (!isApproved) {
    return (
      <div className="min-h-screen">
        <DynamicBackground variant="vineyard" />
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

  const monthHebRange = (() => {
    const first = new HDate(new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 1));
    const last = new HDate(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 0));
    const firstM = first.getMonthName();
    const lastM = last.getMonthName();
    return firstM === lastM ? `${firstM} ${first.getFullYear()}` : `${firstM}–${lastM} ${last.getFullYear()}`;
  })();

  return (
    <div className="min-h-screen">
      <DynamicBackground variant="vineyard" />
      <Navbar />
      <div className="container mx-auto px-4 sm:px-6 pt-24 pb-12 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-black font-display flex items-center gap-2">
            <CalendarRange className="h-8 w-8 text-primary" />
            לוח שבתות וחגים
          </h1>
          <p className="text-muted-foreground mt-1">לחצו על תאריך לראות אפשרויות אירוח</p>
        </motion.div>

        <div className="rounded-3xl border border-border bg-card p-4 sm:p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" size="sm" className="rounded-full h-9 w-9 p-0" onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1))}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <div className="text-center">
              <h2 className="font-display font-bold text-lg leading-tight">
                {HEBREW_MONTHS[viewMonth.getMonth()]} {viewMonth.getFullYear()}
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">{monthHebRange}</p>
            </div>
            <Button variant="ghost" size="sm" className="rounded-full h-9 w-9 p-0" onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1))}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {HEBREW_DAYS.map((d) => (
              <div key={d} className="text-center text-xs font-bold text-muted-foreground py-2">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1.5">
            {calendarCells.map((cell, i) => {
              if (!cell) return <div key={i} />;
              const hasOpps = opportunityDateSet.has(cell.date);
              const isToday = cell.date === todayStr;
              const isSpecial = cell.isShabbat || cell.isYomTov || cell.holidays.length > 0;
              const holidayLabel = cell.holidays[0];

              return (
                <button
                  key={i}
                  onClick={() => navigate(`/calendar/${cell.date}`)}
                  title={cell.holidays.length ? cell.holidays.join(" • ") : cell.isShabbat ? "שבת" : ""}
                  className={`
                    relative aspect-square rounded-2xl p-1 sm:p-1.5 transition-all overflow-hidden text-right
                    border hover:scale-[1.04] hover:shadow-md
                    ${cell.isYomTov ? "bg-gradient-to-br from-[hsl(var(--amber-soft))]/60 to-[hsl(var(--terracotta))]/30 border-[hsl(var(--terracotta))]/40" : ""}
                    ${!cell.isYomTov && cell.isShabbat ? "bg-gradient-to-br from-[hsl(var(--amber-soft))]/40 to-primary/10 border-primary/30" : ""}
                    ${!isSpecial ? "bg-card border-border/60" : ""}
                    ${isToday ? "ring-2 ring-primary" : ""}
                  `}
                >
                  {/* Top row: greg + hebrew */}
                  <div className="flex items-start justify-between leading-none">
                    <span className={`text-[9px] sm:text-[10px] font-medium ${isSpecial ? "text-primary/80" : "text-muted-foreground/70"}`}>
                      {cell.hebrewDay}
                    </span>
                    <span className={`text-sm sm:text-base font-bold ${isSpecial ? "text-foreground" : "text-foreground/80"}`}>
                      {cell.day}
                    </span>
                  </div>

                  {/* Center icon for Shabbat/Yom Tov */}
                  {isSpecial && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      {cell.isYomTov ? (
                        <SparklesIcon className="h-5 w-5 sm:h-6 sm:w-6 text-[hsl(var(--terracotta))]/70" />
                      ) : cell.isShabbat ? (
                        <Flame className="h-5 w-5 sm:h-6 sm:w-6 text-primary/60" />
                      ) : (
                        <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--terracotta))]/60" />
                      )}
                    </div>
                  )}

                  {/* Holiday name strip */}
                  {holidayLabel && (
                    <div className="absolute bottom-0 inset-x-0 px-1 py-0.5 bg-[hsl(var(--terracotta))]/80 text-cream text-[8px] sm:text-[9px] font-bold truncate text-center">
                      {holidayLabel}
                    </div>
                  )}

                  {/* Opportunity dot */}
                  {hasOpps && !holidayLabel && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 h-1.5 w-1.5 rounded-full bg-primary" />
                  )}
                  {hasOpps && holidayLabel && (
                    <span className="absolute top-1 left-1 h-2 w-2 rounded-full bg-primary ring-2 ring-card" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-5 pt-4 border-t border-border flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Flame className="h-3.5 w-3.5 text-primary/60" /> שבת
            </div>
            <div className="flex items-center gap-1.5">
              <SparklesIcon className="h-3.5 w-3.5 text-[hsl(var(--terracotta))]/70" /> חג
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-primary" /> יש אפשרויות אירוח
            </div>
            <div className="flex items-center gap-1.5">
              <span className="inline-block h-3 w-3 rounded ring-2 ring-primary" /> היום
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShabbatCalendar;
