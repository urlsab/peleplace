import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, MapPin, Briefcase, GraduationCap, Languages, Sparkles, Heart, Calendar } from "lucide-react";
import { labelHebrewDate } from "@/lib/hebrewDates";

const regionLabels: Record<string, string> = {
  north: "צפון", haifa: "חיפה", sharon: "שרון", center: "מרכז",
  tel_aviv: "תל אביב", jerusalem: "ירושלים", shfela: "שפלה",
  south: "דרום", judea_samaria: "יהודה ושומרון",
};
const religiousLabels: Record<string, string> = {
  secular: "חילוני", traditional: "מסורתי", religious: "דתי",
  ultra_orthodox: "חרדי", other: "אחר",
};
const genderLabels: Record<string, string> = { men: "גברים", women: "נשים", mixed: "מעורב" };
const kashrutLabels: Record<string, string> = {
  not_kosher: "לא כשר", kosher: "כשר", mehadrin: "כשר למהדרין", chalak_beit_yosef: "חלק/בית יוסף",
};
const dietaryLabels: Record<string, string> = {
  regular: "רגיל", vegetarian: "צמחוני", vegan: "טבעוני", gluten_free: "ללא גלוטן", other: "אחר",
};
const volunteerTypeLabels: Record<string, string> = {
  farm: "חווה", children_home: "בית ילד", chabad: "בית חב״ד",
  elderly: "בית אבות", military_families: "משפחות מילואים", other: "אחר",
};

interface ProfileViewProps {
  profile: any;
  detailedProfile: any;
  profileType: "single" | "family" | "work" | "volunteer" | "singles_group" | "organized_shabbat" | "reservist";
  onEdit: () => void;
  previewMode?: boolean;
}

const Stat = ({ icon: Icon, label, value }: { icon: any; label: string; value?: string | null }) => {
  if (!value) return null;
  return (
    <div className="flex items-start gap-2.5 py-2">
      <Icon className="h-4 w-4 text-primary mt-0.5 shrink-0" />
      <div className="min-w-0">
        <p className="text-[11px] text-muted-foreground uppercase tracking-wider">{label}</p>
        <p className="text-sm font-semibold truncate">{value}</p>
      </div>
    </div>
  );
};

const TagSection = ({ title, items, tone = "primary" }: { title: string; items?: string[] | null; tone?: "primary" | "secondary" | "muted" }) => {
  if (!items?.length) return null;
  const styles =
    tone === "primary"
      ? "bg-primary/10 text-primary border-primary/20"
      : tone === "secondary"
      ? "bg-secondary/15 text-secondary-foreground border-secondary/30"
      : "bg-muted text-foreground border-border";
  return (
    <div className="space-y-2">
      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{title}</h4>
      <div className="flex flex-wrap gap-1.5">
        {items.map((t) => (
          <span key={t} className={`rounded-full border px-3 py-1 text-xs font-medium ${styles}`}>
            {t}
          </span>
        ))}
      </div>
    </div>
  );
};

