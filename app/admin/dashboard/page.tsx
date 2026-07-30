"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Save, LogOut, User, Briefcase, Wrench, FolderGit2, Settings,
  Award, Star, Image, Plus, Trash2, GripVertical, Upload,
  MessageSquare, Key, ExternalLink, CheckCircle, XCircle, Search,
} from "lucide-react";
import type { SiteContent, ProfileData, WhyMeItem } from "@/lib/content-context";
import type { SkillCategory } from "@/types";

// ─── Types ───────────────────────────────────────────────────────────────

type TabKey =
  | "profile"
  | "nav"
  | "experience"
  | "skills"
  | "projects"
  | "services"
  | "whyme"
  | "messages"
  | "settings";

const TABS: { key: TabKey; label: string; icon: React.ElementType }[] = [
  { key: "profile", label: "Profile", icon: User },
  { key: "nav", label: "Navigation", icon: Star },
  { key: "experience", label: "Experience", icon: Briefcase },
  { key: "skills", label: "Skills", icon: Wrench },
  { key: "projects", label: "Projects", icon: FolderGit2 },
  { key: "services", label: "Services", icon: Settings },
  { key: "whyme", label: "Why Me", icon: Award },
  { key: "messages", label: "Messages", icon: MessageSquare },
  { key: "settings", label: "Settings", icon: Key },
];

// ─── Helpers ─────────────────────────────────────────────────────────────

function getAuthHeaders(): HeadersInit {
  return {
    Authorization: `Bearer ${typeof window !== "undefined" ? sessionStorage.getItem("admin_token") || "" : ""}`,
    "Content-Type": "application/json",
  };
}

function uploadAuthHeaders(): HeadersInit {
  return {
    Authorization: `Bearer ${typeof window !== "undefined" ? sessionStorage.getItem("admin_token") || "" : ""}`,
  };
}

// ─── Input helpers ───────────────────────────────────────────────────────

function Input({ label, value, onChange, type = "text", placeholder }: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm text-dark-400">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-dark-800 bg-dark-950/50 px-3 py-2 text-sm text-white placeholder-dark-500 focus:border-primary-500/50 focus:outline-none focus:ring-1 focus:ring-primary-500/30"
        placeholder={placeholder}
      />
    </div>
  );
}

function Textarea({ label, value, onChange, rows = 3 }: {
  label: string; value: string; onChange: (v: string) => void; rows?: number;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm text-dark-400">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full rounded-lg border border-dark-800 bg-dark-950/50 px-3 py-2 text-sm text-white placeholder-dark-500 focus:border-primary-500/50 focus:outline-none focus:ring-1 focus:ring-primary-500/30"
      />
    </div>
  );
}

// ─── Array Item Editor ───────────────────────────────────────────────────

function ArrayEditor({ items, onChange, placeholder }: {
  items: string[]; onChange: (items: string[]) => void; placeholder?: string;
}) {
  const add = () => onChange([...items, ""]);
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));
  const update = (i: number, v: string) => {
    const next = [...items];
    next[i] = v;
    onChange(next);
  };
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex gap-2">
          <input
            value={item}
            onChange={(e) => update(i, e.target.value)}
            className="flex-1 rounded-lg border border-dark-800 bg-dark-950/50 px-3 py-2 text-sm text-white placeholder-dark-500 focus:border-primary-500/50 focus:outline-none focus:ring-1 focus:ring-primary-500/30"
            placeholder={placeholder || "Item"}
          />
          <button onClick={() => remove(i)} className="rounded-lg border border-red-800/50 p-2 text-red-400 hover:bg-red-500/10">
            <Trash2 size={16} />
          </button>
        </div>
      ))}
      <button onClick={add} className="flex items-center gap-1.5 text-sm text-primary-400 hover:text-primary-300">
        <Plus size={16} /> Add item
      </button>
    </div>
  );
}

// ─── Image Uploader ──────────────────────────────────────────────────────

