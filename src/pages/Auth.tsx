import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
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

  return (
    <div className="min-h-screen bg-background pattern-dots flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <span className="text-3xl font-black font-display">
            פל<span className="text-gradient-warm">״</span>א
          </span>
          <p className="mt-1 text-sm text-muted-foreground">פשוט לבחור איפה</p>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card p-8 shadow-card">
          <div className="mb-6 flex gap-2 p-1 bg-muted/50 rounded-full">
            <button
              className={`flex-1 rounded-full py-2 text-sm font-semibold transition-all ${isLogin ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}
              onClick={() => setIsLogin(true)}
            >
              התחברות
            </button>
            <button
              className={`flex-1 rounded-full py-2 text-sm font-semibold transition-all ${!isLogin ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}
              onClick={() => setIsLogin(false)}
            >
              הרשמה
            </button>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs">אימייל</Label>
              <Input
                id="email"
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
              <Label htmlFor="password" className="text-xs">סיסמה</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                dir="ltr"
                minLength={6}
                className="h-10 rounded-xl"
              />
            </div>
            <Button type="submit" className="w-full rounded-full font-bold h-11" disabled={loading}>
              {loading ? "טוען..." : isLogin ? "התחברות" : "הרשמה"}
            </Button>
          </form>

          {!isLogin && (
            <p className="mt-4 text-center text-xs text-muted-foreground">
              לאחר ההרשמה תועברו למילוי פרטים נוספים
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
