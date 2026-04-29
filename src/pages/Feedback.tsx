import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Star, Heart, ArrowRight, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import DynamicBackground from "@/components/DynamicBackground";

const hostTypeLabels: Record<string, string> = {
  family: "אירוח משפחתי",
  work: "עבודה",
  volunteer: "התנדבות",
  singles_group: "חבורת רווקים",
  organized_shabbat: "שבת מאורגנת",
};

const StarRating = ({ value, onChange, label, emoji }: { value: number; onChange: (v: number) => void; label: string; emoji: string }) => (
  <div className="space-y-2">
    <Label className="text-base font-semibold flex items-center gap-2">
      <span className="text-xl">{emoji}</span> {label}
    </Label>
    <div className="flex gap-1.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className="transition-transform hover:scale-110 active:scale-95"
          aria-label={`${star} כוכבים`}
        >
          <Star
            className={`h-9 w-9 transition-colors ${
              star <= value ? "fill-amber-soft text-amber-soft" : "text-border"
            }`}
          />
        </button>
      ))}
    </div>
  </div>
);

const Feedback = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { toast } = useToast();

  const [hospitality, setHospitality] = useState(0);
  const [food, setFood] = useState(0);
  const [atmosphere, setAtmosphere] = useState(0);
  const [comment, setComment] = useState("");
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!user) navigate("/auth");
    else if (profile && profile.registration_status !== "approved") navigate("/profile");
  }, [user, profile, navigate]);

  const { data: booking, isLoading } = useQuery({
    queryKey: ["feedback-booking", bookingId, user?.id],
    enabled: !!user && !!bookingId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("id", bookingId!)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const isHost = booking && user?.id === booking.host_user_id;
  const isGuest = booking && user?.id === booking.guest_user_id;
  const otherUserId = booking ? (isHost ? booking.guest_user_id : booking.host_user_id) : null;

  const { data: otherProfile } = useQuery({
    queryKey: ["feedback-other-profile", otherUserId],
    enabled: !!otherUserId,
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("user_id", otherUserId!)
        .maybeSingle();
      return data;
    },
  });

  const { data: existingRating } = useQuery({
    queryKey: ["feedback-existing", bookingId, user?.id],
    enabled: !!user && !!bookingId,
    queryFn: async () => {
      const { data } = await supabase
        .from("ratings")
        .select("id")
        .eq("booking_id", bookingId!)
        .eq("reviewer_user_id", user!.id)
        .maybeSingle();
      return data;
    },
  });

  const handleSubmit = async () => {
    if (!user || !booking || !otherUserId) return;
    if (hospitality === 0 || food === 0 || atmosphere === 0) {
      toast({ title: "יש לדרג את כל הקטגוריות", variant: "destructive" });
      return;
    }

    setSending(true);
    const { error } = await supabase.from("ratings").insert({
      booking_id: booking.id,
      reviewer_user_id: user.id,
      reviewed_user_id: otherUserId,
      hospitality_rating: hospitality,
      food_rating: food,
      atmosphere_rating: atmosphere,
      comment: comment.trim() || null,
    });
    setSending(false);

    if (error) {
      toast({
        title: "שגיאה בשמירת המשוב",
        description: error.message,
        variant: "destructive",
      });
      return;
    }
    setSubmitted(true);
    toast({ title: "תודה על המשוב! 💛", description: "המשוב שלך עוזר לקהילה" });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen" dir="rtl">
        <Navbar />
        <p className="pt-32 text-center text-muted-foreground">טוען...</p>
      </div>
    );
  }

  if (!booking || (!isHost && !isGuest)) {
    return (
      <div className="min-h-screen" dir="rtl">
        <Navbar />
        <div className="pt-32 text-center px-4">
          <h2 className="text-2xl font-bold font-display mb-2">לא נמצאה הזמנה</h2>
          <p className="text-muted-foreground mb-6">ההזמנה שביקשת לא קיימת או שאינך משתתף/ת בה.</p>
          <Button onClick={() => navigate("/my-bookings")} className="rounded-full">
            חזרה להזמנות שלי
          </Button>
        </div>
      </div>
    );
  }

  const otherName = otherProfile?.full_name || (isHost ? "האורח/ת" : "המארח/ת");
  const roleLabel = isHost ? "מהאורח/ת" : "מהמארח/ת";

  if (existingRating || submitted) {
    return (
      <div className="min-h-screen" dir="rtl">
        <DynamicBackground variant="shabbat-table" />
        <Navbar />
        <div className="pt-24 pb-12 px-4">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto max-w-md text-center bg-card/95 backdrop-blur rounded-3xl border border-border p-10 shadow-card"
          >
            <CheckCircle2 className="mx-auto h-14 w-14 text-primary mb-4" />
            <h1 className="text-2xl font-black font-display mb-2">תודה על המשוב 💛</h1>
            <p className="text-muted-foreground mb-6">
              המשוב שלך נשמר ועוזר לשמור על קהילה איכותית ובטוחה.
            </p>
            <div className="flex flex-col gap-2">
              <Button onClick={() => navigate("/my-bookings")} className="rounded-full">
                ההזמנות שלי
              </Button>
              <Button onClick={() => navigate("/calendar")} variant="outline" className="rounded-full">
                לוח שבתות
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" dir="rtl">
      <DynamicBackground variant="shabbat-table" />
      <Navbar />

      <div className="pt-24 pb-12 px-4">
        <div className="mx-auto max-w-xl">
          <Button
            variant="ghost"
            onClick={() => navigate("/my-bookings")}
            className="mb-4 gap-1 text-muted-foreground"
          >
            <ArrowRight className="h-4 w-4" /> חזרה להזמנות
          </Button>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card/95 backdrop-blur rounded-3xl border border-border p-7 md:p-9 shadow-card"
          >
            <div className="text-center mb-7">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-bold text-primary mb-3">
                <Heart className="h-3 w-3" /> איך הייתה השבת?
              </div>
              <h1 className="text-2xl md:text-3xl font-black font-display leading-tight">
                המשוב שלך {roleLabel}
                <br />
                <span className="text-gradient-warm">{otherName}</span>
              </h1>
              <p className="text-sm text-muted-foreground mt-2">
                {hostTypeLabels[booking.host_type] || booking.host_type} · {booking.event_date}
              </p>
            </div>

            <div className="space-y-6">
              <StarRating value={hospitality} onChange={setHospitality} label="אירוח" emoji="🏠" />
              <StarRating value={food} onChange={setFood} label="אוכל" emoji="🍽️" />
              <StarRating value={atmosphere} onChange={setAtmosphere} label="אווירה" emoji="✨" />

              <div className="space-y-2 pt-2">
                <Label htmlFor="comment" className="text-base font-semibold">
                  כמה מילים על החוויה (אופציונלי)
                </Label>
                <Textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value.slice(0, 500))}
                  placeholder={
                    isHost
                      ? "איך הייתה החוויה עם האורח/ת? מה אהבת? מה אפשר לשפר?"
                      : "ספרו על החוויה — האווירה, האוכל, התחושה הכללית..."
                  }
                  className="min-h-[110px] text-sm"
                  maxLength={500}
                />
                <div className="text-[11px] text-muted-foreground text-right">
                  {comment.length}/500
                </div>
              </div>

              <Button
                onClick={handleSubmit}
                disabled={sending || hospitality === 0 || food === 0 || atmosphere === 0}
                className="w-full rounded-full font-bold gap-2 h-12 text-base"
                size="lg"
              >
                <Star className="h-5 w-5" />
                {sending ? "שולח..." : "שליחת המשוב"}
              </Button>

              <p className="text-[11px] text-muted-foreground text-center leading-relaxed">
                המשוב שלך עוזר לנו לשמור על קהילה בטוחה ואיכותית.
                <br />
                לא ניתן לערוך משוב לאחר השליחה.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
