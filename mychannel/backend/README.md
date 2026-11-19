# ⚡ Probe Gaming C# .NET 3D BGMI Backend Engine

This is the high-performance **C# ASP.NET Core Minimal API** backend powering the **Probe Gaming Esports Web Portal** with authentic server-side cryptographic RNG, 3D ballistics calculations, live weapon registry, curated Google Photos/Videos media catalog, and anti-cheat aim trainer verification.

---

## 🚀 How to Run the C# Backend

### 1. Prerequisites
Ensure you have the [.NET 8 or 9 SDK](https://dotnet.microsoft.com/download) installed:
```powershell
dotnet --version
```

### 2. Start the Server
From this directory (`mychannel/backend`):
```powershell
dotnet run
```

The server launches at `http://localhost:5000` with full CORS support.

---

## 📡 Complete API Endpoint Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/status` | Server health, runtime info (.NET 8/12), and active physics engine |
| `GET` | `/api/stats` | Verified YouTube channel metrics (425 subs, 416 videos, 102k+ views) |
| `GET` | `/api/bgmi/weapons` | 3D weapon registry with ballistics, recoil vectors, attachments, and skins |
| `POST` | `/api/crate/open` | Cryptographic weighted RNG crate loot drop with SHA-256 verification |
| `GET` | `/api/bgmi/media` | Curated cinema videos and 4K Google Photos wallpapers catalog |
| `POST` | `/api/bgmi/aim-trainer/submit` | Anti-cheat reflex verification and skill tier calculation (Conqueror/Ace) |
| `GET` | `/api/bgmi/airdrop/live` | Simulated real-time airdrop drop zone, coordinates, and flare status |

---

## 🎮 Frontend 3D & WebGL Integration
- **Three.js 3D Holographic Showcase**: Renders Level 3 Spetsnaz Helmet, The Golden Pan, Air Drop Crate, and Glacier M416 with real-time 360° mouse drag, wireframe toggle, and camera reset.
- **Three.js 3D Mythic Crate**: Animated opening lid, internal mythic light burst, and rising flare smoke.
- **Zero-Downtime Fallback**: All website features function 100% offline via local WebGL simulation if the C# backend is not running.
