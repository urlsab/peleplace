import { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle, Mail, Phone, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";


const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

const ContactSection = () => {
  const [form, setForm] = useState({ full_name: "", email: "", phone: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.full_name.trim() || !form.email.trim() || !form.phone.trim() || !form.subject || !form.message.trim()) {
      toast.error("נא למלא את כל השדות");
      return;
    }

    setLoading(true);
    const { error } = await supabase.from("contact_inquiries").insert({
      full_name: form.full_name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      subject: form.subject,
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
    <section id="contact" className="relative py-24 overflow-hidden">

      {/* Floating decorative icons */}
      <div className="absolute top-12 left-[12%] animate-float-slow opacity-[0.07]">
        <Mail className="h-16 w-16 text-primary" />
      </div>
      <div className="absolute bottom-16 right-[10%] animate-float-reverse opacity-[0.06]">
        <Phone className="h-14 w-14 text-secondary" />
      </div>
      <div className="absolute top-1/2 right-[4%] animate-drift opacity-[0.05]">
        <Sparkles className="h-10 w-10 text-terracotta" />
      </div>

      {/* Warm blurred orbs */}
      <div className="absolute top-0 right-1/3 h-56 w-56 rounded-full bg-secondary/10 blur-[80px]" />
      <div className="absolute bottom-0 left-1/3 h-40 w-40 rounded-full bg-primary/8 blur-[60px]" />

      <div className="container relative z-10 mx-auto px-6">
        <motion.div {...fadeUp} transition={{ duration: 0.6 }} className="mb-14 text-center">
          <div className="inline-block rounded-2xl rotate-[-1deg] px-10 py-7 backdrop-blur-sm border border-primary/20" style={{ background: "linear-gradient(125deg, hsla(155,30%,45%,0.22), hsla(30,50%,58%,0.15))" }}>
            <span className="mb-3 inline-block rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold text-primary tracking-wide">
              צרו קשר
            </span>
            <h2 className="mb-3 text-3xl font-black md:text-[2.75rem] leading-tight">
              כתבו <span className="text-gradient-warm">לנו</span>
            </h2>
            <p className="text-muted-foreground text-base max-w-md mx-auto">
              השאירו פרטים ואחזור אליכם בהקדם
            </p>
          </div>
        </motion.div>

        <motion.div {...fadeUp} transition={{ delay: 0.15, duration: 0.5 }} className="max-w-lg mx-auto">
          {sent ? (
            <div className="text-center space-y-4 py-10">
              <CheckCircle className="h-14 w-14 text-primary mx-auto" />
              <h3 className="text-xl font-bold font-display">תודה שפניתם!</h3>
              <p className="text-muted-foreground text-sm">קיבלתי את ההודעה ואחזור אליכם בהקדם 💛</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 bg-background/80 backdrop-blur-sm rounded-2xl p-8 border border-border/40 shadow-card" dir="rtl">
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
              <Select value={form.subject} onValueChange={(val) => setForm((p) => ({ ...p, subject: val }))}>
                <SelectTrigger>
                  <SelectValue placeholder="נושא הפנייה" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="guest">מתארח/ת</SelectItem>
                  <SelectItem value="host">מארח/ת</SelectItem>
                  <SelectItem value="other">אחר</SelectItem>
                </SelectContent>
              </Select>
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
