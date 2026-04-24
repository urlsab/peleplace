import Navbar from "@/components/Navbar";
import ProfileView from "@/components/profile/ProfileView";
import DynamicBackground from "@/components/DynamicBackground";

/**
 * עמוד תצוגה מקדימה (דמו) של פרופיל משתמש מאושר.
 * נתונים פיקטיביים בלבד — לא נכתבים לדאטה בייס.
 * נגיש בכתובת /demo/profile
 */
const DemoProfile = () => {
  const profile = {
    full_name: "ישראל ישראלי",
    email: "israel.israeli@example.com",
    user_type: "single",
    registration_status: "approved",
  };

  const detailedProfile = {
    age: 29,
    gender: "men",
    religious_level: "religious",
    region: "jerusalem",
    city: "ירושלים",
    kashrut_preference: "mehadrin",
    dietary_preference: "regular",
    profile_image_url: null,
    about_me:
      "היי, אני ישראל 👋\nגר בירושלים, עובד בהייטק, אוהב טיולים בטבע, שירה בציבור וארוחות שבת ארוכות עם הרבה דברי תורה וצחוקים.\nשמח להכיר משפחות וקהילות חדשות בכל רחבי הארץ.",
  };

  return (
    <div className="min-h-screen">
      <DynamicBackground variant="jerusalem" />
      <Navbar />
      <div className="pt-24 pb-12 px-4">
        <div className="mx-auto max-w-2xl space-y-4">
          <div className="rounded-2xl border border-dashed border-primary/40 bg-primary/5 p-4 text-center">
            <p className="text-sm font-medium text-primary">
              👁️ תצוגה מקדימה — פרופיל פיקטיבי לדוגמה
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              כך ייראה פרופיל של משתמש/ת מאושר/ת אחרי שמילא/ה את כל הפרטים
            </p>
          </div>

          <ProfileView
            profile={profile}
            detailedProfile={detailedProfile}
            profileType="single"
            onEdit={() => {}}
          />
        </div>
      </div>
    </div>
  );
};

export default DemoProfile;
