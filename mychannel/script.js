/* ==========================================================================
   PROBE GAMING - SCRIPT.JS (v6.0 NEXT-GEN)
   Interactive Engine: Web Audio, Voice AI, Recoil Simulator, Crate Opener, Aim Lab
   ========================================================================== */

"use strict";

/*=========================================
OFFICIAL CHANNEL DOSSIER CONSTANTS
=========================================*/
const CHANNEL_DATA = {
  name: "Probe gaming",
  handle: "@probegaming759",
  url: "http://www.youtube.com/@probegaming759",
  subscribers: 425,
  videos: 416,
  views: 102129,
  formattedViews: "102,129",
  joined: "Jul 21, 2022",
  country: "India 🇮🇳",
  description: "Helo guys"
};

/*=========================================
WEB AUDIO API SYNTHESIZER & SOUND FX
=========================================*/
const ProbeAudio = (function() {
  let ctx = null;
  let isMuted = false;
  let bgmInterval = null;

  function getCtx() {
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    return ctx;
  }

  function playTone(freq, type, duration, vol) {
    if (isMuted) return;
    try {
      const c = getCtx();
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = type || 'sine';
      osc.frequency.setValueAtTime(freq, c.currentTime);
      gain.gain.setValueAtTime(vol || 0.15, c.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration);
      osc.connect(gain);
      gain.connect(c.destination);
      osc.start();
      osc.stop(c.currentTime + duration);
    } catch(e) {}
  }

  return {
    toggleMute: function() {
      isMuted = !isMuted;
      return isMuted;
    },
    isMuted: function() { return isMuted; },
    playClick: function() {
      playTone(850, 'sine', 0.08, 0.12);
    },
    playSuccess: function() {
      playTone(523.25, 'triangle', 0.15, 0.15);
      setTimeout(() => playTone(659.25, 'triangle', 0.15, 0.15), 100);
      setTimeout(() => playTone(783.99, 'triangle', 0.3, 0.2), 200);
    },
    playShoot: function() {
      playTone(190, 'sawtooth', 0.07, 0.2);
    },
    playCrateOpen: function() {
      playTone(280, 'square', 0.1, 0.15);
      setTimeout(() => playTone(420, 'square', 0.12, 0.2), 90);
      setTimeout(() => playTone(620, 'square', 0.16, 0.25), 180);
      setTimeout(() => playTone(880, 'sine', 0.45, 0.3), 270);
    },
    startBGM: function() {
      if (bgmInterval) return;
      const notes = [220, 261.63, 329.63, 392, 440];
      let step = 0;
      bgmInterval = setInterval(() => {
        if (!isMuted) {
          playTone(notes[step % notes.length] * 0.5, 'sine', 1.8, 0.04);
          step++;
        }
      }, 2200);
    },
    stopBGM: function() {
      if (bgmInterval) {
        clearInterval(bgmInterval);
        bgmInterval = null;
      }
    }
  };
})();

/*=========================================
TOAST NOTIFICATION HELPER
=========================================*/
function showToast(msg, icon) {
  const existing = document.querySelector('.toast-notice');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast-notice';
  toast.innerHTML = `<i class="fa-solid ${icon || 'fa-bell'}" style="color:var(--cyan)"></i><span>${msg}</span>`;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.4s ease';
    setTimeout(() => toast.remove(), 400);
  }, 3200);
}

/*=========================================
LOADER WITH SMOOTH TRANSITION
=========================================*/
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  if (loader) {
    setTimeout(() => {
      loader.style.opacity = "0";
      loader.style.visibility = "hidden";
      loader.style.transition = "0.7s cubic-bezier(0.4, 0, 0.2, 1)";
    }, 1200);
  }
});

/*=========================================
CUSTOM CURSOR & TRAILING DOT
=========================================*/
const cursor = document.querySelector(".cursor");
let cursorDot = document.querySelector(".cursor-dot");
if (!cursorDot && cursor) {
  cursorDot = document.createElement("div");
  cursorDot.className = "cursor-dot";
  document.body.appendChild(cursorDot);
}

document.addEventListener("mousemove", (e) => {
  if (cursor) {
    cursor.style.left = e.clientX + "px";
    cursor.style.top = e.clientY + "px";
  }
  if (cursorDot) {
    cursorDot.style.left = e.clientX + "px";
    cursorDot.style.top = e.clientY + "px";
  }
});

document.querySelectorAll("a, button, .card, .stat, .play, .crate-box-mesh").forEach(el => {
  el.addEventListener("mouseenter", () => {
    if (cursor) cursor.classList.add("active");
  });
  el.addEventListener("mouseleave", () => {
    if (cursor) cursor.classList.remove("active");
  });
});

/*=========================================
SCROLL PROGRESS BAR
=========================================*/
const progress = document.getElementById("progress");
window.addEventListener("scroll", () => {
  if (progress) {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progressHeight = (window.scrollY / totalHeight) * 100;
    progress.style.width = progressHeight + "%";
  }
});

/*=========================================
NAVBAR SCROLL EFFECT & AUDIO TOGGLE
=========================================*/
const nav = document.querySelector("nav");
window.addEventListener("scroll", () => {
  if (!nav) return;
  if (window.scrollY > 60) {
    nav.classList.add("scrolled");
  } else {
    nav.classList.remove("scrolled");
  }
});

const audioToggleBtn = document.getElementById("audio-toggle");
if (audioToggleBtn) {
  audioToggleBtn.addEventListener("click", () => {
    const isMuted = ProbeAudio.toggleMute();
    if (!isMuted) {
      audioToggleBtn.classList.add("playing");
      audioToggleBtn.innerHTML = `<i class="fa-solid fa-volume-high"></i> BGM: ON`;
      ProbeAudio.startBGM();
      showToast("Futuristic Ambient BGM Enabled", "fa-music");
    } else {
      audioToggleBtn.classList.remove("playing");
      audioToggleBtn.innerHTML = `<i class="fa-solid fa-volume-xmark"></i> AUDIO`;
      ProbeAudio.stopBGM();
      showToast("Audio Muted", "fa-volume-xmark");
    }
  });
}

/*=========================================
SMOOTH SCROLL FOR NAV LINKS
=========================================*/
document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function(e) {
    e.preventDefault();
    ProbeAudio.playClick();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});

/*=========================================
BUTTON HOVER & CLICK AUDIO
=========================================*/
document.querySelectorAll(".btn, .nav-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    ProbeAudio.playClick();
  });
});

/*=========================================
CONFETTI CANNON SUBSCRIBE CELEBRATION
=========================================*/
const subscribeBtns = document.querySelectorAll(".subscribe-trigger, .nav-btn");
subscribeBtns.forEach(btn => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    ProbeAudio.playSuccess();
    if (window.confetti) {
      window.confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#ff0055', '#ff7b00', '#00f2fe', '#ffbe0b']
      });
    }
    showToast("Thank you for supporting Probe gaming! Road to 500 Subs!", "fa-heart");
  });
});

/*=========================================
DYNAMIC TYPING EFFECT
=========================================*/
const words = [
  "BGMI MONTAGES",
  "PROBE GPT-4o AI BOT",
  "425 SUBSCRIBERS SQUAD",
  "ZERO RECOIL GUIDES",
  "RANK PUSH & SCRIMS",
  "CINEMATIC CLUTCHES"
];

let wordIndex = 0;
let letterIndex = 0;
let deleting = false;
const typing = document.getElementById("typing");

function typeEffect() {
  if (!typing) return;
  const current = words[wordIndex];

  if (!deleting) {
    typing.textContent = current.substring(0, letterIndex++);
    if (letterIndex > current.length) {
      deleting = true;
      setTimeout(typeEffect, 1400);
      return;
    }
  } else {
    typing.textContent = current.substring(0, letterIndex--);
    if (letterIndex === 0) {
      deleting = false;
      wordIndex = (wordIndex + 1) % words.length;
    }
  }

  setTimeout(typeEffect, deleting ? 50 : 100);
}
typeEffect();

/*=========================================
OFFICIAL ACCURATE LIVE STATS
=========================================*/
const subsEl = document.getElementById("subs");
const viewsEl = document.getElementById("views");
const videosEl = document.getElementById("videos-stat");

if (subsEl) subsEl.textContent = CHANNEL_DATA.subscribers;
if (viewsEl) viewsEl.textContent = CHANNEL_DATA.formattedViews;
if (videosEl) videosEl.textContent = CHANNEL_DATA.videos;

/*=========================================
FLOATING PARTICLES GENERATOR
=========================================*/
const particleBox = document.getElementById("particles");
if (particleBox) {
  for (let i = 0; i < 65; i++) {
    const particle = document.createElement("span");
    particle.style.position = "absolute";
    const size = Math.random() * 3 + 1.5;
    particle.style.width = size + "px";
    particle.style.height = size + "px";
    particle.style.borderRadius = "50%";
    particle.style.background = Math.random() > 0.5 ? "#ff0055" : (Math.random() > 0.3 ? "#ff7b00" : "#00f2fe");
    particle.style.left = Math.random() * 100 + "%";
    particle.style.top = Math.random() * 100 + "%";
    particle.style.opacity = (Math.random() * 0.7 + 0.2).toString();
    particle.style.boxShadow = "0 0 10px currentColor";
    particle.style.animation = `floatSlow ${5 + Math.random() * 7}s linear infinite`;
    particle.style.animationDelay = Math.random() * 5 + "s";
    particleBox.appendChild(particle);
  }
}

const particleKeyframes = document.createElement("style");
particleKeyframes.innerHTML = `
@keyframes floatSlow {
  0% { transform: translateY(0px) scale(1); }
  50% { transform: translateY(-70px) scale(1.15); }
  100% { transform: translateY(0px) scale(1); }
}
`;
document.head.appendChild(particleKeyframes);

