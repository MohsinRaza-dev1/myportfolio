"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Sparkles } from "lucide-react";
import { useContent } from "@/lib/content-context";

// ─── Types ────────────────────────────────────────────────────────────────

interface Message {
  role: "user" | "bot";
  text: string;
}

// ─── Suggested Questions ──────────────────────────────────────────────────

const SUGGESTIONS = [
  "What skills does Mohsin have?",
  "Tell me about his projects",
  "What experience does he have?",
  "How can I contact him?",
];

// ─── Component ────────────────────────────────────────────────────────────

export default function ChatBot() {
  const { content } = useContent();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", text: `👋 Hey there! I'm Mohsin's AI assistant. Ask me anything about his **skills**, **projects**, **experience**, or **how to contact him** — I know everything!` },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => `anon_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  const handleSend = async (text?: string) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;
    setInput("");

    const userMsg: Message = { role: "user", text: msg };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: msg,
          sessionId,
        }),
      });

      const data = await res.json();

      if (res.ok && data.reply) {
        setMessages((prev) => [...prev, { role: "bot", text: data.reply }]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "bot",
            text: data.reply || "Sorry, I couldn't generate a response. Please try asking differently!",
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: "Sorry, I'm having trouble connecting. Please try again, or reach out to Mohsin directly!",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className="group fixed bottom-20 right-6 z-[110] flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-lg transition-all hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:scale-105 active:scale-95"
        aria-label={open ? "Close chat" : "Open AI assistant"}
      >
        {open ? (
          <X size={20} />
        ) : (
          <div className="relative">
            <Sparkles size={20} className="animate-pulse" />
            <span className="absolute -right-0.5 -top-0.5 flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </span>
          </div>
        )}
      </button>

      {/* Chat Panel */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[105] bg-black/30 backdrop-blur-sm md:bg-transparent md:backdrop-blur-none"
              onClick={() => setOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95, originX: 1, originY: 1 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed bottom-36 right-6 z-[110] flex w-[calc(100vw-3rem)] max-w-sm flex-col rounded-2xl border border-dark-700/80 bg-dark-900 shadow-2xl shadow-black/50"
              style={{ height: "520px" }}
            >
              {/* Header */}
              <div className="flex items-center justify-between rounded-t-2xl bg-gradient-to-r from-primary-600/20 to-primary-800/10 border-b border-dark-700/80 px-4 py-3.5">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-md">
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Mohsin&apos;s AI</p>
                    <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block" />
                      Online — ready to help
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-dark-500 transition-colors hover:bg-dark-700 hover:text-white"
                  aria-label="Close"
                >
                  <X size={15} />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scrollbar-thin">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[88%] whitespace-pre-wrap rounded-xl px-4 py-2.5 text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "bg-primary-600 text-white rounded-br-md"
                          : "bg-dark-800/80 text-dark-200 rounded-bl-md border border-dark-700/50"
                      }`}
                    >
                      {msg.text.split(/(\*\*[^*]+\*\*)/).map((part, j) =>
                        part.startsWith("**") && part.endsWith("**")
                          ? <strong key={j} className="text-white">{part.slice(2, -2)}</strong>
                          : part
                      )}
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="flex justify-start">
                    <div className="rounded-xl rounded-bl-md bg-dark-800/80 border border-dark-700/50 px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-dark-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="h-2 w-2 rounded-full bg-dark-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="h-2 w-2 rounded-full bg-dark-500 animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                )}

                {messages.length === 1 && !loading && (
                  <div className="pt-2">
                    <p className="text-[11px] text-dark-500 mb-2">Try asking:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {SUGGESTIONS.map((q) => (
                        <button
                          key={q}
                          onClick={() => handleSend(q)}
                          className="rounded-full border border-dark-700/60 bg-dark-800/40 px-3 py-1.5 text-xs text-dark-400 transition-colors hover:border-primary-500/40 hover:text-primary-400 hover:bg-primary-500/10"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="border-t border-dark-700/80 p-3">
                <div className="flex items-center gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about Mohsin..."
                    disabled={loading}
                    className="flex-1 rounded-xl border border-dark-700 bg-dark-800/50 px-3.5 py-2.5 text-sm text-white placeholder-dark-500 transition-colors focus:border-primary-500/50 focus:outline-none focus:ring-1 focus:ring-primary-500/30 disabled:opacity-50"
                  />
                  <button
                    onClick={() => handleSend()}
                    disabled={!input.trim() || loading}
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-md transition-all hover:shadow-[0_0_12px_rgba(59,130,246,0.3)] disabled:opacity-40 disabled:shadow-none"
                    aria-label="Send"
                  >
                    <Send size={15} />
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
