import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "";
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "";
const supabase = SUPABASE_URL ? createClient(SUPABASE_URL, SUPABASE_KEY) : null;

// ── 48 SELECCIONES + SECCIONES ESPECIALES (FIFA World Cup 2026) ──────────────
// Fuente: FIFA.com — clasificados oficiales al corte de mayo 2026
// Cada selección tiene 18 figuritas (jugadores) según estructura Panini 2026
// Las secciones especiales tienen conteos según el álbum oficial
const SECTIONS = [
  // ESPECIALES
  { id: "FWC_ESP", label: "FWC – Especiales",      emoji: "🏆", count: 20, color: "#FFD700" },
  { id: "FWC_BAL", label: "FWC – Balón y Países",  emoji: "⚽", count: 18, color: "#00E5FF" },
  { id: "FWC_HIS", label: "FWC – Historia",         emoji: "📜", count: 15, color: "#A78BFA" },
  { id: "FWC_EST", label: "FWC – Estadios",         emoji: "🏟️", count: 16, color: "#F97316" },
  // GRUPO A
  { id: "MEX", label: "México",           emoji: "🇲🇽", count: 18, color: "#00B94A" },
  { id: "USA", label: "Estados Unidos",   emoji: "🇺🇸", count: 18, color: "#3B82F6" },
  { id: "CAN", label: "Canadá",           emoji: "🇨🇦", count: 18, color: "#EF4444" },
  // CONMEBOL
  { id: "ARG", label: "Argentina",        emoji: "🇦🇷", count: 18, color: "#74C0FC" },
  { id: "BRA", label: "Brasil",           emoji: "🇧🇷", count: 18, color: "#F9E04B" },
  { id: "COL", label: "Colombia",         emoji: "🇨🇴", count: 18, color: "#FFD700" },
  { id: "URU", label: "Uruguay",          emoji: "🇺🇾", count: 18, color: "#75AADB" },
  { id: "ECU", label: "Ecuador",          emoji: "🇪🇨", count: 18, color: "#FFD100" },
  { id: "PAR", label: "Paraguay",         emoji: "🇵🇾", count: 18, color: "#D52B1E" },
  { id: "BOL", label: "Bolivia",          emoji: "🇧🇴", count: 18, color: "#D52B1E" },
  { id: "VEN", label: "Venezuela",        emoji: "🇻🇪", count: 18, color: "#CF0A2C" },
  { id: "CHI", label: "Chile",            emoji: "🇨🇱", count: 18, color: "#D52B1E" },
  // UEFA
  { id: "ESP", label: "España",           emoji: "🇪🇸", count: 18, color: "#C0392B" },
  { id: "FRA", label: "Francia",          emoji: "🇫🇷", count: 18, color: "#1A5276" },
  { id: "ALE", label: "Alemania",         emoji: "🇩🇪", count: 18, color: "#AAAAAA" },
  { id: "POR", label: "Portugal",         emoji: "🇵🇹", count: 18, color: "#006600" },
  { id: "ING", label: "Inglaterra",       emoji: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", count: 18, color: "#CF142B" },
  { id: "NED", label: "Países Bajos",     emoji: "🇳🇱", count: 18, color: "#FF6600" },
  { id: "BEL", label: "Bélgica",          emoji: "🇧🇪", count: 18, color: "#E30614" },
  { id: "CRO", label: "Croacia",          emoji: "🇭🇷", count: 18, color: "#FF0000" },
  { id: "DAN", label: "Dinamarca",        emoji: "🇩🇰", count: 18, color: "#C60C30" },
  { id: "AUT", label: "Austria",          emoji: "🇦🇹", count: 18, color: "#ED2939" },
  { id: "SCO", label: "Escocia",          emoji: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", count: 18, color: "#003087" },
  { id: "SUI", label: "Suiza",            emoji: "🇨🇭", count: 18, color: "#FF0000" },
  { id: "HUN", label: "Hungría",          emoji: "🇭🇺", count: 18, color: "#CE2939" },
  { id: "TUR", label: "Turquía",          emoji: "🇹🇷", count: 18, color: "#E30A17" },
  { id: "SRB", label: "Serbia",           emoji: "🇷🇸", count: 18, color: "#C6363C" },
  { id: "ROU", label: "Rumania",          emoji: "🇷🇴", count: 18, color: "#002B7F" },
  { id: "SVK", label: "Eslovaquia",       emoji: "🇸🇰", count: 18, color: "#0B4EA2" },
  { id: "CZE", label: "Chequia",          emoji: "🇨🇿", count: 18, color: "#D7141A" },
  { id: "GEO", label: "Georgia",          emoji: "🇬🇪", count: 18, color: "#DA291C" },
  { id: "ALB", label: "Albania",          emoji: "🇦🇱", count: 18, color: "#E41E20" },
  // CAF (África)
  { id: "MAR", label: "Marruecos",        emoji: "🇲🇦", count: 18, color: "#C1272D" },
  { id: "SEN", label: "Senegal",          emoji: "🇸🇳", count: 18, color: "#00853F" },
  { id: "RSA", label: "Sudáfrica",        emoji: "🇿🇦", count: 18, color: "#007A4D" },
  { id: "EGY", label: "Egipto",           emoji: "🇪🇬", count: 18, color: "#CE1126" },
  { id: "NGA", label: "Nigeria",          emoji: "🇳🇬", count: 18, color: "#008751" },
  { id: "CMR", label: "Camerún",          emoji: "🇨🇲", count: 18, color: "#007A5E" },
  // AFC (Asia)
  { id: "JPN", label: "Japón",            emoji: "🇯🇵", count: 18, color: "#BC002D" },
  { id: "KOR", label: "Rep. de Corea",    emoji: "🇰🇷", count: 18, color: "#CD2E3A" },
  { id: "SAU", label: "Arabia Saudita",   emoji: "🇸🇦", count: 18, color: "#006C35" },
  { id: "IRN", label: "Irán",             emoji: "🇮🇷", count: 18, color: "#239F40" },
  { id: "AUS", label: "Australia",        emoji: "🇦🇺", count: 18, color: "#00008B" },
  { id: "UZB", label: "Uzbekistán",       emoji: "🇺🇿", count: 18, color: "#1EB53A" },
  // CONCACAF adicional
  { id: "PAN", label: "Panamá",           emoji: "🇵🇦", count: 18, color: "#DA121A" },
  { id: "JAM", label: "Jamaica",          emoji: "🇯🇲", count: 18, color: "#FED100" },
  { id: "HON", label: "Honduras",         emoji: "🇭🇳", count: 18, color: "#0073CF" },
  { id: "CRC", label: "Costa Rica",       emoji: "🇨🇷", count: 18, color: "#002B7F" },
  // OFC
  { id: "NZL", label: "Nueva Zelanda",    emoji: "🇳🇿", count: 18, color: "#00247D" },
];

// ── LOGROS (hitos automáticos por cantidad) ───────────────────────────────────
const ACHIEVEMENTS = [
  { id: "ach_10",   threshold: 10,  icon: "🌱", title: "Arrancando",      desc: "Primeras 10 figuritas" },
  { id: "ach_50",   threshold: 50,  icon: "🔥", title: "En racha",         desc: "50 figuritas conseguidas" },
  { id: "ach_100",  threshold: 100, icon: "⚡", title: "Imparable",        desc: "100 figuritas — vas con todo" },
  { id: "ach_200",  threshold: 200, icon: "🏅", title: "Coleccionista",    desc: "200 figuritas en tu álbum" },
  { id: "ach_300",  threshold: 300, icon: "🎯", title: "Crack del álbum",  desc: "300 figuritas — nivel pro" },
  { id: "ach_400",  threshold: 400, icon: "🏆", title: "Leyenda",          desc: "400 figuritas conseguidas" },
  { id: "ach_500",  threshold: 500, icon: "💎", title: "Diamante",         desc: "Más de la mitad del álbum" },
  { id: "ach_750",  threshold: 750, icon: "🚀", title: "Imparable total",  desc: "750 figuritas — casi completo" },
  { id: "ach_994",  threshold: 994, icon: "👑", title: "ÁLBUM COMPLETO",   desc: "¡Leyenda absoluta del Mundial!" },
];

// ── ESTRELLAS (figuras especiales — se marcan manualmente) ────────────────────
const STARS = [
  { id: "star_messi",    name: "Lionel Messi",       team: "Argentina 🇦🇷",    emoji: "🐐", rare: true  },
  { id: "star_cr7",      name: "Cristiano Ronaldo",  team: "Portugal 🇵🇹",     emoji: "⚡", rare: true  },
  { id: "star_mbappe",   name: "Kylian Mbappé",      team: "Francia 🇫🇷",      emoji: "💨", rare: true  },
  { id: "star_vini",     name: "Vinícius Jr.",        team: "Brasil 🇧🇷",       emoji: "🔥", rare: true  },
  { id: "star_james",    name: "James Rodríguez",    team: "Colombia 🇨🇴",     emoji: "🎩", rare: true  },
  { id: "star_haaland",  name: "Erling Haaland",     team: "Noruega",          emoji: "🎯", rare: false },
  { id: "star_bellingham",name: "Jude Bellingham",   team: "Inglaterra 🏴󠁧󠁢󠁥󠁮󠁧󠁿",  emoji: "👑", rare: false },
  { id: "star_pedri",    name: "Pedri",              team: "España 🇪🇸",       emoji: "🎪", rare: false },
  { id: "star_rodri",    name: "Rodri",              team: "España 🇪🇸",       emoji: "🧠", rare: false },
  { id: "star_salah",    name: "Mohamed Salah",      team: "Egipto 🇪🇬",       emoji: "⭐", rare: false },
  { id: "star_osimhen",  name: "Victor Osimhen",     team: "Nigeria 🇳🇬",      emoji: "💥", rare: false },
  { id: "star_son",      name: "Heung-min Son",      team: "Rep. de Corea 🇰🇷",emoji: "🎯", rare: false },
  { id: "star_lamine",   name: "Lamine Yamal",       team: "España 🇪🇸",       emoji: "🌟", rare: true  },
  { id: "star_pulisic",  name: "Christian Pulisic",  team: "Estados Unidos 🇺🇸",emoji: "🦅", rare: false },
  { id: "star_davies",   name: "Alphonso Davies",    team: "Canadá 🇨🇦",       emoji: "⚡", rare: false },
];


function buildInitialState() {
  const state = {};
  SECTIONS.forEach((s) => {
    for (let i = 1; i <= s.count; i++) {
      state[`${s.id}-${i}`] = 0;
    }
  });
  return state;
}

const STORAGE_KEY = "bytebots_figuritas_wc2026_v2";

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // merge with fresh state so new sections always appear
      const fresh = buildInitialState();
      return { ...fresh, ...parsed };
    }
  } catch {}
  return buildInitialState();
}

