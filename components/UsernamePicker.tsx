"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { isUsernameAvailable, claimUsername } from "@/lib/firestore";
import { useAuth } from "@/context/AuthContext";
import { Loader2, Check, AlertCircle } from "lucide-react";

export function UsernamePicker() {
  const { user, refreshProfile } = useAuth();
  const [username, setUsername] = useState("");
  const [status, setStatus] = useState<"idle" | "checking" | "available" | "taken" | "invalid">("idle");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validateUsername = (val: string) => {
    const regex = /^[a-z0-9_]{3,20}$/;
    if (!val) return "idle";
    if (!regex.test(val)) return "invalid";
    return "checking";
  };

  const handleUsernameChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toLowerCase();
    setUsername(val);
    
    const nextStatus = validateUsername(val);
    setStatus(nextStatus);

    if (nextStatus === "checking") {
      try {
        const available = await isUsernameAvailable(val);
        setStatus(available ? "available" : "taken");
      } catch (err) {
        console.error(err);
        setStatus("idle");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status !== "available" || !user) return;

    setLoading(true);
    setError("");

    try {
      await claimUsername(user.uid, username, {
        displayName: user.displayName || username,
        photoURL: user.photoURL || "",
        bio: "",
      });
      await refreshProfile();
    } catch (err: any) {
      setError(err.message || "Failed to claim username");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
      <Card className="w-full max-w-md shadow-xl border-indigo-100">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Claim your username</CardTitle>
          <CardDescription className="text-center">
            Choose a unique username for your public link page.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form id="username-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
                  biolink.com/
                </div>
                <Input
                  id="username"
                  placeholder="yourname"
                  value={username}
                  onChange={handleUsernameChange}
                  className={`pl-[90px] h-11 ${
                    status === "available" ? "border-green-500 focus-visible:ring-green-500" : 
                    status === "taken" || status === "invalid" ? "border-red-500 focus-visible:ring-red-500" : ""
                  }`}
                  disabled={loading}
                />
                <div className="absolute inset-y-0 right-3 flex items-center">
                  {status === "checking" && <Loader2 className="h-4 w-4 animate-spin text-slate-400" />}
                  {status === "available" && <Check className="h-4 w-4 text-green-500" />}
                  {(status === "taken" || status === "invalid") && <AlertCircle className="h-4 w-4 text-red-500" />}
                </div>
              </div>
              <p className="text-xs text-slate-500">
                {status === "invalid" && "3-20 characters, lowercase, numbers, and underscores only."}
                {status === "taken" && "This username is already taken."}
                {status === "available" && "Great! This username is available."}
                {status === "idle" && "Required for your public URL."}
              </p>
            </div>
            {error && (
              <p className="text-sm text-red-500 bg-red-50 p-3 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> {error}
              </p>
            )}
          </form>
        </CardContent>
        <CardFooter>
          <Button 
            form="username-form"
            type="submit" 
            className="w-full h-11 bg-indigo-600 hover:bg-indigo-700" 
            disabled={status !== "available" || loading}
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Claim Username"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
