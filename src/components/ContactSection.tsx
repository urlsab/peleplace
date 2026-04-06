import { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

const ContactSection = () => {
  const [form, setForm] = useState({ full_name: "", email: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.full_name.trim() || !form.email.trim() || !form.phone.trim() || !form.message.trim()) {
      toast.error("נא למלא את כל השדות");
      return;
    }

    setLoading(true);
    const { error } = await supabase.from("contact_inquiries").insert({
      full_name: form.full_name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      message: form.message.trim(),
    });
    setLoading(false);

    if (error) {
      toast.error("שגיאה בשליחה, נסו שוב");
      return;
    }

    setSent(true);
    toast.success("ההודעה נשלחה בהצלחה!");
  };

  return (
    <section className="py-24">
      <div className="container mx-auto px-6">
        <motion.div {...fadeUp} transition={{ duration: 0.6 }} className="mb-14 text-center">
          <span className="mb-3 inline-block rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold text-primary tracking-wide">
            צרו קשר
          </span>
          <h2 className="mb-3 text-3xl font-black md:text-[2.75rem] leading-tight">
            כתבו <span className="text-gradient-warm">לי</span>
          </h2>
          <p className="text-muted-foreground text-base max-w-md mx-auto">
            השאירו פרטים ואחזור אליכם בהקדם
          </p>
        </motion.div>

        <motion.div {...fadeUp} transition={{ delay: 0.15, duration: 0.5 }} className="max-w-lg mx-auto">
          {sent ? (
            <div className="text-center space-y-4 py-10">
              <CheckCircle className="h-14 w-14 text-primary mx-auto" />
              <h3 className="text-xl font-bold font-display">תודה שפניתם!</h3>
              <p className="text-muted-foreground text-sm">קיבלתי את ההודעה ואחזור אליכם בהקדם 💛</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4" dir="rtl">
              <Input
                placeholder="שם מלא"
                value={form.full_name}
                onChange={(e) => setForm((p) => ({ ...p, full_name: e.target.value }))}
                maxLength={100}
                required
              />
              <Input
                type="email"
                placeholder="אימייל"
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                maxLength={255}
                required
              />
              <Input
                type="tel"
                placeholder="טלפון"
                value={form.phone}
                onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                maxLength={20}
                required
              />
              <Textarea
                placeholder="מה תרצו לשאול?"
                value={form.message}
                onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                maxLength={1000}
                rows={4}
                required
              />
              <Button type="submit" disabled={loading} className="w-full rounded-full h-11 font-bold gap-2">
                {loading ? "שולח..." : (
                  <>
                    <Send className="h-4 w-4" />
                    שלחו הודעה
                  </>
                )}
              </Button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;
