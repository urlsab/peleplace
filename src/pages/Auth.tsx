import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Upload, CheckCircle2, Eye, EyeOff } from "lucide-react";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Registration fields
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [recommenderName, setRecommenderName] = useState("");
  const [recommenderPhone, setRecommenderPhone] = useState("");
  const [recommenderRelationship, setRecommenderRelationship] = useState("");
  const [idFile, setIdFile] = useState<File | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, profile, loading: authLoading } = useAuth();

  // Smart redirect for already logged-in users
  useEffect(() => {
    if (authLoading || !user) return;
    redirectByStatus();
  }, [user, profile, authLoading]);

  const redirectByStatus = () => {
    if (!user) return;
    if (!profile) {
      // User signed up but no profile yet — could be Google sign-in, stay here
      return;
    }
    if (profile.registration_status === "pending") {
      navigate("/profile");
    } else if (profile.registration_status === "approved") {
      navigate("/explore");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      toast({ title: "שגיאה בהתחברות", description: error.message, variant: "destructive" });
      setLoading(false);
      return;
    }

    const signedInUser = data.user;
    if (signedInUser) {
      const { data: existingProfile } = await supabase
        .from("profiles")
        .select("registration_status")
        .eq("user_id", signedInUser.id)
        .maybeSingle();

      if (existingProfile?.registration_status === "pending") {
        navigate("/profile");
      } else if (existingProfile?.registration_status === "approved") {
        navigate("/explore");
      } else if (existingProfile?.registration_status === "rejected") {
        navigate("/profile");
      }
    }

    setLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsAccepted || !gender || !dateOfBirth || !recommenderName.trim() || !recommenderPhone.trim() || !recommenderRelationship.trim()) return;
    setLoading(true);

    try {
      // 1. Create auth account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin },
      });
      if (authError) throw authError;
      const userId = authData.user?.id;
      if (!userId) throw new Error("לא התקבל מזהה משתמש");

      // 2. Upload ID document (optional)
      let idDocUrl: string | null = null;
      if (idFile) {
        const ext = idFile.name.split(".").pop();
        const path = `${userId}/${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("id-documents")
          .upload(path, idFile);
        if (uploadError) throw uploadError;
        idDocUrl = path;
      }

      // 3. Create profile with pending status
      const { error: profileError } = await supabase.from("profiles").insert({
        user_id: userId,
        full_name: fullName,
        email,
        phone,
        user_type: "single" as const,
        date_of_birth: dateOfBirth,
        gender,
        id_document_url: idDocUrl,
        terms_accepted_at: new Date().toISOString(),
        recommender_name: recommenderName,
        recommender_phone: recommenderPhone,
        recommender_relationship: recommenderRelationship,
      });
      if (profileError) throw profileError;

      // 4. Send registration-received email
      try {
        await supabase.functions.invoke("send-transactional-email", {
          body: {
            templateName: "registration-received",
            to: email,
            data: { fullName },
          },
        });
      } catch {
        // Don't block registration if email fails
      }

      setSubmitted(true);
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

  const handleGoogleSignIn = async () => {
    // Google sign-in is only allowed for users who already registered (Login tab).
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
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (result.error) {
        toast({ title: "שגיאה בהתחברות עם Google", description: String(result.error), variant: "destructive" });
        setGoogleLoading(false);
        return;
      }
      if (result.redirected) return;

      // Session set — verify a profile exists for this user. If not, sign them out and redirect to registration.
      const { data: { user: signedInUser } } = await supabase.auth.getUser();
      if (signedInUser) {
        const { data: existingProfile } = await supabase
          .from("profiles")
          .select("id")
          .eq("user_id", signedInUser.id)
          .maybeSingle();

        if (!existingProfile) {
          await supabase.auth.signOut();
          toast({
            title: "עוד לא נרשמת לפל״א",
            description: "כדי להמשיך, יש למלא את טופס ההצטרפות. לאחר אישור, תוכל/י להתחבר עם Google.",
            variant: "destructive",
          });
          setIsLogin(false);
          setGoogleLoading(false);
          return;
        }
      }
      // Profile exists — redirect handled by useEffect
    } catch (error: any) {
      toast({ title: "שגיאה", description: error.message, variant: "destructive" });
    } finally {
      setGoogleLoading(false);
    }
  };

  // Success screen
  if (submitted) {
    return (
      <div className="min-h-screen bg-background pattern-dots flex items-center justify-center px-4">
        <div className="mx-auto max-w-md text-center space-y-6">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle2 className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-3xl font-black font-display">ההרשמה נקלטה בהצלחה! 🎉</h1>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-4 text-right">
            <p className="text-foreground leading-relaxed">
              תודה שנרשמת לפל״א! הבקשה שלך התקבלה ותיבדק על ידי הצוות שלנו בהקדם.
            </p>
            <p className="text-muted-foreground text-sm leading-relaxed">
              אנחנו שמים דגש על בניית קהילה בטוחה ומכבדת, ולכן כל הרשמה עוברת אישור ידני.
              בינתיים את/ה יכול/ה לגלוש באתר ולהכיר את ההזדמנויות — וברגע שההרשמה תאושר, תקבל/י עדכון במייל ותוכל/י להתחיל לשלוח בקשות.
            </p>
            <p className="text-muted-foreground text-sm">
              ⏳ זמן אישור ממוצע: עד 24 שעות
            </p>
            <div className="rounded-xl bg-accent/60 px-4 py-3 text-sm">
              <p className="font-medium text-foreground">פרטי ההתחברות שלך:</p>
              <p className="text-muted-foreground mt-1">שם משתמש: <span dir="ltr" className="font-mono">{email}</span></p>
              <p className="text-muted-foreground">סיסמה: הסיסמה שבחרת בעת ההרשמה</p>
            </div>
          </div>
          <div className="flex justify-center">
            <Button onClick={() => navigate("/")} className="rounded-full px-8">
              חזרה לעמוד הראשי
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pattern-dots flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center">
          <button onClick={() => navigate("/")} className="inline-block">
            <span className="text-3xl font-black font-display">
              פל<span className="text-gradient-warm">״</span>א
            </span>
          </button>
          <p className="mt-1 text-sm text-muted-foreground">פשוט לבחור איפה</p>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card p-6 sm:p-8 shadow-card">
          {/* Tab switcher */}
          <div className="mb-6 flex gap-2 p-1 bg-muted/50 rounded-full">
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
            </form>
          ) : (
            /* REGISTRATION FORM */
            <form onSubmit={handleRegister} className="space-y-4">
              {/* Full name */}
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
              <div className="space-y-1.5">
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
              </div>

              {/* Terms */}
              <div className="flex items-start gap-3 rounded-xl border border-border bg-background p-3">
                <Checkbox
                  id="terms"
                  checked={termsAccepted}
                  onCheckedChange={(checked) => setTermsAccepted(checked === true)}
                  className="mt-0.5"
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
                disabled={loading || !termsAccepted || !gender || !dateOfBirth || !recommenderName.trim() || !recommenderPhone.trim() || !recommenderRelationship.trim()}
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
      </div>
    </div>
  );
};

export default Auth;
