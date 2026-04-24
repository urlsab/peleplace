import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Search, Filter, MapPin, Calendar, Users, Briefcase, HandHeart, Home, X, Send, Sparkles, CalendarDays } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import BookingRequestDialog from "@/components/BookingRequestDialog";
import DynamicBackground from "@/components/DynamicBackground";
import { labelHebrewDate, sortDateStrings } from "@/lib/hebrewDates";

const regionLabels: Record<string, string> = {
  north: "צפון",
  haifa: "חיפה",
  sharon: "שרון",
  center: "מרכז",
  tel_aviv: "תל אביב",
  jerusalem: "ירושלים",
  shfela: "שפלה",
  south: "דרום",
  judea_samaria: "יהודה ושומרון",
};

const religiousLabels: Record<string, string> = {
  secular: "חילוני",
  traditional: "מסורתי",
  religious: "דתי",
  ultra_orthodox: "חרדי",
  other: "אחר",
};

const categoryConfig = {
  family: { label: "אירוח", icon: Home, color: "bg-[hsl(var(--terracotta))]" },
  work: { label: "עבודה", icon: Briefcase, color: "bg-primary" },
  volunteer: { label: "התנדבות", icon: HandHeart, color: "bg-secondary" },
  singles_group: { label: "חבורת רווקים/ות", icon: Sparkles, color: "bg-[hsl(var(--olive))]" },
  organized_shabbat: { label: "שבת מאורגנת", icon: CalendarDays, color: "bg-[hsl(var(--amber-soft))]" },
};

type OpportunityType = "family" | "work" | "volunteer" | "singles_group" | "organized_shabbat";

type OpportunityItem = {
  id: string;
  userId: string;
  type: OpportunityType;
  title: string;
  city: string | null;
  region: string | null;
  religiousLevel: string | null;
  availableDates: string[] | null;
  alwaysAvailable: boolean;
  details: Record<string, unknown>;
};

