const canvas = document.getElementById("eco-canvas");
const ctx = canvas.getContext("2d");

const tooltip = document.getElementById("bio-tooltip");
const liquidFill = document.getElementById("liquid-fill");
const breathWave = document.getElementById("breath-wave");
const audioButton = document.getElementById("audio-toggle");
const langZhButton = document.getElementById("lang-zh");
const langEnButton = document.getElementById("lang-en");
const toggleEvolutionButton = document.getElementById("toggle-evolution");
const resetEcosystemButton = document.getElementById("reset-ecosystem");
const openDisturbanceButton = document.getElementById("open-disturbance");
const presetCalmButton = document.getElementById("preset-calm");
const presetBreathButton = document.getElementById("preset-breath");
const presetAgitationButton = document.getElementById("preset-agitation");
const presetOxygenButton = document.getElementById("preset-oxygen");
const taglineEl = document.getElementById("tagline");
const heroLeadEl = document.getElementById("hero-lead");
const introTitleEl = document.getElementById("intro-title");
const introBodyEl = document.getElementById("intro-body");
const simTitleEl = document.getElementById("sim-title");
const simHintEl = document.getElementById("sim-hint");
const obsTitleEl = document.getElementById("obs-title");
const obsBodyEl = document.getElementById("obs-body");
const transformTitleEl = document.getElementById("transform-title");
const transformBodyEl = document.getElementById("transform-body");
const growthTitleEl = document.getElementById("growth-title");
const algaeTitleEl = document.getElementById("algae-title");
const mossTitleEl = document.getElementById("moss-title");
const myceliumTitleEl = document.getElementById("mycelium-title");
const oxygenTitleEl = document.getElementById("oxygen-title");
const oxygenBodyEl = document.getElementById("oxygen-body");
const breathingTitleEl = document.getElementById("breathing-title");
const breathingQuoteEl = document.getElementById("breathing-quote");
const networkTitleEl = document.getElementById("network-title");
const networkBodyEl = document.getElementById("network-body");
const futureTitleEl = document.getElementById("future-title");
const futureBodyEl = document.getElementById("future-body");
const humidityLabelEl = document.getElementById("humidity-label");
const oxygenLabelEl = document.getElementById("oxygen-label");
const pressureLabelEl = document.getElementById("pressure-label");
const breathLabelEl = document.getElementById("breath-label");
const tempLabelEl = document.getElementById("temp-label");
const phLabelEl = document.getElementById("ph-label");
const doLabelEl = document.getElementById("do-label");
const turbidityLabelEl = document.getElementById("turbidity-label");
const flowLabelEl = document.getElementById("flow-label");
const packetLabelEl = document.getElementById("packet-label");

const humidityEl = document.getElementById("humidity-val");
const oxygenEl = document.getElementById("oxygen-val");
const pressureEl = document.getElementById("pressure-val");
const breathEl = document.getElementById("breath-val");
const algaeEl = document.getElementById("algae-val");
const mossEl = document.getElementById("moss-val");
const myceliumEl = document.getElementById("mycelium-val");

const nodeField = document.getElementById("node-field");
const reveals = [...document.querySelectorAll(".reveal")];
const telemetrySourceEl = document.getElementById("telemetry-source");
const connectDeviceButton = document.getElementById("connect-device");
const toggleDemoButton = document.getElementById("toggle-demo");
const deviceStatusEl = document.getElementById("device-status");
const signalLineEl = document.getElementById("signal-line");
const tempEl = document.getElementById("temp-val");
const phEl = document.getElementById("ph-val");
const doEl = document.getElementById("do-val");
const turbidityEl = document.getElementById("turbidity-val");
const flowEl = document.getElementById("flow-val");
const packetEl = document.getElementById("packet-val");
const tankPhotoEl = document.querySelector(".tank-photo");
const algaeFlowEl = document.getElementById("algae-flow");

let w = 0;
let h = 0;
let t = 0;
let evolutionPaused = false;
let activePreset = "calm";
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
const defaultEco = { ...eco };

