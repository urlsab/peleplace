import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Eye, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";

const statusLabels: Record<string, { label: string; variant: "default" | "secondary" | "destructive" }> = {
  pending: { label: "ממתין", variant: "default" },
  approved: { label: "מאושר", variant: "secondary" },
  rejected: { label: "נדחה", variant: "destructive" },
};

const userTypeLabels: Record<string, string> = {
  single: "רווק/ה",
  host: "מארח",
};

const Admin = () => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("pending");

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate("/");
    }
  }, [user, isAdmin, authLoading]);

  useEffect(() => {
    if (isAdmin) fetchRegistrations();
  }, [isAdmin, filter]);

  const fetchRegistrations = async () => {
    setLoading(true);
    let query = supabase.from("profiles").select("*").order("created_at", { ascending: false });
    if (filter !== "all") {
      query = query.eq("registration_status", filter as any);
    }
    const { data, error } = await query;
    if (error) {
      toast({ title: "שגיאה בטעינת הנתונים", variant: "destructive" });
    } else {
      setRegistrations(data || []);
    }
    setLoading(false);
  };

  const updateStatus = async (profileId: string, status: "approved" | "rejected") => {
    const { error } = await supabase
      .from("profiles")
      .update({ registration_status: status })
      .eq("id", profileId);

    if (error) {
      toast({ title: "שגיאה בעדכון", description: error.message, variant: "destructive" });
    } else {
      toast({ title: status === "approved" ? "הנרשם אושר ✅" : "הנרשם נדחה ❌" });
      fetchRegistrations();
    }
  };

  if (authLoading) return <div className="min-h-screen flex items-center justify-center">טוען...</div>;
  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-12 px-4">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center gap-3 mb-8">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-black font-display">פאנל ניהול</h1>
          </div>

          <div className="flex gap-2 mb-6">
            {(["pending", "approved", "rejected", "all"] as const).map((f) => (
              <Button
                key={f}
                variant={filter === f ? "default" : "outline"}
                size="sm"
                className="rounded-full"
                onClick={() => setFilter(f)}
              >
                {f === "pending" ? "ממתינים" : f === "approved" ? "מאושרים" : f === "rejected" ? "נדחו" : "הכל"}
              </Button>
            ))}
          </div>

          {loading ? (
            <p className="text-center text-muted-foreground py-12">טוען...</p>
          ) : registrations.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">אין נרשמים בקטגוריה זו</p>
          ) : (
            <div className="space-y-4">
              {registrations.map((reg) => (
                <div key={reg.id} className="rounded-2xl border border-border bg-card p-6 shadow-card">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold font-display">{reg.full_name}</h3>
                        <Badge variant={statusLabels[reg.registration_status]?.variant}>
                          {statusLabels[reg.registration_status]?.label}
                        </Badge>
                        <Badge variant="outline">{userTypeLabels[reg.user_type]}</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground space-y-0.5">
                        <p>📧 {reg.email}</p>
                        <p>📱 {reg.phone}</p>
                        <p>👤 ממליץ: {reg.recommender_name} — {reg.recommender_phone}</p>
                        <p className="text-xs">נרשם: {new Date(reg.created_at).toLocaleDateString("he-IL")}</p>
                      </div>
                    </div>

                    {reg.registration_status === "pending" && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="rounded-full gap-1"
                          onClick={() => updateStatus(reg.id, "approved")}
                        >
                          <CheckCircle className="h-4 w-4" /> אישור
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="rounded-full gap-1"
                          onClick={() => updateStatus(reg.id, "rejected")}
                        >
                          <XCircle className="h-4 w-4" /> דחייה
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
