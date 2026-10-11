import * as THREE from "three";
import type { Project } from "./projects";

function rng(seed: number) {
  let value = seed >>> 0;
  return () => {
    value = (1664525 * value + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

function radial(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  color: string,
  alpha = 0.75,
) {
  const gradient = ctx.createRadialGradient(x, y, 0, x, y, r);
  gradient.addColorStop(0, color);
  gradient.addColorStop(1, "transparent");
  ctx.globalAlpha = alpha;
  ctx.fillStyle = gradient;
  ctx.fillRect(x - r, y - r, r * 2, r * 2);
  ctx.globalAlpha = 1;
}

function drawOrbit(ctx: CanvasRenderingContext2D, w: number, h: number, color: string) {
  ctx.save();
  ctx.translate(w * 0.51, h * 0.47);
  ctx.rotate(-0.55);
  for (let i = 0; i < 29; i++) {
    ctx.beginPath();
    ctx.ellipse(0, 0, 124 + i * 8.5, 53 + i * 3.3, i * 0.004, 0, Math.PI * 2);
    ctx.strokeStyle = color;
    ctx.globalAlpha = 0.17 * (1 - i / 40);
    ctx.lineWidth = i % 7 === 0 ? 3 : 1;
    ctx.stroke();
  }
  ctx.restore();
  ctx.globalAlpha = 1;
}

function drawArt(ctx: CanvasRenderingContext2D, p: Project, w: number, h: number) {
  const random = rng(p.number.charCodeAt(1) * 1231 + 17);
  const [dark, mid, light] = p.colors;
  const bg = ctx.createLinearGradient(0, 0, w, h);
  bg.addColorStop(0, dark);
  bg.addColorStop(0.55, mid);
  bg.addColorStop(1, dark);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  radial(ctx, w * 0.62, h * 0.4, 490, mid, 0.72);
  radial(ctx, w * 0.23, h * 0.73, 410, light, 0.35);

  if (p.artwork === "solar" || p.artwork === "portal") {
    radial(ctx, w * 0.55, h * 0.41, 300, light, 0.94);
    radial(ctx, w * 0.55, h * 0.41, 160, "#fff4bd", 0.8);
    drawOrbit(ctx, w, h, light);
    for (let i = 0; i < 16; i++) {
      ctx.strokeStyle = i % 2 ? light : "#ffe5ac";
      ctx.globalAlpha = 0.14;
      ctx.lineWidth = 1 + (i % 3);
      ctx.beginPath();
      ctx.ellipse(w * 0.56, h * 0.44, 90 + i * 22, 90 + i * 18, -0.1, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
  if (p.artwork === "aurora" || p.artwork === "liquid") {
    for (let k = 0; k < 38; k++) {
      ctx.beginPath();
      const y = h * 0.46 + (k - 19) * 9;
      ctx.moveTo(-120, y - 80);
      ctx.bezierCurveTo(w * 0.31, y - 190, w * 0.6, y + 200, w + 100, y - 50);
      ctx.strokeStyle = k % 3 === 0 ? light : "#f9caee";
      ctx.globalAlpha = 0.04 + (k % 7) * 0.014;
      ctx.lineWidth = 9 + (k % 4) * 3;
      ctx.stroke();
    }
    radial(ctx, w * 0.72, h * 0.27, 310, "#ffd0ff", 0.45);
  }
  if (p.artwork === "flora") {
    for (let i = 0; i < 22; i++) {
      const x = w * (0.26 + random() * 0.55);
      const y = h * (0.1 + random() * 0.8);
      const r = 70 + random() * 230;
      radial(ctx, x, y, r, i % 2 ? light : "#d8db56", 0.2);
    }
    drawOrbit(ctx, w, h, light);
  }
  if (p.artwork === "chrome") {
    for (let i = 0; i < 26; i++) {
      ctx.beginPath();
      ctx.ellipse(w * 0.55, h * 0.43, 45 + i * 13, 160 + i * 5, -0.55, 0, Math.PI * 2);
      ctx.strokeStyle = i % 3 ? light : "#fff6e5";
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.17;
      ctx.stroke();
    }
  }
  ctx.globalAlpha = 1;

  // Chispas y materia: detalles generativos deterministas.
  for (let i = 0; i < 920; i++) {
    const x = random() * w;
    const y = random() * h;
    const radius = random() * 2.8;
    ctx.globalAlpha = (0.1 + random() * 0.64) * (y < h * 0.72 ? 0.7 : 1);
    ctx.fillStyle = random() > 0.58 ? light : "#ffffff";
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // Velo editorial para mejorar la legibilidad de la tipografía.
  const shade = ctx.createLinearGradient(0, 0, 0, h);
  shade.addColorStop(0, "rgba(5,5,10,.54)");
  shade.addColorStop(0.37, "rgba(5,5,10,.02)");
  shade.addColorStop(0.65, "rgba(5,5,10,.18)");
  shade.addColorStop(1, "rgba(5,5,10,.72)");
  ctx.fillStyle = shade;
  ctx.fillRect(0, 0, w, h);
}

export function createProjectTexture(project: Project): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  const w = 1024;
  const h = 720;
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No se pudo crear la textura Canvas2D.");

  ctx.beginPath();
  ctx.roundRect(2, 2, w - 4, h - 4, 34);
  ctx.clip();
  drawArt(ctx, project, w, h);

  ctx.font = "500 21px Arial, sans-serif";
  ctx.textAlign = "left";
  ctx.fillStyle = "rgba(255,255,255,.83)";
  ctx.fillText("AETHER® / ORIGINAL CONCEPT", 54, 66);
  ctx.textAlign = "right";
  ctx.fillText(project.number + " — 06", w - 54, 66);

  ctx.textAlign = "center";
  const maxFont = project.title.length > 12 ? 69 : 87;
  ctx.font = `300 ${maxFont}px Arial, sans-serif`;
  ctx.shadowColor = "rgba(0,0,0,.32)";
  ctx.shadowBlur = 16;
  ctx.fillStyle = "#fff9f2";
  ctx.fillText(project.title, w / 2, h * 0.58, w - 80);
  ctx.shadowBlur = 0;
  ctx.font = "500 17px Arial, sans-serif";
  ctx.fillStyle = "rgba(255,255,255,.87)";
  ctx.fillText(project.kicker, w / 2, h * 0.66, w - 80);

  ctx.beginPath();
  ctx.moveTo(50, h - 69);
  ctx.lineTo(w - 50, h - 69);
  ctx.strokeStyle = "rgba(255,255,255,.35)";
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.font = "18px Arial, sans-serif";
  ctx.textAlign = "left";
  ctx.fillStyle = "rgba(255,255,255,.78)";
  ctx.fillText(project.category, 56, h - 35);
  ctx.textAlign = "right";
  ctx.fillText(project.year, w - 56, h - 35);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  texture.needsUpdate = true;
  return texture;
}