const telemetry = {
  source: "simulation",
  connected: false,
  demoRunning: false,
  lastTimestamp: null,
  statusKey: "statusWaiting",
  statusExtra: "",
  serialPort: null,
  serialReader: null,
  demoTimer: null,
  target: {
    humidity: null,
    oxygen: null,
    pressure: null,
    breathSync: null,
    agitation: null
  },
  tank: {
    temp: 24.2,
    ph: 7.1,
    dissolvedOxygen: 6.8,
    turbidity: 11,
    flow: 58
  }
};
const defaultTank = { ...telemetry.tank };
let currentLanguage = navigator.language.toLowerCase().startsWith("zh") ? "zh" : "en";
let ambientActivated = false;

const textDecoder = new TextDecoder();
const i18n = {
  en: {
    tag: "speculative micro-ecology / nocturnal interface",
    heroLead: "A humid sleep tank where human pressure becomes nourishment. Breathing, agitation, and stillness co-compose an ecosystem of algae, moss, and mycelium.",
    audioWake: "Awaken Ambient Bioacoustics",
    audioActive: "Bioacoustics Active",
    pause: "Pause Ecosystem",
    resume: "Resume Ecosystem",
    reset: "Reset Ecosystem",
    directorOn: "Director Mode",
    directorOff: "Exit Director",
    startTour: "Start 30s Tour",
    stopTour: "Stop Tour",
    countdownStart: "REC",
    presetCalm: "Calm",
    presetBreath: "Breath Sync",
    presetAgitation: "Agitation",
    presetOxygen: "Oxygen Peak",
    disturbanceLink: "Disturbance Interface",
    introTitle: "1. Introduction to Sleep Island",
    introBody: "Sleep Island imagines rest as metabolism. Human sleep pressure gently activates micro-pumps, regulating mist and water circulation so microscopic life can gather, root, and glow.",
    simTitle: "2. Real-time Ecological System Simulation",
    simHint: "Hover particles to inspect living nodes.",
    humidity: "Humidity",
    oxygenFlux: "Oxygen Flux",
    sleepPressure: "Sleep Pressure",
    breathSync: "Breath Sync",
    obsTitle: "3. Observable Algae Tank / Device Link",
    obsBody: "The vessel below can bind to your physical sensing device. Incoming telemetry updates the ecosystem state in real time, making internal micro-life shifts observable.",
    connectDevice: "Connect Serial Device",
    startDemo: "Start Demo Stream",
    stopDemo: "Stop Demo Stream",
    waterTemp: "Water Temp",
    dissolvedO2: "Dissolved O₂",
    turbidity: "Turbidity",
    flow: "Flow",
    lastPacket: "Last Packet",
    transformTitle: "4. Human Pressure → Ecosystem Transformation",
    transformBody: "Increasing pressure amplifies pump pulses, thickens moisture layers, and feeds filament growth. Calm sleep gives continuity; restless waves trigger oxygen release.",
    growthTitle: "5. Algae / Moss / Mycelium Growth Status",
    algaeTitle: "Algae Bloom",
    mossTitle: "Moss Weave",
    myceliumTitle: "Mycelium Thread",
    oxygenTitle: "6. Oxygen Release & Humidity Drift",
    oxygenBody: "Emotional agitation in dream phases initiates protective oxygen plumes. Moisture condenses as soft fog, distributing nutrients through capillary channels.",
    breathingTitle: "7. Sleep Breathing Synchronization",
    breathingQuote: "Inhale, and the tank listens. Exhale, and bioluminescent life exhales with you.",
    networkTitle: "8. Planetary Sleep Network Concept",
    networkBody: "Multiple Sleep Islands could form a distributed nocturnal commons: city-scale dormancy converted into planetary micro-ecological resilience.",
    futureTitle: "9. Speculative Future Narrative",
    futureBody: "Tomorrow, sleep is no longer passive recovery. It is an ecological ritual: post-human care, shared respiration, and living architecture grown from dreams.",
    signalInternal: "internal simulation",
    signalDemo: "demo telemetry stream",
    signalDevice: "physical device stream",
    signalSourcePrefix: "Signal source: ",
    deviceStatusPrefix: "Device status: ",
    statusWaiting: "waiting for connection.",
    statusConnected: "connected, receiving telemetry packets",
    statusDemoOn: "demo stream active, emulating live tank telemetry",
    statusDemoOff: "demo stream stopped, back to internal simulation",
    statusUnsupported: "browser does not support Web Serial, use Chrome/Edge or demo mode",
    statusConnectionFailed: "connection failed",
    statusInterrupted: "serial stream interrupted",
    statusReset: "ecosystem pulse reset",
    vitality: "vitality",
    hydrationLock: "hydration lock",
    connectiveGrowth: "connective growth",
    node: "node",
    nutrientPulse: "nutrient pulse"
  },
  zh: {
    tag: "推测性微生态 / 夜间界面",
    heroLead: "一个潮湿睡眠舱，将人的睡压转化为生态养分。呼吸、躁动与静息共同塑造藻类、苔藓与菌丝的共生系统。",
    audioWake: "唤醒环境声场",
    audioActive: "声场已激活",
    pause: "暂停生态",
    resume: "继续生态",
    reset: "重置生态",
    directorOn: "导演模式",
    directorOff: "退出导演",
    startTour: "启动30秒巡游",
    stopTour: "停止巡游",
    countdownStart: "开始",
    presetCalm: "静息",
    presetBreath: "呼吸同步",
    presetAgitation: "情绪扰动",
    presetOxygen: "释氧峰值",
    disturbanceLink: "扰动交互舱",
    introTitle: "1. 梦屿介绍",
    introBody: "梦屿把睡眠想象为一种代谢。人体睡压轻触微型泵体，调节雾湿与水循环，使微观生命得以聚合、生长、发光。",
    simTitle: "2. 实时生态系统模拟",
    simHint: "悬停粒子可查看生物节点。",
    humidity: "湿度",
    oxygenFlux: "氧通量",
    sleepPressure: "睡压",
    breathSync: "呼吸同步",
    obsTitle: "3. 可观测藻缸 / 设备连接",
    obsBody: "下方容器可绑定你的实体传感设备。实时遥测将直接驱动生态状态，让内部微生命变化可被观察。",
    connectDevice: "连接串口设备",
    startDemo: "启动演示数据流",
    stopDemo: "停止演示数据流",
    waterTemp: "水温",
    dissolvedO2: "溶解氧",
    turbidity: "浊度",
    flow: "流量",
    lastPacket: "最近数据包",
    transformTitle: "4. 人体睡压 → 生态转化",
    transformBody: "睡压上升会放大泵体脉冲、加厚湿度层并促进丝状生长。平稳睡眠维持连续性，躁动波动则触发释氧。",
    growthTitle: "5. 藻类 / 苔藓 / 菌丝生长状态",
    algaeTitle: "藻华活性",
    mossTitle: "苔藓织层",
    myceliumTitle: "菌丝网络",
    oxygenTitle: "6. 释氧与湿度漂移",
    oxygenBody: "梦境中的情绪扰动会触发保护性释氧羽流。水汽凝并为柔雾，经毛细通道分配营养。",
    breathingTitle: "7. 睡眠呼吸同步",
    breathingQuote: "吸气时，舱体倾听；呼气时，微光生命与你共同呼吸。",
    networkTitle: "8. 行星睡眠网络构想",
    networkBody: "多个梦屿可构成分布式夜间公地：将城市级睡眠能量转化为行星尺度的微生态韧性。",
    futureTitle: "9. 推测性未来叙事",
    futureBody: "明日的睡眠不再只是被动恢复，而是一种生态仪式：后人类照护、共呼吸，以及由梦境生长的生命建筑。",
    signalInternal: "内部模拟",
    signalDemo: "演示数据流",
    signalDevice: "实体设备数据流",
    signalSourcePrefix: "信号来源：",
    deviceStatusPrefix: "设备状态：",
    statusWaiting: "等待连接。",
    statusConnected: "已连接，正在接收遥测数据",
    statusDemoOn: "演示流已开启，正在模拟藻缸实时遥测",
    statusDemoOff: "演示流已停止，已切回内部模拟",
    statusUnsupported: "当前浏览器不支持 Web Serial，请使用 Chrome/Edge 或演示模式",
    statusConnectionFailed: "连接失败",
    statusInterrupted: "串口流中断",
    statusReset: "生态脉冲已重置",
    vitality: "活性",
    hydrationLock: "锁湿",
    connectiveGrowth: "连通生长",
    node: "节点",
    nutrientPulse: "养分脉冲"
  }
};

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function blend(current, next, ratio = 0.14) {
  return current + (next - current) * ratio;
}

