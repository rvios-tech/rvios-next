"use client";
/* Motion & interaction utilities (GSAP + vanilla), all returning cleanups so they are safe in React effects. */
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { clamp, lerp, reduceMotion, finePointer } from "./u";
import { getLenis } from "./lenis";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);
export { gsap, ScrollTrigger };

/** Wrap each word in a mask so it can slide up — word level keeps Arabic letter shaping intact. */
export function splitWords(el: HTMLElement) {
  if (el.dataset.splitDone) return;
  const walk = (node: Node) => {
    Array.from(node.childNodes).forEach((n) => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        (n.textContent || "").split(/(\s+)/).forEach((p) => {
          if (!p) return;
          if (/^\s+$/.test(p)) frag.appendChild(document.createTextNode(p));
          else { const w = document.createElement("span"); w.className = "wm"; const i = document.createElement("span"); i.className = "wi"; i.textContent = p; w.appendChild(i); frag.appendChild(w); }
        });
        n.parentNode?.replaceChild(frag, n);
      } else if (n.nodeType === 1 && !(n as HTMLElement).classList.contains("wm")) walk(n);
    });
  };
  walk(el);
  el.querySelectorAll<HTMLElement>(".wi").forEach((w, i) => w.style.setProperty("--i", String(i)));
  el.dataset.splitDone = "1";
}

/** Reveal-on-scroll for [data-split] [data-reveal] [data-clip], parallax [data-speed], counters [data-count]. */
export function initReveals(root: HTMLElement | Document = document, lang: "ar" | "en" = "ar") {
  root.querySelectorAll<HTMLElement>("[data-split]").forEach(splitWords);
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
  root.querySelectorAll("[data-split],[data-reveal],[data-clip]").forEach((el) => io.observe(el));
  const tweens: (gsap.core.Tween | ScrollTrigger)[] = [];
  root.querySelectorAll<HTMLElement>("[data-speed]").forEach((el) => {
    const s = Number(el.dataset.speed);
    tweens.push(gsap.fromTo(el, { yPercent: -s * 10 }, { yPercent: s * 10, ease: "none", scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true } }));
  });
  root.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
    const to = Number(el.dataset.count), ar = lang === "ar" && !el.closest(".ya");
    tweens.push(ScrollTrigger.create({ trigger: el, start: "top 90%", once: true, onEnter: () => { const o = { v: 0 }; gsap.to(o, { v: to, duration: 1.6, ease: "power3.out", onUpdate: () => { el.textContent = Math.round(o.v).toLocaleString(ar ? "ar-EG" : "en-US"); } }); } }));
  });
  return () => { io.disconnect(); tweens.forEach((t) => t.kill()); };
}

