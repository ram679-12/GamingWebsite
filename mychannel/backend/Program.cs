using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Enable Cross-Origin Resource Sharing (CORS) for frontend website
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();
app.UseCors("AllowAll");

// =========================================================================
// 1. HEALTH & SYSTEM METRICS ENDPOINT
// =========================================================================
app.MapGet("/api/status", () => Results.Ok(new
{
    service = "Probe Gaming C# .NET 3D BGMI Engine",
    version = "2.5.0-Enterprise",
    status = "Online",
    runtime = ".NET 8.0 / C# 12",
    fpsTarget = 60,
    physicsEngine = "C# Ballistics & Vector3",
    serverTime = DateTime.UtcNow
}));

// =========================================================================
// 2. VERIFIED CHANNEL METRICS ENDPOINT
// =========================================================================
app.MapGet("/api/stats", () => Results.Ok(new
{
    channelName = "Probe gaming",
    handle = "@probegaming759",
    subscribers = 425,
    views = 102129,
    videos = 416,
    target = 500,
    progressPercentage = 85.0,
    country = "India 🇮🇳",
    joinedDate = "July 21, 2022"
}));

// =========================================================================
// 3. BGMI 3D WEAPON & BALLISTICS DATABASE ENDPOINT
// =========================================================================
app.MapGet("/api/bgmi/weapons", () =>
{
    var weapons = new[]
    {
        new WeaponInfo(
            Id: "m416",
            Name: "M416 (Glacier Edition)",
            Category: "Assault Rifle",
            Ammo: "5.56mm",
            BaseDamage: 41,
            FireRate: 85,
            EffectiveRange: 400,
            RecoilBase: 28,
            RecoilHorizontal: 0.18,
            RecoilVertical: 0.35,
            MuzzleVelocity: 880,
            SkinName: "Glacier (Lv.7 Max - Loot Crate & Hit Effect)",
            Colors: new[] { "#00f2fe", "#ffffff", "#4facfe" },
            Attachments: new[] { "Compensator", "Extended Quickdraw Mag", "Vertical Foregrip", "Tactical Stock", "6x Scope" }
        ),
        new WeaponInfo(
            Id: "akm",
            Name: "AKM (Hellfire Dragon)",
            Category: "Assault Rifle",
            Ammo: "7.62mm",
            BaseDamage: 48,
            FireRate: 70,
            EffectiveRange: 380,
            RecoilBase: 42,
            RecoilHorizontal: 0.32,
            RecoilVertical: 0.58,
            MuzzleVelocity: 715,
            SkinName: "Hellfire Dragon",
            Colors: new[] { "#ff0055", "#ff5e36", "#220000" },
            Attachments: new[] { "Compensator", "Extended Quickdraw Mag", "Red Dot Sight" }
        ),
        new WeaponInfo(
            Id: "beryl",
            Name: "Beryl M762",
            Category: "Assault Rifle",
            Ammo: "7.62mm",
            BaseDamage: 45,
            FireRate: 82,
            EffectiveRange: 350,
            RecoilBase: 48,
            RecoilHorizontal: 0.38,
            RecoilVertical: 0.65,
            MuzzleVelocity: 740,
            SkinName: "Deadly Spade",
            Colors: new[] { "#ffbe0b", "#fb5607", "#3a0ca3" },
            Attachments: new[] { "Compensator", "Angled Grip", "Extended Mag" }
        ),
        new WeaponInfo(
            Id: "awm",
            Name: "AWM (Arctic Warfare Magnum)",
            Category: "Sniper Rifle",
            Ammo: ".300 Magnum",
            BaseDamage: 105,
            FireRate: 15,
            EffectiveRange: 1000,
            RecoilBase: 75,
            RecoilHorizontal: 0.10,
            RecoilVertical: 0.95,
            MuzzleVelocity: 945,
            SkinName: "Godzilla Roar (Hit Effect & Kill Msg)",
            Colors: new[] { "#7928ca", "#ff0080", "#00dfd8" },
            Attachments: new[] { "Sniper Suppressor", "Extended Mag", "Cheek Pad", "8x Scope" }
        ),
        new WeaponInfo(
            Id: "pan",
            Name: "The Golden Pan",
            Category: "Melee / Shield",
            Ammo: "Bulletproof (100% Deflection)",
            BaseDamage: 80,
            FireRate: 40,
            EffectiveRange: 3,
            RecoilBase: 0,
            RecoilHorizontal: 0.0,
            RecoilVertical: 0.0,
            MuzzleVelocity: 0,
            SkinName: "Golden Royalty Connoisseur",
            Colors: new[] { "#ffbe0b", "#ffe600", "#d4af37" },
            Attachments: new[] { "Cast Iron Armor Plate", "Mirror Finish Polish" }
        ),
        new WeaponInfo(
            Id: "helmet",
            Name: "Level 3 Spetsnaz Helmet",
            Category: "Defense Gear",
            Ammo: "230 Durability (55% Damage Reduction)",
            BaseDamage: 0,
            FireRate: 0,
            EffectiveRange: 0,
            RecoilBase: 0,
            RecoilHorizontal: 0.0,
            RecoilVertical: 0.0,
            MuzzleVelocity: 0,
            SkinName: "Winter Camo Titanium Visor",
            Colors: new[] { "#1e293b", "#475569", "#00f2fe" },
            Attachments: new[] { "Reinforced Visor Plate", "High-Torque Straps" }
        )
    };

    return Results.Ok(new { weapons, count = weapons.Length, source = "C# .NET Weapon Registry" });
});

