import { MailCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import DynamicBackground from "@/components/DynamicBackground";
import Navbar from "@/components/Navbar";

const PendingEmailConfirmation = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 pt-24 pb-8">
      <DynamicBackground variant="candles" />
      <Navbar />

      <div className="relative z-10 w-full max-w-xl rounded-3xl border border-border/70 bg-card/90 backdrop-blur-md p-8 sm:p-10 shadow-card text-center space-y-5">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/15">
          <MailCheck className="h-8 w-8 text-primary" />
        </div>

        <h1 className="text-3xl sm:text-4xl font-black font-display">מחכים לאישור המייל שלך</h1>
        <p className="text-muted-foreground leading-relaxed">
          ההרשמה נקלטה בהצלחה. שלחנו לך מייל אימות מסופהבייס.
          <br />
          כדי להשלים הרשמה, צריך ללחוץ על הקישור במייל.
        </p>

        <div className="rounded-xl border border-border bg-background/70 px-4 py-3 text-sm text-muted-foreground">
          לא קיבלת מייל? בדקו תיקיית ספאם/קידומי מכירות ונסו שוב בעוד דקה.
        </div>

        <div className="flex justify-center">
          <Button onClick={() => navigate("/auth", { replace: true })} variant="outline" className="rounded-full px-8 h-11">
            חזרה לעמוד התחברות
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PendingEmailConfirmation;