import React, { useState } from "react";
import { useStore } from "../lib/store";
import { Badge, Button, Card, Field, Modal, PageHeader, Toggle, inputClass } from "../components/UI";

export function PlugsPage() {
  const { plugs, togglePlug, addPlug } = useStore();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [trigger, setTrigger] = useState("");
  const [action, setAction] = useState("");
  const [kind, setKind] = useState<"internal" | "global">("internal");

  return (
    <div>
      <PageHeader
        kicker="Plugs"
        title="Momentum, on purpose."
        subtitle="Internal plugs use your own accounts to warm a post. Global plugs fire when the room is already moving — likes, comments, sentiment."
        actions={<Button onClick={() => setOpen(true)}>New plug</Button>}
      />
      <div className="grid md:grid-cols-2 gap-4">
        {plugs.map((p) => (
          <Card key={p.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <div className="font-semibold">{p.name}</div>
                  <Badge tone={p.kind === "internal" ? "blue" : "violet"}>{p.kind}</Badge>
                </div>
                <div className="text-sm text-slate-500 mt-2"><span className="font-medium text-slate-700">When </span>{p.trigger}</div>
                <div className="text-sm text-slate-500 mt-1"><span className="font-medium text-slate-700">Then </span>{p.action}</div>
              </div>
              <Toggle on={p.enabled} onChange={() => togglePlug(p.id)} />
            </div>
            <div className="mt-4 text-xs text-slate-400">Fired {p.fires} times</div>
          </Card>
        ))}
      </div>
      <Modal open={open} onClose={() => setOpen(false)} title="Create a plug">
        <div className="space-y-3">
          <Field label="Name"><input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} /></Field>
          <Field label="Kind">
            <select className={inputClass} value={kind} onChange={(e) => setKind(e.target.value as "internal" | "global")}>
              <option value="internal">Internal · other connected accounts</option>
              <option value="global">Global · metric trigger</option>
            </select>
          </Field>
          <Field label="Trigger"><input className={inputClass} value={trigger} onChange={(e) => setTrigger(e.target.value)} placeholder="On publish / 100 likes / sentiment" /></Field>
          <Field label="Action"><input className={inputClass} value={action} onChange={(e) => setAction(e.target.value)} /></Field>
          <Button
            className="w-full"
            onClick={() => {
              if (!name) return;
              addPlug({ name, kind, trigger, action, enabled: true });
              setOpen(false);
              setName("");
            }}
          >
            Save plug
          </Button>
        </div>
      </Modal>
    </div>
  );
}
