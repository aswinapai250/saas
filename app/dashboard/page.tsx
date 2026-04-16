"use client";

import { useAuth } from "@/context/AuthContext";
import { Navbar } from "@/components/Navbar";
import { UsernamePicker } from "@/components/UsernamePicker";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Plus, Link as LinkIcon, User as UserIcon, Settings, BarChart3, AppWindow } from "lucide-react";

export default function Dashboard() {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Skeleton className="h-64 col-span-1 md:col-span-3" />
            <Skeleton className="h-64" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center p-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Please log in to access your dashboard</h1>
            <Link href="/">
              <Button>Go to Home</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <UsernamePicker />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Welcome back, {profile.displayName}</h1>
            <p className="text-slate-500">Manage your bio links and track your performance.</p>
          </div>
          <Link href={`/${profile.username}`} target="_blank">
            <Button variant="outline" className="gap-2">
              <AppWindow className="w-4 h-4" />
              View My Page
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Stats */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <CardItem title="Total Visits" value="0" icon={<UserIcon />} color="blue" />
              <CardItem title="Total Clicks" value="0" icon={<LinkIcon />} color="indigo" />
              <CardItem title="Click Rate" value="0%" icon={<BarChart3 />} color="purple" />
            </div>

            {/* Main CTA */}
            <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl shadow-indigo-200">
              <h2 className="text-2xl font-bold mb-2">Ready to grow your audience?</h2>
              <p className="text-indigo-100 mb-6 max-w-md">Update your links and bio to keep your profile fresh and engaging for your visitors.</p>
              <Link href="/editor">
                <Button size="lg" className="bg-white text-indigo-600 hover:bg-slate-100 border-none font-bold">
                  Open Editor <Plus className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Sidebar Menu */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider px-2">Manage</h3>
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <SidebarItem label="Bio Link Editor" href="/editor" icon={<Plus />} active />
              <SidebarItem label="Analytics" href="/analytics" icon={<BarChart3 />} />
              <SidebarItem label="Account Settings" href="/settings" icon={<Settings />} />
              <div className="p-4 bg-indigo-50/50 border-t border-indigo-100">
                <p className="text-sm font-medium text-indigo-900 mb-1">Current Plan: {profile.plan.toUpperCase()}</p>
                <Link href="/pricing" className="text-xs text-indigo-600 font-bold hover:underline">
                  Upgrade to Pro →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function CardItem({ title, value, icon, color }: any) {
  const colors: any = {
    blue: "bg-blue-100 text-blue-600",
    indigo: "bg-indigo-100 text-indigo-600",
    purple: "bg-purple-100 text-purple-600",
  };
  
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <div className={`w-10 h-10 ${colors[color]} rounded-xl flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <p className="text-slate-500 text-sm font-medium">{title}</p>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

function SidebarItem({ label, href, icon, active = false }: any) {
  return (
    <Link 
      href={href} 
      className={`flex items-center gap-3 p-4 transition-colors ${
        active ? "bg-indigo-50 text-indigo-600 font-semibold" : "text-slate-600 hover:bg-slate-50"
      }`}
    >
      <div className={`${active ? "text-indigo-600" : "text-slate-400"}`}>
        {icon}
      </div>
      <span>{label}</span>
    </Link>
  );
}
