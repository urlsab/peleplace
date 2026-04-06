import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import logoImg from "@/assets/logo-pela.png";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        toast({ title: "שגיאה בהתחברות", description: error.message, variant: "destructive" });
      } else {
        navigate("/");
      }
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin },
      });
      if (error) {
        toast({ title: "שגיאה בהרשמה", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "נרשמת בהצלחה!", description: "עכשיו צריך למלא את פרטי ההרשמה" });
        navigate("/register");
      }
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
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

      if (result.redirected) {
        return;
      }

      navigate("/");
    } catch (error) {
      toast({ title: "שגיאה", description: "התחברות עם Google נכשלה", variant: "destructive" });
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <img src={logoImg} alt="פל״א" width={56} height={56} className="mx-auto h-14 w-14 object-contain" />
          <h1 className="mt-4 text-3xl font-black font-display">פל״א</h1>
          <p className="mt-1 text-muted-foreground">פשוט לבחור איפה</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-8 shadow-card">
          <div className="mb-6 flex gap-2">
            <Button
              variant={isLogin ? "default" : "outline"}
              className="flex-1 rounded-full"
              onClick={() => setIsLogin(true)}
            >
              התחברות
            </Button>
            <Button
              variant={!isLogin ? "default" : "outline"}
              className="flex-1 rounded-full"
              onClick={() => setIsLogin(false)}
            >
              הרשמה
            </Button>
          </div>

          {/* Google Login */}
          <Button
            type="button"
            variant="outline"
            className="w-full rounded-full font-medium gap-2 mb-4"
            size="lg"
            onClick={handleGoogleLogin}
            disabled={googleLoading}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            {googleLoading ? "מתחבר..." : "התחברות עם Google"}
          </Button>

          <div className="flex items-center gap-3 mb-4">
            <Separator className="flex-1" />
            <span className="text-xs text-muted-foreground">או</span>
            <Separator className="flex-1" />
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">אימייל</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="israel@email.com"
                dir="ltr"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">סיסמה</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                dir="ltr"
                minLength={6}
              />
            </div>
            <Button type="submit" className="w-full rounded-full font-bold" size="lg" disabled={loading}>
              {loading ? "טוען..." : isLogin ? "התחברות" : "הרשמה"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Auth;