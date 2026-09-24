import React, { useState } from "react";
import { Sparkles, Wand2 } from "lucide-react";
import { Badge, Button, Card, Field, PageHeader, PillTab, inputClass } from "../components/UI";
import { generateCaptions, generateIdeas, streamDelay } from "../lib/ai";
import { useStore } from "../lib/store";
import { cn } from "../lib/utils";

export function AiStudio() {
  const { voices } = useStore();
  const [tab, setTab] = useState("copilot");
  const [topic, setTopic] = useState("why brands should own their OAuth relationship");
  const [voice, setVoice] = useState(voices[0].id);
  const [out, setOut] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [ideas, setIdeas] = useState(generateIdeas("social systems"));
  const [agent, setAgent] = useState("Schedule three LinkedIn essays next week on the vault model, first-comment automation, and crisis pause. Best times. Send to approval.");

  function run() {
    const v = voices.find((x) => x.id === voice)?.name || "editorial-calm";
    const full = generateCaptions(topic, v.toLowerCase().includes("bold") ? "bold-founder" : "editorial-calm", 1)[0];
    setOut("");
    setStreaming(true);
    let i = 0;
    const tick = () => {
      i += 1;
      setOut(full.slice(0, i));
      if (i < full.length) setTimeout(tick, streamDelay() / 3);
      else setStreaming(false);
    };
    tick();
  }

  return (
    <div>
      <PageHeader
        kicker="AI Studio"
        title="A copilot that learned the house."
        subtitle="Brand-voice DNA, caption variants, idea radar, and MCP agents that can schedule from a sentence — not a generic GPT box."
        actions={
          <PillTab
            value={tab}
            onChange={setTab}
            items={[
              { id: "copilot", label: "Copilot" },
              { id: "ideas", label: "Idea radar" },
              { id: "agents", label: "MCP agents" },
              { id: "voices", label: "Brand voices" },
            ]}
          />
        }
      />

      {tab === "copilot" && (
        <div className="grid lg:grid-cols-[1fr_340px] gap-5">
          <Card>
            <Field label="Brief">
              <textarea className={cn(inputClass, "min-h-[100px]")} value={topic} onChange={(e) => setTopic(e.target.value)} />
            </Field>
            <div className="mt-4 flex flex-wrap gap-2">
              {voices.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setVoice(v.id)}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs font-medium",
                    voice === v.id ? "border-royal-600 bg-royal-50 text-royal-900" : "border-slate-200"
                  )}
                >
                  {v.name}
                </button>
              ))}
            </div>
            <Button className="mt-4" onClick={run} disabled={streaming}>
              <Wand2 size={14} /> {streaming ? "Writing" : "Generate"}
            </Button>
            <div className={cn("mt-5 rounded-2xl border border-slate-200 p-4 text-sm leading-relaxed whitespace-pre-wrap min-h-[200px]", streaming && "caret")}>
              {out || <span className="text-slate-400">Output lands here. Streaming, so you can feel the craft.</span>}
            </div>
          </Card>
          <div className="space-y-4">
            <Card>
              <div className="text-sm font-semibold">Guardrails</div>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                <li>No medical claims for Orbit without legal.</li>
                <li>Maison never speaks discounts.</li>
                <li>Northline: not investment advice.</li>
                <li>No competitor insults.</li>
              </ul>
            </Card>
            <Card>
              <div className="text-sm font-semibold">Models</div>
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between"><span>Copy</span><Badge tone="blue">GPT-4.1</Badge></div>
                <div className="flex justify-between"><span>Image</span><Badge>Flux / SD3</Badge></div>
                <div className="flex justify-between"><span>Clip</span><Badge>Velora Cut</Badge></div>
                <div className="flex justify-between"><span>Sentiment</span><Badge>In-vault</Badge></div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {tab === "ideas" && (
        <div>
          <div className="flex gap-2 mb-4">
            <input className={inputClass} defaultValue="social systems" onBlur={(e) => setIdeas(generateIdeas(e.target.value))} />
            <Button onClick={() => setIdeas(generateIdeas("social systems"))}><Sparkles size={14} /> Refresh</Button>
          </div>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {ideas.map((idea) => (
              <Card key={idea.title}>
                <Badge tone="blue">{idea.format}</Badge>
                <div className="mt-3 font-semibold">{idea.title}</div>
                <div className="mt-2 text-xs text-slate-500">Predicted score {idea.score}</div>
                <div className="mt-3 h-1.5 rounded-full bg-slate-100">
                  <div className="h-full bg-royal-600 rounded-full" style={{ width: `${idea.score}%` }} />
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {tab === "agents" && (
        <Card>
          <div className="text-sm font-semibold">Natural language scheduler · MCP</div>
          <p className="text-sm text-slate-500 mt-1">
            Agents call Velora tools: create_post, set_first_comment, assign_approver, respect_crisis_flag.
          </p>
          <textarea className={cn(inputClass, "mt-4 min-h-[120px]")} value={agent} onChange={(e) => setAgent(e.target.value)} />
          <div className="mt-4 rounded-2xl bg-slate-900 text-slate-100 p-4 font-mono text-xs leading-relaxed">
            <div className="text-emerald-300">✓ parsed intent · 3 posts · linkedin · next week</div>
            <div>→ best times WAT Tue 09:10, Wed 08:40, Thu 12:05</div>
            <div>→ first_comment auto from signature “Velora footer”</div>
            <div>→ status pending_approval · approver Søren Dahl</div>
            <div className="text-blue-300 mt-2">Ready to commit. Open composer to review.</div>
          </div>
        </Card>
      )}

      {tab === "voices" && (
        <div className="grid md:grid-cols-3 gap-4">
          {voices.map((v) => (
            <Card key={v.id}>
              <div className="text-lg font-semibold">{v.name}</div>
              <p className="text-sm text-slate-500 mt-2">{v.tone}</p>
              <div className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-400">Do</div>
              <ul className="text-sm mt-1 space-y-1">{v.doList.map((d) => <li key={d}>· {d}</li>)}</ul>
              <div className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-400">Don't</div>
              <ul className="text-sm mt-1 space-y-1">{v.dontList.map((d) => <li key={d}>· {d}</li>)}</ul>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
