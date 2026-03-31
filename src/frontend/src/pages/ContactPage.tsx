import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useSite } from "../context/SiteContext";

export default function ContactPage() {
  const { content } = useSite();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in all fields");
      return;
    }
    setSending(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSending(false);
    setSent(true);
    toast.success("Message sent! I'll be in touch soon.");
  };

  return (
    <main className="min-h-screen pt-28 pb-16 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h1 className="font-serif text-5xl text-white font-medium">
            Get in Touch
          </h1>
          <div className="w-16 h-px bg-white/30 mx-auto mt-6" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="space-y-6">
              <h2 className="font-serif text-2xl text-white/90">
                Let&apos;s Connect
              </h2>
              <p className="text-white/60 font-sans text-sm leading-relaxed">
                Whether you have a question, a collaboration idea, or simply
                want to say hello — I&apos;d love to hear from you.
              </p>
            </div>

            <div className="space-y-4">
              {content.contactEmail && (
                <div className="flex items-center gap-4 text-white/70">
                  <div className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center">
                    <Mail size={15} />
                  </div>
                  <span className="font-sans text-sm">
                    {content.contactEmail}
                  </span>
                </div>
              )}
              {content.contactPhone && (
                <div className="flex items-center gap-4 text-white/70">
                  <div className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center">
                    <Phone size={15} />
                  </div>
                  <span className="font-sans text-sm">
                    {content.contactPhone}
                  </span>
                </div>
              )}
              {content.contactAddress && (
                <div className="flex items-center gap-4 text-white/70">
                  <div className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center shrink-0">
                    <MapPin size={15} />
                  </div>
                  <span className="font-sans text-sm">
                    {content.contactAddress}
                  </span>
                </div>
              )}
            </div>

            <div className="vintage-paper relative p-6 rounded">
              <p
                className="font-serif text-lg italic leading-relaxed"
                style={{ color: "#5c4a2e" }}
              >
                &ldquo;Every connection begins with a single word.&rdquo;
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            {sent ? (
              <div
                className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12"
                data-ocid="contact.success_state"
              >
                <div className="w-16 h-16 rounded-full border border-white/30 flex items-center justify-center">
                  <Send size={24} className="text-white/60" />
                </div>
                <h3 className="font-serif text-2xl text-white">Thank You</h3>
                <p className="text-white/60 font-sans text-sm">
                  Your message is on its way.
                </p>
                <button
                  type="button"
                  onClick={() => setSent(false)}
                  className="text-white/50 hover:text-white text-xs tracking-wider uppercase transition-colors mt-4"
                  data-ocid="contact.send_again.button"
                >
                  Send Another
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="space-y-5"
                data-ocid="contact.form"
              >
                <div className="space-y-1.5">
                  <Label className="text-white/60 text-xs tracking-wider uppercase font-sans">
                    Name
                  </Label>
                  <Input
                    value={form.name}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, name: e.target.value }))
                    }
                    placeholder="Your name"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/30 focus:border-white/50 focus:bg-white/15"
                    data-ocid="contact.name.input"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-white/60 text-xs tracking-wider uppercase font-sans">
                    Email
                  </Label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, email: e.target.value }))
                    }
                    placeholder="your@email.com"
                    autoComplete="email"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/30 focus:border-white/50 focus:bg-white/15"
                    data-ocid="contact.email.input"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-white/60 text-xs tracking-wider uppercase font-sans">
                    Message
                  </Label>
                  <Textarea
                    value={form.message}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, message: e.target.value }))
                    }
                    placeholder="What's on your mind?"
                    rows={5}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/30 focus:border-white/50 focus:bg-white/15 resize-none"
                    data-ocid="contact.message.textarea"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={sending}
                  className="w-full bg-white/15 hover:bg-white/25 border border-white/30 text-white font-sans text-xs tracking-widest uppercase"
                  data-ocid="contact.submit_button"
                >
                  {sending ? (
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full border border-white/50 border-t-transparent animate-spin" />
                      Sending…
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send size={13} />
                      Send Message
                    </span>
                  )}
                </Button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </main>
  );
}