function ImageUploader({ current, onUpload, label }: {
  current: string; onUpload: (url: string) => void; label: string;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Show live preview immediately
    setPreview(URL.createObjectURL(file));
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: uploadAuthHeaders(),
        body: fd,
      });
      const data = await res.json();
      if (data.url) {
        onUpload(data.url);
        setPreview(null);
      }
    } catch { /* ignore */ }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  const src = preview || current;

  return (
    <div>
      <label className="mb-1 block text-sm text-dark-400">{label}</label>
      <div className="flex items-center gap-3">
        {src && (
          <img src={src} alt="" className="h-14 w-14 rounded-lg border border-dark-700 object-cover" />
        )}
        <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-1.5 rounded-lg border border-dark-700 px-3 py-2 text-sm text-dark-400 hover:border-primary-500/50 hover:text-primary-400 disabled:opacity-60"
        >
          <Upload size={16} /> {uploading ? "Uploading..." : "Upload"}
        </button>
        <span className="text-xs text-dark-500">{current || "No image"}</span>
      </div>
    </div>
  );
}

// ─── Tab: Profile ────────────────────────────────────────────────────────

function ProfileTab({ data, onChange }: { data: ProfileData; onChange: (d: ProfileData) => void }) {
  const set = (k: keyof ProfileData) => (v: string) => onChange({ ...data, [k]: v });
  return (
    <div className="space-y-5 max-w-2xl">
      <ImageUploader current={data.profileImage} onUpload={set("profileImage")} label="Profile Image" />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Name" value={data.name} onChange={set("name")} />
        <Input label="Tagline" value={data.tagline} onChange={set("tagline")} />
        <Input label="Short Title" value={data.shortTitle} onChange={set("shortTitle")} placeholder="e.g. Software Engineer & AI Developer" />
        <Input label="Education" value={data.education} onChange={set("education")} />
        <Input label="Email" value={data.email} onChange={set("email")} />
        <Input label="Phone" value={data.phone} onChange={set("phone")} />
        <Input label="WhatsApp Number" value={data.whatsapp} onChange={set("whatsapp")} placeholder="e.g. +923037327992" />
        <Input label="GitHub URL" value={data.github} onChange={set("github")} />
        <Input label="LinkedIn URL" value={data.linkedin} onChange={set("linkedin")} />
        <Input label="Resume File Path" value={data.resumePath} onChange={set("resumePath")} />
        <Input label="Location" value={data.location} onChange={set("location")} />
      </div>
      <Textarea label="Description" value={data.description} onChange={set("description")} rows={3} />
      <Textarea label="About Me" value={data.about} onChange={set("about")} rows={5} />
    </div>
  );
}

// ─── Tab: Navigation ─────────────────────────────────────────────────────

function NavTab({ items, onChange }: {
  items: { label: string; href: string }[];
  onChange: (items: { label: string; href: string }[]) => void;
}) {
  const add = () => onChange([...items, { label: "", href: "" }]);
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));
  const update = (i: number, k: "label" | "href", v: string) => {
    const next = [...items];
    next[i] = { ...next[i], [k]: v };
    onChange(next);
  };
  return (
    <div className="space-y-3 max-w-2xl">
      {items.map((item, i) => (
        <div key={i} className="flex gap-2 items-end">
          <Input label="Label" value={item.label} onChange={(v) => update(i, "label", v)} />
          <Input label="Href" value={item.href} onChange={(v) => update(i, "href", v)} />
          <button onClick={() => remove(i)} className="mb-0.5 rounded-lg border border-red-800/50 p-2 text-red-400 hover:bg-red-500/10">
            <Trash2 size={16} />
          </button>
        </div>
      ))}
      <button onClick={add} className="flex items-center gap-1.5 text-sm text-primary-400 hover:text-primary-300">
        <Plus size={16} /> Add nav item
      </button>
    </div>
  );
}

// ─── Tab: Skills ─────────────────────────────────────────────────────────

function SkillsTab({ skills, onChange }: {
  skills: { name: string; category: SkillCategory }[];
  onChange: (skills: { name: string; category: SkillCategory }[]) => void;
}) {
  const add = () => onChange([...skills, { name: "", category: "Backend" }]);
  const remove = (i: number) => onChange(skills.filter((_, idx) => idx !== i));
  const update = (i: number, k: "name" | "category", v: string) => {
    const next = [...skills];
    (next[i] as any)[k] = k === "category" ? v as SkillCategory : v;
    onChange(next);
  };
  const categories = ["Backend", "Frontend", "AI & Machine Learning", "Databases", "Tools"];
  return (
    <div className="space-y-2 max-w-2xl">
      {skills.map((s, i) => (
        <div key={i} className="flex gap-2 items-end">
          <Input label="Skill" value={s.name} onChange={(v) => update(i, "name", v)} />
          <div>
            <label className="mb-1 block text-sm text-dark-400">Category</label>
            <select
              value={s.category}
              onChange={(e) => update(i, "category", e.target.value)}
              className="rounded-lg border border-dark-800 bg-dark-950/50 px-3 py-2 text-sm text-white focus:border-primary-500/50 focus:outline-none"
            >
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <button onClick={() => remove(i)} className="mb-0.5 rounded-lg border border-red-800/50 p-2 text-red-400 hover:bg-red-500/10">
            <Trash2 size={16} />
          </button>
        </div>
      ))}
      <button onClick={add} className="flex items-center gap-1.5 text-sm text-primary-400 hover:text-primary-300">
        <Plus size={16} /> Add skill
      </button>
    </div>
  );
}

