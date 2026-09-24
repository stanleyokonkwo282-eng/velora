import React, { useState } from "react";
import { Crop, ImagePlus, SlidersHorizontal } from "lucide-react";
import { useStore } from "../lib/store";
import { Badge, Button, Card, PageHeader, PillTab } from "../components/UI";
import { cn } from "../lib/utils";

export function MediaPage() {
  const { media, addMedia } = useStore();
  const [sel, setSel] = useState(media[0]?.id);
  const [tab, setTab] = useState("library");
  const [bright, setBright] = useState(100);
  const [sat, setSat] = useState(100);
  const [zoom, setZoom] = useState(1);
  const asset = media.find((m) => m.id === sel);

  return (
    <div>
      <PageHeader
        kicker="Media"
        title="A DAM beside the composer."
        subtitle="Tag, crop, resize, and grade stills without a round-trip to Canva. Ratios for feed, story, and 9:16."
        actions={
          <>
            <PillTab
              value={tab}
              onChange={setTab}
              items={[
                { id: "library", label: "Library" },
                { id: "editor", label: "Visual editor" },
              ]}
            />
            <Button
              variant="secondary"
              onClick={() =>
                addMedia({
                  kind: "image",
                  title: "Untitled still",
                  color: "linear-gradient(135deg,#1E40AF,#93C5FD)",
                  ratio: "1:1",
                  tags: ["new"],
                })
              }
            >
              <ImagePlus size={14} /> Import
            </Button>
          </>
        }
      />
      {tab === "library" ? (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {media.map((m) => (
            <button key={m.id} onClick={() => { setSel(m.id); setTab("editor"); }} className="text-left">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden border border-slate-200">
                <div className="h-full w-full" style={{ background: m.color }} />
              </div>
              <div className="mt-2 text-sm font-medium">{m.title}</div>
              <div className="flex gap-1 mt-1">
                <Badge>{m.kind}</Badge>
                <Badge tone="blue">{m.ratio}</Badge>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="grid lg:grid-cols-[1fr_300px] gap-5">
          <Card className="grid place-items-center min-h-[480px] bg-slate-100">
            <div
              className="w-[280px] aspect-[9/16] rounded-2xl shadow-lift overflow-hidden"
              style={{
                background: asset?.color,
                filter: `brightness(${bright}%) saturate(${sat}%)`,
                transform: `scale(${zoom})`,
              }}
            />
          </Card>
          <Card>
            <div className="text-sm font-semibold flex items-center gap-2">
              <SlidersHorizontal size={14} /> Grade
            </div>
            <label className="block mt-4 text-xs font-medium text-slate-500">Brightness {bright}%</label>
            <input type="range" min={70} max={140} value={bright} onChange={(e) => setBright(+e.target.value)} className="w-full" />
            <label className="block mt-4 text-xs font-medium text-slate-500">Saturation {sat}%</label>
            <input type="range" min={40} max={160} value={sat} onChange={(e) => setSat(+e.target.value)} className="w-full" />
            <label className="block mt-4 text-xs font-medium text-slate-500">Zoom {zoom.toFixed(2)}</label>
            <input type="range" min={1} max={1.6} step={0.02} value={zoom} onChange={(e) => setZoom(+e.target.value)} className="w-full" />
            <div className="mt-6 text-sm font-semibold flex items-center gap-2">
              <Crop size={14} /> Canvas
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {["1:1", "4:5", "9:16", "16:9"].map((r) => (
                <span key={r} className={cn("rounded-lg border px-2 py-1 text-xs", r === "9:16" ? "border-royal-600 bg-royal-50" : "border-slate-200")}>
                  {r}
                </span>
              ))}
            </div>
            <Button className="w-full mt-6">Save version</Button>
          </Card>
        </div>
      )}
    </div>
  );
}
