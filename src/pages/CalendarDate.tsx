import { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, Briefcase, HandHeart, Home, Sparkles, CalendarDays, Flame } from "lucide-react";
import { HDate, HebrewCalendar, flags } from "@hebcal/core";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import DynamicBackground from "@/components/DynamicBackground";

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

type Opp = {
  type: keyof typeof categoryConfig;
  title: string;
  region: string | null;
  city: string | null;
};

const CalendarDate = () => {
  const { date } = useParams<{ date: string }>();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const isApproved = profile?.registration_status === "approved";

  const { data: opps = [], isLoading } = useQuery({
    queryKey: ["date-opportunities", date],
    queryFn: async () => {
      if (!date) return [];
      const tables = [
        { name: "host_family_profiles" as const, type: "family" as const, titleField: "city" },
        { name: "host_work_profiles" as const, type: "work" as const, titleField: "place_name" },
        { name: "host_singles_group_profiles" as const, type: "singles_group" as const, titleField: "group_name" },
        { name: "host_organized_shabbat_profiles" as const, type: "organized_shabbat" as const, titleField: "organization_name" },
      ];
      const all: Opp[] = [];
      for (const t of tables) {
        const { data } = await supabase.from(t.name).select("*").contains("available_dates", [date]);
        (data || []).forEach((row: any) => {
          all.push({
            type: t.type,
            title: row[t.titleField] || categoryConfig[t.type].label,
            region: row.region,
            city: row.city,
          });
        });
      }
      return all;
    },
    enabled: isApproved && !!date,
  });

  const dateInfo = useMemo(() => {
    if (!date) return null;
    // Validate date format YYYY-MM-DD
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
    const d = new Date(date + "T00:00:00");
    if (isNaN(d.getTime())) return null;
    let hd: HDate;
    try {
      hd = new HDate(d);
    } catch {
      return null;
    }
    const events = HebrewCalendar.calendar({ start: d, end: d, il: true }).filter((ev) => {
      const f = ev.getFlags();
      return (f & flags.CHAG) || (f & flags.CHOL_HAMOED) || (f & flags.MINOR_HOLIDAY) ||
             (f & flags.MAJOR_FAST) || (f & flags.MINOR_FAST) || (f & flags.MODERN_HOLIDAY) || (f & flags.SPECIAL_SHABBAT);
    });
    return {
      gregorian: d.toLocaleDateString("he-IL", { weekday: "long", day: "numeric", month: "long", year: "numeric" }),
      hebrew: hd.renderGematriya(),
      isShabbat: d.getDay() === 6,
      holidays: events.map((ev) => ev.render("he")),
    };
  }, [date]);

  if (!isApproved) {
    return (
      <div className="min-h-screen">
        <DynamicBackground variant="vineyard" />
        <Navbar />
        <div className="container mx-auto px-6 pt-32 text-center">
          <h1 className="text-2xl font-black font-display mb-2">פתוח למשתמשים מאושרים</h1>
          <Button onClick={() => navigate("/profile")} className="rounded-full mt-4">חזרה לפרופיל</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <DynamicBackground variant={dateInfo?.isShabbat ? "candles" : "vineyard"} />
      <Navbar />
      <div className="container mx-auto px-4 sm:px-6 pt-24 pb-12 max-w-3xl">
        <Button variant="ghost" size="sm" onClick={() => navigate("/calendar")} className="mb-4 rounded-full gap-1">
          <ArrowRight className="h-4 w-4" /> חזרה ללוח
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-card mb-6"
        >
          <div className="flex items-start gap-3 mb-2">
            {dateInfo?.isShabbat && <Flame className="h-7 w-7 text-primary mt-1" />}
            {dateInfo?.holidays.length ? <Sparkles className="h-7 w-7 text-[hsl(var(--terracotta))] mt-1" /> : null}
            <div>
              <h1 className="text-2xl sm:text-3xl font-black font-display">{dateInfo?.gregorian}</h1>
              <p className="text-muted-foreground mt-1">{dateInfo?.hebrew}</p>
            </div>
          </div>
          {dateInfo?.holidays.length ? (
            <div className="flex flex-wrap gap-2 mt-3">
              {dateInfo.holidays.map((h) => (
                <Badge key={h} className="bg-[hsl(var(--terracotta))] text-cream">{h}</Badge>
              ))}
            </div>
          ) : null}
          {dateInfo?.isShabbat && !dateInfo.holidays.length && (
            <Badge className="bg-primary text-cream mt-3">שבת קודש</Badge>
          )}
        </motion.div>

        <h2 className="font-display font-bold text-xl mb-3">אפשרויות אירוח לתאריך זה</h2>

        {isLoading && <p className="text-muted-foreground text-sm">טוען...</p>}

        {!isLoading && opps.length === 0 && (
          <div className="rounded-3xl border border-border bg-card p-8 text-center">
            <CalendarDays className="h-12 w-12 mx-auto text-muted-foreground/40 mb-3" />
            <p className="font-medium">אין כרגע אפשרויות אירוח לתאריך זה</p>
            <p className="text-sm text-muted-foreground mt-1">נסו תאריך אחר או צפו בכל ההזדמנויות</p>
            <Button onClick={() => navigate("/explore")} className="rounded-full mt-4">לכל ההזדמנויות</Button>
          </div>
        )}

        {opps.length > 0 && (
          <div className="space-y-2">
            {opps.map((opp, i) => {
              const cfg = categoryConfig[opp.type];
              const Icon = cfg.icon;
              return (
                <button
                  key={i}
                  onClick={() => navigate("/explore")}
                  className="w-full text-right rounded-2xl border border-border bg-card p-4 hover:bg-muted/30 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className={`${cfg.color} h-11 w-11 rounded-xl flex items-center justify-center text-cream flex-shrink-0`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold truncate">{opp.title}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3.5 w-3.5" />
                        {[opp.city, opp.region ? regionLabels[opp.region] : null].filter(Boolean).join(", ") || "מיקום לא צוין"}
                      </p>
                      <Badge variant="secondary" className="mt-1.5 text-[10px]">{cfg.label}</Badge>
                    </div>
                  </div>
                </button>
              );
            })}
            <Button onClick={() => navigate("/explore")} className="w-full mt-4 rounded-full">
              צפו בכל ההזדמנויות בחיפוש
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarDate;
