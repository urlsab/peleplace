import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Edit2, XCircle, User, Phone, Mail, Shield, Home } from "lucide-react";

const statusConfig: Record<string, { label: string; icon: typeof XCircle; className: string }> = {
  rejected: { label: "נדחה", icon: XCircle, className: "bg-red-100 text-red-800 border-red-200" },
};

const userTypeLabels: Record<string, string> = {
  single: "רווק/ה מחפש/ת",
  host: "מארח/ת",
  both: "רווק/ה + מארח/ת",
};

const hostSubTypeLabels: Record<string, string> = {
  family: "משפחה",
  volunteer: "התנדבות",
  volunteer_farm: "חוות מתנדבים",
  organized_shabbat: "שבת מאורגנת בתשלום",
  work: "מקום עבודה",
  singles_group: "חבורת רווקים/ות",
  // host_ prefixed (from Auth.tsx registration flow)
  host_family: "משפחה",
  host_volunteer: "התנדבות",
  host_volunteer_farm: "חוות מתנדבים",
  host_organized_shabbat: "שבת מאורגנת בתשלום",
  host_work: "מקום עבודה",
  host_singles_group: "חבורת רווקים/ות",
  host_reservist: "אשת מילואים",
};

interface PersonalInfoCardProps {
  profile: any;
  onProfileUpdated: (updated: any) => void;
  hostSubType?: string | null;
}

const InfoRow = ({
  icon: Icon,
  label,
  value,
  dir,
}: {
  icon: typeof User;
  label: string;
  value?: string | null;
  dir?: string;
}) => (
  <div className="flex items-center gap-3 py-1.5">
    <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
    <span className="text-sm text-muted-foreground w-28 shrink-0">{label}</span>
    <span className="text-sm font-semibold" dir={dir}>
      {value || <span className="text-muted-foreground/60 font-normal">—</span>}
    </span>
  </div>
);

const PersonalInfoCard = ({ profile, onProfileUpdated, hostSubType }: PersonalInfoCardProps) => {
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    full_name: profile.full_name || "",
    phone: profile.phone || "",
    recommender_name: profile.recommender_name || "",
    recommender_phone: profile.recommender_phone || "",
  });

  const status = statusConfig[profile.registration_status];
  const StatusIcon = status?.icon;

  const handleSave = async () => {
    if (!form.full_name.trim()) {
      toast({ title: "שם מלא הוא שדה חובה", variant: "destructive" });
      return;
    }
    setSaving(true);
    const { data, error } = await supabase
      .from("profiles")
      .update({
        full_name: form.full_name.trim(),
        phone: form.phone.trim() || null,
        recommender_name: form.recommender_name.trim(),
        recommender_phone: form.recommender_phone.trim(),
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", profile.user_id)
      .select()
      .single();

    if (error) {
      toast({ title: "שגיאה בשמירה", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "הפרטים עודכנו! ✨" });
      onProfileUpdated(data);
      setEditing(false);
    }
    setSaving(false);
  };

  const handleCancel = () => {
    setForm({
      full_name: profile.full_name || "",
      phone: profile.phone || "",
      recommender_name: profile.recommender_name || "",
      recommender_phone: profile.recommender_phone || "",
    });
    setEditing(false);
  };

  return (
    <div className="rounded-2xl border border-border bg-card shadow-card p-6 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-black font-display">פרטים אישיים</h2>
        <div className="flex items-center gap-2">
          {status && StatusIcon && (
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${status.className}`}>
              <StatusIcon className="h-3 w-3" />
              {status.label}
            </span>
          )}
          {!editing && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditing(true)}
              className="rounded-full gap-1.5 h-8"
            >
              <Edit2 className="h-3.5 w-3.5" />
              ערוך
            </Button>
          )}
        </div>
      </div>

      {editing ? (
        /* ───── Edit mode ───── */
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pi_full_name">שם מלא *</Label>
            <Input
              id="pi_full_name"
              value={form.full_name}
              onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
              placeholder="ישראל ישראלי"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pi_phone">מספר טלפון</Label>
            <Input
              id="pi_phone"
              dir="ltr"
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              placeholder="050-1234567"
            />
          </div>

          <div className="rounded-xl border border-border bg-accent/30 p-4 space-y-3">
            <h4 className="font-bold text-sm">פרטי ממליץ/ה</h4>
            <p className="text-xs text-muted-foreground">
              איש קשר שמכיר אותך ויכול לאשר את פרטיך
            </p>
            <div className="space-y-2">
              <Label htmlFor="pi_rec_name">שם הממליץ/ה</Label>
              <Input
                id="pi_rec_name"
                value={form.recommender_name}
                onChange={(e) => setForm((f) => ({ ...f, recommender_name: e.target.value }))}
                placeholder="שם מלא"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pi_rec_phone">טלפון הממליץ/ה</Label>
              <Input
                id="pi_rec_phone"
                dir="ltr"
                value={form.recommender_phone}
                onChange={(e) => setForm((f) => ({ ...f, recommender_phone: e.target.value }))}
                placeholder="050-9876543"
              />
            </div>
          </div>

          {/* Read-only info */}
          <div className="rounded-xl border border-border/50 bg-muted/30 p-4 space-y-1">
            <p className="text-xs text-muted-foreground font-semibold mb-2">שדות לא ניתנים לשינוי</p>
            <InfoRow icon={Mail} label="אימייל" value={profile.email} dir="ltr" />
            <InfoRow icon={Shield} label="סוג הרשמה" value={userTypeLabels[profile.user_type]} />
            {hostSubType && (
              <InfoRow icon={Home} label="סוג מארח" value={hostSubTypeLabels[hostSubType] ?? hostSubType} />
            )}
          </div>

          <div className="flex gap-2 pt-1">
            <Button onClick={handleSave} disabled={saving} className="rounded-full flex-1 font-bold">
              {saving ? "שומר..." : "שמירת שינויים"}
            </Button>
            <Button variant="outline" onClick={handleCancel} className="rounded-full" disabled={saving}>
              ביטול
            </Button>
          </div>
        </div>
      ) : (
        /* ───── View mode ───── */
        <div className="space-y-1 divide-y divide-border/40">
          <InfoRow icon={User} label="שם מלא" value={profile.full_name} />
          <InfoRow icon={Mail} label="אימייל" value={profile.email} dir="ltr" />
          <InfoRow icon={Phone} label="טלפון" value={profile.phone} dir="ltr" />
          <InfoRow icon={Shield} label="סוג הרשמה" value={userTypeLabels[profile.user_type]} />
          {hostSubType && (
            <InfoRow icon={Home} label="סוג מארח" value={hostSubTypeLabels[hostSubType] ?? hostSubType} />
          )}

          <div className="pt-3 mt-3">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
              ממליץ/ה
            </p>
            <div className="space-y-1">
              <InfoRow icon={User} label="שם" value={profile.recommender_name} />
              <InfoRow icon={Phone} label="טלפון" value={profile.recommender_phone} dir="ltr" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalInfoCard;
