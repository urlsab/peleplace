import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Upload, UserRound, Building2, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Category = "single" | "host" | null;
type HostType = "family" | "work" | "volunteer" | null;

const Register = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [category, setCategory] = useState<Category>(null);
  const [hostType, setHostType] = useState<HostType>(null);
  const [idFile, setIdFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user || !category) return;

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
      });

      if (profileError) throw profileError;

      toast({
        title: "ההרשמה התקבלה! 🎉",
        description: "נבדוק את הפרטים ונחזור אליך בהקדם. לאחר אישור תוכל/י לבנות פרופיל מלא.",
      });

      navigate("/");
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
                <div className="font-bold font-display text-lg">מקום לשבת / לחג</div>
                <div className="text-sm text-muted-foreground">מארח/ת, מעסיק/ה או מתנדב/ת</div>
              </div>
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-border bg-card p-8 shadow-card">
            <button
              type="button"
              onClick={() => { setCategory(null); setHostType(null); }}
              className="text-sm text-primary hover:underline"
            >
              ← חזרה לבחירת קטגוריה
            </button>

            <div className="rounded-xl bg-accent/60 px-4 py-2.5 text-center text-sm font-medium">
              {category === "single" ? "🙋 הרשמה כרווק/ה" : "🏠 הרשמה כמארח/מעסיק/מתנדב"}
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName">שם מלא *</Label>
              <Input id="fullName" name="fullName" required placeholder="ישראל ישראלי" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">אימייל *</Label>
              <Input id="email" name="email" type="email" required placeholder="israel@email.com" dir="ltr" defaultValue={user.email || ""} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">מספר טלפון *</Label>
              <Input id="phone" name="phone" type="tel" required placeholder="050-1234567" dir="ltr" />
            </div>

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

            <div className="space-y-2">
              <Label>צילום תעודת זהות / רישיון נהיגה</Label>
              <p className="text-xs text-muted-foreground">
                לא חובה, אך העלאת מסמך מזהה תקל עלינו לאשר את ההרשמה מהר יותר 🙏
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

            <Button type="submit" className="w-full rounded-full text-base font-bold" size="lg" disabled={loading}>
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
