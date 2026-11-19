import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';

/* ========================================================
   WEB AUDIO SYNTHESIZER
   ======================================================== */
const audioContext = (() => {
  let ctx = null;
  return () => {
    if (!ctx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) ctx = new AudioContextClass();
    }
    if (ctx && ctx.state === 'suspended') {
      ctx.resume();
    }
    return ctx;
  };
})();

const playSoundEffect = (type, isMuted) => {
  if (isMuted) return;
  try {
    const ctx = audioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    if (type === 'click') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.05);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === 'sub') {
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = now + idx * 0.09;
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.2, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.35);
      });
    } else if (type === 'headshot') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(1400, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.22);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.22);
    } else if (type === 'victory') {
      const freqs = [440, 554.37, 659.25, 880];
      freqs.forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const t = now + i * 0.12;
        osc.type = 'square';
        osc.frequency.setValueAtTime(f, t);
        gain.gain.setValueAtTime(0.12, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.4);
      });
    } else if (type === 'laser') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(950, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.18);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.18);
    } else if (type === 'chat') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.setValueAtTime(900, now + 0.04);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.1);
    }
  } catch (e) {
    // audio fallback
  }
};

const INITIAL_VIDEOS = [
  {
    id: "v1",
    title: "1v4 CONQUEROR LOBBY CLUTCH | BGMI God Montage #42",
    category: "Montages",
    duration: "08:45",
    views: "184K",
    date: "2 days ago",
    likes: 14200,
    liked: false,
    youtubeId: "e-ORhEE9VVg",
    desc: "Insane clutch moments in Conqueror tier lobby! 1v4 squad wipe in Pochinki with M416 + Beryl M762 combo.",
    badge: "4K 60FPS",
    thumb: "https://images.unsplash.com/photo-1542751110-97427bbecf20?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: "v2",
    title: "PROBE BGMI ESPORTS SCRIMS GRAND FINALE | 22 KILLS WWCD",
    category: "Tournaments",
    duration: "18:20",
    views: "340K",
    date: "5 days ago",
    likes: 28900,
    liked: false,
    youtubeId: "M7lc1UVf-VE",
    desc: "Watch Probe Gaming dominate the Grand Finals of Tier 1 Custom Scrims with an unbelievable 22-kill Winner Winner Chicken Dinner!",
    badge: "ESPORTS",
    thumb: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: "v3",
    title: "UPDATED ZERO RECOIL SENSITIVITY CODE | GYRO & ADS (FULL GUIDE)",
    category: "Guides",
    duration: "11:15",
    views: "520K",
    date: "1 week ago",
    likes: 45600,
    liked: false,
    youtubeId: "kJQP7kiw5Fk",
    desc: "The only BGMI sensitivity guide you need! Tested on 4-finger claw, full gyroscope, iPad, and Android phones. Code inside!",
    badge: "PRO GUIDE",
    thumb: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: "v4",
    title: "HOW I HIT CONQUEROR IN JUST 4 DAYS | SOLO VS SQUAD STRATEGY",
    category: "Highlights",
    duration: "14:50",
    views: "215K",
    date: "2 weeks ago",
    likes: 19400,
    liked: false,
    youtubeId: "kJIE_e5t2yM",
    desc: "Full breakdown of safe drops, rotation secrets, survival timing, and zone prediction to reach Conqueror effortlessly.",
    badge: "RANK PUSH",
    thumb: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: "v5",
    title: "TOP 10 FUNNIEST BGMI VOICE CHAT MOMENTS & TROLLS",
    category: "Montages",
    duration: "09:30",
    views: "410K",
    date: "3 weeks ago",
    likes: 38200,
    liked: false,
    youtubeId: "M7lc1UVf-VE",
    desc: "Hilarious moments with random teammates, funny pan fights, and epic voice chat reactions in all-chat!",
    badge: "FUNNY",
    thumb: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: "v6",
    title: "AWM HEADSHOT ONLY CHALLENGE | 1 BULLET 1 CRATE (INSANE FLICKS)",
    category: "Highlights",
    duration: "12:05",
    views: "298K",
    date: "1 month ago",
    likes: 24700,
    liked: false,
    youtubeId: "e-ORhEE9VVg",
    desc: "Pure sniper satisfaction! Fast-scope flicks, 400m bullet drop predictions, and crate air-drops control.",
    badge: "SNIPER GOD",
    thumb: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop"
  }
];