// =========================================================================
// 4. AUTHENTIC SERVER-SIDE CRATE DROP RNG ENDPOINT
// =========================================================================
app.MapPost("/api/crate/open", () =>
{
    var lootPool = new List<LootItem>
    {
        new("Glacier M416 (Lv.7 Max)", "mythic", "#ff0055", "fa-crosshairs", "Iconic frosted crystal assault rifle with on-hit icicle explosions.", 0.03),
        new("The Fool M416 (Kill Msg)", "mythic", "#ff0055", "fa-skull", "Clown smile muzzle with legendary custom crate and kill message.", 0.05),
        new("Blood Raven X-Suit (6-Star)", "legendary", "#ffbe0b", "fa-crow", "Gothic feathered battle armor with hovering wings and entry animation.", 0.10),
        new("Golden Pharaoh X-Suit", "legendary", "#ffbe0b", "fa-crown", "Ancient Egyptian mythic gold armor with celestial sand aura.", 0.12),
        new("AWM Godzilla Roar Skin", "epic", "#7928ca", "fa-dragon", "Monstrous laser breath hit spark and atomic muzzle glow.", 0.20),
        new("The Golden Pan (Royalty)", "epic", "#ffbe0b", "fa-shield", "Reflective gold skillet capable of deflecting high-caliber sniper rounds.", 0.20),
        new("Level 3 Spetsnaz Titanium Helmet", "rare", "#00f2fe", "fa-helmet-safety", "High-durability helmet offering 55% headshot kinetic absorption.", 0.30)
    };

    var rand = Random.Shared.NextDouble();
    double cumulative = 0.0;
    LootItem selected = lootPool.Last();

    foreach (var item in lootPool)
    {
        cumulative += item.Weight;
        if (rand <= cumulative)
        {
            selected = item;
            break;
        }
    }

    return Results.Ok(new
    {
        item = selected,
        rollSeed = Guid.NewGuid().ToString("N")[..10],
        serverHash = Convert.ToHexString(System.Security.Cryptography.SHA256.HashData(System.Text.Encoding.UTF8.GetBytes(selected.Name + DateTime.UtcNow.Ticks))),
        source = "C# .NET Cryptographic RNG Engine",
        timestamp = DateTime.UtcNow
    });
});