const ProfileView = ({ profile, detailedProfile, profileType, onEdit, previewMode = false }: ProfileViewProps) => {
  if (!detailedProfile) {
    return (
      <div >
        {/* <p className="text-muted-foreground">עדיין לא מילאת פרופיל מפורט</p>
        <Button onClick={onEdit} className="rounded-full">
          <Edit className="h-4 w-4 ml-2" /> בניית פרופיל
        </Button> */}
      </div>
    );
  }

  const d = detailedProfile;
  const location = [d.city, d.region ? regionLabels[d.region] : null].filter(Boolean).join(", ");
  const displayName =
    profileType === "single" || profileType === "family" || profileType === "reservist"
      ? profile.full_name
      : d.place_name || d.group_name || d.organization_name || profile.full_name;

  const subtitle =
    profileType === "single"
      ? [d.age ? `${d.age}` : null, d.gender ? genderLabels[d.gender] : null].filter(Boolean).join(" · ")
      : profileType === "family"
      ? "משפחה מארחת"
      : profileType === "reservist"
      ? "אשת מילואים"
      : profileType === "work"
      ? "מקום עבודה"
      : profileType === "volunteer"
      ? "התנדבות"
      : profileType === "singles_group"
      ? "חבורת רווקים/ות"
      : "שבת מאורגנת";

  return (
    <div className="rounded-3xl overflow-hidden border border-border bg-card shadow-card">
      {/* Banner */}
      <div className="relative h-40 md:h-56 w-full overflow-hidden bg-gradient-to-br from-primary/25 via-[hsl(var(--terracotta))]/20 to-secondary/25">
        {d.banner_image_url && (
          <img src={d.banner_image_url} alt="" className="absolute inset-0 h-full w-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
        {!previewMode && (
          <Button
            variant="secondary"
            size="sm"
            onClick={onEdit}
            className="absolute top-3 left-3 rounded-full gap-1 shadow-md"
          >
            <Edit className="h-3.5 w-3.5" /> עריכה
          </Button>
        )}
      </div>

      {/* Header: avatar overlap */}
      <div className="px-6 -mt-16 md:-mt-20">
        <div className="flex flex-col items-center md:items-start md:flex-row md:gap-5">
          {d.profile_image_url ? (
            <img
              src={d.profile_image_url}
              alt={displayName}
              className="h-32 w-32 md:h-40 md:w-40 rounded-full object-cover border-4 border-card shadow-lg shrink-0"
            />
          ) : (
            <div className="h-32 w-32 md:h-40 md:w-40 rounded-full bg-gradient-to-br from-primary to-[hsl(var(--terracotta))] flex items-center justify-center text-cream text-5xl font-black border-4 border-card shadow-lg shrink-0">
              {displayName?.charAt(0)}
            </div>
          )}
          <div className="mt-4 md:mt-16 text-center md:text-right min-w-0">
            <p className="text-[11px] font-semibold text-primary uppercase tracking-[0.2em]">{subtitle}</p>
            <h2 className="text-3xl md:text-4xl font-black font-display mt-1 leading-tight">{displayName}</h2>
            {location && (
              <p className="text-sm text-muted-foreground flex items-center justify-center md:justify-start gap-1 mt-2">
                <MapPin className="h-3.5 w-3.5" /> {location}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* About */}
      {(d.about_me || d.about_us || d.description || d.job_description) && (
        <div className="px-6 mt-6">
          <p className="text-[15px] leading-relaxed whitespace-pre-wrap text-foreground/90">
            {d.about_me || d.about_us || d.description || d.job_description}
          </p>
        </div>
      )}

      {/* Tag sections (matchmaking) */}
      <div className="px-6 mt-6 space-y-5">
        <TagSection title="✨ תחביבים" items={d.hobbies} tone="primary" />
        <TagSection title="💛 אופי" items={d.personality_tags} tone="secondary" />
        <TagSection title="🕯️ אווירת שבת" items={d.shabbat_vibe} tone="muted" />
        <TagSection title="🗣️ שפות" items={d.languages} tone="muted" />
      </div>

      {/* Stats grid */}
      <div className="px-6 mt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-6 divide-y sm:divide-y-0 sm:divide-x divide-border/50">
        <div>
          <Stat icon={Briefcase} label="מקצוע" value={d.profession} />
          <Stat icon={GraduationCap} label="לימודים" value={d.education} />
          <Stat icon={Sparkles} label="רמה דתית" value={d.religious_level ? religiousLabels[d.religious_level] : null} />
          <Stat icon={Heart} label="כשרות" value={(d.kashrut_level || d.kashrut_preference) ? kashrutLabels[d.kashrut_level || d.kashrut_preference] : null} />
        </div>
        <div className="sm:pr-6">
          {profileType === "single" && (
            <Stat icon={Heart} label="העדפות תזונה" value={d.dietary_preference ? dietaryLabels[d.dietary_preference] : null} />
          )}
          {(profileType === "family" || profileType === "singles_group" || profileType === "reservist") && (
            <Stat icon={Heart} label="מי מוזמנים?" value={d.guest_preference ? genderLabels[d.guest_preference] : null} />
          )}
          {profileType === "work" && (
            <>
              <Stat icon={Briefcase} label="תשלום" value={d.payment} />
              <Stat icon={Heart} label="סוג העסקה" value={d.is_permanent ? "קבוע" : "זמני"} />
            </>
          )}
          {profileType === "volunteer" && (
            <Stat icon={Heart} label="סוג התנדבות" value={d.volunteer_type ? volunteerTypeLabels[d.volunteer_type] || d.volunteer_type : null} />
          )}
          {profileType === "singles_group" && (
            <Stat icon={Heart} label="טווח גילאים" value={(d.age_range_min || d.age_range_max) ? `${d.age_range_min || "?"}-${d.age_range_max || "?"}` : null} />
          )}
          {profileType === "organized_shabbat" && (
            <>
              <Stat icon={Heart} label="סוג השבת" value={d.shabbat_type} />
              <Stat icon={Heart} label="עלות" value={d.cost} />
            </>
          )}
        </div>
      </div>

      {/* Volunteer perks */}
      {profileType === "volunteer" && (d.provides_accommodation || d.provides_meals) && (
        <div className="px-6 mt-4 flex gap-2">
          {d.provides_accommodation && <Badge variant="secondary">🛏️ לינה</Badge>}
          {d.provides_meals && <Badge variant="secondary">🍽️ ארוחות</Badge>}
        </div>
      )}

      {/* Available dates */}
      {d.available_dates?.length > 0 && (
        <div className="px-6 mt-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-2">
            <Calendar className="h-3.5 w-3.5" /> תאריכים פנויים
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {d.available_dates.sort().map((date: string) => (
              <Badge key={date} variant="secondary" className="text-xs">
                {labelHebrewDate(date)}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Organized shabbat link */}
      {profileType === "organized_shabbat" && d.registration_link && (
        <div className="px-6 mt-4">
          <a
            href={d.registration_link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline"
          >
            🔗 קישור להרשמה
          </a>
        </div>
      )}

      <div className="h-6" />
    </div>
  );
};

export default ProfileView;
