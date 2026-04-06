import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Send } from "lucide-react";

interface BookingRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hostUserId: string;
  hostType: "family" | "work" | "volunteer";
  hostTitle: string;
  eventDate?: string;
  onSuccess?: () => void;
}

const BookingRequestDialog = ({
  open,
  onOpenChange,
  hostUserId,
  hostType,
  hostTitle,
  eventDate,
  onSuccess,
}: BookingRequestDialogProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async () => {
    if (!user) {
      toast({ title: "יש להתחבר כדי לשלוח בקשה", variant: "destructive" });
      return;
    }
    setSending(true);
    const { error } = await supabase.from("bookings").insert({
      guest_user_id: user.id,
      host_user_id: hostUserId,
      host_type: hostType,
      event_date: eventDate || "לא צוין",
      message: message.trim() || null,
    });
    setSending(false);

    if (error) {
      toast({ title: "שגיאה בשליחת הבקשה", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "הבקשה נשלחה בהצלחה! ✨", description: "המארח יקבל הודעה ויחזור אליך" });
      setMessage("");
      onOpenChange(false);
      onSuccess?.();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">בקשת הצטרפות</DialogTitle>
          <DialogDescription>שליחת בקשה ל{hostTitle}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-2">
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
            disabled={sending}
            className="w-full rounded-full font-bold gap-2"
            size="lg"
          >
            <Send className="h-4 w-4" />
            {sending ? "שולח..." : "שלחו בקשה"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingRequestDialog;
