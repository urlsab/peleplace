import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Star } from "lucide-react";

interface RatingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookingId: string;
  reviewedUserId: string;
  reviewedName?: string;
  onSuccess?: () => void;
}

const StarRating = ({ value, onChange, label }: { value: number; onChange: (v: number) => void; label: string }) => (
  <div className="space-y-1.5">
    <Label className="text-sm font-medium">{label}</Label>
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className="transition-transform hover:scale-110"
        >
          <Star
            className={`h-7 w-7 transition-colors ${star <= value ? "fill-amber-soft text-amber-soft" : "text-border"}`}
          />
        </button>
      ))}
    </div>
  </div>
);

const RatingDialog = ({ open, onOpenChange, bookingId, reviewedUserId, reviewedName, onSuccess }: RatingDialogProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [hospitality, setHospitality] = useState(0);
  const [food, setFood] = useState(0);
  const [atmosphere, setAtmosphere] = useState(0);
  const [comment, setComment] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async () => {
    if (!user) return;
    if (hospitality === 0 || food === 0 || atmosphere === 0) {
      toast({ title: "יש לדרג את כל הקטגוריות", variant: "destructive" });
      return;
    }

    setSending(true);
    const { error } = await supabase.from("ratings").insert({
      booking_id: bookingId,
      reviewer_user_id: user.id,
      reviewed_user_id: reviewedUserId,
      hospitality_rating: hospitality,
      food_rating: food,
      atmosphere_rating: atmosphere,
      comment: comment.trim() || null,
    });
    setSending(false);

    if (error) {
      if (error.code === "23505") {
        toast({ title: "כבר דירגת את השבת הזו", variant: "destructive" });
      } else {
        toast({ title: "שגיאה בשמירת הדירוג", description: error.message, variant: "destructive" });
      }
    } else {
      toast({ title: "הדירוג נשמר! ⭐", description: "תודה על המשוב שלך" });
      onOpenChange(false);
      onSuccess?.();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">דירוג השבת</DialogTitle>
          <DialogDescription>
            {reviewedName ? `דרגו את החוויה עם ${reviewedName}` : "דרגו את חוויית השבת שלכם"}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-5 pt-2">
          <StarRating value={hospitality} onChange={setHospitality} label="🏠 אירוח" />
          <StarRating value={food} onChange={setFood} label="🍽️ אוכל" />
          <StarRating value={atmosphere} onChange={setAtmosphere} label="✨ אווירה" />

          <div className="space-y-2">
            <Label htmlFor="rating-comment">חוות דעת (אופציונלי)</Label>
            <Textarea
              id="rating-comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="ספרו על החוויה שלכם..."
              className="min-h-[80px]"
              maxLength={500}
            />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={sending || hospitality === 0 || food === 0 || atmosphere === 0}
            className="w-full rounded-full font-bold gap-2"
            size="lg"
          >
            <Star className="h-4 w-4" />
            {sending ? "שומר..." : "שמירת דירוג"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RatingDialog;
