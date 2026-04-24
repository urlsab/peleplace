import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { CalendarCheck, CheckCircle, XCircle, Clock, Star, MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import RatingDialog from "@/components/RatingDialog";
import { useToast } from "@/hooks/use-toast";
import DynamicBackground from "@/components/DynamicBackground";

const statusConfig: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  pending: { label: "ממתין לאישור", color: "bg-amber-soft/15 text-amber-soft", icon: Clock },
  approved: { label: "אושר ✓", color: "bg-primary/15 text-primary", icon: CheckCircle },
  rejected: { label: "נדחה", color: "bg-destructive/15 text-destructive", icon: XCircle },
  completed: { label: "הושלם", color: "bg-primary/15 text-primary", icon: CalendarCheck },
  cancelled: { label: "בוטל", color: "bg-muted text-muted-foreground", icon: XCircle },
};

const hostTypeLabels: Record<string, string> = {
  family: "אירוח",
  work: "עבודה",
  volunteer: "התנדבות",
};

const MyBookings = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [ratingDialog, setRatingDialog] = useState<{
    bookingId: string;
    reviewedUserId: string;
    reviewedName?: string;
  } | null>(null);
  // Guard: only approved users
  useEffect(() => {
    if (!user) { navigate("/auth"); return; }
    if (profile && profile.registration_status !== "approved") { navigate("/profile"); }
  }, [user, profile]);

  const { data: bookings, isLoading } = useQuery({
    queryKey: ["my-bookings", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  const { data: myRatings } = useQuery({
    queryKey: ["my-ratings", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ratings")
        .select("booking_id")
        .eq("reviewer_user_id", user!.id);
      if (error) throw error;
      return new Set((data || []).map((r) => r.booking_id));
    },
  });

  const { data: profiles } = useQuery({
    queryKey: ["booking-profiles"],
    enabled: !!bookings && bookings.length > 0,
    queryFn: async () => {
      const userIds = new Set<string>();
      bookings?.forEach((b) => {
        userIds.add(b.guest_user_id);
        userIds.add(b.host_user_id);
      });
      const { data, error } = await supabase
        .from("profiles")
        .select("user_id, full_name")
        .in("user_id", Array.from(userIds));
      if (error) throw error;
      const map: Record<string, string> = {};
      data?.forEach((p) => (map[p.user_id] = p.full_name));
      return map;
    },
  });

  const handleStatusUpdate = async (bookingId: string, status: string) => {
    const { error } = await supabase
      .from("bookings")
      .update({ status })
      .eq("id", bookingId);
    if (error) {
      toast({ title: "שגיאה בעדכון", description: error.message, variant: "destructive" });
    } else {
      toast({ title: status === "approved" ? "הבקשה אושרה! ✅" : status === "completed" ? "סומן כהושלם ⭐" : "הבקשה נדחתה" });
      queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
    }
  };

  const isHost = (b: any) => user?.id === b.host_user_id;
  const isGuest = (b: any) => user?.id === b.guest_user_id;

  return (
    <div className="min-h-screen" dir="rtl">
      <DynamicBackground variant="shabbat-table" />
      <Navbar />
      <div className="pt-24 pb-12 px-4">
        <div className="mx-auto max-w-2xl">
          <div className="text-center mb-10">
            <CalendarCheck className="mx-auto h-10 w-10 text-primary mb-3" />
            <h1 className="text-3xl font-black font-display">ההזמנות שלי</h1>
            <p className="text-muted-foreground mt-1">בקשות, אישורים ודירוגים</p>
          </div>

          {isLoading ? (
            <p className="text-center text-muted-foreground">טוען...</p>
          ) : !bookings || bookings.length === 0 ? (
            <div className="text-center py-16">
              <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground/40 mb-4" />
              <h3 className="text-lg font-bold font-display mb-2">אין הזמנות עדיין</h3>
              <p className="text-muted-foreground text-sm">חפשו הזדמנויות ושלחו בקשה ראשונה</p>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking, i) => {
                const config = statusConfig[booking.status] || statusConfig.pending;
                const StatusIcon = config.icon;
                const otherUserId = isHost(booking) ? booking.guest_user_id : booking.host_user_id;
                const otherName = profiles?.[otherUserId] || "משתמש";
                const alreadyRated = myRatings?.has(booking.id);

                return (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="rounded-2xl border border-border bg-card p-5 shadow-card"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-bold font-display text-lg">
                          {isHost(booking) ? `בקשה מ${otherName}` : `בקשה ל${otherName}`}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {hostTypeLabels[booking.host_type] || booking.host_type} · {booking.event_date}
                        </p>
                      </div>
                      <Badge className={`${config.color} border-0 gap-1`}>
                        <StatusIcon className="h-3 w-3" />
                        {config.label}
                      </Badge>
                    </div>

                    {booking.message && (
                      <p className="text-sm text-muted-foreground bg-muted/40 rounded-xl p-3 mb-3">
                        "{booking.message}"
                      </p>
                    )}

                    <div className="flex flex-wrap gap-2">
                      {/* Host actions */}
                      {isHost(booking) && booking.status === "pending" && (
                        <>
                          <Button size="sm" className="rounded-full gap-1" onClick={() => handleStatusUpdate(booking.id, "approved")}>
                            <CheckCircle className="h-3.5 w-3.5" /> אשר
                          </Button>
                          <Button size="sm" variant="outline" className="rounded-full gap-1" onClick={() => handleStatusUpdate(booking.id, "rejected")}>
                            <XCircle className="h-3.5 w-3.5" /> דחה
                          </Button>
                        </>
                      )}
                      {isHost(booking) && booking.status === "approved" && (
                        <Button size="sm" className="rounded-full gap-1" onClick={() => handleStatusUpdate(booking.id, "completed")}>
                          <CalendarCheck className="h-3.5 w-3.5" /> סמן כהושלם
                        </Button>
                      )}

                      {/* Rating for completed bookings */}
                      {booking.status === "completed" && !alreadyRated && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-full gap-1 border-amber-soft/40 text-amber-soft hover:bg-amber-soft/10"
                          onClick={() =>
                            setRatingDialog({
                              bookingId: booking.id,
                              reviewedUserId: otherUserId,
                              reviewedName: otherName,
                            })
                          }
                        >
                          <Star className="h-3.5 w-3.5" /> דרגו את השבת
                        </Button>
                      )}
                      {booking.status === "completed" && alreadyRated && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Star className="h-3 w-3 fill-amber-soft text-amber-soft" /> דירגת
                        </span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {ratingDialog && (
        <RatingDialog
          open={!!ratingDialog}
          onOpenChange={(open) => !open && setRatingDialog(null)}
          bookingId={ratingDialog.bookingId}
          reviewedUserId={ratingDialog.reviewedUserId}
          reviewedName={ratingDialog.reviewedName}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ["my-ratings"] });
            setRatingDialog(null);
          }}
        />
      )}
    </div>
  );
};

export default MyBookings;
