import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Heart, Clock, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";

const regionLabels: Record<string, string> = {
  north: "צפון", haifa: "חיפה", sharon: "שרון", center: "מרכז",
  tel_aviv: "תל אביב", jerusalem: "ירושלים", shfela: "שפלה",
  south: "דרום", judea_samaria: "יהודה ושומרון",
};

const religiousLabels: Record<string, string> = {
  secular: "חילוני", traditional: "מסורתי", religious: "דתי",
  ultra_orthodox: "חרדי", other: "אחר",
};

type HostType = "family" | "work" | "volunteer" | null;

const Profile = () => {
  const { user, profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [hostType, setHostType] = useState<HostType>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading]);

  if (authLoading) return <div className="min-h-screen flex items-center justify-center">טוען...</div>;
  if (!user) return null;

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 text-center px-4">
          <h1 className="text-2xl font-black font-display mb-4">עדיין לא נרשמת</h1>
          <p className="text-muted-foreground mb-6">צריך למלא את טופס ההרשמה קודם</p>
          <Button onClick={() => navigate("/register")} className="rounded-full">להרשמה</Button>
        </div>
      </div>
    );
  }

  if (profile.registration_status === "pending") {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 text-center px-4">
          <Clock className="mx-auto h-16 w-16 text-amber-soft mb-4" />
          <h1 className="text-2xl font-black font-display mb-2">ההרשמה שלך בבדיקה</h1>
          <p className="text-muted-foreground">נבדוק את הפרטים ונחזור אליך בהקדם 🙏</p>
        </div>
      </div>
    );
  }

  if (profile.registration_status === "rejected") {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 text-center px-4">
          <XCircle className="mx-auto h-16 w-16 text-destructive mb-4" />
          <h1 className="text-2xl font-black font-display mb-2">ההרשמה לא אושרה</h1>
          <p className="text-muted-foreground">פנו אלינו לפרטים נוספים</p>
        </div>
      </div>
    );
  }

  // Approved - show profile form
  const isSingle = profile.user_type === "single";

  const handleSingleProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const form = new FormData(e.currentTarget);

    const data = {
      user_id: user.id,
      age: parseInt(form.get("age") as string) || null,
      gender: form.get("gender") as any || null,
      religious_level: form.get("religiousLevel") as any || null,
      region: form.get("region") as any || null,
      city: form.get("city") as string || null,
      about_me: form.get("aboutMe") as string || null,
    };

    const { error } = await supabase.from("single_profiles").upsert(data, { onConflict: "user_id" });

    if (error) {
      toast({ title: "שגיאה", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "הפרופיל נשמר! ✨" });
    }
    setSaving(false);
  };

  const handleFamilyProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const form = new FormData(e.currentTarget);

    const data = {
      user_id: user.id,
      about_us: form.get("aboutUs") as string || null,
      religious_level: form.get("religiousLevel") as any || null,
      guest_preference: form.get("guestPref") as any || null,
      region: form.get("region") as any || null,
      city: form.get("city") as string || null,
    };

    const { error } = await supabase.from("host_family_profiles").upsert(data, { onConflict: "user_id" });

    if (error) {
      toast({ title: "שגיאה", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "הפרופיל נשמר! ✨" });
    }
    setSaving(false);
  };

  const handleWorkProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const form = new FormData(e.currentTarget);

    const data = {
      user_id: user.id,
      place_name: form.get("placeName") as string,
      region: form.get("region") as any || null,
      city: form.get("city") as string || null,
      job_description: form.get("jobDescription") as string || null,
      payment: form.get("payment") as string || null,
      is_permanent: form.get("isPermanent") === "true",
      gender_preference: form.get("genderPref") as any || null,
      team_size: parseInt(form.get("teamSize") as string) || null,
      special_requirements: form.get("specialReq") as string || null,
    };

    const { error } = await supabase.from("host_work_profiles").upsert(data, { onConflict: "user_id" });

    if (error) {
      toast({ title: "שגיאה", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "הפרופיל נשמר! ✨" });
    }
    setSaving(false);
  };

  const handleVolunteerProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const form = new FormData(e.currentTarget);

    const data = {
      user_id: user.id,
      place_name: form.get("placeName") as string,
      volunteer_type: form.get("volunteerType") as string || null,
      region: form.get("region") as any || null,
      city: form.get("city") as string || null,
      special_requirements: form.get("specialReq") as string || null,
      provides_accommodation: form.get("accommodation") === "on",
      provides_meals: form.get("meals") === "on",
    };

    const { error } = await supabase.from("host_volunteer_profiles").upsert(data, { onConflict: "user_id" });

    if (error) {
      toast({ title: "שגיאה", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "הפרופיל נשמר! ✨" });
    }
    setSaving(false);
  };

  const RegionSelect = ({ name }: { name: string }) => (
    <Select name={name}>
      <SelectTrigger><SelectValue placeholder="בחרו אזור" /></SelectTrigger>
      <SelectContent>
        {Object.entries(regionLabels).map(([value, label]) => (
          <SelectItem key={value} value={value}>{label}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  const ReligiousSelect = ({ name }: { name: string }) => (
    <Select name={name}>
      <SelectTrigger><SelectValue placeholder="בחרו רמה" /></SelectTrigger>
      <SelectContent>
        {Object.entries(religiousLabels).map(([value, label]) => (
          <SelectItem key={value} value={value}>{label}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-12 px-4">
        <div className="mx-auto max-w-lg">
          <div className="text-center mb-8">
            <CheckCircle className="mx-auto h-12 w-12 text-secondary mb-3" />
            <h1 className="text-3xl font-black font-display">בניית הפרופיל</h1>
            <p className="text-muted-foreground mt-1">שלום {profile.full_name}! 👋 מלאו את הפרטים הנוספים</p>
          </div>

          {isSingle ? (
            <form onSubmit={handleSingleProfile} className="space-y-5 rounded-2xl border border-border bg-card p-8 shadow-card">
              <h2 className="text-xl font-bold font-display text-center">🙋 פרופיל רווק/ה</h2>

              <div className="space-y-2">
                <Label htmlFor="age">גיל</Label>
                <Input id="age" name="age" type="number" min={18} max={99} placeholder="25" />
              </div>

              <div className="space-y-2">
                <Label>מגדר</Label>
                <RadioGroup name="gender" className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <RadioGroupItem value="men" /><span>גבר</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <RadioGroupItem value="women" /><span>אישה</span>
                  </label>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label>רמה דתית</Label>
                <ReligiousSelect name="religiousLevel" />
              </div>

              <div className="space-y-2">
                <Label>אזור מגורים</Label>
                <RegionSelect name="region" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">עיר / יישוב</Label>
                <Input id="city" name="city" placeholder="תל אביב" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="aboutMe">קצת עלי</Label>
                <Textarea id="aboutMe" name="aboutMe" placeholder="ספרו קצת על עצמכם..." className="min-h-[100px]" />
              </div>

              <Button type="submit" className="w-full rounded-full font-bold" size="lg" disabled={saving}>
                {saving ? "שומר..." : "שמירת פרופיל"}
              </Button>
            </form>
          ) : (
            <>
              {!hostType ? (
                <div className="space-y-4 rounded-2xl border border-border bg-card p-8 shadow-card">
                  <h2 className="text-xl font-bold font-display text-center">🏠 בחרו סוג מארח</h2>
                  {([
                    { type: "family" as const, label: "משפחה מארחת", desc: "פתיחת הבית לאורחים בשבת/חג" },
                    { type: "work" as const, label: "מקום עבודה", desc: "הצעת עבודה זמנית או קבועה" },
                    { type: "volunteer" as const, label: "מקום התנדבות", desc: "חווה, בית ילד, בית חב״ד ועוד" },
                  ]).map((opt) => (
                    <button
                      key={opt.type}
                      onClick={() => setHostType(opt.type)}
                      className="flex w-full items-center gap-4 rounded-2xl border-2 border-border bg-background p-4 text-right transition-all hover:border-primary hover:shadow-md"
                    >
                      <div>
                        <div className="font-bold font-display">{opt.label}</div>
                        <div className="text-sm text-muted-foreground">{opt.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : hostType === "family" ? (
                <form onSubmit={handleFamilyProfile} className="space-y-5 rounded-2xl border border-border bg-card p-8 shadow-card">
                  <button type="button" onClick={() => setHostType(null)} className="text-sm text-primary hover:underline">← חזרה</button>
                  <h2 className="text-xl font-bold font-display text-center">🏡 משפחה מארחת</h2>

                  <div className="space-y-2">
                    <Label htmlFor="aboutUs">קצת עלינו</Label>
                    <Textarea id="aboutUs" name="aboutUs" placeholder="ספרו קצת על המשפחה..." className="min-h-[100px]" />
                  </div>

                  <div className="space-y-2">
                    <Label>רמה דתית</Label>
                    <ReligiousSelect name="religiousLevel" />
                  </div>

                  <div className="space-y-2">
                    <Label>את מי מעוניינים להזמין?</Label>
                    <RadioGroup name="guestPref" className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer"><RadioGroupItem value="men" /><span>גברים</span></label>
                      <label className="flex items-center gap-2 cursor-pointer"><RadioGroupItem value="women" /><span>נשים</span></label>
                      <label className="flex items-center gap-2 cursor-pointer"><RadioGroupItem value="mixed" /><span>מעורב</span></label>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label>אזור מגורים</Label>
                    <RegionSelect name="region" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">עיר / יישוב</Label>
                    <Input id="city" name="city" placeholder="הרצליה" />
                  </div>

                  <Button type="submit" className="w-full rounded-full font-bold" size="lg" disabled={saving}>
                    {saving ? "שומר..." : "שמירת פרופיל"}
                  </Button>
                </form>
              ) : hostType === "work" ? (
                <form onSubmit={handleWorkProfile} className="space-y-5 rounded-2xl border border-border bg-card p-8 shadow-card">
                  <button type="button" onClick={() => setHostType(null)} className="text-sm text-primary hover:underline">← חזרה</button>
                  <h2 className="text-xl font-bold font-display text-center">💼 מקום עבודה</h2>

                  <div className="space-y-2">
                    <Label htmlFor="placeName">שם המקום *</Label>
                    <Input id="placeName" name="placeName" required placeholder='מלון רמת רחל' />
                  </div>

                  <div className="space-y-2">
                    <Label>אזור</Label>
                    <RegionSelect name="region" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">עיר / מיקום</Label>
                    <Input id="city" name="city" placeholder="ירושלים" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="jobDescription">מה העבודה?</Label>
                    <Textarea id="jobDescription" name="jobDescription" placeholder="תיאור המשרה..." />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="payment">תשלום</Label>
                    <Input id="payment" name="payment" placeholder="150 ₪ לשעה" />
                  </div>

                  <div className="space-y-2">
                    <Label>סוג העסקה</Label>
                    <RadioGroup name="isPermanent" className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer"><RadioGroupItem value="false" /><span>זמני / חד פעמי</span></label>
                      <label className="flex items-center gap-2 cursor-pointer"><RadioGroupItem value="true" /><span>עובד/ת קבוע/ה</span></label>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label>העדפת מגדר</Label>
                    <RadioGroup name="genderPref" className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer"><RadioGroupItem value="men" /><span>גברים</span></label>
                      <label className="flex items-center gap-2 cursor-pointer"><RadioGroupItem value="women" /><span>נשים</span></label>
                      <label className="flex items-center gap-2 cursor-pointer"><RadioGroupItem value="mixed" /><span>מעורב</span></label>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="teamSize">מספר אנשי צוות נדרשים</Label>
                    <Input id="teamSize" name="teamSize" type="number" min={1} placeholder="3" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="specialReq">דרישות מיוחדות</Label>
                    <Textarea id="specialReq" name="specialReq" placeholder="תואר, רישיון לנשק, ניסיון..." />
                  </div>

                  <Button type="submit" className="w-full rounded-full font-bold" size="lg" disabled={saving}>
                    {saving ? "שומר..." : "שמירת פרופיל"}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleVolunteerProfile} className="space-y-5 rounded-2xl border border-border bg-card p-8 shadow-card">
                  <button type="button" onClick={() => setHostType(null)} className="text-sm text-primary hover:underline">← חזרה</button>
                  <h2 className="text-xl font-bold font-display text-center">🤝 מקום התנדבות</h2>

                  <div className="space-y-2">
                    <Label htmlFor="placeName">שם המקום *</Label>
                    <Input id="placeName" name="placeName" required placeholder='בית חב"ד הרצליה' />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="volunteerType">סוג ההתנדבות</Label>
                    <Select name="volunteerType">
                      <SelectTrigger><SelectValue placeholder="בחרו סוג" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="farm">חווה</SelectItem>
                        <SelectItem value="children_home">בית ילד</SelectItem>
                        <SelectItem value="chabad">בית חב״ד</SelectItem>
                        <SelectItem value="elderly">בית אבות</SelectItem>
                        <SelectItem value="military_families">משפחות מילואים</SelectItem>
                        <SelectItem value="other">אחר</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>אזור</Label>
                    <RegionSelect name="region" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">עיר / מיקום</Label>
                    <Input id="city" name="city" placeholder="כפר חב״ד" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="specialReq">דרישות מיוחדות</Label>
                    <Textarea id="specialReq" name="specialReq" placeholder="כושר פיזי, ניסיון עם ילדים..." />
                  </div>

                  <div className="space-y-3 rounded-xl border border-border bg-background p-4">
                    <h4 className="font-bold text-sm">מה כלול?</h4>
                    <div className="flex items-center gap-2">
                      <Checkbox id="accommodation" name="accommodation" />
                      <Label htmlFor="accommodation" className="cursor-pointer">מקום לינה</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="meals" name="meals" />
                      <Label htmlFor="meals" className="cursor-pointer">ארוחות</Label>
                    </div>
                  </div>

                  <Button type="submit" className="w-full rounded-full font-bold" size="lg" disabled={saving}>
                    {saving ? "שומר..." : "שמירת פרופיל"}
                  </Button>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
