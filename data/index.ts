import { Project, Experience, Skill, Service, NavItem, SkillCategory } from "@/types";

// ===== Navigation =====

export const navItems: NavItem[] = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Services", href: "#services" },

];

// ===== Profile =====

export const profile = {
  name: "Mohsin Raza",
  title: "Software Engineer | Full Stack  Developer | Generative AI Engineer",
  shortTitle: "Software Engineer & AI Engineer & Full Stack Developer",
  tagline: "",
  description:
    "I am a Software Engineer,Ai Engineer,Full Stack Developer. Building intelligent software systems at the intersection of full-stack engineering and artificial intelligence.",
  about:
    "I am a Software Engineering,Ai Engineer and Full Stack Developer passionate about building intelligent software solutions. My work combines modern web development, scalable backend systems, artificial intelligence, and automation. I specialize in backend development, full-stack applications, AI-powered systems, REST APIs, database architecture, Generative AI, and automation.",
  email: "hmohsinkhan5@gmail.com",
  phone: "03037327992",
  whatsapp: "+923037327992",
  github: "https://github.com/MohsinRaza-dev1",
  linkedin: "https://www.linkedin.com/in/mohsin-raza-b14447422",
  resumePath: "/resume.pdf",
  profileImage: "/profile.jpg",
  education: "BS Software Engineering & Ai Engineer ",
};

// ===== Experience =====

export const experiences: Experience[] = [
  {
    id: "",
    role: " Seeking For Generative AI Engineer Intern",
    organization: "",
    location: "Faisalabad",
    description:
      "Working with Generative AI technologies to build AI-powered solutions and intelligent systems.",
    responsibilities: [
      "Worked with Generative AI technologies to develop intelligent solutions",
      "Built and deployed AI-powered applications using Large Language Models",
      "Developed AI question-answering systems using NLP and ML technologies",
      "Explored and implemented NLP and Machine Learning solutions",
      "Built applications using Python and modern AI frameworks",
    ],
  },
];

// ===== Projects =====

export const projects: Project[] = [
  {
    id: "hiremind-ai",
    name: "HireMind AI",
    description:
      "An AI-powered recruitment SaaS platform designed to improve the hiring process using automation and artificial intelligence.",
    features: [
      "Candidate registration and authentication",
      "Employer accounts and job posting",
      "Resume upload and AI resume analysis",
      "AI job matching and candidate ranking",
      "Application tracking and AI interview question generation",
      "Admin dashboard",
    ],
    technologies: [
      "Python",
      "FastAPI",
      "PostgreSQL",
      "SQLAlchemy",
      "Alembic",
      "Pydantic",
      "JWT",
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Generative AI",
    ],
    github: "https://github.com/MohsinRaza-dev1",
  },
  {
    id: "school-management",
    name: "School Management System",
    description:
      "A complete school management platform designed to simplify academic and administrative operations.",
    features: [
      "Student and teacher management",
      "Attendance and fee management",
      "Academic records management",
      "Admin dashboard with role-based access control",
      "Reports and analytics",
    ],
    technologies: ["Python", "FastAPI", "PostgreSQL", "Next.js", "TypeScript"],
    github: "https://github.com/MohsinRaza-dev1",
  },
  {
    id: "ai-qa-system",
    name: "AI Question Answering System",
    description:
      "An AI-powered question-answering system using Natural Language Processing and Machine Learning.",
    features: [
      "Context-based question answering",
      "NLP processing with AI model integration",
      "Dataset training for intelligent answers",
    ],
    technologies: ["Python", "Transformers", "Hugging Face", "TensorFlow", "PyTorch"],
    github: "https://github.com/MohsinRaza-dev1",
  },
  {
    id: "ai-chatbot",
    name: "AI Chatbot",
    description:
      "An intelligent chatbot capable of understanding user questions and generating contextual responses.",
    features: [
      "Contextual conversation understanding",
      "Intelligent response generation",
    ],
    technologies: ["Python", "LangChain", "LLMs", "FastAPI", "RAG", "AI APIs"],
    github: "https://github.com/MohsinRaza-dev1",
  },
  {
    id: "business-portfolio",
    name: "Business Portfolio Website",
    description:
      "A modern responsive website designed for businesses and professional branding.",
    features: [
      "Responsive design for all devices",
      "Professional business branding",
    ],
    technologies: ["HTML", "CSS", "JavaScript", "React", "Next.js"],
    github: "https://github.com/MohsinRaza-dev1",
  },
];

// ===== Skills =====

