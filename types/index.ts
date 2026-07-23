export interface Project {
  id: string;
  name: string;
  description: string;
  problem?: string;
  features: string[];
  technologies: string[];
  github?: string;
  demo?: string;
  image?: string;
}

export interface Experience {
  id: string;
  role: string;
  organization: string;
  location: string;
  period?: string;
  description: string;
  responsibilities: string[];
}

export interface Skill {
  name: string;
  category: SkillCategory;
}

export type SkillCategory =
  | "Backend"
  | "Frontend"
  | "AI & Machine Learning"
  | "Databases"
  | "Tools";

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

export interface NavItem {
  label: string;
  href: string;
}
