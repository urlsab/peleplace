import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Send, Calendar, Sparkles } from "lucide-react";
import { labelHebrewDate } from "@/lib/hebrewDates";

interface BookingRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hostUserId: string;
  hostType: "family" | "work" | "volunteer" | "singles_group" | "organized_shabbat";
  hostTitle: string;
  /** Specific dates the host has marked as available */
  availableDates?: string[] | null;
  /** True if host indicated they're always open to hosting */
  alwaysAvailable?: boolean;
  onSuccess?: () => void;
}

const todayStr = () => new Date().toISOString().split("T")[0];

const BookingRequestDialog = ({
  open,
  onOpenChange,
  hostUserId,
  hostType,
  hostTitle,
  availableDates,
  alwaysAvailable,
  onSuccess,
}: BookingRequestDialogProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [sending, setSending] = useState(false);

  // Future-only sorted host dates
  const futureDates = (availableDates || [])
    .filter((d) => d >= todayStr())
    .sort();

  useEffect(() => {
    if (!open) return;
    setSelectedDate("");
    setMessage("");
  }, [open]);

  const canRequest = alwaysAvailable || futureDates.length > 0;

  const handleSubmit = async () => {
    if (!user) {
      toast({ title: "יש להתחבר כדי לשלוח בקשה", variant: "destructive" });
      return;
    }
    if (!selectedDate) {
      toast({ title: "יש לבחור תאריך לבקשה", variant: "destructive" });
      return;
    }
    // Guard: if not alwaysAvailable, the date must be in the host's list
    if (!alwaysAvailable && !futureDates.includes(selectedDate)) {
      toast({ title: "אפשר לבחור רק תאריך שהמארח סימן כפנוי", variant: "destructive" });
      return;
    }
    setSending(true);
    const { data: inserted, error } = await supabase
      .from("bookings")
      .insert({
        guest_user_id: user.id,
        host_user_id: hostUserId,
        host_type: hostType,
        event_date: selectedDate,
        message: message.trim() || null,
      })
      .select("id")
      .single();
    setSending(false);

    if (error) {
      toast({ title: "שגיאה בשליחת הבקשה", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: "הבקשה נשלחה בהצלחה! ✨", description: "המארח יקבל הודעה ויחזור אליך תוך 5 ימים" });

    const guestName = user.user_metadata?.full_name || "אורח/ת";

    // 1. Confirmation email to guest
    supabase.functions.invoke("send-transactional-email", {
      body: {
        templateName: "booking-confirmation",
        recipientEmail: user.email,
        idempotencyKey: `booking-confirm-${inserted?.id}`,
        templateData: { guestName, hostTitle, eventDate: selectedDate, hostType },
      },
    }).catch(console.error);

    // 2. Notification email to host
    (async () => {
      const { data: hostProfile } = await supabase
        .from("profiles")
        .select("email, full_name")
        .eq("user_id", hostUserId)
        .maybeSingle();
      if (!hostProfile?.email) return;
      await supabase.functions.invoke("send-transactional-email", {
        body: {
          templateName: "booking-request-received",
          recipientEmail: hostProfile.email,
          idempotencyKey: `booking-request-${inserted?.id}`,
          templateData: {
            hostName: hostProfile.full_name || "מארח/ת",
            guestName,
            eventDate: selectedDate,
            message: message.trim() || "",
          },
        },
      });
    })().catch(console.error);

    setMessage("");
    setSelectedDate("");
    onOpenChange(false);
    onSuccess?.();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">בקשת הצטרפות</DialogTitle>
          <DialogDescription>שליחת בקשה ל{hostTitle}</DialogDescription>
        </DialogHeader>

        {!canRequest ? (
          <div className="rounded-2xl border border-border bg-muted/30 p-5 text-center text-sm text-muted-foreground">
            המארח עדיין לא סימן תאריכים פנויים. נסו שוב בקרוב או חפשו אפשרות אחרת.
          </div>
        ) : (
          <div className="space-y-4 pt-2">
            {/* Date selection */}
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                בחרו תאריך לבקשה
              </Label>

              {alwaysAvailable && futureDates.length === 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 rounded-lg bg-primary/5 border border-primary/20 px-3 py-2 text-xs">
                    <Sparkles className="h-3.5 w-3.5 text-primary" />
                    <span>המארח פתוח לכל תאריך — בחרו את התאריך המבוקש</span>
                  </div>
                  <Input
                    type="date"
                    min={todayStr()}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="text-base"
                  />
                </div>
              )}

              {futureDates.length > 0 && (
                <>
                  {alwaysAvailable && (
                    <p className="text-xs text-muted-foreground">המארח הציע גם תאריכים ספציפיים, אבל פתוח לכל תאריך אחר.</p>
                  )}
                  <div className="grid grid-cols-1 gap-1.5 max-h-64 overflow-y-auto pr-1">
                    {futureDates.map((d) => {
                      const isSelected = selectedDate === d;
                      return (
                        <button
                          key={d}
                          type="button"
                          onClick={() => setSelectedDate(d)}
                          className={`text-right rounded-xl border px-3 py-2.5 text-sm transition-all ${
                            isSelected
                              ? "border-primary bg-primary/10 ring-2 ring-primary font-bold"
                              : "border-border bg-background hover:bg-muted/50"
                          }`}
                        >
                          {labelHebrewDate(d)}
                        </button>
                      );
                    })}
                  </div>
                  {alwaysAvailable && (
                    <div className="pt-2">
                      <Label className="text-xs text-muted-foreground mb-1 block">או בחרו תאריך אחר:</Label>
                      <Input
                        type="date"
                        min={todayStr()}
                        value={!futureDates.includes(selectedDate) ? selectedDate : ""}
                        onChange={(e) => setSelectedDate(e.target.value)}
                      />
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="booking-message">הודעה למארח (אופציונלי)</Label>
              <Textarea
                id="booking-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="ספרו קצת על עצמכם ולמה אתם רוצים להצטרף..."
                className="min-h-[100px]"
                maxLength={500}
              />
            </div>
            <Button
              onClick={handleSubmit}
              disabled={sending || !selectedDate}
              className="w-full rounded-full font-bold gap-2"
              size="lg"
            >
              <Send className="h-4 w-4" />
              {sending ? "שולח..." : "שלחו בקשה"}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BookingRequestDialog;