/** Magnetic buttons, 3D tilt cards and cursor spotlights. */
export function initInteractions(root: HTMLElement | Document = document) {
  const offs: (() => void)[] = [];
  const on = <K extends keyof HTMLElementEventMap>(el: HTMLElement, ev: K, fn: (e: HTMLElementEventMap[K]) => void) => { el.addEventListener(ev, fn); offs.push(() => el.removeEventListener(ev, fn)); };
  root.querySelectorAll<HTMLElement>(".mag").forEach((b) => {
    on(b, "pointermove", (e) => { if (e.pointerType !== "mouse") return; const r = b.getBoundingClientRect(); gsap.to(b, { x: (e.clientX - r.left - r.width / 2) * 0.3, y: (e.clientY - r.top - r.height / 2) * 0.4, duration: 0.5, ease: "power3.out" }); });
    on(b, "pointerleave", () => gsap.to(b, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1,.4)" }));
  });
  root.querySelectorAll<HTMLElement>("[data-tilt]").forEach((c) => {
    const amt = Number(c.dataset.tilt) || 8;
    on(c, "pointermove", (e) => { if (e.pointerType !== "mouse") return; const r = c.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5; gsap.to(c, { rotateY: x * amt, rotateX: -y * amt, transformPerspective: 900, duration: 0.6, ease: "power3.out" }); });
    on(c, "pointerleave", () => gsap.to(c, { rotateX: 0, rotateY: 0, duration: 0.9, ease: "power3.out" }));
  });
  root.querySelectorAll<HTMLElement>("[data-spot]").forEach((c) => on(c, "pointermove", (e) => { const r = c.getBoundingClientRect(); c.style.setProperty("--mx", e.clientX - r.left + "px"); c.style.setProperty("--my", e.clientY - r.top + "px"); }));
  return () => offs.forEach((f) => f());
}

/** Infinite marquee whose speed and direction react to scroll velocity. */
export function marquee(el: HTMLElement, speed = 0.05, dir = 1) {
  let x = 0, vel = 0, sign = 1, last = performance.now(), raf = 0;
  const lenis = getLenis();
  const onScroll = (e: { velocity: number }) => { vel = e.velocity; if (Math.abs(vel) > 0.2) sign = vel > 0 ? 1 : -1; };
  lenis?.on("scroll", onScroll);
  const tick = (now: number) => {
    const dt = Math.min(48, now - last); last = now;
    const half = el.scrollWidth / 2;
    if (half && !reduceMotion()) { x -= dir * sign * (speed + Math.min(Math.abs(vel), 40) * 0.012) * dt; if (x <= -half) x += half; if (x > 0) x -= half; el.style.transform = `translate3d(${x}px,0,0)`; }
    vel *= 0.92; raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
  return () => { cancelAnimationFrame(raf); lenis?.off("scroll", onScroll); };
}

export const GLSL_NOISE = `vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}vec2 mod289(vec2 x){return x-floor(x*(1./289.))*289.;}vec3 permute(vec3 x){return mod289(((x*34.)+1.)*x);}
float snoise(vec2 v){const vec4 C=vec4(.211324865405187,.366025403784439,-.577350269189626,.024390243902439);vec2 i=floor(v+dot(v,C.yy));vec2 x0=v-i+dot(i,C.xx);vec2 i1=(x0.x>x0.y)?vec2(1.,0.):vec2(0.,1.);vec4 x12=x0.xyxy+C.xxzz;x12.xy-=i1;i=mod289(i);vec3 p=permute(permute(i.y+vec3(0.,i1.y,1.))+i.x+vec3(0.,i1.x,1.));vec3 m=max(.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.);m=m*m;m=m*m;vec3 x=2.*fract(p*C.www)-1.;vec3 h=abs(x)-.5;vec3 ox=floor(x+.5);vec3 a0=x-ox;m*=1.79284291400159-.85373472095314*(a0*a0+h*h);vec3 g;g.x=a0.x*x0.x+h.x*x0.y;g.yz=a0.yz*x12.xz+h.yz*x12.yw;return 130.*dot(m,g);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*snoise(p);p*=2.02;a*=.5;}return v;}`;

export type ShaderState = { colors: string[] };
/** Fullscreen fragment-shader canvas. Uniforms: t (time), r (resolution), m (mouse 0..1), c1..c3 (palette). */
export function shader(canvas: HTMLCanvasElement, frag: string, opts: { colors: string[]; scale?: number }) {
  const gl = canvas.getContext("webgl", { premultipliedAlpha: false, antialias: false });
  const st: ShaderState = { colors: opts.colors };
  if (!gl) return { st, destroy: () => {} };
  const mk = (t: number, s: string) => { const sh = gl.createShader(t)!; gl.shaderSource(sh, s); gl.compileShader(sh); return sh; };
  const pr = gl.createProgram()!;
  gl.attachShader(pr, mk(gl.VERTEX_SHADER, "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}"));
  gl.attachShader(pr, mk(gl.FRAGMENT_SHADER, "precision highp float;uniform float t;uniform vec2 r;uniform vec2 m;uniform vec3 c1;uniform vec3 c2;uniform vec3 c3;" + frag));
  gl.linkProgram(pr); gl.useProgram(pr);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(pr, "p"); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const u = (n: string) => gl.getUniformLocation(pr, n);
  const UN = { t: u("t"), r: u("r"), m: u("m"), c1: u("c1"), c2: u("c2"), c3: u("c3") };
  const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
  const dpr = Math.min(1.5, window.devicePixelRatio || 1) * (opts.scale ?? 0.6);
  let mx = 0.5, my = 0.5, tmx = 0.5, tmy = 0.5, vis = true, raf = 0;
  const resize = () => { canvas.width = canvas.clientWidth * dpr; canvas.height = canvas.clientHeight * dpr; gl.viewport(0, 0, canvas.width, canvas.height); };
  const move = (e: PointerEvent) => { const r = canvas.getBoundingClientRect(); tmx = (e.clientX - r.left) / r.width; tmy = 1 - (e.clientY - r.top) / r.height; };
  resize(); window.addEventListener("resize", resize); window.addEventListener("pointermove", move);
  const io = new IntersectionObserver((es) => (vis = es[0].isIntersecting)); io.observe(canvas);
  const t0 = performance.now();
  const f = (now: number) => {
    if (vis) {
      mx = lerp(mx, tmx, 0.05); my = lerp(my, tmy, 0.05);
      gl.uniform1f(UN.t, reduceMotion() ? 3 : (now - t0) / 1000); gl.uniform2f(UN.r, canvas.width, canvas.height); gl.uniform2f(UN.m, mx, my);
      const [a, b, c] = st.colors.map(hex); gl.uniform3fv(UN.c1, a); gl.uniform3fv(UN.c2, b); gl.uniform3fv(UN.c3, c);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
    raf = requestAnimationFrame(f);
  };
  raf = requestAnimationFrame(f);
  return { st, destroy: () => { cancelAnimationFrame(raf); io.disconnect(); window.removeEventListener("resize", resize); window.removeEventListener("pointermove", move); } };
}

/** Floating image that follows the cursor over any [data-hover-img] element (desktop only). */
export function initHoverReveal() {
  if (!finePointer()) return () => {};
  const box = document.createElement("div"); box.className = "hover-float"; box.innerHTML = "<img alt=''>"; document.body.appendChild(box);
  const img = box.querySelector("img")!; let tx = 0, ty = 0, x = 0, y = 0, raf = 0;
  const over = (e: PointerEvent) => { const it = (e.target as HTMLElement).closest?.("[data-hover-img]") as HTMLElement | null; if (it) { if (img.getAttribute("src") !== it.dataset.hoverImg) img.src = it.dataset.hoverImg!; box.classList.add("on"); } else box.classList.remove("on"); };
  const move = (e: PointerEvent) => { tx = e.clientX; ty = e.clientY; };
  document.addEventListener("pointerover", over); window.addEventListener("pointermove", move);
  const f = () => { x = lerp(x, tx, 0.12); y = lerp(y, ty, 0.12); box.style.transform = `translate(${x}px,${y}px) rotate(${(tx - x) * 0.04}deg)`; raf = requestAnimationFrame(f); };
  raf = requestAnimationFrame(f);
  return () => { cancelAnimationFrame(raf); document.removeEventListener("pointerover", over); window.removeEventListener("pointermove", move); box.remove(); };
}
export { clamp, lerp };
