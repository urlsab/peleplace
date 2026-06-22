import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import Navbar from "@/components/Navbar";
import ProfileView from "@/components/profile/ProfileView";
import DynamicBackground from "@/components/DynamicBackground";
import PersonalInfoCard from "@/components/profile/PersonalInfoCard";
import ShabbatOfferSection from "@/components/profile/ShabbatOfferSection";

const Profile = () => {
  const { user, profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [localProfile, setLocalProfile] = useState<any>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [detailedProfile, setDetailedProfile] = useState<any>(null);
  const [profileType, setProfileType] = useState<"single" | "family" | "work" | "volunteer" | "singles_group" | "organized_shabbat" | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [activeRole, setActiveRole] = useState<"single" | "host">("single");
  const [hasSingleProfile, setHasSingleProfile] = useState(false);
  const [hasHostProfile, setHasHostProfile] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading]);

  useEffect(() => {
    if (profile?.user_type) {
      const role = profile.user_type === "host" ? "host" : "single";
      setActiveRole(role);
    }
  }, [profile?.user_type]);

  useEffect(() => {
    if (!user || !profile) { setLoadingProfile(false); return; }
    const load = async () => {
      setLoadingProfile(true);
      setDetailedProfile(null);
      setProfileType(null);

      const [singleCheck, fam, wrk, vol, sg, org] = await Promise.all([
        supabase.from("single_profiles").select("user_id").eq("user_id", user.id).maybeSingle(),
        supabase.from("host_family_profiles").select("user_id").eq("user_id", user.id).maybeSingle(),
        supabase.from("host_work_profiles").select("user_id").eq("user_id", user.id).maybeSingle(),
        supabase.from("host_volunteer_profiles").select("user_id").eq("user_id", user.id).maybeSingle(),
        supabase.from("host_singles_group_profiles").select("user_id").eq("user_id", user.id).maybeSingle(),
        supabase.from("host_organized_shabbat_profiles").select("user_id").eq("user_id", user.id).maybeSingle(),
      ]);
      setHasSingleProfile(!!singleCheck.data);
      setHasHostProfile(!!(fam.data || wrk.data || vol.data || sg.data || org.data));

      if (activeRole === "single") {
        const { data } = await supabase.from("single_profiles").select("*").eq("user_id", user.id).maybeSingle();
        if (data) { setDetailedProfile(data); setProfileType("single"); }
      } else {
        for (const [tbl, type] of [
          ["host_family_profiles", "family"],
          ["host_work_profiles", "work"],
          ["host_volunteer_profiles", "volunteer"],
          ["host_singles_group_profiles", "singles_group"],
          ["host_organized_shabbat_profiles", "organized_shabbat"],
        ] as const) {
          const { data } = await supabase.from(tbl as any).select("*").eq("user_id", user.id).maybeSingle();
          if (data) { setDetailedProfile(data); setProfileType(type as any); break; }
        }
      }
      setLoadingProfile(false);
    };
    load();
  }, [user, profile, activeRole]);

  const displayProfile = localProfile ?? profile;
  const showBothToggle = (profile?.user_type === "both") || (hasSingleProfile && hasHostProfile);

  if (authLoading || loadingProfile) return <div className="min-h-screen flex items-center justify-center">טוען...</div>;
  if (!user) return null;

  if (!profile && !localProfile) {
    return (
      <div className="min-h-screen">
        <DynamicBackground variant="jerusalem" />
        <Navbar />
        <div className="pt-24 text-center px-4">
          <h1 className="text-2xl font-black font-display mb-4">עדיין לא נרשמת</h1>
          <p className="text-muted-foreground mb-6">צריך למלא את טופס ההרשמה קודם</p>
          <Button onClick={() => navigate("/register")} className="rounded-full">להרשמה</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <DynamicBackground variant="jerusalem" />
      <Navbar />
      <div className="pt-24 pb-12 px-4">
        <div className="mx-auto max-w-lg">
          <PersonalInfoCard
            profile={displayProfile}
            onProfileUpdated={(updated) => setLocalProfile(updated)}
          />

          {/* Role toggle — only for 'both' users or users who have built both profiles */}
          {showBothToggle && (
            <div className="mb-6 rounded-full bg-card/95 backdrop-blur-sm border border-border p-1 shadow-card flex items-center text-sm font-bold">
              <button
                type="button"
                onClick={() => setActiveRole("single")}
                className={`flex-1 rounded-full py-2 px-3 transition-all flex items-center justify-center gap-1.5 ${
                  activeRole === "single" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                🙋 רווק/ה
              </button>
              <button
                type="button"
                onClick={() => setActiveRole("host")}
                className={`flex-1 rounded-full py-2 px-3 transition-all flex items-center justify-center gap-1.5 ${
                  activeRole === "host" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                🏡 מארח/ת
              </button>
            </div>
          )}

          {detailedProfile && profileType ? (
            <>
              <div className="text-center mb-6 space-y-3">
                <h1 className="text-3xl font-black font-display">הפרופיל שלי</h1>
                <Button variant="outline" size="sm" onClick={() => setPreviewOpen(true)} className="rounded-full gap-2">
                  <Eye className="h-4 w-4" />
                  איך רואים אותי?
                </Button>
              </div>
              <ProfileView
                profile={displayProfile}
                detailedProfile={detailedProfile}
                profileType={profileType}
                onEdit={() => {}}
              />
              <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
                <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-center font-display">כך אחרים רואים את הפרופיל שלך</DialogTitle>
                    <DialogDescription className="text-center text-xs">
                      תצוגה מקדימה — בדיוק מה שמשתמשים אחרים יראו כשייתקלו בפרופיל שלך
                    </DialogDescription>
                  </DialogHeader>
                  <div className="pt-2">
                    <ProfileView profile={displayProfile} detailedProfile={detailedProfile} profileType={profileType} onEdit={() => {}} previewMode />
                  </div>
                </DialogContent>
              </Dialog>
            </>
          ) : (
            <ProfileView
              profile={displayProfile}
              detailedProfile={null}
              profileType={"single"}
              onEdit={() => navigate("/register")}
            />
          )}

          <ShabbatOfferSection />
        </div>
      </div>
    </div>
  );
};

export default Profile;