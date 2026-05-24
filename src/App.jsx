import { useState, useMemo, useEffect, useRef, useCallback } from "react";

const SECTIONS = [
  { id: "FWC_ESP", label: "FWC – Especiales", emoji: "🏆", count: 20, color: "#FFD700" },
  { id: "FWC_BAL", label: "FWC – Balón y Países", emoji: "⚽", count: 18, color: "#00E5FF" },
  { id: "FWC_HIS", label: "FWC – Historia", emoji: "📜", count: 15, color: "#A78BFA" },
  { id: "FWC_EST", label: "FWC – Estadios", emoji: "🏟️", count: 16, color: "#F97316" },
  { id: "MEX", label: "México", emoji: "🇲🇽", count: 18, color: "#00B94A" },
  { id: "USA", label: "Estados Unidos", emoji: "🇺🇸", count: 18, color: "#3B82F6" },
  { id: "CAN", label: "Canadá", emoji: "🇨🇦", count: 18, color: "#EF4444" },
  { id: "ARG", label: "Argentina", emoji: "🇦🇷", count: 18, color: "#74C0FC" },
  { id: "BRA", label: "Brasil", emoji: "🇧🇷", count: 18, color: "#F9E04B" },
  { id: "COL", label: "Colombia", emoji: "🇨🇴", count: 18, color: "#FFD700" },
  { id: "URU", label: "Uruguay", emoji: "🇺🇾", count: 18, color: "#75AADB" },
  { id: "ECU", label: "Ecuador", emoji: "🇪🇨", count: 18, color: "#FFD100" },
  { id: "PAR", label: "Paraguay", emoji: "🇵🇾", count: 18, color: "#D52B1E" },
  { id: "BOL", label: "Bolivia", emoji: "🇧🇴", count: 18, color: "#D52B1E" },
  { id: "VEN", label: "Venezuela", emoji: "🇻🇪", count: 18, color: "#CF0A2C" },
  { id: "CHI", label: "Chile", emoji: "🇨🇱", count: 18, color: "#D52B1E" },
  { id: "ESP", label: "España", emoji: "🇪🇸", count: 18, color: "#C0392B" },
  { id: "FRA", label: "Francia", emoji: "🇫🇷", count: 18, color: "#1A5276" },
  { id: "ALE", label: "Alemania", emoji: "🇩🇪", count: 18, color: "#AAAAAA" },
  { id: "POR", label: "Portugal", emoji: "🇵🇹", count: 18, color: "#006600" },
  { id: "ING", label: "Inglaterra", emoji: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", count: 18, color: "#CF142B" },
  { id: "NED", label: "Países Bajos", emoji: "🇳🇱", count: 18, color: "#FF6600" },
  { id: "BEL", label: "Bélgica", emoji: "🇧🇪", count: 18, color: "#E30614" },
  { id: "CRO", label: "Croacia", emoji: "🇭🇷", count: 18, color: "#FF0000" },
  { id: "DAN", label: "Dinamarca", emoji: "🇩🇰", count: 18, color: "#C60C30" },
  { id: "AUT", label: "Austria", emoji: "🇦🇹", count: 18, color: "#ED2939" },
  { id: "SCO", label: "Escocia", emoji: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", count: 18, color: "#003087" },
  { id: "SUI", label: "Suiza", emoji: "🇨🇭", count: 18, color: "#FF0000" },
  { id: "HUN", label: "Hungría", emoji: "🇭🇺", count: 18, color: "#CE2939" },
  { id: "TUR", label: "Turquía", emoji: "🇹🇷", count: 18, color: "#E30A17" },
  { id: "SRB", label: "Serbia", emoji: "🇷🇸", count: 18, color: "#C6363C" },
  { id: "ROU", label: "Rumania", emoji: "🇷🇴", count: 18, color: "#002B7F" },
  { id: "SVK", label: "Eslovaquia", emoji: "🇸🇰", count: 18, color: "#0B4EA2" },
  { id: "CZE", label: "Chequia", emoji: "🇨🇿", count: 18, color: "#D7141A" },
  { id: "GEO", label: "Georgia", emoji: "🇬🇪", count: 18, color: "#DA291C" },
  { id: "ALB", label: "Albania", emoji: "🇦🇱", count: 18, color: "#E41E20" },
  { id: "MAR", label: "Marruecos", emoji: "🇲🇦", count: 18, color: "#C1272D" },
  { id: "SEN", label: "Senegal", emoji: "🇸🇳", count: 18, color: "#00853F" },
  { id: "RSA", label: "Sudáfrica", emoji: "🇿🇦", count: 18, color: "#007A4D" },
  { id: "EGY", label: "Egipto", emoji: "🇪🇬", count: 18, color: "#CE1126" },
  { id: "NGA", label: "Nigeria", emoji: "🇳🇬", count: 18, color: "#008751" },
  { id: "CMR", label: "Camerún", emoji: "🇨🇲", count: 18, color: "#007A5E" },
  { id: "JPN", label: "Japón", emoji: "🇯🇵", count: 18, color: "#BC002D" },
  { id: "KOR", label: "Rep. de Corea", emoji: "🇰🇷", count: 18, color: "#CD2E3A" },
  { id: "SAU", label: "Arabia Saudita", emoji: "🇸🇦", count: 18, color: "#006C35" },
  { id: "IRN", label: "Irán", emoji: "🇮🇷", count: 18, color: "#239F40" },
  { id: "AUS", label: "Australia", emoji: "🇦🇺", count: 18, color: "#00008B" },
  { id: "UZB", label: "Uzbekistán", emoji: "🇺🇿", count: 18, color: "#1EB53A" },
  { id: "PAN", label: "Panama", emoji: "PA", count: 18, color: "#DA121A" },
  { id: "JAM", label: "Jamaica", emoji: "JM", count: 18, color: "#FED100" },
{ id: "HON", label: "Honduras", emoji: "HN", count: 18, color: "#0073CF" },
{ id: "CRC", label: "Costa Rica", emoji: "CR", count: 18, color: "#002B7F" },
{ id: "NZL", label: "Nueva Zelanda", emoji: "NZ", count: 18, color: "#00247D" },
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
      const fresh = buildInitialState();
      return { ...fresh, ...parsed };
    }
  } catch {}
  return buildInitialState();
}

