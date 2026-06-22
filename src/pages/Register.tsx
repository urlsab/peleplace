import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { UserRound, Building2, Heart, CheckCircle2, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Category = "single" | "host" | "both" | null;
type HostSubType = "family" | "work" | "volunteer" | "singles_group" | "organized_shabbat" | null;
type Step = "type" | "hosttype" | "form";

const regionLabels: Record<string, string> = {
  north: "צפון", haifa: "חיפה", sharon: "שרון", center: "מרכז",
  tel_aviv: "תל אביב", jerusalem: "ירושלים", shfela: "שפלה",
  south: "דרום", judea_samaria: "יהודה ושומרון",
};
const religiousLabels: Record<string, string> = {
  secular: "חילוני", traditional: "מסורתי", religious: "דתי",
  ultra_orthodox: "חרדי", other: "אחר",
};
const kashrutLabels: Record<string, string> = {
  not_kosher: "לא כשר", kosher: "כשר", mehadrin: "כשר למהדרין", chalak_beit_yosef: "חלק/בית יוסף",
};
const dietaryLabels: Record<string, string> = {
  regular: "רגיל", vegetarian: "צמחוני", vegan: "טבעוני",
  gluten_free: "ללא גלוטן", other: "אחר",
};

const Register = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [step, setStep] = useState<Step>("type");
  const [category, setCategory] = useState<Category>(null);
  const [hostSubType, setHostSubType] = useState<HostSubType>(null);
  const [loading, setLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [birthYear, setBirthYear] = useState("");
  const [gender, setGender] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Shared profile fields
  const [religiousLevel, setReligiousLevel] = useState("");
  const [region, setRegion] = useState("");
  const [kashrutPref, setKashrutPref] = useState("");
  const [dietaryPref, setDietaryPref] = useState("");
  // Host-specific
  const [guestPref, setGuestPref] = useState("");
  const [kashrutLevel, setKashrutLevel] = useState("");
  const [isPermanent, setIsPermanent] = useState("false");
  const [genderPref, setGenderPref] = useState("");
  const [volunteerType, setVolunteerType] = useState("");
  const [shabbatType, setShabbatType] = useState("");
  const [accommodation, setAccommodation] = useState(false);
  const [meals, setMeals] = useState(false);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1940 - 16 }, (_, i) => currentYear - 17 - i);

  const handleTypeSelect = (type: "single" | "host" | "both") => {
    setCategory(type);
    if (type === "single") setStep("form");
    else setStep("hosttype");
  };

  const handleHostTypeSelect = (sub: HostSubType) => {
    setHostSubType(sub);
    setStep("form");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user || !category || !birthYear || !gender) return;

    setLoading(true);
    const form = new FormData(e.currentTarget);

    try {
      // 1. Create base profile
      const { error: profileError } = await supabase.from("profiles").insert({
        user_id: user.id,
        full_name: form.get("fullName") as string,
        email: form.get("email") as string,
        phone: form.get("phone") as string,
        user_type: category as any,
        recommender_name: (form.get("refName") as string) || null,
        recommender_phone: (form.get("refPhone") as string) || null,
        terms_accepted_at: new Date().toISOString(),
        date_of_birth: birthYear ? `${birthYear}-01-01` : null,
        registration_status: "approved",
        gender,
      } as any);
      if (profileError) throw profileError;

      // 2. Create single profile (for single or both)
      if (category === "single" || category === "both") {
        const { error } = await supabase.from("single_profiles").insert({
          user_id: user.id,
          gender: gender as any || null,
          age: birthYear ? currentYear - parseInt(birthYear) : null,
          religious_level: religiousLevel as any || null,
          region: region as any || null,
          city: (form.get("city") as string) || null,
          kashrut_preference: kashrutPref as any || null,
          dietary_preference: dietaryPref as any || null,
          about_me: (form.get("aboutMe") as string) || null,
        });
        if (error) throw error;
      }

      // 3. Create host profile (for host or both)
      if ((category === "host" || category === "both") && hostSubType) {
        if (hostSubType === "family") {
          await supabase.from("host_family_profiles").insert({
            user_id: user.id,
            about_us: (form.get("aboutUs") as string) || null,
            religious_level: religiousLevel as any || null,
            kashrut_level: kashrutLevel as any || null,
            guest_preference: guestPref as any || null,
            region: region as any || null,
            city: (form.get("city") as string) || null,
          }).throwOnError();
        } else if (hostSubType === "work") {
          await supabase.from("host_work_profiles").insert({
            user_id: user.id,
            place_name: form.get("placeName") as string,
            region: region as any || null,
            city: (form.get("city") as string) || null,
            job_description: (form.get("jobDescription") as string) || null,
            payment: (form.get("payment") as string) || null,
            is_permanent: isPermanent === "true",
            gender_preference: genderPref as any || null,
            team_size: parseInt(form.get("teamSize") as string) || null,
            special_requirements: (form.get("specialReq") as string) || null,
          }).throwOnError();
        } else if (hostSubType === "volunteer") {
          await supabase.from("host_volunteer_profiles").insert({
            user_id: user.id,
            place_name: form.get("placeName") as string,
            volunteer_type: volunteerType || null,
            region: region as any || null,
            city: (form.get("city") as string) || null,
            special_requirements: (form.get("specialReq") as string) || null,
            provides_accommodation: accommodation,
            provides_meals: meals,
          }).throwOnError();
        } else if (hostSubType === "singles_group") {
          await supabase.from("host_singles_group_profiles").insert({
            user_id: user.id,
            group_name: form.get("groupName") as string,
            description: (form.get("description") as string) || null,
            religious_level: religiousLevel as any || null,
            region: region as any || null,
            city: (form.get("city") as string) || null,
            group_size: parseInt(form.get("groupSize") as string) || null,
            guest_preference: guestPref as any || null,
            age_range_min: parseInt(form.get("ageMin") as string) || null,
            age_range_max: parseInt(form.get("ageMax") as string) || null,
          }).throwOnError();
        } else if (hostSubType === "organized_shabbat") {
          await supabase.from("host_organized_shabbat_profiles").insert({
            user_id: user.id,
            organization_name: form.get("orgName") as string,
            shabbat_type: shabbatType || null,
            description: (form.get("description") as string) || null,
            religious_level: religiousLevel as any || null,
            region: region as any || null,
            city: (form.get("city") as string) || null,
            cost: (form.get("cost") as string) || null,
            registration_link: (form.get("regLink") as string) || null,
            target_audience: (form.get("targetAudience") as string) || null,
          }).throwOnError();
        }
      }

      setSubmitted(true);
      setTimeout(() => navigate("/profile"), 3000);
    } catch (error: any) {
      toast({
        title: "שגיאה",
        description: error.message || "משהו השתבש, נסו שוב",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    navigate("/auth");
    return null;
  }

  // Success page after registration
  if (submitted) {
  return (
    <div className="min-h-screen bg-background pattern-dots flex items-center justify-center px-4">
      <div className="mx-auto max-w-md text-center space-y-6">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <CheckCircle2 className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-3xl font-black font-display">ההרשמה הושלמה בהצלחה! 🎉</h1>
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-4 text-right">
          <p className="text-foreground leading-relaxed font-bold">
            📧 אשרו את כתובת המייל שלכם
          </p>
          <p className="text-muted-foreground text-sm leading-relaxed">
            שלחנו אליכם מייל אימות לכתובת <span className="font-bold text-foreground">{user?.email}</span>.
            <br />
            לחצו על הקישור במייל כדי לאשר את החשבון ולהתחיל להשתמש באתר.
          </p>
          <p className="text-muted-foreground text-sm">
            לא קיבלתם מייל? בדקו את תיקיית הספאם.
          </p>
        </div>
        <Button
          onClick={() => navigate("/profile")}
          className="rounded-full px-8"
        >
          לעמוד הפרופיל שלי
        </Button>
        <Button
          onClick={() => navigate("/")}
          variant="outline"
          className="rounded-full px-8"
        >
          חזרה לעמוד הראשי
        </Button>
      </div>
    </div>
  );
}

  return (
    <div className="min-h-screen bg-background pattern-dots py-12 px-4">
      <div className="mx-auto max-w-lg">
        <div className="text-center mb-8">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
            <Heart className="h-6 w-6 text-primary-foreground" fill="hsl(var(--primary-foreground))" />
          </div>
          <h1 className="mt-4 text-3xl font-black font-display">הרשמה לפל״א</h1>
          <p className="mt-1 text-muted-foreground">מלאו את הפרטים כדי להצטרף לקהילה</p>
        </div>

        {step === "type" ? (
          <div className="space-y-4 rounded-2xl border border-border bg-card p-8 shadow-card">
            <p className="text-center text-lg font-bold font-display">איך תרצו להירשם?</p>
            <button
              onClick={() => handleTypeSelect("single")}
              className="flex w-full items-center gap-4 rounded-2xl border-2 border-border bg-background p-5 text-right transition-all hover:border-primary hover:shadow-md"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <UserRound className="h-6 w-6" />
              </div>
              <div>
                <div className="font-bold font-display text-lg">רווק / רווקה</div>
                <div className="text-sm text-muted-foreground">מחפש/ת מקום לשבת או לחג</div>
              </div>
            </button>
            <button
              onClick={() => handleTypeSelect("host")}
              className="flex w-full items-center gap-4 rounded-2xl border-2 border-border bg-background p-5 text-right transition-all hover:border-secondary hover:shadow-md"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
                <Building2 className="h-6 w-6" />
              </div>
              <div>
                <div className="font-bold font-display text-lg">מקום מארח</div>
                <div className="text-sm text-muted-foreground">אירוח לשבת/חג, עבודה או התנדבות</div>
              </div>
            </button>
            <button
              onClick={() => handleTypeSelect("both")}
              className="flex w-full items-center gap-4 rounded-2xl border-2 border-border bg-background p-5 text-right transition-all hover:border-[hsl(var(--olive))] hover:shadow-md"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[hsl(var(--olive))] text-cream">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <div className="font-bold font-display text-lg">רווק/ה + מארח/ת</div>
                <div className="text-sm text-muted-foreground">רוצה/ת גם לארח וגם להתארח לפעמים</div>
              </div>
            </button>
          </div>
        ) : step === "hosttype" ? (
          <div className="space-y-4 rounded-2xl border border-border bg-card p-8 shadow-card">
            <button type="button" onClick={() => setStep("type")} className="text-sm text-primary hover:underline">← חזרה</button>
            <p className="text-center text-lg font-bold font-display">איזה סוג אירוח?</p>
            {([
              { type: "family" as const, label: "🏡 משפחה מארחת", desc: "פתיחת הבית לאורחים בשבת/חג" },
              { type: "singles_group" as const, label: "\u2728 חבורת רווקים/ות", desc: "חבורה שמתארגנת שבת ורוצה לקלוט עוד" },
              { type: "organized_shabbat" as const, label: "\ud83d\udcc5 שבת מאורגנת", desc: "סמינר ערכים, שבת שידוכים, ארגון" },
              { type: "work" as const, label: "\ud83d\udcbc מקום עבודה", desc: "הצעת עבודה זמנית או קבועה" },
              { type: "volunteer" as const, label: "\ud83e\udd1d מקום התנדבות", desc: "חווה, בית ילד, בית חב\u05d3 ועוד" },
            ]).map((opt) => (
              <button key={opt.type} onClick={() => handleHostTypeSelect(opt.type)}
                className="flex w-full items-center gap-4 rounded-2xl border-2 border-border bg-background p-4 text-right transition-all hover:border-primary hover:shadow-md">
                <div>
                  <div className="font-bold font-display">{opt.label}</div>
                  <div className="text-sm text-foreground/75">{opt.desc}</div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-border bg-card p-8 shadow-card">
            <button
              type="button"
              onClick={() => { setStep(category === "single" ? "type" : "hosttype"); }}
              className="text-sm text-primary hover:underline"
            >
              ← חזרה
            </button>

            <div className="rounded-xl bg-accent/60 px-4 py-2.5 text-center text-sm font-medium">
              {category === "single" && "🙋 הרשמה כרווק/ה"}
              {category === "host" && `🏠 הרשמה כמארח/ת`}
              {category === "both" && "🙋🏠 הרשמה כרווק/ה + מארח/ת"}
            </div>

            {/* ─── פרטים אישיים ─── */}
            <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">פרטים אישיים</h3>
            <div className="space-y-2">
              <Label htmlFor="fullName">שם ומשפחה *</Label>
              <Input id="fullName" name="fullName" required placeholder="ישראל ישראלי" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">אימייל *</Label>
              <Input id="email" name="email" type="email" required placeholder="israel@email.com" dir="ltr" defaultValue={user?.email || ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">מספר טלפון *</Label>
              <Input id="phone" name="phone" type="tel" required placeholder="050-1234567" dir="ltr" />
            </div>
            <div className="space-y-2">
              <Label>שנת לידה *</Label>
              <Select value={birthYear} onValueChange={setBirthYear} required>
                <SelectTrigger className="rounded-xl"><SelectValue placeholder="בחרו שנת לידה" /></SelectTrigger>
                <SelectContent>
                  {years.map((y) => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>מין *</Label>
              <RadioGroup value={gender} onValueChange={setGender} className="flex gap-4 pt-1" dir="rtl">
                <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-border px-5 py-2.5 text-sm transition-colors has-[*[data-state=checked]]:border-primary has-[*[data-state=checked]]:bg-accent">
                  <RadioGroupItem value="male" /> זכר
                </label>
                <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-border px-5 py-2.5 text-sm transition-colors has-[*[data-state=checked]]:border-primary has-[*[data-state=checked]]:bg-accent">
                  <RadioGroupItem value="female" /> נקבה
                </label>
              </RadioGroup>
            </div>

            {/* ─── פרופיל רווק/ה (single or both) ─── */}
            {(category === "single" || category === "both") && (
              <>
                <div className="border-t border-border pt-4">
                  <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-4">פרטי פרופיל</h3>
                </div>
                <div className="space-y-2">
                  <Label>רמה דתית</Label>
                  <Select value={religiousLevel} onValueChange={setReligiousLevel}>
                    <SelectTrigger><SelectValue placeholder="בחרו רמה" /></SelectTrigger>
                    <SelectContent>{Object.entries(religiousLabels).map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>אזור מגורים</Label>
                  <Select value={region} onValueChange={setRegion}>
                    <SelectTrigger><SelectValue placeholder="בחרו אזור" /></SelectTrigger>
                    <SelectContent>{Object.entries(regionLabels).map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">עיר / יישוב</Label>
                  <Input id="city" name="city" placeholder="תל אביב" />
                </div>
                <div className="space-y-2">
                  <Label>העדפת כשרות</Label>
                  <Select value={kashrutPref} onValueChange={setKashrutPref}>
                    <SelectTrigger><SelectValue placeholder="בחרו" /></SelectTrigger>
                    <SelectContent>{Object.entries(kashrutLabels).map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>העדפות תזונה</Label>
                  <Select value={dietaryPref} onValueChange={setDietaryPref}>
                    <SelectTrigger><SelectValue placeholder="בחרו" /></SelectTrigger>
                    <SelectContent>{Object.entries(dietaryLabels).map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="aboutMe">קצת עלי</Label>
                  <Textarea id="aboutMe" name="aboutMe" placeholder="ספרו קצת על עצמכם..." className="min-h-[80px]" />
                </div>
              </>
            )}

            {/* ─── פרופיל מארח (host or both) ─── */}
            {(category === "host" || category === "both") && hostSubType && (
              <>
                <div className="border-t border-border pt-4">
                  <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-4">פרטי אירוח</h3>
                </div>

                {/* Region & city shared for host (single already has them above) */}
                {category === "host" && (
                  <>
                    <div className="space-y-2">
                      <Label>רמה דתית</Label>
                      <Select value={religiousLevel} onValueChange={setReligiousLevel}>
                        <SelectTrigger><SelectValue placeholder="בחרו רמה" /></SelectTrigger>
                        <SelectContent>{Object.entries(religiousLabels).map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>אזור</Label>
                      <Select value={region} onValueChange={setRegion}>
                        <SelectTrigger><SelectValue placeholder="בחרו אזור" /></SelectTrigger>
                        <SelectContent>{Object.entries(regionLabels).map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">עיר / יישוב</Label>
                      <Input id="city" name="city" placeholder="ירושלים" />
                    </div>
                  </>
                )}

                {hostSubType === "family" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="aboutUs">קצת עלינו</Label>
                      <Textarea id="aboutUs" name="aboutUs" placeholder="ספרו קצת על המשפחה..." className="min-h-[80px]" />
                    </div>
                    <div className="space-y-2">
                      <Label>רמת כשרות</Label>
                      <Select value={kashrutLevel} onValueChange={setKashrutLevel}>
                        <SelectTrigger><SelectValue placeholder="בחרו" /></SelectTrigger>
                        <SelectContent>{Object.entries(kashrutLabels).map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>את מי מעוניינים להזמין?</Label>
                      <RadioGroup value={guestPref} onValueChange={setGuestPref} className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer"><RadioGroupItem value="men" /><span>גברים</span></label>
                        <label className="flex items-center gap-2 cursor-pointer"><RadioGroupItem value="women" /><span>נשים</span></label>
                        <label className="flex items-center gap-2 cursor-pointer"><RadioGroupItem value="mixed" /><span>מעורב</span></label>
                      </RadioGroup>
                    </div>
                  </>
                )}

                {hostSubType === "work" && (
                  <>
                    <div className="space-y-2"><Label htmlFor="placeName">שם המקום *</Label><Input id="placeName" name="placeName" required placeholder="מלון רמת רחל" /></div>
                    <div className="space-y-2"><Label htmlFor="jobDescription">מה העבודה?</Label><Textarea id="jobDescription" name="jobDescription" placeholder="תיאור המשרה..." /></div>
                    <div className="space-y-2"><Label htmlFor="payment">תשלום</Label><Input id="payment" name="payment" placeholder="150 ₪ לשעה" /></div>
                    <div className="space-y-2">
                      <Label>סוג העסקה</Label>
                      <RadioGroup value={isPermanent} onValueChange={setIsPermanent} className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer"><RadioGroupItem value="false" /><span>זמני</span></label>
                        <label className="flex items-center gap-2 cursor-pointer"><RadioGroupItem value="true" /><span>קבוע</span></label>
                      </RadioGroup>
                    </div>
                    <div className="space-y-2">
                      <Label>העדפת מגדר</Label>
                      <RadioGroup value={genderPref} onValueChange={setGenderPref} className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer"><RadioGroupItem value="men" /><span>גברים</span></label>
                        <label className="flex items-center gap-2 cursor-pointer"><RadioGroupItem value="women" /><span>נשים</span></label>
                        <label className="flex items-center gap-2 cursor-pointer"><RadioGroupItem value="mixed" /><span>מעורב</span></label>
                      </RadioGroup>
                    </div>
                    <div className="space-y-2"><Label htmlFor="teamSize">מספר אנשי צוות נדרשים</Label><Input id="teamSize" name="teamSize" type="number" min={1} placeholder="3" /></div>
                    <div className="space-y-2"><Label htmlFor="specialReq">דרישות מיוחדות</Label><Textarea id="specialReq" name="specialReq" placeholder="תואר, רישיון לנשק..." /></div>
                  </>
                )}

                {hostSubType === "volunteer" && (
                  <>
                    <div className="space-y-2"><Label htmlFor="placeName">שם המקום *</Label><Input id="placeName" name="placeName" required placeholder='בית חב"\u05d3 הרצליה' /></div>
                    <div className="space-y-2">
                      <Label>סוג ההתנדבות</Label>
                      <Select value={volunteerType} onValueChange={setVolunteerType}>
                        <SelectTrigger><SelectValue placeholder="בחרו סוג" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="farm">חווה</SelectItem>
                          <SelectItem value="children_home">בית ילד</SelectItem>
                          <SelectItem value="chabad">בית חב"\u05d3</SelectItem>
                          <SelectItem value="elderly">בית אבות</SelectItem>
                          <SelectItem value="military_families">משפחות מילואים</SelectItem>
                          <SelectItem value="other">אחר</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2"><Label htmlFor="specialReq">דרישות מיוחדות</Label><Textarea id="specialReq" name="specialReq" placeholder="כושר פיזי, ניסיון עם ילדים..." /></div>
                    <div className="space-y-3 rounded-xl border border-border bg-background p-4">
                      <h4 className="font-bold text-sm">מה כלול?</h4>
                      <div className="flex items-center gap-2"><Checkbox id="accommodation" checked={accommodation} onCheckedChange={(c) => setAccommodation(c === true)} /><Label htmlFor="accommodation" className="cursor-pointer">מקום לינה</Label></div>
                      <div className="flex items-center gap-2"><Checkbox id="meals" checked={meals} onCheckedChange={(c) => setMeals(c === true)} /><Label htmlFor="meals" className="cursor-pointer">ארוחות</Label></div>
                    </div>
                  </>
                )}

                {hostSubType === "singles_group" && (
                  <>
                    <div className="space-y-2"><Label htmlFor="groupName">שם החבורה *</Label><Input id="groupName" name="groupName" required placeholder="חבורת השבת של ירושלים" /></div>
                    <div className="space-y-2"><Label htmlFor="description">על החבורה</Label><Textarea id="description" name="description" placeholder="אווירה, תכנים..." className="min-h-[80px]" /></div>
                    <div className="space-y-2">
                      <Label>רמה דתית</Label>
                      <Select value={religiousLevel} onValueChange={setReligiousLevel}>
                        <SelectTrigger><SelectValue placeholder="בחרו" /></SelectTrigger>
                        <SelectContent>{Object.entries(religiousLabels).map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2"><Label htmlFor="groupSize">גודל החבורה</Label><Input id="groupSize" name="groupSize" type="number" min={2} placeholder="6" /></div>
                    <div className="space-y-2">
                      <Label>את מי מעוניינים להזמין?</Label>
                      <RadioGroup value={guestPref} onValueChange={setGuestPref} className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer"><RadioGroupItem value="men" /><span>גברים</span></label>
                        <label className="flex items-center gap-2 cursor-pointer"><RadioGroupItem value="women" /><span>נשים</span></label>
                        <label className="flex items-center gap-2 cursor-pointer"><RadioGroupItem value="mixed" /><span>מעורב</span></label>
                      </RadioGroup>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2"><Label htmlFor="ageMin">גיל מינימום</Label><Input id="ageMin" name="ageMin" type="number" min={18} max={99} placeholder="22" /></div>
                      <div className="space-y-2"><Label htmlFor="ageMax">גיל מקסימום</Label><Input id="ageMax" name="ageMax" type="number" min={18} max={99} placeholder="35" /></div>
                    </div>
                  </>
                )}

                {hostSubType === "organized_shabbat" && (
                  <>
                    <div className="space-y-2"><Label htmlFor="orgName">שם הארגון *</Label><Input id="orgName" name="orgName" required placeholder="סמינר ערכים" /></div>
                    <div className="space-y-2">
                      <Label>סוג השבת</Label>
                      <Select value={shabbatType} onValueChange={setShabbatType}>
                        <SelectTrigger><SelectValue placeholder="בחרו" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ערכים">סמינר ערכים</SelectItem>
                          <SelectItem value="שידוכים">שבת שידוכים</SelectItem>
                          <SelectItem value="חווייתית">שבת חווייתית</SelectItem>
                          <SelectItem value="לימודית">שבת לימודית</SelectItem>
                          <SelectItem value="אחר">אחר</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2"><Label htmlFor="description">תיאור השבת</Label><Textarea id="description" name="description" placeholder="תוכן, סדנאות, אווירה..." className="min-h-[80px]" /></div>
                    <div className="space-y-2">
                      <Label>רמה דתית</Label>
                      <Select value={religiousLevel} onValueChange={setReligiousLevel}>
                        <SelectTrigger><SelectValue placeholder="בחרו" /></SelectTrigger>
                        <SelectContent>{Object.entries(religiousLabels).map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2"><Label htmlFor="targetAudience">קהל יעד</Label><Input id="targetAudience" name="targetAudience" placeholder="רווקים/ות 25-35, דתיים" /></div>
                    <div className="space-y-2"><Label htmlFor="cost">עלות</Label><Input id="cost" name="cost" placeholder="450 ₪ לאדם" /></div>
                    <div className="space-y-2"><Label htmlFor="regLink">קישור להרשמה</Label><Input id="regLink" name="regLink" type="url" dir="ltr" placeholder="https://..." /></div>
                  </>
                )}
              </>
            )}
            <div className="space-y-3 rounded-xl border border-border bg-background p-4">
              <h4 className="font-bold text-sm">פרטי ממליץ/ה</h4>
              <p className="text-xs text-muted-foreground">איש קשר שמכיר אותך ויכול לאשר את פרטיך</p>
              <div className="space-y-2">
                <Label htmlFor="refName">שם הממליץ/ה</Label>
                <Input id="refName" name="refName" placeholder="שם מלא" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="refPhone">טלפון הממליץ/ה</Label>
                <Input id="refPhone" name="refPhone" type="tel" placeholder="050-9876543" dir="ltr" />
              </div>
            </div>

            {/* ID Upload - optional */}
            {/* <div className="space-y-2">
              <Label>צילום תעודת זהות / רישיון נהיגה</Label>
              <p className="text-xs text-muted-foreground">
                לא חובה, אך העלאת מסמך מזהה תקל עלינו לאשר את ההרשמה מהר יותר 🚀
              </p>
              <label
                htmlFor="idUpload"
                className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-border bg-background p-6 transition-colors hover:border-primary hover:bg-accent/40"
              >
                <Upload className="h-8 w-8 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">
                  {idFile ? idFile.name : "לחצו להעלאת קובץ (אופציונלי)"}
                </span>
                <input
                  id="idUpload"
                  type="file"
                  accept="image/*,.pdf"
                  className="hidden"
                  onChange={(e) => setIdFile(e.target.files?.[0] ?? null)}
                />
              </label>
            </div> */}

            {/* Terms */}
            <div className="flex items-start gap-3 rounded-xl border border-border bg-background p-4">
              <Checkbox
                id="terms"
                checked={termsAccepted}
                onCheckedChange={(checked) => setTermsAccepted(checked === true)}
                className="mt-0.5"
              />
              <Label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer">
                קראתי ואני מאשר/ת את{" "}
                <a href="/terms" target="_blank" className="text-primary font-bold hover:underline">
                  תקנון פל״א
                </a>{" "}
                ומתחייב/ת לפעול על פיו *
              </Label>
            </div>

            <Button
              type="submit"
              className="w-full rounded-full text-base font-bold"
              size="lg"
              disabled={loading || !termsAccepted || !birthYear || !gender}
            >
              {loading ? "שולח..." : "שליחת הרשמה"}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              הפרטים שלכם מאובטחים ולא ישותפו ללא אישורכם
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default Register;
