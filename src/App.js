import { useState, useEffect, useRef, useCallback } from "react";

// ─── Inline dataset (mirrors backend/data.json) ───────────────────────────────
const DATASET = [
  {
    id: 1,
    name: "Anointed Agunloye — GitHub Profile",
    url: "https://github.com/anointedthedeveloper",
    description: "Official GitHub profile of Anointed Agunloye (anointedthedeveloper). Browse open-source projects, repositories, and code contributions.",
    category: "social", icon: "Github",
    tags: ["anointed","agunloye","anointedthedeveloper","github","developer","code","open source"],
    priority: 10
  },
  {
    id: 2,
    name: "Anobyte Online — Personal Website",
    url: "https://anobyte.online",
    description: "The official personal website of Anointed Agunloye. Showcasing projects, blog posts, and the developer's full portfolio.",
    category: "website", icon: "Globe",
    tags: ["anointed","agunloye","anobyte","anobyte.online","portfolio","website","developer"],
    priority: 10
  },
  {
    id: 3,
    name: "Who is Anointed Agunloye?",
    url: "https://anobyte.online",
    description: "Anointed Agunloye is a web developer known online as anointedthedeveloper. He builds web applications, contributes to open source, and shares knowledge through anobyte.online.",
    category: "about", icon: "User",
    tags: ["who is anointed","who is agunloye","anointed agunloye","about","developer","anointedthedeveloper"],
    priority: 9
  },
  {
    id: 4,
    name: "anointedthedeveloper — Developer Brand",
    url: "https://github.com/anointedthedeveloper",
    description: "anointedthedeveloper is the online handle and developer brand of Anointed Agunloye. Find all projects and profiles under this name across the web.",
    category: "brand", icon: "Code",
    tags: ["anointedthedeveloper","anointed the developer","developer","brand","handle"],
    priority: 9
  },
  {
    id: 5,
    name: "Anointed Agunloye — Portfolio & Projects",
    url: "https://anobyte.online",
    description: "Explore the full portfolio of Anointed Agunloye. Web development projects, tools, and experiments built by anointedthedeveloper.",
    category: "portfolio", icon: "Briefcase",
    tags: ["anointed","agunloye","portfolio","projects","anobyte","web developer"],
    priority: 8
  },
  {
    id: 6,
    name: "Anointed Agunloye — GitHub Repositories",
    url: "https://github.com/anointedthedeveloper?tab=repositories",
    description: "All public repositories by Anointed Agunloye on GitHub. Source code, web apps, tools and more from anointedthedeveloper.",
    category: "code", icon: "Github",
    tags: ["anointed","agunloye","github","repositories","code","anointedthedeveloper"],
    priority: 8
  },
  {
    id: 7,
    name: "Anobyte — Developer Platform by Anointed",
    url: "https://anobyte.online",
    description: "Anobyte is the personal developer platform and brand of Anointed Agunloye. Visit anobyte.online to learn more about his work and projects.",
    category: "brand", icon: "Zap",
    tags: ["anobyte","anobyte.online","anointed","agunloye","platform","brand"],
    priority: 8
  },
  {
    id: 8,
    name: "Anointed the Developer — Contact & Hire",
    url: "https://anobyte.online",
    description: "Looking to hire or contact Anointed Agunloye? Visit his official site at anobyte.online or reach out via GitHub at anointedthedeveloper.",
    category: "contact", icon: "Mail",
    tags: ["anointed","agunloye","hire","contact","freelance","developer","anobyte"],
    priority: 7
  },
  {
    id: 9,
    name: "Anointed Agunloye — GitHub Activity",
    url: "https://github.com/anointedthedeveloper?tab=stars",
    description: "See what Anointed Agunloye has starred and interacted with on GitHub. Explore the developer interests of anointedthedeveloper.",
    category: "social", icon: "Star",
    tags: ["anointed","agunloye","github","activity","stars","anointedthedeveloper"],
    priority: 6
  },
  {
    id: 10,
    name: "Find Anointed Agunloye Online",
    url: "https://anobyte.online",
    description: "Looking for Anointed Agunloye online? He goes by anointedthedeveloper across platforms. GitHub: github.com/anointedthedeveloper | Website: anobyte.online",
    category: "about", icon: "Search",
    tags: ["find anointed","anointed agunloye online","anointedthedeveloper","social profiles","links"],
    priority: 7
  }
];