function tr(key) {
  return i18n[currentLanguage][key] ?? i18n.en[key] ?? key;
}

function refreshLanguageButtons() {
  langZhButton.classList.toggle("active", currentLanguage === "zh");
  langEnButton.classList.toggle("active", currentLanguage === "en");
}

function refreshPresetButtons() {
  presetCalmButton.classList.toggle("active", activePreset === "calm");
  presetBreathButton.classList.toggle("active", activePreset === "breath");
  presetAgitationButton.classList.toggle("active", activePreset === "agitation");
  presetOxygenButton.classList.toggle("active", activePreset === "oxygen");
}

function refreshControlLabels() {
  audioButton.textContent = ambientActivated ? tr("audioActive") : tr("audioWake");
  toggleEvolutionButton.textContent = evolutionPaused ? tr("resume") : tr("pause");
  resetEcosystemButton.textContent = tr("reset");
  presetCalmButton.textContent = tr("presetCalm");
  presetBreathButton.textContent = tr("presetBreath");
  presetAgitationButton.textContent = tr("presetAgitation");
  presetOxygenButton.textContent = tr("presetOxygen");
  openDisturbanceButton.textContent = tr("disturbanceLink");
  connectDeviceButton.textContent = tr("connectDevice");
  toggleDemoButton.textContent = telemetry.demoRunning ? tr("stopDemo") : tr("startDemo");
}

