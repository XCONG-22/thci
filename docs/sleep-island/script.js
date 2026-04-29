const canvas = document.getElementById("eco-canvas");
const ctx = canvas.getContext("2d");

const tooltip = document.getElementById("bio-tooltip");
const liquidFill = document.getElementById("liquid-fill");
const breathWave = document.getElementById("breath-wave");
const audioButton = document.getElementById("audio-toggle");

const humidityEl = document.getElementById("humidity-val");
const oxygenEl = document.getElementById("oxygen-val");
const pressureEl = document.getElementById("pressure-val");
const breathEl = document.getElementById("breath-val");
const algaeEl = document.getElementById("algae-val");
const mossEl = document.getElementById("moss-val");
const myceliumEl = document.getElementById("mycelium-val");

const nodeField = document.getElementById("node-field");
const reveals = [...document.querySelectorAll(".reveal")];

let w = 0;
let h = 0;
let t = 0;
let pointer = { x: 0, y: 0, active: false, speed: 0 };
let ripples = [];

const particles = [];
const particleCount = 120;

const eco = {
  humidity: 74,
  oxygen: 41,
  pressure: 38,
  breathSync: 0.78,
  agitation: 0.25,
  algae: 67,
  moss: 53,
  mycelium: 49
};

function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}

function createParticle() {
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    z: Math.random() * 1,
    vx: (Math.random() - 0.5) * 0.22,
    vy: (Math.random() - 0.5) * 0.22,
    size: Math.random() * 2.2 + 0.5,
    pulse: Math.random() * Math.PI * 2,
    species: ["Algae", "Moss", "Mycelium"][Math.floor(Math.random() * 3)]
  };
}

function initParticles() {
  particles.length = 0;
  for (let i = 0; i < particleCount; i++) particles.push(createParticle());
}

function spawnNetworkNodes() {
  for (let i = 0; i < 16; i++) {
    const node = document.createElement("span");
    node.className = "node";
    node.style.left = `${Math.random() * 95}%`;
    node.style.top = `${Math.random() * 85}%`;
    node.style.animationDelay = `${Math.random() * 8}s`;
    nodeField.appendChild(node);
  }
}

function drawBackgroundGradient() {
  const radial = ctx.createRadialGradient(w * 0.45, h * 0.35, 20, w * 0.5, h * 0.55, w * 0.7);
  radial.addColorStop(0, "rgba(62, 201, 173, 0.10)");
  radial.addColorStop(0.45, "rgba(17, 80, 101, 0.12)");
  radial.addColorStop(1, "rgba(2, 12, 14, 0.55)");
  ctx.fillStyle = radial;
  ctx.fillRect(0, 0, w, h);
}

function drawRipples() {
  ripples = ripples.filter((r) => r.life > 0);
  for (const r of ripples) {
    ctx.beginPath();
    ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(126, 255, 233, ${r.life * 0.3})`;
    ctx.lineWidth = 1.2;
    ctx.stroke();
    r.radius += 1.4;
    r.life -= 0.014;
  }
}

function drawParticles() {
  for (const p of particles) {
    const dx = pointer.x - p.x;
    const dy = pointer.y - p.y;
    const d2 = dx * dx + dy * dy;
    if (pointer.active && d2 < 20000) {
      const force = (1 - d2 / 20000) * 0.03;
      p.vx -= dx * force * 0.001;
      p.vy -= dy * force * 0.001;
    }

    p.vx += (Math.sin((t + p.pulse) * 0.004) * 0.002);
    p.vy += (Math.cos((t + p.pulse) * 0.003) * 0.002);
    p.x += p.vx;
    p.y += p.vy;
    p.vx *= 0.988;
    p.vy *= 0.988;

    if (p.x < -20) p.x = w + 10;
    if (p.x > w + 20) p.x = -10;
    if (p.y < -20) p.y = h + 10;
    if (p.y > h + 20) p.y = -10;

    const glow = 0.28 + 0.25 * Math.sin(t * 0.004 + p.pulse);
    const r = 90 + Math.floor(40 * p.z);
    const g = 200 + Math.floor(35 * glow);
    const b = 220 + Math.floor(25 * glow);
    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${0.22 + p.z * 0.5})`;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size + glow * 1.2, 0, Math.PI * 2);
    ctx.fill();
  }
}

function updateEcoState() {
  const breath = (Math.sin(t * 0.012) + 1) / 2;
  const drift = (Math.sin(t * 0.0017) + Math.cos(t * 0.0022)) * 0.5;

  eco.agitation = Math.min(1, pointer.speed * 0.08 + Math.abs(Math.sin(t * 0.008)) * 0.3);
  eco.pressure = 30 + breath * 32 + drift * 8;
  eco.humidity = 63 + eco.pressure * 0.42 + (1 - eco.agitation) * 8;
  eco.oxygen = 30 + eco.agitation * 30 + breath * 12;
  eco.breathSync = 0.62 + breath * 0.3 - eco.agitation * 0.08;

  eco.algae += 0.012 + (eco.humidity - 70) * 0.0018;
  eco.moss += 0.009 + (eco.humidity - 65) * 0.0012;
  eco.mycelium += 0.01 + eco.breathSync * 0.004;

  eco.algae = Math.max(20, Math.min(99, eco.algae));
  eco.moss = Math.max(20, Math.min(99, eco.moss));
  eco.mycelium = Math.max(20, Math.min(99, eco.mycelium));
}

