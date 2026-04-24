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
import { Clock, CheckCircle, XCircle, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import ProfileView from "@/components/profile/ProfileView";
import HostDatePicker from "@/components/profile/HostDatePicker";
import DynamicBackground from "@/components/DynamicBackground";

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

type HostType = "family" | "work" | "volunteer" | "singles_group" | "organized_shabbat" | null;

const Profile = () => {
  const { user, profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [hostType, setHostType] = useState<HostType>(null);
  const [saving, setSaving] = useState(false);
  const [mode, setMode] = useState<"view" | "edit">("view");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [detailedProfile, setDetailedProfile] = useState<any>(null);
  const [profileType, setProfileType] = useState<"single" | "family" | "work" | "volunteer" | "singles_group" | "organized_shabbat" | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [alwaysAvailable, setAlwaysAvailable] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading]);

  // Load detailed profile
  useEffect(() => {
    if (!user || !profile || profile.registration_status !== "approved") {
      setLoadingProfile(false);
      return;
    }

    const loadProfile = async () => {
      setLoadingProfile(true);
      const isSingle = profile.user_type === "single";

      if (isSingle) {
        const { data } = await supabase.from("single_profiles").select("*").eq("user_id", user.id).maybeSingle();
        if (data) {
          setDetailedProfile(data);
          setProfileType("single");
        }
      } else {
        // Try each host type
        const { data: family } = await supabase.from("host_family_profiles").select("*").eq("user_id", user.id).maybeSingle();
        if (family) {
          setDetailedProfile(family);
          setProfileType("family");
          setHostType("family");
          setAvailableDates(family.available_dates || []);
          setAlwaysAvailable((family as any).always_available || false);
          setLoadingProfile(false);
          return;
        }
        const { data: work } = await supabase.from("host_work_profiles").select("*").eq("user_id", user.id).maybeSingle();
        if (work) {
          setDetailedProfile(work);
          setProfileType("work");
          setHostType("work");
          setAvailableDates((work as any).available_dates || []);
          setAlwaysAvailable((work as any).always_available || false);
          setLoadingProfile(false);
          return;
        }
        const { data: volunteer } = await supabase.from("host_volunteer_profiles").select("*").eq("user_id", user.id).maybeSingle();
        if (volunteer) {
          setDetailedProfile(volunteer);
          setProfileType("volunteer");
          setHostType("volunteer");
          setLoadingProfile(false);
          return;
        }
        const { data: singlesGroup } = await supabase.from("host_singles_group_profiles").select("*").eq("user_id", user.id).maybeSingle();
        if (singlesGroup) {
          setDetailedProfile(singlesGroup);
          setProfileType("singles_group");
          setHostType("singles_group");
          setAvailableDates(singlesGroup.available_dates || []);
          setAlwaysAvailable((singlesGroup as any).always_available || false);
          setLoadingProfile(false);
          return;
        }
        const { data: organized } = await supabase.from("host_organized_shabbat_profiles").select("*").eq("user_id", user.id).maybeSingle();
        if (organized) {
          setDetailedProfile(organized);
          setProfileType("organized_shabbat");
          setHostType("organized_shabbat");
          setAvailableDates(organized.available_dates || []);
          setAlwaysAvailable((organized as any).always_available || false);
          setLoadingProfile(false);
          return;
        }
      }
      setLoadingProfile(false);
    };
    loadProfile();
  }, [user, profile]);

  if (authLoading || loadingProfile) return <div className="min-h-screen flex items-center justify-center">טוען...</div>;
  if (!user) return null;

  if (!profile) {
    return (
      <div className="min-h-screen">
        <DynamicBackground variant="jerusalem" />
        <Navbar />
        <div className="pt-24 text-center px-4">
          <h1 className="text-2xl font-black font-display mb-4">עדיין לא נרשמת</h1>
          <p className="text-muted-foreground mb-6">צריך למלא את טופס ההרשמה קודם</p>
          <Button onClick={() => navigate("/auth")} className="rounded-full">להרשמה</Button>
        </div>
      </div>
    );
  }

  if (profile.registration_status === "pending") {
    return (
      <div className="min-h-screen">
        <DynamicBackground variant="jerusalem" />
        <Navbar />
        <div className="pt-24 pb-12 px-4">
          <div className="mx-auto max-w-md text-center space-y-6">
            <Clock className="mx-auto h-16 w-16 text-amber-soft" />
            <h1 className="text-2xl font-black font-display">ההרשמה שלך בבדיקה</h1>
            <div className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-4 text-right">
              <p className="text-foreground leading-relaxed">
                הצוות שלנו בודק כעת את פרטי ההרשמה שלך כדי לשמור על מרחב בטוח ומכבד לכל המשתתפים.
              </p>
              <p className="text-muted-foreground text-sm leading-relaxed">
                בינתיים את/ה מוזמן/ת לגלוש באתר ולהכיר את ההזדמנויות — אך שליחת בקשות תתאפשר רק לאחר האישור.
              </p>
              <p className="text-muted-foreground text-sm">
                ⏳ זמן אישור ממוצע: עד 24 שעות
              </p>
            </div>
            <Button onClick={() => navigate("/explore")} variant="outline" className="rounded-full px-8">
              גלשו באתר בינתיים
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (profile.registration_status === "rejected") {
    return (
      <div className="min-h-screen">
        <DynamicBackground variant="jerusalem" />
        <Navbar />
        <div className="pt-24 text-center px-4">
          <XCircle className="mx-auto h-16 w-16 text-destructive mb-4" />
          <h1 className="text-2xl font-black font-display mb-2">ההרשמה לא אושרה</h1>
          <p className="text-muted-foreground">פנו אלינו לפרטים נוספים</p>
        </div>
      </div>
    );
  }

  // If we have a detailed profile and are in view mode, show it
  const showView = mode === "view" && detailedProfile && profileType;

  const isSingle = profile.user_type === "single";

  const afterSave = async () => {
    // Reload profile
    if (profileType === "single") {
      const { data } = await supabase.from("single_profiles").select("*").eq("user_id", user.id).maybeSingle();
      setDetailedProfile(data);
    } else if (profileType === "family") {
      const { data } = await supabase.from("host_family_profiles").select("*").eq("user_id", user.id).maybeSingle();
      setDetailedProfile(data);
      setAvailableDates(data?.available_dates || []);
      setAlwaysAvailable((data as any)?.always_available || false);
    } else if (profileType === "work") {
      const { data } = await supabase.from("host_work_profiles").select("*").eq("user_id", user.id).maybeSingle();
      setDetailedProfile(data);
      setAvailableDates((data as any)?.available_dates || []);
      setAlwaysAvailable((data as any)?.always_available || false);
    } else if (profileType === "volunteer") {
      const { data } = await supabase.from("host_volunteer_profiles").select("*").eq("user_id", user.id).maybeSingle();
      setDetailedProfile(data);
    } else if (profileType === "singles_group") {
      const { data } = await supabase.from("host_singles_group_profiles").select("*").eq("user_id", user.id).maybeSingle();
      setDetailedProfile(data);
      setAvailableDates(data?.available_dates || []);
      setAlwaysAvailable((data as any)?.always_available || false);
    } else if (profileType === "organized_shabbat") {
      const { data } = await supabase.from("host_organized_shabbat_profiles").select("*").eq("user_id", user.id).maybeSingle();
      setDetailedProfile(data);
      setAvailableDates(data?.available_dates || []);
      setAlwaysAvailable((data as any)?.always_available || false);
    }
    setMode("view");
  };

  const handleSingleProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const form = new FormData(e.currentTarget);

    // Optional profile image upload
    let profileImageUrl = detailedProfile?.profile_image_url || null;
    const imgFile = form.get("profileImage") as File | null;
    if (imgFile && imgFile.size > 0) {
      const ext = imgFile.name.split(".").pop();
      const path = `${user.id}/profile-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("profile-images").upload(path, imgFile, { upsert: true });
      if (upErr) {
        toast({ title: "שגיאה בהעלאת תמונה", description: upErr.message, variant: "destructive" });
        setSaving(false);
        return;
      }
      const { data: pub } = supabase.storage.from("profile-images").getPublicUrl(path);
      profileImageUrl = pub.publicUrl;
    }

    const data = {
      user_id: user.id,
      age: parseInt(form.get("age") as string) || null,
      gender: form.get("gender") as any || null,
      religious_level: form.get("religiousLevel") as any || null,
      region: form.get("region") as any || null,
      city: form.get("city") as string || null,
      about_me: form.get("aboutMe") as string || null,
      profile_image_url: profileImageUrl,
      kashrut_preference: (form.get("kashrutPref") as any) || null,
      dietary_preference: (form.get("dietaryPref") as any) || null,
    };
    const { error } = await supabase.from("single_profiles").upsert(data, { onConflict: "user_id" });
    if (error) {
      toast({ title: "שגיאה", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "הפרופיל נשמר! ✨" });
      setProfileType("single");
      await afterSave();
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
      kashrut_level: form.get("kashrutLevel") as any || null,
      guest_preference: form.get("guestPref") as any || null,
      region: form.get("region") as any || null,
      city: form.get("city") as string || null,
      available_dates: alwaysAvailable ? null : (availableDates.length > 0 ? availableDates : null),
      always_available: alwaysAvailable,
    };
    const { error } = await supabase.from("host_family_profiles").upsert(data, { onConflict: "user_id" });
    if (error) {
      toast({ title: "שגיאה", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "הפרופיל נשמר! ✨" });
      setProfileType("family");
      await afterSave();
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
      available_dates: alwaysAvailable ? null : (availableDates.length > 0 ? availableDates : null),
      always_available: alwaysAvailable,
    };
    const { error } = await supabase.from("host_work_profiles").upsert(data, { onConflict: "user_id" });
    if (error) {
      toast({ title: "שגיאה", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "הפרופיל נשמר! ✨" });
      setProfileType("work");
      await afterSave();
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
      setProfileType("volunteer");
      await afterSave();
    }
    setSaving(false);
  };

  const handleSinglesGroupProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const form = new FormData(e.currentTarget);
    const data = {
      user_id: user.id,
      group_name: form.get("groupName") as string,
      description: form.get("description") as string || null,
      religious_level: form.get("religiousLevel") as any || null,
      region: form.get("region") as any || null,
      city: form.get("city") as string || null,
      group_size: parseInt(form.get("groupSize") as string) || null,
      guest_preference: form.get("guestPref") as any || null,
      age_range_min: parseInt(form.get("ageMin") as string) || null,
      age_range_max: parseInt(form.get("ageMax") as string) || null,
      available_dates: alwaysAvailable ? null : (availableDates.length > 0 ? availableDates : null),
      always_available: alwaysAvailable,
    };
    const { error } = await supabase.from("host_singles_group_profiles").upsert(data, { onConflict: "user_id" });
    if (error) {
      toast({ title: "שגיאה", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "הפרופיל נשמר! ✨" });
      setProfileType("singles_group");
      await afterSave();
    }
    setSaving(false);
  };

  const handleOrganizedShabbatProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const form = new FormData(e.currentTarget);
    const data = {
      user_id: user.id,
      organization_name: form.get("orgName") as string,
      shabbat_type: form.get("shabbatType") as string || null,
      description: form.get("description") as string || null,
      religious_level: form.get("religiousLevel") as any || null,
      region: form.get("region") as any || null,
      city: form.get("city") as string || null,
      cost: form.get("cost") as string || null,
      registration_link: form.get("regLink") as string || null,
      target_audience: form.get("targetAudience") as string || null,
      available_dates: alwaysAvailable ? null : (availableDates.length > 0 ? availableDates : null),
      always_available: alwaysAvailable,
    };
    const { error } = await supabase.from("host_organized_shabbat_profiles").upsert(data, { onConflict: "user_id" });
    if (error) {
      toast({ title: "שגיאה", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "הפרופיל נשמר! ✨" });
      setProfileType("organized_shabbat");
      await afterSave();
    }
    setSaving(false);
  };

  const RegionSelect = ({ name, defaultValue }: { name: string; defaultValue?: string }) => (
    <Select name={name} defaultValue={defaultValue}>
      <SelectTrigger><SelectValue placeholder="בחרו אזור" /></SelectTrigger>
      <SelectContent>
        {Object.entries(regionLabels).map(([value, label]) => (
          <SelectItem key={value} value={value}>{label}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  const ReligiousSelect = ({ name, defaultValue }: { name: string; defaultValue?: string }) => (
    <Select name={name} defaultValue={defaultValue}>
      <SelectTrigger><SelectValue placeholder="בחרו רמה" /></SelectTrigger>
      <SelectContent>
        {Object.entries(religiousLabels).map(([value, label]) => (
          <SelectItem key={value} value={value}>{label}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  const KashrutSelect = ({ name, defaultValue }: { name: string; defaultValue?: string }) => (
    <Select name={name} defaultValue={defaultValue}>
      <SelectTrigger><SelectValue placeholder="בחרו רמת כשרות" /></SelectTrigger>
      <SelectContent>
        {Object.entries(kashrutLabels).map(([value, label]) => (
          <SelectItem key={value} value={value}>{label}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  return (
    <div className="min-h-screen">
      <DynamicBackground variant="jerusalem" />
      <Navbar />
      <div className="pt-24 pb-12 px-4">
        <div className="mx-auto max-w-lg">
          {showView ? (
            <>
              <div className="text-center mb-6 space-y-3">
                <h1 className="text-3xl font-black font-display">הפרופיל שלי</h1>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPreviewOpen(true)}
                  className="rounded-full gap-2"
                >
                  <Eye className="h-4 w-4" />
                  איך רואים אותי?
                </Button>
              </div>
              <ProfileView
                profile={profile}
                detailedProfile={detailedProfile}
                profileType={profileType!}
                onEdit={() => setMode("edit")}
              />

              <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
                <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-center font-display">כך אחרים רואים את הפרופיל שלך</DialogTitle>
                    <DialogDescription className="text-center text-xs">
                      תצוגה מקדימה — בדיוק מה שמשתמשים אחרים יראו כשייתקלו בפרופיל שלך באתר
                    </DialogDescription>
                  </DialogHeader>
                  <div className="pt-2">
                    <ProfileView
                      profile={profile}
                      detailedProfile={detailedProfile}
                      profileType={profileType!}
                      onEdit={() => {}}
                      previewMode
                    />
                  </div>
                </DialogContent>
              </Dialog>
            </>
          ) : (
            <>
              <div className="text-center mb-8">
                <CheckCircle className="mx-auto h-12 w-12 text-secondary mb-3" />
                <h1 className="text-3xl font-black font-display">
                  {detailedProfile ? "עריכת פרופיל" : "בניית הפרופיל"}
                </h1>
                <p className="text-muted-foreground mt-1">שלום {profile.full_name}! 👋</p>
                {detailedProfile && (
                  <Button variant="ghost" size="sm" onClick={() => setMode("view")} className="mt-2">
                    ← חזרה לתצוגה
                  </Button>
                )}
              </div>

              {isSingle ? (
                <form onSubmit={handleSingleProfile} className="space-y-5 rounded-2xl border border-border bg-card p-8 shadow-card">
                  <h2 className="text-xl font-bold font-display text-center">🙋 פרופיל רווק/ה</h2>

                  {/* Profile image */}
                  <div className="space-y-2">
                    <Label htmlFor="profileImage">תמונת פרופיל (אופציונלי)</Label>
                    {detailedProfile?.profile_image_url && (
                      <img
                        src={detailedProfile.profile_image_url}
                        alt="תמונת פרופיל"
                        className="h-24 w-24 rounded-full object-cover border-2 border-border"
                      />
                    )}
                    <Input id="profileImage" name="profileImage" type="file" accept="image/*" className="cursor-pointer" />
                    <p className="text-xs text-muted-foreground">תמונה אישית תעזור למארחים להכיר אותך</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="age">גיל</Label>
                    <Input id="age" name="age" type="number" min={18} max={99} placeholder="25" defaultValue={detailedProfile?.age || ""} />
                  </div>
                  <div className="space-y-2">
                    <Label>מגדר</Label>
                    <RadioGroup name="gender" defaultValue={detailedProfile?.gender || ""} className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer"><RadioGroupItem value="men" /><span>גבר</span></label>
                      <label className="flex items-center gap-2 cursor-pointer"><RadioGroupItem value="women" /><span>אישה</span></label>
                    </RadioGroup>
                  </div>
                  <div className="space-y-2">
                    <Label>רמה דתית</Label>
                    <ReligiousSelect name="religiousLevel" defaultValue={detailedProfile?.religious_level || undefined} />
                  </div>
                  <div className="space-y-2">
                    <Label>אזור מגורים</Label>
                    <RegionSelect name="region" defaultValue={detailedProfile?.region || undefined} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">עיר / יישוב</Label>
                    <Input id="city" name="city" placeholder="תל אביב" defaultValue={detailedProfile?.city || ""} />
                  </div>

                  {/* Food preferences */}
                  <div className="space-y-2">
                    <Label>העדפת כשרות</Label>
                    <KashrutSelect name="kashrutPref" defaultValue={detailedProfile?.kashrut_preference || undefined} />
                  </div>
                  <div className="space-y-2">
                    <Label>העדפות תזונה</Label>
                    <Select name="dietaryPref" defaultValue={detailedProfile?.dietary_preference || undefined}>
                      <SelectTrigger><SelectValue placeholder="בחרו" /></SelectTrigger>
                      <SelectContent>
                        {Object.entries(dietaryLabels).map(([value, label]) => (
                          <SelectItem key={value} value={value}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="aboutMe">קצת עלי</Label>
                    <Textarea id="aboutMe" name="aboutMe" placeholder="ספרו קצת על עצמכם..." className="min-h-[100px]" defaultValue={detailedProfile?.about_me || ""} />
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
                        { type: "singles_group" as const, label: "חבורת רווקים/ות", desc: "אנחנו חבורת רווקים/ות שמתארגנים על שבת ביחד" },
                        { type: "organized_shabbat" as const, label: "שבת מאורגנת", desc: "סמינר ערכים, שבת שידוכים, ארגון" },
                        { type: "work" as const, label: "מקום עבודה", desc: "הצעת עבודה זמנית או קבועה" },
                        { type: "volunteer" as const, label: "מקום התנדבות", desc: "חווה, בית ילד, בית חב״ד ועוד" },
                      ]).map((opt) => (
                        <button key={opt.type} onClick={() => setHostType(opt.type)}
                          className="flex w-full items-center gap-4 rounded-2xl border-2 border-border bg-background p-4 text-right transition-all hover:border-primary hover:shadow-md">
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
                        <Textarea id="aboutUs" name="aboutUs" placeholder="ספרו קצת על המשפחה..." className="min-h-[100px]" defaultValue={detailedProfile?.about_us || ""} />
                      </div>
                      <div className="space-y-2">
                        <Label>רמה דתית</Label>
                        <ReligiousSelect name="religiousLevel" defaultValue={detailedProfile?.religious_level || undefined} />
                      </div>
                      <div className="space-y-2">
                        <Label>רמת כשרות</Label>
                        <KashrutSelect name="kashrutLevel" defaultValue={detailedProfile?.kashrut_level || undefined} />
                      </div>
                      <div className="space-y-2">
                        <Label>את מי מעוניינים להזמין?</Label>
                        <RadioGroup name="guestPref" defaultValue={detailedProfile?.guest_preference || ""} className="flex gap-4">
                          <label className="flex items-center gap-2 cursor-pointer"><RadioGroupItem value="men" /><span>גברים</span></label>
                          <label className="flex items-center gap-2 cursor-pointer"><RadioGroupItem value="women" /><span>נשים</span></label>
                          <label className="flex items-center gap-2 cursor-pointer"><RadioGroupItem value="mixed" /><span>מעורב</span></label>
                        </RadioGroup>
                      </div>
                      <div className="space-y-2">
                        <Label>אזור מגורים</Label>
                        <RegionSelect name="region" defaultValue={detailedProfile?.region || undefined} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="city">עיר / יישוב</Label>
                        <Input id="city" name="city" placeholder="הרצליה" defaultValue={detailedProfile?.city || ""} />
                      </div>
                      <div className="space-y-2">
                        <Label>תאריכים פנויים לאירוח</Label>
                        <HostDatePicker
                          selectedDates={availableDates}
                          onChange={setAvailableDates}
                          alwaysAvailable={alwaysAvailable}
                          onAlwaysAvailableChange={setAlwaysAvailable}
                        />
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
                        <Input id="placeName" name="placeName" required placeholder='מלון רמת רחל' defaultValue={detailedProfile?.place_name || ""} />
                      </div>
                      <div className="space-y-2"><Label>אזור</Label><RegionSelect name="region" defaultValue={detailedProfile?.region || undefined} /></div>
                      <div className="space-y-2"><Label htmlFor="city">עיר / מיקום</Label><Input id="city" name="city" placeholder="ירושלים" defaultValue={detailedProfile?.city || ""} /></div>
                      <div className="space-y-2"><Label htmlFor="jobDescription">מה העבודה?</Label><Textarea id="jobDescription" name="jobDescription" placeholder="תיאור המשרה..." defaultValue={detailedProfile?.job_description || ""} /></div>
                      <div className="space-y-2"><Label htmlFor="payment">תשלום</Label><Input id="payment" name="payment" placeholder="150 ₪ לשעה" defaultValue={detailedProfile?.payment || ""} /></div>
                      <div className="space-y-2">
                        <Label>סוג העסקה</Label>
                        <RadioGroup name="isPermanent" defaultValue={detailedProfile?.is_permanent ? "true" : "false"} className="flex gap-4">
                          <label className="flex items-center gap-2 cursor-pointer"><RadioGroupItem value="false" /><span>זמני / חד פעמי</span></label>
                          <label className="flex items-center gap-2 cursor-pointer"><RadioGroupItem value="true" /><span>עובד/ת קבוע/ה</span></label>
                        </RadioGroup>
                      </div>
                      <div className="space-y-2">
                        <Label>העדפת מגדר</Label>
                        <RadioGroup name="genderPref" defaultValue={detailedProfile?.gender_preference || ""} className="flex gap-4">
                          <label className="flex items-center gap-2 cursor-pointer"><RadioGroupItem value="men" /><span>גברים</span></label>
                          <label className="flex items-center gap-2 cursor-pointer"><RadioGroupItem value="women" /><span>נשים</span></label>
                          <label className="flex items-center gap-2 cursor-pointer"><RadioGroupItem value="mixed" /><span>מעורב</span></label>
                        </RadioGroup>
                      </div>
                      <div className="space-y-2"><Label htmlFor="teamSize">מספר אנשי צוות נדרשים</Label><Input id="teamSize" name="teamSize" type="number" min={1} placeholder="3" defaultValue={detailedProfile?.team_size || ""} /></div>
                      <div className="space-y-2"><Label htmlFor="specialReq">דרישות מיוחדות</Label><Textarea id="specialReq" name="specialReq" placeholder="תואר, רישיון לנשק, ניסיון..." defaultValue={detailedProfile?.special_requirements || ""} /></div>
                      <div className="space-y-2">
                        <Label>תאריכים פנויים</Label>
                        <HostDatePicker
                          selectedDates={availableDates}
                          onChange={setAvailableDates}
                          alwaysAvailable={alwaysAvailable}
                          onAlwaysAvailableChange={setAlwaysAvailable}
                        />
                      </div>
                      <Button type="submit" className="w-full rounded-full font-bold" size="lg" disabled={saving}>{saving ? "שומר..." : "שמירת פרופיל"}</Button>
                    </form>
                  ) : hostType === "volunteer" ? (
                    <form onSubmit={handleVolunteerProfile} className="space-y-5 rounded-2xl border border-border bg-card p-8 shadow-card">
                      <button type="button" onClick={() => setHostType(null)} className="text-sm text-primary hover:underline">← חזרה</button>
                      <h2 className="text-xl font-bold font-display text-center">🤝 מקום התנדבות</h2>
                      <div className="space-y-2"><Label htmlFor="placeName">שם המקום *</Label><Input id="placeName" name="placeName" required placeholder='בית חב"ד הרצליה' defaultValue={detailedProfile?.place_name || ""} /></div>
                      <div className="space-y-2">
                        <Label htmlFor="volunteerType">סוג ההתנדבות</Label>
                        <Select name="volunteerType" defaultValue={detailedProfile?.volunteer_type || undefined}>
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
                      <div className="space-y-2"><Label>אזור</Label><RegionSelect name="region" defaultValue={detailedProfile?.region || undefined} /></div>
                      <div className="space-y-2"><Label htmlFor="city">עיר / מיקום</Label><Input id="city" name="city" placeholder="כפר חב״ד" defaultValue={detailedProfile?.city || ""} /></div>
                      <div className="space-y-2"><Label htmlFor="specialReq">דרישות מיוחדות</Label><Textarea id="specialReq" name="specialReq" placeholder="כושר פיזי, ניסיון עם ילדים..." defaultValue={detailedProfile?.special_requirements || ""} /></div>
                      <div className="space-y-3 rounded-xl border border-border bg-background p-4">
                        <h4 className="font-bold text-sm">מה כלול?</h4>
                        <div className="flex items-center gap-2">
                          <Checkbox id="accommodation" name="accommodation" defaultChecked={detailedProfile?.provides_accommodation} />
                          <Label htmlFor="accommodation" className="cursor-pointer">מקום לינה</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Checkbox id="meals" name="meals" defaultChecked={detailedProfile?.provides_meals} />
                          <Label htmlFor="meals" className="cursor-pointer">ארוחות</Label>
                        </div>
                      </div>
                      <Button type="submit" className="w-full rounded-full font-bold" size="lg" disabled={saving}>{saving ? "שומר..." : "שמירת פרופיל"}</Button>
                    </form>
                  ) : hostType === "singles_group" ? (
                    <form onSubmit={handleSinglesGroupProfile} className="space-y-5 rounded-2xl border border-border bg-card p-8 shadow-card">
                      <button type="button" onClick={() => setHostType(null)} className="text-sm text-primary hover:underline">← חזרה</button>
                      <h2 className="text-xl font-bold font-display text-center">✨ חבורת רווקים/ות</h2>
                      <div className="space-y-2"><Label htmlFor="groupName">שם החבורה *</Label><Input id="groupName" name="groupName" required placeholder="חבורת השבת של ירושלים" defaultValue={detailedProfile?.group_name || ""} /></div>
                      <div className="space-y-2"><Label htmlFor="description">על החבורה</Label><Textarea id="description" name="description" placeholder="ספרו על החבורה, האווירה והתכנים..." className="min-h-[100px]" defaultValue={detailedProfile?.description || ""} /></div>
                      <div className="space-y-2"><Label>רמה דתית</Label><ReligiousSelect name="religiousLevel" defaultValue={detailedProfile?.religious_level || undefined} /></div>
                      <div className="space-y-2"><Label>אזור</Label><RegionSelect name="region" defaultValue={detailedProfile?.region || undefined} /></div>
                      <div className="space-y-2"><Label htmlFor="city">עיר / יישוב</Label><Input id="city" name="city" placeholder="ירושלים" defaultValue={detailedProfile?.city || ""} /></div>
                      <div className="space-y-2"><Label htmlFor="groupSize">גודל החבורה הנוכחי</Label><Input id="groupSize" name="groupSize" type="number" min={2} placeholder="6" defaultValue={detailedProfile?.group_size || ""} /></div>
                      <div className="space-y-2">
                        <Label>את מי מעוניינים להזמין?</Label>
                        <RadioGroup name="guestPref" defaultValue={detailedProfile?.guest_preference || ""} className="flex gap-4">
                          <label className="flex items-center gap-2 cursor-pointer"><RadioGroupItem value="men" /><span>גברים</span></label>
                          <label className="flex items-center gap-2 cursor-pointer"><RadioGroupItem value="women" /><span>נשים</span></label>
                          <label className="flex items-center gap-2 cursor-pointer"><RadioGroupItem value="mixed" /><span>מעורב</span></label>
                        </RadioGroup>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2"><Label htmlFor="ageMin">גיל מינימום</Label><Input id="ageMin" name="ageMin" type="number" min={18} max={99} placeholder="22" defaultValue={detailedProfile?.age_range_min || ""} /></div>
                        <div className="space-y-2"><Label htmlFor="ageMax">גיל מקסימום</Label><Input id="ageMax" name="ageMax" type="number" min={18} max={99} placeholder="35" defaultValue={detailedProfile?.age_range_max || ""} /></div>
                      </div>
                      <div className="space-y-2">
                        <Label>תאריכי שבתות</Label>
                        <HostDatePicker
                          selectedDates={availableDates}
                          onChange={setAvailableDates}
                          alwaysAvailable={alwaysAvailable}
                          onAlwaysAvailableChange={setAlwaysAvailable}
                        />
                      </div>
                      <Button type="submit" className="w-full rounded-full font-bold" size="lg" disabled={saving}>{saving ? "שומר..." : "שמירת פרופיל"}</Button>
                    </form>
                  ) : (
                    <form onSubmit={handleOrganizedShabbatProfile} className="space-y-5 rounded-2xl border border-border bg-card p-8 shadow-card">
                      <button type="button" onClick={() => setHostType(null)} className="text-sm text-primary hover:underline">← חזרה</button>
                      <h2 className="text-xl font-bold font-display text-center">📅 שבת מאורגנת</h2>
                      <div className="space-y-2"><Label htmlFor="orgName">שם הארגון *</Label><Input id="orgName" name="orgName" required placeholder="סמינר ערכים" defaultValue={detailedProfile?.organization_name || ""} /></div>
                      <div className="space-y-2">
                        <Label htmlFor="shabbatType">סוג השבת</Label>
                        <Select name="shabbatType" defaultValue={detailedProfile?.shabbat_type || undefined}>
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
                      <div className="space-y-2"><Label htmlFor="description">תיאור השבת</Label><Textarea id="description" name="description" placeholder="ספרו על התוכן, הסדנאות, האווירה..." className="min-h-[100px]" defaultValue={detailedProfile?.description || ""} /></div>
                      <div className="space-y-2"><Label>רמה דתית</Label><ReligiousSelect name="religiousLevel" defaultValue={detailedProfile?.religious_level || undefined} /></div>
                      <div className="space-y-2"><Label>אזור</Label><RegionSelect name="region" defaultValue={detailedProfile?.region || undefined} /></div>
                      <div className="space-y-2"><Label htmlFor="city">עיר / מיקום</Label><Input id="city" name="city" placeholder="צפת" defaultValue={detailedProfile?.city || ""} /></div>
                      <div className="space-y-2"><Label htmlFor="targetAudience">קהל יעד</Label><Input id="targetAudience" name="targetAudience" placeholder="רווקים/ות 25-35, דתיים" defaultValue={detailedProfile?.target_audience || ""} /></div>
                      <div className="space-y-2"><Label htmlFor="cost">עלות</Label><Input id="cost" name="cost" placeholder="450 ₪ לאדם" defaultValue={detailedProfile?.cost || ""} /></div>
                      <div className="space-y-2"><Label htmlFor="regLink">קישור להרשמה</Label><Input id="regLink" name="regLink" type="url" placeholder="https://..." defaultValue={detailedProfile?.registration_link || ""} /></div>
                      <div className="space-y-2">
                        <Label>תאריכי שבתות</Label>
                        <HostDatePicker
                          selectedDates={availableDates}
                          onChange={setAvailableDates}
                          alwaysAvailable={alwaysAvailable}
                          onAlwaysAvailableChange={setAlwaysAvailable}
                        />
                      </div>
                      <Button type="submit" className="w-full rounded-full font-bold" size="lg" disabled={saving}>{saving ? "שומר..." : "שמירת פרופיל"}</Button>
                    </form>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