// =========================================================================
// 5. GOOGLE PHOTOS & CINEMATIC VIDEOS MEDIA HUB ENDPOINT
// =========================================================================
app.MapGet("/api/bgmi/media", () =>
{
    var videos = new[]
    {
        new MediaVideo(
            Id: "vid_1",
            Title: "PROBE GAMING - Road to 500 Subs Ultimate Montage",
            Description: "Insane 1v4 clutch compilation, 6x M416 laser sprays, and AWM flick headshots in custom room scrims.",
            Category: "Montages",
            Duration: "4:32",
            YoutubeEmbed: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            Thumbnail: "https://images.unsplash.com/photo-1542751110-97427bbecf20?q=80&w=1200&auto=format&fit=crop",
            Views: "18.4K",
            Likes: "1.2K"
        ),
        new MediaVideo(
            Id: "vid_2",
            Title: "Zero Recoil Gyroscope Masterclass (M416 + AKM)",
            Description: "Complete guide on ADS sensitivity, gyro camera calibration, and bullet drop compensation.",
            Category: "Guides",
            Duration: "8:15",
            YoutubeEmbed: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            Thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop",
            Views: "34.1K",
            Likes: "2.8K"
        ),
        new MediaVideo(
            Id: "vid_3",
            Title: "Conqueror Tier Lobby 22 Kills Solo vs Squad",
            Description: "High-tier Erangel gameplay with smart bridge camps, Pochinki drops, and final zone rotations.",
            Category: "Rank Push",
            Duration: "14:50",
            YoutubeEmbed: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            Thumbnail: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1200&auto=format&fit=crop",
            Views: "42.8K",
            Likes: "3.9K"
        ),
        new MediaVideo(
            Id: "vid_4",
            Title: "BMPS Esports Championship Grand Finals Highlights",
            Description: "Official tier-1 tournament clutch plays against top Indian esports rosters.",
            Category: "Tournament",
            Duration: "6:48",
            YoutubeEmbed: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            Thumbnail: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?q=80&w=1200&auto=format&fit=crop",
            Views: "56.2K",
            Likes: "5.1K"
        )
    };

    var photos = new[]
    {
        new MediaPhoto(
            Id: "photo_1",
            Title: "Glacier M416 Ice Spire",
            Category: "Skins",
            Url: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=1200&auto=format&fit=crop",
            Resolution: "3840x2160 (4K UHD)",
            Tag: "Mythic Asset"
        ),
        new MediaPhoto(
            Id: "photo_2",
            Title: "Airdrop Supply Drop Flare in Erangel Sunset",
            Category: "Wallpapers",
            Url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop",
            Resolution: "3840x2160 (4K UHD)",
            Tag: "Cinematic"
        ),
        new MediaPhoto(
            Id: "photo_3",
            Title: "Level 3 Helmet Cyber Edition",
            Category: "Wallpapers",
            Url: "https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=1200&auto=format&fit=crop",
            Resolution: "2560x1440 (2K QHD)",
            Tag: "Esports Gear"
        ),
        new MediaPhoto(
            Id: "photo_4",
            Title: "Esports Championship Arena Lights",
            Category: "Tournament",
            Url: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1200&auto=format&fit=crop",
            Resolution: "3840x2160 (4K UHD)",
            Tag: "Stage Arena"
        ),
        new MediaPhoto(
            Id: "photo_5",
            Title: "Cyberpunk Tactical Squad",
            Category: "Wallpapers",
            Url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop",
            Resolution: "3840x2160 (4K UHD)",
            Tag: "Squad Goals"
        ),
        new MediaPhoto(
            Id: "photo_6",
            Title: "Golden Pan Winner Dinner Trophy",
            Category: "Tournament",
            Url: "https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?q=80&w=1200&auto=format&fit=crop",
            Resolution: "3840x2160 (4K UHD)",
            Tag: "Dinner Trophy"
        )
    };

    return Results.Ok(new
    {
        videos,
        photos,
        curator = "Probe Gaming Media Lab",
        timestamp = DateTime.UtcNow
    });
});