const SENSITIVITY_PRESETS = {
  gyro: {
    name: "Full Gyro God (4-Finger)",
    code: "7320-9182-4412-0089-62",
    thirdPerson: 125,
    redDot: 68,
    scope3x: 42,
    scope4x: 28,
    gyro3rd: 390,
    gyroRedDot: 385,
    gyro3x: 310
  },
  nonGyro: {
    name: "Non-Gyro Rusher (Thumb / Claw)",
    code: "7210-4389-1120-7744-19",
    thirdPerson: 140,
    redDot: 82,
    scope3x: 55,
    scope4x: 36,
    gyro3rd: 0,
    gyroRedDot: 0,
    gyro3x: 0
  },
  ipad: {
    name: "iPad Pro / Tablet 120 FPS",
    code: "7105-8823-9011-3456-80",
    thirdPerson: 110,
    redDot: 58,
    scope3x: 35,
    scope4x: 24,
    gyro3rd: 340,
    gyroRedDot: 330,
    gyro3x: 260
  }
};

const WEAPONS_DATA = {
  m416: { name: "M416 (Assault Rifle)", ammo: "5.56mm", baseDamage: 41, baseRecoil: 65, baseFireRate: 85, image: "https://images.unsplash.com/photo-1584441405886-bc91be61e56a?q=80&w=800&auto=format&fit=crop" },
  beryl: { name: "Beryl M762 (Heavy AR)", ammo: "7.62mm", baseDamage: 46, baseRecoil: 42, baseFireRate: 88, image: "https://images.unsplash.com/photo-1595590424283-b8f17842773f?q=80&w=800&auto=format&fit=crop" },
  awm: { name: "AWM (Bolt Action Sniper)", ammo: ".300 Magnum", baseDamage: 105, baseRecoil: 25, baseFireRate: 15, image: "https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?q=80&w=800&auto=format&fit=crop" },
  ump45: { name: "UMP45 (SMG Rusher)", ammo: ".45 ACP", baseDamage: 40, baseRecoil: 80, baseFireRate: 82, image: "https://images.unsplash.com/photo-1595590424283-b8f17842773f?q=80&w=800&auto=format&fit=crop" }
};

