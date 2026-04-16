import { NextResponse } from "next/server";
import { doc, increment, updateDoc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function POST(request: Request) {
  try {
    const { username } = await request.json();

    if (!username) {
      return NextResponse.json({ error: "Username is required" }, { status: 400 });
    }

    const analyticsRef = doc(db, "analytics", username.toLowerCase());
    
    // Check if document exists to decide set vs update
    const snap = await getDoc(analyticsRef);
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const dailyRef = doc(db, "analytics", username.toLowerCase(), "dailyVisits", today);

    if (!snap.exists()) {
      await setDoc(analyticsRef, {
        totalVisits: 1,
        lastVisit: serverTimestamp(),
        username: username.toLowerCase()
      });
    } else {
      await updateDoc(analyticsRef, {
        totalVisits: increment(1),
        lastVisit: serverTimestamp()
      });
    }

    // Daily visit increment
    const dailySnap = await getDoc(dailyRef);
    if (!dailySnap.exists()) {
      await setDoc(dailyRef, { count: 1, date: today });
    } else {
      await updateDoc(dailyRef, { count: increment(1) });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error tracking visit:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