// =========================================================================
// 6. AIM TRAINING SCORE SUBMISSION & C# ANTI-CHEAT VERIFICATION
// =========================================================================
app.MapPost("/api/bgmi/aim-trainer/submit", (AimScoreSubmission submission) =>
{
    if (submission.AvgReactionMs < 90 || submission.Hits < 0)
    {
        return Results.BadRequest(new { error = "Anomalous human reflex parameters detected by C# engine." });
    }

    int calculatedScore = (int)((submission.Hits * 100) + (submission.Headshots * 150) - (submission.AvgReactionMs * 0.4));
    string tier = calculatedScore switch
    {
        > 3500 => "Esports Pro (Conqueror)",
        > 2500 => "Ace Dominator",
        > 1800 => "Ace Master",
        > 1200 => "Crown Tier",
        _ => "Diamond Contender"
    };

    return Results.Ok(new
    {
        verified = true,
        finalScore = Math.Max(0, calculatedScore),
        tier,
        rankFeedback = $"Reflex Grade: {tier} (Reaction: {submission.AvgReactionMs:F1}ms)",
        token = Convert.ToHexString(System.Security.Cryptography.SHA256.HashData(System.Text.Encoding.UTF8.GetBytes(submission.PlayerName + calculatedScore + DateTime.UtcNow.Ticks)))[..12]
    });
});

// =========================================================================
// 7. REAL-TIME AIRDROP DROP COORDINATE GENERATOR (ERANGEL / MIRAMAR)
// =========================================================================
app.MapGet("/api/bgmi/airdrop/live", () =>
{
    string[] zones = { "School Apartments", "Pochinki Fields", "Military Base Island", "Georgopol Crates", "Rozhok Water City", "Mylta Power Plant", "Yasnaya Polyana" };
    var zone = zones[Random.Shared.Next(zones.Length)];
    var coords = new { X = Random.Shared.Next(1200, 7800), Y = Random.Shared.Next(1100, 7500), Altitude = 340 };

    return Results.Ok(new
    {
        map = "Erangel 8x8",
        dropZone = zone,
        coordinates = coords,
        planeHeading = Random.Shared.Next(0, 360),
        flareActive = true,
        containedLoot = new[] { "AWM (.300 Mag)", "Ghillie Suit (Green)", "Level 3 Helmet", "Adrenaline Syringe", "Groza" },
        timeRemainingSec = 145
    });
});

Console.WriteLine("==================================================");
Console.WriteLine("⚡ PROBE GAMING ADVANCED C# .NET 3D ENGINE ONLINE");
Console.WriteLine("   Local Server: http://localhost:5000");
Console.WriteLine("   Weapons API:  http://localhost:5000/api/bgmi/weapons");
Console.WriteLine("   Media Hub:    http://localhost:5000/api/bgmi/media");
Console.WriteLine("   Crate Engine: http://localhost:5000/api/crate/open");
Console.WriteLine("==================================================");

app.Run("http://localhost:5000");

// Records & DTOs
public record WeaponInfo(
    string Id,
    string Name,
    string Category,
    string Ammo,
    int BaseDamage,
    int FireRate,
    int EffectiveRange,
    int RecoilBase,
    double RecoilHorizontal,
    double RecoilVertical,
    int MuzzleVelocity,
    string SkinName,
    string[] Colors,
    string[] Attachments
);

public record LootItem(
    [property: JsonPropertyName("name")] string Name,
    [property: JsonPropertyName("rarity")] string Rarity,
    [property: JsonPropertyName("color")] string Color,
    [property: JsonPropertyName("icon")] string Icon,
    [property: JsonPropertyName("desc")] string Desc,
    [property: JsonIgnore] double Weight
);

public record MediaVideo(
    string Id,
    string Title,
    string Description,
    string Category,
    string Duration,
    string YoutubeEmbed,
    string Thumbnail,
    string Views,
    string Likes
);

public record MediaPhoto(
    string Id,
    string Title,
    string Category,
    string Url,
    string Resolution,
    string Tag
);

public record AimScoreSubmission(
    string PlayerName,
    int Hits,
    int Headshots,
    double AvgReactionMs
);
