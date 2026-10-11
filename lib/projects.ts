export type Artwork = "solar" | "aurora" | "flora" | "chrome" | "liquid" | "portal";

export type Project = {
  id: string;
  number: string;
  title: string;
  kicker: string;
  category: string;
  year: string;
  description: string;
  story: string;
  colors: [string, string, string];
  accent: string;
  artwork: Artwork;
};

// Todos los proyectos son conceptos originales; no representan clientes reales.
export const projects: Project[] = [
  {
    id: "afterglow",
    number: "01",
    title: "AFTERGLOW",
    kicker: "THE LIGHT WE LEAVE BEHIND",
    category: "IMMERSIVE EXPERIENCE",
    year: "2026",
    description: "An impossible sunset, suspended between matter and memory.",
    story: "Afterglow imagines a place where the final minutes of sunlight become an entire universe. A study in warmth, motion and the memories we carry.",
    colors: ["#2b0a19", "#ff643d", "#ffb566"],
    accent: "#ff956f",
    artwork: "solar",
  },
  {
    id: "paradise",
    number: "02",
    title: "PARADISE FOUND",
    kicker: "A WORLD OUTSIDE THE KNOWN",
    category: "DIGITAL WORLDBUILDING",
    year: "2026",
    description: "A dreamlike environment where color has a gravity of its own.",
    story: "Paradise Found explores the meeting point between natural forms and synthetic imagination, creating a place that could exist only in the browser.",
    colors: ["#1d1c42", "#ad6bea", "#89eadb"],
    accent: "#d7b0ff",
    artwork: "aurora",
  },
  {
    id: "wild",
    number: "03",
    title: "NEW HORIZONS",
    kicker: "BEYOND THE EDGE OF NATURE",
    category: "ART DIRECTION / WEBGL",
    year: "2025",
    description: "Organic landscapes reinvented as living digital matter.",
    story: "New Horizons reinterprets familiar natural patterns as an evolving living system, blending fluid movement with bold experimental color.",
    colors: ["#10271e", "#a6c44a", "#57dfbf"],
    accent: "#d5f181",
    artwork: "flora",
  },
  {
    id: "echo",
    number: "04",
    title: "ECHO CHAMBER",
    kicker: "SOUND MADE VISIBLE",
    category: "INTERACTIVE INSTALLATION",
    year: "2025",
    description: "An architecture of ripples, reflections and synthetic light.",
    story: "Echo Chamber turns invisible signals into sculptural form. Every ring, echo and reflected surface suggests a different route through the same space.",
    colors: ["#101c28", "#6c94ad", "#e2bf9e"],
    accent: "#bbdce9",
    artwork: "chrome",
  },
  {
    id: "chromatic",
    number: "05",
    title: "CHROMATIC STATE",
    kicker: "FEEL EVERYTHING AT ONCE",
    category: "EXPERIMENTAL INTERFACE",
    year: "2025",
    description: "A kinetic composition of color, surface and movement.",
    story: "Chromatic State experiments with a fluid canvas that never quite settles. Its visual language changes continuously between soft transparency and bright contrast.",
    colors: ["#261033", "#e75c9f", "#6be4cc"],
    accent: "#ffa9e6",
    artwork: "liquid",
  },
  {
    id: "elsewhere",
    number: "06",
    title: "ELSEWHERE",
    kicker: "ENTER THE UNKNOWN",
    category: "3D ART / CREATIVE CODE",
    year: "2026",
    description: "A luminous threshold between the real and the imagined.",
    story: "Elsewhere is a speculative digital monument made of light and shadow. An exploration of scale, mystery and the power of a single architectural gesture.",
    colors: ["#221512", "#bd7852", "#f4d5a0"],
    accent: "#efbf83",
    artwork: "portal",
  },
];
