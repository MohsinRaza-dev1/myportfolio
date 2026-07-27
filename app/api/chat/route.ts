import { NextRequest, NextResponse } from "next/server";

// ─── Complete portfolio knowledge base ────────────────────────────────────
// Everything Gemini needs to know about Mohsin — this is the training data

const PORTFOLIO_DATA = `Here is COMPLETE information about Mohsin Raza. You MUST use ONLY this data to answer questions. Never make up information.

## BASIC INFO
- Full Name: Mohsin Raza
- Title: Software Engineer | Full Stack AI Developer | Python & FastAPI Developer | Generative AI Engineer
- Short Title: Software Engineer & AI Developer
- Email: hmohsinkhan5@gmail.com
- Phone: 03037327992
- WhatsApp: +923037327992
- Location: kpk, Pakistan
- Education: BS Software Engineering, Ai Engineer
- Resume: /resume.pdf
- GitHub: https://github.com/MohsinRaza-dev1
- LinkedIn: https://www.linkedin.com/in/mohsin-raza-b14447422

## ABOUT
I am a Full Stack AI Developer specializing in Python, FastAPI, modern web applications, Generative AI, LLMs, and intelligent automation. I build scalable applications that solve real-world problems.
I am a Software Engineering student and Ai Engineer passionate about building intelligent software solutions. My work combines modern web development, scalable backend systems, artificial intelligence, and automation. I specialize in backend development, full-stack applications, AI-powered systems, REST APIs, database architecture, Generative AI, and automation.

## SKILLS

### Backend
Python, FastAPI, Flask, REST APIs, SQLAlchemy, Pydantic, JWT Authentication, API Design

### Frontend
React, Next.js, HTML, CSS, JavaScript, TypeScript, Tailwind CSS

### AI & Machine Learning
Generative AI, Large Language Models (LLMs), LangChain, RAG Systems, AI Chatbots, Prompt Engineering, Hugging Face, TensorFlow, PyTorch, Scikit-learn

### Databases
PostgreSQL, MySQL, SQLite

### Tools
Git, GitHub, VS Code, Jupyter Notebook, N8N Automation, Google Colab

## EXPERIENCE

### Seeking For Generative AI Engineer Intern
- Location: Faisalabad
- Working with Generative AI technologies to build AI-powered solutions and intelligent systems
- Developed AI-powered applications using Large Language Models
- Built AI question-answering systems using NLP and ML technologies
- Explored and implemented NLP and Machine Learning solutions
- Built applications using Python and modern AI frameworks

## PROJECTS

### 1. HireMind AI
- An AI-powered recruitment SaaS platform designed to improve hiring using automation and AI
- Features: Candidate registration & authentication, Employer accounts & job posting, Resume upload & AI resume analysis, AI job matching & candidate ranking, Application tracking & AI interview question generation, Admin dashboard
- Technologies: Python, FastAPI, PostgreSQL, SQLAlchemy, Alembic, Pydantic, JWT, Next.js, TypeScript, Tailwind CSS, Generative AI
- GitHub: https://github.com/MohsinRaza-dev1

### 2. School Management System
- A complete school management platform to simplify academic and administrative operations
- Features: Student & teacher management, Attendance & fee management, Academic records management, Admin dashboard with role-based access control, Reports & analytics
- Technologies: Python, FastAPI, PostgreSQL, Next.js, TypeScript
- GitHub: https://github.com/MohsinRaza-dev1

### 3. AI Question Answering System
- An AI-powered Q&A system using NLP and Machine Learning
- Features: Context-based Q&A, NLP processing with AI model integration, Dataset training for intelligent answers
- Technologies: Python, Transformers, Hugging Face, TensorFlow, PyTorch
- GitHub: https://github.com/MohsinRaza-dev1

### 4. AI Chatbot
- An intelligent chatbot for contextual conversations
- Features: Contextual conversation understanding, Intelligent response generation
- Technologies: Python, LangChain, LLMs, FastAPI, RAG, AI APIs
- GitHub: https://github.com/MohsinRaza-dev1

### 5. Business Portfolio Website
- A modern responsive website for businesses and professional branding
- Features: Responsive design, Professional business branding
- Technologies: HTML, CSS, JavaScript, React, Next.js
- GitHub: https://github.com/MohsinRaza-dev1

## SERVICES OFFERED
1. Full Stack Web Development — Building modern, scalable, and responsive web applications using Next.js, React, TypeScript, and Python backends
2. FastAPI Backend Development — Building high-performance APIs and backend systems using Python and FastAPI with clean architecture
3. AI Application Development — Building AI-powered applications, intelligent chatbots, RAG systems, and LLM-based solutions
4. Business Website Development — Creating modern, professional websites for schools, clinics, businesses, restaurants, and organizations
5. Database & API Development — Designing secure, optimized databases and scalable REST APIs with proper authentication
6. Automation Solutions — Creating workflow automation and AI-powered business automation using N8N and modern tools

## WHY WORK WITH MOHSIN
1. AI + Full Stack Expertise — Combining full-stack development with AI to build intelligent, scalable solutions
2. Clean, Scalable Code — Production-ready code with proper architecture, testing, and documentation
3. Problem-Solving Mindset — Analytical thinking focused on practical, effective solutions
4. Business-Focused Solutions — Technology that drives real business results
5. Continuous Learning — Staying current with modern tech, AI advancements, and best practices
6. Professional Communication — Clear, timely communication with focus on expectations`;

const SYSTEM_INSTRUCTION = `You are Mohsin Raza's AI portfolio assistant. Your ONLY job is to answer questions about Mohsin Raza using the portfolio data provided below.

IMPORTANT RULES:
- ONLY answer based on the data given below. Never invent or guess information.
- If asked something NOT covered in the data, say: "I don't have that information, but you can reach out to Mohsin directly at hmohsinkhan5@gmail.com!"
- Be warm, friendly, and enthusiastic — you represent Mohsin
- Keep answers clear and well-structured (2-4 paragraphs max)
- Use **bold** for emphasis on key points like names, technologies, or numbers
- When listing multiple items, use bullet points
- For skills questions, organize by category
- For project questions, mention key features and technologies
- Always end by offering to help with more questions
- Never mention that you're an AI or that you were given data — just answer naturally as Mohsin's assistant

PORTFOLIO DATA:
${PORTFOLIO_DATA}`;

// ─── Route handler ────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json();

    if (!message?.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        reply: "Hey! The AI assistant is being set up. Until then, feel free to email Mohsin at **hmohsinkhan5@gmail.com** or use the contact form below!",
      });
    }

    // Build conversation history
    const contents: { role: string; parts: { text: string }[] }[] = [];

    // Add previous messages as context
    if (history && history.length > 0) {
      for (const msg of history) {
        contents.push({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.text }],
        });
      }
    }

    // Add current user message
    contents.push({
      role: "user",
      parts: [{ text: message }],
    });

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: SYSTEM_INSTRUCTION }],
          },
          contents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 600,
            topP: 0.9,
          },
        }),
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      console.error("Gemini API error:", res.status, errText);
      return NextResponse.json(
        { error: "AI service temporarily unavailable" },
        { status: 502 }
      );
    }

    const data = await res.json();
    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I couldn't generate a response. Please try asking differently!";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
