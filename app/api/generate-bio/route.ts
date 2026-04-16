import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { doc, getDoc, updateDoc, increment } from "firebase/firestore";
import { db } from "@/lib/firebase";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request: Request) {
  try {
    const { prompt, username } = await request.json();

    if (!prompt || !username) {
      return NextResponse.json({ error: "Prompt and username are required" }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "AI service not configured" }, { status: 500 });
    }

    // 1. Check generation limits (Optional but good practice)
    const analysticRef = doc(db, "analytics", username.toLowerCase());
    const snap = await getDoc(analysticRef);
    const generations = snap.exists() ? (snap.data().bioGenerations || 0) : 0;

    // For now, let's limit to 20 generations for everyone
    if (generations >= 20) {
      return NextResponse.json({ error: "Daily limit reached. Upgrade for more." }, { status: 403 });
    }

    // 2. Call Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
    
    const aiPrompt = `
      You are an expert social media bio writer. 
      Create a short, engaging, and professional bio for a link-in-bio page based on the following context: "${prompt}".
      The bio should be under 160 characters.
      Only return the bio text itself, no quotes, no labels.
    `;

    const result = await model.generateContent(aiPrompt);
    const response = await result.response;
    const text = response.text().trim();

    // 3. Increment counter
    await updateDoc(analysticRef, {
      bioGenerations: increment(1)
    });

    return NextResponse.json({ bio: text });
  } catch (error: any) {
    console.error("AI Generation Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
