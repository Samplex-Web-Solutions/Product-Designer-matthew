import { useEffect, useState } from "react";
import emailjs from "emailjs-com";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChatBubbleLeftRightIcon,
  XMarkIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/24/solid";
import { FaWhatsapp } from "react-icons/fa";

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || "service_iirg5ef";
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "template_iuasd2u";
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "B8QoP2TaMm3nitebN";

export default function ContactWidget({
  whatsappNumber = "2348000000000",
  defaultWhatsAppText = "Hello! I'd like to discuss a project with you.",
  externalOpenSignal = 0,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | success | error

  useEffect(() => {
    if (externalOpenSignal > 0) {
      setMenuOpen(true);
    }
  }, [externalOpenSignal]);

  const handleWhatsApp = () => {
    const cleanNumber = (whatsappNumber || "").replace(/\D/g, "");
    const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(defaultWhatsAppText)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setMenuOpen(false);
  };

  const handleOpenEmailModal = () => {
    setMenuOpen(false);
    setStatus("idle");
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");

    try {
      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          name: form.name,
          email: form.email,
          message: form.message,
        },
        PUBLIC_KEY
      );
      setStatus("success");
      setForm({ name: "", email: "", message: "" });
      setTimeout(() => {
        setModalOpen(false);
        setStatus("idle");
      }, 1800);
    } catch (err) {
      console.error("EmailJS error:", err);
      setStatus("error");
    }
  };

  return (
    <>
      {/* Floating Chat Widget */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.95 }}
              transition={{ duration: 0.18 }}
              className="w-64 rounded-2xl bg-[#1b1220] border border-white/15 p-3 shadow-2xl text-white"
            >
              <p className="text-xs uppercase tracking-wider text-zinc-400 px-2 pb-2">
                How would you like to connect?
              </p>

              <button
                type="button"
                onClick={handleWhatsApp}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/10 transition text-left text-sm font-medium"
              >
                <span className="h-8 w-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <FaWhatsapp className="w-4 h-4" />
                </span>
                <div>
                  <div className="text-white">Chat on WhatsApp</div>
                  <div className="text-[11px] text-zinc-400">Direct instant chat</div>
                </div>
              </button>

              <button
                type="button"
                onClick={handleOpenEmailModal}
                className="w-full mt-1 flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/10 transition text-left text-sm font-medium"
              >
                <span className="h-8 w-8 rounded-full bg-[#e85d04]/20 text-[#ff7b29] flex items-center justify-center shrink-0">
                  <PaperAirplaneIcon className="w-4 h-4" />
                </span>
                <div>
                  <div className="text-white">Message Now</div>
                  <div className="text-[11px] text-zinc-400">Send via email form</div>
                </div>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Open chat options"
          className="h-14 w-14 rounded-full bg-[#e85d04] hover:bg-[#f46a0e] text-white shadow-xl flex items-center justify-center transition transform hover:scale-105 active:scale-95"
        >
          {menuOpen ? (
            <XMarkIcon className="w-6 h-6" />
          ) : (
            <ChatBubbleLeftRightIcon className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* EmailJS Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.97 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg rounded-2xl bg-[#18101c] border border-white/15 p-6 md:p-8 text-white shadow-2xl"
            >
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-xs uppercase tracking-widest text-[#e85d04]">
                    Direct Message
                  </p>
                  <h3 className="text-2xl font-bold mt-1">Send a Message</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Jane Doe"
                    className="w-full rounded-xl bg-white/5 border border-white/15 px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#e85d04]"
                  />
                </div>

                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Your Email</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="jane@example.com"
                    className="w-full rounded-xl bg-white/5 border border-white/15 px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#e85d04]"
                  />
                </div>

                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Message</label>
                  <textarea
                    rows={4}
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell me about your project or inquiry..."
                    className="w-full rounded-xl bg-white/5 border border-white/15 px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#e85d04]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="w-full py-3 rounded-xl bg-[#e85d04] hover:bg-[#f46a0e] disabled:opacity-60 font-semibold text-sm text-white transition"
                >
                  {status === "sending" ? "Sending..." : "Send Message"}
                </button>

                {status === "success" && (
                  <p className="text-sm text-emerald-400 text-center">
                    Message sent. I will get back to you shortly.
                  </p>
                )}
                {status === "error" && (
                  <p className="text-sm text-red-400 text-center">
                    Could not send message. Please try again or use WhatsApp.
                  </p>
                )}
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}