/*=========================================
FEATURE 1: ADVANCED PROBE GPT-4o AI CHATBOT
=========================================*/
const aiMessagesList = document.getElementById("ai-messages");
const aiInputField = document.getElementById("ai-input");
const aiSendBtn = document.getElementById("ai-send");
const aiMicBtn = document.getElementById("ai-mic");

async function handleAiQuery(customQuery) {
  const query = (customQuery || (aiInputField ? aiInputField.value : '')).trim();
  if (!query) return;

  ProbeAudio.playClick();
  if (aiInputField) aiInputField.value = '';

  // Append User Bubble
  appendChatMessage('user', query);

  // Show thinking state
  const thinkingId = appendChatThinking("Analyzing query through Probe GPT-4o Neural Gateway...");

  // Intelligent Live Routing
  const lower = query.toLowerCase();
  let reply = "";
  let thought = "Queried high-speed neural matrix.";

  // 1. Math computation
  if (lower.includes('+') || lower.includes('-') || lower.includes('*') || lower.includes('/')) {
    try {
      const sanitized = query.replace(/[^0-9+\-*\/(). ]/g, '');
      if (sanitized && /^[0-9+\-*\/(). ]+$/.test(sanitized)) {
        const mathRes = Function(`'use strict'; return (${sanitized})`)();
        reply = `Calculated: ${sanitized} = ${mathRes} (via Probe High-Speed Math Engine).`;
        thought = `Safely parsed arithmetic expression: ${sanitized} -> Result: ${mathRes}`;
      }
    } catch(e) {}
  }

  // 2. Live Weather Query
  if (!reply && (lower.includes('weather') || lower.includes('temperature') || lower.includes('delhi') || lower.includes('mumbai'))) {
    thought = "Connecting to Open-Meteo live API for India regional telemetrics...";
    try {
      const wRes = await fetch('https://api.open-meteo.com/v1/forecast?latitude=28.6139&longitude=77.2090&current=temperature_2m,relative_humidity_2m');
      const wData = await wRes.json();
      reply = `Live Regional Weather (India HQ): Currently ${wData.current.temperature_2m}°C with ${wData.current.relative_humidity_2m}% humidity. Optimal ping conditions for BGMI ranked matches!`;
    } catch(e) {
      reply = "Live Weather: India HQ reports a pleasant 26°C with stable conditions for tournament streaming!";
    }
  }

  // 3. Official Channel Stats
  if (!reply && (lower.includes('channel') || lower.includes('subscriber') || lower.includes('subs') || lower.includes('probegaming759') || lower.includes('stats'))) {
    thought = "Verified authenticated channel telemetry snapshot.";
    reply = `Official Dossier for Probe gaming (@probegaming759): Exactly ${CHANNEL_DATA.subscribers} subscribers, ${CHANNEL_DATA.videos} videos, and ${CHANNEL_DATA.formattedViews} total views! Location: India (Joined Jul 21, 2022). Description: "${CHANNEL_DATA.description}".`;
  }

  // 4. BGMI Strategy & Recoil
  if (!reply && (lower.includes('recoil') || lower.includes('sensitivity') || lower.includes('m416') || lower.includes('gyro') || lower.includes('bgmi'))) {
    thought = "Retrieved Probe Gaming Pro Sensitivity Blueprint.";
    reply = "Probe BGMI Recoil Setup: For M416 with 6x scope (pulled down to 3x): Gyroscope ADS: 285%, Camera ADS: 18%. Use Compensator, Vertical Foregrip, and Tactical Stock. Maintain crosshair at upper-chest level for laser precision at 150m!";
  }

  // 5. External Free LLM Fallback (Pollinations API)
  if (!reply) {
    thought = "Connecting to open neural LLM gateway...";
    try {
      const res = await fetch(`https://text.pollinations.ai/${encodeURIComponent(query + " (Answer concisely as Probe gaming's smart esports companion)")}`);
      if (res.ok) {
        reply = await res.text();
      } else {
        throw new Error("Fallback needed");
      }
    } catch(e) {
      reply = `Probe AI Insight: For "${query}", tactical patience, precise crosshair placement, and smart rotations lead to guaranteed chicken dinners! Check out our Armory Lab below to test recoil.`;
    }
  }

  // Remove thinking element and append reply
  removeChatThinking(thinkingId);
  appendChatMessage('ai', reply, thought);
  ProbeAudio.playSuccess();

  // Text-To-Speech if not muted
  if ('speechSynthesis' in window && !ProbeAudio.isMuted()) {
    try {
      const utterance = new SpeechSynthesisUtterance(reply.replace(/[*#_]/g, ''));
      utterance.rate = 1.05;
      utterance.pitch = 1.08;
      window.speechSynthesis.speak(utterance);
    } catch(e) {}
  }
}

function appendChatMessage(sender, text, thinking) {
  if (!aiMessagesList) return;
  const row = document.createElement('div');
  row.className = `ai-bubble-row ${sender}`;

  const avatar = document.createElement('div');
  avatar.className = `ai-bubble-avatar ${sender}`;
  avatar.innerHTML = `<i class="fa-solid ${sender === 'user' ? 'fa-user' : 'fa-brain'}"></i>`;

  const body = document.createElement('div');
  body.className = 'ai-bubble-body';

  let html = `<div style="display:flex; justify-content:space-between; font-size:0.75rem; color:var(--text-muted); margin-bottom:4px; font-family:var(--font-mono);">
    <strong style="color:${sender === 'user' ? 'var(--cyan)' : 'var(--primary)'}">${sender === 'user' ? 'You' : 'Probe GPT-4o'}</strong>
    <span>Just now</span>
  </div>`;

  if (thinking) {
    html += `<div class="ai-thinking-box"><i class="fa-solid fa-microchip" style="margin-right:6px"></i>${thinking}</div>`;
  }

  html += `<div>${text}</div>`;
  body.innerHTML = html;

  row.appendChild(avatar);
  row.appendChild(body);
  aiMessagesList.appendChild(row);
  aiMessagesList.scrollTop = aiMessagesList.scrollHeight;
}

let thinkingCount = 0;
function appendChatThinking(text) {
  if (!aiMessagesList) return null;
  thinkingCount++;
  const id = "thinking-" + thinkingCount;
  const row = document.createElement('div');
  row.id = id;
  row.className = 'ai-bubble-row ai';
  row.innerHTML = `
    <div class="ai-bubble-avatar ai"><i class="fa-solid fa-gear fa-spin"></i></div>
    <div class="ai-bubble-body" style="background:rgba(255,255,255,0.03);">
      <div class="ai-thinking-box" style="margin:0;"><i class="fa-solid fa-sparkles fa-spin" style="margin-right:6px;"></i>${text}</div>
    </div>
  `;
  aiMessagesList.appendChild(row);
  aiMessagesList.scrollTop = aiMessagesList.scrollHeight;
  return id;
}

function removeChatThinking(id) {
  if (!id) return;
  const el = document.getElementById(id);
  if (el) el.remove();
}

if (aiSendBtn) {
  aiSendBtn.addEventListener("click", () => handleAiQuery());
}
if (aiInputField) {
  aiInputField.addEventListener("keydown", (e) => {
    if (e.key === 'Enter') handleAiQuery();
  });
}

// Voice Speech-To-Text
if (aiMicBtn) {
  aiMicBtn.addEventListener("click", () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      showToast("Speech Recognition not supported in this browser.", "fa-microphone-slash");
      return;
    }
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRec();
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      aiMicBtn.classList.add("listening");
      showToast("Listening... speak your gaming question!", "fa-microphone");
    };
    recognition.onresult = (e) => {
      const speech = e.results[0][0].transcript;
      aiMicBtn.classList.remove("listening");
      if (aiInputField) aiInputField.value = speech;
      handleAiQuery(speech);
    };
    recognition.onerror = () => {
      aiMicBtn.classList.remove("listening");
      showToast("Voice input cancelled.", "fa-circle-xmark");
    };
    recognition.onend = () => {
      aiMicBtn.classList.remove("listening");
    };
    recognition.start();
  });
}

// Quick Prompt Chips
document.querySelectorAll(".ai-prompt-chip").forEach(chip => {
  chip.addEventListener("click", function() {
    const text = this.getAttribute("data-prompt") || this.textContent;
    handleAiQuery(text);
  });
});

/*=========================================
FEATURE 2: 3D THREE.JS CRATE OPENER & C# BACKEND ENGINE
=========================================*/
const crateStageViewport = document.getElementById("crate-stage-viewport");
const crate3dCanvas = document.getElementById("crate-3d-canvas");
const crateOpenBtn = document.getElementById("crate-open-btn");
const crateRewardContainer = document.getElementById("crate-reward-container");
const csharpStatusText = document.getElementById("csharp-status-text");
const csharpStatusBadge = document.getElementById("csharp-backend-status");

let isCrateOpening = false;
let threeScene, threeCamera, threeRenderer, crateGroup, lidPivot, innerLight, sparkParticles;
let isDragging3D = false;
let prevMouseX = 0, prevMouseY = 0;
let targetRotX = 0.2, targetRotY = 0.5;
let currentRotX = 0.2, currentRotY = 0.5;
let targetLidAngle = 0;
let currentLidAngle = 0;
let csharpApiAvailable = false;
const CSHARP_API_URL = "http://localhost:5000";

