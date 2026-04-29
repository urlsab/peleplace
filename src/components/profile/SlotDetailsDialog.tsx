import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { labelHebrewDate } from "@/lib/hebrewDates";
import { CopyCheck } from "lucide-react";

export type SlotHostType = "family" | "work" | "volunteer" | "singles_group" | "organized_shabbat";

export interface SlotDetails {
  capacity: number | null;
  guest_gender: "men" | "women" | "mixed" | null;
  arrangement: "mixed" | "separated" | null;
  requires_experience: boolean;
  requires_driving_license: boolean;
  requires_weapon_license: boolean;
  requires_first_aid: boolean;
  requires_physical_fitness: boolean;
  extra_requirement: string | null;
  notes: string | null;
}

export const emptySlot: SlotDetails = {
  capacity: null,
  guest_gender: null,
  arrangement: null,
  requires_experience: false,
  requires_driving_license: false,
  requires_weapon_license: false,
  requires_first_aid: false,
  requires_physical_fitness: false,
  extra_requirement: null,
  notes: null,
};

interface SlotDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hostType: SlotHostType;
  date: string | null;
  initial: SlotDetails;
  onSave: (details: SlotDetails, applyToAll: boolean) => void;
}

const isHosting = (t: SlotHostType) =>
  t === "family" || t === "singles_group" || t === "organized_shabbat";
const isWorkOrVolunteer = (t: SlotHostType) => t === "work" || t === "volunteer";

const SlotDetailsDialog = ({
  open,
  onOpenChange,
  hostType,
  date,
  initial,
  onSave,
}: SlotDetailsDialogProps) => {
  const [s, setS] = useState<SlotDetails>(initial);

  useEffect(() => {
    if (open) setS(initial);
  }, [open, initial]);

  const update = <K extends keyof SlotDetails>(k: K, v: SlotDetails[K]) =>
    setS((prev) => ({ ...prev, [k]: v }));

  const handleSave = (applyToAll: boolean) => {
    onSave(s, applyToAll);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader className="text-right">
          <DialogTitle>פרטי תאריך</DialogTitle>
          <DialogDescription>
            {date ? labelHebrewDate(date) : ""}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Capacity */}
          <div className="space-y-2">
            <Label htmlFor="capacity">מספר מקומות פנויים</Label>
            <Input
              id="capacity"
              type="number"
              min={1}
              value={s.capacity ?? ""}
              onChange={(e) => update("capacity", e.target.value ? parseInt(e.target.value) : null)}
              placeholder="כמה אנשים אפשר לקבל?"
            />
          </div>

          {/* Guest gender */}
          <div className="space-y-2">
            <Label>למי האירוח מתאים?</Label>
            <RadioGroup
              value={s.guest_gender ?? ""}
              onValueChange={(v) => update("guest_gender", v as SlotDetails["guest_gender"])}
              className="flex gap-4"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="men" id="g-men" />
                <Label htmlFor="g-men" className="cursor-pointer font-normal">גברים</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="women" id="g-women" />
                <Label htmlFor="g-women" className="cursor-pointer font-normal">נשים</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="mixed" id="g-mixed" />
                <Label htmlFor="g-mixed" className="cursor-pointer font-normal">מעורב</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Hosting-only: arrangement */}
          {isHosting(hostType) && (
            <div className="space-y-2">
              <Label>סידור הישיבה/לינה</Label>
              <RadioGroup
                value={s.arrangement ?? ""}
                onValueChange={(v) => update("arrangement", v as SlotDetails["arrangement"])}
                className="flex gap-4"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="mixed" id="a-mixed" />
                  <Label htmlFor="a-mixed" className="cursor-pointer font-normal">מעורב</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="separated" id="a-sep" />
                  <Label htmlFor="a-sep" className="cursor-pointer font-normal">נפרד</Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {/* Work/Volunteer: requirements */}
          {isWorkOrVolunteer(hostType) && (
            <>
              <Separator />
              <div className="space-y-3">
                <Label>דרישות מיוחדות</Label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { key: "requires_experience", label: "ניסיון קודם" },
                    { key: "requires_driving_license", label: "רישיון נהיגה" },
                    { key: "requires_weapon_license", label: "רישיון נשק" },
                    { key: "requires_first_aid", label: "מגיש עזרה ראשונה" },
                    { key: "requires_physical_fitness", label: "כושר גופני" },
                  ].map((r) => (
                    <div key={r.key} className="flex items-center gap-2">
                      <Checkbox
                        id={r.key}
                        checked={s[r.key as keyof SlotDetails] as boolean}
                        onCheckedChange={(v) => update(r.key as keyof SlotDetails, !!v as any)}
                      />
                      <Label htmlFor={r.key} className="cursor-pointer font-normal text-sm">
                        {r.label}
                      </Label>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="extra-req" className="text-sm">דרישה נוספת (חופשי)</Label>
                  <Input
                    id="extra-req"
                    value={s.extra_requirement ?? ""}
                    onChange={(e) => update("extra_requirement", e.target.value || null)}
                    placeholder="למשל: ידיעת אנגלית, גיל מינימלי..."
                  />
                </div>
              </div>
            </>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">הערות לתאריך הזה</Label>
            <Textarea
              id="notes"
              value={s.notes ?? ""}
              onChange={(e) => update("notes", e.target.value || null)}
              placeholder="פרטים נוספים שכדאי שהאורחים ידעו"
              rows={3}
            />
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            type="button"
            variant="outline"
            className="rounded-full gap-2"
            onClick={() => handleSave(true)}
          >
            <CopyCheck className="h-4 w-4" />
            החל על כל התאריכים
          </Button>
          <Button type="button" className="rounded-full" onClick={() => handleSave(false)}>
            שמור לתאריך הזה
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SlotDetailsDialog;