// ─── Tab: Experience ─────────────────────────────────────────────────────

function ExperienceTab({ experiences, onChange }: {
  experiences: any[]; onChange: (items: any[]) => void;
}) {
  const add = () => onChange([...experiences, { id: Date.now().toString(), role: "", organization: "", location: "", description: "", responsibilities: [""] }]);
  const remove = (i: number) => onChange(experiences.filter((_, idx) => idx !== i));
  const update = (i: number, k: string, v: any) => {
    const next = [...experiences];
    next[i] = { ...next[i], [k]: v };
    onChange(next);
  };
  return (
    <div className="space-y-6">
      {experiences.map((exp, i) => (
        <div key={exp.id} className="rounded-xl border border-dark-800 bg-dark-900/30 p-4">
          <div className="flex justify-between mb-3">
            <span className="text-sm font-medium text-white">Experience #{i + 1}</span>
            <button onClick={() => remove(i)} className="text-red-400 hover:text-red-300"><Trash2 size={16} /></button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Input label="Role" value={exp.role} onChange={(v) => update(i, "role", v)} />
            <Input label="Organization" value={exp.organization} onChange={(v) => update(i, "organization", v)} />
            <Input label="Location" value={exp.location} onChange={(v) => update(i, "location", v)} />
          </div>
          <div className="mt-3">
            <Textarea label="Description" value={exp.description} onChange={(v) => update(i, "description", v)} rows={2} />
          </div>
          <div className="mt-3">
            <label className="mb-1 block text-sm text-dark-400">Responsibilities</label>
            <ArrayEditor items={exp.responsibilities || []} onChange={(v) => update(i, "responsibilities", v)} placeholder="Responsibility" />
          </div>
        </div>
      ))}
      <button onClick={add} className="flex items-center gap-1.5 text-sm text-primary-400 hover:text-primary-300">
        <Plus size={16} /> Add experience
      </button>
    </div>
  );
}

// ─── Tab: Projects ───────────────────────────────────────────────────────

function ProjectsTab({ projects, onChange }: {
  projects: any[]; onChange: (items: any[]) => void;
}) {
  const add = () => onChange([...projects, { id: Date.now().toString(), name: "", description: "", features: [""], technologies: [""], github: "" }]);
  const remove = (i: number) => onChange(projects.filter((_, idx) => idx !== i));
  const update = (i: number, k: string, v: any) => {
    const next = [...projects];
    next[i] = { ...next[i], [k]: v };
    onChange(next);
  };
  return (
    <div className="space-y-6">
      {projects.map((proj, i) => (
        <div key={proj.id} className="rounded-xl border border-dark-800 bg-dark-900/30 p-4">
          <div className="flex justify-between mb-3">
            <span className="text-sm font-medium text-white">{proj.name || `Project #${i + 1}`}</span>
            <button onClick={() => remove(i)} className="text-red-400 hover:text-red-300"><Trash2 size={16} /></button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Input label="Name" value={proj.name} onChange={(v) => update(i, "name", v)} />
            <Input label="GitHub URL" value={proj.github || ""} onChange={(v) => update(i, "github", v)} />
            <Input label="Demo URL" value={proj.demo || ""} onChange={(v) => update(i, "demo", v)} />
          </div>
          <div className="mt-3">
            <Textarea label="Description" value={proj.description} onChange={(v) => update(i, "description", v)} rows={2} />
          </div>
          <div className="mt-3">
            <label className="mb-1 block text-sm text-dark-400">Features</label>
            <ArrayEditor items={proj.features || []} onChange={(v) => update(i, "features", v)} placeholder="Feature" />
          </div>
          <div className="mt-3">
            <label className="mb-1 block text-sm text-dark-400">Technologies</label>
            <ArrayEditor items={proj.technologies || []} onChange={(v) => update(i, "technologies", v)} placeholder="Technology" />
          </div>
        </div>
      ))}
      <button onClick={add} className="flex items-center gap-1.5 text-sm text-primary-400 hover:text-primary-300">
        <Plus size={16} /> Add project
      </button>
    </div>
  );
}

