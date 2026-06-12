import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload, UserRound, Building2, Heart, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Category = "single" | "host" | null;

const Register = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [category, setCategory] = useState<Category>(null);
  const [idFile, setIdFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [birthYear, setBirthYear] = useState("");
  const [gender, setGender] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1940 - 16 }, (_, i) => currentYear - 17 - i);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user || !category || !birthYear || !gender) return;

    setLoading(true);
    const form = new FormData(e.currentTarget);

    try {
      // Upload ID document (optional)
      let idDocUrl: string | null = null;
      if (idFile) {
        const ext = idFile.name.split(".").pop();
        const path = `${user.id}/${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("id-documents")
          .upload(path, idFile);
        if (uploadError) throw uploadError;
        idDocUrl = path;
      }

      // Create profile
      const { error: profileError } = await supabase.from("profiles").insert({
        user_id: user.id,
        full_name: form.get("fullName") as string,
        email: form.get("email") as string,
        phone: form.get("phone") as string,
        user_type: category as "single" | "host",
        recommender_name: form.get("refName") as string,
        recommender_phone: form.get("refPhone") as string,
        id_document_url: idDocUrl,
        terms_accepted_at: new Date().toISOString(),
        date_of_birth: `${birthYear}-01-01`,
        registration_status: "approved",
        gender,
      } as any);

      if (profileError) throw profileError;

      
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

        {!category ? (
          <div className="space-y-4 rounded-2xl border border-border bg-card p-8 shadow-card">
            <p className="text-center text-lg font-bold font-display">איך תרצו להירשם?</p>
            <button
              onClick={() => setCategory("single")}
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
              onClick={() => setCategory("host")}
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
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-border bg-card p-8 shadow-card">
            <button
              type="button"
              onClick={() => setCategory(null)}
              className="text-sm text-primary hover:underline"
            >
              ← חזרה לבחירת קטגוריה
            </button>

            <div className="rounded-xl bg-accent/60 px-4 py-2.5 text-center text-sm font-medium">
              {category === "single" ? "🙋 הרשמה כרווק/ה" : "🏠 הרשמה כמקום מארח"}
            </div>

            {/* Full name */}
            <div className="space-y-2">
              <Label htmlFor="fullName">שם ומשפחה *</Label>
              <Input id="fullName" name="fullName" required placeholder="ישראל ישראלי" />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">אימייל *</Label>
              <Input id="email" name="email" type="email" required placeholder="israel@email.com" dir="ltr" defaultValue={user.email || ""} />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">מספר טלפון *</Label>
              <Input id="phone" name="phone" type="tel" required placeholder="050-1234567" dir="ltr" />
            </div>

            {/* Birth Year */}
            <div className="space-y-2">
              <Label>שנת לידה *</Label>
              <Select value={birthYear} onValueChange={setBirthYear} required>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="בחרו שנת לידה" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={String(year)}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <Label>מין *</Label>
              <RadioGroup value={gender} onValueChange={setGender} className="flex gap-4 pt-1" dir="rtl">
                <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-border px-5 py-2.5 text-sm transition-colors has-[*[data-state=checked]]:border-primary has-[*[data-state=checked]]:bg-accent">
                  <RadioGroupItem value="male" />
                  זכר
                </label>
                <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-border px-5 py-2.5 text-sm transition-colors has-[*[data-state=checked]]:border-primary has-[*[data-state=checked]]:bg-accent">
                  <RadioGroupItem value="female" />
                  נקבה
                </label>
              </RadioGroup>
            </div>

            {/* Recommender */}
            <div className="space-y-3 rounded-xl border border-border bg-background p-4">
              <h4 className="font-bold text-sm">פרטי ממליץ/ה *</h4>
              <p className="text-xs text-muted-foreground">כדי לשמור על קהילה בטוחה, נבקש פרטי איש קשר שמכיר אתכם</p>
              <div className="space-y-2">
                <Label htmlFor="refName">שם הממליץ/ה</Label>
                <Input id="refName" name="refName" required placeholder="שם מלא" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="refPhone">טלפון הממליץ/ה</Label>
                <Input id="refPhone" name="refPhone" type="tel" required placeholder="050-9876543" dir="ltr" />
              </div>
            </div>

            {/* ID Upload - optional */}
            <div className="space-y-2">
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
            </div>

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
