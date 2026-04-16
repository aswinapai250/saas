import { getUserByUsername } from "@/lib/firestore";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { AnalyticsTracker } from "@/components/AnalyticsTracker";
import { TrackableLink } from "@/components/TrackableLink";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }): Promise<Metadata> {
  const { username } = await params;
  if (!username) return { title: "User Not Found" };

  const profile = await getUserByUsername(username);
  if (!profile) return { title: "User Not Found" };

  const title = `${profile.displayName || profile.username} | BioLink`;
  const description = profile.bio || `Connect with ${profile.displayName || profile.username} on BioLink.`;
  const ogUrl = new URL('https://saas-biolink.vercel.app/api/og');
  ogUrl.searchParams.set('username', profile.username);
  ogUrl.searchParams.set('name', profile.displayName || profile.username);
  if (profile.bio) ogUrl.searchParams.set('bio', profile.bio);
  if (profile.photoURL) ogUrl.searchParams.set('photo', profile.photoURL);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: ogUrl.toString(),
          width: 1200,
          height: 630,
          alt: title
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogUrl.toString()],
    }
  };
}

export default async function PublicPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;

  if (!username) {
    notFound();
  }

  const profile = await getUserByUsername(username);

  if (!profile) {
    notFound();
  }

  return (
    <main 
      className={`min-h-screen transition-all duration-500 ${
        profile.theme === 'default-light' ? 'bg-slate-50' : ''
      }`}
      data-theme={profile.theme || "default-light"}
    >
      <AnalyticsTracker username={profile.username} />
      
      <div className="max-w-xl mx-auto px-6 py-20 flex flex-col items-center">
        {/* Profile Image */}
        <div className="relative group mb-8">
          <div className="absolute inset-0 bg-white/20 backdrop-blur-sm rounded-full -m-2 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative w-28 h-28 bg-white/20 backdrop-blur-md rounded-full overflow-hidden border-4 border-white/50 shadow-2xl z-10">
            {profile.photoURL ? (
              <img 
                src={profile.photoURL} 
                alt={profile.displayName} 
                className="w-full h-full object-cover" 
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white font-bold text-4xl uppercase">
                {profile.displayName?.[0] || profile.username[0]}
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="text-center space-y-3 mb-12">
          <h1 className="text-3xl font-bold text-foreground tracking-tight drop-shadow-sm">
            {profile.displayName || `@${profile.username}`}
          </h1>
          {profile.bio && (
            <p className="text-foreground/70 text-lg max-w-sm leading-relaxed font-medium">
              {profile.bio}
            </p>
          )}
        </div>

        {/* Links */}
        <div className="w-full space-y-4">
          {profile.links
            .filter((l) => l.enabled)
            .sort((a, b) => a.order - b.order)
            .map((link) => (
              <TrackableLink
                key={link.id}
                username={profile.username}
                linkId={link.id}
                url={link.url}
                className="block w-full p-5 bg-card text-card-foreground border border-border/50 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex items-center justify-center relative">
                  <span className="font-bold text-lg group-hover:scale-[1.02] transition-transform">
                    {link.title || "Untitled Link"}
                  </span>
                  <div className="absolute right-0 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0 transition-all">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>
              </TrackableLink>
            ))}
          
          {profile.links.filter(l => l.enabled).length === 0 && (
            <div className="text-center py-16 bg-white/5 backdrop-blur-sm rounded-3xl border border-dashed border-white/20">
              <p className="text-foreground/40 italic">
                This user hasn't added any links yet.
              </p>
            </div>
          )}
        </div>

        {/* Branding Footer */}
        <div className="mt-24 flex flex-col items-center gap-4">
          <a 
            href="/" 
            className="flex items-center gap-2 px-6 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full hover:bg-white/20 transition-all group lg:scale-100 scale-90"
          >
            <div className="w-6 h-6 bg-white rounded flex items-center justify-center text-[12px] text-black font-black">B</div>
            <span className="text-xs font-black tracking-[0.2em] text-foreground/50 group-hover:text-foreground/90 uppercase">Create your BioLink</span>
          </a>
        </div>
      </div>
    </main>
  );
}
