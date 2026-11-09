"use client";

import { useEffect, useRef } from "react";

// Short prompts that flash near the cursor as it moves, like the reference site.
const WORDS = [
  "Kinetic",
  "Dynamic Flow",
  "Momentum",
  "Fluid Motion",
  "Active Canvas",
  "Agile",
  "Shape Energy",
  "Elevate",
  "Creative Drive",
  "Catalyst",
  "Inspire",
  "Empower",
  "Dynamic Vision",
];

const GRID_GAP = 64; // px between grid points at rest — wide cells, fewer of them
const INFLUENCE = 500; // px radius the pointer warps — a wide lens, like the reference
const MAX_DISPLACE = 92; // px max a point is pushed outward at the centre
const EASE = 0.12; // how quickly points settle toward their target each frame
const WORD_DISTANCE = 55; // px the pointer must travel before a new word can appear
const WORD_COOLDOWN = 220; // ms minimum between words even if moving fast

type Point = { hx: number; hy: number; x: number; y: number };

// A wireframe grid, behind the hero text, that ripples away from the pointer
// and occasionally flashes a word near it. Canvas-drawn so it can run every
// frame without triggering React re-renders.
export function InteractiveGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wordRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wordEl = wordRef.current;
    const wrapper = canvas?.parentElement;
    const section = canvas?.closest("section");
    if (!canvas || !wordEl || !wrapper || !section) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let width = 0;
    let height = 0;
    let cols = 0;
    let rows = 0;
    let points: Point[] = [];

    const buildGrid = () => {
      const rect = wrapper.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      cols = Math.ceil(width / GRID_GAP) + 1;
      rows = Math.ceil(height / GRID_GAP) + 1;
      points = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const hx = c * GRID_GAP;
          const hy = r * GRID_GAP;
          points.push({ hx, hy, x: hx, y: hy });
        }
      }
    };

    const staticOnly = reduceMotion || !finePointer;

    buildGrid();
    // Resizing clears the canvas, so the static fallback has to redraw itself.
    const resizeObserver = new ResizeObserver(() => {
      buildGrid();
      if (staticOnly) paint();
    });
    resizeObserver.observe(wrapper);

    const pointer = { x: -9999, y: -9999, active: false };
    let lastWordAt = 0;
    let lastWordPos = { x: -9999, y: -9999 };
    let wordIndex = -1;
    let hideTimer: ReturnType<typeof setTimeout> | null = null;

    const maybeShowWord = (x: number, y: number, now: number) => {
      const travelled = Math.hypot(x - lastWordPos.x, y - lastWordPos.y);
      if (travelled < WORD_DISTANCE || now - lastWordAt < WORD_COOLDOWN) return;
      lastWordPos = { x, y };
      lastWordAt = now;

      let next = Math.floor(Math.random() * WORDS.length);
      if (next === wordIndex) next = (next + 1) % WORDS.length;
      wordIndex = next;

      wordEl.textContent = WORDS[next];
      wordEl.style.left = `${x}px`;
      wordEl.style.top = `${y - 36}px`;
      wordEl.style.opacity = "1";
      wordEl.style.transform = "translate(-50%, 0) scale(1)";

      if (hideTimer) clearTimeout(hideTimer);
      hideTimer = setTimeout(() => {
        wordEl.style.opacity = "0";
        wordEl.style.transform = "translate(-50%, 6px) scale(0.92)";
      }, 560);
    };

    const onMove = (e: PointerEvent) => {
      const rect = wrapper.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active = true;
      if (finePointer && !reduceMotion) maybeShowWord(pointer.x, pointer.y, performance.now());
    };
    const onLeave = () => {
      pointer.active = false;
      wordEl.style.opacity = "0";
    };

    section.addEventListener("pointermove", onMove);
    section.addEventListener("pointerleave", onLeave);

    // Squares plus both diagonals, so the mesh reads as a web rather than graph paper.
    const paint = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.lineWidth = 1;

      ctx.strokeStyle = "rgba(244, 244, 239, 0.22)";
      ctx.beginPath();
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const i = r * cols + c;
          const p = points[i];
          if (c < cols - 1) {
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(points[i + 1].x, points[i + 1].y);
          }
          if (r < rows - 1) {
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(points[i + cols].x, points[i + cols].y);
          }
        }
      }
      ctx.stroke();

      ctx.strokeStyle = "rgba(244, 244, 239, 0.17)";
      ctx.beginPath();
      for (let r = 0; r < rows - 1; r++) {
        for (let c = 0; c < cols - 1; c++) {
          const i = r * cols + c;
          const p = points[i];
          const right = points[i + 1];
          const down = points[i + cols];
          const diag = points[i + cols + 1];
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(diag.x, diag.y);
          ctx.moveTo(right.x, right.y);
          ctx.lineTo(down.x, down.y);
        }
      }
      ctx.stroke();
    };

    let raf = 0;
    const draw = () => {
      for (const p of points) {
        let tx = p.hx;
        let ty = p.hy;
        if (pointer.active) {
          const dx = p.hx - pointer.x;
          const dy = p.hy - pointer.y;
          const dist = Math.hypot(dx, dy);
          if (dist < INFLUENCE) {
            const falloff = 1 - dist / INFLUENCE;
            const push = falloff * falloff * MAX_DISPLACE;
            const angle = Math.atan2(dy, dx);
            tx += Math.cos(angle) * push;
            ty += Math.sin(angle) * push;
          }
        }
        p.x += (tx - p.x) * EASE;
        p.y += (ty - p.y) * EASE;
      }

      paint();
      raf = requestAnimationFrame(draw);
    };

    if (staticOnly) {
      // Draw one static frame instead of looping every frame.
      paint();
    } else {
      raf = requestAnimationFrame(draw);
    }

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerleave", onLeave);
      if (hideTimer) clearTimeout(hideTimer);
    };
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0">
      <canvas ref={canvasRef} aria-hidden />
      <span
        ref={wordRef}
        aria-hidden
        className="absolute z-10 font-mono text-xs font-semibold tracking-[0.3em] whitespace-nowrap text-paper uppercase opacity-0 transition-[opacity,transform] duration-150 ease-out"
      />
    </div>
  );
}
