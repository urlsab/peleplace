import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import HostDatePicker from "@/components/profile/HostDatePicker";

export type ProfileCategory =
  | "single"
  | "host_family"
  | "host_volunteer"
  | "host_organized_shabbat"
  | "host_work"
  | "host_singles_group"
  | "host_reservist";

const helpTypeLabels: Record<string, string> = {
  childcare: "טיפול בילדים",
  shabbat_prep: "הכנות לשבת",
  company: "חברה ושיחה",
  household: "עזרה בבית",
  errands: "סידורים",
  other: "אחר",
};

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
  regular: "רגיל", vegetarian: "צמחוני", vegan: "טבעוני", gluten_free: "ללא גלוטן", other: "אחר",
};

const RegionSelect = ({ name, defaultValue }: { name: string; defaultValue?: string }) => (
  <Select name={name} defaultValue={defaultValue}>
    <SelectTrigger><SelectValue placeholder="בחרו אזור" /></SelectTrigger>
    <SelectContent>
      {Object.entries(regionLabels).map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}
    </SelectContent>
  </Select>
);
const ReligiousSelect = ({ name, defaultValue }: { name: string; defaultValue?: string }) => (
  <Select name={name} defaultValue={defaultValue}>
    <SelectTrigger><SelectValue placeholder="בחרו רמה" /></SelectTrigger>
    <SelectContent>
      {Object.entries(religiousLabels).map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}
    </SelectContent>
  </Select>
);
const KashrutSelect = ({ name, defaultValue }: { name: string; defaultValue?: string }) => (
  <Select name={name} defaultValue={defaultValue}>
    <SelectTrigger><SelectValue placeholder="בחרו רמת כשרות" /></SelectTrigger>
    <SelectContent>
      {Object.entries(kashrutLabels).map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}
    </SelectContent>
  </Select>
);

interface Props {
  category: ProfileCategory;
  userId: string;
  existing?: any;
  onSaved: () => void;
  submitLabel?: string;
}

/**
 * טופס הפרופיל לפי קטגוריה. שומר ל-supabase ואז קורא ל-onSaved.
 * משמש גם ב-Wizard של ההרשמה וגם בעמוד הפרופיל / חסימה רכה.
 */