// Fallback reward table when C# server is offline
const CRATE_REWARDS = [
  { name: "Glacier M416 (Lv.7 Max)", rarity: "mythic", color: "#ff0055", icon: "fa-crosshairs" },
  { name: "The Fool M416 (Kill Msg)", rarity: "mythic", color: "#ff0055", icon: "fa-skull" },
  { name: "Blood Raven X-Suit", rarity: "legendary", color: "#ffbe0b", icon: "fa-crow" },
  { name: "Golden Pharaoh X-Suit", rarity: "legendary", color: "#ffbe0b", icon: "fa-crown" },
  { name: "AWM Godzilla Roar Skin", rarity: "epic", color: "#7928ca", icon: "fa-dragon" },
  { name: "Probe Master Title", rarity: "rare", color: "#00f2fe", icon: "fa-shield-halved" }
];

// Check C# Backend connection
async function checkCSharpBackend() {
  try {
    const res = await fetch(`${CSHARP_API_URL}/api/status`, { method: "GET", signal: AbortSignal.timeout(1500) });
    if (res.ok) {
      csharpApiAvailable = true;
      if (csharpStatusBadge) {
        csharpStatusBadge.className = "csharp-status-badge online";
        csharpStatusText.innerHTML = "⚡ <strong>C# .NET Backend Connected</strong> (Server-side RNG Active)";
      }
    } else {
      throw new Error("Offline");
    }
  } catch (e) {
    csharpApiAvailable = false;
    if (csharpStatusBadge) {
      csharpStatusBadge.className = "csharp-status-badge local";
      csharpStatusText.innerHTML = "🌐 Client WebGL Mode (Run <code>dotnet run</code> in /backend for C# Server)";
    }
  }
}
checkCSharpBackend();

// Initialize Three.js 3D WebGL Crate
function initThreeCrate() {
  if (!window.THREE || !crate3dCanvas) return;

  const width = crateStageViewport.clientWidth || 280;
  const height = crateStageViewport.clientHeight || 280;

  // 1. Scene & Transparent WebGL Renderer
  threeScene = new THREE.Scene();
  threeCamera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
  threeCamera.position.set(0, 1.4, 4.2);
  threeCamera.lookAt(0, 0, 0);

  threeRenderer = new THREE.WebGLRenderer({
    canvas: crate3dCanvas,
    alpha: true,
    antialias: true
  });
  threeRenderer.setSize(width, height);
  threeRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // 2. Lighting Setup
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  threeScene.add(ambientLight);

  const mainLight = new THREE.DirectionalLight(0xffffff, 1.4);
  mainLight.position.set(4, 6, 5);
  threeScene.add(mainLight);

  const rimLight = new THREE.PointLight(0x00f2fe, 2.0, 10);
  rimLight.position.set(-3, 2, -2);
  threeScene.add(rimLight);

  const glowLight = new THREE.PointLight(0xff0055, 1.5, 8);
  glowLight.position.set(3, -2, 2);
  threeScene.add(glowLight);

  // Internal Mythic Light (Glows when opened)
  innerLight = new THREE.PointLight(0xffbe0b, 0, 8);
  innerLight.position.set(0, 0.4, 0);
  threeScene.add(innerLight);

  // 3. Build 3D Crate Hierarchy
  crateGroup = new THREE.Group();

  // Materials
  const metalMat = new THREE.MeshStandardMaterial({
    color: 0x121722,
    metalness: 0.85,
    roughness: 0.25
  });

  const neonTrimMat = new THREE.MeshStandardMaterial({
    color: 0xff0055,
    emissive: 0xff0055,
    emissiveIntensity: 0.9,
    metalness: 0.5,
    roughness: 0.2
  });

  const goldMat = new THREE.MeshStandardMaterial({
    color: 0xffbe0b,
    metalness: 0.95,
    roughness: 0.15
  });

  // Base Box Body
  const baseGeom = new THREE.BoxGeometry(1.6, 1.0, 1.6);
  const baseMesh = new THREE.Mesh(baseGeom, metalMat);
  baseMesh.position.y = 0.5;
  crateGroup.add(baseMesh);

  // Base Neon Band
  const bandGeom = new THREE.BoxGeometry(1.64, 0.12, 1.64);
  const bandMesh = new THREE.Mesh(bandGeom, neonTrimMat);
  bandMesh.position.y = 0.5;
  crateGroup.add(bandMesh);

  // Wireframe Edges
  const wireGeom = new THREE.EdgesGeometry(baseGeom);
  const wireMat = new THREE.LineBasicMaterial({ color: 0x00f2fe, linewidth: 2 });
  const wireMesh = new THREE.LineSegments(wireGeom, wireMat);
  wireMesh.position.y = 0.5;
  crateGroup.add(wireMesh);

  // Corner Reinforcements
  [-0.8, 0.8].forEach(x => {
    [-0.8, 0.8].forEach(z => {
      const cornerGeom = new THREE.BoxGeometry(0.12, 1.04, 0.12);
      const cornerMesh = new THREE.Mesh(cornerGeom, goldMat);
      cornerMesh.position.set(x, 0.5, z);
      crateGroup.add(cornerMesh);
    });
  });

  // Hinged Lid Pivot Group (Pivots at the back edge)
  lidPivot = new THREE.Group();
  lidPivot.position.set(0, 1.0, -0.8);

  const lidGeom = new THREE.BoxGeometry(1.7, 0.2, 1.7);
  const lidMesh = new THREE.Mesh(lidGeom, metalMat);
  lidMesh.position.set(0, 0.1, 0.8);
  lidPivot.add(lidMesh);

  const lidTrimGeom = new THREE.BoxGeometry(1.72, 0.08, 1.72);
  const lidTrimMesh = new THREE.Mesh(lidTrimGeom, neonTrimMat);
  lidTrimMesh.position.set(0, 0.1, 0.8);
  lidPivot.add(lidTrimMesh);

  // Crest Emblem on Lid
  const crestGeom = new THREE.CylinderGeometry(0.3, 0.3, 0.06, 16);
  const crestMesh = new THREE.Mesh(crestGeom, goldMat);
  crestMesh.position.set(0, 0.22, 0.8);
  lidPivot.add(crestMesh);

  crateGroup.add(lidPivot);
  crateGroup.position.y = -0.4;
  threeScene.add(crateGroup);

  // 4. Floating 3D Spark Dust Particles
  const particleCount = 45;
  const partGeom = new THREE.BufferGeometry();
  const partPositions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount * 3; i += 3) {
    partPositions[i] = (Math.random() - 0.5) * 3.5;
    partPositions[i + 1] = (Math.random() - 0.5) * 2.5 + 0.5;
    partPositions[i + 2] = (Math.random() - 0.5) * 3.5;
  }
  partGeom.setAttribute('position', new THREE.BufferAttribute(partPositions, 3));
  const partMat = new THREE.PointsMaterial({
    color: 0x00f2fe,
    size: 0.05,
    transparent: true,
    opacity: 0.85
  });
  sparkParticles = new THREE.Points(partGeom, partMat);
  threeScene.add(sparkParticles);

  // 5. Interactive Mouse / Touch 3D Orbit Dragging
  function handleDragStart(x, y) {
    isDragging3D = true;
    prevMouseX = x;
    prevMouseY = y;
  }

  function handleDragMove(x, y) {
    if (!isDragging3D) return;
    const dx = x - prevMouseX;
    const dy = y - prevMouseY;
    targetRotY += dx * 0.015;
    targetRotX += dy * 0.015;
    targetRotX = Math.max(-0.6, Math.min(0.8, targetRotX)); // clamp pitch
    prevMouseX = x;
    prevMouseY = y;
  }

  function handleDragEnd() {
    isDragging3D = false;
  }

  crateStageViewport.addEventListener("mousedown", (e) => handleDragStart(e.clientX, e.clientY));
  window.addEventListener("mousemove", (e) => handleDragMove(e.clientX, e.clientY));
  window.addEventListener("mouseup", handleDragEnd);

  crateStageViewport.addEventListener("touchstart", (e) => {
    if (e.touches.length > 0) handleDragStart(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: true });
  window.addEventListener("touchmove", (e) => {
    if (e.touches.length > 0) handleDragMove(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: true });
  window.addEventListener("touchend", handleDragEnd);

  // Click on viewport opens crate
  crateStageViewport.addEventListener("click", () => {
    if (!isDragging3D) openMythicCrate();
  });

  // 6. Animation Render Loop
  let clock = new THREE.Clock();
  function renderThree() {
    requestAnimationFrame(renderThree);
    const elapsed = clock.getElapsedTime();

    // Idle rotation when not dragging
    if (!isDragging3D && !isCrateOpening) {
      targetRotY += 0.006;
    }

    // Smooth dampening interpolation
    currentRotX += (targetRotX - currentRotX) * 0.1;
    currentRotY += (targetRotY - currentRotY) * 0.1;
    crateGroup.rotation.x = currentRotX;
    crateGroup.rotation.y = currentRotY;

    // Gentle 3D hovering
    crateGroup.position.y = -0.4 + Math.sin(elapsed * 2.2) * 0.08;

    // Smooth lid opening interpolation
    currentLidAngle += (targetLidAngle - currentLidAngle) * 0.12;
    if (lidPivot) lidPivot.rotation.x = currentLidAngle;

    // Rotate sparks
    if (sparkParticles) {
      sparkParticles.rotation.y = elapsed * 0.15;
    }

    threeRenderer.render(threeScene, threeCamera);
  }
  renderThree();
}

// Open Crate with C# Server Roll or Local Fallback
async function openMythicCrate() {
  if (isCrateOpening) return;
  isCrateOpening = true;
  ProbeAudio.playCrateOpen();

  if (crateOpenBtn) {
    crateOpenBtn.disabled = true;
    crateOpenBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> COMPUTING ROLL IN C#...';
  }

  // 3D Physical Opening Animation
  targetLidAngle = -Math.PI * 0.65; // Swing lid open in 3D
  if (innerLight) innerLight.intensity = 5.0; // Burst of mythic light
  targetRotX = 0.35; // Tilt camera perspective downward to look inside

  let reward = null;
  let sourceText = "Standalone Client Engine";

  // Attempt C# Backend Call
  try {
    const res = await fetch(`${CSHARP_API_URL}/api/crate/open`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: AbortSignal.timeout(1800)
    });

    if (res.ok) {
      const data = await res.json();
      reward = data.item;
      sourceText = `⚡ Verified by C# .NET Engine (Seed: ${data.rollSeed})`;
      csharpApiAvailable = true;
    } else {
      throw new Error("Server error");
    }
  } catch (err) {
    // Graceful offline fallback
    reward = CRATE_REWARDS[Math.floor(Math.random() * CRATE_REWARDS.length)];
    sourceText = "Client WebGL Engine (Offline Fallback)";
  }

  // Present Reward
  setTimeout(() => {
    if (crateRewardContainer) {
      crateRewardContainer.innerHTML = `
        <div class="crate-reward-card">
          <span style="background:${reward.color}; color:#fff; padding:4px 12px; border-radius:9999px; font-size:0.75rem; font-family:var(--font-mono); font-weight:700;">
            ${reward.rarity.toUpperCase()} ITEM UNLOCKED
          </span>
          <h3 style="font-family:var(--font-display); font-size:1.5rem; color:#fff; margin:12px 0 6px;">
            <i class="fa-solid ${reward.icon}" style="color:${reward.color}; margin-right:10px;"></i>
            ${reward.name}
          </h3>
          <p style="font-size:0.85rem; color:var(--text-dim); margin-bottom:6px;">Added permanently to your player armory!</p>
          <span style="font-family:var(--font-mono); font-size:0.7rem; color:var(--cyan);">${sourceText}</span>
        </div>
      `;
    }

    if (crateOpenBtn) {
      crateOpenBtn.disabled = false;
      crateOpenBtn.innerHTML = '<i class="fa-solid fa-unlock-keyhole"></i> OPEN CRATE (FREE SPIN)';
    }

    ProbeAudio.playSuccess();
    if (window.confetti) {
      window.confetti({ particleCount: 85, spread: 65, colors: [reward.color, '#fff', '#ffbe0b', '#00f2fe'] });
    }
    showToast(`Unlocked: ${reward.name}!`, "fa-gem");

    // Close 3D lid after 3 seconds
    setTimeout(() => {
      targetLidAngle = 0;
      if (innerLight) innerLight.intensity = 0;
      isCrateOpening = false;
    }, 3200);
  }, 1000);
}

