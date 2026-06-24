import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Upload, Eye, EyeOff } from "lucide-react";
import DynamicBackground from "@/components/DynamicBackground";
import Navbar from "@/components/Navbar";
import { type ProfileCategory } from "@/components/profile/ProfileFormFields";
import peleTextsLogo from "@/assets/pele_texts-removebg-preview.png";

type RegistrationCategory = ProfileCategory;

const CATEGORIES: {
  value: RegistrationCategory;
  label: string;
  description: string;
}[] = [
  { value: "single", label: "אורח/ת", description: "מחפש/ת מקום לשבת או חג וכד'" },
  { value: "host_family", label: "מארח/ת", description: "מארחים לארוחות שבת וחג וכד'" },
  { value: "host_reservist", label: "אורח/ת ומארח/ת", description: "המשתמש/ת יכול להיות גם אורח/ת וגם מארח/ת" },
  // { value: "host_organized_shabbat", label: "ארגון לשבתות", description: "מארגנים שבתות קבוצתיות" },
  // { value: "host_singles_group", label: "קבוצת רווקים", description: "מפעילים קהילה לרווקים" },
  // { value: "host_volunteer", label: "מקום להתנדבות", description: "מציעים התנדבות בשבת/חג" },
  // { value: "host_work", label: "מקום עבודה", description: "מציעים עבודה בשבת/חג" },
];

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Registration fields
  const [category, setCategory] = useState<RegistrationCategory | null>(null);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [recommenderName, setRecommenderName] = useState("");
  const [recommenderPhone, setRecommenderPhone] = useState("");
  const [recommenderRelationship, setRecommenderRelationship] = useState("");
  const [idFile, setIdFile] = useState<File | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showEmailConfirmationHint, setShowEmailConfirmationHint] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, profile, loading: authLoading, signOut } = useAuth();

  useEffect(() => {
    const isConfirmed = sessionStorage.getItem("pele_registration_confirmed_popup") === "1";
    if (!isConfirmed) return;

    sessionStorage.removeItem("pele_registration_confirmed_popup");
    setIsLogin(true);
    setShowEmailConfirmationHint(false);
    toast({
      title: "ההרשמה הושלמה בהצלחה",
      description: "אישור המייל התקבל. אפשר להתחבר עכשיו.",
    });
  }, [toast]);

  useEffect(() => {
    if (authLoading || !user) return;

    const attemptedGoogleLogin = sessionStorage.getItem("pele_google_login_attempt") === "1";

    if (!profile) {
      if (attemptedGoogleLogin) {
        sessionStorage.removeItem("pele_google_login_attempt");
        void signOut().finally(() => navigate("/auth/not-registered", { replace: true }));
      }
      return;
    }

    if (attemptedGoogleLogin) {
      const hasManualRegistrationData =
        !!profile.terms_accepted_at &&
        !!profile.phone &&
        !!profile.recommender_name &&
        !!profile.recommender_phone &&
        !!profile.recommender_relationship;

      if (!hasManualRegistrationData) {
        sessionStorage.removeItem("pele_google_login_attempt");
        void signOut().finally(() => navigate("/auth/not-registered", { replace: true }));
        return;
      }

      sessionStorage.removeItem("pele_google_login_attempt");
    }

    if (profile.registration_status === "pending") {
      navigate("/profile", { replace: true });
      return;
    }

    if (profile.registration_status === "rejected") {
      void signOut();
      toast({
        title: "ההרשמה שלך לא אושרה",
        description: "פנו אלינו לפרטים נוספים.",
        variant: "destructive",
      });
      return;
    }

    navigate("/explore", { replace: true });
  }, [user, profile, authLoading, navigate, signOut, toast]);