const ProfileFormFields = ({ category, userId, existing, onSaved, submitLabel }: Props) => {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [availableDates, setAvailableDates] = useState<string[]>(existing?.available_dates || []);
  const [alwaysAvailable, setAlwaysAvailable] = useState<boolean>(existing?.always_available || false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const form = new FormData(e.currentTarget);

    try {
      // Profile image upload (single only)
      let profileImageUrl: string | null = existing?.profile_image_url || null;
      if (category === "single") {
        const imgFile = form.get("profileImage") as File | null;
        if (imgFile && imgFile.size > 0) {
          const ext = imgFile.name.split(".").pop();
          const path = `${userId}/profile-${Date.now()}.${ext}`;
          const { error: upErr } = await supabase.storage.from("profile-images").upload(path, imgFile, { upsert: true });
          if (upErr) throw upErr;
          const { data: pub } = supabase.storage.from("profile-images").getPublicUrl(path);
          profileImageUrl = pub.publicUrl;
        }
      }

      let error: any = null;
      if (category === "single") {
        const data = {
          user_id: userId,
          age: parseInt(form.get("age") as string) || null,
          gender: (form.get("gender") as any) || null,
          religious_level: (form.get("religiousLevel") as any) || null,
          region: (form.get("region") as any) || null,
          city: (form.get("city") as string) || null,
          about_me: (form.get("aboutMe") as string) || null,
          profile_image_url: profileImageUrl,
          kashrut_preference: (form.get("kashrutPref") as any) || null,
          dietary_preference: (form.get("dietaryPref") as any) || null,
        };
        ({ error } = await supabase.from("single_profiles").upsert(data, { onConflict: "user_id" }));
      } else if (category === "host_family") {
        const data = {
          user_id: userId,
          about_us: (form.get("aboutUs") as string) || null,
          religious_level: (form.get("religiousLevel") as any) || null,
          kashrut_level: (form.get("kashrutLevel") as any) || null,
          guest_preference: (form.get("guestPref") as any) || null,
          region: (form.get("region") as any) || null,
          city: (form.get("city") as string) || null,
          available_dates: alwaysAvailable ? null : (availableDates.length > 0 ? availableDates : null),
          always_available: alwaysAvailable,
        };
        ({ error } = await supabase.from("host_family_profiles").upsert(data, { onConflict: "user_id" }));
      } else if (category === "host_work") {
        const data = {
          user_id: userId,
          place_name: form.get("placeName") as string,
          region: (form.get("region") as any) || null,
          city: (form.get("city") as string) || null,
          job_description: (form.get("jobDescription") as string) || null,
          payment: (form.get("payment") as string) || null,
          is_permanent: form.get("isPermanent") === "true",
          gender_preference: (form.get("genderPref") as any) || null,
          team_size: parseInt(form.get("teamSize") as string) || null,
          special_requirements: (form.get("specialReq") as string) || null,
          available_dates: alwaysAvailable ? null : (availableDates.length > 0 ? availableDates : null),
          always_available: alwaysAvailable,
        };
        ({ error } = await supabase.from("host_work_profiles").upsert(data, { onConflict: "user_id" }));
      } else if (category === "host_volunteer") {
        const data = {
          user_id: userId,
          place_name: form.get("placeName") as string,
          volunteer_type: (form.get("volunteerType") as string) || null,
          region: (form.get("region") as any) || null,
          city: (form.get("city") as string) || null,
          special_requirements: (form.get("specialReq") as string) || null,
          provides_accommodation: form.get("accommodation") === "on",
          provides_meals: form.get("meals") === "on",
        };
        ({ error } = await supabase.from("host_volunteer_profiles").upsert(data, { onConflict: "user_id" }));
      } else if (category === "host_singles_group") {
        const data = {
          user_id: userId,
          group_name: form.get("groupName") as string,
          description: (form.get("description") as string) || null,
          religious_level: (form.get("religiousLevel") as any) || null,
          region: (form.get("region") as any) || null,
          city: (form.get("city") as string) || null,
          group_size: parseInt(form.get("groupSize") as string) || null,
          guest_preference: (form.get("guestPref") as any) || null,
          age_range_min: parseInt(form.get("ageMin") as string) || null,
          age_range_max: parseInt(form.get("ageMax") as string) || null,
          available_dates: alwaysAvailable ? null : (availableDates.length > 0 ? availableDates : null),
          always_available: alwaysAvailable,
        };
        ({ error } = await supabase.from("host_singles_group_profiles").upsert(data, { onConflict: "user_id" }));
      } else if (category === "host_organized_shabbat") {
        const data = {
          user_id: userId,
          organization_name: form.get("orgName") as string,
          shabbat_type: (form.get("shabbatType") as string) || null,
          description: (form.get("description") as string) || null,
          religious_level: (form.get("religiousLevel") as any) || null,
          region: (form.get("region") as any) || null,
          city: (form.get("city") as string) || null,
          cost: (form.get("cost") as string) || null,
          registration_link: (form.get("regLink") as string) || null,
          target_audience: (form.get("targetAudience") as string) || null,
          available_dates: alwaysAvailable ? null : (availableDates.length > 0 ? availableDates : null),
          always_available: alwaysAvailable,
        };
        ({ error } = await supabase.from("host_organized_shabbat_profiles").upsert(data, { onConflict: "user_id" }));
      }

      if (error) throw error;
      toast({ title: "הפרופיל נשמר! ✨" });
      onSaved();
    } catch (err: any) {
      toast({ title: "שגיאה", description: err.message || "שמירה נכשלה", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {category === "single" && (
        <>
          <div className="space-y-2">
            <Label htmlFor="profileImage">תמונת פרופיל (אופציונלי)</Label>
            {existing?.profile_image_url && (
              <img src={existing.profile_image_url} alt="" className="h-24 w-24 rounded-full object-cover border-2 border-border" />
            )}
            <Input id="profileImage" name="profileImage" type="file" accept="image/*" className="cursor-pointer" />
          </div>
          <div className="space-y-2"><Label htmlFor="age">גיל</Label><Input id="age" name="age" type="number" min={18} max={99} placeholder="25" defaultValue={existing?.age || ""} /></div>
          <div className="space-y-2">
            <Label>מגדר</Label>
            <RadioGroup name="gender" defaultValue={existing?.gender || ""} className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer"><RadioGroupItem value="men" /><span>גבר</span></label>
              <label className="flex items-center gap-2 cursor-pointer"><RadioGroupItem value="women" /><span>אישה</span></label>
            </RadioGroup>
          </div>
          <div className="space-y-2"><Label>רמה דתית</Label><ReligiousSelect name="religiousLevel" defaultValue={existing?.religious_level || undefined} /></div>
          <div className="space-y-2"><Label>אזור מגורים</Label><RegionSelect name="region" defaultValue={existing?.region || undefined} /></div>
          <div className="space-y-2"><Label htmlFor="city">עיר / יישוב</Label><Input id="city" name="city" placeholder="תל אביב" defaultValue={existing?.city || ""} /></div>
          <div className="space-y-2"><Label>העדפת כשרות</Label><KashrutSelect name="kashrutPref" defaultValue={existing?.kashrut_preference || undefined} /></div>
          <div className="space-y-2">
            <Label>העדפות תזונה</Label>
            <Select name="dietaryPref" defaultValue={existing?.dietary_preference || undefined}>
              <SelectTrigger><SelectValue placeholder="בחרו" /></SelectTrigger>
              <SelectContent>
                {Object.entries(dietaryLabels).map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2"><Label htmlFor="aboutMe">קצת עליי</Label><Textarea id="aboutMe" name="aboutMe" placeholder="ספרו קצת על עצמכם..." className="min-h-[100px]" defaultValue={existing?.about_me || ""} /></div>
        </>
      )}

      {category === "host_family" && (
        <>
          <div className="space-y-2"><Label htmlFor="aboutUs">קצת עלינו</Label><Textarea id="aboutUs" name="aboutUs" placeholder="ספרו קצת על המשפחה..." className="min-h-[100px]" defaultValue={existing?.about_us || ""} /></div>
          <div className="space-y-2"><Label>רמה דתית</Label><ReligiousSelect name="religiousLevel" defaultValue={existing?.religious_level || undefined} /></div>
          <div className="space-y-2"><Label>רמת כשרות</Label><KashrutSelect name="kashrutLevel" defaultValue={existing?.kashrut_level || undefined} /></div>
          <div className="space-y-2">
            <Label>את מי מעוניינים להזמין?</Label>
            <RadioGroup name="guestPref" defaultValue={existing?.guest_preference || ""} className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer"><RadioGroupItem value="men" /><span>גברים</span></label>
              <label className="flex items-center gap-2 cursor-pointer"><RadioGroupItem value="women" /><span>נשים</span></label>
              <label className="flex items-center gap-2 cursor-pointer"><RadioGroupItem value="mixed" /><span>מעורב</span></label>
            </RadioGroup>
          </div>
          <div className="space-y-2"><Label>אזור מגורים</Label><RegionSelect name="region" defaultValue={existing?.region || undefined} /></div>
          <div className="space-y-2"><Label htmlFor="city">עיר / יישוב</Label><Input id="city" name="city" placeholder="הרצליה" defaultValue={existing?.city || ""} /></div>
          <div className="space-y-2">
            <Label>תאריכים פנויים לאירוח</Label>
            <HostDatePicker selectedDates={availableDates} onChange={setAvailableDates} alwaysAvailable={alwaysAvailable} onAlwaysAvailableChange={setAlwaysAvailable} hostType="family" />
          </div>
        </>
      )}

      {category === "host_work" && (
        <>
          <div className="space-y-2"><Label htmlFor="placeName">שם המקום *</Label><Input id="placeName" name="placeName" required placeholder="מלון רמת רחל" defaultValue={existing?.place_name || ""} /></div>
          <div className="space-y-2"><Label>אזור</Label><RegionSelect name="region" defaultValue={existing?.region || undefined} /></div>
          <div className="space-y-2"><Label htmlFor="city">עיר / מיקום</Label><Input id="city" name="city" placeholder="ירושלים" defaultValue={existing?.city || ""} /></div>
          <div className="space-y-2"><Label htmlFor="jobDescription">מה העבודה?</Label><Textarea id="jobDescription" name="jobDescription" placeholder="תיאור המשרה..." defaultValue={existing?.job_description || ""} /></div>
          <div className="space-y-2"><Label htmlFor="payment">תשלום</Label><Input id="payment" name="payment" placeholder="150 ₪ לשעה" defaultValue={existing?.payment || ""} /></div>
          <div className="space-y-2">
            <Label>סוג העסקה</Label>
            <RadioGroup name="isPermanent" defaultValue={existing?.is_permanent ? "true" : "false"} className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer"><RadioGroupItem value="false" /><span>זמני / חד פעמי</span></label>
              <label className="flex items-center gap-2 cursor-pointer"><RadioGroupItem value="true" /><span>עובד/ת קבוע/ה</span></label>
            </RadioGroup>
          </div>
          <div className="space-y-2">
            <Label>העדפת מגדר</Label>
            <RadioGroup name="genderPref" defaultValue={existing?.gender_preference || ""} className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer"><RadioGroupItem value="men" /><span>גברים</span></label>
              <label className="flex items-center gap-2 cursor-pointer"><RadioGroupItem value="women" /><span>נשים</span></label>
              <label className="flex items-center gap-2 cursor-pointer"><RadioGroupItem value="mixed" /><span>מעורב</span></label>
            </RadioGroup>
          </div>
          <div className="space-y-2"><Label htmlFor="teamSize">מספר אנשי צוות נדרשים</Label><Input id="teamSize" name="teamSize" type="number" min={1} placeholder="3" defaultValue={existing?.team_size || ""} /></div>
          <div className="space-y-2"><Label htmlFor="specialReq">דרישות מיוחדות</Label><Textarea id="specialReq" name="specialReq" placeholder="תואר, רישיון לנשק, ניסיון..." defaultValue={existing?.special_requirements || ""} /></div>
          <div className="space-y-2">
            <Label>תאריכים פנויים</Label>
            <HostDatePicker selectedDates={availableDates} onChange={setAvailableDates} alwaysAvailable={alwaysAvailable} onAlwaysAvailableChange={setAlwaysAvailable} hostType="work" />
          </div>
        </>
      )}

      {category === "host_volunteer" && (
        <>
          <div className="space-y-2"><Label htmlFor="placeName">שם המקום *</Label><Input id="placeName" name="placeName" required placeholder='בית חב"ד הרצליה' defaultValue={existing?.place_name || ""} /></div>
          <div className="space-y-2">
            <Label htmlFor="volunteerType">סוג ההתנדבות</Label>
            <Select name="volunteerType" defaultValue={existing?.volunteer_type || undefined}>
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
          <div className="space-y-2"><Label>אזור</Label><RegionSelect name="region" defaultValue={existing?.region || undefined} /></div>
          <div className="space-y-2"><Label htmlFor="city">עיר / מיקום</Label><Input id="city" name="city" placeholder="כפר חב״ד" defaultValue={existing?.city || ""} /></div>
          <div className="space-y-2"><Label htmlFor="specialReq">דרישות מיוחדות</Label><Textarea id="specialReq" name="specialReq" placeholder="כושר פיזי, ניסיון עם ילדים..." defaultValue={existing?.special_requirements || ""} /></div>
          <div className="space-y-3 rounded-xl border border-border bg-background p-4">
            <h4 className="font-bold text-sm">מה כלול?</h4>
            <div className="flex items-center gap-2">
              <Checkbox id="accommodation" name="accommodation" defaultChecked={existing?.provides_accommodation} />
              <Label htmlFor="accommodation" className="cursor-pointer">מקום לינה</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="meals" name="meals" defaultChecked={existing?.provides_meals} />
              <Label htmlFor="meals" className="cursor-pointer">ארוחות</Label>
            </div>
          </div>
        </>
      )}

      {category === "host_singles_group" && (
        <>
          <div className="space-y-2"><Label htmlFor="groupName">שם החבורה *</Label><Input id="groupName" name="groupName" required placeholder="חבורת השבת של ירושלים" defaultValue={existing?.group_name || ""} /></div>
          <div className="space-y-2"><Label htmlFor="description">על החבורה</Label><Textarea id="description" name="description" placeholder="ספרו על החבורה, האווירה והתכנים..." className="min-h-[100px]" defaultValue={existing?.description || ""} /></div>
          <div className="space-y-2"><Label>רמה דתית</Label><ReligiousSelect name="religiousLevel" defaultValue={existing?.religious_level || undefined} /></div>
          <div className="space-y-2"><Label>אזור</Label><RegionSelect name="region" defaultValue={existing?.region || undefined} /></div>
          <div className="space-y-2"><Label htmlFor="city">עיר / יישוב</Label><Input id="city" name="city" placeholder="ירושלים" defaultValue={existing?.city || ""} /></div>
          <div className="space-y-2"><Label htmlFor="groupSize">גודל החבורה הנוכחי</Label><Input id="groupSize" name="groupSize" type="number" min={2} placeholder="6" defaultValue={existing?.group_size || ""} /></div>
          <div className="space-y-2">
            <Label>את מי מעוניינים להזמין?</Label>
            <RadioGroup name="guestPref" defaultValue={existing?.guest_preference || ""} className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer"><RadioGroupItem value="men" /><span>גברים</span></label>
              <label className="flex items-center gap-2 cursor-pointer"><RadioGroupItem value="women" /><span>נשים</span></label>
              <label className="flex items-center gap-2 cursor-pointer"><RadioGroupItem value="mixed" /><span>מעורב</span></label>
            </RadioGroup>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2"><Label htmlFor="ageMin">גיל מינימום</Label><Input id="ageMin" name="ageMin" type="number" min={18} max={99} placeholder="22" defaultValue={existing?.age_range_min || ""} /></div>
            <div className="space-y-2"><Label htmlFor="ageMax">גיל מקסימום</Label><Input id="ageMax" name="ageMax" type="number" min={18} max={99} placeholder="35" defaultValue={existing?.age_range_max || ""} /></div>
          </div>
          <div className="space-y-2">
            <Label>תאריכי שבתות</Label>
            <HostDatePicker selectedDates={availableDates} onChange={setAvailableDates} alwaysAvailable={alwaysAvailable} onAlwaysAvailableChange={setAlwaysAvailable} hostType="singles_group" />
          </div>
        </>
      )}

      {category === "host_organized_shabbat" && (
        <>
          <div className="space-y-2"><Label htmlFor="orgName">שם הארגון *</Label><Input id="orgName" name="orgName" required placeholder="סמינר ערכים" defaultValue={existing?.organization_name || ""} /></div>
          <div className="space-y-2">
            <Label htmlFor="shabbatType">סוג השבת</Label>
            <Select name="shabbatType" defaultValue={existing?.shabbat_type || undefined}>
              <SelectTrigger><SelectValue placeholder="בחרו סוג" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ערכים">סמינר ערכים</SelectItem>
                <SelectItem value="שידוכים">שבת שידוכים</SelectItem>
                <SelectItem value="חווייתית">שבת חווייתית</SelectItem>
                <SelectItem value="לימודית">שבת לימודית</SelectItem>
                <SelectItem value="אחר">אחר</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2"><Label htmlFor="description">תיאור השבת</Label><Textarea id="description" name="description" placeholder="ספרו על התוכן, הסדנאות..." className="min-h-[100px]" defaultValue={existing?.description || ""} /></div>
          <div className="space-y-2"><Label>רמה דתית</Label><ReligiousSelect name="religiousLevel" defaultValue={existing?.religious_level || undefined} /></div>
          <div className="space-y-2"><Label>אזור</Label><RegionSelect name="region" defaultValue={existing?.region || undefined} /></div>
          <div className="space-y-2"><Label htmlFor="city">עיר / מיקום</Label><Input id="city" name="city" placeholder="צפת" defaultValue={existing?.city || ""} /></div>
          <div className="space-y-2"><Label htmlFor="targetAudience">קהל יעד</Label><Input id="targetAudience" name="targetAudience" placeholder="רווקים/ות 25-35, דתיים" defaultValue={existing?.target_audience || ""} /></div>
          <div className="space-y-2"><Label htmlFor="cost">עלות</Label><Input id="cost" name="cost" placeholder="450 ₪ לאדם" defaultValue={existing?.cost || ""} /></div>
          <div className="space-y-2"><Label htmlFor="regLink">קישור להרשמה</Label><Input id="regLink" name="regLink" type="url" placeholder="https://..." defaultValue={existing?.registration_link || ""} /></div>
          <div className="space-y-2">
            <Label>תאריכי שבתות</Label>
            <HostDatePicker selectedDates={availableDates} onChange={setAvailableDates} alwaysAvailable={alwaysAvailable} onAlwaysAvailableChange={setAlwaysAvailable} hostType="organized_shabbat" />
          </div>
        </>
      )}

      <Button type="submit" className="w-full rounded-full font-bold" size="lg" disabled={saving}>
        {saving ? "שומר..." : (submitLabel || "שמירת פרופיל")}
      </Button>
    </form>
  );
};

export default ProfileFormFields;

/** עוזר: טוען את הפרופיל המפורט הקיים של המשתמש לפי קטגוריה */
export async function loadExistingDetailedProfile(category: ProfileCategory, userId: string) {
  const tableMap: Record<ProfileCategory, string> = {
    single: "single_profiles",
    host_family: "host_family_profiles",
    host_work: "host_work_profiles",
    host_volunteer: "host_volunteer_profiles",
    host_singles_group: "host_singles_group_profiles",
    host_organized_shabbat: "host_organized_shabbat_profiles",
  };
  const { data } = await supabase.from(tableMap[category] as any).select("*").eq("user_id", userId).maybeSingle();
  return data;
}