const SUGGESTIONS = [
  "Anointed Agunloye","anointedthedeveloper","Anointed the developer",
  "Who is Anointed Agunloye","Agunloye Anointed","Anobyte","anobyte.online",
  "Anointed developer","Anointed GitHub","Anointed portfolio","Find Anointed"
];

// ─── Search logic (client-side) ──────────────────────────────────────────────
function scoreItem(item, query) {
  const q = query.toLowerCase();
  const blob = `${item.name} ${item.description} ${item.tags.join(" ")}`.toLowerCase();
  let s = 0;
  if (blob.includes(q)) s += 10;
  item.tags.forEach(t => { if (q.includes(t) || t.includes(q)) s += 5; });
  if (item.name.toLowerCase().includes(q)) s += 8;
  s += item.priority;
  return s;
}

function search(query) {
  if (!query.trim()) return [];
  return DATASET
    .map(item => ({ ...item, _score: scoreItem(item, query) }))
    .filter(i => i._score > 0)
    .sort((a, b) => b._score - a._score);
}

// ─── Highlight helper ─────────────────────────────────────────────────────────
function Highlight({ text, query }) {
  if (!query.trim()) return <span>{text}</span>;
  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"));
  return (
    <span>
      {parts.map((p, i) =>
        p.toLowerCase() === query.toLowerCase()
          ? <mark key={i} style={{ background: "var(--accent-glow)", color: "var(--accent)", borderRadius: "2px", padding: "0 2px" }}>{p}</mark>
          : p
      )}
    </span>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icons = {
  Github: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
    </svg>
  ),
  Globe: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
      <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
      <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
    </svg>
  ),
  User: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  Code: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
      <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
    </svg>
  ),
  Briefcase: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
      <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>
    </svg>
  ),
  Mail: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  ),
  Star: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),
  Zap: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  ),
  Search: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  Sun: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  ),
  Moon: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
    </svg>
  ),
  External: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
      <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
    </svg>
  ),
  Close: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
};

const CategoryBadge = ({ cat }) => {
  const map = {
    social: { label: "Social", color: "#3b82f6" },
    website: { label: "Website", color: "#10b981" },
    about: { label: "About", color: "#8b5cf6" },
    brand: { label: "Brand", color: "#f59e0b" },
    portfolio: { label: "Portfolio", color: "#ec4899" },
    code: { label: "Code", color: "#06b6d4" },
    contact: { label: "Contact", color: "#f97316" },
  };
  const c = map[cat] || { label: cat, color: "#6b7280" };
  return (
    <span style={{
      fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.06em",
      padding: "2px 8px", borderRadius: "20px", textTransform: "uppercase",
      background: c.color + "22", color: c.color, border: `1px solid ${c.color}44`
    }}>{c.label}</span>
  );
};