function saveState(state) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
}

const STARS_KEY = "bytebots_stars_wc2026";
const BADGES_KEY = "bytebots_badges_wc2026";

function loadStars() {
  try { const r = localStorage.getItem(STARS_KEY); return r ? JSON.parse(r) : {}; } catch { return {}; }
}
function saveStars(s) { try { localStorage.setItem(STARS_KEY, JSON.stringify(s)); } catch {} }
function loadBadges() {
  try { const r = localStorage.getItem(BADGES_KEY); return r ? JSON.parse(r) : []; } catch { return []; }
}
function saveBadges(b) { try { localStorage.setItem(BADGES_KEY, JSON.stringify(b)); } catch {} }

// ── LONG PRESS HOOK ──────────────────────────────────────────────────────────
function useLongPress(onLongPress, onClick, ms = 500) {
  const timerRef = useRef(null);
  const firedRef = useRef(false);

  const start = useCallback((e) => {
    e.preventDefault();
    firedRef.current = false;
    timerRef.current = setTimeout(() => {
      firedRef.current = true;
      onLongPress();
    }, ms);
  }, [onLongPress, ms]);

  const cancel = useCallback(() => {
    clearTimeout(timerRef.current);
  }, []);

  const end = useCallback(() => {
    clearTimeout(timerRef.current);
    if (!firedRef.current) onClick();
  }, [onClick]);

  return {
    onMouseDown: start,
    onMouseUp: end,
    onMouseLeave: cancel,
    onTouchStart: start,
    onTouchEnd: end,
  };
}

// ── STICKER CARD ─────────────────────────────────────────────────────────────
function StickerCard({ id, value, onAdd, onRemove }) {
  const num = id.split("-").pop();
  const state = value === 0 ? "missing" : value === 1 ? "owned" : "duplicate";

  const handlers = useLongPress(
    () => onRemove(id),   // long press → restar
    () => onAdd(id),      // tap → sumar
    500
  );

  const tip = value === 0
    ? "Falta · toca para marcar"
    : value === 1
    ? "Tengo · toca = repetida · mantén = quitar"
    : `×${value} rep · toca = +1 · mantén = quitar una`;

  return (
    <button
      {...handlers}
      className={`sticker-card state-${state}`}
      title={tip}
      style={{ userSelect: "none", WebkitUserSelect: "none" }}
    >
      <span className="sticker-num">{num}</span>
      {value >= 2 && <span className="dup-badge">×{value}</span>}
      {value >= 1 && (
        <span className="remove-hint" aria-hidden="true">−</span>
      )}
    </button>
  );
}

// ── PROGRESS BAR ─────────────────────────────────────────────────────────────
function ProgressBar({ pct, color }) {
  return (
    <div className="progress-track">
      <div className="progress-fill" style={{ width: `${pct}%`, background: color }} />
    </div>
  );
}