const CLAN_PLAYERS = [
  { ign: "PROBE_LEADER", role: "IGL & Mastermind", device: "iPhone 15 Pro Max", kd: "7.84", headshots: "42%", avatar: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=400&auto=format&fit=crop" },
  { ign: "PROBE_SNIPER", role: "AWM Sniper God", device: "ROG Phone 8 Pro", kd: "8.12", headshots: "64%", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=400&auto=format&fit=crop" },
  { ign: "PROBE_VIPER", role: "Frontline Assaulter", device: "iPad Pro M4", kd: "9.20", headshots: "38%", avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=400&auto=format&fit=crop" },
  { ign: "PROBE_PHANTOM", role: "Support & Flanker", device: "Samsung S24 Ultra", kd: "6.75", headshots: "35%", avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=400&auto=format&fit=crop" }
];

export default function App() {
  const [subscribers, setSubscribers] = useState(442890);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('crimson');
  const [activeModalVideo, setActiveModalVideo] = useState(null);
  const [videoCategory, setVideoCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activePresetKey, setActivePresetKey] = useState("gyro");
  const [customSliders, setCustomSliders] = useState(SENSITIVITY_PRESETS.gyro);
  const [selectedGunKey, setSelectedGunKey] = useState("m416");
  const [attachments, setAttachments] = useState({ muzzle: "Compensator", grip: "Half Grip", scope: "Red Dot", magazine: "Extended Quickdraw" });
  const [toasts, setToasts] = useState([]);

  const triggerToast = (msg, icon = "fa-check-circle") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, icon }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  };

  const handleSubscribe = () => {
    playSoundEffect('sub', isMuted);
    if (!isSubscribed) {
      setSubscribers(prev => prev + 1);
      setIsSubscribed(true);
      triggerToast("🎉 Welcome to the PROBE CLAN! Subscribed!");
      if (typeof confetti === 'function') {
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.65 }, colors: ['#ff0055', '#ff7b00', '#00f0ff'] });
      }
    } else {
      setSubscribers(prev => prev - 1);
      setIsSubscribed(false);
      triggerToast("Unsubscribed from Probe Gaming.", "fa-info-circle");
    }
  };

  return (
    <div className={`probe-app-root theme-${currentTheme}`}>
      {/* NAVBAR */}
      <nav className="cyber-nav">
        <a href="#home" className="brand-logo">
          <div className="brand-icon"><i className="fa-solid fa-crosshairs"></i></div>
          <div><span>PROBE</span> GAMING</div>
        </a>

        <ul className="nav-links">
          <li><a href="#home" className="nav-link active">Home</a></li>
          <li><a href="#videos" className="nav-link">Videos</a></li>
          <li><a href="#lab" className="nav-link">Pro Lab</a></li>
          <li><a href="#tournament" className="nav-link">Scrims</a></li>
          <li><a href="#roster" className="nav-link">Clan Roster</a></li>
          <li><a href="#contact" className="nav-link">Contact</a></li>
        </ul>

        <div className="nav-actions">
          <button
            className={`btn-cyber btn-primary btn-subscribe-pulsing ${isSubscribed ? 'subscribed' : ''}`}
            onClick={handleSubscribe}
          >
            <i className={`fa-solid ${isSubscribed ? 'fa-bell' : 'fa-play'}`}></i>
            {isSubscribed ? 'SUBSCRIBED' : 'SUBSCRIBE'}
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero-section" id="home">
        <div className="hero-content">
          <div className="hero-badge-pill">
            <span className="pulse-dot"></span>
            <span>BGMI CONQUEROR TIER 1 ESPORTS</span>
          </div>
          <h1 className="hero-title">PROBE GAMING</h1>
          <h2 style={{ color: 'var(--secondary)', fontFamily: 'var(--font-heading)', fontSize: '1.5rem' }}>
            CINEMATIC BGMI MONTAGES & ESPORTS
          </h2>
          <p className="hero-desc">
            Experience high-octane 4K 60FPS montages, tactical scrims, and zero-recoil sensitivity setups.
          </p>

          <div className="hero-btns-row">
            <button className="btn-cyber btn-primary" onClick={() => setActiveModalVideo(INITIAL_VIDEOS[0])}>
              <i className="fa-solid fa-play"></i> Watch Latest Clutch
            </button>
            <a href="#lab" className="btn-cyber btn-secondary">
              <i className="fa-solid fa-sliders"></i> Pro Sensitivity Code
            </a>
          </div>

          <div className="hero-stats-grid">
            <div className="stat-card-glass">
              <span className="stat-num">{(subscribers / 1000).toFixed(1)}K</span>
              <span className="stat-label">Subscribers</span>
            </div>
            <div className="stat-card-glass">
              <span className="stat-num">18.9M</span>
              <span className="stat-label">Total Views</span>
            </div>
            <div className="stat-card-glass">
              <span className="stat-num">7.84</span>
              <span className="stat-label">Average K/D</span>
            </div>
          </div>
        </div>

        <div className="hero-featured-card">
          <div className="hero-thumb-wrapper" onClick={() => setActiveModalVideo(INITIAL_VIDEOS[0])}>
            <img src={INITIAL_VIDEOS[0].thumb} alt="Latest Clutch" />
            <div className="hero-play-overlay">
              <div className="play-btn-circle"><i className="fa-solid fa-play"></i></div>
            </div>
          </div>
          <div className="hero-video-info">
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{INITIAL_VIDEOS[0].title}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{INITIAL_VIDEOS[0].desc}</p>
          </div>
        </div>
      </section>

      {/* TOASTS */}
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className="toast-pill">
            <i className={`fa-solid ${t.icon}`} style={{ color: 'var(--primary)' }}></i>
            <span>{t.msg}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

