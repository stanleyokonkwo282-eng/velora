import React, { useState } from "react";
import { Clapperboard, Scissors } from "lucide-react";
import { Button, Card, Field, PageHeader, inputClass } from "../components/UI";
import { clipPlan } from "../lib/ai";

export function VideoLab() {
  const [file, setFile] = useState("atelier-runway-master.mov");
  const [clips, setClips] = useState(clipPlan("atelier-runway-master.mov"));

  return (
    <div>
      <PageHeader
        kicker="Video lab"
        title="Long master in. Native shorts out."
        subtitle="Auto-detect hooks, faces, and silence. Crop to 9:16 for TikTok, Reels, and Shorts. Captions burned in your brand type."
      />
      <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-5">
        <Card>
          <div className="aspect-video rounded-2xl bg-gradient-to-br from-slate-900 to-royal-900 relative overflow-hidden">
            <div className="absolute inset-0 grid place-items-center text-white">
              <div className="text-center">
                <Clapperboard className="mx-auto mb-2" />
                <div className="text-sm font-medium">{file}</div>
                <div className="text-xs text-blue-100/70 mt-1">4:02 · 4K · 24fps</div>
              </div>
            </div>
            <div className="absolute bottom-4 left-4 right-4 h-1.5 rounded-full bg-white/20">
              <div className="h-full w-1/3 bg-white rounded-full" />
            </div>
          </div>
          <div className="mt-4 grid sm:grid-cols-2 gap-3">
            <Field label="Source">
              <input className={inputClass} value={file} onChange={(e) => setFile(e.target.value)} />
            </Field>
            <Field label="Target">
              <select className={inputClass} defaultValue="9:16">
                <option>9:16 · TikTok / Reels / Shorts</option>
                <option>1:1 · Feed</option>
                <option>16:9 · YouTube</option>
              </select>
            </Field>
          </div>
          <Button className="mt-4" onClick={() => setClips(clipPlan(file))}>
            <Scissors size={14} /> Recut 9:16
          </Button>
        </Card>
        <div className="space-y-3">
          {clips.map((c) => (
            <Card key={c.id} className="flex gap-3 items-center">
              <div className="h-16 w-12 rounded-lg bg-gradient-to-b from-royal-700 to-slate-900" />
              <div className="flex-1">
                <div className="text-sm font-semibold">{c.label}</div>
                <div className="text-xs text-slate-500">{c.t} · {c.crop}</div>
              </div>
              <Button size="sm" variant="secondary">Export</Button>
            </Card>
          ))}
          <Card>
            <div className="text-sm font-semibold">Burn-in captions</div>
            <p className="text-xs text-slate-500 mt-1">Inter, weight 600, royal underline on keywords. Safe zone respected.</p>
            <div className="mt-3 rounded-xl bg-slate-900 text-white p-3 text-sm text-center">
              Quiet luxury is a <span className="underline decoration-royal-400">supply chain</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