// ── SECTION ──────────────────────────────────────────────────────────────────
function Section({ section, collection, onAdd, onRemove, filter, search }) {
  const [open, setOpen] = useState(false);

  const stickers = useMemo(() => {
    const list = [];
    for (let i = 1; i <= section.count; i++) {
      const id = `${section.id}-${i}`;
      const val = collection[id] ?? 0;
      if (filter === "missing"   && val !== 0) continue;
      if (filter === "duplicate" && val < 2)   continue;
      list.push({ id, val });
    }
    return list;
  }, [section, collection, filter]);

  const owned = useMemo(() => {
    let o = 0;
    for (let i = 1; i <= section.count; i++) {
      if ((collection[`${section.id}-${i}`] ?? 0) >= 1) o++;
    }
    return o;
  }, [section, collection]);

  const pct = Math.round((owned / section.count) * 100);
  const matchesSearch = !search || section.label.toLowerCase().includes(search.toLowerCase());

  if (!matchesSearch && filter === "all") return null;
  if (stickers.length === 0 && filter !== "all") return null;

  return (
    <div className="section-card">
      <button className="section-header" onClick={() => setOpen(!open)}>
        <div className="section-left">
          <span className="section-emoji">{section.emoji}</span>
          <span className="section-label">{section.label}</span>
        </div>
        <div className="section-right">
          <span className="section-count">{owned}/{section.count}</span>
          <span className="section-pct" style={{ color: section.color }}>{pct}%</span>
          <span className={`chevron ${open ? "open" : ""}`}>▼</span>
        </div>
      </button>
      <ProgressBar pct={pct} color={section.color} />
      {open && (
        <div className="sticker-grid">
          {stickers.map(({ id, val }) => (
            <StickerCard key={id} id={id} value={val} onAdd={onAdd} onRemove={onRemove} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── EXCHANGE FINDER ──────────────────────────────────────────────────────────
function ExchangeFinder({ collection, user, supabase, showToast }) {
  const [step, setStep] = useState("idle"); // idle | setup | searching | results
  const [profile, setProfile] = useState({ display_name: "", whatsapp: "", city: "", lat: null, lng: null });
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [savedProfile, setSavedProfile] = useState(null);

  // My missing stickers
  const myMissing = useMemo(() => {
    const list = [];
    SECTIONS.forEach(s => {
      for (let i = 1; i <= s.count; i++) {
        const id = `${s.id}-${i}`;
        if ((collection[id] ?? 0) === 0) list.push(id);
      }
    });
    return list;
  }, [collection]);

  // My duplicates
  const myDuplicates = useMemo(() => {
    const list = [];
    SECTIONS.forEach(s => {
      for (let i = 1; i <= s.count; i++) {
        const id = `${s.id}-${i}`;
        if ((collection[id] ?? 0) >= 2) list.push(id);
      }
    });
    return list;
  }, [collection]);

  const getLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) { reject("GPS no disponible"); return; }
      navigator.geolocation.getCurrentPosition(
        pos => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => reject("No se pudo obtener ubicación")
      );
    });
  };

  const getCityFromCoords = async (lat, lng) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
      const data = await res.json();
      return data.address?.city || data.address?.town || data.address?.municipality || data.address?.county || "Mi ciudad";
    } catch { return "Mi ciudad"; }
  };

  const handleSetupStart = async () => {
    setLoading(true);
    try {
      const { lat, lng } = await getLocation();
      const city = await getCityFromCoords(lat, lng);
      setProfile(prev => ({ ...prev, lat, lng, city }));
      setStep("setup");
    } catch (e) {
      showToast("Activa el GPS e intenta de nuevo", "warn");
    }
    setLoading(false);
  };

  const handleSaveProfile = async () => {
    if (!profile.display_name.trim() || !profile.whatsapp.trim()) {
      showToast("Completa tu nombre y WhatsApp", "warn");
      return;
    }
    if (!user || !supabase) { showToast("Inicia sesión para buscar intercambios", "warn"); return; }
    setLoading(true);
    try {
      // Save profile
      await supabase.from("exchange_profiles").upsert({
        user_id: user.id,
        display_name: profile.display_name.trim(),
        whatsapp: profile.whatsapp.trim().replace(/\D/g, ""),
        city: profile.city,
        lat: profile.lat,
        lng: profile.lng,
      }, { onConflict: "user_id" });

      // Save my duplicates to stickers table
      const entries = myDuplicates.map(code => ({ user_id: user.id, sticker_code: code, count: collection[code] }));
      if (entries.length > 0) {
        await supabase.from("stickers").upsert(entries, { onConflict: "user_id,sticker_code" });
      }

      setSavedProfile(profile);
      await handleSearch(profile);
    } catch(e) {
      showToast("Error al guardar perfil", "warn");
    }
    setLoading(false);
  };

  const handleSearch = async (prof) => {
    if (!supabase) return;
    setLoading(true);
    setStep("results");
    try {
      // Get all profiles in same city (excluding self)
      const { data: profiles } = await supabase
        .from("exchange_profiles")
        .select("user_id, display_name, whatsapp, city")
        .eq("city", (prof || profile).city)
        .neq("user_id", user?.id || "");

      if (!profiles || profiles.length === 0) {
        setMatches([]);
        setLoading(false);
        return;
      }

      // Get their stickers
      const userIds = profiles.map(p => p.user_id);
      const { data: theirStickers } = await supabase
        .from("stickers")
        .select("user_id, sticker_code, count")
        .in("user_id", userIds)
        .gte("count", 2); // they have duplicates

      // Match: their duplicates vs my missing
      const results = profiles.map(p => {
        const theirDups = (theirStickers || [])
          .filter(s => s.user_id === p.user_id)
          .map(s => s.sticker_code);
        const canGiveMe = theirDups.filter(s => myMissing.includes(s));
        const iNeedFromThem = myDuplicates.filter(s => {
          const theirMissing = (theirStickers || []).filter(s2 => s2.user_id === p.user_id && s2.count === 0).map(s2 => s2.sticker_code);
          return theirMissing.includes(s);
        });
        return { ...p, canGiveMe, matchCount: canGiveMe.length };
      }).filter(p => p.matchCount > 0)
        .sort((a, b) => b.matchCount - a.matchCount);

      setMatches(results);
    } catch(e) {
      showToast("Error buscando intercambios", "warn");
    }
    setLoading(false);
  };

  const openWhatsApp = (whatsapp, name, stickers) => {
    const nums = stickers.slice(0, 5).join(", ");
    const more = stickers.length > 5 ? ` y ${stickers.length - 5} más` : "";
    const text = encodeURIComponent(
      `¡Hola ${name}! 👋 Vi que tienes repetidas que me faltan en el álbum WC 2026: ${nums}${more} ¿Las cambiamos? 🤝

🤖 App by ByteBots · bytebots-figuritas-wc2026.vercel.app`
    );
    window.open(`https://wa.me/${whatsapp}?text=${text}`, "_blank");
  };

  // IDLE STATE
  if (step === "idle") return (
    <div className="exchange-finder">
      <div className="ef-hero">
        <div className="ef-icon">📍</div>
        <div className="ef-title">Encuentra intercambios<br/>cerca de ti</div>
        <div className="ef-sub">Detectamos tu ciudad automáticamente y buscamos usuarios con las figuritas que te faltan</div>
        <div className="ef-stats">
          <div className="ef-stat"><span className="ef-num" style={{color:"var(--red)"}}>{myMissing.length}</span><span className="ef-lbl">Me faltan</span></div>
          <div className="ef-stat-div"></div>
          <div className="ef-stat"><span className="ef-num" style={{color:"var(--gold)"}}>{myDuplicates.length}</span><span className="ef-lbl">Repetidas</span></div>
        </div>
        {!user && (
          <div className="ef-warning">⚠️ Necesitas iniciar sesión con Google para buscar intercambios</div>
        )}
        <button
          className="ef-btn-primary"
          onClick={handleSetupStart}
          disabled={loading || !user}
        >
          {loading ? "Detectando ubicación..." : "📍 Buscar en mi ciudad"}
        </button>
      </div>
    </div>
  );

  // SETUP STATE
  if (step === "setup") return (
    <div className="exchange-finder">
      <div className="ef-card">
        <div className="ef-card-title">Tu perfil de intercambio</div>
        <div className="ef-city-detected">
          <span>📍</span>
          <span style={{color:"var(--cyan)",fontWeight:"700"}}>{profile.city}</span>
          <span style={{color:"var(--muted)",fontSize:"11px"}}>detectada</span>
        </div>
        <div className="ef-field">
          <label className="ef-label">Tu nombre o apodo</label>
          <input
            className="ef-input"
            placeholder="Ej: Ricardo C."
            value={profile.display_name}
            onChange={e => setProfile(p => ({...p, display_name: e.target.value}))}
            maxLength={30}
          />
        </div>
        <div className="ef-field">
          <label className="ef-label">Tu WhatsApp (con código de país)</label>
          <input
            className="ef-input"
            placeholder="Ej: 573001234567"
            value={profile.whatsapp}
            onChange={e => setProfile(p => ({...p, whatsapp: e.target.value}))}
            type="tel"
            maxLength={15}
          />
          <div className="ef-hint">Colombia: 57 · México: 52 · Argentina: 54</div>
        </div>
        <div className="ef-privacy">🔒 Tu WhatsApp solo se comparte cuando alguien quiere intercambiar contigo</div>
        <button className="ef-btn-primary" onClick={handleSaveProfile} disabled={loading}>
          {loading ? "Buscando..." : "🔍 Buscar intercambios"}
        </button>
        <button className="ef-btn-secondary" onClick={() => setStep("idle")}>Cancelar</button>
      </div>
    </div>
  );

  // RESULTS STATE
  return (
    <div className="exchange-finder">
      <div className="ef-results-header">
        <div className="ef-city-pill">📍 {(savedProfile || profile).city}</div>
        <button className="ef-refresh" onClick={() => handleSearch(savedProfile || profile)}>↻ Actualizar</button>
      </div>

      {loading ? (
        <div className="ef-loading">
          <div className="ef-loading-icon">🔍</div>
          <div>Buscando intercambios cerca...</div>
        </div>
      ) : matches.length === 0 ? (
        <div className="ef-empty">
          <div style={{fontSize:"40px",marginBottom:"12px"}}>😔</div>
          <div style={{fontWeight:"700",marginBottom:"8px"}}>Sin coincidencias aún</div>
          <div style={{fontSize:"12px",color:"var(--muted)"}}>
            Comparte la app con amigos de {(savedProfile || profile).city} para que aparezcan aquí
          </div>
          <button className="ef-btn-share" onClick={() => {
            const text = `¡Busco intercambios del álbum Panini WC 2026! Usa esta app gratis para conectarnos 🤖⚽
https://bytebots-figuritas-wc2026.vercel.app`;
            navigator.share ? navigator.share({text}) : navigator.clipboard.writeText(text).then(() => showToast("¡Link copiado!"));
          }}>📲 Invitar amigos a la app</button>
        </div>
      ) : (
        <>
          <div className="ef-results-title">{matches.length} persona{matches.length > 1 ? "s" : ""} con figuritas que te faltan</div>
          <div className="ef-matches">
            {matches.map(m => (
              <div key={m.user_id} className="ef-match-card">
                <div className="ef-match-avatar">{m.display_name[0].toUpperCase()}</div>
                <div className="ef-match-info">
                  <div className="ef-match-name">{m.display_name}</div>
                  <div className="ef-match-stickers">
                    Tiene {m.matchCount} que necesitas:
                    {" "}{m.canGiveMe.slice(0, 4).join(", ")}{m.canGiveMe.length > 4 ? ` +${m.canGiveMe.length - 4}` : ""}
                  </div>
                </div>
                <button
                  className="ef-whatsapp-btn"
                  onClick={() => openWhatsApp(m.whatsapp, m.display_name, m.canGiveMe)}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ── MAIN APP ─────────────────────────────────────────────────────────────────
// ── CONFETTI ─────────────────────────────────────────────────────────────────
function Confetti() {
  const colors = ["#00E5FF","#FFD700","#FF4466","#A78BFA","#00FF88"];
  const pieces = Array.from({length: 40}, (_, i) => ({
    id: i,
    color: colors[i % colors.length],
    left: Math.random() * 100,
    delay: Math.random() * 0.8,
    size: 6 + Math.random() * 8,
  }));
  return (
    <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:9998,overflow:"hidden"}}>
      {pieces.map(p => (
        <div key={p.id} style={{
          position:"absolute", left:`${p.left}%`, top:"-20px",
          width:p.size, height:p.size, borderRadius:"2px",
          background:p.color, opacity:0.9,
          animation:`confettiFall ${1.5 + p.delay}s ${p.delay}s ease-in forwards`,
        }}/>
      ))}
      <style>{`@keyframes confettiFall{to{transform:translateY(110vh) rotate(720deg);opacity:0}}`}</style>
    </div>
  );
}

// ── ACHIEVEMENT POPUP ────────────────────────────────────────────────────────
function AchievementPopup({ achievement, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div style={{
      position:"fixed",bottom:"80px",left:"50%",transform:"translateX(-50%)",
      background:"linear-gradient(135deg,#1a1d26,#0d1117)",
      border:"1px solid var(--cyan)",borderRadius:"16px",
      padding:"16px 20px",zIndex:9997,minWidth:"280px",
      boxShadow:"0 0 30px rgba(0,229,255,0.3)",
      animation:"popupIn 0.3s ease",
    }}>
      <style>{`@keyframes popupIn{from{opacity:0;transform:translateX(-50%) translateY(20px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}`}</style>
      <div style={{display:"flex",alignItems:"center",gap:"12px"}}>
        <div style={{fontSize:"36px",lineHeight:1}}>{achievement.icon}</div>
        <div>
          <div style={{fontSize:"10px",color:"var(--cyan)",fontFamily:"var(--mono)",textTransform:"uppercase",letterSpacing:"1px",marginBottom:"2px"}}>🏆 Logro desbloqueado</div>
          <div style={{fontSize:"15px",fontWeight:"800",color:"var(--text)"}}>{achievement.title}</div>
          <div style={{fontSize:"11px",color:"var(--muted)",marginTop:"2px"}}>{achievement.desc}</div>
        </div>
      </div>
    </div>
  );
}

// ── STATS CHART ──────────────────────────────────────────────────────────────
function StatsChart({ collection }) {
  const [period, setPeriod] = useState("week");
  const STORAGE_HISTORY_KEY = "bytebots_history_wc2026";

  // Load or initialize history
  const history = useMemo(() => {
    try {
      const raw = localStorage.getItem(STORAGE_HISTORY_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return [];
  }, []);

  // Save current snapshot daily
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const owned = Object.values(collection).filter(v => v >= 1).length;
    try {
      const raw = localStorage.getItem(STORAGE_HISTORY_KEY);
      const hist = raw ? JSON.parse(raw) : [];
      const exists = hist.find(h => h.date === today);
      if (!exists) {
        hist.push({ date: today, owned });
        if (hist.length > 365) hist.shift();
        localStorage.setItem(STORAGE_HISTORY_KEY, JSON.stringify(hist));
      }
    } catch {}
  }, [collection]);

  const days = period === "week" ? 7 : period === "month" ? 30 : 365;
  const label = period === "week" ? "Semana" : period === "month" ? "Mes" : "Año";

  // Generate chart points from history
  const points = useMemo(() => {
    const today = new Date();
    const result = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split("T")[0];
      const found = history.find(h => h.date === key);
      result.push({ date: key, owned: found ? found.owned : null });
    }
    // Fill nulls with last known value
    let last = 0;
    return result.map(p => {
      if (p.owned !== null) last = p.owned;
      return { ...p, owned: last };
    });
  }, [history, days]);

  const maxVal = Math.max(...points.map(p => p.owned), 1);
  const W = 300, H = 80, PAD = 8;

  const pathD = points.map((p, i) => {
    const x = PAD + (i / (points.length - 1)) * (W - PAD * 2);
    const y = H - PAD - ((p.owned / maxVal) * (H - PAD * 2));
    return `${i === 0 ? "M" : "L"} ${x} ${y}`;
  }).join(" ");

  const lastPoint = points[points.length - 1];
  const lastX = PAD + ((points.length - 1) / (points.length - 1)) * (W - PAD * 2);
  const lastY = H - PAD - ((lastPoint.owned / maxVal) * (H - PAD * 2));

  return (
    <div className="chart-card">
      <div className="chart-header">
        <span className="chart-title">📈 Progreso</span>
        <div className="chart-periods">
          {[["week","Semana"],["month","Mes"],["year","Año"]].map(([id, lbl]) => (
            <button key={id} className={`period-btn ${period === id ? "active" : ""}`} onClick={() => setPeriod(id)}>{lbl}</button>
          ))}
        </div>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="chart-svg">
        {/* Grid lines */}
        {[0.25, 0.5, 0.75, 1].map(f => (
          <line key={f} x1={PAD} y1={H - PAD - f * (H - PAD * 2)} x2={W - PAD} y2={H - PAD - f * (H - PAD * 2)} stroke="rgba(255,255,255,0.05)" strokeWidth="0.5"/>
        ))}
        {/* Area fill */}
        <path d={`${pathD} L ${W - PAD} ${H - PAD} L ${PAD} ${H - PAD} Z`} fill="rgba(0,229,255,0.06)"/>
        {/* Line */}
        <path d={pathD} fill="none" stroke="var(--cyan)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        {/* Last point dot */}
        <circle cx={lastX} cy={lastY} r="3" fill="var(--cyan)"/>
        <text x={lastX} y={lastY - 6} textAnchor="middle" fill="var(--cyan)" fontSize="7" fontFamily="'JetBrains Mono',monospace">{lastPoint.owned}</text>
      </svg>
      <div className="chart-labels">
        <span>{points[0]?.date?.slice(5)}</span>
        <span style={{color:"var(--muted)",fontSize:"10px"}}>{label}</span>
        <span>{points[points.length-1]?.date?.slice(5)}</span>
      </div>
    </div>
  );
}

export default function App() {
  const [collection, setCollection] = useState(loadState);
  const [filter, setFilter]         = useState("all");
  const [search, setSearch]         = useState("");
  const [tab, setTab]               = useState("album");
  const [toast, setToast]           = useState(null);
  const [stars, setStars]           = useState(loadStars);
  const [badges, setBadges]         = useState(loadBadges);
  const [showConfetti, setShowConfetti] = useState(false);
  const [newAchievement, setNewAchievement] = useState(null);
  const [user, setUser]             = useState(null);
  const [syncing, setSyncing]       = useState(false);
  const [showBanner, setShowBanner] = useState(true);
  const [showWelcome, setShowWelcome] = useState(() => {
    try { return !localStorage.getItem("bytebots_welcomed"); } catch { return true; }
  });

  const closeWelcome = () => {
    try { localStorage.setItem("bytebots_welcomed", "1"); } catch {}
    setShowWelcome(false);
  };

  // Auth listener
  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) syncFromCloud(session.user.id);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
      if (session?.user) syncFromCloud(session.user.id);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Sync local → cloud on collection change (debounced)
  const syncTimeout = useRef(null);
  useEffect(() => {
    if (!user || !supabase) return;
    clearTimeout(syncTimeout.current);
    syncTimeout.current = setTimeout(() => syncToCloud(user.id), 3000);
  }, [collection, user]);

  useEffect(() => { saveState(collection); }, [collection]);
  useEffect(() => { saveStars(stars); }, [stars]);
  useEffect(() => { saveBadges(badges); }, [badges]);

  // ── SYNC FUNCTIONS ──────────────────────────────────────────────────────────
  const syncToCloud = async (userId) => {
    if (!supabase) return;
    setSyncing(true);
    const entries = Object.entries(collection)
      .filter(([, v]) => v > 0)
      .map(([sticker_code, count]) => ({ user_id: userId, sticker_code, count }));
    if (entries.length > 0) {
      await supabase.from("stickers").upsert(entries, { onConflict: "user_id,sticker_code" });
    }
    setSyncing(false);
  };

  const syncFromCloud = async (userId) => {
    if (!supabase) return;
    setSyncing(true);
    const { data } = await supabase.from("stickers").select("sticker_code,count").eq("user_id", userId);
    if (data && data.length > 0) {
      const fresh = buildInitialState();
      data.forEach(({ sticker_code, count }) => { if (fresh[sticker_code] !== undefined) fresh[sticker_code] = count; });
      setCollection(fresh);
      saveState(fresh);
      showToast("✅ Datos sincronizados desde la nube");
    }
    setSyncing(false);
  };

  const loginWithGoogle = async () => {
    if (!supabase) return;
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.href }
    });
  };

  const logout = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setUser(null);
    showToast("Sesión cerrada");
  };

  const showToast = (msg, type = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2200);
  };

  const handleAdd = useCallback((id) => {
    setCollection((prev) => {
      const next = { ...prev, [id]: (prev[id] ?? 0) + 1 };
      // Check achievements
      const owned = Object.values(next).filter(v => v >= 1).length;
      setBadges(prevBadges => {
        const newBadge = ACHIEVEMENTS.find(a => a.threshold === owned && !prevBadges.includes(a.id));
        if (newBadge) {
          setShowConfetti(true);
          setNewAchievement(newBadge);
          setTimeout(() => setShowConfetti(false), 3000);
          return [...prevBadges, newBadge.id];
        }
        return prevBadges;
      });
      return next;
    });
  }, []);

  const handleRemove = useCallback((id) => {
    setCollection((prev) => {
      const cur = prev[id] ?? 0;
      if (cur === 0) return prev;
      showToast(`↩ ${id} restada`, "warn");
      return { ...prev, [id]: cur - 1 };
    });
  }, []);

  // Global counts
  const totalStickers  = useMemo(() => Object.keys(collection).length, [collection]);
  const totalOwned     = useMemo(() => Object.values(collection).filter(v => v >= 1).length, [collection]);
  const totalMissing   = totalStickers - totalOwned;
  const totalDuplicates = useMemo(() => Object.values(collection).filter(v => v >= 2).length, [collection]);
  const pctGlobal      = Math.round((totalOwned / totalStickers) * 100);

  // Estimador probabilístico simplificado
  const remainingPacks = useMemo(() => {
    if (totalMissing === 0) return 0;
    return Math.ceil((totalMissing * 1.4) / 5);
  }, [totalMissing]);

  const duplicateList = useMemo(() => {
    const list = [];
    SECTIONS.forEach((s) => {
      for (let i = 1; i <= s.count; i++) {
        const id = `${s.id}-${i}`;
        const v = collection[id] ?? 0;
        if (v >= 2) list.push({ id, section: s.label, count: v - 1 });
      }
    });
    return list;
  }, [collection]);

  const missingList = useMemo(() => {
    const list = [];
    SECTIONS.forEach((s) => {
      const missing = [];
      for (let i = 1; i <= s.count; i++) {
        if ((collection[`${s.id}-${i}`] ?? 0) === 0) missing.push(i);
      }
      if (missing.length > 0) list.push({ section: s.label, emoji: s.emoji, nums: missing });
    });
    return list;
  }, [collection]);

  const toggleStar = useCallback((id) => {
    setStars(prev => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const copyTrade = () => {
    const lines = duplicateList.map(d => `• ${d.id} (${d.section}) — +${d.count}`);
    const text = `🔄 MIS REPETIDAS — Mundial 2026\n${lines.join("\n")}\n\n💬 ¡Escríbeme para intercambiar!`;
    navigator.clipboard.writeText(text).then(() => showToast("¡Lista copiada para WhatsApp!"));
  };

  const copyMissing = () => {
    const lines = missingList.map(s => `${s.emoji} ${s.section}: ${s.nums.join(", ")}`);
    const text = `❌ ME FALTAN — Mundial 2026\n${lines.join("\n")}`;
    navigator.clipboard.writeText(text).then(() => showToast("¡Lista de faltantes copiada!"));
  };

  const resetAll = () => {
    if (window.confirm("¿Resetear TODA la colección? No se puede deshacer.")) {
      setCollection(buildInitialState());
      showToast("Colección reseteada", "warn");
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800;900&family=Roboto:wght@400;500&family=JetBrains+Mono:wght@400;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg:       #08090c;
          --surface:  #111318;
          --surface2: #1a1d26;
          --border:   rgba(255,255,255,0.07);
          --cyan:     #00E5FF;
          --cyan-dim: #00B4D4;
          --gold:     #FFD700;
          --red:      #FF4466;
          --green:    #00FF88;
          --purple:   #A78BFA;
          --text:     #E8EAF0;
          --muted:    #6B7280;
          --font:     'Syne', sans-serif;
          --mono:     'JetBrains Mono', monospace;
        }

        body {
          background: var(--bg);
          color: var(--text);
          font-family: var(--font);
          min-height: 100vh;
          overflow-x: hidden;
        }

        /* ── HEADER ── */
        .app-header {
          position: sticky; top: 0; z-index: 100;
          background: linear-gradient(135deg, #1D3567, #152547);
          border-bottom: 2px solid #D81B7D;
          padding: 12px 16px;
        }
        .header-top {
          display: flex; justify-content: space-between; align-items: center;
          margin-bottom: 10px; flex-wrap: wrap; gap: 8px;
        }
        .brand { display: flex; align-items: center; gap: 10px; }
        .brand-logo {
          width: 34px; height: 34px;
          background: #D81B7D;
          border-radius: 10px; display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; box-shadow: 0 2px 12px rgba(216,27,125,0.4);
        }
        .brand-title { font-size: 14px; font-weight: 800; letter-spacing: -0.3px; font-family: 'Montserrat', sans-serif; }
        .brand-byte { color: #D81B7D; }
        .brand-bots { color: #F2F4F7; }
        .brand-app  { color: rgba(242,244,247,0.55); font-size: 12px; font-weight: 700; }
        .brand-sub { font-size: 9px; color: rgba(242,244,247,0.4); font-family: var(--mono); letter-spacing: 0.5px; }
        .global-stats { display: flex; gap: 5px; flex-wrap: wrap; }
        .stat-pill {
          background: var(--surface2); border: 1px solid var(--border);
          border-radius: 20px; padding: 3px 9px;
          font-size: 10px; font-family: var(--mono); white-space: nowrap;
        }
        .stat-pill .num { font-weight: 700; }
        .num-cyan { color: var(--cyan); }
        .num-red  { color: var(--red);  }
        .num-gold { color: var(--gold); }

        .global-progress { display: flex; align-items: center; gap: 10px; }
        .global-pct { font-size: 11px; font-family: var(--mono); color: #F2F4F7; min-width: 34px; }
        .progress-track { flex: 1; height: 3px; background: var(--surface2); border-radius: 2px; overflow: hidden; }
        .progress-fill  { height: 100%; border-radius: 2px; transition: width 0.35s ease; }

        /* ── TABS ── */
        .tab-bar {
          display: flex; gap: 2px; padding: 10px 14px 0;
          border-bottom: 1px solid var(--border); background: #0f1520;
        }
        .tab-btn {
          background: none; border: none; color: var(--muted);
          font-family: var(--font); font-size: 12px; font-weight: 700;
          padding: 7px 14px; border-bottom: 2px solid transparent;
          cursor: pointer; transition: all 0.15s; letter-spacing: 0.2px;
        }
        .tab-btn.active { color: #D81B7D; border-bottom-color: #D81B7D; }

        /* ── FILTER BAR ── */
        .filter-bar {
          display: flex; gap: 6px; padding: 12px 14px;
          align-items: center; flex-wrap: wrap;
        }
        .filter-btn {
          background: var(--surface); border: 1px solid var(--border); border-radius: 20px;
          color: var(--muted); font-family: var(--font); font-size: 11px; font-weight: 700;
          padding: 5px 12px; cursor: pointer; transition: all 0.15s;
        }
        .filter-btn.active { background: var(--cyan); color: #000; border-color: var(--cyan); }

        .search-box {
          flex: 1; min-width: 120px;
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 20px; color: var(--text); font-family: var(--font);
          font-size: 11px; padding: 5px 12px; outline: none; transition: border-color 0.15s;
        }
        .search-box:focus { border-color: var(--cyan-dim); }
        .search-box::placeholder { color: var(--muted); }

        /* ── INSTRUCTIONS BANNER ── */
        .instructions {
          display: flex; gap: 12px; padding: 0 14px 8px;
          font-size: 10px; color: var(--muted); font-family: var(--mono);
          flex-wrap: wrap; align-items: center;
        }
        .ins-item { display: flex; align-items: center; gap: 5px; }
        .ins-dot {
          width: 20px; height: 20px; border-radius: 5px;
          display: flex; align-items: center; justify-content: center;
          font-size: 9px; font-weight: 700;
        }
        .ins-dot.missing   { background: var(--surface2); border: 1px dashed #444; color: var(--muted); }
        .ins-dot.owned     { background: rgba(0,229,255,0.15); border: 1px solid rgba(0,229,255,0.4); color: var(--cyan); }
        .ins-dot.duplicate { background: rgba(255,212,0,0.15); border: 1px solid rgba(255,212,0,0.4); color: var(--gold); }
        .ins-separator { color: #333; }

        /* ── SECTIONS ── */
        .sections-list { padding: 0 10px 80px; display: flex; flex-direction: column; gap: 5px; }
        .section-card {
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 11px; overflow: hidden; transition: border-color 0.15s;
        }
        .section-card:hover { border-color: rgba(0,229,255,0.18); }
        .section-header {
          width: 100%; background: none; border: none; cursor: pointer;
          display: flex; justify-content: space-between; align-items: center;
          padding: 11px 13px 7px; color: var(--text); font-family: var(--font);
        }
        .section-left { display: flex; align-items: center; gap: 8px; }
        .section-emoji { font-size: 17px; }
        .section-label { font-size: 12px; font-weight: 700; text-align: left; }
        .section-right { display: flex; align-items: center; gap: 8px; font-size: 11px; font-family: var(--mono); }
        .section-count { color: var(--muted); }
        .section-pct   { font-weight: 700; }
        .chevron { color: var(--muted); font-size: 9px; transition: transform 0.2s; display: inline-block; }
        .chevron.open { transform: rotate(180deg); }

        /* ── STICKER GRID ── */
        .sticker-grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(42px, 1fr));
          gap: 5px; padding: 6px 10px 10px;
        }
        .sticker-card {
          aspect-ratio: 1; border-radius: 7px; border: 1px solid var(--border);
          cursor: pointer; font-family: var(--mono); font-size: 10px; font-weight: 600;
          position: relative; transition: transform 0.12s, box-shadow 0.12s;
          display: flex; align-items: center; justify-content: center;
          -webkit-tap-highlight-color: transparent;
        }
        .sticker-card.state-missing   { background: var(--surface2); color: var(--muted); border-style: dashed; }
        .sticker-card.state-owned     { background: rgba(0,229,255,0.1); border-color: rgba(0,229,255,0.4); color: var(--cyan); }
        .sticker-card.state-duplicate { background: rgba(255,212,0,0.12); border-color: rgba(255,212,0,0.4); color: var(--gold); }
        .sticker-card:hover  { transform: scale(1.06); box-shadow: 0 2px 12px rgba(0,0,0,0.4); }
        .sticker-card:active { transform: scale(0.93); }

        .dup-badge {
          position: absolute; top: 1px; right: 3px;
          font-size: 7px; color: var(--gold); font-weight: 700;
        }
        .remove-hint {
          position: absolute; bottom: 1px; left: 50%;
          transform: translateX(-50%);
          font-size: 7px; color: rgba(255,255,255,0.15);
          font-family: var(--mono);
        }

        /* ── STATS TAB ── */
        .stats-container { padding: 14px; display: flex; flex-direction: column; gap: 12px; }
        .stats-hero {
          background: linear-gradient(135deg, var(--surface2), rgba(0,229,255,0.06));
          border: 1px solid rgba(0,229,255,0.15);
          border-radius: 14px; padding: 18px; text-align: center;
        }
        .stats-hero-pct {
          font-size: 52px; font-weight: 800; color: var(--cyan);
          line-height: 1; letter-spacing: -2px;
        }
        .stats-hero-label {
          font-size: 10px; color: var(--muted); margin-top: 4px;
          font-family: var(--mono); text-transform: uppercase; letter-spacing: 1px;
        }
        .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
        .stat-card { background: var(--surface); border: 1px solid var(--border); border-radius: 11px; padding: 13px; }
        .stat-card-num  { font-size: 26px; font-weight: 800; font-family: var(--mono); line-height: 1; }
        .stat-card-label { font-size: 10px; color: var(--muted); margin-top: 3px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }

        .estimator-card {
          background: var(--surface); border: 1px solid rgba(167,139,250,0.25);
          border-radius: 11px; padding: 14px;
        }
        .estimator-title { font-size: 10px; color: var(--muted); font-family: var(--mono); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px; }
        .estimator-val   { font-size: 20px; font-weight: 800; color: var(--purple); }
        .estimator-desc  { font-size: 10px; color: var(--muted); margin-top: 4px; line-height: 1.5; }

        .top-sections { background: var(--surface); border: 1px solid var(--border); border-radius: 11px; padding: 13px; }
        .top-sections-title { font-size: 10px; color: var(--muted); font-family: var(--mono); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 9px; }
        .top-row { display: flex; align-items: center; gap: 8px; margin-bottom: 7px; }
        .top-row-label { font-size: 11px; font-weight: 600; min-width: 140px; }
        .top-row-pct   { font-size: 10px; font-family: var(--mono); color: var(--muted); min-width: 34px; text-align: right; }

        /* ── TRADE TAB ── */
        .trade-container { padding: 14px; display: flex; flex-direction: column; gap: 12px; }
        .trade-card { background: var(--surface); border: 1px solid var(--border); border-radius: 11px; overflow: hidden; }
        .trade-card-header {
          display: flex; justify-content: space-between; align-items: center;
          padding: 11px 13px; border-bottom: 1px solid var(--border);
        }
        .trade-card-title { font-size: 12px; font-weight: 700; }
        .copy-btn {
          background: var(--cyan); color: #000; border: none; border-radius: 7px;
          font-family: var(--font); font-size: 10px; font-weight: 800;
          padding: 5px 11px; cursor: pointer; transition: opacity 0.15s;
        }
        .copy-btn:hover { opacity: 0.82; }
        .reset-btn {
          background: none; border: 1px solid rgba(255,68,102,0.3); color: var(--red);
          border-radius: 7px; font-family: var(--font); font-size: 10px; font-weight: 800;
          padding: 5px 11px; cursor: pointer; transition: all 0.15s;
        }
        .reset-btn:hover { background: rgba(255,68,102,0.1); }

        .trade-list { padding: 8px 13px; display: flex; flex-direction: column; gap: 4px; max-height: 240px; overflow-y: auto; }
        .trade-item { display: flex; justify-content: space-between; align-items: center; font-size: 11px; padding: 5px 0; border-bottom: 1px solid var(--border); }
        .trade-item:last-child { border-bottom: none; }
        .trade-item-id  { font-family: var(--mono); color: var(--cyan); font-weight: 700; }
        .trade-item-sec { color: var(--muted); font-size: 10px; }
        .trade-item-count { color: var(--gold); font-family: var(--mono); font-weight: 700; }

        .empty-state { padding: 24px; text-align: center; color: var(--muted); font-size: 12px; }

        .data-info { padding: 11px 13px; font-size: 11px; color: var(--muted); line-height: 1.6; }
        .data-info strong { color: var(--text); }

        /* ── TOAST ── */
        .toast {
          position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%);
          font-family: var(--font); font-size: 12px; font-weight: 800;
          padding: 9px 18px; border-radius: 28px; z-index: 999;
          animation: toastIn 0.2s ease; white-space: nowrap;
          pointer-events: none;
        }
        .toast.ok   { background: var(--cyan);  color: #000; }

        /* ── BYTEBOTS BRAND ── */
        .bb-brand-header{background:linear-gradient(135deg,var(--surface2),rgba(0,229,255,0.05));border:1px solid rgba(0,229,255,0.15);border-radius:12px;padding:12px 14px;display:flex;justify-content:space-between;align-items:center}
        .bb-brand-inner{display:flex;align-items:center;gap:10px}
        .bb-brand-name{font-size:15px;font-weight:800;color:var(--cyan);letter-spacing:-0.3px}
        .bb-brand-tag{font-size:9px;color:var(--muted);font-family:var(--mono);margin-top:2px}
        .bb-brand-url{font-size:9px;color:var(--cyan-dim);font-family:var(--mono);opacity:0.7}

        /* ── HERO CIRCULAR ── */
        .stats-hero{display:flex;flex-direction:column;align-items:center;gap:10px;background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:20px}
        .hero-circle-wrap{position:relative;width:130px;height:130px;display:flex;align-items:center;justify-content:center}
        .hero-circle-center{position:absolute;text-align:center}
        .hero-pct{font-size:32px;font-weight:800;color:var(--cyan);line-height:1;letter-spacing:-1px}
        .hero-pct-label{font-size:10px;color:var(--muted);font-family:var(--mono)}
        .hero-meta{text-align:center}
        .hero-meta-title{font-size:13px;font-weight:700}
        .hero-meta-sub{font-size:11px;color:var(--muted);font-family:var(--mono);margin-top:2px}

        /* ── MÉTRICAS ── */
        .stats-grid-2x2{display:grid;grid-template-columns:1fr 1fr;gap:8px}
        .metric-card{background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:14px;display:flex;flex-direction:column;gap:4px;position:relative;overflow:hidden}
        .metric-card::before{content:"";position:absolute;top:0;left:0;right:0;height:2px}
        .metric-card.cyan::before{background:var(--cyan)}
        .metric-card.red::before{background:var(--red)}
        .metric-card.gold::before{background:var(--gold)}
        .metric-card.purple::before{background:var(--purple)}
        .metric-icon{font-size:16px;opacity:0.5}
        .metric-num{font-size:28px;font-weight:800;font-family:var(--mono);line-height:1}
        .metric-card.cyan .metric-num{color:var(--cyan)}
        .metric-card.red .metric-num{color:var(--red)}
        .metric-card.gold .metric-num{color:var(--gold)}
        .metric-card.purple .metric-num{color:var(--purple)}
        .metric-label{font-size:10px;color:var(--muted);font-weight:700;text-transform:uppercase;letter-spacing:0.5px}

        /* ── FOOTER ── */
        .bytebots-footer{text-align:center;padding:14px;font-size:11px;color:var(--muted);font-family:var(--mono);border-top:1px solid var(--border);line-height:1.8}
        .bytebots-footer span{color:var(--cyan);font-weight:700}
        .chart-card{background:var(--surface);border:1px solid var(--border);border-radius:11px;padding:14px}
        .chart-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}
        .chart-title{font-size:12px;font-weight:700}
        .chart-periods{display:flex;gap:4px}
        .period-btn{background:var(--surface2);border:1px solid var(--border);border-radius:6px;color:var(--muted);font-family:var(--font);font-size:10px;font-weight:700;padding:3px 8px;cursor:pointer;transition:all 0.15s}
        .period-btn.active{background:var(--cyan);color:#000;border-color:var(--cyan)}
        .chart-svg{width:100%;height:auto}
        .chart-labels{display:flex;justify-content:space-between;font-size:9px;color:var(--muted);font-family:var(--mono);margin-top:4px}
        .achievements-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:8px}
        .achievement-card{border-radius:10px;padding:10px;text-align:center;border:1px solid var(--border);transition:all 0.2s}
        .achievement-card.unlocked{background:linear-gradient(135deg,rgba(0,229,255,0.1),rgba(167,139,250,0.08));border-color:rgba(0,229,255,0.3)}
        .achievement-card.locked{background:var(--surface2);opacity:0.5}
        .ach-icon{font-size:24px;margin-bottom:4px}
        .ach-title{font-size:10px;font-weight:800;color:var(--text);margin-bottom:2px}
        .ach-desc{font-size:8px;color:var(--muted);line-height:1.3}
        .star-row{display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid var(--border);cursor:pointer;transition:all 0.15s}
        .star-row:last-child{border-bottom:none}
        .star-row.got .star-name{color:var(--cyan)}
        .star-row.got{background:rgba(0,229,255,0.03);border-radius:8px;padding:10px 6px}
        .star-emoji{font-size:22px;flex-shrink:0}
        .star-info{flex:1}
        .star-name{font-size:12px;font-weight:700;color:var(--text)}
        .star-team{font-size:10px;color:var(--muted);margin-top:1px}
        .star-check{font-size:18px;color:var(--muted);font-weight:700;min-width:24px;text-align:center}
        .star-check.checked{color:var(--cyan)}
        .rare-badge{background:linear-gradient(90deg,#FFD700,#FF8C00);color:#000;font-size:7px;font-weight:800;padding:1px 4px;border-radius:4px;margin-left:4px;vertical-align:middle}
        .sync-banner{display:flex;align-items:center;gap:8px;background:rgba(255,212,0,0.08);border-bottom:1px solid rgba(255,212,0,0.2);padding:8px 14px;font-size:11px;color:var(--text);flex-wrap:wrap}
        .sync-cta{background:#D81B7D;color:#fff;border:none;border-radius:6px;font-family:var(--font);font-size:10px;font-weight:800;padding:4px 10px;cursor:pointer;white-space:nowrap}
        .banner-close{background:none;border:none;color:var(--muted);font-size:12px;cursor:pointer;padding:0 4px;margin-left:auto}
        .donut-wrap{display:flex;justify-content:center;margin-bottom:12px}
        .exchange-finder{padding:14px;display:flex;flex-direction:column;gap:12px}
        .ef-hero{background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:28px 20px;text-align:center;display:flex;flex-direction:column;align-items:center;gap:14px}
        .ef-icon{font-size:48px}
        .ef-title{font-size:20px;font-weight:800;color:var(--text);line-height:1.2;font-family:'Montserrat',sans-serif}
        .ef-sub{font-size:13px;color:var(--muted);line-height:1.6;max-width:300px}
        .ef-stats{display:flex;align-items:center;gap:20px;margin:4px 0}
        .ef-stat{display:flex;flex-direction:column;align-items:center;gap:2px}
        .ef-num{font-size:28px;font-weight:800;font-family:var(--mono);line-height:1}
        .ef-lbl{font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:1px;font-weight:700}
        .ef-stat-div{width:1px;height:40px;background:var(--border)}
        .ef-warning{background:rgba(255,212,0,0.08);border:1px solid rgba(255,212,0,0.2);border-radius:10px;padding:10px 14px;font-size:12px;color:var(--gold);width:100%}
        .ef-btn-primary{width:100%;background:#D81B7D;color:#fff;border:none;border-radius:12px;font-family:'Montserrat',sans-serif;font-weight:800;font-size:15px;padding:16px;cursor:pointer;transition:opacity 0.15s}
        .ef-btn-primary:disabled{opacity:0.5;cursor:not-allowed}
        .ef-btn-primary:hover:not(:disabled){opacity:0.88}
        .ef-btn-secondary{width:100%;background:none;border:1px solid var(--border);color:var(--muted);border-radius:12px;font-family:var(--font);font-size:13px;font-weight:600;padding:12px;cursor:pointer}
        .ef-card{background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:20px;display:flex;flex-direction:column;gap:14px}
        .ef-card-title{font-size:15px;font-weight:800;color:var(--text);font-family:'Montserrat',sans-serif}
        .ef-city-detected{display:flex;align-items:center;gap:8px;background:rgba(0,229,255,0.06);border:1px solid rgba(0,229,255,0.15);border-radius:10px;padding:10px 14px;font-size:13px}
        .ef-field{display:flex;flex-direction:column;gap:6px}
        .ef-label{font-size:11px;color:var(--muted);font-weight:700;text-transform:uppercase;letter-spacing:0.5px}
        .ef-input{background:var(--surface2);border:1px solid var(--border);border-radius:10px;color:var(--text);font-family:var(--font);font-size:14px;padding:12px 14px;outline:none;transition:border-color 0.15s}
        .ef-input:focus{border-color:var(--cyan)}
        .ef-hint{font-size:10px;color:var(--muted)}
        .ef-privacy{font-size:11px;color:var(--muted);background:var(--surface2);border-radius:8px;padding:8px 12px;line-height:1.5}
        .ef-results-header{display:flex;justify-content:space-between;align-items:center}
        .ef-city-pill{background:var(--surface);border:1px solid var(--border);border-radius:20px;padding:6px 14px;font-size:12px;font-weight:700;color:var(--text)}
        .ef-refresh{background:none;border:1px solid var(--border);color:var(--muted);border-radius:8px;font-size:12px;padding:6px 12px;cursor:pointer;font-family:var(--font);font-weight:600}
        .ef-results-title{font-size:13px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:0.5px;font-family:var(--mono)}
        .ef-matches{display:flex;flex-direction:column;gap:8px}
        .ef-match-card{background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:14px;display:flex;align-items:center;gap:12px;transition:border-color 0.15s}
        .ef-match-card:hover{border-color:rgba(0,229,255,0.2)}
        .ef-match-avatar{width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,#D81B7D,#1D3567);display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:800;color:#fff;font-family:'Montserrat',sans-serif;flex-shrink:0}
        .ef-match-info{flex:1;min-width:0}
        .ef-match-name{font-size:14px;font-weight:700;color:var(--text)}
        .ef-match-stickers{font-size:11px;color:var(--muted);margin-top:2px;font-family:var(--mono);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .ef-whatsapp-btn{background:#25D366;border:none;border-radius:10px;width:44px;height:44px;display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;transition:opacity 0.15s}
        .ef-whatsapp-btn:hover{opacity:0.85}
        .ef-loading{text-align:center;padding:40px;color:var(--muted);font-size:14px;display:flex;flex-direction:column;align-items:center;gap:12px}
        .ef-loading-icon{font-size:36px;animation:spin 2s linear infinite}
        @keyframes spin{to{transform:rotate(360deg)}}
        .ef-empty{text-align:center;padding:32px 20px;color:var(--muted);font-size:13px;display:flex;flex-direction:column;align-items:center;gap:8px}
        .ef-btn-share{background:var(--surface2);border:1px solid var(--border);color:var(--text);border-radius:10px;font-family:var(--font);font-size:13px;font-weight:700;padding:12px 20px;cursor:pointer;margin-top:8px}
        .donut-svg{width:130px;height:130px}
        .stats-summary-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
        .sum-item{display:flex;align-items:center;gap:10px;background:var(--surface2);border-radius:10px;padding:10px}
        .sum-icon{width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0}
        .sum-num{font-size:20px;font-weight:800;font-family:var(--mono);line-height:1}
        .sum-label{font-size:9px;color:var(--muted);font-weight:700;text-transform:uppercase;letter-spacing:0.5px}
        .toast.warn { background: var(--red);   color: #fff; }
        @keyframes toastIn {
          from { opacity:0; transform: translateX(-50%) translateY(8px); }
          to   { opacity:1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>

      {/* HEADER */}
      <div className="app-header">
        <div className="header-top">
          <div className="brand">
            <div className="brand-logo">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <rect x="2" y="2" width="20" height="20" rx="5" fill="#00E5FF" opacity="0.15"/>
                <circle cx="12" cy="10" r="4" stroke="#00E5FF" strokeWidth="2"/>
                <path d="M6 20c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="#00E5FF" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="12" cy="10" r="1.5" fill="#00E5FF"/>
              </svg>
            </div>
            <div>
              <div className="brand-title"><span className="brand-byte">Byte</span><span className="brand-bots">Bots</span> <span className="brand-app">Figuritas</span></div>
              <div className="brand-sub">WC 2026 · 48 SELECCIONES · CARTAGENA</div>
            </div>
          </div>
          <div className="global-stats">
            <div className="stat-pill"><span className="num num-cyan">{totalOwned}</span> / {totalStickers}</div>
            <div className="stat-pill"><span className="num num-red">{totalMissing}</span> faltan</div>
            {user
              ? <div className="stat-pill" style={{cursor:"pointer",borderColor:"rgba(0,229,255,0.3)"}} onClick={logout} title="Cerrar sesión">
                  <span style={{color:"var(--cyan)"}}>☁️</span> {syncing ? "⟳" : "✓"}
                </div>
              : <div className="stat-pill" style={{cursor:"pointer",borderColor:"rgba(255,212,0,0.3)",color:"var(--gold)"}} onClick={loginWithGoogle}>
                  🔑 Guardar
                </div>
            }
          </div>
        </div>
        <div className="global-progress">
          <span className="global-pct">{pctGlobal}%</span>
          <div className="progress-track" style={{ flex: 1 }}>
            <div className="progress-fill" style={{ width: `${pctGlobal}%`, background: "linear-gradient(90deg, var(--cyan-dim), var(--cyan))" }} />
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="tab-bar">
        {[
          { id: "album",  label: "📖 Álbum" },
          { id: "stats",  label: "📊 Stats" },
          { id: "trade",  label: "🔄 Intercambio" },
        ].map(t => (
          <button key={t.id} className={`tab-btn ${tab === t.id ? "active" : ""}`} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ALBUM TAB */}
      {tab === "album" && (
        <>
          {!user && showBanner && (
            <div className="sync-banner">
              <span>⚠️ Tus datos están solo en este navegador.</span>
              <button className="sync-cta" onClick={loginWithGoogle}>Guardar con Google</button>
              <button className="banner-close" onClick={() => setShowBanner(false)}>✕</button>
            </div>
          )}
          <div className="filter-bar">
            {[
              { id: "all",       label: "Todas" },
              { id: "missing",   label: "Me faltan" },
              { id: "duplicate", label: "Repetidas" },
            ].map(f => (
              <button key={f.id} className={`filter-btn ${filter === f.id ? "active" : ""}`} onClick={() => setFilter(f.id)}>
                {f.label}
              </button>
            ))}
            <input
              className="search-box"
              placeholder="🔍 Buscar selección..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* INSTRUCTIONS */}
          <div className="instructions">
            <div className="ins-item">
              <div className="ins-dot missing">–</div>
              <span>Falta</span>
            </div>
            <div className="ins-item">
              <div className="ins-dot owned">✓</div>
              <span>Tengo · <strong style={{color:"var(--text)"}}>toca = agregar</strong></span>
            </div>
            <div className="ins-item">
              <div className="ins-dot duplicate">×2</div>
              <span>Repetida · <strong style={{color:"var(--text)"}}>mantén presionado = quitar una</strong></span>
            </div>
          </div>

          <div className="sections-list">
            {SECTIONS.map(s => (
              <Section
                key={s.id}
                section={s}
                collection={collection}
                onAdd={handleAdd}
                onRemove={handleRemove}
                filter={filter}
                search={search}
              />
            ))}
          </div>
        </>
      )}

      {/* STATS TAB */}
      {tab === "stats" && (
        <div className="stats-container">

          {/* BYTEBOTS BRAND HEADER */}
          <div className="bb-brand-header">
            <div className="bb-brand-inner">
              <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
                <rect width="40" height="40" rx="10" fill="#00E5FF" opacity="0.12"/>
                <text x="20" y="26" textAnchor="middle" fontSize="20" fill="#00E5FF">🤖</text>
              </svg>
              <div>
                <div className="bb-brand-name">ByteBots</div>
                <div className="bb-brand-tag">Academia de IA · Robótica · Programación</div>
              </div>
            </div>
            <div className="bb-brand-url">bytebots.com.co</div>
          </div>

          {/* HERO CIRCULAR */}
          <div className="stats-hero">
            <div className="hero-circle-wrap">
              <svg width="130" height="130" viewBox="0 0 130 130">
                <circle cx="65" cy="65" r="56" fill="none" stroke="rgba(0,229,255,0.1)" strokeWidth="12"/>
                <circle cx="65" cy="65" r="56" fill="none" stroke="#00E5FF" strokeWidth="12"
                  strokeDasharray={`${2 * Math.PI * 56}`}
                  strokeDashoffset={`${2 * Math.PI * 56 * (1 - pctGlobal / 100)}`}
                  strokeLinecap="round"
                  transform="rotate(-90 65 65)"
                  style={{transition:"stroke-dashoffset 0.6s ease"}}
                />
              </svg>
              <div className="hero-circle-center">
                <div className="hero-pct">{pctGlobal}%</div>
                <div className="hero-pct-label">listo</div>
              </div>
            </div>
            <div className="hero-meta">
              <div className="hero-meta-title">Álbum Mundial 2026</div>
              <div className="hero-meta-sub">{totalOwned} de {totalStickers} figuritas</div>
            </div>
          </div>

          {/* MÉTRICAS GRANDES */}
          <div className="stats-grid-2x2">
            <div className="metric-card cyan">
              <div className="metric-icon">✓</div>
              <div className="metric-num">{totalOwned}</div>
              <div className="metric-label">Tengo</div>
            </div>
            <div className="metric-card red">
              <div className="metric-icon">✕</div>
              <div className="metric-num">{totalMissing}</div>
              <div className="metric-label">Me faltan</div>
            </div>
            <div className="metric-card gold">
              <div className="metric-icon">⟳</div>
              <div className="metric-num">{totalDuplicates}</div>
              <div className="metric-label">Repetidas</div>
            </div>
            <div className="metric-card purple">
              <div className="metric-icon">⚡</div>
              <div className="metric-num">~{remainingPacks}</div>
              <div className="metric-label">Sobres est.</div>
            </div>
          </div>

          {/* PROGRESO POR SECCIÓN */}
          <div className="top-sections">
            <div className="top-sections-title">Progreso por selección</div>
            {SECTIONS.map(s => {
              let owned = 0;
              for (let i = 1; i <= s.count; i++) {
                if ((collection[`${s.id}-${i}`] ?? 0) >= 1) owned++;
              }
              const p = Math.round((owned / s.count) * 100);
              return (
                <div className="top-row" key={s.id}>
                  <span className="top-row-label">{s.emoji} {s.label}</span>
                  <div className="progress-track" style={{ flex: 1 }}>
                    <div className="progress-fill" style={{ width: `${p}%`, background: s.color }} />
                  </div>
                  <span className="top-row-pct">{p}%</span>
                </div>
              );
            })}
          </div>

          {/* FOOTER BYTEBOTS */}
          <div className="bytebots-footer">
            Desarrollado por <span>ByteBots</span> · bytebots.com.co<br/>
            <span style={{fontSize:"9px",color:"var(--muted)"}}>Academia de IA, Robótica y Programación · Colombia 🇨🇴</span>
          </div>

        </div>
      )}

      {/* TRADE TAB */}
      {tab === "stars" && (
        <div className="stats-container">
          {/* LOGROS */}
          <div className="top-sections">
            <div className="top-sections-title">🏆 Logros — {badges.length}/{ACHIEVEMENTS.length} desbloqueados</div>
            <div className="achievements-grid">
              {ACHIEVEMENTS.map(a => {
                const unlocked = badges.includes(a.id);
                return (
                  <div key={a.id} className={`achievement-card ${unlocked ? "unlocked" : "locked"}`}>
                    <div className="ach-icon">{unlocked ? a.icon : "🔒"}</div>
                    <div className="ach-title">{a.title}</div>
                    <div className="ach-desc">{unlocked ? a.desc : `${a.threshold} figuritas`}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ESTRELLAS */}
          <div className="top-sections">
            <div className="top-sections-title">⭐ Figuras Estrella — {Object.values(stars).filter(Boolean).length}/{STARS.length} conseguidas</div>
            {STARS.map(s => (
              <div key={s.id} className={`star-row ${stars[s.id] ? "got" : ""}`} onClick={() => toggleStar(s.id)}>
                <div className="star-emoji">{s.emoji}</div>
                <div className="star-info">
                  <div className="star-name">{s.name} {s.rare ? <span className="rare-badge">RARE</span> : ""}</div>
                  <div className="star-team">{s.team}</div>
                </div>
                <div className={`star-check ${stars[s.id] ? "checked" : ""}`}>{stars[s.id] ? "✓" : "○"}</div>
              </div>
            ))}
          </div>
          <div className="bytebots-footer">Desarrollado con ❤️ por <span>ByteBots</span> · bytebots.com.co · Cartagena</div>
        </div>
      )}

      {tab === "trade" && (
        <div className="trade-container">
          <div className="trade-card">
            <div className="trade-card-header">
              <span className="trade-card-title">🔄 Mis Repetidas ({duplicateList.length})</span>
              <button className="copy-btn" onClick={copyTrade}>📋 Copiar para WhatsApp</button>
            </div>
            {duplicateList.length === 0
              ? <div className="empty-state">Sin repetidas todavía</div>
              : <div className="trade-list">
                  {duplicateList.map(d => (
                    <div className="trade-item" key={d.id}>
                      <div>
                        <span className="trade-item-id">{d.id}</span>
                        <span className="trade-item-sec"> · {d.section}</span>
                      </div>
                      <span className="trade-item-count">+{d.count}</span>
                    </div>
                  ))}
                </div>
            }
          </div>

          <div className="trade-card">
            <div className="trade-card-header">
              <span className="trade-card-title">❌ Me faltan ({totalMissing})</span>
              <button className="copy-btn" onClick={copyMissing}>📋 Copiar para WhatsApp</button>
            </div>
            {missingList.length === 0
              ? <div className="empty-state">🏆 ¡Álbum completo!</div>
              : <div className="trade-list">
                  {missingList.map(s => (
                    <div className="trade-item" key={s.section}>
                      <span>{s.emoji} {s.section}</span>
                      <span className="trade-item-sec">
                        {s.nums.slice(0, 10).join(", ")}{s.nums.length > 10 ? ` +${s.nums.length - 10} más` : ""}
                      </span>
                    </div>
                  ))}
                </div>
            }
          </div>

          <div className="trade-card">
            <div className="trade-card-header">
              <span className="trade-card-title">⚙️ Datos y privacidad</span>
              <button className="reset-btn" onClick={resetAll}>🗑 Resetear todo</button>
            </div>
            <div className="data-info">
              <strong>Sin cuenta. Sin servidor.</strong> Todos los datos se guardan en el almacenamiento local de tu navegador (<code>localStorage</code>). Nadie más puede verlos. Si cambias de dispositivo o navegador, los datos no se transfieren (esa es la próxima iteración: sync por QR o cuenta opcional).
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {tab === "exchange" && (
        <ExchangeFinder
          collection={collection}
          user={user}
          supabase={supabase}
          showToast={showToast}
        />
      )}

      {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}

      {/* WELCOME MODAL */}
      {showWelcome && (
        <div style={{
          position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",
          zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center",
          padding:"20px",backdropFilter:"blur(8px)"
        }}>
          <div style={{
            background:"linear-gradient(135deg,#1D3567,#111318)",
            border:"2px solid #D81B7D",
            borderRadius:"24px",
            padding:"36px 32px",
            maxWidth:"400px",
            width:"100%",
            textAlign:"center",
            boxShadow:"0 0 60px rgba(216,27,125,0.25)"
          }}>
            {/* Logo */}
            <div style={{
              width:"64px",height:"64px",background:"#D81B7D",
              borderRadius:"16px",display:"flex",alignItems:"center",
              justifyContent:"center",margin:"0 auto 16px",
              boxShadow:"0 4px 20px rgba(216,27,125,0.5)"
            }}>
              <span style={{fontSize:"28px"}}>⚽</span>
            </div>

            <div style={{fontFamily:"'Montserrat',sans-serif",fontWeight:"900",fontSize:"22px",marginBottom:"4px"}}>
              <span style={{color:"#D81B7D"}}>Byte</span>
              <span style={{color:"#F2F4F7"}}>Bots</span>
              <span style={{color:"rgba(242,244,247,0.5)",fontSize:"16px",fontWeight:"700"}}> Figuritas</span>
            </div>

            <div style={{fontSize:"11px",color:"rgba(242,244,247,0.35)",fontFamily:"var(--mono)",letterSpacing:"1px",marginBottom:"24px"}}>
              MUNDIAL 2026 · 48 SELECCIONES
            </div>

            <div style={{fontSize:"14px",color:"rgba(242,244,247,0.7)",lineHeight:"1.7",marginBottom:"28px",fontFamily:"var(--font)"}}>
              Lleva el control de tu álbum Panini fácil y gratis 🏆
            </div>

            {/* Instructions */}
            <div style={{display:"flex",flexDirection:"column",gap:"10px",marginBottom:"28px",textAlign:"left"}}>
              {[
                {icon:"👆", text:"Toca una figurita para marcarla"},
                {icon:"👆👆", text:"Toca de nuevo para marcarla como repetida"},
                {icon:"✋", text:"Mantén presionado para quitar una"},
                {icon:"🔄", text:"Comparte tus repetidas por WhatsApp"},
              ].map((item, i) => (
                <div key={i} style={{
                  display:"flex",alignItems:"center",gap:"12px",
                  background:"rgba(255,255,255,0.04)",
                  borderRadius:"10px",padding:"10px 14px",
                  border:"1px solid rgba(255,255,255,0.06)"
                }}>
                  <span style={{fontSize:"18px",flexShrink:0}}>{item.icon}</span>
                  <span style={{fontSize:"13px",color:"rgba(242,244,247,0.7)"}}>{item.text}</span>
                </div>
              ))}
            </div>

            <button
              onClick={closeWelcome}
              style={{
                width:"100%",background:"#D81B7D",color:"#fff",
                border:"none",borderRadius:"14px",
                fontFamily:"'Montserrat',sans-serif",fontWeight:"900",
                fontSize:"16px",padding:"16px",cursor:"pointer",
                boxShadow:"0 4px 20px rgba(216,27,125,0.4)",
                letterSpacing:"0.5px"
              }}
            >
              ¡Empezar a coleccionar! ⚽
            </button>

            <div style={{fontSize:"11px",color:"rgba(242,244,247,0.25)",marginTop:"14px",fontFamily:"var(--mono)"}}>
              bytebots.com.co · Cartagena, Colombia 🇨🇴
            </div>
          </div>
        </div>
      )}
      {showConfetti && <Confetti />}
      {newAchievement && <AchievementPopup achievement={newAchievement} onClose={() => setNewAchievement(null)} />}
    </>
  );
}
