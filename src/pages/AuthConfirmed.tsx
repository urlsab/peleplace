import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import DynamicBackground from "@/components/DynamicBackground";
import Navbar from "@/components/Navbar";

const AuthConfirmed = () => {
  const navigate = useNavigate();

  useEffect(() => {
    sessionStorage.setItem("pele_registration_confirmed_popup", "1");

    const finalize = async () => {
      try {
        await supabase.auth.signOut({ scope: "local" });
      } catch {
        // Ignore sign-out failure; still route to login.
      } finally {
        navigate("/auth", { replace: true });
      }
    };

    void finalize();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-24">
      <DynamicBackground variant="sea" />
      <Navbar />
      <div className="relative z-10 rounded-2xl border border-border bg-card/90 px-6 py-5 shadow-card text-center">
        מעדכנים את ההתחברות...
      </div>
    </div>
  );
};

export default AuthConfirmed;