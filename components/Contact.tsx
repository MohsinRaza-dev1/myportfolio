"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle, AlertCircle, Mail, MapPin } from "lucide-react";
import { profile } from "@/data";
import AnimatedSection from "@/components/AnimatedSection";
import SocialLinks from "@/components/ui/SocialLinks";
import RadialLoader from "@/components/ui/RadialLoader";

export default function Contact() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const validate = () => {
    if (!formState.name.trim()) return "Please enter your name.";
    if (!formState.email.trim()) return "Please enter your email.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email))
      return "Please enter a valid email address.";
    if (!formState.subject.trim()) return "Please enter a subject.";
    if (!formState.message.trim()) return "Please enter your message.";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const error = validate();
    if (error) {
      setErrorMsg(error);
      setStatus("error");
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to send message.");
      }

      setStatus("success");
      setFormState({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setStatus("idle"), 5000);
    } catch (err) {
      setStatus("error");
      setErrorMsg(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    }
  };

  return (
    <AnimatedSection id="contact" className="relative py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white md:text-4xl">
            Have an idea? Let&apos;s build it together<span className="text-primary-500">.</span>
          </h2>
          <p className="mt-4 text-lg text-dark-400">
            Whether you have a project in mind or just want to connect, I&apos;d love to hear from you.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl gap-10 md:grid-cols-5">
          {/* Left - Contact Info */}
          <div className="md:col-span-2">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-500/10 text-primary-400">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-sm text-dark-500">Email</p>
                  <a
                    href={`mailto:${profile.email}`}
                    className="font-medium text-white transition-colors hover:text-primary-400"
                  >
                    {profile.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-500/10 text-primary-400">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-sm text-dark-500">Location</p>
                  <p className="font-medium text-white">Pakistan</p>
                </div>
              </div>

              <div className="pt-4">
                <p className="text-sm text-dark-500">Social</p>
                <SocialLinks className="mt-3" />
              </div>
            </div>
          </div>

          {/* Right - Form */}
          <div className="md:col-span-3">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="mb-1.5 block text-sm text-dark-400">
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={formState.name}
                    onChange={(e) =>
                      setFormState({ ...formState, name: e.target.value })
                    }
                    className="w-full rounded-lg border border-dark-800 bg-dark-900/50 px-4 py-2.5 text-sm text-white placeholder-dark-500 transition-colors focus:border-primary-500/50 focus:outline-none focus:ring-1 focus:ring-primary-500/30"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="mb-1.5 block text-sm text-dark-400">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={formState.email}
                    onChange={(e) =>
                      setFormState({ ...formState, email: e.target.value })
                    }
                    className="w-full rounded-lg border border-dark-800 bg-dark-900/50 px-4 py-2.5 text-sm text-white placeholder-dark-500 transition-colors focus:border-primary-500/50 focus:outline-none focus:ring-1 focus:ring-primary-500/30"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="mb-1.5 block text-sm text-dark-400">
                  Subject
                </label>
                <input
                  id="subject"
                  type="text"
                  value={formState.subject}
                  onChange={(e) =>
                    setFormState({ ...formState, subject: e.target.value })
                  }
                  className="w-full rounded-lg border border-dark-800 bg-dark-900/50 px-4 py-2.5 text-sm text-white placeholder-dark-500 transition-colors focus:border-primary-500/50 focus:outline-none focus:ring-1 focus:ring-primary-500/30"
                  placeholder="What is this about?"
                />
              </div>

              <div>
                <label htmlFor="message" className="mb-1.5 block text-sm text-dark-400">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  value={formState.message}
                  onChange={(e) =>
                    setFormState({ ...formState, message: e.target.value })
                  }
                  className="w-full resize-none rounded-lg border border-dark-800 bg-dark-900/50 px-4 py-2.5 text-sm text-white placeholder-dark-500 transition-colors focus:border-primary-500/50 focus:outline-none focus:ring-1 focus:ring-primary-500/30"
                  placeholder="Tell me about your project..."
                />
              </div>

              <button
                type="submit"
                disabled={status === "loading"}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary-600 px-6 py-3 font-medium text-white transition-all hover:bg-primary-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === "loading" ? (
                  <>
                    <RadialLoader size="small" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Send Message
                  </>
                )}
              </button>

              {/* Status Messages */}
              {status === "success" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 rounded-lg bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400"
                >
                  <CheckCircle size={16} />
                  Message sent successfully! I&apos;ll get back to you soon.
                </motion.div>
              )}

              {status === "error" && errorMsg && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400"
                >
                  <AlertCircle size={16} />
                  {errorMsg}
                </motion.div>
              )}
            </form>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
