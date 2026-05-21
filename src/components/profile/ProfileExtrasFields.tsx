import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

export const HOBBY_PRESETS = [
  "מוסיקה", "ספורט", "ספרים", "בישול", "טיולים", "אומנות", "צילום",
  "ריקוד", "תיאטרון", "סרטים", "משחקי קופסה", "גינון", "ים", "ריצה",
  "יוגה", "כתיבה", "פודקאסטים", "התנדבות",
];

export const PERSONALITY_PRESETS = [
  "מצחיק/ה", "רגוע/ה", "ספונטני/ת", "מאורגן/ת", "פתוח/ה", "ביישן/ית",
  "סקרן/ית", "אנרגטי/ת", "אמפתי/ת", "ביקורתי/ת", "אופטימי/ת", "רומנטי/ת",
  "אינטלקטואלי/ת", "אדם של אנשים", "אוהב/ת לבד",
];

export const SHABBAT_VIBE_PRESETS = [
  "שקטה ומשפחתית", "חברתית ותוססת", "עם שירה", "עם דברי תורה",
  "ארוכה ונינוחה", "עם הרבה אורחים", "אינטימית", "מסורתית",
  "מודרנית", "עם משחקים", "עם הליכה ושיחה",
];

export const LANGUAGE_PRESETS = [
  "עברית", "אנגלית", "צרפתית", "רוסית", "ספרדית", "אמהרית", "ערבית",
  "יידיש", "פורטוגזית", "גרמנית",
];

interface ChipMultiSelectProps {
  name: string;
  label: string;
  presets: string[];
  initial?: string[];
  placeholder?: string;
}

export const ChipMultiSelect = ({ name, label, presets, initial, placeholder }: ChipMultiSelectProps) => {
  const [selected, setSelected] = useState<string[]>(initial || []);
  const [draft, setDraft] = useState("");

  const toggle = (v: string) => {
    setSelected((s) => (s.includes(v) ? s.filter((x) => x !== v) : [...s, v]));
  };
  const addCustom = () => {
    const v = draft.trim();
    if (v && !selected.includes(v)) setSelected([...selected, v]);
    setDraft("");
  };

  return (
    <div className="space-y-3">
      <Label className="font-bold">{label}</Label>
      {/* Hidden inputs to submit via FormData */}
      {selected.map((v) => (
        <input key={v} type="hidden" name={name} value={v} />
      ))}
      <div className="flex flex-wrap gap-2">
        {presets.map((p) => {
          const active = selected.includes(p);
          return (
            <button
              type="button"
              key={p}
              onClick={() => toggle(p)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-all border ${
                active
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "bg-background text-foreground border-border hover:border-primary/50"
              }`}
            >
              {p}
            </button>
          );
        })}
      </div>
      {selected.filter((s) => !presets.includes(s)).length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selected
            .filter((s) => !presets.includes(s))
            .map((s) => (
              <Badge key={s} variant="secondary" className="gap-1 pr-2">
                {s}
                <button type="button" onClick={() => toggle(s)} className="hover:text-destructive">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
        </div>
      )}
      <div className="flex gap-2">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addCustom();
            }
          }}
          placeholder={placeholder || "הוספה משלך — Enter"}
          className="text-sm"
        />
        <button
          type="button"
          onClick={addCustom}
          className="rounded-md border border-border px-3 text-sm font-semibold hover:bg-muted"
        >
          הוספה
        </button>
      </div>
    </div>
  );
};

interface ProfileExtrasFieldsProps {
  existing?: any;
}

/**
 * שדות משותפים לכל סוגי הפרופילים — תחביבים, אופי, אווירת שבת, שפות, מקצוע, לימודים.
 * שמות שדות ב-FormData:
 *   hobbies[], personality_tags[], shabbat_vibe[], languages[], profession, education
 */
export const ProfileExtrasFields = ({ existing }: ProfileExtrasFieldsProps) => {
  return (
    <div className="space-y-6 rounded-2xl border border-border bg-muted/30 p-5">
      <div className="space-y-1">
        <h4 className="font-display font-bold text-base">קצת יותר עליי</h4>
        <p className="text-xs text-muted-foreground">השדות האלה עוזרים לנו להציע התאמות טובות יותר ✨</p>
      </div>

      <ChipMultiSelect
        name="hobbies"
        label="תחביבים ותחומי עניין"
        presets={HOBBY_PRESETS}
        initial={existing?.hobbies || []}
      />
      <ChipMultiSelect
        name="personality_tags"
        label="אופי וסגנון"
        presets={PERSONALITY_PRESETS}
        initial={existing?.personality_tags || []}
      />
      <ChipMultiSelect
        name="shabbat_vibe"
        label="אווירת שבת מועדפת"
        presets={SHABBAT_VIBE_PRESETS}
        initial={existing?.shabbat_vibe || []}
      />
      <ChipMultiSelect
        name="languages"
        label="שפות"
        presets={LANGUAGE_PRESETS}
        initial={existing?.languages || []}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="profession">מקצוע / תחום עיסוק</Label>
          <Input
            id="profession"
            name="profession"
            placeholder="מתכנתת, מורה, סטודנט/ית..."
            defaultValue={existing?.profession || ""}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="education">לימודים / השכלה</Label>
          <Input
            id="education"
            name="education"
            placeholder="תואר במשפטים, סמינר..."
            defaultValue={existing?.education || ""}
          />
        </div>
      </div>
    </div>
  );
};

interface ProfileImageUploadsProps {
  existing?: any;
}

export const ProfileImageUploads = ({ existing }: ProfileImageUploadsProps) => (
  <div className="space-y-4 rounded-2xl border border-border bg-muted/30 p-5">
    <div className="space-y-1">
      <h4 className="font-display font-bold text-base">תמונות</h4>
      <p className="text-xs text-muted-foreground">תמונת באנר רחבה ותמונת פרופיל עגולה — כמו פרופיל אישי</p>
    </div>

    <div className="space-y-2">
      <Label htmlFor="bannerImage">תמונת באנר (רחבה)</Label>
      {existing?.banner_image_url && (
        <img
          src={existing.banner_image_url}
          alt=""
          className="h-28 w-full rounded-xl object-cover border border-border"
        />
      )}
      <Input id="bannerImage" name="bannerImage" type="file" accept="image/*" className="cursor-pointer" />
    </div>

    <div className="space-y-2">
      <Label htmlFor="profileImage">תמונת פרופיל</Label>
      {existing?.profile_image_url && (
        <img
          src={existing.profile_image_url}
          alt=""
          className="h-24 w-24 rounded-full object-cover border-2 border-border"
        />
      )}
      <Input id="profileImage" name="profileImage" type="file" accept="image/*" className="cursor-pointer" />
    </div>
  </div>
);

/** Helper to extract the new shared fields from FormData and return columns to merge into upsert */
export function readProfileExtras(form: FormData) {
  const hobbies = form.getAll("hobbies") as string[];
  const personality = form.getAll("personality_tags") as string[];
  const vibe = form.getAll("shabbat_vibe") as string[];
  const langs = form.getAll("languages") as string[];
  return {
    hobbies: hobbies.length ? hobbies : null,
    personality_tags: personality.length ? personality : null,
    shabbat_vibe: vibe.length ? vibe : null,
    languages: langs.length ? langs : null,
    profession: (form.get("profession") as string) || null,
    education: (form.get("education") as string) || null,
  };
}
