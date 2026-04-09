import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Upload, UserRound, Building2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Category = "single" | "place" | null;

const RegistrationDialog = ({ trigger }: { trigger: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState<Category>(null);
  const [idFile, setIdFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!category) return;
    toast({
      title: "ההרשמה התקבלה!",
      description: "נבדוק את הפרטים ונחזור אליך בהקדם 🙏",
    });
    setOpen(false);
    setCategory(null);
    setIdFile(null);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setCategory(null); setIdFile(null); } }}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-black font-display">
            הרשמה לפל״א
          </DialogTitle>
        </DialogHeader>

        {/* Step 1: Choose category */}
        {!category ? (
          <div className="space-y-4 py-4">
            <p className="text-center text-muted-foreground">איך תרצו להירשם?</p>
            <div className="grid grid-cols-1 gap-3">
              <button
                onClick={() => setCategory("single")}
                className="flex items-center gap-4 rounded-2xl border-2 border-border bg-card p-5 text-right transition-all hover:border-primary hover:shadow-md"
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
                onClick={() => setCategory("place")}
                className="flex items-center gap-4 rounded-2xl border-2 border-border bg-card p-5 text-right transition-all hover:border-secondary hover:shadow-md"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
                  <Building2 className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-bold font-display text-lg">מקום לשבת / לחג</div>
                  <div className="text-sm text-muted-foreground">מארח/ת, מעסיק/ה או התנדבות</div>
                </div>
              </button>
            </div>
          </div>
        ) : (
          /* Step 2: Registration form */
          <form onSubmit={handleSubmit} className="space-y-5 py-2">
            <button
              type="button"
              onClick={() => setCategory(null)}
              className="text-sm text-primary hover:underline"
            >
              ← חזרה לבחירת קטגוריה
            </button>

            <div className="rounded-xl bg-accent/60 px-4 py-2.5 text-center text-sm font-medium">
              {category === "single" ? "🙋 הרשמה כרווק/ה" : "🏠 הרשמה כמקום לשבת/חג"}
            </div>

            {/* Full name */}
            <div className="space-y-2">
              <Label htmlFor="fullName">שם מלא *</Label>
              <Input id="fullName" name="fullName" required placeholder="ישראל ישראלי" />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">אימייל *</Label>
              <Input id="email" name="email" type="email" required placeholder="israel@email.com" dir="ltr" />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">מספר טלפון *</Label>
              <Input id="phone" name="phone" type="tel" required placeholder="050-1234567" dir="ltr" />
            </div>

            {/* Recommender section */}
            <div className="space-y-3 rounded-xl border border-border bg-card p-4">
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

            {/* ID Upload */}
            <div className="space-y-2">
              <Label>צילום תעודת זהות / רישיון נהיגה *</Label>
              <p className="text-xs text-muted-foreground">לצורכי אימות בלבד — לא יוצג לאף אחד</p>
              <label
                htmlFor="idUpload"
                className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-border bg-card p-6 transition-colors hover:border-primary hover:bg-accent/40"
              >
                <Upload className="h-8 w-8 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">
                  {idFile ? idFile.name : "לחצו להעלאת קובץ"}
                </span>
                <input
                  id="idUpload"
                  type="file"
                  accept="image/*,.pdf"
                  className="hidden"
                  required
                  onChange={(e) => setIdFile(e.target.files?.[0] ?? null)}
                />
              </label>
            </div>

            {category === "place" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="placeName">שם המקום / הארגון *</Label>
                  <Input id="placeName" name="placeName" required placeholder='למשל: בית חב"ד הרצליה' />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="placeType">סוג המקום *</Label>
                  <RadioGroup name="placeType" required className="grid grid-cols-2 gap-2 pt-1">
                    {["אירוח", "עבודה", "התנדבות", "חברה לארוחה"].map((t) => (
                      <label
                        key={t}
                        className="flex cursor-pointer items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm transition-colors has-[*[data-state=checked]]:border-primary has-[*[data-state=checked]]:bg-accent"
                      >
                        <RadioGroupItem value={t} />
                        {t}
                      </label>
                    ))}
                  </RadioGroup>
                </div>
              </>
            )}

            <Button type="submit" className="w-full rounded-full text-base font-bold" size="lg">
              שליחת הרשמה
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              הפרטים שלכם מאובטחים ולא ישותפו ללא אישורכם
            </p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RegistrationDialog;
