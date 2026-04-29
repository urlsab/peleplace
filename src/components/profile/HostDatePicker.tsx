import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, ChevronLeft, Sparkles, CalendarCheck, X, Pencil, AlertCircle, CheckCircle2 } from "lucide-react";
import { HDate, HebrewCalendar, flags } from "@hebcal/core";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { labelHebrewDate } from "@/lib/hebrewDates";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import SlotDetailsDialog, { SlotDetails, SlotHostType, emptySlot } from "./SlotDetailsDialog";

const HEBREW_MONTHS = ["ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני", "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"];
const HEBREW_DAYS = ["א'", "ב'", "ג'", "ד'", "ה'", "ו'", "ש'"];

const ymd = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

interface HostDatePickerProps {
  selectedDates: string[];
  onChange: (dates: string[]) => void;
  alwaysAvailable: boolean;
  onAlwaysAvailableChange: (value: boolean) => void;
  hostType: SlotHostType;
}

const HostDatePicker = ({
  selectedDates,
  onChange,
  alwaysAvailable,
  onAlwaysAvailableChange,
  hostType,
}: HostDatePickerProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const today = new Date();
  const [viewMonth, setViewMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [slots, setSlots] = useState<Record<string, SlotDetails>>({});
  const [dialogDate, setDialogDate] = useState<string | null>(null);

  // Load existing slot details for this host on mount / hostType change
  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from("host_availability_slots")
        .select("*")
        .eq("user_id", user.id)
        .eq("host_type", hostType);
      if (data) {
        const map: Record<string, SlotDetails> = {};
        data.forEach((row: any) => {
          map[row.event_date] = {
            capacity: row.capacity,
            guest_gender: row.guest_gender,
            arrangement: row.arrangement,
            requires_experience: row.requires_experience,
            requires_driving_license: row.requires_driving_license,
            requires_weapon_license: row.requires_weapon_license,
            requires_first_aid: row.requires_first_aid,
            requires_physical_fitness: row.requires_physical_fitness,
            extra_requirement: row.extra_requirement,
            notes: row.notes,
          };
        });
        setSlots(map);
      }
    })();
  }, [user, hostType]);

  const selectedSet = useMemo(() => new Set(selectedDates), [selectedDates]);

  // Compute holidays + Shabbat per cell for the visible month
  const cells = useMemo(() => {
    const year = viewMonth.getFullYear();
    const month = viewMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const events = HebrewCalendar.calendar({
      start: new Date(year, month, 1),
      end: new Date(year, month, daysInMonth),
      il: true,
      candlelighting: false,
      sedrot: false,
      noMinorFast: false,
      noRoshChodesh: true,
      noModern: false,
    });
    const evMap = new Map<string, string[]>();
    events.forEach((ev) => {
      const f = ev.getFlags();
      const isShown =
        (f & flags.CHAG) || (f & flags.YOM_TOV_ENDS) || (f & flags.CHOL_HAMOED) ||
        (f & flags.MINOR_HOLIDAY) || (f & flags.MAJOR_FAST) || (f & flags.MINOR_FAST) ||
        (f & flags.MODERN_HOLIDAY) || (f & flags.SPECIAL_SHABBAT);
      if (!isShown) return;
      const d = ev.getDate().greg();
      const key = ymd(d);
      if (!evMap.has(key)) evMap.set(key, []);
      evMap.get(key)!.push(ev.render("he"));
    });

    const arr: ({ date: string; day: number; hebrew: string; isShabbat: boolean; holiday?: string; isPast: boolean } | null)[] = [];
    for (let i = 0; i < firstDay; i++) arr.push(null);
    const todayStr = ymd(today);
    for (let d = 1; d <= daysInMonth; d++) {
      const dateObj = new Date(year, month, d);
      const dateStr = ymd(dateObj);
      const hd = new HDate(dateObj);
      arr.push({
        date: dateStr,
        day: d,
        hebrew: String(hd.getDate()),
        isShabbat: dateObj.getDay() === 6,
        holiday: evMap.get(dateStr)?.[0],
        isPast: dateStr < todayStr,
      });
    }
    return arr;
  }, [viewMonth]);

  const isSlotComplete = (date: string): boolean => {
    const s = slots[date];
    if (!s) return false;
    // Minimum: capacity + guest_gender
    if (!s.capacity || !s.guest_gender) return false;
    return true;
  };

  const toggle = (date: string) => {
    const next = new Set(selectedSet);
    if (next.has(date)) next.delete(date);
    else next.add(date);
    onChange([...next]);
  };

  const openSlotDialog = (date: string) => setDialogDate(date);

  const persistSlots = async (updates: Record<string, SlotDetails>) => {
    if (!user) return;
    const rows = Object.entries(updates).map(([date, d]) => ({
      user_id: user.id,
      host_type: hostType,
      event_date: date,
      capacity: d.capacity,
      guest_gender: d.guest_gender,
      arrangement: d.arrangement,
      requires_experience: d.requires_experience,
      requires_driving_license: d.requires_driving_license,
      requires_weapon_license: d.requires_weapon_license,
      requires_first_aid: d.requires_first_aid,
      requires_physical_fitness: d.requires_physical_fitness,
      extra_requirement: d.extra_requirement,
      notes: d.notes,
    }));
    const { error } = await supabase
      .from("host_availability_slots")
      .upsert(rows, { onConflict: "user_id,host_type,event_date" });
    if (error) {
      toast({ title: "שגיאה בשמירת פרטי תאריך", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "הפרטים נשמרו ✨" });
    }
  };

  const handleSaveSlot = async (details: SlotDetails, applyToAll: boolean) => {
    if (!dialogDate) return;
    const updates: Record<string, SlotDetails> = applyToAll
      ? Object.fromEntries(selectedDates.map((d) => [d, details]))
      : { [dialogDate]: details };
    setSlots((prev) => ({ ...prev, ...updates }));
    await persistSlots(updates);
  };

  const incompleteCount = selectedDates.filter((d) => !isSlotComplete(d)).length;

  // Quick action: select all upcoming Shabbatot for N months
  const selectAllShabbatot = (months: number) => {
    const result = new Set(selectedSet);
    const start = new Date();
    const end = new Date(start.getFullYear(), start.getMonth() + months, start.getDate());
    const cur = new Date(start);
    // Move to upcoming Saturday
    cur.setDate(cur.getDate() + ((6 - cur.getDay() + 7) % 7));
    while (cur <= end) {
      result.add(ymd(cur));
      cur.setDate(cur.getDate() + 7);
    }
    onChange([...result]);
  };

  // Quick action: select all Shabbatot in the visible month
  const selectShabbatotInView = () => {
    const result = new Set(selectedSet);
    cells.forEach((c) => {
      if (c && c.isShabbat && !c.isPast) result.add(c.date);
    });
    onChange([...result]);
  };

  // Quick action: select all major holidays (CHAG) for next 12 months
  const selectAllHolidays = () => {
    const result = new Set(selectedSet);
    const start = new Date();
    const end = new Date(start.getFullYear() + 1, start.getMonth(), start.getDate());
    const events = HebrewCalendar.calendar({
      start,
      end,
      il: true,
      candlelighting: false,
      sedrot: false,
      noMinorFast: true,
      noRoshChodesh: true,
      noModern: true,
    });
    events.forEach((ev) => {
      const f = ev.getFlags();
      if (f & flags.CHAG) {
        result.add(ymd(ev.getDate().greg()));
      }
    });
    onChange([...result]);
  };

  const clearAll = () => onChange([]);

  const monthHebRange = (() => {
    const first = new HDate(new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 1));
    const last = new HDate(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 0));
    const firstM = first.getMonthName();
    const lastM = last.getMonthName();
    return firstM === lastM ? `${firstM} ${first.getFullYear()}` : `${firstM}–${lastM} ${last.getFullYear()}`;
  })();

  return (
    <div className="space-y-4">
      {/* Always available toggle */}
      <div className="flex items-center justify-between rounded-2xl border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-[hsl(var(--amber-soft))]/30 p-4">
        <div className="flex items-center gap-3">
          <Sparkles className="h-5 w-5 text-primary" />
          <div>
            <Label htmlFor="always-available" className="font-bold text-sm cursor-pointer">
              תמיד פנוי לארח
            </Label>
            <p className="text-xs text-muted-foreground">בקשות יוכלו להישלח לכל תאריך</p>
          </div>
        </div>
        <Switch
          id="always-available"
          checked={alwaysAvailable}
          onCheckedChange={onAlwaysAvailableChange}
        />
      </div>

      {!alwaysAvailable && (
        <>
          {/* Quick actions */}
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" size="sm" className="rounded-full text-xs h-8" onClick={selectShabbatotInView}>
              <CalendarCheck className="h-3.5 w-3.5 ml-1" /> כל השבתות בחודש זה
            </Button>
            <Button type="button" variant="outline" size="sm" className="rounded-full text-xs h-8" onClick={() => selectAllShabbatot(3)}>
              שבתות ל־3 חודשים
            </Button>
            <Button type="button" variant="outline" size="sm" className="rounded-full text-xs h-8" onClick={() => selectAllShabbatot(12)}>
              כל השבתות בשנה הקרובה
            </Button>
            <Button type="button" variant="outline" size="sm" className="rounded-full text-xs h-8" onClick={selectAllHolidays}>
              <Sparkles className="h-3.5 w-3.5 ml-1" /> כל החגים
            </Button>
            {selectedDates.length > 0 && (
              <Button type="button" variant="ghost" size="sm" className="rounded-full text-xs h-8 text-destructive" onClick={clearAll}>
                <X className="h-3.5 w-3.5 ml-1" /> נקה הכל
              </Button>
            )}
          </div>

          {/* Calendar */}
          <div className="rounded-2xl border border-border bg-background p-3 sm:p-4">
            <div className="flex items-center justify-between mb-3">
              <Button type="button" variant="ghost" size="sm" className="rounded-full h-8 w-8 p-0" onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1))}>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <div className="text-center">
                <div className="font-bold text-sm">
                  {HEBREW_MONTHS[viewMonth.getMonth()]} {viewMonth.getFullYear()}
                </div>
                <div className="text-[10px] text-muted-foreground">{monthHebRange}</div>
              </div>
              <Button type="button" variant="ghost" size="sm" className="rounded-full h-8 w-8 p-0" onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1))}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-1">
              {HEBREW_DAYS.map((d) => (
                <div key={d} className="text-center text-[10px] font-bold text-muted-foreground py-1">{d}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {cells.map((c, i) => {
                if (!c) return <div key={i} />;
                const selected = selectedSet.has(c.date);
                const special = c.isShabbat || !!c.holiday;
                return (
                  <button
                    key={i}
                    type="button"
                    disabled={c.isPast}
                    onClick={() => toggle(c.date)}
                    title={c.holiday || (c.isShabbat ? "שבת" : "")}
                    className={`
                      relative aspect-square rounded-lg text-xs font-medium transition-all
                      flex flex-col items-center justify-center gap-0.5
                      ${c.isPast ? "opacity-30 cursor-not-allowed" : "hover:scale-105"}
                      ${selected
                        ? "bg-primary text-primary-foreground shadow-md ring-2 ring-primary"
                        : special
                          ? "bg-[hsl(var(--amber-soft))]/40 border border-primary/20 hover:bg-primary/10"
                          : "bg-card border border-border/60 hover:bg-muted"}
                    `}
                  >
                    <span className={`text-sm font-bold leading-none ${selected ? "" : special ? "text-foreground" : "text-foreground/70"}`}>
                      {c.day}
                    </span>
                    {c.holiday && (
                      <span className={`text-[7px] sm:text-[8px] leading-none truncate max-w-full px-0.5 ${selected ? "text-primary-foreground/90" : "text-[hsl(var(--terracotta))]"}`}>
                        {c.holiday}
                      </span>
                    )}
                    {c.isShabbat && !c.holiday && (
                      <span className={`text-[7px] leading-none ${selected ? "text-primary-foreground/80" : "text-primary/70"}`}>שבת</span>
                    )}
                    {selected && (
                      <span className="absolute top-0.5 left-0.5">
                        {isSlotComplete(c.date) ? (
                          <CheckCircle2 className="h-3 w-3 text-primary-foreground/90" />
                        ) : (
                          <AlertCircle className="h-3 w-3 text-[hsl(var(--terracotta))]" />
                        )}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Reminder banner for incomplete slots */}
          {incompleteCount > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-3 rounded-2xl border-2 border-[hsl(var(--terracotta))]/40 bg-[hsl(var(--terracotta))]/10 p-3"
            >
              <AlertCircle className="h-5 w-5 text-[hsl(var(--terracotta))] shrink-0 mt-0.5" />
              <div className="flex-1 text-xs">
                <div className="font-bold text-foreground">
                  חסרים פרטים ל־{incompleteCount} תאריכים
                </div>
                <div className="text-muted-foreground">
                  לחצו על תאריך ברשימה למטה כדי להוסיף מספר מקומות, מגדר, ודרישות.
                </div>
              </div>
            </motion.div>
          )}

          {/* Selected list */}
          {selectedDates.length > 0 && (
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">
                נבחרו {selectedDates.length} תאריכים — לחצו על תאריך לערוך פרטים:
              </Label>
              <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto">
                {[...selectedDates].sort().map((d) => {
                  const complete = isSlotComplete(d);
                  return (
                    <Badge
                      key={d}
                      variant={complete ? "secondary" : "outline"}
                      className={`text-[10px] gap-1 cursor-pointer transition-colors ${
                        complete
                          ? "border-primary/30"
                          : "border-[hsl(var(--terracotta))]/50 bg-[hsl(var(--terracotta))]/10 text-[hsl(var(--terracotta))]"
                      }`}
                      onClick={() => openSlotDialog(d)}
                    >
                      {complete ? <CheckCircle2 className="h-3 w-3" /> : <Pencil className="h-3 w-3" />}
                      {labelHebrewDate(d)}
                      <X
                        className="h-3 w-3 cursor-pointer hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggle(d);
                        }}
                      />
                    </Badge>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}

      {alwaysAvailable && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-primary/30 bg-primary/5 p-4 text-center text-sm text-foreground/80"
        >
          ✨ הצוות שלך מוצג כתמיד זמין — מבקשים יוכלו לבחור כל תאריך
        </motion.div>
      )}

      <SlotDetailsDialog
        open={!!dialogDate}
        onOpenChange={(o) => !o && setDialogDate(null)}
        hostType={hostType}
        date={dialogDate}
        initial={dialogDate ? (slots[dialogDate] || emptySlot) : emptySlot}
        onSave={handleSaveSlot}
      />
    </div>
  );
};

export default HostDatePicker;