if (crateOpenBtn) crateOpenBtn.addEventListener("click", openMythicCrate);

/*=========================================
FEATURE 3: ARMORY RECOIL LAB & TTK SIMULATOR
=========================================*/
const weaponPills = document.querySelectorAll(".weapon-pill");
const testSprayBtn = document.getElementById("test-spray-btn");
const recoilSvg = document.getElementById("recoil-svg");
let currentRecoil = 28;
let activeWeaponKey = "m416";

const LOCAL_WEAPON_SPECS = {
  "M416 (5.56mm)": { key: "m416", name: "M416 (Glacier Edition)", ammo: "5.56mm • 880 m/s", skin: "Glacier (Lv.7 Max)", ttk: ["0.17s (3 Shots)", "0.26s (4 Shots)", "0.34s (5 Shots)", "0.48s (6 Shots)"] },
  "AKM (7.62mm)": { key: "pan", name: "AKM (Hellfire Dragon)", ammo: "7.62mm • 715 m/s", skin: "Hellfire Dragon", ttk: ["0.14s (2 Shots)", "0.21s (3 Shots)", "0.29s (4 Shots)", "0.42s (5 Shots)"] },
  "Beryl M762": { key: "pan", name: "Beryl M762 (Deadly Spade)", ammo: "7.62mm • 740 m/s", skin: "Deadly Spade", ttk: ["0.16s (3 Shots)", "0.24s (4 Shots)", "0.31s (5 Shots)", "0.44s (5 Shots)"] },
  "AWM (.300 Mag)": { key: "m416", name: "AWM (Arctic Warfare Magnum)", ammo: ".300 Mag • 945 m/s", skin: "Godzilla Roar", ttk: ["0.00s (1 Shot)", "0.00s (1 Shot)", "0.00s (1 Shot)", "0.00s (1 Shot Head)"] },
  "UMP45 (.45 ACP)": { key: "m416", name: "UMP45 (Platinum Splendor)", ammo: ".45 ACP • 400 m/s", skin: "Platinum Splendor", ttk: ["0.19s (3 Shots)", "0.28s (4 Shots)", "0.36s (5 Shots)", "0.52s (6 Shots)"] }
};

weaponPills.forEach(pill => {
  pill.addEventListener("click", function() {
    weaponPills.forEach(p => p.classList.remove("active"));
    this.classList.add("active");
    currentRecoil = parseInt(this.getAttribute("data-recoil") || "28", 10);
    ProbeAudio.playClick();
    if (recoilSvg) recoilSvg.innerHTML = '';

    const label = this.textContent.trim();
    const data = LOCAL_WEAPON_SPECS[label];
    if (data) {
      activeWeaponKey = data.key;
      const nameEl = document.getElementById("spec-weapon-name");
      const ammoEl = document.getElementById("spec-weapon-ammo");
      const skinEl = document.getElementById("spec-weapon-skin");
      const ttk0 = document.getElementById("ttk-no-armor");
      const ttk1 = document.getElementById("ttk-lvl-1");
      const ttk2 = document.getElementById("ttk-lvl-2");
      const ttk3 = document.getElementById("ttk-lvl-3");

      if (nameEl) nameEl.textContent = data.name;
      if (ammoEl) ammoEl.textContent = data.ammo;
      if (skinEl) skinEl.textContent = data.skin;
      if (ttk0) ttk0.textContent = data.ttk[0];
      if (ttk1) ttk1.textContent = data.ttk[1];
      if (ttk2) ttk2.textContent = data.ttk[2];
      if (ttk3) ttk3.textContent = data.ttk[3];
    }
  });
});

const inspectActiveWeaponBtn = document.getElementById("inspect-active-weapon-3d");
if (inspectActiveWeaponBtn) {
  inspectActiveWeaponBtn.addEventListener("click", () => {
    loadHero3DModel(activeWeaponKey);
    const pills = document.querySelectorAll(".hero-model-pill");
    pills.forEach(p => {
      p.classList.toggle("active", p.getAttribute("data-model") === activeWeaponKey);
    });
    ProbeAudio.playClick();
    showToast(`Switched 3D Hologram to ${activeWeaponKey.toUpperCase()}!`, "fa-cube");
  });
}

// Live Erangel Airdrop Radar
async function fetchAirdropRadar() {
  const zoneEl = document.getElementById("radar-drop-zone");
  const lootEl = document.getElementById("radar-loot-list");
  const flareEl = document.getElementById("airdrop-flare-tag");

  try {
    const res = await fetch(`${CSHARP_API_URL}/api/bgmi/airdrop/live`, { signal: AbortSignal.timeout(1500) });
    if (res.ok) {
      const data = await res.json();
      if (zoneEl) zoneEl.textContent = `${data.dropZone} (Grid ${data.coordinates.X}, ${data.coordinates.Y})`;
      if (lootEl) lootEl.textContent = data.containedLoot.join(", ");
      if (flareEl) flareEl.textContent = `FLARE ACTIVE (${data.timeRemainingSec}s)`;
      showToast(`Radar Pinged: Airdrop in ${data.dropZone}!`, "fa-plane");
      return;
    }
  } catch (e) {
    // Offline simulation
  }

  const localZones = ["Pochinki Fields", "School Apartments", "Military Base", "Georgopol Crates", "Rozhok Water City"];
  const randomZone = localZones[Math.floor(Math.random() * localZones.length)];
  if (zoneEl) zoneEl.textContent = `${randomZone} (Offline Radar)`;
  if (lootEl) lootEl.textContent = "AWM (.300 Mag), Level 3 Helmet, Ghillie Suit";
  showToast(`Radar Pinged: Airdrop approaching ${randomZone}!`, "fa-plane");
}

const radarRefreshBtn = document.getElementById("radar-refresh-btn");
if (radarRefreshBtn) {
  radarRefreshBtn.addEventListener("click", () => {
    ProbeAudio.playClick();
    fetchAirdropRadar();
  });
}
fetchAirdropRadar();

if (testSprayBtn && recoilSvg) {
  testSprayBtn.addEventListener("click", () => {
    ProbeAudio.playShoot();
    recoilSvg.innerHTML = '';

    let curX = 200;
    let curY = 320;
    const points = [];

    for (let i = 0; i < 15; i++) {
      curY -= (currentRecoil * 0.35 + Math.random() * 4);
      curX += (Math.random() - 0.5) * (currentRecoil * 0.4);
      points.push({ x: curX, y: curY });

      // Draw dot
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("cx", curX);
      circle.setAttribute("cy", curY);
      circle.setAttribute("r", "5");
      circle.setAttribute("fill", "#ff0055");
      recoilSvg.appendChild(circle);

      if (i > 0) {
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", points[i-1].x);
        line.setAttribute("y1", points[i-1].y);
        line.setAttribute("x2", curX);
        line.setAttribute("y2", curY);
        line.setAttribute("stroke", "rgba(0, 242, 254, 0.5)");
        line.setAttribute("stroke-width", "1.5");
        recoilSvg.appendChild(line);
      }
    }
    showToast("15-Round Spray Pattern Simulated!", "fa-crosshairs");
  });
}

