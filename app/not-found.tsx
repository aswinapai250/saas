import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <div className="relative mb-8">
        <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full blur-2xl opacity-10 animate-pulse"></div>
        <h1 className="relative text-9xl font-black text-slate-200">404</h1>
      </div>
      
      <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">
        Page Not Found
      </h2>
      
      <p className="text-slate-500 mb-10 max-w-md leading-relaxed">
        The page you're looking for doesn't exist or has been moved. 
        Let's get you back on track.
      </p>

      <div className="flex gap-4">
        <Button asChild size="lg" className="rounded-full px-8 shadow-lg shadow-indigo-100 hover:shadow-indigo-200 transition-all">
          <Link href="/">
            Back Home
          </Link>
        </Button>
      </div>
      
      {/* Subtle background element */}
      <div className="fixed bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-white to-transparent -z-10 pointer-events-none"></div>
    </main>
  );
}
