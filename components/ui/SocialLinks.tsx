"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Mail, Phone } from "lucide-react";

interface SocialLinksProps {
  className?: string;
  iconSize?: number;
  exclude?: string[];
}

const socialConfig: Record<string, { icon: React.ElementType; url: string; label: string }> = {
  github: { icon: Github, url: "https://github.com/MohsinRaza-dev1", label: "GitHub" },
  linkedin: { icon: Linkedin, url: "https://www.linkedin.com/in/mohsin-raza-b14447422", label: "LinkedIn" },
  email: { icon: Mail, url: "mailto:hmohsinkhan5@gmail.com", label: "Email" },
  phone: { icon: Phone, url: "tel:03037327992", label: "Phone" },
};

const order = ["github", "linkedin", "email", "phone"];

export default function SocialLinks({ className = "", iconSize = 20, exclude = [] }: SocialLinksProps) {
  const links = order.filter((key) => !exclude.includes(key));

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {links.map((key) => {
        const item = socialConfig[key];
        const Icon = item.icon;
        return (
          <motion.a
            key={key}
            href={item.url}
            target={key !== "email" && key !== "phone" ? "_blank" : undefined}
            rel="noopener noreferrer"
            aria-label={item.label}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-dark-700 text-dark-400 transition-colors hover:border-primary-500/50 hover:text-primary-400"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Icon size={iconSize} />
          </motion.a>
        );
      })}
    </div>
  );
}
