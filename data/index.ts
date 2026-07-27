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
  title: "Full Stack Developer | AI Developer | Python & FastAPI Backend Developer | Generative AI Engineer",
  shortTitle: "Software Engineer & AI Developer",
  tagline: "",
  description:
    "I am a Full Stack Developer, AI Developer, and Generative AI Engineer specializing in Python, FastAPI, Next.js, and modern AI technologies. I build intelligent, scalable applications that solve real-world problems.",
  about:
    "I am a Software Engineering student at Gomal University passionate about building intelligent software solutions. My work combines modern web development, scalable backend systems, artificial intelligence, and automation. I specialize in backend development, full-stack applications, AI-powered systems, REST APIs, database architecture, Generative AI, and automation. I am currently maintaining a CGPA of 3.83/4.00.",
  email: "hmohsinkhan5@gmail.com",
  phone: "03037327992",
  whatsapp: "+923037327992",
  github: "https://github.com/MohsinRaza-dev1",
  linkedin: "https://www.linkedin.com/in/mohsin-raza-b14447422",
  resumePath: "/resume.pdf",
  profileImage: "/profile.jpg",
  education: "BS Software Engineering at Gomal University (2024-2028, CGPA: 3.83/4.00)",
  university: "Gomal University",
  degree: "BS Software Engineering",
  graduationYear: "2028",
  cgpa: "3.83/4.00",
};

// ===== Experience =====

export const experiences: Experience[] = [
  {
    id: "genai-intern-first",
    role: "Generative AI Engineer Intern",
    organization: "Faisalabad Institute of Research Sciences and Technology, Akhuwat Campus",
    location: "Faisalabad",
    description:
      "Worked as a Generative AI Engineer intern for four months, building AI-powered solutions and intelligent systems.",
    responsibilities: [
      "Developed AI-powered applications using Large Language Models",
      "Built AI question-answering systems using NLP and ML technologies",
      "Worked with Retrieval-Augmented Generation (RAG) systems and vector databases",
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
      "A modern responsive website designed for businesses and professional branding. This very website was built as a portfolio showcasing Mohsin's skills, projects, experience, and AI capabilities.",
    features: [
      "Responsive design for all devices",
      "Professional business branding",
    ],
    technologies: ["HTML", "CSS", "JavaScript", "React", "Next.js"],
    github: "https://github.com/MohsinRaza-dev1",
  },
  {
    id: "fastapi-practice",
    name: "FastAPI Practice APIs",
    description:
      "Multiple backend API projects created to improve practical backend development skills with FastAPI.",
    features: [
      "REST API development practice",
      "Database integration with PostgreSQL",
      "Authentication and authorization patterns",
    ],
    technologies: ["Python", "FastAPI", "PostgreSQL", "SQLAlchemy"],
    github: "https://github.com/MohsinRaza-dev1",
  },
  {
    id: "pser-data",
    name: "PSER Data Management and Automation",
    description:
      "Worked with Punjab Socio-Economic Registry data containing household information such as family members, CNIC details, income, education, employment, housing information, assets, and facilities. Organised, cleaned, and managed the data in Excel and is working towards automating the process using an AI-powered agent.",
    features: [
      "Data cleaning and organization",
      "Excel-based data management",
      "AI-powered automation pipeline in progress",
    ],
    technologies: ["Python", "Excel", "AI Agents", "Automation"],
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
