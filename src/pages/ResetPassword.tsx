import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, KeyRound } from "lucide-react";
import DynamicBackground from "@/components/DynamicBackground";
import Navbar from "@/components/Navbar";
import peleTextsLogo from "@/assets/pele_texts-removebg-preview.png";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Supabase processes the recovery token from the URL hash automatically
    // and fires the PASSWORD_RECOVERY event
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setIsReady(true);
      }
    });

    // Also check the current session — if the user lands here already with a
    // recovery session (e.g. tab refresh), still allow the form
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setIsReady(true);
    });

    // Safety: if after 8 seconds still no recovery event, mark as expired
    const timeout = setTimeout(() => {
      setIsExpired((prev) => {
        if (!prev) return true;
        return prev;
      });
    }, 8000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  // Once ready, cancel the expiry timer
  useEffect(() => {
    if (isReady) setIsExpired(false);
  }, [isReady]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({ title: "הסיסמאות אינן תואמות", variant: "destructive" });
      return;
    }
    if (password.length < 6) {
      toast({ title: "הסיסמא חייבת להכיל לפחות 6 תווים", variant: "destructive" });
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      toast({
        title: "שגיאה בעדכון הסיסמא",
        description: error.message,
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    toast({
      title: "הסיסמא עודכנה בהצלחה",
      description: "אפשר להתחבר עכשיו עם הסיסמא החדשה.",
    });

    await supabase.auth.signOut();
    navigate("/auth", { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 pt-24">
      <DynamicBackground variant="candles" />
      <Navbar />

      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center">
          <button onClick={() => navigate("/")} className="inline-flex items-center justify-center">
            <img
              src={peleTextsLogo}
              alt='פל"א - פשוט לבחור איפה'
              className="h-10 w-auto sm:h-11 object-contain"
            />
          </button>
        </div>

        <div className="rounded-2xl border border-border/80 bg-card/95 backdrop-blur-md p-6 sm:p-8 shadow-card space-y-6">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="h-12 w-12 rounded-full bg-primary/15 flex items-center justify-center">
              <KeyRound className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-xl font-black">הגדרת סיסמא חדשה</h2>
          </div>

          {!isReady && !isExpired && (
            <p className="text-center text-muted-foreground text-sm">טוען... אנא המתן.</p>
          )}

          {!isReady && isExpired && (
            <div className="space-y-4 text-center">
              <p className="text-sm text-muted-foreground">
                הקישור אינו תקף או שפג תוקפו. בקשו קישור חדש לאיפוס סיסמא.
              </p>
              <Button
                variant="outline"
                className="rounded-full px-8 h-11"
                onClick={() => navigate("/auth")}
              >
                חזרה לעמוד התחברות
              </Button>
            </div>
          )}

          {isReady && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="new-password" className="text-xs">
                  סיסמא חדשה
                </Label>
                <div className="relative">
                  <Input
                    id="new-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    placeholder="לפחות 6 תווים"
                    dir="ltr"
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

              <div className="space-y-1.5">
                <Label htmlFor="confirm-password" className="text-xs">
                  אימות סיסמא
                </Label>
                <Input
                  id="confirm-password"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="חזרו על הסיסמא"
                  dir="ltr"
                  className="h-10 rounded-xl"
                />
              </div>

              <Button
                type="submit"
                className="w-full rounded-full font-bold h-11"
                disabled={loading}
              >
                {loading ? "שומר..." : "שמירת סיסמא חדשה"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
