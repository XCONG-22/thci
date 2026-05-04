const canvas = document.getElementById("lab-canvas");
const ctx = canvas.getContext("2d");

const range = document.getElementById("disturbance-range");
const injectBtn = document.getElementById("inject-btn");
const stabilizeBtn = document.getElementById("stabilize-btn");
const randomBtn = document.getElementById("random-btn");
const langZhBtn = document.getElementById("lang-zh");
const langEnBtn = document.getElementById("lang-en");

const agitationEl = document.getElementById("agitation-val");
const oxygenEl = document.getElementById("oxygen-val");
const humidityEl = document.getElementById("humidity-val");
const resilienceEl = document.getElementById("resilience-val");
const narrativeEl = document.getElementById("narrative-text");
const tagTextEl = document.getElementById("tag-text");
const titleTextEl = document.getElementById("title-text");
const leadTextEl = document.getElementById("lead-text");
const rangeLabelEl = document.getElementById("range-label");
const backLinkEl = document.getElementById("back-link");
const agitationLabelEl = document.getElementById("agitation-label");
const oxygenLabelEl = document.getElementById("oxygen-label");
const humidityLabelEl = document.getElementById("humidity-label");
const resilienceLabelEl = document.getElementById("resilience-label");
const narrativeTitleEl = document.getElementById("narrative-title");

let w = 0;
let h = 0;
let t = 0;
let disturbanceGain = 1;
const ripples = [];

const pointer = { x: 0, y: 0, active: false };

const state = {
  agitation: 0.22,
  oxygen: 42,
  humidityShock: 18,
  resilience: 0.71
};
let currentLang = navigator.language.toLowerCase().startsWith("zh") ? "zh" : "en";

const i18n = {
  zh: {
    tag: "Sleep Island / 扰动实验舱",
    title: "生态扰动交互舱",
    lead: "拖动鼠标在液态生态中注入扰动，观察释氧、湿度震荡与菌丝韧性重组。",
    range: "扰动强度",
    inject: "注入扰动脉冲",
    stabilize: "生态稳定",
    random: "随机异常",
    back: "返回主界面",
    agitation: "扰动值",
    oxygen: "释氧峰值",
    humidity: "湿度冲击",
    resilience: "菌丝韧性",
    narrativeTitle: "生态响应叙事",
    narrativeStable: "系统平稳：藻层轻微摆动，呼吸与湿度保持缓慢同步。",
    narrativeMid: "中扰动：生态开始偏移，菌丝网络收缩并尝试重建稳定。",
    narrativeHigh: "高扰动：系统进入重组阶段，释氧爆发，湿度层出现剧烈波动。"
  },
  en: {
    tag: "Sleep Island / Disturbance Lab",
    title: "Ecological Disturbance Interface",
    lead: "Drag to inject disturbance into the liquid ecology and observe oxygen bursts, humidity shocks, and mycelium reconfiguration.",
    range: "Disturbance Intensity",
    inject: "Inject Disturbance Pulse",
    stabilize: "Stabilize Ecosystem",
    random: "Random Anomaly",
    back: "Back to Main Interface",
    agitation: "Agitation",
    oxygen: "Oxygen Burst",
    humidity: "Humidity Shock",
    resilience: "Mycelium Resilience",
    narrativeTitle: "Ecological Response Narrative",
    narrativeStable: "System stable: algae layers sway softly while breathing and humidity remain synchronized.",
    narrativeMid: "Moderate disturbance: ecological drift emerges and mycelium contracts before rebuilding.",
    narrativeHigh: "High disturbance: the system enters reconfiguration, oxygen surges, and humidity layers oscillate violently."
  }
};

const spores = Array.from({ length: 140 }, () => ({
  x: Math.random(),
  y: Math.random(),
  vx: (Math.random() - 0.5) * 0.0006,
  vy: (Math.random() - 0.5) * 0.0006,
  phase: Math.random() * Math.PI * 2
}));

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function tr(key) {
  return i18n[currentLang][key] ?? i18n.en[key] ?? key;
}

function applyLanguage(lang) {
  currentLang = lang === "zh" ? "zh" : "en";
  document.documentElement.lang = currentLang === "zh" ? "zh-CN" : "en";
  langZhBtn.classList.toggle("active", currentLang === "zh");
  langEnBtn.classList.toggle("active", currentLang === "en");
  tagTextEl.textContent = tr("tag");
  titleTextEl.textContent = tr("title");
  leadTextEl.textContent = tr("lead");
  rangeLabelEl.textContent = tr("range");
  injectBtn.textContent = tr("inject");
  stabilizeBtn.textContent = tr("stabilize");
  randomBtn.textContent = tr("random");
  backLinkEl.textContent = tr("back");
  agitationLabelEl.textContent = tr("agitation");
  oxygenLabelEl.textContent = tr("oxygen");
  humidityLabelEl.textContent = tr("humidity");
  resilienceLabelEl.textContent = tr("resilience");
  narrativeTitleEl.textContent = tr("narrativeTitle");
}