function applyLanguage(lang) {
  currentLanguage = lang === "zh" ? "zh" : "en";
  document.documentElement.lang = currentLanguage === "zh" ? "zh-CN" : "en";
  taglineEl.textContent = tr("tag");
  heroLeadEl.textContent = tr("heroLead");
  introTitleEl.textContent = tr("introTitle");
  introBodyEl.textContent = tr("introBody");
  simTitleEl.textContent = tr("simTitle");
  simHintEl.textContent = tr("simHint");
  humidityLabelEl.textContent = tr("humidity");
  oxygenLabelEl.textContent = tr("oxygenFlux");
  pressureLabelEl.textContent = tr("sleepPressure");
  breathLabelEl.textContent = tr("breathSync");
  obsTitleEl.textContent = tr("obsTitle");
  obsBodyEl.textContent = tr("obsBody");
  tempLabelEl.textContent = tr("waterTemp");
  phLabelEl.textContent = "pH";
  doLabelEl.textContent = tr("dissolvedO2");
  turbidityLabelEl.textContent = tr("turbidity");
  flowLabelEl.textContent = tr("flow");
  packetLabelEl.textContent = tr("lastPacket");
  transformTitleEl.textContent = tr("transformTitle");
  transformBodyEl.textContent = tr("transformBody");
  growthTitleEl.textContent = tr("growthTitle");
  algaeTitleEl.textContent = tr("algaeTitle");
  mossTitleEl.textContent = tr("mossTitle");
  myceliumTitleEl.textContent = tr("myceliumTitle");
  oxygenTitleEl.textContent = tr("oxygenTitle");
  oxygenBodyEl.textContent = tr("oxygenBody");
  breathingTitleEl.textContent = tr("breathingTitle");
  breathingQuoteEl.textContent = tr("breathingQuote");
  networkTitleEl.textContent = tr("networkTitle");
  networkBodyEl.textContent = tr("networkBody");
  futureTitleEl.textContent = tr("futureTitle");
  futureBodyEl.textContent = tr("futureBody");
  refreshLanguageButtons();
  refreshPresetButtons();
  refreshControlLabels();
  setDeviceStatusWithExtra(telemetry.statusKey ?? "statusWaiting", telemetry.statusExtra ?? "");
  paintTelemetryUI();
}

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
    if (!evolutionPaused) {
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
    }

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

