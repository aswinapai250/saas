"use client";

import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { updateProfile } from "@/lib/firestore";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function SettingsPage() {
  const { user, profile, logout } = useAuth();
  const [displayName, setDisplayName] = useState(profile?.displayName || "");
  const [bio, setBio] = useState(profile?.bio || "");
  const [photoURL, setPhotoURL] = useState(profile?.photoURL || "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName || "");
      setBio(profile.bio || "");
      setPhotoURL(profile.photoURL || "");
    }
  }, [profile]);

  if (!user || !profile) return null;

  async function handleSave() {
    if (!user) return;
    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      await updateProfile(user.uid, {
        displayName,
        bio,
        photoURL
      });
      setMessage({ type: "success", text: "Profile updated successfully!" });
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage({ type: "error", text: "Failed to update profile. Please try again." });
    } finally {
      setSaving(false);
    }
  }

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
              Profile Editor
            </h2>
            <Card className="border-none shadow-sm rounded-[2rem] overflow-hidden">
              <CardContent className="pt-8 space-y-8">
                <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                  <div className="relative group">
                    <div className="w-32 h-32 rounded-3xl bg-indigo-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-xl">
                      {photoURL ? (
                        <img src={photoURL} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-4xl font-bold text-indigo-600">{user.email?.[0].toUpperCase()}</span>
                      )}
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-white p-2 rounded-xl shadow-lg border border-slate-100">
                      <User className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>

                  <div className="flex-grow w-full space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="displayName" className="text-sm font-bold text-slate-700 ml-1">Display Name</Label>
                        <Input 
                          id="displayName"
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          placeholder="Your public name"
                          className="rounded-2xl border-slate-200 h-12 focus:ring-indigo-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-bold text-slate-700 ml-1">Username</Label>
                        <div className="h-12 flex items-center px-4 bg-slate-100 rounded-2xl text-slate-500 font-medium">
                          @{profile.username}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center ml-1">
                        <Label htmlFor="bio" className="text-sm font-bold text-slate-700">Bio</Label>
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${bio.length > 160 ? "text-red-500" : "text-slate-400"}`}>
                          {bio.length}/160
                        </span>
                      </div>
                      <Textarea 
                        id="bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value.slice(0, 160))}
                        placeholder="Tell the world about yourself..."
                        className="rounded-2xl border-slate-200 min-h-[100px] focus:ring-indigo-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="photoURL" className="text-sm font-bold text-slate-700 ml-1">Profile Photo URL</Label>
                      <Input 
                        id="photoURL"
                        value={photoURL}
                        onChange={(e) => setPhotoURL(e.target.value)}
                        placeholder="https://example.com/photo.jpg"
                        className="rounded-2xl border-slate-200 h-12 focus:ring-indigo-500"
                      />
                      <p className="text-[10px] text-slate-400 ml-1">Enter a URL for your profile picture (Google account photo used by default)</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 pt-2">
                      <Button 
                        onClick={handleSave} 
                        disabled={saving}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl h-12 px-8 font-bold shadow-lg shadow-indigo-100 flex-grow"
                      >
                        {saving ? "Saving Changes..." : "Save Changes"}
                        {saving ? null : <Check className="ml-2 w-4 h-4" />}
                      </Button>
                      <Button variant="outline" onClick={logout} className="rounded-2xl border-slate-200 text-red-600 hover:bg-red-50 hover:text-red-700 h-12 gap-2 font-semibold">
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </Button>
                    </div>

                    {message.text && (
                      <div className={`p-4 rounded-2xl text-sm font-medium ${
                        message.type === "success" ? "bg-green-50 text-green-700 border border-green-100" : "bg-red-50 text-red-700 border border-red-100"
                      }`}>
                        {message.text}
                      </div>
                    )}
                  </div>
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
