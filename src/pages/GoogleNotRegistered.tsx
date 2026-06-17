import { useEffect } from "react";
import { ArrowRight, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import DynamicBackground from "@/components/DynamicBackground";
import Navbar from "@/components/Navbar";
import { useToast } from "@/hooks/use-toast";

const GoogleNotRegistered = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    toast({
      title: "התחברות עם Google למשתמשים רשומים בלבד",
      description: "כדי להתחבר עם Google צריך קודם להירשם לאתר.",
      variant: "destructive",
    });
  }, [toast]);

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 pt-24 pb-8">
      <DynamicBackground variant="sea" />
      <Navbar />

      <div className="relative z-10 w-full max-w-2xl rounded-3xl border border-border/70 bg-card/90 backdrop-blur-md p-8 sm:p-10 shadow-card text-center space-y-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <UserPlus className="h-8 w-8 text-destructive" />
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl font-black font-display">לא ניתן להתחבר עם Google</h1>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            ההתחברות לא הצליחה כי כתובת Google הזו עדיין לא רשומה במערכת פל"א.
          </p>
          <p className="text-sm text-muted-foreground">
            כדי להצטרף, יש לבצע הרשמה רגילה עם אימייל וסיסמה, לאשר את כתובת המייל, ורק לאחר האישור אפשר להתחבר גם עם Google.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={() => navigate("/auth", { replace: true })} className="rounded-full px-8 h-11 font-bold">
            מעבר להרשמה / התחברות
          </Button>
          <Button onClick={() => navigate("/")} variant="outline" className="rounded-full px-8 h-11 font-semibold">
            <ArrowRight className="h-4 w-4 ml-1" />
            חזרה לעמוד הבית
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GoogleNotRegistered;