// ─── Analytics tracker ────────────────────────────────────────────────────────
const analyticsStore = {};
function trackSearch(q) {
  if (!q) return;
  const k = q.toLowerCase();
  analyticsStore[k] = (analyticsStore[k] || 0) + 1;
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [dark, setDark] = useState(true);
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState("");
  const [results, setResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const inputRef = useRef(null);
  const suggestRef = useRef(null);

  // Theme vars
  const theme = dark ? {
    "--bg": "#080c14",
    "--bg2": "#0e1521",
    "--bg3": "#151e2e",
    "--border": "#1e2d45",
    "--text": "#e2eaf6",
    "--text2": "#7a92b4",
    "--accent": "#4f9eff",
    "--accent2": "#2563eb",
    "--accent-glow": "#4f9eff22",
    "--card-bg": "#0e1521",
    "--card-hover": "#131c2e",
    "--shadow": "0 4px 24px #00000060",
    "--url-color": "#3b9eff",
    "--grid": "#ffffff06",
  } : {
    "--bg": "#f0f4fc",
    "--bg2": "#ffffff",
    "--bg3": "#e8edf8",
    "--border": "#d0daf0",
    "--text": "#0f1d3a",
    "--text2": "#526080",
    "--accent": "#1d4ed8",
    "--accent2": "#1e40af",
    "--accent-glow": "#1d4ed820",
    "--card-bg": "#ffffff",
    "--card-hover": "#f4f7ff",
    "--shadow": "0 4px 24px #00000018",
    "--url-color": "#1d4ed8",
    "--grid": "#00000006",
  };

  // Autocomplete
  useEffect(() => {
    if (query.length < 1) { setSuggestions([]); return; }
    const q = query.toLowerCase();
    const hits = SUGGESTIONS.filter(s => s.toLowerCase().includes(q) || s.toLowerCase().startsWith(q));
    setSuggestions(hits.slice(0, 6));
  }, [query]);

  // Dismiss suggestions on outside click
  useEffect(() => {
    const handler = (e) => {
      if (suggestRef.current && !suggestRef.current.contains(e.target) && !inputRef.current.contains(e.target))
        setShowSuggestions(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const doSearch = useCallback((q = query) => {
    if (!q.trim()) return;
    setLoading(true);
    setShowSuggestions(false);
    setSubmitted(q);
    trackSearch(q);
    setTimeout(() => {
      setResults(search(q));
      setLoading(false);
    }, 320);
  }, [query]);

  const handleKey = (e) => {
    if (e.key === "Enter") doSearch();
    if (e.key === "Escape") { setShowSuggestions(false); inputRef.current.blur(); }
  };

  const clearSearch = () => {
    setQuery(""); setResults([]); setSubmitted(""); setSuggestions([]);
    inputRef.current.focus();
  };

  const topAnalytics = Object.entries(analyticsStore).sort((a, b) => b[1] - a[1]).slice(0, 8);

  return (
    <div style={{ ...theme, minHeight: "100vh", background: "var(--bg)", color: "var(--text)", fontFamily: "'IBM Plex Mono', 'Fira Code', 'Courier New', monospace", transition: "background 0.3s, color 0.3s" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::selection { background: var(--accent); color: #fff; }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: var(--bg); }
        ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }
        .search-input::placeholder { color: var(--text2); }
        .search-input:focus { outline: none; }
        .result-card { transition: background 0.2s, transform 0.15s, box-shadow 0.2s; }
        .result-card:hover { background: var(--card-hover) !important; transform: translateY(-2px); box-shadow: var(--shadow) !important; }
        .suggest-item:hover { background: var(--accent-glow); color: var(--accent); }
        .theme-btn:hover { opacity: 0.8; }
        .search-btn:hover { opacity: 0.9; transform: scale(1.02); }
        .search-btn:active { transform: scale(0.98); }
        .chip:hover { background: var(--accent-glow); color: var(--accent); border-color: var(--accent) !important; cursor: pointer; }
        @keyframes fadeIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse { 0%,100% { opacity:0.4; } 50% { opacity:1; } }
        .fade-in { animation: fadeIn 0.35s ease forwards; }
        .dot { animation: pulse 1.2s infinite; }
        .dot:nth-child(2) { animation-delay: 0.2s; }
        .dot:nth-child(3) { animation-delay: 0.4s; }
        .grid-bg {
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background-image: linear-gradient(var(--grid) 1px, transparent 1px), linear-gradient(90deg, var(--grid) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        .glow-ring {
          position: absolute; inset: -2px; border-radius: 14px; z-index: -1;
          background: linear-gradient(135deg, var(--accent), transparent 60%);
          opacity: 0; transition: opacity 0.3s;
          pointer-events: none;
        }
        .search-wrap:focus-within .glow-ring { opacity: 0.5; }
      `}</style>

      <div className="grid-bg" />

      {/* Header */}
      <header style={{ position: "relative", zIndex: 10, padding: "1.5rem 2rem", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid var(--border)` }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--accent)", boxShadow: "0 0 10px var(--accent)" }} />
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "1.1rem", letterSpacing: "-0.02em", color: "var(--text)" }}>
              anointedthedeveloper
            </span>
            <span style={{ color: "var(--text2)", fontSize: "0.75rem" }}>/ search</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          {topAnalytics.length > 0 && (
            <button onClick={() => setShowAnalytics(!showAnalytics)} style={{ background: "none", border: `1px solid var(--border)`, color: "var(--text2)", padding: "6px 12px", borderRadius: "8px", cursor: "pointer", fontSize: "0.75rem", fontFamily: "inherit" }}>
              {showAnalytics ? "Hide" : "Analytics"}
            </button>
          )}
          <button className="theme-btn" onClick={() => setDark(!dark)} style={{ background: "none", border: `1px solid var(--border)`, borderRadius: "8px", padding: "7px", cursor: "pointer", color: "var(--text2)", display: "flex" }}>
            {dark ? <Icons.Sun /> : <Icons.Moon />}
          </button>
        </div>
      </header>

      <main style={{ position: "relative", zIndex: 1, maxWidth: 760, margin: "0 auto", padding: "3rem 1.5rem 6rem" }}>
        {/* Hero */}
        {!submitted && (
          <div className="fade-in" style={{ textAlign: "center", marginBottom: "3rem" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--accent-glow)", border: "1px solid var(--accent)44", borderRadius: 20, padding: "4px 14px", marginBottom: "1.5rem", fontSize: "0.75rem", color: "var(--accent)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)", boxShadow: "0 0 8px var(--accent)" }} />
              Personal Search Portal
            </div>
            <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "clamp(2rem,6vw,3.2rem)", letterSpacing: "-0.04em", lineHeight: 1.1, marginBottom: "1rem" }}>
              Find <span style={{ color: "var(--accent)" }}>Anointed</span><br />
              <span style={{ color: "var(--text2)", fontWeight: 400, fontSize: "0.75em" }}>Agunloye · anointedthedeveloper</span>
            </h1>
            <p style={{ color: "var(--text2)", fontSize: "0.95rem", maxWidth: 480, margin: "0 auto 2rem", lineHeight: 1.7 }}>
              Search for Anointed Agunloye's profiles, projects, and online presence across the web.
            </p>
          </div>
        )}

        {/* Search bar */}
        <div className="search-wrap" style={{ position: "relative", marginBottom: "1.5rem" }}>
          <div className="glow-ring" />
          <div style={{ display: "flex", gap: "10px", background: "var(--bg2)", border: `1.5px solid var(--border)`, borderRadius: 13, padding: "10px 14px", alignItems: "center", boxShadow: "var(--shadow)" }}>
            <span style={{ color: "var(--text2)", flexShrink: 0, display: "flex" }}><Icons.Search /></span>
            <input
              ref={inputRef}
              className="search-input"
              value={query}
              onChange={e => { setQuery(e.target.value); setShowSuggestions(true); }}
              onFocus={() => setShowSuggestions(true)}
              onKeyDown={handleKey}
              placeholder='Try "Anointed Agunloye" or "anobyte"…'
              style={{ flex: 1, background: "none", border: "none", fontSize: "1rem", color: "var(--text)", fontFamily: "inherit", minWidth: 0 }}
              autoComplete="off" spellCheck="false"
            />
            {query && (
              <button onClick={clearSearch} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text2)", display: "flex", padding: 2 }}><Icons.Close /></button>
            )}
            <button
              className="search-btn"
              onClick={() => doSearch()}
              style={{ background: "var(--accent)", color: "#fff", border: "none", borderRadius: 8, padding: "8px 18px", cursor: "pointer", fontFamily: "inherit", fontWeight: 600, fontSize: "0.88rem", letterSpacing: "0.03em", transition: "all 0.15s", flexShrink: 0 }}>
              Search
            </button>
          </div>

          {/* Suggestions dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div ref={suggestRef} style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, background: "var(--bg2)", border: `1px solid var(--border)`, borderRadius: 10, overflow: "hidden", boxShadow: "var(--shadow)", zIndex: 100 }}>
              {suggestions.map((s, i) => (
                <div key={i} className="suggest-item" onClick={() => { setQuery(s); doSearch(s); }}
                  style={{ padding: "10px 16px", cursor: "pointer", fontSize: "0.88rem", display: "flex", alignItems: "center", gap: 10, color: "var(--text2)", transition: "all 0.15s" }}>
                  <span style={{ color: "var(--text2)", opacity: 0.5 }}><Icons.Search /></span>
                  {s}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick chips */}
        {!submitted && (
          <div className="fade-in" style={{ display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center", marginBottom: "2.5rem" }}>
            {["Anointed Agunloye","anointedthedeveloper","Anobyte","Who is Anointed","GitHub","Portfolio"].map(chip => (
              <span key={chip} className="chip" onClick={() => { setQuery(chip); doSearch(chip); }}
                style={{ fontSize: "0.78rem", padding: "5px 13px", borderRadius: 20, border: `1px solid var(--border)`, color: "var(--text2)", transition: "all 0.15s", userSelect: "none" }}>
                {chip}
              </span>
            ))}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ display: "flex", justifyContent: "center", padding: "3rem", gap: 8 }}>
            {[0,1,2].map(i => (
              <div key={i} className="dot" style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--accent)" }} />
            ))}
          </div>
        )}

        {/* Results */}
        {!loading && submitted && (
          <div className="fade-in">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.2rem" }}>
              <p style={{ fontSize: "0.82rem", color: "var(--text2)" }}>
                <span style={{ color: "var(--accent)", fontWeight: 600 }}>{results.length}</span> result{results.length !== 1 ? "s" : ""} for{" "}
                <span style={{ color: "var(--text)", fontWeight: 500 }}>"{submitted}"</span>
              </p>
            </div>

            {results.length === 0 ? (
              <div style={{ textAlign: "center", padding: "4rem 2rem", color: "var(--text2)" }}>
                <p style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>No results found.</p>
                <p style={{ fontSize: "0.85rem" }}>Try: "Anointed", "Agunloye", "anobyte", or "anointedthedeveloper"</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {results.map((item, idx) => {
                  const IconComp = Icons[item.icon] || Icons.Globe;
                  return (
                    <a key={item.id} href={item.url} target="_blank" rel="noopener noreferrer"
                      className="result-card fade-in"
                      style={{ display: "block", background: "var(--card-bg)", border: `1px solid var(--border)`, borderRadius: 12, padding: "1.1rem 1.3rem", textDecoration: "none", color: "inherit", animationDelay: `${idx * 0.05}s`, boxShadow: "0 2px 12px #00000018" }}>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                        <div style={{ flexShrink: 0, width: 36, height: 36, borderRadius: 8, background: "var(--accent-glow)", border: `1px solid var(--accent)33`, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent)", marginTop: 2 }}>
                          <IconComp />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: "4px" }}>
                            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: "0.97rem", color: "var(--text)" }}>
                              <Highlight text={item.name} query={submitted} />
                            </span>
                            <CategoryBadge cat={item.category} />
                          </div>
                          <div style={{ fontSize: "0.76rem", color: "var(--url-color)", marginBottom: "6px", display: "flex", alignItems: "center", gap: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            <Icons.External />
                            {item.url}
                          </div>
                          <p style={{ fontSize: "0.85rem", color: "var(--text2)", lineHeight: 1.6 }}>
                            <Highlight text={item.description} query={submitted} />
                          </p>
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Analytics panel */}
        {showAnalytics && topAnalytics.length > 0 && (
          <div className="fade-in" style={{ marginTop: "2.5rem", background: "var(--bg2)", border: `1px solid var(--border)`, borderRadius: 12, padding: "1.2rem 1.5rem" }}>
            <p style={{ fontWeight: 600, marginBottom: "1rem", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text2)" }}>Session Analytics</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {topAnalytics.map(([q, c]) => (
                <div key={q} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: "0.8rem", flex: 1, color: "var(--text)" }}>{q}</span>
                  <div style={{ height: 6, borderRadius: 3, background: "var(--accent)", width: `${Math.min(100, (c / topAnalytics[0][1]) * 100)}px`, minWidth: 4 }} />
                  <span style={{ fontSize: "0.75rem", color: "var(--text2)", width: 20, textAlign: "right" }}>{c}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* About card */}
        {!submitted && (
          <div className="fade-in" style={{ marginTop: "3rem", background: "var(--bg2)", border: `1px solid var(--border)`, borderRadius: 14, padding: "1.5rem 1.8rem", animationDelay: "0.2s" }}>
            <div style={{ display: "flex", gap: 16, alignItems: "flex-start", flexWrap: "wrap" }}>
              <div style={{ flex: "1 1 280px" }}>
                <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "1.05rem", marginBottom: "0.5rem" }}>Anointed Agunloye</p>
                <p style={{ color: "var(--text2)", fontSize: "0.85rem", lineHeight: 1.7 }}>
                  Web developer known as <strong style={{ color: "var(--accent)" }}>anointedthedeveloper</strong>. 
                  Building on the web, sharing work at <a href="https://anobyte.online" target="_blank" rel="noopener noreferrer" style={{ color: "var(--url-color)", textDecoration: "none" }}>anobyte.online</a> and 
                  &nbsp;<a href="https://github.com/anointedthedeveloper" target="_blank" rel="noopener noreferrer" style={{ color: "var(--url-color)", textDecoration: "none" }}>github.com/anointedthedeveloper</a>.
                </p>
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {[
                  { label: "GitHub", url: "https://github.com/anointedthedeveloper", icon: "Github" },
                  { label: "Website", url: "https://anobyte.online", icon: "Globe" },
                ].map(l => {
                  const I = Icons[l.icon];
                  return (
                    <a key={l.label} href={l.url} target="_blank" rel="noopener noreferrer"
                      style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "var(--accent-glow)", border: `1px solid var(--accent)44`, borderRadius: 8, padding: "8px 14px", color: "var(--accent)", textDecoration: "none", fontSize: "0.83rem", fontWeight: 500 }}>
                      <I /> {l.label}
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{ position: "relative", zIndex: 1, borderTop: `1px solid var(--border)`, padding: "1.5rem 2rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
        <span style={{ fontSize: "0.78rem", color: "var(--text2)" }}>
          Created by{" "}
          <a href="https://github.com/anointedthedeveloper" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 600 }}>
            Anointedthedeveloper
          </a>
        </span>
        <div style={{ display: "flex", gap: "1.5rem" }}>
          {[
            { label: "GitHub", url: "https://github.com/anointedthedeveloper" },
            { label: "anobyte.online", url: "https://anobyte.online" },
          ].map(l => (
            <a key={l.label} href={l.url} target="_blank" rel="noopener noreferrer"
              style={{ fontSize: "0.78rem", color: "var(--text2)", textDecoration: "none" }}
              onMouseEnter={e => e.target.style.color = "var(--accent)"}
              onMouseLeave={e => e.target.style.color = "var(--text2)"}>
              {l.label}
            </a>
          ))}
        </div>
      </footer>
    </div>
  );
}