// ─── Tab: Services ───────────────────────────────────────────────────────

function ServicesTab({ services, onChange }: {
  services: any[]; onChange: (items: any[]) => void;
}) {
  const add = () => onChange([...services, { id: Date.now().toString(), title: "", description: "", icon: "Code2" }]);
  const remove = (i: number) => onChange(services.filter((_, idx) => idx !== i));
  const update = (i: number, k: string, v: any) => {
    const next = [...services];
    next[i] = { ...next[i], [k]: v };
    onChange(next);
  };
  return (
    <div className="space-y-6">
      {services.map((svc, i) => (
        <div key={svc.id} className="rounded-xl border border-dark-800 bg-dark-900/30 p-4">
          <div className="flex justify-between mb-3">
            <span className="text-sm font-medium text-white">{svc.title || `Service #${i + 1}`}</span>
            <button onClick={() => remove(i)} className="text-red-400 hover:text-red-300"><Trash2 size={16} /></button>
          </div>
          <Input label="Title" value={svc.title} onChange={(v) => update(i, "title", v)} />
          <div className="mt-3">
            <Textarea label="Description" value={svc.description} onChange={(v) => update(i, "description", v)} rows={2} />
          </div>
        </div>
      ))}
      <button onClick={add} className="flex items-center gap-1.5 text-sm text-primary-400 hover:text-primary-300">
        <Plus size={16} /> Add service
      </button>
    </div>
  );
}

// ─── Tab: Why Me ─────────────────────────────────────────────────────────

function WhyMeTab({ items, onChange }: {
  items: WhyMeItem[]; onChange: (items: WhyMeItem[]) => void;
}) {
  const add = () => onChange([...items, { title: "", description: "", icon: "Cpu" }]);
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));
  const update = (i: number, k: keyof WhyMeItem, v: string) => {
    const next = [...items];
    next[i] = { ...next[i], [k]: v };
    onChange(next);
  };
  return (
    <div className="space-y-6">
      {items.map((item, i) => (
        <div key={i} className="rounded-xl border border-dark-800 bg-dark-900/30 p-4">
          <div className="flex justify-between mb-3">
            <span className="text-sm font-medium text-white">{item.title || `Item #${i + 1}`}</span>
            <button onClick={() => remove(i)} className="text-red-400 hover:text-red-300"><Trash2 size={16} /></button>
          </div>
          <Input label="Title" value={item.title} onChange={(v) => update(i, "title", v)} />
          <div className="mt-3">
            <Textarea label="Description" value={item.description} onChange={(v) => update(i, "description", v)} rows={2} />
          </div>
        </div>
      ))}
      <button onClick={add} className="flex items-center gap-1.5 text-sm text-primary-400 hover:text-primary-300">
        <Plus size={16} /> Add item
      </button>
    </div>
  );
}

// ─── Tab: Messages ────────────────────────────────────────────────────────