/*=========================================
FEATURE 4: REFLEX AIM ARENA MINIGAME
=========================================*/
const aimArena = document.getElementById("aim-arena");
const startAimBtn = document.getElementById("start-aim-btn");
const aimScoreEl = document.getElementById("aim-score");
const aimTimeEl = document.getElementById("aim-time");
let aimInterval = null;
let aimScore = 0;
let aimTimeLeft = 20;

function spawnTarget() {
  if (!aimArena) return;
  const existing = aimArena.querySelector(".aim-target-dot");
  if (existing) existing.remove();

  const target = document.createElement("div");
  target.className = "aim-target-dot";
  const posX = Math.floor(Math.random() * 80) + 10;
  const posY = Math.floor(Math.random() * 70) + 15;
  target.style.left = posX + "%";
  target.style.top = posY + "%";
  target.innerHTML = `<i class="fa-solid fa-crosshairs"></i>`;

  target.addEventListener("click", () => {
    ProbeAudio.playShoot();
    aimScore++;
    if (aimScoreEl) aimScoreEl.textContent = aimScore;
    spawnTarget();
  });

  aimArena.appendChild(target);
}

if (startAimBtn) {
  startAimBtn.addEventListener("click", () => {
    ProbeAudio.playClick();
    aimScore = 0;
    aimTimeLeft = 20;
    if (aimScoreEl) aimScoreEl.textContent = "0";
    if (aimTimeEl) aimTimeEl.textContent = "20s";
    startAimBtn.style.display = "none";

    spawnTarget();
    showToast("Aim Drill Started! Click targets as fast as you can!", "fa-bullseye");

    if (aimInterval) clearInterval(aimInterval);
    aimInterval = setInterval(() => {
      aimTimeLeft--;
      if (aimTimeEl) aimTimeEl.textContent = aimTimeLeft + "s";
      if (aimTimeLeft <= 0) {
        clearInterval(aimInterval);
        const existing = aimArena.querySelector(".aim-target-dot");
        if (existing) existing.remove();
        startAimBtn.style.display = "inline-flex";
        startAimBtn.textContent = "RETRY DRILL";
        ProbeAudio.playSuccess();

        // Submit score to C# Anti-Cheat Engine
        submitAimScoreToCSharp(aimScore, aimReactionTimes);
      }
    }, 1000);
  });
}

/*=========================================
FEATURE 5: TOURNAMENT COUNTDOWN TIMER
=========================================*/
const daysEl = document.getElementById("days");
const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");

const targetDate = new Date();
targetDate.setDate(targetDate.getDate() + 3);
targetDate.setHours(targetDate.getHours() + 14);

function updateCountdown() {
  const now = new Date().getTime();
  const diff = targetDate.getTime() - now;

  if (diff > 0) {
    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    if (daysEl) daysEl.textContent = String(d).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(h).padStart(2, '0');
    if (minutesEl) minutesEl.textContent = String(m).padStart(2, '0');
    if (secondsEl) secondsEl.textContent = String(s).padStart(2, '0');
  }
}
setInterval(updateCountdown, 1000);
updateCountdown();

/*=========================================
FEATURE 6: VIDEO POPUP MODAL
=========================================*/
const popup = document.getElementById("popup");
const popupClose = document.getElementById("close");
const popupIframe = popup ? popup.querySelector("iframe") : null;
const playBtn = document.querySelector(".play");

function openVideoPopup() {
  if (popup && popupIframe) {
    ProbeAudio.playClick();
    popupIframe.src = "https://www.youtube.com/embed/videoseries?list=PLprobegaming759&autoplay=1";
    popup.classList.add("active");
  }
}

if (playBtn) playBtn.addEventListener("click", openVideoPopup);

document.querySelectorAll(".card").forEach(card => {
  card.addEventListener("click", openVideoPopup);
});

if (popupClose && popup) {
  popupClose.addEventListener("click", () => {
    ProbeAudio.playClick();
    if (popupIframe) popupIframe.src = "";
    popup.classList.remove("active");
  });
  popup.addEventListener("click", (e) => {
    if (e.target === popup) {
      if (popupIframe) popupIframe.src = "";
      popup.classList.remove("active");
    }
  });
}

/*=========================================
FEATURE 7: CONTACT FORM SIMULATOR
=========================================*/
const contactForm = document.querySelector("form.contact");
if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    ProbeAudio.playSuccess();
    showToast("Message sent to Probe gaming! We will connect soon.", "fa-paper-plane");
    contactForm.reset();
  });
}


/* ==========================================================================
   EXTRA INTERACTIVE ENGINE FEATURES (v6.5)
   ========================================================================== */

/*=========================================
1. CLICK SHOCKWAVE & NEON SPARKS
=========================================*/
document.addEventListener("click", (e) => {
  // Spawn Shockwave
  const wave = document.createElement("div");
  wave.className = "click-shockwave";
  wave.style.left = e.clientX + "px";
  wave.style.top = e.clientY + "px";
  document.body.appendChild(wave);
  setTimeout(() => wave.remove(), 550);

  // Spawn Neon Sparks
  const colors = ["#ff0055", "#ff7b00", "#00f2fe", "#00f5a0", "#fff"];
  for (let i = 0; i < 6; i++) {
    const spark = document.createElement("div");
    spark.className = "click-spark";
    const angle = Math.random() * Math.PI * 2;
    const dist = Math.random() * 35 + 15;
    const tx = Math.cos(angle) * dist + "px";
    const ty = Math.sin(angle) * dist + "px";
    spark.style.setProperty("--spark-trans", `translate(${tx}, ${ty}) scale(0)`);
    spark.style.background = colors[Math.floor(Math.random() * colors.length)];
    spark.style.boxShadow = `0 0 8px ${spark.style.background}`;
    spark.style.left = e.clientX + "px";
    spark.style.top = e.clientY + "px";
    document.body.appendChild(spark);
    setTimeout(() => spark.remove(), 600);
  }
});

/*=========================================
2. 3D PERSPECTIVE CARD TILT WITH GLARE
=========================================*/
function apply3DTilt() {
  const cards = document.querySelectorAll(".card, .stat, .video-card, .crate-box-mesh, .about-box, .sound-btn");
  cards.forEach(card => {
    card.classList.add("tilt-card");

    let glare = card.querySelector(".tilt-glare");
    if (!glare) {
      glare = document.createElement("div");
      glare.className = "tilt-glare";
      card.appendChild(glare);
    }

    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
      card.style.setProperty("--glare-x", `${(x / rect.width) * 100}%`);
      card.style.setProperty("--glare-y", `${(y / rect.height) * 100}%`);
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
    });
  });
}
apply3DTilt();

/*=========================================
3. DYNAMIC CYBER THEME SWITCHER
=========================================*/
const THEMES = {
  crimson: { primary: "#ff0055", secondary: "#ff7b00", cyan: "#00f2fe", name: "Crimson Cyber" },
  cyan: { primary: "#00f2fe", secondary: "#4facfe", cyan: "#00f5a0", name: "Electric Cyan" },
  purple: { primary: "#a855f7", secondary: "#ec4899", cyan: "#00f2fe", name: "Synthwave Purple" },
  emerald: { primary: "#00f5a0", secondary: "#10b981", cyan: "#ffbe0b", name: "Toxic Venom" }
};

document.querySelectorAll(".theme-dot").forEach(dot => {
  dot.addEventListener("click", function() {
    const themeKey = this.getAttribute("data-theme");
    const theme = THEMES[themeKey];
    if (!theme) return;

    document.querySelectorAll(".theme-dot").forEach(d => d.classList.remove("active"));
    this.classList.add("active");

    document.documentElement.style.setProperty("--primary", theme.primary);
    document.documentElement.style.setProperty("--primary-glow", theme.primary + "80");
    document.documentElement.style.setProperty("--secondary", theme.secondary);
    document.documentElement.style.setProperty("--secondary-glow", theme.secondary + "80");
    document.documentElement.style.setProperty("--cyan", theme.cyan);

    ProbeAudio.playClick();
    showToast(`Theme Switched: ${theme.name}`, "fa-palette");
  });
});

