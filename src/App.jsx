import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";

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

  useEffect(() => { saveState(collection); }, [collection]);
  useEffect(() => { saveStars(stars); }, [stars]);
  useEffect(() => { saveBadges(badges); }, [badges]);

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
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap');

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
          background: rgba(8,9,12,0.94);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--border);
          padding: 12px 16px;
        }
        .header-top {
          display: flex; justify-content: space-between; align-items: center;
          margin-bottom: 10px; flex-wrap: wrap; gap: 8px;
        }
        .brand { display: flex; align-items: center; gap: 10px; }
        .brand-logo {
          width: 34px; height: 34px;
          background: linear-gradient(135deg, var(--cyan), #0080A0);
          border-radius: 8px; display: flex; align-items: center; justify-content: center;
          font-size: 17px; flex-shrink: 0;
        }
        .brand-title { font-size: 14px; font-weight: 800; letter-spacing: -0.3px; }
        .brand-sub { font-size: 9px; color: var(--muted); font-family: var(--mono); letter-spacing: 0.5px; }
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
        .global-pct { font-size: 11px; font-family: var(--mono); color: var(--cyan); min-width: 34px; }
        .progress-track { flex: 1; height: 3px; background: var(--surface2); border-radius: 2px; overflow: hidden; }
        .progress-fill  { height: 100%; border-radius: 2px; transition: width 0.35s ease; }

        /* ── TABS ── */
        .tab-bar {
          display: flex; gap: 2px; padding: 10px 14px 0;
          border-bottom: 1px solid var(--border); background: var(--bg);
        }
        .tab-btn {
          background: none; border: none; color: var(--muted);
          font-family: var(--font); font-size: 12px; font-weight: 700;
          padding: 7px 14px; border-bottom: 2px solid transparent;
          cursor: pointer; transition: all 0.15s; letter-spacing: 0.2px;
        }
        .tab-btn.active { color: var(--cyan); border-bottom-color: var(--cyan); }

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
        .donut-wrap{display:flex;justify-content:center;margin-bottom:12px}
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
              <div className="brand-title">Figuritas WC 2026</div>
              <div className="brand-sub">48 SELECCIONES · USA · MEX · CAN</div>
            </div>
          </div>
          <div className="global-stats">
            <div className="stat-pill"><span className="num num-cyan">{totalOwned}</span> / {totalStickers}</div>
            <div className="stat-pill"><span className="num num-red">{totalMissing}</span> faltan</div>
            <div className="stat-pill"><span className="num num-gold">{totalDuplicates}</span> rep.</div>
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
          <div className="bytebots-footer">Desarrollado por <span>ByteBots</span> · bytebots.com.co 🤖</div>
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
      {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}
      {showConfetti && <Confetti />}
      {newAchievement && <AchievementPopup achievement={newAchievement} onClose={() => setNewAchievement(null)} />}
    </>
  );
}