function MessagesTab() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [replying, setReplying] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/admin/messages", { headers: getAuthHeaders() });
      if (res.ok) setMessages(await res.json());
    } catch { /* ignore */ }
    setLoading(false);
  };

  useEffect(() => { fetchMessages(); }, []);

  const toggleRead = async (id: string, read: boolean) => {
    await fetch("/api/admin/messages", {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ id, read }),
    });
    fetchMessages();
  };

  const sendReply = async (id: string) => {
    if (!replyText.trim()) return;
    await fetch("/api/admin/messages", {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ id, reply: replyText.trim() }),
    });
    setReplyText("");
    setReplying(null);
    fetchMessages();
  };

  const deleteMessage = async (id: string) => {
    await fetch("/api/admin/messages", {
      method: "DELETE",
      headers: getAuthHeaders(),
      body: JSON.stringify({ id }),
    });
    fetchMessages();
  };

  const unreadCount = messages.filter((m) => !m.read).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-dark-400">
          {messages.length} message{messages.length !== 1 ? "s" : ""}
          {unreadCount > 0 && (
            <span className="ml-2 text-primary-400">({unreadCount} unread)</span>
          )}
        </p>
      </div>

      {messages.length === 0 ? (
        <p className="py-10 text-center text-sm text-dark-500">No messages yet.</p>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`rounded-xl border p-4 transition-colors ${
                !msg.read
                  ? "border-primary-500/30 bg-primary-500/5"
                  : "border-dark-800 bg-dark-900/30"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-white">{msg.name}</span>
                    <span className="text-xs text-dark-500">&lt;{msg.email}&gt;</span>
                    {!msg.read && (
                      <span className="rounded-full bg-primary-500/20 px-2 py-0.5 text-[10px] font-medium text-primary-400">
                        New
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm font-medium text-dark-300">{msg.subject}</p>
                  <p className="mt-1 text-sm text-dark-400 whitespace-pre-wrap">{msg.message}</p>
                  {msg.reply && (
                    <div className="mt-3 rounded-lg border border-primary-500/20 bg-primary-500/5 p-3">
                      <p className="text-[11px] font-medium uppercase tracking-wider text-primary-400">Your Reply</p>
                      <p className="mt-1 text-sm text-dark-300">{msg.reply}</p>
                    </div>
                  )}
                  <p className="mt-2 text-[11px] text-dark-500">
                    {new Date(msg.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => toggleRead(msg.id, !msg.read)}
                    className="rounded-lg p-2 text-dark-500 hover:text-primary-400 transition-colors"
                    title={msg.read ? "Mark as unread" : "Mark as read"}
                  >
                    {msg.read ? <XCircle size={16} /> : <CheckCircle size={16} />}
                  </button>
                  <button
                    onClick={() => setReplying(replying === msg.id ? null : msg.id)}
                    className="rounded-lg p-2 text-dark-500 hover:text-primary-400 transition-colors"
                    title="Reply"
                  >
                    <MessageSquare size={16} />
                  </button>
                  <button
                    onClick={() => deleteMessage(msg.id)}
                    className="rounded-lg p-2 text-dark-500 hover:text-red-400 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {replying === msg.id && (
                <div className="mt-3 border-t border-dark-800 pt-3">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={2}
                    className="w-full rounded-lg border border-dark-800 bg-dark-950/50 px-3 py-2 text-sm text-white placeholder-dark-500 focus:border-primary-500/50 focus:outline-none"
                    placeholder="Write your reply..."
                  />
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => sendReply(msg.id)}
                      disabled={!replyText.trim()}
                      className="rounded-lg bg-primary-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-primary-500 disabled:opacity-60"
                    >
                      Send Reply
                    </button>
                    <button
                      onClick={() => { setReplying(null); setReplyText(""); }}
                      className="rounded-lg border border-dark-700 px-3 py-1.5 text-xs text-dark-400 hover:text-white"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Tab: Settings ────────────────────────────────────────────────────────

function SettingsTab() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [statusMsg, setStatusMsg] = useState("");

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setStatus("error");
      setStatusMsg("All fields are required.");
      return;
    }

    if (newPassword.length < 4) {
      setStatus("error");
      setStatusMsg("New password must be at least 4 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setStatus("error");
      setStatusMsg("Passwords do not match.");
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/admin/password", {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        sessionStorage.setItem("admin_token", newPassword);
        setStatus("success");
        setStatusMsg("Password changed successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => setStatus("idle"), 3000);
      } else {
        setStatus("error");
        setStatusMsg(data.error || "Failed to change password.");
      }
    } catch {
      setStatus("error");
      setStatusMsg("Connection error. Please try again.");
    }
  };

  return (
    <div className="space-y-8 max-w-lg">
      {/* Change Password */}
      <div>
        <h3 className="text-lg font-semibold text-white">Change Password</h3>
        <p className="mt-1 text-sm text-dark-400">Update your admin panel password.</p>

        <form onSubmit={handleChangePassword} className="mt-4 space-y-4">
          <div>
            <label className="mb-1 block text-sm text-dark-400">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full rounded-lg border border-dark-800 bg-dark-950/50 px-3 py-2 text-sm text-white placeholder-dark-500 focus:border-primary-500/50 focus:outline-none"
              placeholder="Current password"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-dark-400">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full rounded-lg border border-dark-800 bg-dark-950/50 px-3 py-2 text-sm text-white placeholder-dark-500 focus:border-primary-500/50 focus:outline-none"
              placeholder="New password (min 4 characters)"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-dark-400">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-lg border border-dark-800 bg-dark-950/50 px-3 py-2 text-sm text-white placeholder-dark-500 focus:border-primary-500/50 focus:outline-none"
              placeholder="Confirm new password"
            />
          </div>

          {statusMsg && (
            <p className={`text-sm ${status === "error" ? "text-red-400" : "text-emerald-400"}`}>
              {statusMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={status === "loading"}
            className="rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-500 disabled:opacity-60"
          >
            {status === "loading" ? "Changing..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Main Dashboard Page ─────────────────────────────────────────────────

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>("profile");
  const [content, setContent] = useState<SiteContent | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/content")
      .then((r) => r.json())
      .then((data) => { setContent(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const [saveError, setSaveError] = useState("");

  const handleSave = async () => {
    if (!content) return;
    setSaving(true);
    setSaveError("");
    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(content),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
        // Re-fetch to confirm save and sync state
        const fresh = await fetch(`/api/content?t=${Date.now()}`);
        if (fresh.ok) {
          const freshData = await fresh.json();
          setContent(freshData);
        }
      } else {
        const err = await res.json();
        setSaveError(err.error || "Save failed");
      }
    } catch {
      setSaveError("Connection error. Please try again.");
    }
    setSaving(false);
  };

  const logout = () => {
    sessionStorage.removeItem("admin_authenticated");
    router.push("/admin/login");
  };

  const updateContent = (path: string, value: any) => {
    if (!content) return;
    setContent({ ...content, [path]: value });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-dark-950">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  if (!content) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-dark-950">
        <p className="text-dark-400">Failed to load content.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-dark-800 bg-dark-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <h1 className="text-lg font-bold text-white">Admin Panel</h1>
          <div className="flex items-center gap-3">
            {saveError && (
              <span className="text-sm text-red-400">{saveError}</span>
            )}
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-1.5 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-500 disabled:opacity-60"
            >
              <Save size={16} />
              {saving ? "Saving..." : saved ? "Saved!" : "Save All"}
            </button>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 rounded-lg border border-dark-700 px-3 py-2 text-sm text-dark-400 transition-colors hover:text-white"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="hidden w-56 flex-shrink-0 md:block">
            <nav className="sticky top-20 space-y-1">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    activeTab === tab.key
                      ? "bg-primary-500/10 text-primary-400"
                      : "text-dark-400 hover:bg-dark-800/50 hover:text-white"
                  }`}
                >
                  <tab.icon size={18} />
                  {tab.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Content */}
          <main className="flex-1">
            {/* Mobile tabs */}
            <div className="mb-6 flex gap-2 overflow-x-auto pb-2 md:hidden">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                    activeTab === tab.key
                      ? "bg-primary-500/10 text-primary-400"
                      : "bg-dark-900/50 text-dark-400"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="rounded-2xl border border-dark-800 bg-dark-900/60 p-6 backdrop-blur-xl">
              {activeTab === "profile" && (
                <ProfileTab data={content.profile} onChange={(d) => setContent({ ...content, profile: d })} />
              )}
              {activeTab === "nav" && (
                <NavTab items={content.navItems} onChange={(items) => setContent({ ...content, navItems: items })} />
              )}
              {activeTab === "skills" && (
                <SkillsTab skills={content.skills} onChange={(skills) => setContent({ ...content, skills })} />
              )}
              {activeTab === "experience" && (
                <ExperienceTab experiences={content.experiences} onChange={(items) => setContent({ ...content, experiences: items })} />
              )}
              {activeTab === "projects" && (
                <ProjectsTab projects={content.projects} onChange={(items) => setContent({ ...content, projects: items })} />
              )}
              {activeTab === "services" && (
                <ServicesTab services={content.services} onChange={(items) => setContent({ ...content, services: items })} />
              )}
              {activeTab === "whyme" && (
                <WhyMeTab items={content.whyMe} onChange={(items) => setContent({ ...content, whyMe: items })} />
              )}
              {activeTab === "messages" && <MessagesTab />}
              {activeTab === "settings" && <SettingsTab />}
            </div>

            {/* Bottom save (only for content tabs) */}
            {activeTab !== "messages" && activeTab !== "settings" && (
              <div className="mt-6 flex justify-end items-center gap-3">
                {saveError && (
                  <span className="text-sm text-red-400">{saveError}</span>
                )}
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-1.5 rounded-lg bg-primary-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-500 disabled:opacity-60"
                >
                  <Save size={16} />
                  {saving ? "Saving..." : saved ? "Saved!" : "Save All Changes"}
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
