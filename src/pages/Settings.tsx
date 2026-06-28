import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { KeyRound, Mail, Trash2, ArrowRight } from "lucide-react";
import DynamicBackground from "@/components/DynamicBackground";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";


const Settings = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newEmail, setNewEmail] = useState(user?.email || "");
  const [currentPasswordForEmail, setCurrentPasswordForEmail] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [savingEmail, setSavingEmail] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!user) {
    navigate("/auth");
    return null;
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      toast({ title: "סיסמה קצרה מדי", description: "לפחות 8 תווים המורכבים ממספרים ואותיות", variant: "destructive" });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({ title: "הסיסמאות לא תואמות", variant: "destructive" });
      return;
    }
    setSavingPassword(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      toast({ title: "שגיאה", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "הסיסמה עודכנה בהצלחה ✨" });
      setNewPassword("");
      setConfirmPassword("");
    }
    setSavingPassword(false);
  };

  const handleEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail || newEmail === user.email) return;

    if (!currentPasswordForEmail) {
      toast({
        title: "נדרשת סיסמה",
        description: "הזינו את הסיסמה הנוכחית כדי לאמת את הזהות שלכם",
        variant: "destructive",
      });
      return;
    }

    setSavingEmail(true);

    // אימות זהות מחדש: לפני שמאפשרים שינוי מייל, מבטיחים שהמשתמש
    // אכן מכיר את הסיסמה הנוכחית (לא רק שיש לו סשן פתוח)
    const { error: verifyError } = await supabase.auth.signInWithPassword({
      email: user.email!,
      password: currentPasswordForEmail,
    });

    if (verifyError) {
      toast({
        title: "סיסמה שגויה",
        description: "לא הצלחנו לאמת את הזהות שלכם. בדקו את הסיסמה ונסו שוב",
        variant: "destructive",
      });
      setSavingEmail(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({ email: newEmail });
    if (error) {
      toast({ title: "שגיאה", description: error.message, variant: "destructive" });
    } else {
      toast({
        title: "מייל אישור נשלח 📧",
        description: "בדקו את המייל החדש שלכם כדי להשלים את השינוי",
      });
      setCurrentPasswordForEmail("");
    }
    setSavingEmail(false);
  };

  const handleDeleteAccount = async () => {
  setDeleting(true);

  const { data: { session } } = await supabase.auth.getSession();

  const res = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/delete-user`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
    }
  );

  if (!res.ok) {
    const err = await res.json();
    toast({ title: "שגיאה במחיקה", description: err.error, variant: "destructive" });
    setDeleting(false);
    return;
  }

  await signOut();
  toast({ title: "החשבון נמחק בהצלחה" });
  navigate("/");
};

  return (
    <div className="min-h-screen">
      <DynamicBackground variant="sea" />
      <Navbar />
      <div className="pt-24 pb-12 px-4">
        <div className="mx-auto max-w-lg space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black font-display">הגדרות</h1>
              <p className="text-sm text-muted-foreground mt-1">ניהול החשבון שלך</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate("/profile")} className="gap-1">
              לפרופיל <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Change password */}
          <form onSubmit={handlePasswordChange} className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-4">
            <div className="flex items-center gap-2">
              <KeyRound className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-bold font-display">שינוי סיסמה</h2>
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">סיסמה חדשה</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                minLength={8}
                placeholder="לפחות 8 תווים המורכבים ממספרים ואותיות"
                dir="ltr"
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">אישור סיסמה</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                minLength={6}
                placeholder="הקלידו שוב"
                dir="ltr"
                className="rounded-xl"
              />
            </div>
            <Button
              type="submit"
              className="w-full rounded-full font-bold"
              disabled={savingPassword || !newPassword || !confirmPassword}
            >
              {savingPassword ? "שומר..." : "עדכון סיסמה"}
            </Button>
          </form>

          {/* Change email */}
          {/* <form onSubmit={handleEmailChange} className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-4">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-bold font-display">כתובת מייל</h2>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">מייל חדש</Label>
              <Input
                id="email"
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                dir="ltr"
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="current-password-email">סיסמה נוכחית (לאימות)</Label>
              <Input
                id="current-password-email"
                type="password"
                value={currentPasswordForEmail}
                onChange={(e) => setCurrentPasswordForEmail(e.target.value)}
                placeholder="הזינו לאימות הזהות"
                dir="ltr"
                className="rounded-xl"
              />
              <p className="text-xs text-muted-foreground">
                לאחר אימות הסיסמה, יישלח מייל אישור לכתובת החדשה
              </p>
            </div>
            <Button
              type="submit"
              variant="outline"
              className="w-full rounded-full font-bold"
              disabled={savingEmail || newEmail === user.email || !currentPasswordForEmail}
            >
              {savingEmail ? "שולח..." : "עדכון מייל"}
            </Button>
          </form> */}

          {/* Delete account */}
          <div className="rounded-2xl border border-destructive/30 bg-white p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-destructive" />
              <h2 className="text-lg font-bold font-display text-destructive">מחיקת חשבון</h2>
            </div>
            <p className="text-sm text-muted-foreground text-black-200">
              מחיקת החשבון תסיר את כל הנתונים שלך מהמערכת. פעולה זו אינה הפיכה.
            </p>

            <Button
              variant="destructive"
              className="w-full rounded-full font-bold"
              onClick={() => setShowDeleteConfirm(true)}
              disabled={deleting}
            >
              {deleting ? "מבצע..." : "בקשה למחיקת חשבון"}
            </Button>
            
          </div>
        </div>
      </div>

      {/* Confirmation dialog */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader className="text-right">
            <AlertDialogTitle>האם אתה בטוח שברצונך למחוק את החשבון?</AlertDialogTitle>
            <AlertDialogDescription>
              פעולה זו תמחק לצמיתות את כל הנתונים שלך, כולל שבתות שפרסמת ובקשות הזמנה. לא ניתן לבטל פעולה זו.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row-reverse gap-2">
            <AlertDialogCancel className="rounded-full">
              לא, בטל
            </AlertDialogCancel>
            <AlertDialogAction
              className="rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                setShowDeleteConfirm(false);
                handleDeleteAccount();
              }}
            >
              כן, מחק
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Settings;
