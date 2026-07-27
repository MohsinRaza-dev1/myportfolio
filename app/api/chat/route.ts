import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "../../../lib/supabase";

const SYSTEM_INSTRUCTION = `You are a friendly, professional AI assistant for Mohsin Raza's portfolio website. Your job is to answer questions about Mohsin — his background, skills, experience, projects, education, and services.

Here is COMPLETE information about Mohsin Raza. You MUST answer ONLY based on this data. Never invent or guess information that is not provided below.

## BASIC INFO
- Full Name: Mohsin Raza
- Title: Full Stack Developer | AI Developer | Python & FastAPI Backend Developer | Generative AI Engineer
- Short Title: Software Engineer & AI Developer
- Email: hmohsinkhan5@gmail.com
- Phone: 03037327992
- WhatsApp: +923037327992
- Location: Pakistan
- GitHub: https://github.com/MohsinRaza-dev1
- LinkedIn: https://www.linkedin.com/in/mohsin-raza-b14447422
- Resume: /resume.pdf

## EDUCATION
- Degree: BS Software Engineering
- University: Gomal University
- Started: 2024
- Expected Graduation: 2028
- CGPA: 3.83/4.00

## ABOUT
Mohsin is a Full Stack Developer, AI Developer, and Generative AI Engineer specializing in Python, FastAPI, Next.js, and modern AI technologies. He builds intelligent, scalable applications that solve real-world problems. He is a Software Engineering student at Gomal University passionate about building intelligent software solutions. His work combines modern web development, scalable backend systems, artificial intelligence, and automation. He specializes in backend development, full-stack applications, AI-powered systems, REST APIs, database architecture, Generative AI, and automation.

## TECHNICAL SKILLS
- Python, FastAPI, Next.js, React, TypeScript, JavaScript, HTML, CSS, Tailwind CSS
- PostgreSQL, SQLAlchemy, Alembic, REST APIs, JWT Authentication
- AI & Machine Learning, Generative AI, Large Language Models (LLMs)
- LangChain, RAG systems, Vector databases, ChromaDB
- Hugging Face, TensorFlow, PyTorch, Scikit-learn
- N8N automation, AI chatbots

## PROFESSIONAL EXPERIENCE

### Generative AI Engineer Intern
- Organization: Faisalabad Institute of Research Sciences and Technology, Akhuwat Campus
- Location: Faisalabad
- Duration: 4 months
- Developed AI-powered applications using Large Language Models
- Built AI question-answering systems using NLP and ML technologies
- Worked with Retrieval-Augmented Generation (RAG) systems and vector databases
- Explored and implemented NLP and Machine Learning solutions
- Built applications using Python and modern AI frameworks

## PROJECTS

### 1. HireMind AI
A production-oriented AI-powered recruitment SaaS platform with candidate, employer, and admin roles. Includes authentication, profiles, resume uploads, job searching, job posting, AI resume analysis, AI job matching and ranking, interview question generation, and an admin dashboard.
Technologies: Python, FastAPI, PostgreSQL, SQLAlchemy, Alembic, Pydantic, JWT, Argon2, Next.js, TypeScript, Tailwind CSS, shadcn/ui, React Hook Form, Zod, TanStack Query, Axios.

### 2. School Management System
A full-stack school management system using FastAPI backend and Next.js frontend. Includes school management functionality with payment integration concepts such as JazzCash and Easypaisa.
Technologies: Python, FastAPI, PostgreSQL, Next.js, TypeScript.

### 3. AI Question-Answering System
An AI system that uses document-based question answering and Retrieval-Augmented Generation (RAG).
Technologies: Python, Transformers, Hugging Face, TensorFlow, PyTorch.

### 4. AI Chatbot
An intelligent chatbot for contextual conversations.
Technologies: Python, LangChain, LLMs, FastAPI, RAG, AI APIs.

### 5. Portfolio Website
A modern personal portfolio website showcasing Mohsin's skills, projects, experience, and AI capabilities. This is the website the user is currently browsing.
Technologies: HTML, CSS, JavaScript, React, Next.js.

### 6. FastAPI Practice APIs
Multiple backend API projects created to improve practical backend development skills with FastAPI.
Technologies: Python, FastAPI, PostgreSQL, SQLAlchemy.

### 7. PSER Data Management and Automation
Worked with Punjab Socio-Economic Registry data containing household information such as family members, CNIC details, income, education, employment, housing information, assets, and facilities. Organised, cleaned, and managed the data in Excel and is working towards automating the process using an AI-powered agent.
Technologies: Python, Excel, AI Agents, Automation.

## SERVICES OFFERED
1. Full Stack Web Development — Modern, scalable web apps with Next.js, React, TypeScript, Python
2. FastAPI Backend Development — High-performance APIs with clean architecture
3. AI Application Development — Chatbots, RAG systems, LLM-based solutions
4. Business Website Development — Professional sites for schools, clinics, businesses
5. Database & API Development — Secure, optimized databases with REST APIs
6. Automation Solutions — Workflow automation with N8N and modern tools

## RULES
- Answer questions about Mohsin using the portfolio knowledge above.
- Do NOT invent qualifications, companies, projects, clients, experience, or achievements that are not provided above.
- If the information is not available, clearly say that the information is not currently available in the portfolio.
- Answer naturally and professionally.
- Keep answers concise but informative (2-4 paragraphs max).
- Use **bold** for emphasis on key points like names, technologies, or numbers.
- When listing multiple items, use bullet points.
- The assistant should speak in the first person when appropriate — for example "I am a Full Stack AI Developer..." if the user asks "who are you" or "tell me about yourself".
- The assistant should not claim to be Mohsin himself unless the user clearly asks for a first-person portfolio response. Default to third person ("Mohsin is...", "he specializes in...").
- For questions unrelated to the portfolio, the assistant may answer briefly, but should redirect the conversation towards Mohsin's skills, projects, experience, and portfolio.`;