function applyTelemetry(packet, source = "device") {
  telemetry.source = source;
  telemetry.connected = source === "device";
  telemetry.lastTimestamp = Date.now();

  const mappedHumidity = packet.humidity ?? clamp(50 + (packet.flow ?? telemetry.tank.flow) * 0.5, 48, 96);
  const mappedOxygen = packet.oxygen ?? clamp((packet.dissolvedOxygen ?? telemetry.tank.dissolvedOxygen) * 8, 20, 96);
  const mappedPressure = packet.pressure ?? clamp(25 + (packet.flow ?? telemetry.tank.flow) * 0.55, 20, 94);
  const mappedBreathSync = packet.breathSync ?? clamp(0.5 + ((packet.ph ?? telemetry.tank.ph) - 6.3) * 0.17, 0.5, 0.98);
  const mappedAgitation = packet.agitation ?? clamp((packet.turbidity ?? telemetry.tank.turbidity) / 60, 0.05, 1);

  telemetry.target.humidity = mappedHumidity;
  telemetry.target.oxygen = mappedOxygen;
  telemetry.target.pressure = mappedPressure;
  telemetry.target.breathSync = mappedBreathSync;
  telemetry.target.agitation = mappedAgitation;

  telemetry.tank.temp = packet.temp ?? telemetry.tank.temp;
  telemetry.tank.ph = packet.ph ?? telemetry.tank.ph;
  telemetry.tank.dissolvedOxygen = packet.dissolvedOxygen ?? telemetry.tank.dissolvedOxygen;
  telemetry.tank.turbidity = packet.turbidity ?? telemetry.tank.turbidity;
  telemetry.tank.flow = packet.flow ?? telemetry.tank.flow;
}

function paintTelemetryUI() {
  tempEl.textContent = `${telemetry.tank.temp.toFixed(1)}°C`;
  phEl.textContent = telemetry.tank.ph.toFixed(2);
  doEl.textContent = `${telemetry.tank.dissolvedOxygen.toFixed(1)} mg/L`;
  turbidityEl.textContent = `${telemetry.tank.turbidity.toFixed(0)} NTU`;
  flowEl.textContent = `${telemetry.tank.flow.toFixed(0)}%`;

  const sourceText = telemetry.source === "device" ? tr("signalDevice") : telemetry.demoRunning ? tr("signalDemo") : tr("signalInternal");
  telemetrySourceEl.textContent = `${tr("signalSourcePrefix")}${sourceText}`;

  packetEl.textContent = telemetry.lastTimestamp
    ? new Date(telemetry.lastTimestamp).toLocaleTimeString(currentLanguage === "zh" ? "zh-CN" : "en-GB", { hour12: false })
    : "--:--:--";

  const signalStrength = clamp((telemetry.tank.flow + telemetry.tank.dissolvedOxygen * 7) / 120, 0.2, 1.2);
  signalLineEl.style.transform = `scaleY(${0.7 + signalStrength * 0.5})`;
  signalLineEl.style.opacity = `${0.55 + signalStrength * 0.35}`;

  if (tankPhotoEl && algaeFlowEl) {
    const activity = clamp(eco.agitation * 0.58 + eco.breathSync * 0.42, 0.12, 1);
    const glow = clamp(eco.oxygen / 100, 0.2, 1);
    const hueShift = (telemetry.tank.ph - 7) * 20;
    tankPhotoEl.style.setProperty("--tank-activity", activity.toFixed(2));
    tankPhotoEl.style.setProperty("--tank-glow", glow.toFixed(2));
    algaeFlowEl.style.transform = `translateY(${(1 - activity) * 10}px) scale(${0.96 + activity * 0.1})`;
    algaeFlowEl.style.filter = `hue-rotate(${hueShift.toFixed(1)}deg) saturate(${(1 + activity * 0.45).toFixed(2)}) blur(0.6px)`;
  }
}

function setDeviceStatus(message) {
  telemetry.statusKey = message;
  telemetry.statusExtra = "";
  const translated = i18n[currentLanguage][message] || message;
  deviceStatusEl.textContent = `${tr("deviceStatusPrefix")}${translated}`;
}

function setDeviceStatusWithExtra(message, extra = "") {
  telemetry.statusKey = message;
  telemetry.statusExtra = extra;
  const translated = i18n[currentLanguage][message] || message;
  const detail = extra ? ` (${extra})` : "";
  deviceStatusEl.textContent = `${tr("deviceStatusPrefix")}${translated}${detail}`;
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

  const telemetryAge = telemetry.lastTimestamp ? Date.now() - telemetry.lastTimestamp : Infinity;
  const telemetryFreshness = clamp(1 - telemetryAge / 6000, 0, 1);
  if (telemetryFreshness > 0 && telemetry.target.humidity !== null) {
    const ratio = 0.2 * telemetryFreshness;
    eco.humidity = blend(eco.humidity, telemetry.target.humidity, ratio);
    eco.oxygen = blend(eco.oxygen, telemetry.target.oxygen, ratio);
    eco.pressure = blend(eco.pressure, telemetry.target.pressure, ratio);
    eco.breathSync = blend(eco.breathSync, telemetry.target.breathSync, ratio);
    eco.agitation = blend(eco.agitation, telemetry.target.agitation, ratio);
  }
}