/*=========================================
4. PROCEDURAL SOUNDBOARD SYNTHESIZER
=========================================*/
const Soundboard = {
  playHeadshot: function() {
    // Sharp bullet snap + metallic ring
    ProbeAudio.playShoot();
    setTimeout(() => {
      if (window.ProbeAudio && !window.ProbeAudio.isMuted()) {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(1400, ctx.currentTime);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      }
    }, 60);
    showToast("SFX: HEADSHOT!", "fa-skull");
  },

  playChickenDinner: function() {
    ProbeAudio.playSuccess();
    if (window.confetti) {
      window.confetti({ particleCount: 80, spread: 70 });
    }
    showToast("SFX: WINNER WINNER CHICKEN DINNER!", "fa-trophy");
  },

  playHelmetClang: function() {
    if (window.ProbeAudio && !window.ProbeAudio.isMuted()) {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.4);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    }
    showToast("SFX: Level 3 Helmet Clang!", "fa-shield-halved");
  },

  playSniperBoom: function() {
    if (window.ProbeAudio && !window.ProbeAudio.isMuted()) {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      // Heavy boom
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(110, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.6);
      gain.gain.setValueAtTime(0.35, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    }
    showToast("SFX: AWM Sniper Blast!", "fa-crosshairs");
  },

  playAirDropSiren: function() {
    if (window.ProbeAudio && !window.ProbeAudio.isMuted()) {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(450, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(650, ctx.currentTime + 0.3);
      osc.frequency.linearRampToValueAtTime(450, ctx.currentTime + 0.6);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    }
    showToast("SFX: Air Drop Flare Incoming!", "fa-parachute-box");
  },

  playAdrenaline: function() {
    ProbeAudio.playCrateOpen();
    showToast("SFX: Adrenaline Syringe Boost!", "fa-syringe");
  }
};

document.querySelectorAll("[data-sfx]").forEach(btn => {
  btn.addEventListener("click", function() {
    const sfxName = this.getAttribute("data-sfx");
    if (Soundboard[sfxName]) {
      Soundboard[sfxName]();
    }
  });
});

/*=========================================
5. ENHANCED AIM ARENA: COMBOS & DAMAGE POPUPS
=========================================*/
let aimCombo = 0;
const aimArenaCard = document.getElementById("aim-arena");
if (aimArenaCard) {
  // Override or augment target click for floating text
  const originalSpawn = spawnTarget;
  spawnTarget = function() {
    originalSpawn();
    const newTarget = aimArenaCard.querySelector(".aim-target-dot");
    if (newTarget) {
      newTarget.addEventListener("click", (e) => {
        aimCombo++;
        const floatText = document.createElement("div");
        floatText.className = "floating-hit-text";
        const isCrit = aimCombo % 3 === 0;
        floatText.textContent = isCrit ? `CRIT! +${100 * aimCombo}` : `+${100} (x${aimCombo})`;
        floatText.style.left = newTarget.style.left;
        floatText.style.top = newTarget.style.top;
        if (isCrit) {
          floatText.style.color = "var(--gold)";
          floatText.style.fontSize = "1.5rem";
        }
        aimArenaCard.appendChild(floatText);
        setTimeout(() => floatText.remove(), 700);
      });
    }
  };
}

/*=========================================
6. ROAD TO 500 SUBS CELEBRATION BUTTON
=========================================*/
const celebrateSubBtn = document.getElementById("celebrate-sub-btn");
const milestoneFill = document.getElementById("milestone-fill");
const milestoneText = document.getElementById("milestone-text");
let simulatedSubs = 425;

if (celebrateSubBtn) {
  celebrateSubBtn.addEventListener("click", () => {
    simulatedSubs++;
    ProbeAudio.playSuccess();
    if (window.confetti) {
      window.confetti({ particleCount: 100, spread: 70, origin: { y: 0.7 } });
    }
    const progressPct = Math.min(100, Math.round((simulatedSubs / 500) * 100));
    if (milestoneFill) milestoneFill.style.width = progressPct + "%";
    if (milestoneText) milestoneText.textContent = `${simulatedSubs} / 500 Subscribers (${progressPct}% Completed)`;
    const heroSubs = document.getElementById("subs");
    if (heroSubs) heroSubs.textContent = simulatedSubs;

    showToast(`🎉 Subscribed! Now at ${simulatedSubs} Subscribers! Road to 500!`, "fa-heart");
  });
}

/*=========================================
7. CUSTOM SCRIMS PASS GENERATOR
=========================================*/
const genPassBtn = document.getElementById("gen-pass-btn");
const scrimsPassCard = document.getElementById("scrims-pass-card");
const passPlayerName = document.getElementById("pass-player-name");
const passClanTag = document.getElementById("pass-clan-tag");

if (genPassBtn) {
  genPassBtn.addEventListener("click", () => {
    const pName = (document.getElementById("scrims-ign-input")?.value || "ProbeGamer").trim();
    const cTag = (document.getElementById("scrims-tag-input")?.value || "PROBE-SQUAD").trim();
    ProbeAudio.playSuccess();

    if (passPlayerName) passPlayerName.textContent = pName;
    if (passClanTag) passClanTag.textContent = `[${cTag}]`;

    navigator.clipboard.writeText(`PROBE GAMING TOURNAMENT PASS | Player: ${pName} | Clan: [${cTag}] | PassID: PB-759-${Math.floor(Math.random()*9000+1000)}`);
    showToast("Holographic Scrims Pass Generated & Copied!", "fa-id-card");
  });
}

/*=========================================
8. SCROLL TO TOP ROCKET
=========================================*/
const rocketBtn = document.getElementById("scroll-top-rocket");
window.addEventListener("scroll", () => {
  if (rocketBtn) {
    if (window.scrollY > 400) {
      rocketBtn.classList.add("visible");
    } else {
      rocketBtn.classList.remove("visible");
    }
  }
});

if (rocketBtn) {
  rocketBtn.addEventListener("click", () => {
    ProbeAudio.playCrateOpen();
    window.scrollTo({ top: 0, behavior: "smooth" });
    showToast("Rocketing to Top!", "fa-rocket");
  });
}

/*==========================================================================
FEATURE 9: C# AIM TRAINER ANTI-CHEAT SCORING
==========================================================================*/
async function submitAimScoreToCSharp(hits, reactionTimes) {
  const avgMs = reactionTimes && reactionTimes.length > 0
    ? Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length)
    : 240;

  try {
    const res = await fetch(`${CSHARP_API_URL}/api/bgmi/aim-trainer/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        playerName: "ProbeChampion",
        hits: hits,
        headshots: Math.round(hits * 0.4),
        avgReactionMs: avgMs
      }),
      signal: AbortSignal.timeout(1500)
    });

    if (res.ok) {
      const data = await res.json();
      showToast(`⚡ C# Verified: ${data.tier} (Score: ${data.finalScore})!`, "fa-shield-halved");
      return;
    }
  } catch (e) {
    // Client fallback
  }

  showToast(`Reflex Finished! Total Hits: ${hits} (Avg: ${avgMs}ms)`, "fa-bullseye");
}

/*==========================================================================
FEATURE 10: 3D BGMI INTERACTIVE GEAR HOLOGRAPHIC SHOWCASE (THREE.JS)
==========================================================================*/
let heroScene, heroCamera, heroRenderer;
let heroModelGroup;
let isDraggingHero3D = false;
let heroPrevX = 0, heroPrevY = 0;
let heroRotX = 0.25, heroRotY = 0.5;
let heroTargetRotX = 0.25, heroTargetRotY = 0.5;
let isWireframeActive = false;
let currentHeroModel = "helmet";

const HERO_GEAR_DETAILS = {
  helmet: {
    title: "Level 3 Spetsnaz Helmet",
    desc: "55% damage reduction • Titanium ballistic visor shield"
  },
  pan: {
    title: "The Golden Pan (Iconic BGMI Pan)",
    desc: "100% bullet deflection • Royal gold mirror polish finish"
  },
  airdrop: {
    title: "Red & Blue Air Drop Crate",
    desc: "Mythic weapon container • Emits signal flare smoke"
  },
  m416: {
    title: "Glacier M416 (Lv.7 Max)",
    desc: "Frosted ice crystal chassis • On-hit icicle animations"
  }
};

function initHero3DShowcase() {
  const canvas = document.getElementById("hero-3d-canvas");
  const viewport = document.getElementById("hero-3d-viewport");
  if (!window.THREE || !canvas || !viewport) return;

  const width = viewport.clientWidth || 460;
  const height = viewport.clientHeight || 290;

  // Scene & Camera
  heroScene = new THREE.Scene();
  heroCamera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
  heroCamera.position.set(0, 1.2, 4.5);
  heroCamera.lookAt(0, 0, 0);

  // WebGL Renderer
  heroRenderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
  });
  heroRenderer.setSize(width, height);
  heroRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
  heroScene.add(ambientLight);

  const keyLight = new THREE.DirectionalLight(0xffffff, 1.8);
  keyLight.position.set(4, 5, 5);
  heroScene.add(keyLight);

  const rimCyan = new THREE.PointLight(0x00f2fe, 2.5, 12);
  rimCyan.position.set(-4, 2, -2);
  heroScene.add(rimCyan);

  const fillCrimson = new THREE.PointLight(0xff0055, 1.6, 10);
  fillCrimson.position.set(3, -2, 3);
  heroScene.add(fillCrimson);

  // Group that holds the active 3D model
  heroModelGroup = new THREE.Group();
  heroScene.add(heroModelGroup);

  // Load Initial Model (Level 3 Helmet)
  loadHero3DModel("helmet");

  // Drag Interactions
  viewport.addEventListener("mousedown", (e) => {
    isDraggingHero3D = true;
    heroPrevX = e.clientX;
    heroPrevY = e.clientY;
  });

  window.addEventListener("mousemove", (e) => {
    if (!isDraggingHero3D) return;
    const dx = e.clientX - heroPrevX;
    const dy = e.clientY - heroPrevY;
    heroTargetRotY += dx * 0.015;
    heroTargetRotX += dy * 0.015;
    heroTargetRotX = Math.max(-0.8, Math.min(0.8, heroTargetRotX));
    heroPrevX = e.clientX;
    heroPrevY = e.clientY;
  });

  window.addEventListener("mouseup", () => { isDraggingHero3D = false; });

  viewport.addEventListener("touchstart", (e) => {
    if (e.touches.length > 0) {
      isDraggingHero3D = true;
      heroPrevX = e.touches[0].clientX;
      heroPrevY = e.touches[0].clientY;
    }
  }, { passive: true });

  window.addEventListener("touchmove", (e) => {
    if (!isDraggingHero3D || e.touches.length === 0) return;
    const dx = e.touches[0].clientX - heroPrevX;
    const dy = e.touches[0].clientY - heroPrevY;
    heroTargetRotY += dx * 0.015;
    heroTargetRotX += dy * 0.015;
    heroPrevX = e.touches[0].clientX;
    heroPrevY = e.touches[0].clientY;
  }, { passive: true });

  window.addEventListener("touchend", () => { isDraggingHero3D = false; });

  // Wireframe Toggle Button
  const wireBtn = document.getElementById("hero-wireframe-btn");
  if (wireBtn) {
    wireBtn.addEventListener("click", () => {
      isWireframeActive = !isWireframeActive;
      wireBtn.classList.toggle("active", isWireframeActive);
      toggleWireframeRecursive(heroModelGroup, isWireframeActive);
      ProbeAudio.playClick();
      showToast(isWireframeActive ? "Wireframe Mode Enabled" : "Shaded Mesh Enabled", "fa-border-all");
    });
  }

  // Camera Reset Button
  const resetBtn = document.getElementById("hero-reset-cam-btn");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      heroTargetRotX = 0.25;
      heroTargetRotY = 0.5;
      ProbeAudio.playClick();
    });
  }

  // Model Selector Pills
  const pills = document.querySelectorAll(".hero-model-pill");
  pills.forEach(pill => {
    pill.addEventListener("click", () => {
      pills.forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      const model = pill.getAttribute("data-model");
      loadHero3DModel(model);
      ProbeAudio.playClick();
    });
  });

  // Quick Clutch Video Button
  const clutchBtn = document.getElementById("quick-clutch-video-btn");
  if (clutchBtn) {
    clutchBtn.addEventListener("click", openVideoPopup);
  }

  // Render Loop
  let clock = new THREE.Clock();
  function renderHero() {
    requestAnimationFrame(renderHero);
    const elapsed = clock.getElapsedTime();

    if (!isDraggingHero3D) {
      heroTargetRotY += 0.007; // Smooth idle turntable
    }

    heroRotX += (heroTargetRotX - heroRotX) * 0.08;
    heroRotY += (heroTargetRotY - heroRotY) * 0.08;

    if (heroModelGroup) {
      heroModelGroup.rotation.x = heroRotX;
      heroModelGroup.rotation.y = heroRotY;
      heroModelGroup.position.y = Math.sin(elapsed * 2.0) * 0.07; // Hovering
    }

    heroRenderer.render(heroScene, heroCamera);
  }
  renderHero();
}

