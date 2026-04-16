"use client";

import { useAuth } from "@/context/AuthContext";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { updateProfile, LinkItem } from "@/lib/firestore";
import { Plus, Trash2, GripVertical, Save, ExternalLink, Loader2, Sparkles } from "lucide-react";
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors 
} from "@dnd-kit/core";
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy,
  useSortable
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function Editor() {
  const { user, profile, loading, refreshProfile } = useAuth();
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [tempProfile, setTempProfile] = useState({ 
    displayName: "", 
    bio: "", 
    photoURL: "",
    theme: "default-light" 
  });
  const [saving, setSaving] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const themes = [
    { id: "default-light", name: "Modern Light", color: "#f8fafc" },
    { id: "sunset", name: "Sunset Glow", color: "#ff9a9e" },
    { id: "ocean", name: "Ocean Breeze", color: "#a1c4fd" },
    { id: "emerald", name: "Emerald Forest", color: "#d4fc79" },
    { id: "midnight", name: "Midnight Sky", color: "#0f172a" },
    { id: "candy", name: "Sweet Candy", color: "#FFFEFF" },
    { id: "carbon", name: "Carbon Dark", color: "#171717" },
  ];

  useEffect(() => {
    if (profile) {
      setLinks(profile.links || []);
      setTempProfile({ 
        displayName: profile.displayName || "", 
        bio: profile.bio || "",
        photoURL: profile.photoURL || "",
        theme: profile.theme || "default-light"
      });
    }
  }, [profile]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setLinks((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        const newArray = arrayMove(items, oldIndex, newIndex);
        return newArray.map((link, idx) => ({ ...link, order: idx }));
      });
    }
  };

  const addLink = () => {
    const newLink: LinkItem = {
      id: Math.random().toString(36).substr(2, 9),
      title: "",
      url: "",
      order: links.length,
      enabled: true,
    };
    setLinks([...links, newLink]);
  };

  const updateLink = (id: string, field: keyof LinkItem, value: any) => {
    setLinks(links.map(l => l.id === id ? { ...l, [field]: value } : l));
  };

  const deleteLink = (id: string) => {
    setLinks(links.filter(l => l.id !== id));
  };

  const generateBio = async () => {
    if (!aiPrompt || !profile?.username) return;
    setIsGenerating(true);
    try {
      const res = await fetch("/api/generate-bio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: aiPrompt, username: profile.username }),
      });
      const data = await res.json();
      if (data.bio) {
        setTempProfile(prev => ({ ...prev, bio: data.bio }));
        setAiPrompt("");
      } else {
        alert(data.error || "Failed to generate bio");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await updateProfile(user.uid, {
        ...tempProfile,
        links: links,
      });
      await refreshProfile();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!user || !profile) return <div>Auth required</div>;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-20">
      <Navbar />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Editor</h1>
          <Button onClick={handleSave} disabled={saving} className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100 rounded-xl">
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save Changes
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Side: Forms */}
          <div className="space-y-8">
            {/* Bio Section */}
            <Card className="border-none shadow-md rounded-3xl overflow-hidden bg-white">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                <CardTitle className="text-lg font-bold">Profile Details</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Display Name</Label>
                  <Input 
                    className="rounded-xl border-slate-200 focus:ring-indigo-500"
                    value={tempProfile.displayName} 
                    onChange={e => setTempProfile({ ...tempProfile, displayName: e.target.value })}
                    placeholder="Enter your name"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <Label className="text-sm font-semibold text-slate-700">Bio (max 160 chars)</Label>
                    <p className="text-[10px] uppercase font-bold text-slate-400">{tempProfile.bio.length}/160</p>
                  </div>
                  <textarea 
                    className="w-full min-h-[100px] rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
                    value={tempProfile.bio}
                    onChange={e => setTempProfile({ ...tempProfile, bio: e.target.value.slice(0, 160) })}
                    placeholder="Tell your story..."
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Profile Photo URL</Label>
                  <Input 
                    className="rounded-xl border-slate-200 focus:ring-indigo-500"
                    value={tempProfile.photoURL} 
                    onChange={e => setTempProfile({ ...tempProfile, photoURL: e.target.value })}
                    placeholder="https://example.com/photo.jpg"
                  />
                  <p className="text-[10px] text-slate-400">Paste a URL for your profile picture (e.g. from Google or social media)</p>
                </div>

                  {/* AI Generator UI */}
                  <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100/50 space-y-3">
                    <p className="text-xs font-bold text-indigo-700 flex items-center gap-1.5 uppercase tracking-wider">
                      <Sparkles className="w-3 h-3" />
                      AI Bio Generator
                    </p>
                    <div className="flex gap-2">
                      <Input 
                        className="bg-white border-indigo-100 rounded-xl text-sm"
                        placeholder="e.g. A digital nomad who loves coffee..."
                        value={aiPrompt}
                        onChange={e => setAiPrompt(e.target.value)}
                      />
                      <Button 
                        size="sm" 
                        onClick={generateBio}
                        disabled={isGenerating || !aiPrompt}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm"
                      >
                        {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Generate"}
                      </Button>
                    </div>
                    <p className="text-[10px] text-slate-400">Describe yourself in a few words and AI will draft your bio.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Themes Section */}
            <Card className="border-none shadow-md rounded-3xl overflow-hidden bg-white">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                <CardTitle className="text-lg font-bold">Choose Theme</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {themes.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTempProfile({ ...tempProfile, theme: t.id })}
                      className={`group relative p-1 rounded-2xl border-2 transition-all ${
                        tempProfile.theme === t.id 
                          ? "border-indigo-600 scale-[1.02] shadow-sm" 
                          : "border-transparent hover:border-slate-200"
                      }`}
                    >
                      <div 
                        className="w-full h-16 rounded-xl border border-slate-100 mb-2" 
                        style={{ background: t.color }}
                      />
                      <span className="text-xs font-semibold text-slate-700">{t.name}</span>
                      {tempProfile.theme === t.id && (
                        <div className="absolute top-2 right-2 w-4 h-4 bg-indigo-600 rounded-full flex items-center justify-center">
                          <div className="w-1.5 h-1.5 bg-white rounded-full" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Links Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center px-1">
                <h2 className="text-lg font-bold">Your Links</h2>
                <Button onClick={addLink} variant="outline" size="sm" className="gap-2 border-indigo-200 text-indigo-600 hover:bg-indigo-50">
                  <Plus className="w-4 h-4" /> Add Link
                </Button>
              </div>

              <div className="space-y-4">
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={links.map(l => l.id)} strategy={verticalListSortingStrategy}>
                    {links.map((link) => (
                      <SortableLinkItem 
                        key={link.id} 
                        link={link} 
                        onUpdate={updateLink} 
                        onDelete={deleteLink} 
                      />
                    ))}
                  </SortableContext>
                </DndContext>
                {links.length === 0 && (
                  <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300">
                    <p className="text-slate-400">No links added overflow-y-auto. Click `{"Add Link"}` to begin.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Side: Phone Preview */}
          <div className="hidden lg:block sticky top-24 h-fit">
            <h2 className="text-lg font-bold mb-4 px-1">Live Preview</h2>
            <div className="relative mx-auto w-[320px] h-[640px] bg-slate-900 rounded-[3rem] p-4 shadow-2xl border-[8px] border-slate-800">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-6 bg-slate-800 rounded-b-2xl"></div>
              <div 
                className={`w-full h-full rounded-[2.2rem] overflow-hidden overflow-y-auto custom-scrollbar p-6 transition-colors duration-500 ${
                  tempProfile.theme === 'default-light' ? 'bg-slate-50' : ''
                }`}
                data-theme={tempProfile.theme}
              >
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-4 flex items-center justify-center border-4 border-white/50 shadow-md overflow-hidden">
                    {tempProfile.photoURL ? (
                      <img src={tempProfile.photoURL} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-2xl font-bold text-white">{tempProfile.displayName[0] || "U"}</div>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-foreground text-center">{tempProfile.displayName || "@"+profile.username}</h3>
                  <p className="text-foreground/70 text-sm text-center mt-1 mb-8">{tempProfile.bio || "Your bio will appear here"}</p>
                  
                  <div className="w-full space-y-3">
                    {links.filter(l => l.enabled).map(link => (
                      <div 
                        key={link.id} 
                        className="w-full p-4 bg-card text-card-foreground border border-border/50 rounded-xl shadow-sm text-center font-medium transition-all"
                      >
                        {link.title || "Untitled Link"}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function SortableLinkItem({ link, onUpdate, onDelete }: any) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: link.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 0,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden group">
      <div className="flex items-center">
        <div {...attributes} {...listeners} className="p-4 cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-600 transition-colors">
          <GripVertical className="w-5 h-5" />
        </div>
        
        <div className="flex-grow p-4 pl-0 space-y-4">
          <div className="flex gap-4">
            <div className="flex-grow space-y-1">
              <Label className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Title</Label>
              <Input 
                value={link.title} 
                onChange={e => onUpdate(link.id, "title", e.target.value)} 
                placeholder="Title"
                className="h-9 border-slate-100 bg-slate-50 focus:bg-white"
              />
            </div>
            <div className="flex-grow space-y-1">
              <Label className="text-[10px] uppercase tracking-wider font-bold text-slate-400">URL</Label>
              <div className="relative">
                <Input 
                  value={link.url} 
                  onChange={e => onUpdate(link.id, "url", e.target.value)} 
                  placeholder="URL"
                  className="h-9 pr-8 border-slate-100 bg-slate-50 focus:bg-white"
                />
                <ExternalLink className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-300" />
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 flex flex-col gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onDelete(link.id)}
            className="text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
