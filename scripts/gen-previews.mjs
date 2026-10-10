// Captures the real template previews shown across the platform (home page, templates page, create flow):
//   public/previews/<template>-desk.webp  — the store's first screen on a 1440×900 desktop
//   public/previews/<template>-mob.webp   — the store's first screen on a 390×844 phone
// Run it against a running app after changing a template:  npm run previews  (BASE=http://localhost:3000)
// Uses a local Chromium browser (Edge or Chrome) through the DevTools protocol; set BROWSER to override.
import { spawn } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import sharp from "sharp";

const BASE = (process.env.BASE || "http://localhost:3000").replace(/\/+$/, "");
const OUT = "public/previews";
const PORT = 9341;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// template id → demo store, read from the catalogue sources
const src = readFileSync("lib/catalog.ts", "utf8") + readFileSync("lib/catalog-cx.ts", "utf8");
const stores = [...src.matchAll(/id: "([a-z]+)", (?:file: "\/s\/|slug: ")([a-z0-9-]+)"/g)].map((m) => ({ id: m[1], slug: m[2] }));
const only = process.argv.slice(2);
const list = only.length ? stores.filter((s) => only.includes(s.id)) : stores;
if (!list.length) { console.error("gen-previews: no templates found"); process.exit(1); }

const BROWSERS = [process.env.BROWSER, "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe", "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Google/Chrome/Application/chrome.exe", "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", "/usr/bin/google-chrome", "/usr/bin/chromium"].filter(Boolean);
const exe = BROWSERS.find((p) => existsSync(p));
if (!exe) { console.error("gen-previews: no Chromium browser found — set BROWSER=/path/to/chrome"); process.exit(1); }

const profile = mkdtempSync(join(tmpdir(), "rv-previews-"));
const browser = spawn(exe, ["--headless=new", `--remote-debugging-port=${PORT}`, "--hide-scrollbars", "--force-prefers-reduced-motion",
  `--user-data-dir=${profile}`, "--no-first-run", "--lang=ar", "about:blank"], { stdio: "ignore" });
let ver;
for (let i = 0; i < 120 && !ver; i++) { try { ver = await (await fetch(`http://127.0.0.1:${PORT}/json/version`)).json(); } catch { await sleep(250); } }
if (!ver) { browser.kill(); console.error("gen-previews: the browser did not start"); process.exit(1); }
const ws = new WebSocket(ver.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener("open", r));
let seq = 0; const pending = new Map();
ws.addEventListener("message", (e) => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } });
const send = (method, params = {}, sessionId) => new Promise((r) => { const id = ++seq; pending.set(id, r); ws.send(JSON.stringify({ id, method, params, sessionId })); });

// the preview shows the store itself: no demo toolbar, no dev overlays
const CLEAN = `.demobar,nextjs-portal,[data-nextjs-toast],#__next-build-watcher{display:none!important}`;
const DEVICES = [
  { key: "desk", width: 1440, height: 900, dpr: 1, mobile: false, out: 1200 },
  { key: "mob", width: 390, height: 844, dpr: 2, mobile: true, out: 600 },
];

mkdirSync(OUT, { recursive: true });
for (const { id, slug } of list) {
  for (const d of DEVICES) {
    const { result: { targetId } } = await send("Target.createTarget", { url: "about:blank" });
    const { result: { sessionId: s } } = await send("Target.attachToTarget", { targetId, flatten: true });
    await send("Emulation.setDeviceMetricsOverride", { width: d.width, height: d.height, deviceScaleFactor: d.dpr, mobile: d.mobile }, s);
    await send("Page.enable", {}, s);
    await send("Page.navigate", { url: `${BASE}/s/${slug}` }, s);
    await sleep(7000);
    await send("Runtime.evaluate", { expression: `(()=>{const st=document.createElement('style');st.textContent=${JSON.stringify(CLEAN)};document.head.appendChild(st);document.querySelectorAll('img[loading=lazy]').forEach(i=>i.loading='eager');window.scrollTo(0,0)})()` }, s);
    await sleep(2500);
    const { result } = await send("Page.captureScreenshot", { format: "png" }, s);
    const file = join(OUT, `${id}-${d.key}.webp`);
    await sharp(Buffer.from(result.data, "base64")).resize({ width: d.out }).webp({ quality: 78, effort: 6 }).toFile(file);
    console.log("preview", file);
    await send("Target.closeTarget", { targetId });
  }
}
ws.close(); browser.kill();
try { rmSync(profile, { recursive: true, force: true }); } catch { /* the browser may still hold the profile */ }
