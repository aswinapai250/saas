import { NextResponse } from "next/server";
import { doc, getDoc, collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");

    if (!username) {
      return NextResponse.json({ error: "Username is required" }, { status: 400 });
    }

    const usernameLower = username.toLowerCase();

    // 1. Fetch main analytics doc
    const analysticRef = doc(db, "analytics", usernameLower);
    const snap = await getDoc(analysticRef);
    const mainData = snap.exists() ? snap.data() : { totalVisits: 0 };

    // 2. Fetch daily visits (last 7 days)
    const dailyRef = collection(db, "analytics", usernameLower, "dailyVisits");
    const dailyQuery = query(dailyRef, orderBy("__name__", "desc"), limit(7));
    const dailySnap = await getDocs(dailyQuery);
    
    const dailyData = dailySnap.docs.map(doc => ({
      date: doc.id,
      visits: doc.data().count || 0
    })).reverse();

    // 3. Fetch link clicks
    const clicksRef = collection(db, "analytics", usernameLower, "clicks");
    const clicksSnap = await getDocs(clicksRef);
    
    const linksData = clicksSnap.docs.map(doc => ({
      id: doc.id,
      count: doc.data().count || 0,
      lastClicked: doc.data().lastClicked
    }));

    return NextResponse.json({
      totalVisits: mainData.totalVisits || 0,
      dailyVisits: dailyData,
      links: linksData
    });

  } catch (error: any) {
    console.error("Analytics fetch error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