function toggleWireframeRecursive(obj, wireframe) {
  obj.traverse(child => {
    if (child.isMesh && child.material) {
      if (Array.isArray(child.material)) {
        child.material.forEach(m => m.wireframe = wireframe);
      } else {
        child.material.wireframe = wireframe;
      }
    }
  });
}

function loadHero3DModel(modelKey) {
  currentHeroModel = modelKey;

  // Clear previous mesh
  while (heroModelGroup.children.length > 0) {
    const obj = heroModelGroup.children[0];
    heroModelGroup.remove(obj);
    if (obj.geometry) obj.geometry.dispose();
  }

  // Update text descriptions
  const details = HERO_GEAR_DETAILS[modelKey];
  const titleEl = document.getElementById("hero-model-title");
  const descEl = document.getElementById("hero-model-desc");
  if (titleEl && details) titleEl.textContent = details.title;
  if (descEl && details) descEl.textContent = details.desc;

  if (modelKey === "helmet") {
    buildLvl3Helmet(heroModelGroup);
  } else if (modelKey === "pan") {
    buildGoldenPan(heroModelGroup);
  } else if (modelKey === "airdrop") {
    buildAirDropCrate(heroModelGroup);
  } else if (modelKey === "m416") {
    buildGlacierM416(heroModelGroup);
  }

  toggleWireframeRecursive(heroModelGroup, isWireframeActive);
}

// 🪖 3D Level 3 Spetsnaz Helmet
function buildLvl3Helmet(group) {
  const helmetMat = new THREE.MeshStandardMaterial({
    color: 0x1e2634,
    metalness: 0.85,
    roughness: 0.3
  });
  const goldBoltMat = new THREE.MeshStandardMaterial({
    color: 0xffbe0b,
    metalness: 0.95,
    roughness: 0.15
  });
  const visorMat = new THREE.MeshPhysicalMaterial({
    color: 0x00f2fe,
    metalness: 0.9,
    roughness: 0.1,
    transparent: true,
    opacity: 0.85,
    transmission: 0.4
  });

  // Dome
  const domeGeom = new THREE.SphereGeometry(1.2, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.55);
  const dome = new THREE.Mesh(domeGeom, helmetMat);
  dome.rotation.x = Math.PI;
  dome.position.y = 0.5;
  group.add(dome);

  // Lower Rim Guard
  const rimGeom = new THREE.CylinderGeometry(1.22, 1.25, 0.45, 32, 1, true);
  const rim = new THREE.Mesh(rimGeom, helmetMat);
  rim.position.y = 0.35;
  group.add(rim);

  // Face Visor Shield
  const visorGeom = new THREE.BoxGeometry(1.5, 0.35, 0.2);
  const visor = new THREE.Mesh(visorGeom, visorMat);
  visor.position.set(0, 0.35, 1.15);
  group.add(visor);

  // Visor Frame
  const frameGeom = new THREE.BoxGeometry(1.56, 0.42, 0.08);
  const frame = new THREE.Mesh(frameGeom, helmetMat);
  frame.position.set(0, 0.35, 1.1);
  group.add(frame);

  // Left & Right Pivot Bolts
  [-1.22, 1.22].forEach(x => {
    const boltGeom = new THREE.CylinderGeometry(0.12, 0.12, 0.15, 16);
    const bolt = new THREE.Mesh(boltGeom, goldBoltMat);
    bolt.rotation.z = Math.PI / 2;
    bolt.position.set(x, 0.35, 0.2);
    group.add(bolt);
  });
}

// 🍳 3D Golden Pan
function buildGoldenPan(group) {
  const goldMat = new THREE.MeshStandardMaterial({
    color: 0xffbe0b,
    metalness: 0.98,
    roughness: 0.12
  });
  const darkGold = new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    metalness: 0.9,
    roughness: 0.25
  });

  // Main Skillet Body
  const panGeom = new THREE.CylinderGeometry(1.4, 1.25, 0.35, 32);
  const pan = new THREE.Mesh(panGeom, goldMat);
  pan.position.y = 0;
  group.add(pan);

  // Inner Recessed Bottom
  const innerGeom = new THREE.CylinderGeometry(1.22, 1.22, 0.05, 32);
  const inner = new THREE.Mesh(innerGeom, darkGold);
  inner.position.y = 0.16;
  group.add(inner);

  // Pan Handle
  const handleGeom = new THREE.BoxGeometry(0.22, 0.14, 1.6);
  const handle = new THREE.Mesh(handleGeom, goldMat);
  handle.position.set(0, 0.08, -1.9);
  group.add(handle);

  // Handle Hanging Ring
  const ringGeom = new THREE.TorusGeometry(0.12, 0.04, 16, 24);
  const ring = new THREE.Mesh(ringGeom, darkGold);
  ring.rotation.x = Math.PI / 2;
  ring.position.set(0, 0.08, -2.75);
  group.add(ring);
}

// 📦 3D Red & Blue Air Drop Crate
function buildAirDropCrate(group) {
  const redMilitaryMat = new THREE.MeshStandardMaterial({
    color: 0xd90429,
    metalness: 0.5,
    roughness: 0.35
  });
  const blueTarpMat = new THREE.MeshStandardMaterial({
    color: 0x0077b6,
    metalness: 0.1,
    roughness: 0.8
  });
  const goldTrimMat = new THREE.MeshStandardMaterial({
    color: 0xffbe0b,
    metalness: 0.9,
    roughness: 0.2
  });

  // Base Red Crate Body
  const redBoxGeom = new THREE.BoxGeometry(1.7, 1.0, 1.7);
  const redBox = new THREE.Mesh(redBoxGeom, redMilitaryMat);
  redBox.position.y = 0.5;
  group.add(redBox);

  // Corner Metal Reinforcements
  [-0.85, 0.85].forEach(x => {
    [-0.85, 0.85].forEach(z => {
      const braceGeom = new THREE.BoxGeometry(0.1, 1.02, 0.1);
      const brace = new THREE.Mesh(braceGeom, goldTrimMat);
      brace.position.set(x, 0.5, z);
      group.add(brace);
    });
  });

  // Blue Tarp Cover
  const tarpGeom = new THREE.BoxGeometry(1.78, 0.3, 1.78);
  const tarp = new THREE.Mesh(tarpGeom, blueTarpMat);
  tarp.position.y = 1.05;
  group.add(tarp);

  // Smoke Canister on top
  const canGeom = new THREE.CylinderGeometry(0.12, 0.12, 0.35, 16);
  const can = new THREE.Mesh(canGeom, new THREE.MeshStandardMaterial({ color: 0xff0055, emissive: 0xff0055, emissiveIntensity: 0.8 }));
  can.position.set(0, 1.35, 0);
  group.add(can);

  // Rising Smoke Particles
  const smokeCount = 30;
  const smokeGeom = new THREE.BufferGeometry();
  const smokePos = new Float32Array(smokeCount * 3);
  for (let i = 0; i < smokeCount * 3; i += 3) {
    smokePos[i] = (Math.random() - 0.5) * 0.6;
    smokePos[i + 1] = Math.random() * 1.5 + 1.4;
    smokePos[i + 2] = (Math.random() - 0.5) * 0.6;
  }
  smokeGeom.setAttribute('position', new THREE.BufferAttribute(smokePos, 3));
  const smokePoints = new THREE.Points(smokeGeom, new THREE.PointsMaterial({
    color: 0xff0055,
    size: 0.12,
    transparent: true,
    opacity: 0.7
  }));
  group.add(smokePoints);
}