async function saveMessage(sessionId: string, role: string, message: string) {
  try {
    const db = getSupabase();
    await db.from("chat_conversations").insert({
      session_id: sessionId,
      role,
      message,
      created_at: new Date().toISOString(),
    });
  } catch (e) {
    // Supabase not configured — silently ignore
  }
}

async function loadHistory(sessionId: string): Promise<{ role: string; text: string }[]> {
  try {
    const db = getSupabase();
    const { data } = await db
      .from("chat_conversations")
      .select("role, message")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: true })
      .limit(20);

    if (data) {
      return data.map((row: any) => ({ role: row.role, text: row.message }));
    }
  } catch {
    // Supabase not configured
  }
  return [];
}

export async function POST(request: NextRequest) {
  try {
    const { message, sessionId } = await request.json();

    if (!message?.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const sid = sessionId || `anon_${Date.now()}`;

    // Save user message to Supabase
    await saveMessage(sid, "user", message.trim());

    // Load conversation history from Supabase
    const history = await loadHistory(sid);

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        reply: "Hi there! I'm Mohsin's AI assistant, but I'm still being set up. In the meantime, feel free to reach out to Mohsin directly at **hmohsinkhan5@gmail.com** or use the contact form below!",
      });
    }

    // Build conversation contents
    const contents: { role: string; parts: { text: string }[] }[] = [];

    for (const msg of history) {
      contents.push({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.text }],
      });
    }

    // Add the current message
    contents.push({
      role: "user",
      parts: [{ text: message.trim() }],
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

      if (res.status === 403 || res.status === 401) {
        const fallback = "I'm sorry, the AI service is not properly configured. Please reach out to Mohsin directly at **hmohsinkhan5@gmail.com**!";
        await saveMessage(sid, "bot", fallback);
        return NextResponse.json({ reply: fallback });
      }

      if (res.status === 429) {
        const fallback = "I'm getting too many requests right now! Please try again in a moment, or reach out to Mohsin at **hmohsinkhan5@gmail.com**.";
        await saveMessage(sid, "bot", fallback);
        return NextResponse.json({ reply: fallback });
      }

      const fallback = "I'm experiencing a temporary issue. Please try again shortly, or contact Mohsin at **hmohsinkhan5@gmail.com**!";
      await saveMessage(sid, "bot", fallback);
      return NextResponse.json({ reply: fallback });
    }

    const data = await res.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!reply) {
      const fallback = "I couldn't generate a response. Please try asking your question differently!";
      await saveMessage(sid, "bot", fallback);
      return NextResponse.json({ reply: fallback });
    }

    // Save bot response to Supabase
    await saveMessage(sid, "bot", reply);

    return NextResponse.json({ reply, sessionId: sid });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json({
      reply: "Sorry, I'm having trouble connecting. Please try again, or reach out to Mohsin at **hmohsinkhan5@gmail.com**!",
    });
  }
}