function paintUI() {
  humidityEl.textContent = `${eco.humidity.toFixed(0)}%`;
  oxygenEl.textContent = `${eco.oxygen.toFixed(0)}%`;
  pressureEl.textContent = `${eco.pressure.toFixed(0)}%`;
  breathEl.textContent = eco.breathSync.toFixed(2);
  algaeEl.textContent = `${eco.algae.toFixed(0)}% ${tr("vitality")}`;
  mossEl.textContent = `${eco.moss.toFixed(0)}% ${tr("hydrationLock")}`;
  myceliumEl.textContent = `${eco.mycelium.toFixed(0)}% ${tr("connectiveGrowth")}`;

  const level = Math.min(92, Math.max(20, eco.humidity * 0.9));
  liquidFill.style.height = `${level}%`;
  breathWave.style.filter = `drop-shadow(0 0 ${12 + eco.breathSync * 15}px rgba(118,255,221,0.45))`;
  paintTelemetryUI();
}

function animate() {
  if (!evolutionPaused) t += 1;
  drawBackgroundGradient();
  drawRipples();
  drawParticles();
  if (!evolutionPaused) updateEcoState();
  paintUI();
  if (!evolutionPaused) pointer.speed *= 0.9;
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
      const species = currentLanguage === "zh"
        ? { Algae: "藻类", Moss: "苔藓", Mycelium: "菌丝" }[nearest.species]
        : nearest.species;
      tooltip.textContent = `${species} ${tr("node")} | ${tr("nutrientPulse")} ${Math.floor((1 - minDist / 800) * 100)}%`;
    } else {
      tooltip.style.opacity = "0";
    }
  });
}

function safeParseTelemetryLine(rawLine) {
  const line = rawLine.trim();
  if (!line) return null;
  try {
    return JSON.parse(line);
  } catch {
    const data = {};
    line.split(",").forEach((segment) => {
      const [k, v] = segment.split(":").map((part) => part?.trim());
      if (!k || Number.isNaN(Number(v))) return;
      data[k] = Number(v);
    });
    return Object.keys(data).length ? data : null;
  }
}

async function readSerialLoop() {
  if (!telemetry.serialReader) return;
  let buffer = "";
  try {
    while (true) {
      const { value, done } = await telemetry.serialReader.read();
      if (done) break;
      if (!value) continue;
      buffer += textDecoder.decode(value, { stream: true });
      const lines = buffer.split(/\r?\n/);
      buffer = lines.pop() ?? "";
      for (const line of lines) {
        const packet = safeParseTelemetryLine(line);
        if (!packet) continue;
        applyTelemetry(packet, "device");
      }
    }
  } catch (error) {
    setDeviceStatusWithExtra("statusInterrupted", error.message);
  } finally {
    try {
      telemetry.serialReader.releaseLock();
    } catch {}
    telemetry.serialReader = null;
  }
}

async function connectSerialDevice() {
  if (!("serial" in navigator)) {
    setDeviceStatus("statusUnsupported");
    return;
  }

  try {
    const port = await navigator.serial.requestPort();
    await port.open({ baudRate: 115200 });
    telemetry.serialPort = port;
    telemetry.serialReader = port.readable.getReader();
    telemetry.source = "device";
    setDeviceStatus("statusConnected");
    await readSerialLoop();
  } catch (error) {
    setDeviceStatusWithExtra("statusConnectionFailed", error.message);
  }
}

