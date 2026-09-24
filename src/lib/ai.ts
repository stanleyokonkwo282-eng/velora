const HOOKS = [
  "Most teams schedule content. The ones who win design systems.",
  "If your social calendar still lives in a spreadsheet, this is your sign.",
  "A quiet launch beats a loud apology. Here's the operating rhythm we use.",
  "Your next 30 days of content, without the Sunday-night scramble.",
  "Stop posting. Start publishing with intent.",
];

const BODIES = [
  "We rebuilt our entire social stack around three rituals: a Monday war-room, a mid-week creative sprint, and a Friday teardown. Velocity went up. Chaos went down.",
  "Brand voice is not a tone slider. It is a set of promises you keep in public — what you will say, what you will never say, and the proof you bring every time.",
  "Cross-posting is not copy-paste. Each network has a native dialect. Velora writes the system of record once, then composes the dialect for every surface.",
  "The first 12 minutes after publish decide the next 12 hours. Auto-thread the link, spark internal plugs, and let global plugs fire when the room is warm.",
  "Evergreen is not lazy. It is compounding. Recycle the 8% of posts that still earn, and retire the rest with dignity.",
];

const CTAS = [
  "Save this for your next planning session.",
  "Want the template? Comment 'SYSTEM' and we'll send the brief.",
  "Follow for the operating system behind calm brands.",
  "Book a 12-minute teardown with our studio.",
  "Steal the calendar. Make it yours.",
];

const HASHTAGS: Record<string, string[]> = {
  default: ["#BrandStrategy", "#SocialOps", "#ContentStudio"],
  linkedin: ["#Leadership", "#GoToMarket", "#B2B"],
  instagram: ["#BehindTheBrand", "#CreativeDirection", "#Atelier"],
  x: ["#buildinpublic", "#saas"],
  tiktok: ["#marketingtok", "#techtok"],
};

export function generateCaptions(topic: string, voice = "editorial-calm", n = 3) {
  const t = topic.trim() || "the craft of consistent publishing";
  return Array.from({ length: n }, (_, i) => {
    const hook = HOOKS[(i + t.length) % HOOKS.length];
    const body = BODIES[(i + 2) % BODIES.length];
    const cta = CTAS[(i + 1) % CTAS.length];
    const voiceLine =
      voice === "bold-founder"
        ? "No fluff. Ship the idea. Measure the room. Repeat."
        : voice === "playful"
        ? "Yes, we made a spreadsheet cry. No, we don't miss it."
        : "Quiet confidence. Precise language. Proof over posture.";
    return `${hook}\n\n${t[0].toUpperCase() + t.slice(1)} — ${body}\n\n${voiceLine}\n\n${cta}`;
  });
}

export function generateIdeas(pillar: string) {
  const p = pillar || "product craft";
  return [
    { title: `A 7-slide teardown of ${p}`, format: "Carousel", score: 86 },
    { title: `Founder note: the unpopular truth about ${p}`, format: "LinkedIn essay", score: 91 },
    { title: `9:16: 12 seconds, one promise, one proof`, format: "Short", score: 88 },
    { title: `Myth vs. mechanic in ${p}`, format: "Thread", score: 79 },
    { title: `Client war-room recap (sanitized)`, format: "Reel + caption", score: 83 },
    { title: `Before / after of a calendar that actually ships`, format: "Static + story", score: 76 },
  ];
}

export function generateFirstComment(url: string) {
  const link = url || "https://velora.io/brief";
  return `Context, sources, and the full brief live here — ${link}\n\nIf you're a client of the studio, the white-label room is already updated.`;
}

export function clipPlan(filename: string) {
  return [
    { t: "0:00–0:03", label: "Hook freeze-frame", crop: "9:16 face-forward" },
    { t: "0:03–0:09", label: "Problem in one sentence", crop: "9:16" },
    { t: "0:09–0:18", label: "Proof / product motion", crop: "9:16 center" },
    { t: "0:18–0:24", label: "CTA + brand endcard", crop: "9:16" },
  ].map((row, i) => ({ id: i + 1, file: filename, ...row }));
}

export function streamDelay() {
  return 16 + Math.floor(Math.random() * 18);
}
