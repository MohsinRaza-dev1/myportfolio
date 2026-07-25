"use client";

import { Github, Linkedin, Mail, Phone, ArrowUp } from "lucide-react";
import { profile } from "@/data";
import { scrollToSection } from "@/lib/utils";
import { navItems } from "@/data";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-dark-800">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-8 md:gap-10 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <button
              onClick={() => scrollToSection("home")}
              className="text-xl font-bold text-white"
            >
              Mohsin<span className="text-primary-500">.</span>
            </button>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-dark-400">
              Software Engineer and Full Stack AI Developer specializing in
              Python, FastAPI, Generative AI, and modern web applications.
            </p>
            <div className="mt-5 flex gap-3">
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg border border-dark-700 px-4 py-2 text-sm text-dark-400 transition-colors hover:border-primary-500/50 hover:text-primary-400"
              >
                <Github size={16} />
                GitHub
              </a>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg border border-dark-700 px-4 py-2 text-sm text-dark-400 transition-colors hover:border-primary-500/50 hover:text-primary-400"
              >
                <Linkedin size={16} />
                LinkedIn
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-dark-500">
              Navigation
            </h4>
            <ul className="space-y-2.5">
              {navItems.map((item) => (
                <li key={item.href}>
                  <button
                    onClick={() => scrollToSection(item.href.slice(1))}
                    className="text-sm text-dark-400 transition-colors hover:text-primary-400"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-dark-500">
              Contact
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href={`mailto:${profile.email}`}
                  className="flex items-center gap-2 text-sm text-dark-400 transition-colors hover:text-primary-400"
                >
                  <Mail size={14} />
                  {profile.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${profile.phone}`}
                  className="flex items-center gap-2 text-sm text-dark-400 transition-colors hover:text-primary-400"
                >
                  <Phone size={14} />
                  {profile.phone}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-dark-800 pt-8 sm:flex-row">
          <p className="text-sm text-dark-500">
            &copy; {currentYear} {profile.name}. All rights reserved.
          </p>
          <button
            onClick={() => scrollToSection("home")}
            className="flex items-center gap-1.5 text-sm text-dark-500 transition-colors hover:text-primary-400"
          >
            Back to top
            <ArrowUp size={14} />
          </button>
        </div>
      </div>
    </footer>
  );
}
