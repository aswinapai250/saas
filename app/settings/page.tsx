"use client";

import { useAuth } from "@/context/AuthContext";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, CreditCard, User, LogOut } from "lucide-react";

export default function SettingsPage() {
  const { user, profile, logout } = useAuth();

  if (!user || !profile) return null;

  const plans = [
    {
      name: "Free",
      price: "$0",
      description: "Perfect for getting started",
      features: ["Up to 5 links", "Basic analytics", "Standard bio generator"],
      current: profile.plan === "free" || !profile.plan,
    },
    {
      name: "Pro",
      price: "$9",
      description: "For creators and professionals",
      features: ["Unlimited links", "Advanced analytics", "Priority AI generator", "Custom domains (coming soon)"],
      current: profile.plan === "pro",
      pro: true,
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-20">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 py-12 w-full">
        <header className="mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-2">Settings</h1>
          <p className="text-slate-500">Manage your account, subscription, and preferences.</p>
        </header>

        <div className="space-y-12">
          {/* Profile Section */}
          <section className="space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-600" />
              Account Details
            </h2>
            <Card className="border-none shadow-sm rounded-[2rem] overflow-hidden">
              <CardContent className="pt-8 flex flex-col md:flex-row gap-8 items-center md:items-start">
                <div className="w-24 h-24 rounded-3xl bg-indigo-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-xl">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-3xl font-bold text-indigo-600">{user.email?.[0].toUpperCase()}</span>
                  )}
                </div>
                <div className="flex-grow space-y-4 text-center md:text-left">
                  <div>
                    <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Email Address</Label>
                    <p className="text-lg font-semibold text-slate-900">{user.email}</p>
                  </div>
                  <div>
                    <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Username</Label>
                    <p className="text-lg font-semibold text-indigo-600">@{profile.username}</p>
                  </div>
                  <Button variant="outline" onClick={logout} className="rounded-xl border-slate-200 text-red-600 hover:bg-red-50 hover:text-red-700 gap-2">
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Pricing Section */}
          <section className="space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-indigo-600" />
              Subscription Plan
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {plans.map((plan) => (
                <Card 
                  key={plan.name} 
                  className={`border-2 rounded-[2.5rem] overflow-hidden transition-all ${
                    plan.current 
                      ? "border-indigo-600 shadow-indigo-100/50 shadow-2xl scale-[1.02]" 
                      : "border-slate-100 hover:border-slate-200 shadow-sm"
                  }`}
                >
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-2xl font-bold text-slate-900">{plan.name}</CardTitle>
                        <CardDescription className="mt-1">{plan.description}</CardDescription>
                      </div>
                      {plan.pro && (
                        <Badge className="bg-indigo-600 text-white border-none rounded-lg px-2 py-0.5">
                          <Crown className="w-3 h-3 mr-1" /> PRO
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-extrabold text-slate-900">{plan.price}</span>
                      <span className="text-slate-500 font-medium">/month</span>
                    </div>
                    
                    <ul className="space-y-3">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center ${plan.pro ? "bg-indigo-100 text-indigo-600" : "bg-slate-100 text-slate-500"}`}>
                            <Check className="w-3 h-3" />
                          </div>
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <Button 
                      className={`w-full h-12 rounded-2xl font-bold transition-all ${
                        plan.current 
                          ? "bg-slate-100 text-slate-400 cursor-default hover:bg-slate-100" 
                          : "bg-indigo-600 hover:bg-slate-900 text-white shadow-lg shadow-indigo-100"
                      }`}
                      disabled={plan.current}
                    >
                      {plan.current ? "Current Plan" : "Upgrade to Pro"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
