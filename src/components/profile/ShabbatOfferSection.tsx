import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Trash2, ToggleLeft, ToggleRight, Phone, MessageCircle, Mail, CalendarDays, Lock, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const kashrutLabels: Record<string, string> = {
  not_kosher: "לא כשר",
  kosher: "כשר",
  mehadrin: "כשר למהדרין",
  chalak_beit_yosef: "חלק/בית יוסף",
};

const VIBES = [
  { id: "board_games", label: "🎲 משחקי קופסא" },
  { id: "shabbat_songs", label: "🎵 שירי שבת" },
  { id: "good_food", label: "🍲 אוכל טעים" },
  { id: "good_talk", label: "💬 שיחה טובה" },
];

type Offer = {
  id: string;
  user_id: string;
  host_name: string;
  address: string;
  description: string | null;
  is_paid: boolean;
  kashrut_level: string;
  date: string;
  is_full: boolean;
  contact_phone: string | null;
  contact_whatsapp: string | null;
  contact_email: string | null;
  vibes: string[] | null;
  event_gender: "men" | "women" | "mixed" | null;
  meal_details: string | null;
  accommodation_options: string | null;
  capacity: number | null;
  special_requirements: string | null;
};

const emptyForm = {
  host_name: "",
  address: "",
  description: "",
  is_paid: false,
  kashrut_level: "kosher",
  date: "",
  vibes: [] as string[],
  event_gender: "" as "men" | "women" | "mixed" | "",
  meal_details: "",
  accommodation_options: "",
  capacity: "",
  special_requirements: "",
};