export const skills: Skill[] = [
  // Backend
  { name: "Python", category: "Backend" },
  { name: "FastAPI", category: "Backend" },
  { name: "Flask", category: "Backend" },
  { name: "REST APIs", category: "Backend" },
  { name: "SQLAlchemy", category: "Backend" },
  { name: "Pydantic", category: "Backend" },
  { name: "JWT Authentication", category: "Backend" },
  { name: "API Design", category: "Backend" },
  // Frontend
  { name: "React", category: "Frontend" },
  { name: "Next.js", category: "Frontend" },
  { name: "HTML", category: "Frontend" },
  { name: "CSS", category: "Frontend" },
  { name: "JavaScript", category: "Frontend" },
  { name: "TypeScript", category: "Frontend" },
  { name: "Tailwind CSS", category: "Frontend" },
  // AI & ML
  { name: "Generative AI", category: "AI & Machine Learning" },
  { name: "Large Language Models", category: "AI & Machine Learning" },
  { name: "LangChain", category: "AI & Machine Learning" },
  { name: "RAG Systems", category: "AI & Machine Learning" },
  { name: "AI Chatbots", category: "AI & Machine Learning" },
  { name: "Prompt Engineering", category: "AI & Machine Learning" },
  { name: "Hugging Face", category: "AI & Machine Learning" },
  { name: "TensorFlow", category: "AI & Machine Learning" },
  { name: "PyTorch", category: "AI & Machine Learning" },
  { name: "Scikit-learn", category: "AI & Machine Learning" },
  // Databases
  { name: "PostgreSQL", category: "Databases" },
  { name: "MySQL", category: "Databases" },
  { name: "SQLite", category: "Databases" },
  // Tools
  { name: "Git", category: "Tools" },
  { name: "GitHub", category: "Tools" },
  { name: "VS Code", category: "Tools" },
  { name: "Jupyter Notebook", category: "Tools" },
  { name: "N8N Automation", category: "Tools" },
  { name: "Google Colab", category: "Tools" },
];

export const skillCategories: SkillCategory[] = [
  "Backend",
  "Frontend",
  "AI & Machine Learning",
  "Databases",
  "Tools",
];

// ===== Services =====

export const services: Service[] = [
  {
    id: "fullstack",
    title: "Full Stack Web Development",
    description:
      "Building modern, scalable, and responsive web applications using Next.js, React, TypeScript, and Python backends.",
    icon: "Code2",
  },
  {
    id: "fastapi",
    title: "FastAPI Backend Development",
    description:
      "Building high-performance APIs and backend systems using Python and FastAPI with clean architecture and comprehensive documentation.",
    icon: "Server",
  },
  {
    id: "ai-apps",
    title: "AI Application Development",
    description:
      "Building AI-powered applications, intelligent chatbots, RAG systems, and LLM-based solutions for real-world problems.",
    icon: "Brain",
  },
  {
    id: "business-web",
    title: "Business Website Development",
    description:
      "Creating modern, professional websites for schools, clinics, businesses, restaurants, and organizations.",
    icon: "Globe",
  },
  {
    id: "database",
    title: "Database & API Development",
    description:
      "Designing secure, optimized databases and scalable REST APIs with proper authentication and documentation.",
    icon: "Database",
  },
  {
    id: "automation",
    title: "Automation Solutions",
    description:
      "Creating workflow automation and AI-powered business automation solutions using N8N and modern tools.",
    icon: "Zap",
  },
];

// ===== Why Work With Me =====

export const whyMe = [
  {
    title: "AI + Full Stack Expertise",
    description:
      "Combining modern full-stack development with artificial intelligence to build intelligent, scalable solutions.",
    icon: "Cpu",
  },
  {
    title: "Clean, Scalable Code",
    description:
      "Writing maintainable, production-ready code with proper architecture, testing, and documentation.",
    icon: "Code",
  },
  {
    title: "Problem-Solving Mindset",
    description:
      "Approaching every challenge with analytical thinking and a focus on delivering practical, effective solutions.",
    icon: "Lightbulb",
  },
  {
    title: "Business-Focused Solutions",
    description:
      "Understanding business requirements and delivering technology solutions that drive real results.",
    icon: "Target",
  },
  {
    title: "Continuous Learning",
    description:
      "Staying current with modern technologies, AI advancements, and industry best practices.",
    icon: "BookOpen",
  },
  {
    title: "Professional Communication",
    description:
      "Clear, timely communication with a focus on understanding requirements and delivering expectations.",
    icon: "MessageSquare",
  },
];