function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}

function disturb(strength, x = Math.random() * w, y = Math.random() * h) {
  state.agitation = clamp(state.agitation + strength * 0.16, 0, 1);
  ripples.push({ x, y, r: 8, life: 1, s: strength });
}

function updateState() {
  const drift = Math.sin(t * 0.013) * 0.006;
  state.agitation = clamp(state.agitation * 0.991 + drift, 0.04, 1);
  state.oxygen = clamp(32 + state.agitation * 62 + Math.sin(t * 0.02) * 3, 18, 98);
  state.humidityShock = clamp(8 + state.agitation * 76, 4, 95);
  state.resilience = clamp(0.84 - state.agitation * 0.46 + Math.cos(t * 0.01) * 0.03, 0.28, 0.95);
}

function drawBackground() {
  const g = ctx.createRadialGradient(w * 0.48, h * 0.45, 30, w * 0.5, h * 0.55, w * 0.75);
  g.addColorStop(0, `rgba(86, 255, 220, ${0.07 + state.agitation * 0.18})`);
  g.addColorStop(0.55, "rgba(16, 77, 98, 0.2)");
  g.addColorStop(1, "rgba(3, 12, 16, 0.82)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
}

function drawSpores() {
  for (const s of spores) {
    s.vx += Math.sin(t * 0.007 + s.phase) * 0.00002 * disturbanceGain;
    s.vy += Math.cos(t * 0.006 + s.phase) * 0.00002 * disturbanceGain;
    s.x += s.vx;
    s.y += s.vy;
    s.vx *= 0.996;
    s.vy *= 0.996;

    if (s.x < 0) s.x = 1;
    if (s.x > 1) s.x = 0;
    if (s.y < 0) s.y = 1;
    if (s.y > 1) s.y = 0;

    const px = s.x * w;
    const py = s.y * h;
    const size = 1.2 + Math.sin(t * 0.02 + s.phase) * 0.8 + state.agitation * 1.2;
    ctx.fillStyle = `rgba(126, 255, 233, ${0.14 + state.agitation * 0.38})`;
    ctx.beginPath();
    ctx.arc(px, py, size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawRipples() {
  for (let i = ripples.length - 1; i >= 0; i -= 1) {
    const r = ripples[i];
    ctx.beginPath();
    ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(132,255,238,${0.35 * r.life})`;
    ctx.lineWidth = 1 + r.s;
    ctx.stroke();
    r.r += 1.5 + r.s * 0.8;
    r.life -= 0.018;
    if (r.life <= 0) ripples.splice(i, 1);
  }
}

function updateNarrative() {
  if (state.agitation > 0.78) {
    narrativeEl.textContent = tr("narrativeHigh");
  } else if (state.agitation > 0.45) {
    narrativeEl.textContent = tr("narrativeMid");
  } else {
    narrativeEl.textContent = tr("narrativeStable");
  }
}

function paintMetrics() {
  agitationEl.textContent = state.agitation.toFixed(2);
  oxygenEl.textContent = `${state.oxygen.toFixed(0)}%`;
  humidityEl.textContent = `${state.humidityShock.toFixed(0)}%`;
  resilienceEl.textContent = state.resilience.toFixed(2);
}

function animate() {
  t += 1;
  updateState();
  drawBackground();
  drawSpores();
  drawRipples();
  paintMetrics();
  updateNarrative();
  requestAnimationFrame(animate);
}

range.addEventListener("input", () => {
  disturbanceGain = Number(range.value);
});

injectBtn.addEventListener("click", () => {
  disturb(0.8 * disturbanceGain);
});

stabilizeBtn.addEventListener("click", () => {
  state.agitation = clamp(state.agitation - 0.25, 0.06, 1);
  state.resilience = clamp(state.resilience + 0.18, 0.28, 0.95);
});

randomBtn.addEventListener("click", () => {
  disturb((0.4 + Math.random() * 0.9) * disturbanceGain);
});

langZhBtn.addEventListener("click", () => applyLanguage("zh"));
langEnBtn.addEventListener("click", () => applyLanguage("en"));

window.addEventListener("pointerdown", (e) => {
  pointer.active = true;
  pointer.x = e.clientX;
  pointer.y = e.clientY;
  disturb(0.45 * disturbanceGain, pointer.x, pointer.y);
});

window.addEventListener("pointermove", (e) => {
  if (!pointer.active) return;
  pointer.x = e.clientX;
  pointer.y = e.clientY;
  if (Math.random() > 0.72) disturb(0.1 * disturbanceGain, pointer.x, pointer.y);
});

window.addEventListener("pointerup", () => {
  pointer.active = false;
});

window.addEventListener("resize", resize);

resize();
applyLanguage(currentLang);
animate();