function createDemoPacket(step) {
  return {
    temp: 23.2 + Math.sin(step * 0.13) * 1.5 + Math.random() * 0.2,
    ph: 6.95 + Math.sin(step * 0.07) * 0.18,
    dissolvedOxygen: 6.3 + Math.cos(step * 0.09) * 0.9 + Math.random() * 0.15,
    turbidity: 9 + Math.abs(Math.sin(step * 0.16)) * 12 + pointer.speed * 0.3,
    flow: 45 + Math.sin(step * 0.11) * 20 + Math.random() * 4,
    humidity: 71 + Math.sin(step * 0.08) * 10,
    oxygen: 39 + Math.cos(step * 0.14) * 16,
    pressure: 34 + Math.sin(step * 0.1) * 22,
    breathSync: 0.7 + Math.sin(step * 0.05) * 0.16,
    agitation: clamp(pointer.speed * 0.06 + Math.abs(Math.sin(step * 0.17)) * 0.24, 0.05, 1)
  };
}

function startDemoStream() {
  if (telemetry.demoRunning) return;
  telemetry.demoRunning = true;
  telemetry.source = "demo";
  setDeviceStatus("statusDemoOn");
  refreshControlLabels();
  let step = 0;
  telemetry.demoTimer = window.setInterval(() => {
    applyTelemetry(createDemoPacket(step), "demo");
    step += 1;
  }, 1000);
}

function stopDemoStream() {
  if (!telemetry.demoRunning) return;
  telemetry.demoRunning = false;
  if (telemetry.demoTimer) window.clearInterval(telemetry.demoTimer);
  telemetry.demoTimer = null;
  telemetry.source = "simulation";
  setDeviceStatus("statusDemoOff");
  refreshControlLabels();
}

function resetEcosystemState() {
  Object.assign(eco, defaultEco);
  Object.assign(telemetry.tank, defaultTank);
  telemetry.target.humidity = null;
  telemetry.target.oxygen = null;
  telemetry.target.pressure = null;
  telemetry.target.breathSync = null;
  telemetry.target.agitation = null;
  telemetry.lastTimestamp = null;
  setDeviceStatus("statusReset");
}

function applyPreset(name) {
  activePreset = name;
  refreshPresetButtons();
  if (name === "calm") {
    telemetry.target.humidity = 76;
    telemetry.target.oxygen = 42;
    telemetry.target.pressure = 40;
    telemetry.target.breathSync = 0.86;
    telemetry.target.agitation = 0.12;
  } else if (name === "breath") {
    telemetry.target.humidity = 82;
    telemetry.target.oxygen = 52;
    telemetry.target.pressure = 58;
    telemetry.target.breathSync = 0.95;
    telemetry.target.agitation = 0.2;
  } else if (name === "agitation") {
    telemetry.target.humidity = 72;
    telemetry.target.oxygen = 78;
    telemetry.target.pressure = 72;
    telemetry.target.breathSync = 0.7;
    telemetry.target.agitation = 0.88;
    for (let i = 0; i < 12; i++) {
      ripples.push({
        x: Math.random() * w,
        y: Math.random() * h,
        radius: 6 + Math.random() * 14,
        life: 0.5 + Math.random() * 0.6
      });
    }
  } else if (name === "oxygen") {
    telemetry.target.humidity = 88;
    telemetry.target.oxygen = 92;
    telemetry.target.pressure = 62;
    telemetry.target.breathSync = 0.9;
    telemetry.target.agitation = 0.55;
  }
  telemetry.lastTimestamp = Date.now();
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
  ambientActivated = true;
  refreshControlLabels();
  audioButton.disabled = true;
  updateAudio();
});

connectDeviceButton.addEventListener("click", () => {
  connectSerialDevice();
});

toggleDemoButton.addEventListener("click", () => {
  if (telemetry.demoRunning) {
    stopDemoStream();
  } else {
    startDemoStream();
  }
});

toggleEvolutionButton.addEventListener("click", () => {
  evolutionPaused = !evolutionPaused;
  refreshControlLabels();
});

resetEcosystemButton.addEventListener("click", () => {
  resetEcosystemState();
});

presetCalmButton.addEventListener("click", () => applyPreset("calm"));
presetBreathButton.addEventListener("click", () => applyPreset("breath"));
presetAgitationButton.addEventListener("click", () => applyPreset("agitation"));
presetOxygenButton.addEventListener("click", () => applyPreset("oxygen"));

langZhButton.addEventListener("click", () => {
  applyLanguage("zh");
});

langEnButton.addEventListener("click", () => {
  applyLanguage("en");
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
applyPreset("calm");
applyLanguage(currentLanguage);
setDeviceStatus("statusWaiting");
animate();