const Explore = () => {
  const { user, profile } = useAuth();
  const isApproved = profile?.registration_status === "approved";
  const [searchQuery, setSearchQuery] = useState("");
  const [regionFilter, setRegionFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [religiousFilter, setReligiousFilter] = useState<string>("all");
  const [bookingTarget, setBookingTarget] = useState<OpportunityItem | null>(null);

  const { data: familyProfiles } = useQuery({
    queryKey: ["explore-family"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("host_family_profiles")
        .select("*");
      if (error) throw error;
      return data || [];
    },
  });

  const { data: workProfiles } = useQuery({
    queryKey: ["explore-work"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("host_work_profiles")
        .select("*");
      if (error) throw error;
      return data || [];
    },
  });

  const { data: volunteerProfiles } = useQuery({
    queryKey: ["explore-volunteer"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("host_volunteer_profiles")
        .select("*");
      if (error) throw error;
      return data || [];
    },
  });

  const { data: singlesGroupProfiles } = useQuery({
    queryKey: ["explore-singles-group"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("host_singles_group_profiles")
        .select("*");
      if (error) throw error;
      return data || [];
    },
  });

  const { data: organizedShabbatProfiles } = useQuery({
    queryKey: ["explore-organized-shabbat"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("host_organized_shabbat_profiles")
        .select("*");
      if (error) throw error;
      return data || [];
    },
  });

  const allOpportunities = useMemo<OpportunityItem[]>(() => {
    const items: OpportunityItem[] = [];

    familyProfiles?.forEach((p) =>
      items.push({
        id: p.id,
        userId: p.user_id,
        type: "family",
        title: p.about_us ? `אירוח — ${p.city || "משפחה מארחת"}` : "משפחה מארחת",
        city: p.city,
        region: p.region,
        religiousLevel: p.religious_level,
        availableDates: p.available_dates,
        alwaysAvailable: (p as any).always_available || false,
        details: { aboutUs: p.about_us, guestPreference: p.guest_preference },
      })
    );

    workProfiles?.forEach((p) =>
      items.push({
        id: p.id,
        userId: p.user_id,
        type: "work",
        title: p.place_name,
        city: p.city,
        region: p.region,
        religiousLevel: null,
        availableDates: p.available_dates,
        alwaysAvailable: (p as any).always_available || false,
        details: {
          jobDescription: p.job_description,
          payment: p.payment,
          isPermanent: p.is_permanent,
          teamSize: p.team_size,
        },
      })
    );

    volunteerProfiles?.forEach((p) =>
      items.push({
        id: p.id,
        userId: p.user_id,
        type: "volunteer",
        title: p.place_name,
        city: p.city,
        region: p.region,
        religiousLevel: null,
        availableDates: null,
        alwaysAvailable: true, // Volunteer roles have no specific dates
        details: {
          volunteerType: p.volunteer_type,
          providesMeals: p.provides_meals,
          providesAccommodation: p.provides_accommodation,
        },
      })
    );

    singlesGroupProfiles?.forEach((p) =>
      items.push({
        id: p.id,
        userId: p.user_id,
        type: "singles_group",
        title: p.group_name,
        city: p.city,
        region: p.region,
        religiousLevel: p.religious_level,
        availableDates: p.available_dates,
        alwaysAvailable: (p as any).always_available || false,
        details: {
          description: p.description,
          groupSize: p.group_size,
          guestPreference: p.guest_preference,
          ageRangeMin: p.age_range_min,
          ageRangeMax: p.age_range_max,
        },
      })
    );

    organizedShabbatProfiles?.forEach((p) =>
      items.push({
        id: p.id,
        userId: p.user_id,
        type: "organized_shabbat",
        title: p.organization_name,
        city: p.city,
        region: p.region,
        religiousLevel: p.religious_level,
        availableDates: p.available_dates,
        alwaysAvailable: (p as any).always_available || false,
        details: {
          shabbatType: p.shabbat_type,
          description: p.description,
          cost: p.cost,
          registrationLink: p.registration_link,
          targetAudience: p.target_audience,
        },
      })
    );

    return items;
  }, [familyProfiles, workProfiles, volunteerProfiles, singlesGroupProfiles, organizedShabbatProfiles]);

  const filtered = useMemo(() => {
    return allOpportunities.filter((item) => {
      if (regionFilter !== "all" && item.region !== regionFilter) return false;
      if (typeFilter !== "all" && item.type !== typeFilter) return false;
      if (religiousFilter !== "all" && item.religiousLevel !== religiousFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchCity = item.city?.toLowerCase().includes(q);
        if (!matchTitle && !matchCity) return false;
      }
      return true;
    });
  }, [allOpportunities, regionFilter, typeFilter, religiousFilter, searchQuery]);

  const activeFiltersCount = [regionFilter, typeFilter, religiousFilter].filter((f) => f !== "all").length;

  const clearFilters = () => {
    setRegionFilter("all");
    setTypeFilter("all");
    setReligiousFilter("all");
    setSearchQuery("");
  };

  // Block unapproved (or unauthenticated) users from searching shabbatot
  if (!user || !isApproved) {
    return (
      <div className="min-h-screen" dir="rtl">
        <DynamicBackground variant="fields" />
        <Navbar />
        <div className="pt-28 pb-16 px-6">
          <div className="mx-auto max-w-md text-center rounded-3xl border border-border bg-card p-8 shadow-card space-y-5">
            <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-3xl">⏳</div>
            <h1 className="text-2xl font-black font-display">חיפוש שבתות זמין רק לחברי פל״א מאושרים</h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {user
                ? "ההרשמה שלך עדיין ממתינה לאישור הצוות. נעדכן אותך במייל ברגע שתאושר."
                : "כדי לחפש ולהזמין שבתות יש להירשם לפל״א ולקבל אישור מהצוות."}
            </p>
            <div className="flex gap-3 justify-center pt-2">
              <button
                onClick={() => (window.location.href = "/")}
                className="rounded-full px-6 py-2.5 text-sm font-bold border border-border hover:bg-muted/60 transition-colors"
              >
                חזרה לעמוד הראשי
              </button>
              {!user && (
                <button
                  onClick={() => (window.location.href = "/auth")}
                  className="rounded-full px-6 py-2.5 text-sm font-bold bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
                >
                  הצטרפות / התחברות
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" dir="rtl">
      <DynamicBackground variant="fields" />
      <Navbar />
      <div className="pt-20 pb-12">
        {/* Header */}
        <section className="container mx-auto px-6 py-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-black font-display md:text-5xl mb-3"
          >
            מצאו את <span className="text-gradient-warm">ההזדמנות</span> הבאה
          </motion.h1>
          <p className="text-muted-foreground text-lg">חפשו וסננו לפי אזור, סוג, רמה דתית ועוד</p>
        </section>

        {/* Filters */}
        <section className="container mx-auto px-6 mb-8">
          <div className="rounded-2xl bg-card border border-border p-4 md:p-6 shadow-card">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Filter className="h-5 w-5 text-muted-foreground" />
              <span className="font-bold font-display text-lg">סינון</span>
              {activeFiltersCount > 0 && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1 text-xs">
                  <X className="h-3 w-3" /> נקה הכל
                </Button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="חיפוש חופשי..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-9"
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="סוג" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">כל הסוגים</SelectItem>
                  <SelectItem value="family">אירוח משפחה</SelectItem>
                  <SelectItem value="singles_group">חבורת רווקים/ות</SelectItem>
                  <SelectItem value="organized_shabbat">שבת מאורגנת</SelectItem>
                  <SelectItem value="work">עבודה</SelectItem>
                  <SelectItem value="volunteer">התנדבות</SelectItem>
                </SelectContent>
              </Select>
              <Select value={regionFilter} onValueChange={setRegionFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="אזור" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">כל האזורים</SelectItem>
                  {Object.entries(regionLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={religiousFilter} onValueChange={setReligiousFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="רמה דתית" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">כל הרמות</SelectItem>
                  {Object.entries(religiousLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {/* Results */}
        <section className="container mx-auto px-6">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{filtered.length} תוצאות</span>
          </div>

          {filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-20 text-center"
            >
              <Search className="mx-auto h-12 w-12 text-muted-foreground/40 mb-4" />
              <h3 className="text-xl font-bold font-display mb-2">לא נמצאו תוצאות</h3>
              <p className="text-muted-foreground">נסו לשנות את הסינון או לחפש מונח אחר</p>
            </motion.div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((item, i) => {
                const cat = categoryConfig[item.type];
                const Icon = cat.icon;
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="group rounded-2xl bg-card border border-border shadow-card hover:shadow-hover transition-all overflow-hidden"
                  >
                    {/* Color strip */}
                    <div className={`h-1.5 ${cat.color}`} />
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${cat.color} text-primary-foreground`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <Badge variant="secondary" className="text-xs">{cat.label}</Badge>
                        </div>
                      </div>
                      <h3 className="font-bold font-display text-lg mb-3">{item.title}</h3>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        {item.city && (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-3.5 w-3.5 shrink-0" />
                            <span>{item.city}{item.region ? ` · ${regionLabels[item.region] || item.region}` : ""}</span>
                          </div>
                        )}
                        {item.region && !item.city && (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-3.5 w-3.5 shrink-0" />
                            <span>{regionLabels[item.region] || item.region}</span>
                          </div>
                        )}
                        {item.religiousLevel && (
                          <div className="flex items-center gap-2">
                            <span className="text-xs">🕎</span>
                            <span>{religiousLabels[item.religiousLevel] || item.religiousLevel}</span>
                          </div>
                        )}
                        {item.availableDates && item.availableDates.length > 0 && (
                          <div className="space-y-1.5 pt-1">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-3.5 w-3.5 shrink-0" />
                              <span className="font-semibold text-foreground/80">
                                {item.availableDates.length} תאריכים זמינים
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {sortDateStrings(item.availableDates).slice(0, 6).map((d) => (
                                <Badge
                                  key={d}
                                  variant="outline"
                                  className="text-[10px] font-medium border-primary/30 bg-primary/5 text-foreground/80"
                                >
                                  {labelHebrewDate(d)}
                                </Badge>
                              ))}
                              {item.availableDates.length > 6 && (
                                <Badge variant="outline" className="text-[10px] font-medium">
                                  +{item.availableDates.length - 6} עוד
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                        {item.type === "work" && (item.details as any).payment && (
                          <div className="flex items-center gap-2">
                            <span className="text-xs">💰</span>
                            <span>{(item.details as any).payment}</span>
                          </div>
                        )}
                        {item.type === "work" && (item.details as any).teamSize && (
                          <div className="flex items-center gap-2">
                            <Users className="h-3.5 w-3.5 shrink-0" />
                            <span>{(item.details as any).teamSize} אנשי צוות</span>
                          </div>
                        )}
                        {item.type === "volunteer" && (item.details as any).volunteerType && (
                          <div className="flex items-center gap-2">
                            <HandHeart className="h-3.5 w-3.5 shrink-0" />
                            <span>{(item.details as any).volunteerType}</span>
                          </div>
                        )}
                        {item.type === "singles_group" && (item.details as any).groupSize && (
                          <div className="flex items-center gap-2">
                            <Users className="h-3.5 w-3.5 shrink-0" />
                            <span>{(item.details as any).groupSize} בחבורה</span>
                          </div>
                        )}
                        {item.type === "singles_group" && ((item.details as any).ageRangeMin || (item.details as any).ageRangeMax) && (
                          <div className="flex items-center gap-2">
                            <span className="text-xs">🎂</span>
                            <span>גילאים {(item.details as any).ageRangeMin || "?"}-{(item.details as any).ageRangeMax || "?"}</span>
                          </div>
                        )}
                        {item.type === "organized_shabbat" && (item.details as any).shabbatType && (
                          <div className="flex items-center gap-2">
                            <Sparkles className="h-3.5 w-3.5 shrink-0" />
                            <span>{(item.details as any).shabbatType}</span>
                          </div>
                        )}
                        {item.type === "organized_shabbat" && (item.details as any).cost && (
                          <div className="flex items-center gap-2">
                            <span className="text-xs">💰</span>
                            <span>{(item.details as any).cost}</span>
                          </div>
                        )}
                      </div>
                      {user && user.id !== item.userId && isApproved && (
                        <Button
                          size="sm"
                          className="mt-4 w-full rounded-full gap-1.5 font-semibold"
                          onClick={() => setBookingTarget(item)}
                        >
                          <Send className="h-3.5 w-3.5" /> שלחו בקשה
                        </Button>
                      )}
                      {user && !isApproved && (
                        <p className="mt-4 text-xs text-center text-muted-foreground">
                          ⏳ שליחת בקשות תתאפשר לאחר אישור ההרשמה
                        </p>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8">
        <div className="container mx-auto px-6 text-center text-sm text-muted-foreground">
          <p>© 2026 פל״א — פשוט לבחור איפה. כל הזכויות שמורות ❤️</p>
        </div>
      </footer>

      {bookingTarget && (
        <BookingRequestDialog
          open={!!bookingTarget}
          onOpenChange={(open) => !open && setBookingTarget(null)}
          hostUserId={bookingTarget.userId}
          hostType={bookingTarget.type}
          hostTitle={bookingTarget.title}
          availableDates={bookingTarget.availableDates}
          alwaysAvailable={bookingTarget.alwaysAvailable}
        />
      )}
    </div>
  );
};

export default Explore;
