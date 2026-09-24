import React, { useState } from "react";
import { useStore } from "../lib/store";
import { Button, Card, Field, PageHeader, Toggle, inputClass } from "../components/UI";
import { fmt } from "../lib/utils";

export function LinkInBio() {
  const { bioLinks, toggleBio, addBio, workspace } = useStore();
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  return (
    <div>
      <PageHeader
        kicker="Link in bio"
        title="A door that is actually yours."
        subtitle="Hosted mini-page with UTM, click tracking, and a short domain. No third-party bio tool."
      />
      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        <div className="space-y-3">
          {bioLinks.map((b) => (
            <Card key={b.id} className="flex items-center gap-3">
              <div className="flex-1">
                <div className="font-semibold">{b.title}</div>
                <div className="text-xs text-slate-500 font-mono">{b.url}</div>
              </div>
              <div className="text-xs text-slate-500">{fmt(b.clicks)} clicks</div>
              <Toggle on={b.active} onChange={() => toggleBio(b.id)} />
            </Card>
          ))}
          <Card>
            <div className="text-sm font-semibold mb-3">Add link</div>
            <div className="grid sm:grid-cols-2 gap-3">
              <Field label="Title"><input className={inputClass} value={title} onChange={(e) => setTitle(e.target.value)} /></Field>
              <Field label="URL"><input className={inputClass} value={url} onChange={(e) => setUrl(e.target.value)} /></Field>
            </div>
            <Button
              className="mt-3"
              size="sm"
              onClick={() => {
                if (!title || !url) return;
                addBio({ title, url, active: true });
                setTitle("");
                setUrl("");
              }}
            >
              Add
            </Button>
          </Card>
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">Public preview</div>
          <div className="phone-frame rounded-[40px] p-3 mx-auto w-[280px]">
            <div className="rounded-[32px] bg-white h-[520px] p-5 text-center">
              <div className="mx-auto h-16 w-16 rounded-full bg-royal-800 text-white grid place-items-center font-serif text-2xl">V</div>
              <div className="mt-3 font-semibold">{workspace.name}</div>
              <div className="text-xs text-slate-500">The social operating system</div>
              <div className="mt-6 space-y-2">
                {bioLinks.filter((b) => b.active).map((b) => (
                  <div key={b.id} className="rounded-xl border border-slate-200 py-3 text-sm font-medium">
                    {b.title}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
