import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

// Jewish holidays for 5785-5786 (2024-2026)
const JEWISH_HOLIDAYS: { label: string; dates: string[] }[] = [
  { label: "ראש השנה", dates: ["2025-09-22", "2025-09-23"] },
  { label: "יום כיפור", dates: ["2025-10-01"] },
  { label: "סוכות", dates: ["2025-10-06", "2025-10-07"] },
  { label: "שמחת תורה", dates: ["2025-10-13"] },
  { label: "פורים", dates: ["2026-03-05"] },
  { label: "ליל הסדר", dates: ["2026-04-01"] },
  { label: "חג שני של פסח", dates: ["2026-04-08"] },
  { label: "שבועות", dates: ["2026-05-21", "2026-05-22"] },
];

function getUpcomingShabbats(count = 52): { date: string; label: string }[] {
  const shabbats: { date: string; label: string }[] = [];
  const now = new Date();
  const d = new Date(now);
  // Move to next Friday
  d.setDate(d.getDate() + ((5 - d.getDay() + 7) % 7 || 7));

  for (let i = 0; i < count; i++) {
    const dateStr = d.toISOString().split("T")[0];
    shabbats.push({
      date: dateStr,
      label: `שבת ${d.toLocaleDateString("he-IL", { day: "numeric", month: "long" })}`,
    });
    d.setDate(d.getDate() + 7);
  }
  return shabbats;
}

interface JewishDatePickerProps {
  selectedDates: string[];
  onChange: (dates: string[]) => void;
}

const JewishDatePicker = ({ selectedDates, onChange }: JewishDatePickerProps) => {
  const [showAllShabbats, setShowAllShabbats] = useState(false);
  const shabbats = getUpcomingShabbats();

  const toggleDate = (date: string) => {
    if (selectedDates.includes(date)) {
      onChange(selectedDates.filter((d) => d !== date));
    } else {
      onChange([...selectedDates, date]);
    }
  };

  const toggleHoliday = (holiday: typeof JEWISH_HOLIDAYS[0]) => {
    const allSelected = holiday.dates.every((d) => selectedDates.includes(d));
    if (allSelected) {
      onChange(selectedDates.filter((d) => !holiday.dates.includes(d)));
    } else {
      const newDates = [...selectedDates];
      holiday.dates.forEach((d) => {
        if (!newDates.includes(d)) newDates.push(d);
      });
      onChange(newDates);
    }
  };

  const selectAllShabbats = () => {
    const shabbatDates = shabbats.map((s) => s.date);
    const allSelected = shabbatDates.every((d) => selectedDates.includes(d));
    if (allSelected) {
      onChange(selectedDates.filter((d) => !shabbatDates.includes(d)));
    } else {
      const newDates = [...selectedDates];
      shabbatDates.forEach((d) => {
        if (!newDates.includes(d)) newDates.push(d);
      });
      onChange(newDates);
    }
  };

  const removeDate = (date: string) => {
    onChange(selectedDates.filter((d) => d !== date));
  };

  return (
    <div className="space-y-4">
      {/* Jewish Holidays */}
      <div className="rounded-xl border border-border bg-background p-4 space-y-3">
        <h4 className="font-bold text-sm">🕎 חגים יהודיים</h4>
        {JEWISH_HOLIDAYS.map((holiday) => {
          const allSelected = holiday.dates.every((d) => selectedDates.includes(d));
          return (
            <div key={holiday.label} className="flex items-center gap-2">
              <Checkbox
                checked={allSelected}
                onCheckedChange={() => toggleHoliday(holiday)}
              />
              <Label className="cursor-pointer" onClick={() => toggleHoliday(holiday)}>
                {holiday.label}
              </Label>
            </div>
          );
        })}
      </div>

      {/* Shabbats */}
      <div className="rounded-xl border border-border bg-background p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-sm">✡️ שבתות</h4>
          <button
            type="button"
            onClick={selectAllShabbats}
            className="text-xs text-primary hover:underline"
          >
            {shabbats.every((s) => selectedDates.includes(s.date))
              ? "הסר הכל"
              : "בחר את כל השבתות"}
          </button>
        </div>
        <button
          type="button"
          onClick={() => setShowAllShabbats(!showAllShabbats)}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          {showAllShabbats ? "הסתר רשימה ▲" : `הצג ${shabbats.length} שבתות ▼`}
        </button>
        {showAllShabbats && (
          <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
            {shabbats.map((s) => (
              <div key={s.date} className="flex items-center gap-2">
                <Checkbox
                  checked={selectedDates.includes(s.date)}
                  onCheckedChange={() => toggleDate(s.date)}
                />
                <span className="text-xs">{s.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Selected dates summary */}
      {selectedDates.length > 0 && (
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">
            נבחרו {selectedDates.length} תאריכים:
          </Label>
          <div className="flex flex-wrap gap-1">
            {selectedDates.sort().slice(0, 10).map((d) => {
              const holiday = JEWISH_HOLIDAYS.find((h) => h.dates.includes(d));
              const dateObj = new Date(d + "T00:00:00");
              const label = holiday
                ? holiday.label
                : `שבת ${dateObj.toLocaleDateString("he-IL", { day: "numeric", month: "short" })}`;
              return (
                <Badge key={d} variant="secondary" className="text-xs gap-1">
                  {label}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeDate(d)} />
                </Badge>
              );
            })}
            {selectedDates.length > 10 && (
              <Badge variant="outline" className="text-xs">
                +{selectedDates.length - 10} עוד
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default JewishDatePicker;
