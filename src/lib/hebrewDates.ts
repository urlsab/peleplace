import { HDate, HebrewCalendar, flags } from "@hebcal/core";

/**
 * Returns a short Hebrew label for a date string (YYYY-MM-DD).
 * Prefers holiday name; otherwise "שבת DD/MM" or "DD/MM".
 */
export function labelHebrewDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  if (isNaN(d.getTime())) return dateStr;

  const events = HebrewCalendar.calendar({
    start: d,
    end: d,
    il: true,
    candlelighting: false,
    sedrot: false,
    noMinorFast: false,
    noRoshChodesh: true,
    noModern: false,
  });

  const holiday = events.find((ev) => {
    const f = ev.getFlags();
    return (
      (f & flags.CHAG) ||
      (f & flags.YOM_TOV_ENDS) ||
      (f & flags.CHOL_HAMOED) ||
      (f & flags.MINOR_HOLIDAY) ||
      (f & flags.MAJOR_FAST) ||
      (f & flags.MINOR_FAST) ||
      (f & flags.MODERN_HOLIDAY) ||
      (f & flags.SPECIAL_SHABBAT)
    );
  });

  const dayMonth = d.toLocaleDateString("he-IL", { day: "numeric", month: "short" });

  if (holiday) {
    return `${holiday.render("he")} · ${dayMonth}`;
  }

  if (d.getDay() === 6) {
    return `שבת ${dayMonth}`;
  }
  if (d.getDay() === 5) {
    return `ערב שבת ${dayMonth}`;
  }
  return dayMonth;
}

export function sortDateStrings(dates: string[]): string[] {
  return [...dates].sort();
}