function paintUI() {
  humidityEl.textContent = `${eco.humidity.toFixed(0)}%`;
  oxygenEl.textContent = `${eco.oxygen.toFixed(0)}%`;
  pressureEl.textContent = `${eco.pressure.toFixed(0)}%`;
  breathEl.textContent = eco.breathSync.toFixed(2);
  algaeEl.textContent = `${eco.algae.toFixed(0)}% vitality`;
  mossEl.textContent = `${eco.moss.toFixed(0)}% hydration lock`;
  myceliumEl.textContent = `${eco.mycelium.toFixed(0)}% connective growth`;

  const level = Math.min(92, Math.max(20, eco.humidity * 0.9));
  liquidFill.style.height = `${level}%`;
  breathWave.style.filter = `drop-shadow(0 0 ${12 + eco.breathSync * 15}px rgba(118,255,221,0.45))`;
}

function animate() {
  t += 1;
  drawBackgroundGradient();
  drawRipples();
  drawParticles();
  updateEcoState();
  paintUI();
  pointer.speed *= 0.9;
  requestAnimationFrame(animate);
}

function observeSections() {
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) entry.target.classList.add("visible");
      }
    },
    { threshold: 0.16 }
  );
  reveals.forEach((el) => io.observe(el));
}

function setupTooltipHover() {
  window.addEventListener("mousemove", (e) => {
    const x = e.clientX;
    const y = e.clientY;
    let nearest = null;
    let minDist = 99999;

    for (const p of particles) {
      const dx = p.x - x;
      const dy = p.y - y;
      const d2 = dx * dx + dy * dy;
      if (d2 < minDist) {
        minDist = d2;
        nearest = p;
      }
    }

    if (nearest && minDist < 800) {
      tooltip.style.opacity = "1";
      tooltip.style.left = `${x}px`;
      tooltip.style.top = `${y}px`;
      tooltip.textContent = `${nearest.species} node | nutrient pulse ${Math.floor((1 - minDist / 800) * 100)}%`;
    } else {
      tooltip.style.opacity = "0";
    }
  });
}

let audioCtx = null;
let masterGain = null;
let tone = null;
let noiseFilter = null;
let lfo = null;

function initAmbientAudio() {
  if (audioCtx) return;

  audioCtx = new window.AudioContext();
  masterGain = audioCtx.createGain();
  masterGain.gain.value = 0.0001;
  masterGain.connect(audioCtx.destination);

  tone = audioCtx.createOscillator();
  tone.type = "sine";
  tone.frequency.value = 92;

  lfo = audioCtx.createOscillator();
  const lfoGain = audioCtx.createGain();
  lfo.frequency.value = 0.08;
  lfoGain.gain.value = 18;
  lfo.connect(lfoGain);
  lfoGain.connect(tone.frequency);

  const noiseBuffer = audioCtx.createBuffer(1, audioCtx.sampleRate * 2, audioCtx.sampleRate);
  const channel = noiseBuffer.getChannelData(0);
  for (let i = 0; i < channel.length; i++) channel[i] = (Math.random() * 2 - 1) * 0.3;

  const noise = audioCtx.createBufferSource();
  noise.buffer = noiseBuffer;
  noise.loop = true;
  noiseFilter = audioCtx.createBiquadFilter();
  noiseFilter.type = "lowpass";
  noiseFilter.frequency.value = 500;

  tone.connect(masterGain);
  noise.connect(noiseFilter);
  noiseFilter.connect(masterGain);

  tone.start();
  lfo.start();
  noise.start();

  masterGain.gain.exponentialRampToValueAtTime(0.08, audioCtx.currentTime + 2.5);
}

function updateAudio() {
  if (!audioCtx) return;
  const hz = 88 + eco.breathSync * 50 + eco.agitation * 30;
  tone.frequency.setTargetAtTime(hz, audioCtx.currentTime, 0.25);
  noiseFilter.frequency.setTargetAtTime(260 + eco.humidity * 7, audioCtx.currentTime, 0.35);
  masterGain.gain.setTargetAtTime(0.05 + eco.agitation * 0.03, audioCtx.currentTime, 0.4);
  requestAnimationFrame(updateAudio);
}

audioButton.addEventListener("click", async () => {
  initAmbientAudio();
  if (audioCtx.state === "suspended") await audioCtx.resume();
  audioButton.textContent = "Bioacoustics Active";
  audioButton.disabled = true;
  updateAudio();
});

window.addEventListener("pointermove", (e) => {
  const dx = e.clientX - pointer.x;
  const dy = e.clientY - pointer.y;
  pointer.speed = Math.min(24, Math.hypot(dx, dy));
  pointer.x = e.clientX;
  pointer.y = e.clientY;
  pointer.active = true;

  if (Math.random() > 0.86) {
    ripples.push({ x: pointer.x, y: pointer.y, radius: 8, life: 1 });
  }
});

window.addEventListener("pointerleave", () => {
  pointer.active = false;
});

window.addEventListener("resize", () => {
  resize();
  initParticles();
});

resize();
initParticles();
spawnNetworkNodes();
observeSections();
setupTooltipHover();
animate();
