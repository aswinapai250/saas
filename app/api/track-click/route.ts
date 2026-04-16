import { NextResponse } from "next/server";
import { doc, increment, updateDoc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function POST(request: Request) {
  try {
    const { username, linkId } = await request.json();

    if (!username || !linkId) {
      return NextResponse.json({ error: "Username and linkId are required" }, { status: 400 });
    }

    const clickRef = doc(db, "analytics", username.toLowerCase(), "clicks", linkId);

    // Check if document exists to decide set vs update
    const snap = await getDoc(clickRef);

    if (!snap.exists()) {
      await setDoc(clickRef, {
        count: 1,
        lastClicked: serverTimestamp(),
        linkId
      });
    } else {
      await updateDoc(clickRef, {
        count: increment(1),
        lastClicked: serverTimestamp()
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error tracking click:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
