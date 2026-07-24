"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type {
  Project, Experience, Skill, SkillCategory, Service, NavItem,
} from "@/types";

export interface ProfileData {
  name: string;
  title: string;
  shortTitle: string;
  tagline: string;
  description: string;
  about: string;
  email: string;
  phone: string;
  github: string;
  linkedin: string;
  resumePath: string;
  profileImage: string;
  education: string;
  location: string;
}

export interface WhyMeItem {
  title: string;
  description: string;
  icon: string;
}

export interface SocialLinkData {
  label: string;
  url: string;
}

export interface SiteContent {
  profile: ProfileData;
  navItems: NavItem[];
  experiences: Experience[];
  projects: Project[];
  skills: Skill[];
  skillCategories: SkillCategory[];
  services: Service[];
  whyMe: WhyMeItem[];
  socialLinks: Record<string, SocialLinkData>;
}

const defaultContent: SiteContent = {
  profile: {
    name: "",
    title: "",
    shortTitle: "",
    tagline: "",
    description: "",
    about: "",
    email: "",
    phone: "",
    github: "",
    linkedin: "",
    resumePath: "",
    profileImage: "",
    education: "",
    location: "",
  },
  navItems: [],
  experiences: [],
  projects: [],
  skills: [],
  skillCategories: [],
  services: [],
  whyMe: [],
  socialLinks: {},
};

interface ContentContextValue {
  content: SiteContent;
  loading: boolean;
  refresh: () => Promise<void>;
}

const ContentContext = createContext<ContentContextValue>({
  content: defaultContent,
  loading: true,
  refresh: async () => {},
});

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(defaultContent);
  const [loading, setLoading] = useState(true);

  const fetchContent = async () => {
    try {
      const res = await fetch("/api/content");
      if (res.ok) {
        const data = await res.json();
        setContent(data);
      }
    } catch {
      // Fallback — content stays as-is
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  return (
    <ContentContext.Provider value={{ content, loading, refresh: fetchContent }}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  return useContext(ContentContext);
}