function saveState(state) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
}

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
  const cancel = useCallback(() => { clearTimeout(timerRef.current); }, []);
  const end = useCallback(() => {
    clearTimeout(timerRef.current);
    if (!firedRef.current) onClick();
  }, [onClick]);
  return { onMouseDown: start, onMouseUp: end, onMouseLeave: cancel, onTouchStart: start, onTouchEnd: end };
}

function StickerCard({ id, value, onAdd, onRemove }) {
  const num = id.split("-").pop();
  const state = value === 0 ? "missing" : value === 1 ? "owned" : "duplicate";
  const handlers = useLongPress(() => onRemove(id), () => onAdd(id), 500);
  return (
    <button {...handlers} className={`sticker-card state-${state}`} style={{ userSelect: "none", WebkitUserSelect: "none" }}>
      <span className="sticker-num">{num}</span>
      {value >= 2 && <span className="dup-badge">×{value}</span>}
      {value >= 1 && <span className="remove-hint">−</span>}
    </button>
  );
}

function ProgressBar({ pct, color }) {
  return <div className="progress-track"><div className="progress-fill" style={{ width: `${pct}%`, background: color }} /></div>;
}

function Section({ section, collection, onAdd, onRemove, filter, search }) {
  const [open, setOpen] = useState(false);
  const stickers = useMemo(() => {
    const list = [];
    for (let i = 1; i <= section.count; i++) {
      const id = `${section.id}-${i}`;
      const val = collection[id] ?? 0;
      if (filter === "missing" && val !== 0) continue;
      if (filter === "duplicate" && val < 2) continue;
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
export default function App() {
  const [collection, setCollection] = useState(loadState);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("album");
  const [toast, setToast] = useState(null);

  useEffect(() => { saveState(collection); }, [collection]);

  const showToast = (msg, type = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2200);
  };

  const handleAdd = useCallback((id) => {
    setCollection((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));
  }, []);

  const handleRemove = useCallback((id) => {
    setCollection((prev) => {
      const cur = prev[id] ?? 0;
      if (cur === 0) return prev;
      showToast(`↩ ${id} restada`, "warn");
      return { ...prev, [id]: cur - 1 };
    });
  }, []);

  const totalStickers = useMemo(() => Object.keys(collection).length, [collection]);
  const totalOwned = useMemo(() => Object.values(collection).filter(v => v >= 1).length, [collection]);
  const totalMissing = totalStickers - totalOwned;
  const totalDuplicates = useMemo(() => Object.values(collection).filter(v => v >= 2).length, [collection]);
  const pctGlobal = Math.round((totalOwned / totalStickers) * 100);
  const remainingPacks = useMemo(() => totalMissing === 0 ? 0 : Math.ceil((totalMissing * 1.4) / 5), [totalMissing]);

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

  const copyTrade = () => {
    const lines = duplicateList.map(d => `• ${d.id} (${d.section}) — +${d.count}`);
    navigator.clipboard.writeText(`🔄 MIS REPETIDAS — Mundial 2026\n${lines.join("\n")}\n\n💬 ¡Escríbeme para intercambiar!\n\n🤖 by ByteBots`).then(() => showToast("¡Lista copiada para WhatsApp!"));
  };

  const copyMissing = () => {
    const lines = missingList.map(s => `${s.emoji} ${s.section}: ${s.nums.join(", ")}`);
    navigator.clipboard.writeText(`❌ ME FALTAN — Mundial 2026\n${lines.join("\n")}\n\n🤖 by ByteBots`).then(() => showToast("¡Lista de faltantes copiada!"));
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
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        :root{--bg:#08090c;--surface:#111318;--surface2:#1a1d26;--border:rgba(255,255,255,0.07);--cyan:#00E5FF;--cyan-dim:#00B4D4;--gold:#FFD700;--red:#FF4466;--purple:#A78BFA;--text:#E8EAF0;--muted:#6B7280;--font:'Syne',sans-serif;--mono:'JetBrains Mono',monospace}
        body{background:var(--bg);color:var(--text);font-family:var(--font);min-height:100vh;overflow-x:hidden}
        .app-header{position:sticky;top:0;z-index:100;background:rgba(8,9,12,0.94);backdrop-filter:blur(16px);border-bottom:1px solid var(--border);padding:12px 16px}
        .header-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;flex-wrap:wrap;gap:8px}
        .brand{display:flex;align-items:center;gap:10px}
        .brand-logo{width:34px;height:34px;background:linear-gradient(135deg,var(--cyan),#0080A0);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:17px;flex-shrink:0}
        .brand-title{font-size:14px;font-weight:800;letter-spacing:-0.3px}
        .brand-sub{font-size:9px;color:var(--muted);font-family:var(--mono);letter-spacing:0.5px}
        .global-stats{display:flex;gap:5px;flex-wrap:wrap}
        .stat-pill{background:var(--surface2);border:1px solid var(--border);border-radius:20px;padding:3px 9px;font-size:10px;font-family:var(--mono);white-space:nowrap}
        .stat-pill .num{font-weight:700}
        .num-cyan{color:var(--cyan)}.num-red{color:var(--red)}.num-gold{color:var(--gold)}
        .global-progress{display:flex;align-items:center;gap:10px}
        .global-pct{font-size:11px;font-family:var(--mono);color:var(--cyan);min-width:34px}
        .progress-track{flex:1;height:3px;background:var(--surface2);border-radius:2px;overflow:hidden}
        .progress-fill{height:100%;border-radius:2px;transition:width 0.35s ease}
        .tab-bar{display:flex;gap:2px;padding:10px 14px 0;border-bottom:1px solid var(--border);background:var(--bg)}
        .tab-btn{background:none;border:none;color:var(--muted);font-family:var(--font);font-size:12px;font-weight:700;padding:7px 14px;border-bottom:2px solid transparent;cursor:pointer;transition:all 0.15s}
        .tab-btn.active{color:var(--cyan);border-bottom-color:var(--cyan)}
        .filter-bar{display:flex;gap:6px;padding:12px 14px;align-items:center;flex-wrap:wrap}
        .filter-btn{background:var(--surface);border:1px solid var(--border);border-radius:20px;color:var(--muted);font-family:var(--font);font-size:11px;font-weight:700;padding:5px 12px;cursor:pointer;transition:all 0.15s}
        .filter-btn.active{background:var(--cyan);color:#000;border-color:var(--cyan)}
        .search-box{flex:1;min-width:120px;background:var(--surface);border:1px solid var(--border);border-radius:20px;color:var(--text);font-family:var(--font);font-size:11px;padding:5px 12px;outline:none}
        .search-box:focus{border-color:var(--cyan-dim)}
        .search-box::placeholder{color:var(--muted)}
        .instructions{display:flex;gap:12px;padding:0 14px 8px;font-size:10px;color:var(--muted);font-family:var(--mono);flex-wrap:wrap;align-items:center}
        .ins-item{display:flex;align-items:center;gap:5px}
        .ins-dot{width:20px;height:20px;border-radius:5px;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700}
        .ins-dot.missing{background:var(--surface2);border:1px dashed #444;color:var(--muted)}
        .ins-dot.owned{background:rgba(0,229,255,0.15);border:1px solid rgba(0,229,255,0.4);color:var(--cyan)}
        .ins-dot.duplicate{background:rgba(255,212,0,0.15);border:1px solid rgba(255,212,0,0.4);color:var(--gold)}
        .sections-list{padding:0 10px 80px;display:flex;flex-direction:column;gap:5px}
        .section-card{background:var(--surface);border:1px solid var(--border);border-radius:11px;overflow:hidden;transition:border-color 0.15s}
        .section-card:hover{border-color:rgba(0,229,255,0.18)}
        .section-header{width:100%;background:none;border:none;cursor:pointer;display:flex;justify-content:space-between;align-items:center;padding:11px 13px 7px;color:var(--text);font-family:var(--font)}
        .section-left{display:flex;align-items:center;gap:8px}
        .section-emoji{font-size:17px}
        .section-label{font-size:12px;font-weight:700;text-align:left}
        .section-right{display:flex;align-items:center;gap:8px;font-size:11px;font-family:var(--mono)}
        .section-count{color:var(--muted)}.section-pct{font-weight:700}
        .chevron{color:var(--muted);font-size:9px;transition:transform 0.2s;display:inline-block}
        .chevron.open{transform:rotate(180deg)}
        .sticker-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(42px,1fr));gap:5px;padding:6px 10px 10px}
        .sticker-card{aspect-ratio:1;border-radius:7px;border:1px solid var(--border);cursor:pointer;font-family:var(--mono);font-size:10px;font-weight:600;position:relative;transition:transform 0.12s,box-shadow 0.12s;display:flex;align-items:center;justify-content:center;-webkit-tap-highlight-color:transparent}
        .sticker-card.state-missing{background:var(--surface2);color:var(--muted);border-style:dashed}
        .sticker-card.state-owned{background:rgba(0,229,255,0.1);border-color:rgba(0,229,255,0.4);color:var(--cyan)}
        .sticker-card.state-duplicate{background:rgba(255,212,0,0.12);border-color:rgba(255,212,0,0.4);color:var(--gold)}
        .sticker-card:hover{transform:scale(1.06);box-shadow:0 2px 12px rgba(0,0,0,0.4)}
        .sticker-card:active{transform:scale(0.93)}
        .dup-badge{position:absolute;top:1px;right:3px;font-size:7px;color:var(--gold);font-weight:700}
        .remove-hint{position:absolute;bottom:1px;left:50%;transform:translateX(-50%);font-size:7px;color:rgba(255,255,255,0.15)}
        .stats-container{padding:14px;display:flex;flex-direction:column;gap:12px}
        .stats-hero{background:linear-gradient(135deg,var(--surface2),rgba(0,229,255,0.06));border:1px solid rgba(0,229,255,0.15);border-radius:14px;padding:18px;text-align:center}
        .stats-hero-pct{font-size:52px;font-weight:800;color:var(--cyan);line-height:1;letter-spacing:-2px}
        .stats-hero-label{font-size:10px;color:var(--muted);margin-top:4px;font-family:var(--mono);text-transform:uppercase;letter-spacing:1px}
        .stats-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
        .stat-card{background:var(--surface);border:1px solid var(--border);border-radius:11px;padding:13px}
        .stat-card-num{font-size:26px;font-weight:800;font-family:var(--mono);line-height:1}
        .stat-card-label{font-size:10px;color:var(--muted);margin-top:3px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px}
        .estimator-card{background:var(--surface);border:1px solid rgba(167,139,250,0.25);border-radius:11px;padding:14px}
        .estimator-title{font-size:10px;color:var(--muted);font-family:var(--mono);text-transform:uppercase;letter-spacing:1px;margin-bottom:6px}
        .estimator-val{font-size:20px;font-weight:800;color:var(--purple)}
        .estimator-desc{font-size:10px;color:var(--muted);margin-top:4px;line-height:1.5}
        .top-sections{background:var(--surface);border:1px solid var(--border);border-radius:11px;padding:13px}
        .top-sections-title{font-size:10px;color:var(--muted);font-family:var(--mono);text-transform:uppercase;letter-spacing:1px;margin-bottom:9px}
        .top-row{display:flex;align-items:center;gap:8px;margin-bottom:7px}
        .top-row-label{font-size:11px;font-weight:600;min-width:140px}
        .top-row-pct{font-size:10px;font-family:var(--mono);color:var(--muted);min-width:34px;text-align:right}
        .trade-container{padding:14px;display:flex;flex-direction:column;gap:12px}
        .trade-card{background:var(--surface);border:1px solid var(--border);border-radius:11px;overflow:hidden}
        .trade-card-header{display:flex;justify-content:space-between;align-items:center;padding:11px 13px;border-bottom:1px solid var(--border)}
        .trade-card-title{font-size:12px;font-weight:700}
        .copy-btn{background:var(--cyan);color:#000;border:none;border-radius:7px;font-family:var(--font);font-size:10px;font-weight:800;padding:5px 11px;cursor:pointer;transition:opacity 0.15s}
        .copy-btn:hover{opacity:0.82}
        .reset-btn{background:none;border:1px solid rgba(255,68,102,0.3);color:var(--red);border-radius:7px;font-family:var(--font);font-size:10px;font-weight:800;padding:5px 11px;cursor:pointer}
        .reset-btn:hover{background:rgba(255,68,102,0.1)}
        .trade-list{padding:8px 13px;display:flex;flex-direction:column;gap:4px;max-height:240px;overflow-y:auto}
        .trade-item{display:flex;justify-content:space-between;align-items:center;font-size:11px;padding:5px 0;border-bottom:1px solid var(--border)}
        .trade-item:last-child{border-bottom:none}
        .trade-item-id{font-family:var(--mono);color:var(--cyan);font-weight:700}
        .trade-item-sec{color:var(--muted);font-size:10px}
        .trade-item-count{color:var(--gold);font-family:var(--mono);font-weight:700}
        .empty-state{padding:24px;text-align:center;color:var(--muted);font-size:12px}
        .data-info{padding:11px 13px;font-size:11px;color:var(--muted);line-height:1.6}
        .data-info strong{color:var(--text)}
        .bytebots-footer{text-align:center;padding:16px;font-size:10px;color:var(--muted);font-family:var(--mono);border-top:1px solid var(--border);margin-top:8px}
        .bytebots-footer span{color:var(--cyan);font-weight:700}
        .toast{position:fixed;bottom:20px;left:50%;transform:translateX(-50%);font-family:var(--font);font-size:12px;font-weight:800;padding:9px 18px;border-radius:28px;z-index:999;animation:toastIn 0.2s ease;white-space:nowrap;pointer-events:none}
        .toast.ok{background:var(--cyan);color:#000}
        .toast.warn{background:var(--red);color:#fff}
        @keyframes toastIn{from{opacity:0;transform:translateX(-50%) translateY(8px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
      `}</style>

      <div className="app-header">
        <div className="header-top">
          <div className="brand">
            <div className="brand-logo">🤖</div>
            <div>
              <div className="brand-title">Figuritas WC 2026</div>
              <div className="brand-sub">BY BYTEBOTS · 48 SELECCIONES</div>
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
            <div className="progress-fill" style={{ width: `${pctGlobal}%`, background: "linear-gradient(90deg,var(--cyan-dim),var(--cyan))" }} />
          </div>
        </div>
      </div>

      <div className="tab-bar">
        {[{ id: "album", label: "📖 Álbum" }, { id: "stats", label: "📊 Stats" }, { id: "trade", label: "🔄 Intercambio" }].map(t => (
          <button key={t.id} className={`tab-btn ${tab === t.id ? "active" : ""}`} onClick={() => setTab(t.id)}>{t.label}</button>
        ))}
      </div>

      {tab === "album" && (
        <>
          <div className="filter-bar">
            {[{ id: "all", label: "Todas" }, { id: "missing", label: "Me faltan" }, { id: "duplicate", label: "Repetidas" }].map(f => (
              <button key={f.id} className={`filter-btn ${filter === f.id ? "active" : ""}`} onClick={() => setFilter(f.id)}>{f.label}</button>
            ))}
            <input className="search-box" placeholder="🔍 Buscar selección..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="instructions">
            <div className="ins-item"><div className="ins-dot missing">–</div><span>Falta</span></div>
            <div className="ins-item"><div className="ins-dot owned">✓</div><span>Tengo · <strong style={{color:"var(--text)"}}>toca = agregar</strong></span></div>
            <div className="ins-item"><div className="ins-dot duplicate">×2</div><span>Repetida · <strong style={{color:"var(--text)"}}>mantén = quitar</strong></span></div>
          </div>
          <div className="sections-list">
            {SECTIONS.map(s => <Section key={s.id} section={s} collection={collection} onAdd={handleAdd} onRemove={handleRemove} filter={filter} search={search} />)}
          </div>
        </>
      )}

      {tab === "stats" && (
        <div className="stats-container">
          <div className="stats-hero">
            <div className="stats-hero-pct">{pctGlobal}%</div>
            <div className="stats-hero-label">Álbum completado · {totalOwned} de {totalStickers} figuritas</div>
          </div>
          <div className="stats-grid">
            <div className="stat-card"><div className="stat-card-num" style={{color:"var(--cyan)"}}>{totalOwned}</div><div className="stat-card-label">Tengo</div></div>
            <div className="stat-card"><div className="stat-card-num" style={{color:"var(--red)"}}>{totalMissing}</div><div className="stat-card-label">Me faltan</div></div>
            <div className="stat-card"><div className="stat-card-num" style={{color:"var(--gold)"}}>{totalDuplicates}</div><div className="stat-card-label">Repetidas</div></div>
            <div className="stat-card"><div className="stat-card-num" style={{color:"var(--purple)"}}>{SECTIONS.length}</div><div className="stat-card-label">Secciones</div></div>
          </div>
          <div className="estimator-card">
            <div className="estimator-title">⚡ Sobres estimados para completar</div>
            <div className="estimator-val">~{remainingPacks} sobres</div>
            <div className="estimator-desc">Estimación basada en {totalMissing} figuritas faltantes a 5 por sobre, factor 1.4× por duplicados. Mejora con intercambios activos.</div>
          </div>
          <div className="top-sections">
            <div className="top-sections-title">Progreso por sección</div>
            {SECTIONS.map(s => {
              let o = 0;
              for (let i = 1; i <= s.count; i++) { if ((collection[`${s.id}-${i}`] ?? 0) >= 1) o++; }
              const p = Math.round((o / s.count) * 100);
              return (
                <div className="top-row" key={s.id}>
                  <span className="top-row-label">{s.emoji} {s.label}</span>
                  <div className="progress-track" style={{flex:1}}><div className="progress-fill" style={{width:`${p}%`,background:s.color}} /></div>
                  <span className="top-row-pct">{p}%</span>
                </div>
              );
            })}
          </div>
          <div className="bytebots-footer">Desarrollado por <span>ByteBots</span> · bytebots.com.co · Academia de IA y Robótica 🤖</div>
        </div>
      )}

      {tab === "trade" && (
        <div className="trade-container">
          <div className="trade-card">
            <div className="trade-card-header"><span className="trade-card-title">🔄 Mis Repetidas ({duplicateList.length})</span><button className="copy-btn" onClick={copyTrade}>📋 Copiar para WhatsApp</button></div>
            {duplicateList.length === 0 ? <div className="empty-state">Sin repetidas todavía</div> : (
              <div className="trade-list">{duplicateList.map(d => (
                <div className="trade-item" key={d.id}>
                  <div><span className="trade-item-id">{d.id}</span><span className="trade-item-sec"> · {d.section}</span></div>
                  <span className="trade-item-count">+{d.count}</span>
                </div>
              ))}</div>
            )}
          </div>
          <div className="trade-card">
            <div className="trade-card-header"><span className="trade-card-title">❌ Me faltan ({totalMissing})</span><button className="copy-btn" onClick={copyMissing}>📋 Copiar para WhatsApp</button></div>
            {missingList.length === 0 ? <div className="empty-state">🏆 ¡Álbum completo!</div> : (
              <div className="trade-list">{missingList.map(s => (
                <div className="trade-item" key={s.section}>
                  <span>{s.emoji} {s.section}</span>
                  <span className="trade-item-sec">{s.nums.slice(0,10).join(", ")}{s.nums.length > 10 ? ` +${s.nums.length-10} más` : ""}</span>
                </div>
              ))}</div>
            )}
          </div>
          <div className="trade-card">
            <div className="trade-card-header"><span className="trade-card-title">⚙️ Datos y privacidad</span><button className="reset-btn" onClick={resetAll}>🗑 Resetear todo</button></div>
            <div className="data-info"><strong>Sin cuenta. Sin servidor.</strong> Datos guardados localmente en tu navegador. Nadie más puede verlos.</div>
          </div>
          <div className="bytebots-footer">Desarrollado por <span>ByteBots</span> · bytebots.com.co · Academia de IA y Robótica 🤖</div>
        </div>
      )}

      {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}
    </>
  );
}
