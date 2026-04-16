import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Zap, Globe, BarChart3, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 lg:pt-32 lg:pb-32 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100/50 via-white to-white -z-10" />
        <div className="absolute top-[10%] left-[10%] w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-blob -z-10" />
        <div className="absolute top-[15%] right-[10%] w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-blob animation-delay-2000 -z-10" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-700 text-sm font-bold mb-8 animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            Phase 3 Launch: Premium Themes Now Live
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-black tracking-tight text-slate-900 mb-6 leading-[1.1]">
            One link to <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">rule them all.</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-xl text-slate-500 mb-10 leading-relaxed font-medium">
            BioLink is the simplest way to share your digital world. 
            Custom themes, real-time analytics, and an AI-powered bio generator — all in one beautiful page.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link href="/auth/login">
              <Button size="lg" className="h-14 px-8 text-lg font-bold bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-200 rounded-2xl group transition-all active:scale-95">
                Claim Your Username
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-bold border-slate-200 hover:bg-slate-50 rounded-2xl transition-all">
                Explore Features
              </Button>
            </Link>
          </div>

          {/* Social Proof / Trust Line */}
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-40 grayscale">
            <span className="text-xl font-black tracking-tighter">TRUSTED BY 10,000+ CREATORS</span>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-base font-bold text-indigo-600 uppercase tracking-widest mb-3">Everything you need</h2>
            <p className="text-3xl lg:text-5xl font-black text-slate-900 tracking-tight">Powerful features. Zero cost.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <div key={i} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
                <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed font-medium">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900 rounded-[3rem] p-8 lg:p-16 text-center relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
            
            <h2 className="text-4xl lg:text-6xl font-black text-white mb-6 tracking-tight relative z-10">
              Ready to claim your spot?
            </h2>
            <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto relative z-10 font-medium">
              Join thousands of creators who are already using BioLink to grow their audience.
            </p>
            <Link href="/auth/login" className="relative z-10">
              <Button size="lg" className="h-16 px-12 text-xl font-black bg-white text-slate-900 hover:bg-slate-100 rounded-2xl shadow-2xl transition-all active:scale-95">
                Join for Free
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black text-lg shadow-lg shadow-indigo-200">B</div>
            <span className="text-xl font-black tracking-tight text-slate-900">BioLink</span>
          </div>
          
          <div className="flex gap-8 text-sm font-bold text-slate-400 uppercase tracking-widest">
            <Link href="/privacy" className="hover:text-slate-900 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-slate-900 transition-colors">Terms</Link>
            <Link href="mailto:hello@biolink.com" className="hover:text-slate-900 transition-colors">Contact</Link>
          </div>
          
          <p className="text-sm text-slate-400 font-medium">
            &copy; {new Date().getFullYear()} BioLink. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    title: "Premium Themes",
    description: "Choose from our curated collection of professional themes or build your own custom look.",
    icon: <Zap className="w-7 h-7" />,
  },
  {
    title: "AI Bio Generator",
    description: "Don't know what to write? Our Gemini-powered AI will craft the perfect bio for you in seconds.",
    icon: <Sparkles className="w-7 h-7" />,
  },
  {
    title: "Deep Analytics",
    description: "Track your growth with detailed visitor and click analytics. Know exactly what's working.",
    icon: <BarChart3 className="w-7 h-7" />,
  },
  {
    title: "Custom URLs",
    description: "Get a clean, short, and memorable link that represents you across the entire internet.",
    icon: <Globe className="w-7 h-7" />,
  },
  {
    title: "Pro Features, Free",
    description: "Everything we offer is completely free. No hidden costs, no premium tiers. Just excellence.",
    icon: <CheckCircle2 className="w-7 h-7" />,
  },
  {
    title: "Secure & Fast",
    description: "Built on high-performance infrastructure ensuring your page loads instantly, every time.",
    icon: <ShieldCheck className="w-7 h-7" />,
  },
];