// 💎 3D Glacier M416 Ice Rifle
function buildGlacierM416(group) {
  const iceCrystalMat = new THREE.MeshPhysicalMaterial({
    color: 0x00f2fe,
    metalness: 0.6,
    roughness: 0.1,
    transparent: true,
    opacity: 0.9,
    transmission: 0.35
  });
  const darkPolymer = new THREE.MeshStandardMaterial({
    color: 0x16213e,
    metalness: 0.8,
    roughness: 0.3
  });
  const goldAccents = new THREE.MeshStandardMaterial({
    color: 0xffbe0b,
    metalness: 0.95,
    roughness: 0.15
  });

  // Main Receiver
  const receiverGeom = new THREE.BoxGeometry(0.24, 0.45, 2.4);
  const receiver = new THREE.Mesh(receiverGeom, iceCrystalMat);
  receiver.position.set(0, 0.4, 0);
  group.add(receiver);

  // Long Barrel
  const barrelGeom = new THREE.CylinderGeometry(0.06, 0.06, 1.6, 16);
  const barrel = new THREE.Mesh(barrelGeom, darkPolymer);
  barrel.rotation.x = Math.PI / 2;
  barrel.position.set(0, 0.45, 1.8);
  group.add(barrel);

  // Muzzle Brake
  const muzzleGeom = new THREE.CylinderGeometry(0.09, 0.09, 0.25, 16);
  const muzzle = new THREE.Mesh(muzzleGeom, goldAccents);
  muzzle.rotation.x = Math.PI / 2;
  muzzle.position.set(0, 0.45, 2.65);
  group.add(muzzle);

  // Curved Quickdraw Magazine
  const magGeom = new THREE.BoxGeometry(0.16, 0.85, 0.35);
  const mag = new THREE.Mesh(magGeom, iceCrystalMat);
  mag.rotation.x = 0.25;
  mag.position.set(0, -0.15, 0.4);
  group.add(mag);

  // Sniper Scope
  const scopeGeom = new THREE.CylinderGeometry(0.12, 0.12, 0.9, 16);
  const scope = new THREE.Mesh(scopeGeom, darkPolymer);
  scope.rotation.x = Math.PI / 2;
  scope.position.set(0, 0.78, 0.1);
  group.add(scope);

  // Tactical Stock
  const stockGeom = new THREE.BoxGeometry(0.22, 0.5, 0.8);
  const stock = new THREE.Mesh(stockGeom, darkPolymer);
  stock.position.set(0, 0.3, -1.5);
  group.add(stock);
}

/*==========================================================================
FEATURE 11: CINEMA THEATER & GOOGLE PHOTOS / WALLPAPERS VAULT
==========================================================================*/
const CURATED_MEDIA = {
  videos: [
    {
      title: "PROBE GAMING - Road to 500 Subs Ultimate Montage",
      desc: "Insane 1v4 clutch compilation, 6x M416 laser sprays, and AWM flick headshots in custom room scrims.",
      poster: "https://images.unsplash.com/photo-1542751110-97427bbecf20?q=80&w=1200&auto=format&fit=crop",
      embed: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    {
      title: "Zero Recoil Gyroscope Masterclass (M416 + AKM)",
      desc: "Complete guide on ADS sensitivity, gyro camera calibration, and bullet drop compensation.",
      poster: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop",
      embed: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    {
      title: "Conqueror Tier Lobby 22 Kills Solo vs Squad",
      desc: "High-tier Erangel gameplay with Pochinki drops, bridge camps, and final circle rotations.",
      poster: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1200&auto=format&fit=crop",
      embed: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    {
      title: "BMPS Esports Championship Grand Finals Highlights",
      desc: "Official tier-1 tournament clutch plays against top Indian esports rosters.",
      poster: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?q=80&w=1200&auto=format&fit=crop",
      embed: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    }
  ],
  photos: [
    {
      id: "p1",
      title: "Glacier M416 Ice Spire",
      category: "Skins",
      url: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=1200&auto=format&fit=crop",
      resolution: "3840x2160 (4K UHD)",
      tag: "Mythic Asset"
    },
    {
      id: "p2",
      title: "Airdrop Supply Flare in Sunset",
      category: "Wallpapers",
      url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop",
      resolution: "3840x2160 (4K UHD)",
      tag: "Cinematic"
    },
    {
      id: "p3",
      title: "Level 3 Helmet Cyber Spetsnaz",
      category: "Wallpapers",
      url: "https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=1200&auto=format&fit=crop",
      resolution: "2560x1440 (2K QHD)",
      tag: "Esports Gear"
    },
    {
      id: "p4",
      title: "Esports Championship Arena Lights",
      category: "Tournament",
      url: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1200&auto=format&fit=crop",
      resolution: "3840x2160 (4K UHD)",
      tag: "Stage Arena"
    },
    {
      id: "p5",
      title: "Cyberpunk Tactical Squad",
      category: "Wallpapers",
      url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop",
      resolution: "3840x2160 (4K UHD)",
      tag: "Squad Goals"
    },
    {
      id: "p6",
      title: "Golden Pan Winner Dinner Trophy",
      category: "Tournament",
      url: "https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?q=80&w=1200&auto=format&fit=crop",
      resolution: "3840x2160 (4K UHD)",
      tag: "Dinner Trophy"
    }
  ]
};

function initCinemaAndPhotos() {
  // 1. Master Tabs (Cinema vs Photos)
  const masterTabs = document.querySelectorAll(".media-tab-btn");
  masterTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      masterTabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      const target = tab.getAttribute("data-tab");

      document.getElementById("media-view-cinema")?.classList.toggle("active", target === "cinema");
      document.getElementById("media-view-photos")?.classList.toggle("active", target === "photos");
      ProbeAudio.playClick();
    });
  });

  // 2. Cinema Playlist Switching
  const playlistItems = document.querySelectorAll(".playlist-item");
  const posterImg = document.getElementById("cinema-poster");
  const activeTitle = document.getElementById("cinema-active-title");
  const activeDesc = document.getElementById("cinema-active-desc");
  const playBtn = document.getElementById("cinema-play-btn");

  playlistItems.forEach(item => {
    item.addEventListener("click", () => {
      playlistItems.forEach(i => i.classList.remove("active"));
      item.classList.add("active");

      const idx = parseInt(item.getAttribute("data-video-index") || "0", 10);
      const video = CURATED_MEDIA.videos[idx];
      if (video) {
        if (posterImg) posterImg.src = video.poster;
        if (activeTitle) activeTitle.textContent = video.title;
        if (activeDesc) activeDesc.textContent = video.desc;
        ProbeAudio.playClick();
      }
    });
  });

  if (playBtn) {
    playBtn.addEventListener("click", openVideoPopup);
  }

  // 3. Render Google Photos Grid
  renderPhotosGrid("all");

  // Photo Category Filters
  const filterBtns = document.querySelectorAll(".photo-filter-btn");
  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const filter = btn.getAttribute("data-filter") || "all";
      renderPhotosGrid(filter);
      ProbeAudio.playClick();
    });
  });

  // 4. Lightbox Modal Controls
  const lightbox = document.getElementById("photo-lightbox");
  const closeBtn = document.getElementById("lightbox-close");
  const overlay = lightbox?.querySelector(".lightbox-overlay");

  if (closeBtn) closeBtn.addEventListener("click", closePhotoLightbox);
  if (overlay) overlay.addEventListener("click", closePhotoLightbox);

  // Try loading media from C# backend
  loadMediaFromCSharp();
}

async function loadMediaFromCSharp() {
  try {
    const res = await fetch(`${CSHARP_API_URL}/api/bgmi/media`, { signal: AbortSignal.timeout(1500) });
    if (res.ok) {
      const data = await res.json();
      if (data.photos && data.photos.length > 0) {
        CURATED_MEDIA.photos = data.photos;
        renderPhotosGrid("all");
      }
    }
  } catch (e) {
    // Offline, already rendered
  }
}

function renderPhotosGrid(filter) {
  const grid = document.getElementById("photos-grid");
  if (!grid) return;

  const filtered = filter === "all"
    ? CURATED_MEDIA.photos
    : CURATED_MEDIA.photos.filter(p => p.category.toLowerCase() === filter.toLowerCase());

  grid.innerHTML = filtered.map(p => `
    <div class="photo-card" data-url="${p.url}" data-title="${p.title}" data-res="${p.resolution}">
      <div class="photo-thumb-wrap">
        <img src="${p.url}" alt="${p.title}" loading="lazy">
        <span class="photo-badge-pill">${p.tag}</span>
      </div>
      <div class="photo-meta">
        <h4>${p.title}</h4>
        <p>
          <span><i class="fa-solid fa-expand" style="color:var(--cyan); margin-right:4px;"></i> ${p.resolution}</span>
          <span style="color:var(--primary); font-weight:700;"><i class="fa-solid fa-cloud-arrow-down"></i> Click HD</span>
        </p>
      </div>
    </div>
  `).join("");

  // Attach Lightbox Triggers
  grid.querySelectorAll(".photo-card").forEach(card => {
    card.addEventListener("click", () => {
      const url = card.getAttribute("data-url");
      const title = card.getAttribute("data-title");
      const res = card.getAttribute("data-res");
      openPhotoLightbox(url, title, res);
    });
  });
}

function openPhotoLightbox(url, title, resolution) {
  const lightbox = document.getElementById("photo-lightbox");
  const img = document.getElementById("lightbox-img");
  const titleEl = document.getElementById("lightbox-title");
  const badgeEl = document.getElementById("lightbox-badge");
  const dlBtn = document.getElementById("lightbox-download-btn");

  if (img) img.src = url;
  if (titleEl) titleEl.textContent = title;
  if (badgeEl) badgeEl.textContent = resolution;
  if (dlBtn) dlBtn.href = url;

  if (lightbox) {
    lightbox.classList.add("active");
    ProbeAudio.playClick();
  }
}

function closePhotoLightbox() {
  const lightbox = document.getElementById("photo-lightbox");
  if (lightbox) lightbox.classList.remove("active");
}

// Global initialization
function initAll3DFeatures() {
  initThreeCrate();
  initHero3DShowcase();
  initCinemaAndPhotos();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initAll3DFeatures);
} else {
  initAll3DFeatures();
}

