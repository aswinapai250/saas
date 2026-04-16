"use client";

import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { LogIn, User, LayoutDashboard, LogOut, BarChart2, Settings } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const { user, profile, logout, signInWithGoogle } = useAuth();

  return (
    <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-200 group-hover:scale-105 transition-transform">B</div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 lowercase tracking-tighter">BioLink</span>
          </Link>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <div className="hidden md:flex items-center gap-1 mr-2">
                  <Link href="/dashboard">
                    <Button variant="ghost" size="sm" className="text-slate-600 hover:text-indigo-600 gap-2">
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Button>
                  </Link>
                  <Link href="/analytics">
                    <Button variant="ghost" size="sm" className="text-slate-600 hover:text-indigo-600 gap-2">
                      <BarChart2 className="w-4 h-4" />
                      Analytics
                    </Button>
                  </Link>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="rounded-full pl-1 pr-3 gap-2 border-slate-200 hover:bg-slate-50">
                      <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden">
                        {user.photoURL ? (
                          <img src={user.photoURL} alt="" />
                        ) : (
                          <User className="w-3 h-3 text-indigo-600" />
                        )}
                      </div>
                      <span className="text-xs font-semibold text-slate-700">Account</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 rounded-2xl p-2 shadow-xl border-slate-100">
                    <div className="px-2 py-2 mb-1">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Signed in as</p>
                      <p className="text-sm font-semibold text-slate-900 truncate">{user.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <Link href="/editor">
                      <DropdownMenuItem className="rounded-xl cursor-pointer gap-2 py-2.5">
                        <User className="w-4 h-4 text-slate-400" />
                        My Bio Page
                      </DropdownMenuItem>
                    </Link>
                    <Link href="/settings">
                      <DropdownMenuItem className="rounded-xl cursor-pointer gap-2 py-2.5">
                        <Settings className="w-4 h-4 text-slate-400" />
                        Settings
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="rounded-xl cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 gap-2 py-2.5">
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button onClick={() => signInWithGoogle()} className="bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-100 rounded-xl gap-2 h-9">
                <LogIn className="w-4 h-4" />
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
