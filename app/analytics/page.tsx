"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from "recharts";
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  orderBy, 
  limit 
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  TrendingUp, 
  Users, 
  MousePointer2, 
  Calendar,
  ChevronLeft
} from "lucide-react";
import Link from "next/link";

interface DailyVisit {
  date: string;
  count: number;
}

interface LinkClick {
  id: string;
  title: string;
  count: number;
}

export default function AnalyticsPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalVisits: 0,
    dailyData: [] as DailyVisit[],
    linkClicks: [] as LinkClick[],
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    async function fetchAnalytics() {
      if (!profile?.username) return;

      try {
        setLoading(true);
        const username = profile.username.toLowerCase();
        
        // 1. Fetch total visits
        const analyticsRef = doc(db, "analytics", username);
        const analyticsSnap = await getDoc(analyticsRef);
        const totalVisits = analyticsSnap.exists() ? analyticsSnap.data().totalVisits : 0;

        // 2. Fetch daily visits (last 7 days)
        const dailyQuery = query(
          collection(db, "analytics", username, "dailyVisits"),
          orderBy("date", "desc"),
          limit(7)
        );
        const dailySnap = await getDocs(dailyQuery);
        const dailyData = dailySnap.docs
          .map(doc => doc.data() as DailyVisit)
          .reverse(); // Standard chronlogical order for chart

        // 3. Fetch link clicks
        const clicksSnap = await getDocs(collection(db, "analytics", username, "clicks"));
        const linkClicks = clicksSnap.docs.map(docSnap => {
          const data = docSnap.data();
          // Find original link title from profile
          const linkInfo = profile.links.find(l => l.id === docSnap.id);
          return {
            id: docSnap.id,
            title: linkInfo?.title || "Deleted Link",
            count: data.count || 0,
          };
        }).sort((a, b) => b.count - a.count);

        setStats({
          totalVisits,
          dailyData: dailyData.length > 0 ? dailyData : generateEmptyData(),
          linkClicks,
        });
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    }

    if (profile) fetchAnalytics();
  }, [profile]);

  const generateEmptyData = () => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      data.push({
        date: d.toISOString().split('T')[0],
        count: 0
      });
    }
    return data;
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="max-w-5xl mx-auto px-6 py-12">
          <Skeleton className="h-10 w-48 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Skeleton className="h-32 rounded-3xl" />
            <Skeleton className="h-32 rounded-3xl" />
          </div>
          <Skeleton className="h-[400px] rounded-3xl" />
        </div>
      </div>
    );
  }

  const totalClicks = stats.linkClicks.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard" className="p-2 hover:bg-white rounded-xl transition-colors border border-transparent hover:border-slate-200 group">
            <ChevronLeft className="w-5 h-5 text-slate-400 group-hover:text-slate-900" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
            <p className="text-slate-500">Track your page performance and link engagement</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="rounded-3xl border-none shadow-sm bg-indigo-600 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Users className="w-24 h-24" />
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-80 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Total Visits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{stats.totalVisits}</div>
              <p className="text-xs mt-1 opacity-70">Across all time</p>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-none shadow-sm bg-white overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-5 text-indigo-600">
              <MousePointer2 className="w-24 h-24" />
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500 flex items-center gap-2">
                <MousePointer2 className="w-4 h-4" />
                Total Link Clicks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-slate-900">{totalClicks}</div>
              <p className="text-xs mt-1 text-slate-400">Click-through rate: {stats.totalVisits > 0 ? ((totalClicks / stats.totalVisits) * 100).toFixed(1) : 0}%</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Chart */}
          <Card className="rounded-3xl border-none shadow-sm bg-white lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-600" />
                Visitor Traffic (Last 7 Days)
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.dailyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                    tickFormatter={(str) => {
                      const date = new Date(str);
                      return date.toLocaleDateString('en-US', { weekday: 'short' });
                    }}
                  />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {stats.dailyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === stats.dailyData.length - 1 ? '#4f46e5' : '#e2e8f0'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Link Clicks Breakdown */}
          <Card className="rounded-3xl border-none shadow-sm bg-white">
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-600" />
                Top Links
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {stats.linkClicks.length > 0 ? (
                  stats.linkClicks.map((link) => (
                    <div key={link.id} className="group">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-semibold text-slate-700 truncate max-w-[150px]">
                          {link.title}
                        </span>
                        <span className="text-sm font-bold text-slate-900">{link.count}</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div 
                          className="bg-indigo-500 h-full rounded-full transition-all duration-1000"
                          style={{ width: `${totalClicks > 0 ? (link.count / totalClicks) * 100 : 0}%` }}
                        ></div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10">
                    <p className="text-sm text-slate-400 italic">No click data yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
