import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { CalendarCheck, CheckCircle, XCircle, Clock, Star, MessageSquare, Phone, Mail, User as UserIcon, Heart, AlarmClock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import RatingDialog from "@/components/RatingDialog";
import { useToast } from "@/hooks/use-toast";
import DynamicBackground from "@/components/DynamicBackground";

const statusConfig: Record<string, { label: string; guestLabel?: string; color: string; icon: typeof Clock }> = {
  pending: { label: "ממתין למענה", color: "bg-amber-soft/15 text-amber-soft", icon: Clock },
  approved: { label: "אושר ✓", color: "bg-primary/15 text-primary", icon: CheckCircle },
  // shown to host as "not available", to guest as "not available this time" (soft language)
  not_available: { label: "לא זמין הפעם", guestLabel: "המארח לא זמין הפעם 💛", color: "bg-muted text-muted-foreground", icon: Heart },
  expired: { label: "פג תוקף", guestLabel: "לא התקבל מענה בזמן", color: "bg-muted text-muted-foreground", icon: AlarmClock },
  rejected: { label: "לא זמין הפעם", guestLabel: "המארח לא זמין הפעם 💛", color: "bg-muted text-muted-foreground", icon: Heart },
  completed: { label: "הושלם", color: "bg-primary/15 text-primary", icon: CalendarCheck },
  cancelled: { label: "בוטל", color: "bg-muted text-muted-foreground", icon: XCircle },
};

const hostTypeLabels: Record<string, string> = {
  family: "אירוח",
  work: "עבודה",
  volunteer: "התנדבות",
  singles_group: "חבורת רווקים",
  organized_shabbat: "שבת מאורגנת",
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
  const [contactByBooking, setContactByBooking] = useState<Record<string, { full_name: string; phone: string; email: string }>>({});
  const [loadingContactFor, setLoadingContactFor] = useState<string | null>(null);

  useEffect(() => {
    if (!user) { navigate("/auth"); return; }
    if (profile && profile.registration_status !== "approved") { navigate("/profile"); }
  }, [user, profile, navigate]);

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

  // Auto-complete approved bookings whose event date has passed (so feedback unlocks)
  useEffect(() => {
    if (!bookings || !user) return;
    const today = new Date().toISOString().split("T")[0];
    const toComplete = bookings.filter(
      (b) => b.status === "approved" && b.event_date && b.event_date < today
    );
    if (toComplete.length === 0) return;
    (async () => {
      const ids = toComplete.map((b) => b.id);
      const { error } = await supabase
        .from("bookings")
        .update({ status: "completed" })
        .in("id", ids);
      if (!error) queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
    })();
  }, [bookings, user, queryClient]);

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

  const sendStatusEmail = async (booking: any, newStatus: "approved" | "not_available") => {
    // Fetch both parties' profiles for email
    const { data: guestP } = await supabase
      .from("profiles")
      .select("email, full_name")
      .eq("user_id", booking.guest_user_id)
      .maybeSingle();
    if (!guestP?.email) return;

    const hostName = profiles?.[booking.host_user_id] || "המארח";
    const templateName = newStatus === "approved" ? "booking-approved" : "booking-not-available";
    await supabase.functions.invoke("send-transactional-email", {
      body: {
        templateName,
        recipientEmail: guestP.email,
        idempotencyKey: `booking-${newStatus}-${booking.id}`,
        templateData: {
          guestName: guestP.full_name || "אורח/ת",
          hostTitle: hostName,
          eventDate: booking.event_date || "",
          hostType: booking.host_type,
        },
      },
    }).catch(console.error);
  };

  const handleStatusUpdate = async (booking: any, status: string) => {
    const updates: any = { status };
    if (status === "approved" || status === "not_available") {
      updates.responded_at = new Date().toISOString();
    }
    const { error } = await supabase
      .from("bookings")
      .update(updates)
      .eq("id", booking.id);
    if (error) {
      toast({ title: "שגיאה בעדכון", description: error.message, variant: "destructive" });
      return;
    }
    if (status === "approved") {
      toast({ title: "הבקשה אושרה! ✅", description: "האורח יקבל הודעה ופרטי הקשר ייחשפו" });
      sendStatusEmail(booking, "approved");
    } else if (status === "not_available") {
      toast({ title: "הודענו לאורח 💛", description: "ההודעה נשלחה בנימה רכה עם הצעות חלופיות" });
      sendStatusEmail(booking, "not_available");
    } else if (status === "completed") {
      toast({ title: "סומן כהושלם ⭐" });
    }
    queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
  };

  const revealContact = async (bookingId: string) => {
    if (contactByBooking[bookingId]) return;
    setLoadingContactFor(bookingId);
    const { data, error } = await supabase.rpc("get_booking_contact", { _booking_id: bookingId });
    setLoadingContactFor(null);
    if (error || !data || data.length === 0) {
      toast({
        title: "לא ניתן להציג פרטי קשר",
        description: error?.message || "פרטי הקשר נחשפים רק אחרי שהבקשה אושרה",
        variant: "destructive",
      });
      return;
    }
    const c = data[0];
    setContactByBooking((prev) => ({ ...prev, [bookingId]: c }));
  };

  const isHost = (b: any) => user?.id === b.host_user_id;

  return (
    <div className="min-h-screen" dir="rtl">
      <DynamicBackground variant="shabbat-table" />
      <Navbar />
      <div className="pt-24 pb-12 px-4">
        <div className="mx-auto max-w-2xl">
          <div className="text-center mb-8">
            <CalendarCheck className="mx-auto h-10 w-10 text-primary mb-3" />
            <h1 className="text-3xl font-black font-display">ההזמנות שלי</h1>
            <p className="text-muted-foreground mt-1">בקשות, אישורים ודירוגים</p>
          </div>

          {/* Pending feedback banner */}
          {bookings && myRatings && (() => {
            const pendingFeedback = bookings.filter(
              (b) => b.status === "completed" && !myRatings.has(b.id)
            );
            if (pendingFeedback.length === 0) return null;
            const first = pendingFeedback[0];
            const otherUserId = isHost(first) ? first.guest_user_id : first.host_user_id;
            const otherName = profiles?.[otherUserId] || "המארח/אורח";
            return (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 rounded-2xl border border-amber-soft/40 bg-gradient-to-l from-amber-soft/15 to-primary/10 p-5 shadow-card"
              >
                <div className="flex items-start gap-3">
                  <div className="shrink-0 rounded-full bg-amber-soft/20 p-2.5">
                    <Star className="h-5 w-5 text-amber-soft fill-amber-soft" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold font-display text-base mb-1">
                      איך הייתה השבת עם {otherName}?
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {pendingFeedback.length === 1
                        ? "המשוב שלך עוזר לקהילה לשמור על איכות וחום."
                        : `יש לך ${pendingFeedback.length} משובים ממתינים — כל אחד חשוב.`}
                    </p>
                    <Button
                      size="sm"
                      className="rounded-full gap-1.5"
                      onClick={() => navigate(`/feedback/${first.id}`)}
                    >
                      <Star className="h-3.5 w-3.5" /> כתיבת משוב
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })()}

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
                const showLabel = !isHost(booking) && config.guestLabel ? config.guestLabel : config.label;
                const contact = contactByBooking[booking.id];

                return (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="rounded-2xl border border-border bg-card p-5 shadow-card"
                  >
                    <div className="flex items-start justify-between mb-3 gap-3">
                      <div className="min-w-0">
                        <h3 className="font-bold font-display text-lg truncate">
                          {isHost(booking) ? `בקשה מ${otherName}` : `בקשה ל${otherName}`}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {hostTypeLabels[booking.host_type] || booking.host_type} · {booking.event_date}
                        </p>
                      </div>
                      <Badge className={`${config.color} border-0 gap-1 shrink-0`}>
                        <StatusIcon className="h-3 w-3" />
                        {showLabel}
                      </Badge>
                    </div>

                    {booking.message && (
                      <p className="text-sm text-muted-foreground bg-muted/40 rounded-xl p-3 mb-3">
                        "{booking.message}"
                      </p>
                    )}

                    {/* Soft message for guest when host declined / expired */}
                    {!isHost(booking) && (booking.status === "not_available" || booking.status === "rejected") && (
                      <div className="rounded-xl bg-primary/5 border border-primary/15 p-3 mb-3 text-sm text-foreground">
                        <Heart className="h-4 w-4 text-primary inline ml-1" />
                        אל דאגה — יש עוד הרבה אפשרויות נהדרות.
                        <Button variant="link" className="px-1 h-auto text-primary" onClick={() => navigate("/explore")}>
                          לראות הצעות אחרות
                        </Button>
                      </div>
                    )}
                    {!isHost(booking) && booking.status === "expired" && (
                      <div className="rounded-xl bg-muted/40 border border-border p-3 mb-3 text-sm text-foreground">
                        <AlarmClock className="h-4 w-4 inline ml-1" />
                        לא התקבל מענה בזמן. אפשר לנסות מארח אחר —
                        <Button variant="link" className="px-1 h-auto text-primary" onClick={() => navigate("/explore")}>
                          חיפוש הזדמנויות
                        </Button>
                      </div>
                    )}

                    {/* Contact info — only when approved */}
                    {(booking.status === "approved" || booking.status === "completed") && (
                      <div className="rounded-xl bg-primary/5 border border-primary/15 p-3 mb-3">
                        {contact ? (
                          <div className="space-y-1.5 text-sm">
                            <div className="flex items-center gap-2">
                              <UserIcon className="h-3.5 w-3.5 text-primary" />
                              <span className="font-semibold">{contact.full_name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="h-3.5 w-3.5 text-primary" />
                              <a href={`tel:${contact.phone}`} className="text-primary underline">{contact.phone}</a>
                            </div>
                            <div className="flex items-center gap-2">
                              <Mail className="h-3.5 w-3.5 text-primary" />
                              <a href={`mailto:${contact.email}`} className="text-primary underline truncate">{contact.email}</a>
                            </div>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            className="rounded-full gap-1"
                            onClick={() => revealContact(booking.id)}
                            disabled={loadingContactFor === booking.id}
                          >
                            <Phone className="h-3.5 w-3.5" />
                            {loadingContactFor === booking.id ? "טוען..." : "הצגת פרטי קשר"}
                          </Button>
                        )}
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2">
                      {/* Host actions */}
                      {isHost(booking) && booking.status === "pending" && (
                        <>
                          <Button size="sm" className="rounded-full gap-1" onClick={() => handleStatusUpdate(booking, "approved")}>
                            <CheckCircle className="h-3.5 w-3.5" /> אשר
                          </Button>
                          <Button size="sm" variant="outline" className="rounded-full gap-1" onClick={() => handleStatusUpdate(booking, "not_available")}>
                            <Heart className="h-3.5 w-3.5" /> לא זמין הפעם
                          </Button>
                        </>
                      )}
                      {isHost(booking) && booking.status === "approved" && (
                        <Button size="sm" className="rounded-full gap-1" onClick={() => handleStatusUpdate(booking, "completed")}>
                          <CalendarCheck className="h-3.5 w-3.5" /> סמן כהושלם
                        </Button>
                      )}

                      {/* Rating for completed bookings */}
                      {booking.status === "completed" && !alreadyRated && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-full gap-1 border-amber-soft/40 text-amber-soft hover:bg-amber-soft/10"
                          onClick={() => navigate(`/feedback/${booking.id}`)}
                        >
                          <Star className="h-3.5 w-3.5" /> כתיבת משוב
                        </Button>
                      )}
                      {booking.status === "completed" && alreadyRated && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Star className="h-3 w-3 fill-amber-soft text-amber-soft" /> משוב נשלח
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