const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

  sessionStorage.removeItem("pele_google_login_attempt");

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      toast({ title: "שגיאה בהתחברות", description: error.message, variant: "destructive" });
      setLoading(false);
      return;
    }

    const signedInUser = data.user;
    if (signedInUser) {
      navigate("/");
    }

    setLoading(false);
  };
  

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !termsAccepted || !gender || !dateOfBirth || !recommenderName.trim() || !recommenderPhone.trim() || !recommenderRelationship.trim()) return;
    setLoading(true);

    try {
      // 1. Create auth account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/confirmed`,
          data: {
            registration_source: "manual",
            full_name: fullName,
            email,
            phone,
            user_type: category === "single" ? "single" : "host",
            host_subtype: category === "single" ? null : category,
            gender,
            date_of_birth: dateOfBirth,
            recommender_name: recommenderName,
            recommender_phone: recommenderPhone,
            recommender_relationship: recommenderRelationship,
          },
        },
      });
      if (authError) throw authError;
      if (!authData.user?.id) throw new Error("לא התקבל מזהה משתמש");

      // Save profile metadata for post-confirmation completion.
      const userType = category === "single" ? "single" : "host";
      const hostSubtype = category === "single" ? null : category;

      const { error: updateMetadataError } = await supabase.auth.updateUser({
        data: {
          registration_source: "manual",
          full_name: fullName,
          email,
          phone,
          user_type: userType,
          host_subtype: hostSubtype,
          gender,
          date_of_birth: dateOfBirth,
          recommender_name: recommenderName,
          recommender_phone: recommenderPhone,
          recommender_relationship: recommenderRelationship,
        },
      });
      if (updateMetadataError) {
        console.warn("Could not update user metadata after signup:", updateMetadataError.message);
      }

      toast({
        title: "ההרשמה הצליחה",
        description: "נשלח אליך מייל לאימות הכתובת. נעביר אותך לעמוד ההמתנה לאישור.",
      });

      navigate("/auth/pending-confirmation", { replace: true });
    } catch (error: any) {
      toast({
        title: "שגיאה בהרשמה",
        description: error.message || "משהו השתבש, נסו שוב",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotLoading(true);

    try {
      // Check if the email is registered in the system
      const { data: isRegistered, error: rpcError } = await supabase.rpc(
        "check_email_registered",
        { p_email: forgotEmail.trim().toLowerCase() }
      );

      if (rpcError) throw rpcError;

      if (!isRegistered) {
        toast({
          title: "כתובת המייל אינה רשומה במערכת",
          description: "לא נמצא חשבון עם כתובת מייל זו. בדקו את הכתובת או הצטרפו לפל\"א.",
          variant: "destructive",
        });
        setForgotLoading(false);
        return;
      }

      const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail.trim(), {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) throw error;

      setForgotSent(true);
    } catch (error: any) {
      toast({
        title: "שגיאה בשליחת הבקשה",
        description: error.message || "משהו השתבש, נסו שוב",
        variant: "destructive",
      });
    } finally {
      setForgotLoading(false);
    }
  };

const handleGoogleSignIn = async () => {
  if (!isLogin) {
    toast({
      title: "הרשמה עם Google אינה זמינה",
      description: "כדי להצטרף לפל״א יש למלא את טופס ההרשמה. לאחר שהבקשה תאושר, תוכל/י להתחבר עם Google.",
      variant: "destructive",
    });
    return;
  }
  setGoogleLoading(true);
  try {
    sessionStorage.setItem("pele_google_login_attempt", "1");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth` },
    });
    if (error) {
      sessionStorage.removeItem("pele_google_login_attempt");
      toast({ title: "שגיאה בהתחברות עם Google", description: error.message, variant: "destructive" });
    }
  } catch (error: any) {
    sessionStorage.removeItem("pele_google_login_attempt");
    toast({ title: "שגיאה", description: error.message, variant: "destructive" });
  } finally {
    setGoogleLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 pt-24">
      <DynamicBackground variant="candles" />
      <Navbar />
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        {/* <div className="text-center">
          <button onClick={() => navigate("/")} className="inline-flex items-center justify-center">
            <img src={peleTextsLogo} alt='פל"א - פשוט לבחור איפה' className="h-10 w-auto sm:h-11 object-contain" />
          </button>
        </div> */}

        {isForgotPassword && (
          <div className="rounded-2xl border border-border/80 bg-card/95 backdrop-blur-md p-6 sm:p-8 shadow-card space-y-5">
            <div className="text-right">
              <h2 className="text-xl font-black">איפוס סיסמא</h2>
              <p className="text-xs text-muted-foreground mt-1">
                הזינו את כתובת המייל הרשומה שלכם ונשלח לכם קישור לאיפוס הסיסמא.
              </p>
            </div>

            {forgotSent ? (
              <div className="space-y-4">
                <div className="rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-right text-sm">
                  <p className="font-bold text-foreground">הקישור נשלח!</p>
                  <p className="text-muted-foreground mt-1">
                    בדקו את תיבת הדואר שלכם (כולל ספאם). לחצו על הקישור במייל כדי להגדיר סיסמא חדשה.
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="w-full rounded-full h-10 text-xs"
                  onClick={() => { setIsForgotPassword(false); setForgotSent(false); }}
                >
                  חזרה לעמוד התחברות
                </Button>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="forgot-email" className="text-xs">כתובת מייל</Label>
                  <Input
                    id="forgot-email"
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                    placeholder="israel@email.com"
                    dir="ltr"
                    className="h-10 rounded-xl"
                  />
                </div>
                <Button type="submit" className="w-full rounded-full font-bold h-11" disabled={forgotLoading}>
                  {forgotLoading ? "שולח..." : "שלחו לי קישור לאיפוס"}
                </Button>
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setIsForgotPassword(false)}
                    className="text-xs text-muted-foreground hover:text-primary transition-colors underline-offset-2 hover:underline"
                  >
                    חזרה להתחברות
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {!isForgotPassword && (
        <div className="rounded-2xl border border-border/80 bg-card/95 backdrop-blur-md p-6 sm:p-8 shadow-card">
          {/* Tab switcher */}
          <div className="mb-6 flex gap-2 p-1 bg-muted/70 rounded-full">
            <button
              className={`flex-1 rounded-full py-2.5 text-sm font-semibold transition-all ${isLogin ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}
              onClick={() => setIsLogin(true)}
            >
              התחברות
            </button>
            <button
              className={`flex-1 rounded-full py-2.5 text-sm font-semibold transition-all ${!isLogin ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}
              onClick={() => setIsLogin(false)}
            >
              הצטרפות
            </button>
          </div>

          {isLogin ? (
            /* LOGIN FORM */
            <form onSubmit={handleLogin} className="space-y-4">
              {showEmailConfirmationHint && (
                <div className="rounded-xl border border-primary/30 bg-primary/10 px-3 py-2 text-right text-xs">
                  <p className="font-semibold text-foreground">ההרשמה נקלטה בהצלחה.</p>
                  <p className="text-muted-foreground mt-1">אנא אשרו את כתובת המייל בתיבת הדואר ואז התחברו.</p>
                </div>
              )}
              <div className="space-y-1.5">
                <Label htmlFor="login-email" className="text-xs">אימייל</Label>
                <Input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="israel@email.com"
                  dir="ltr"
                  className="h-10 rounded-xl"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="login-password" className="text-xs">סיסמה</Label>
                <div className="relative">
                  <Input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    dir="ltr"
                    minLength={6}
                    className="h-10 rounded-xl pl-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full rounded-full font-bold h-11" disabled={loading}>
                {loading ? "מתחבר..." : "התחברות"}
              </Button>
              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => { setIsForgotPassword(true); setForgotSent(false); setForgotEmail(email); }}
                  className="text-xs text-muted-foreground hover:text-primary transition-colors underline-offset-2 hover:underline"
                >
                  שכחתי סיסמא
                </button>
              </div>            </form>
          ) : (
            /* REGISTRATION FORM */
            <form onSubmit={handleRegister} className="space-y-4">
              {/* Category question at the top of registration */}
              <div className="space-y-2 rounded-xl border border-border bg-accent/30 p-3">
                <Label className="text-xs font-bold">מי אתה? *</Label>
                <Select dir="rtl" value={category ?? undefined} onValueChange={(val) => setCategory(val as RegistrationCategory)}>
                  <SelectTrigger className="text-right font-semibold bg-background/90">
                    <SelectValue placeholder="בחרו סוג משתמש" />
                  </SelectTrigger>
                  <SelectContent align="end" sideOffset={6}>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        {c.label} — {c.description}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="reg-name" className="text-xs">שם ומשפחה *</Label>
                <Input
                  id="reg-name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  placeholder="ישראל ישראלי"
                  className="h-10 rounded-xl"
                />
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <Label htmlFor="reg-email" className="text-xs">אימייל *</Label>
                <Input
                  id="reg-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="israel@email.com"
                  dir="ltr"
                  className="h-10 rounded-xl"
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <Label htmlFor="reg-password" className="text-xs">סיסמה *</Label>
                <div className="relative">
                  <Input
                    id="reg-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="לפחות 6 תווים"
                    dir="ltr"
                    minLength={6}
                    className="h-10 rounded-xl pl-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <Label htmlFor="reg-phone" className="text-xs">מספר טלפון *</Label>
                <Input
                  id="reg-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  placeholder="050-1234567"
                  dir="ltr"
                  className="h-10 rounded-xl"
                />
              </div>

              {/* Date of birth */}
              <div className="space-y-1.5">
                <Label htmlFor="reg-dob" className="text-xs">תאריך לידה *</Label>
                <Input
                  id="reg-dob"
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  required
                  dir="ltr"
                  className="h-10 rounded-xl"
                  max={new Date(new Date().setFullYear(new Date().getFullYear() - 17)).toISOString().split("T")[0]}
                />
              </div>

              {/* Gender */}
              <div className="space-y-1.5">
                <Label className="text-xs">מין *</Label>
                <RadioGroup value={gender} onValueChange={setGender} className="flex gap-3 pt-1" dir="rtl">
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
              <div className="rounded-xl border border-border bg-accent/30 p-3 space-y-3">
                <Label className="text-xs font-bold">פרטי ממליץ/ה *</Label>
                <div className="space-y-1.5">
                  <Label htmlFor="rec-name" className="text-xs">שם הממליץ/ה</Label>
                  <Input
                    id="rec-name"
                    value={recommenderName}
                    onChange={(e) => setRecommenderName(e.target.value)}
                    required
                    placeholder="שם מלא"
                    className="h-10 rounded-xl bg-background"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="rec-phone" className="text-xs">טלפון הממליץ/ה</Label>
                  <Input
                    id="rec-phone"
                    type="tel"
                    value={recommenderPhone}
                    onChange={(e) => setRecommenderPhone(e.target.value)}
                    required
                    placeholder="050-1234567"
                    dir="ltr"
                    className="h-10 rounded-xl bg-background"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="rec-rel" className="text-xs">מה הקשר של הממליץ/ה אליך?</Label>
                  <Input
                    id="rec-rel"
                    value={recommenderRelationship}
                    onChange={(e) => setRecommenderRelationship(e.target.value)}
                    required
                    placeholder="לדוגמה: חבר/ה, רב/נית, מדריך/ה, בן/בת משפחה..."
                    className="h-10 rounded-xl bg-background"
                  />
                </div>
              </div>

              {/* ID Upload */}
              {/* <div className="space-y-1.5">
                <Label className="text-xs">צילום תעודת זהות</Label>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  לא חובה, אבל יקל עלינו בתהליך האישור וההרשמה 🚀
                </p>
                <label
                  htmlFor="idUpload"
                  className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-border bg-background p-4 transition-colors hover:border-primary hover:bg-accent/40"
                >
                  <Upload className="h-6 w-6 text-muted-foreground" />
                  <span className="text-xs font-medium text-muted-foreground">
                    {idFile ? idFile.name : "לחצו להעלאת קובץ או צילום (אופציונלי)"}
                  </span>
                  <input
                    id="idUpload"
                    type="file"
                    accept="image/*,.pdf"
                    capture="environment"
                    className="hidden"
                    onChange={(e) => setIdFile(e.target.files?.[0] ?? null)}
                  />
                </label>
              </div> */}

              {/* Terms */}
              <div className="flex items-start gap-3 rounded-xl border border-border bg-background p-3">
                <Checkbox
                  id="terms"
                  checked={termsAccepted}
                  onCheckedChange={(checked) => setTermsAccepted(checked === true)}
                  className="mt-0.5 border-primary/50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                />
                <Label htmlFor="terms" className="text-xs leading-relaxed cursor-pointer">
                  קראתי ואני מאשר/ת את{" "}
                  <a href="/terms" target="_blank" className="text-primary font-bold hover:underline">
                    תקנון פל״א
                  </a>{" "}
                  ומתחייב/ת לפעול על פיו *
                </Label>
              </div>

              <Button
                type="submit"
                className="w-full rounded-full font-bold h-11"
                disabled={loading || !category || !termsAccepted || !gender || !dateOfBirth || !recommenderName.trim() || !recommenderPhone.trim() || !recommenderRelationship.trim()}
              >
                {loading ? "נרשם..." : "הצטרפות לפל״א"}
              </Button>
            </form>
          )}

          {/* Google Sign In — only on login tab (registered & approved users) */}
          {isLogin && (
            <div className="mt-4">
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-card px-3 text-muted-foreground">או</span>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                className="w-full rounded-full h-11 gap-2 font-medium"
                onClick={handleGoogleSignIn}
                disabled={googleLoading}
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                {googleLoading ? "מתחבר..." : "המשך עם Google"}
              </Button>
            </div>
          )}

          {!isLogin && (
            <p className="mt-4 text-center text-[11px] text-muted-foreground">
              הפרטים שלכם מאובטחים ולא ישותפו ללא אישורכם
            </p>
          )}
        </div>
        )}
      </div>
    </div>
  );
};

export default Auth;
