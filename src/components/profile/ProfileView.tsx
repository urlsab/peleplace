import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, MapPin, Heart, Star, Users, Utensils } from "lucide-react";

const regionLabels: Record<string, string> = {
  north: "צפון", haifa: "חיפה", sharon: "שרון", center: "מרכז",
  tel_aviv: "תל אביב", jerusalem: "ירושלים", shfela: "שפלה",
  south: "דרום", judea_samaria: "יהודה ושומרון",
};

const religiousLabels: Record<string, string> = {
  secular: "חילוני", traditional: "מסורתי", religious: "דתי",
  ultra_orthodox: "חרדי", other: "אחר",
};

const genderLabels: Record<string, string> = {
  men: "גברים", women: "נשים", mixed: "מעורב",
};

const kashrutLabels: Record<string, string> = {
  not_kosher: "לא כשר", kosher: "כשר", mehadrin: "כשר למהדרין", chalak_beit_yosef: "חלק/בית יוסף",
};

const volunteerTypeLabels: Record<string, string> = {
  farm: "חווה", children_home: "בית ילד", chabad: "בית חב״ד",
  elderly: "בית אבות", military_families: "משפחות מילואים", other: "אחר",
};

interface ProfileViewProps {
  profile: any;
  detailedProfile: any;
  profileType: "single" | "family" | "work" | "volunteer";
  onEdit: () => void;
}

const InfoRow = ({ label, value }: { label: string; value?: string | null }) => {
  if (!value) return null;
  return (
    <div className="flex justify-between items-center py-2 border-b border-border/50 last:border-0">
      <span className="text-muted-foreground text-sm">{label}</span>
      <span className="font-medium text-sm">{value}</span>
    </div>
  );
};

const ProfileView = ({ profile, detailedProfile, profileType, onEdit }: ProfileViewProps) => {
  if (!detailedProfile) {
    return (
      <div className="text-center space-y-4 rounded-2xl border border-border bg-card p-8 shadow-card">
        <p className="text-muted-foreground">עדיין לא מילאת פרופיל מפורט</p>
        <Button onClick={onEdit} className="rounded-full">
          <Edit className="h-4 w-4 ml-2" /> בניית פרופיל
        </Button>
      </div>
    );
  }

  const d = detailedProfile;
  const location = [d.city, d.region ? regionLabels[d.region] : null].filter(Boolean).join(", ");

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-1">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-black font-display">{profile.full_name}</h2>
            {location && (
              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                <MapPin className="h-3.5 w-3.5" /> {location}
              </p>
            )}
          </div>
          <Button variant="outline" size="sm" onClick={onEdit} className="rounded-full gap-1">
            <Edit className="h-3.5 w-3.5" /> עריכה
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
        {profileType === "single" && (
          <div className="space-y-1">
            <h3 className="font-bold font-display mb-3">🙋 פרופיל רווק/ה</h3>
            <InfoRow label="גיל" value={d.age?.toString()} />
            <InfoRow label="מגדר" value={d.gender ? genderLabels[d.gender] || d.gender : null} />
            <InfoRow label="רמה דתית" value={d.religious_level ? religiousLabels[d.religious_level] : null} />
            {d.about_me && (
              <div className="pt-3">
                <p className="text-sm text-muted-foreground mb-1">קצת עלי:</p>
                <p className="text-sm whitespace-pre-wrap">{d.about_me}</p>
              </div>
            )}
          </div>
        )}

        {profileType === "family" && (
          <div className="space-y-1">
            <h3 className="font-bold font-display mb-3">🏡 משפחה מארחת</h3>
            <InfoRow label="רמה דתית" value={d.religious_level ? religiousLabels[d.religious_level] : null} />
            <InfoRow label="כשרות" value={d.kashrut_level ? kashrutLabels[d.kashrut_level] : null} />
            <InfoRow label="מעוניינים להזמין" value={d.guest_preference ? genderLabels[d.guest_preference] : null} />
            {d.about_us && (
              <div className="pt-3">
                <p className="text-sm text-muted-foreground mb-1">קצת עלינו:</p>
                <p className="text-sm whitespace-pre-wrap">{d.about_us}</p>
              </div>
            )}
            {d.available_dates?.length > 0 && (
              <div className="pt-3">
                <p className="text-sm text-muted-foreground mb-2">תאריכים פנויים:</p>
                <div className="flex flex-wrap gap-1">
                  {d.available_dates.sort().map((date: string) => (
                    <Badge key={date} variant="secondary" className="text-xs">
                      {new Date(date + "T00:00:00").toLocaleDateString("he-IL", { day: "numeric", month: "short" })}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {profileType === "work" && (
          <div className="space-y-1">
            <h3 className="font-bold font-display mb-3">💼 {d.place_name}</h3>
            <InfoRow label="תיאור" value={d.job_description} />
            <InfoRow label="תשלום" value={d.payment} />
            <InfoRow label="סוג" value={d.is_permanent ? "קבוע" : "זמני"} />
            <InfoRow label="העדפת מגדר" value={d.gender_preference ? genderLabels[d.gender_preference] : null} />
            <InfoRow label="גודל צוות" value={d.team_size?.toString()} />
            <InfoRow label="דרישות" value={d.special_requirements} />
          </div>
        )}

        {profileType === "volunteer" && (
          <div className="space-y-1">
            <h3 className="font-bold font-display mb-3">🤝 {d.place_name}</h3>
            <InfoRow label="סוג התנדבות" value={d.volunteer_type ? volunteerTypeLabels[d.volunteer_type] || d.volunteer_type : null} />
            <InfoRow label="דרישות" value={d.special_requirements} />
            <div className="flex gap-2 pt-2">
              {d.provides_accommodation && <Badge variant="secondary">🛏️ לינה</Badge>}
              {d.provides_meals && <Badge variant="secondary">🍽️ ארוחות</Badge>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileView;