const ShabbatOfferSection = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ ...emptyForm });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Only hosts may add shabbat offers
  const isHost = profile?.user_type === "host" || profile?.user_type === "both";

  const { data: offers = [], isLoading } = useQuery<Offer[]>({
    queryKey: ["my-shabbat-offers", user?.id],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("shabbat_offers")
          .select("*")
          .eq("user_id", user!.id)
          .order("date", { ascending: true });
        if (error) return [];
        return (data || []) as Offer[];
      } catch {
        return [];
      }
    },
    enabled: !!user,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("shabbat_offers").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-shabbat-offers"] });
      qc.invalidateQueries({ queryKey: ["calendar-shabbat-offers"] });
      toast({ title: "הצעה נמחקה" });
    },
  });

  const toggleFullMutation = useMutation({
    mutationFn: async ({ id, is_full }: { id: string; is_full: boolean }) => {
      const { error } = await supabase.from("shabbat_offers").update({ is_full }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-shabbat-offers"] });
      qc.invalidateQueries({ queryKey: ["calendar-shabbat-offers"] });
    },
  });

  const openEdit = (offer: Offer) => {
    setForm({
      host_name: offer.host_name,
      address: offer.address,
      description: offer.description || "",
      is_paid: offer.is_paid,
      kashrut_level: offer.kashrut_level,
      date: offer.date,
      vibes: offer.vibes || [],
      event_gender: (offer.event_gender || "") as "men" | "women" | "mixed" | "",
      meal_details: offer.meal_details || "",
      accommodation_options: offer.accommodation_options || "",
      capacity: offer.capacity !== null && offer.capacity !== undefined ? String(offer.capacity) : "",
      special_requirements: offer.special_requirements || "",
    });
    setEditingId(offer.id);
    setShowForm(true);
  };

  const openNew = () => {
    setForm({ ...emptyForm });
    setEditingId(null);
    setShowForm((v) => !v);
  };

  const toggleVibe = (id: string) => {
    setForm((f) => ({
      ...f,
      vibes: f.vibes.includes(id) ? f.vibes.filter((v) => v !== id) : [...f.vibes, id],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.host_name || !form.address || !form.date) {
      toast({ title: "נא למלא שם, כתובת ותאריך", variant: "destructive" });
      return;
    }
    setSaving(true);

    const payload = {
      host_name: form.host_name,
      address: form.address,
      description: form.description || null,
      is_paid: form.is_paid,
      kashrut_level: form.kashrut_level,
      date: form.date,
      vibes: form.vibes.length > 0 ? form.vibes : null,
      event_gender: (form.event_gender as string) || null,
      meal_details: form.meal_details || null,
      accommodation_options: form.accommodation_options || null,
      capacity: form.capacity ? parseInt(form.capacity as string) : null,
      special_requirements: form.special_requirements || null,
    };

    let error;
    if (editingId) {
      ({ error } = await supabase.from("shabbat_offers").update(payload).eq("id", editingId));
    } else {
      ({ error } = await supabase.from("shabbat_offers").insert({
        ...payload,
        user_id: user!.id,
        is_full: false,
        contact_phone: profile?.phone || null,
        contact_whatsapp: profile?.phone || null,
        contact_email: profile?.email || null,
      }));
    }

    setSaving(false);
    if (error) {
      toast({ title: "שגיאה", description: error.message, variant: "destructive" });
    } else {
      toast({ title: editingId ? "ההצעה עודכנה ✨" : "ההצעה נוספה ✨" });
      setForm({ ...emptyForm });
      setShowForm(false);
      setEditingId(null);
      qc.invalidateQueries({ queryKey: ["my-shabbat-offers"] });
      qc.invalidateQueries({ queryKey: ["calendar-shabbat-offers"] });
      qc.invalidateQueries({ queryKey: ["date-shabbat-offers"] });
    }
  };

  return (
    <div className="mt-8 rounded-2xl border border-border bg-card shadow-card overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-primary/5">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-primary" />
          <h2 className="font-display font-bold text-lg">הצעות אירוח שלי ללוח שבתות</h2>
        </div>
        {isHost && (
          <Button
            size="sm"
            variant={showForm && !editingId ? "outline" : "default"}
            className="rounded-full gap-1.5"
            onClick={openNew}
          >
            <PlusCircle className="h-4 w-4" />
            {showForm && !editingId ? "סגור" : "הוסף שבת"}
          </Button>
        )}
      </div>

      {isHost && showForm && (
        <form onSubmit={handleSubmit} className="p-6 space-y-4 border-b border-border bg-background/60">
          <h3 className="font-bold font-display text-base">
            {editingId ? "✏️ עריכת הצעת אירוח" : "➕ הצעת אירוח חדשה"}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="of-host-name">שם המארח/ת *</Label>
              <Input id="of-host-name" placeholder="משפחת כהן" value={form.host_name}
                onChange={(e) => setForm((f) => ({ ...f, host_name: e.target.value }))} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="of-date">תאריך השבת *</Label>
              <Input id="of-date" type="date" value={form.date}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} required />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="of-address">כתובת אירוח *</Label>
            <Input id="of-address" placeholder="רחוב הרצל 12, תל אביב" value={form.address}
              onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} required />
          </div>
          {/* Event gender */}
          <div className="space-y-2">
            <Label>האירוע מיועד ל</Label>
            <RadioGroup
              value={form.event_gender}
              onValueChange={(v) => setForm((f) => ({ ...f, event_gender: v as "men" | "women" | "mixed" }))}
              className="flex gap-4"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="men" id="eg-men" />
                <Label htmlFor="eg-men" className="cursor-pointer font-normal">גברים</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="women" id="eg-women" />
                <Label htmlFor="eg-women" className="cursor-pointer font-normal">נשים</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="mixed" id="eg-mixed" />
                <Label htmlFor="eg-mixed" className="cursor-pointer font-normal">מעורב</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Capacity */}
          <div className="space-y-1.5">
            <Label htmlFor="of-capacity">כמות אנשים שניתן להזמין</Label>
            <Input
              id="of-capacity"
              type="number"
              min={1}
              placeholder="למשל: 6"
              value={form.capacity as string}
              onChange={(e) => setForm((f) => ({ ...f, capacity: e.target.value }))}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="of-desc">אופי האירוח (טקסט חופשי)</Label>
            <Textarea id="of-desc" placeholder="ארוחה חמה, שיחות, אווירה משפחתית..." className="min-h-[80px]"
              value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
          </div>

          {/* Meals */}
          <div className="space-y-1.5">
            <Label htmlFor="of-meals">פרטי ארוחות</Label>
            <Textarea
              id="of-meals"
              placeholder="האם יש ארוחות ומה תוכנן? למשל: ארוחת שישי + סעודת שבת מלאה..."
              className="min-h-[70px]"
              value={form.meal_details}
              onChange={(e) => setForm((f) => ({ ...f, meal_details: e.target.value }))}
            />
          </div>

          {/* Accommodation */}
          <div className="space-y-1.5">
            <Label htmlFor="of-accommodation">אפשרויות לינה</Label>
            <Textarea
              id="of-accommodation"
              placeholder="למשל: מיטות פנויות, מזרן על הרצפה, ללא לינה..."
              className="min-h-[70px]"
              value={form.accommodation_options}
              onChange={(e) => setForm((f) => ({ ...f, accommodation_options: e.target.value }))}
            />
          </div>

          {/* Special requirements */}
          <div className="space-y-1.5">
            <Label htmlFor="of-special">דרישות מיוחדות לאירוח</Label>
            <Textarea
              id="of-special"
              placeholder="למשל: רישיון נשק חובה, גיל 18+, ניסיון קודם בהתנדבות..."
              className="min-h-[70px]"
              value={form.special_requirements}
              onChange={(e) => setForm((f) => ({ ...f, special_requirements: e.target.value }))}
            />
          </div>

          {/* Vibes */}
          <div className="space-y-2">
            <Label>אנחנו אוהבים…</Label>
            <div className="flex flex-wrap gap-3">
              {VIBES.map((v) => (
                <label key={v.id} className={`flex items-center gap-2 rounded-full border-2 px-4 py-2 cursor-pointer transition-all text-sm font-medium select-none ${
                  form.vibes.includes(v.id)
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-background hover:border-primary/40"
                }`}>
                  <Checkbox
                    checked={form.vibes.includes(v.id)}
                    onCheckedChange={() => toggleVibe(v.id)}
                    className="hidden"
                  />
                  {v.label}
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>רמת כשרות</Label>
              <Select value={form.kashrut_level} onValueChange={(v) => setForm((f) => ({ ...f, kashrut_level: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(kashrutLabels).map(([v, l]) => (
                    <SelectItem key={v} value={v}>{l}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>האם בתשלום?</Label>
              <Select value={form.is_paid ? "yes" : "no"} onValueChange={(v) => setForm((f) => ({ ...f, is_paid: v === "yes" }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="no">ללא תשלום 🎁</SelectItem>
                  <SelectItem value="yes">בתשלום 💳</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {!editingId && (
            <div className="rounded-lg bg-primary/5 border border-primary/20 px-3 py-2 text-xs text-muted-foreground">
              📞 פרטי הקשר (טלפון ומייל) יילקחו אוטומטית מהפרופיל שלך ויוצגו למי שמרחף על התאריך בלוח
            </div>
          )}
          <div className="flex gap-2">
            <Button type="submit" className="flex-1 rounded-full font-bold" disabled={saving}>
              {saving ? "שומר..." : editingId ? "שמירת שינויים" : "הוספת הצעה"}
            </Button>
            {editingId && (
              <Button type="button" variant="outline" className="rounded-full" onClick={() => { setShowForm(false); setEditingId(null); setForm({ ...emptyForm }); }}>
                ביטול
              </Button>
            )}
          </div>
        </form>
      )}

      <div className="p-4 space-y-3">
        {isLoading && <p className="text-sm text-muted-foreground text-center py-4">טוען...</p>}
        {!isLoading && offers.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-6">
            עדיין לא הוספת הצעות אירוח ללוח השבתות
          </p>
        )}
        {offers.map((offer) => (
          <div key={offer.id} className={`rounded-xl border p-4 flex items-start gap-3 transition-all ${offer.is_full ? "border-border/40 bg-muted/30 opacity-60" : "border-primary/25 bg-primary/5"}`}>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-sm">{offer.host_name}</span>
                <span className="text-xs text-muted-foreground">{offer.date}</span>
                <Badge variant={offer.is_paid ? "default" : "secondary"} className="text-[10px]">
                  {offer.is_paid ? "בתשלום" : "חינם"}
                </Badge>
                <Badge variant="outline" className="text-[10px]">{kashrutLabels[offer.kashrut_level] || offer.kashrut_level}</Badge>
                {offer.is_full && <Badge variant="destructive" className="text-[10px]">תפוס</Badge>}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 truncate">{offer.address}</p>
              {offer.description && <p className="text-xs mt-1 line-clamp-1">{offer.description}</p>}
              {offer.capacity !== null && offer.capacity !== undefined && (
                <p className="text-xs text-muted-foreground mt-0.5">👥 עד {offer.capacity} אנשים</p>
              )}
              {offer.event_gender && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {{ men: "גברים בלבד", women: "נשים בלבד", mixed: "מעורב" }[offer.event_gender] ?? ""}
                </p>
              )}
              {offer.vibes && offer.vibes.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {offer.vibes.map((vid) => {
                    const vibe = VIBES.find((v) => v.id === vid);
                    return vibe ? (
                      <span key={vid} className="text-[10px] bg-primary/10 text-primary rounded-full px-2 py-0.5">{vibe.label}</span>
                    ) : null;
                  })}
                </div>
              )}
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button
                type="button"
                title="עריכה"
                className="text-muted-foreground hover:text-primary transition-colors"
                onClick={() => openEdit(offer)}
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                type="button"
                title={offer.is_full ? "סמן כפנוי" : "סמן כתפוס"}
                className="text-muted-foreground hover:text-primary transition-colors"
                onClick={() => toggleFullMutation.mutate({ id: offer.id, is_full: !offer.is_full })}
              >
                {offer.is_full
                  ? <ToggleRight className="h-5 w-5 text-destructive" />
                  : <ToggleLeft className="h-5 w-5" />
                }
              </button>
              <button
                type="button"
                title="מחיקה"
                className="text-muted-foreground hover:text-destructive transition-colors"
                onClick={() => deleteMutation.mutate(offer.id)}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShabbatOfferSection;
