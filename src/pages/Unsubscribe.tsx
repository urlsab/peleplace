import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

const Unsubscribe = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "valid" | "invalid" | "done" | "error">("loading");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!token) {
      setStatus("invalid");
      return;
    }
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
    fetch(`${supabaseUrl}/functions/v1/handle-email-unsubscribe?token=${token}`, {
      headers: { apikey: anonKey },
    })
      .then((r) => r.json())
      .then((data) => setStatus(data.valid ? "valid" : "invalid"))
      .catch(() => setStatus("error"));
  }, [token]);

  const handleUnsubscribe = async () => {
    if (!token) return;
    setProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke("handle-email-unsubscribe", {
        body: { token },
      });
      if (error) throw error;
      setStatus(data?.success ? "done" : "error");
    } catch {
      setStatus("error");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4" dir="rtl">
      <div className="bg-card rounded-xl shadow-lg p-8 max-w-md w-full text-center space-y-6">
        {status === "loading" && <p className="text-muted-foreground">טוען...</p>}
        {status === "invalid" && (
          <>
            <h1 className="text-xl font-bold text-foreground">קישור לא תקין</h1>
            <p className="text-muted-foreground">הקישור אינו תקין או שפג תוקפו.</p>
          </>
        )}
        {status === "valid" && (
          <>
            <h1 className="text-xl font-bold text-foreground">ביטול הרשמה לדיוור</h1>
            <p className="text-muted-foreground">לחצו על הכפתור כדי להפסיק לקבל מיילים מפל״א.</p>
            <Button onClick={handleUnsubscribe} disabled={processing} className="w-full rounded-full">
              {processing ? "מעבד..." : "ביטול הרשמה"}
            </Button>
          </>
        )}
        {status === "done" && (
          <>
            <h1 className="text-xl font-bold text-foreground">ההרשמה בוטלה ✅</h1>
            <p className="text-muted-foreground">לא תקבלו יותר מיילים מאיתנו.</p>
          </>
        )}
        {status === "error" && (
          <>
            <h1 className="text-xl font-bold text-foreground">שגיאה</h1>
            <p className="text-muted-foreground">משהו השתבש. נסו שוב מאוחר יותר.</p>
          </>
        )}
      </div>
    </div>
  );
};

export default Unsubscribe;
