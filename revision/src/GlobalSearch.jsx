import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Search, X, Zap, ArrowRight, BookOpen } from "lucide-react";

// ── Build search index at module load ─────────────────────────
const neetcodeModules = import.meta.glob("./data/neetcode/*.json", { eager: true });
const NEETCODE_DATA = Object.values(neetcodeModules).map((m) => m.default);

const companyModules = import.meta.glob("./data/company/*.json", { eager: true });
const COMPANIES_RAW = Object.entries(companyModules).map(([path, mod]) => ({
  name: path.split("/").pop().replace(".json", ""),
  problems: mod.default,
}));

// Unified index: one entry per unique slug
const INDEX = (() => {
  const map = new Map();

  // Neetcode problems (richer data)
  NEETCODE_DATA.forEach((topic) => {
    topic.problems.forEach((p) => {
      map.set(p.id, {
        slug: p.id,
        title: p.title,
        difficulty: p.difficulty,
        number: p.leetcodeNum,
        pattern: p.pattern || "",
        neetcodeTopic: topic.id,
        neetcodeTopicTitle: topic.title,
        neetcodeIcon: topic.icon,
        hasNotes: true,
        companies: [],
        // Pre-computed lowercase for fast search
        _search: `${p.title} ${p.pattern || ""} ${p.id}`.toLowerCase(),
      });
    });
  });

  // Company problems
  COMPANIES_RAW.forEach(({ name, problems }) => {
    problems.forEach((p) => {
      if (map.has(p.slug)) {
        map.get(p.slug).companies.push(name);
      } else {
        map.set(p.slug, {
          slug: p.slug,
          title: p.title,
          difficulty: p.difficulty,
          number: p.number,
          pattern: "",
          neetcodeTopic: null,
          neetcodeTopicTitle: null,
          neetcodeIcon: null,
          hasNotes: false,
          companies: [name],
          _search: `${p.title} ${p.slug}`.toLowerCase(),
        });
      }
    });
  });

  return Array.from(map.values());
})();

function CompanyLogo({ name, size = 13 }) {
  const slug = name.toLowerCase().replace(/\s+/g, "-");
  return (
    <img src={`/company/${slug}.svg`} alt={name} width={size} height={size}
      style={{ borderRadius: 3, objectFit: "contain", flexShrink: 0 }}
      onError={(e) => { e.target.style.display = "none"; }} />
  );
}

const diffColor = (d) => `var(--${d?.toLowerCase()})`;

// ══════════════════════════════════════════════════════════════
function GlobalSearch({ isOpen, onClose, onNavigate }) {
  const [query, setQuery] = useState("");
  const [selectedIdx, setSelectedIdx] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  // Reset on open
  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 50);
    return () => clearTimeout(timer);
  }, []);

  // Search
  const results = useMemo(() => {
    if (!query.trim()) return INDEX.slice(0, 20); // Show top 20 when empty
    const q = query.toLowerCase().trim();
    const terms = q.split(/\s+/);

    const scored = INDEX.map((item) => {
      let score = 0;
      const s = item._search;
      // All terms must match
      if (!terms.every((t) => s.includes(t))) return null;

      // Scoring
      if (s.startsWith(q)) score += 100; // Exact prefix
      if (item.title.toLowerCase().includes(q)) score += 50;
      if (item.pattern.toLowerCase().includes(q)) score += 20;
      score += item.companies.length * 3; // More companies = more relevant
      if (item.hasNotes) score += 10;

      return { ...item, score };
    }).filter(Boolean);

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, 30);
  }, [query]);

  // Scroll selected into view
  useEffect(() => {
    if (!listRef.current) return;
    const el = listRef.current.children[selectedIdx];
    if (el) el.scrollIntoView({ block: "nearest" });
  }, [selectedIdx]);

  const handleSelect = useCallback((item) => {
    if (!item) return;
    onNavigate(item);
    onClose();
  }, [onNavigate, onClose]);

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIdx((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      handleSelect(results[selectedIdx]);
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="gs-overlay" onClick={onClose}>
      <div className="gs-modal" onClick={(e) => e.stopPropagation()}>
        {/* Search input */}
        <div className="gs-input-row">
          <Search size={16} style={{ color: "var(--text-faint)", flexShrink: 0 }} />
          <input
            ref={inputRef}
            className="gs-input"
            placeholder="Search all problems…"
            value={query}
            onChange={(e) => { 
              setQuery(e.target.value); 
              setSelectedIdx(0);
            }}
            onKeyDown={handleKeyDown}
          />
          <kbd className="gs-kbd">ESC</kbd>
          <button className="gs-close" onClick={onClose}><X size={16} /></button>
        </div>

        {/* Results */}
        <div className="gs-results" ref={listRef}>
          {results.length === 0 && (
            <div className="gs-empty">No matching problems found</div>
          )}
          {results.map((item, idx) => (
            <button
              key={item.slug}
              className={`gs-result ${idx === selectedIdx ? "selected" : ""}`}
              onClick={() => handleSelect(item)}
              onMouseEnter={() => setSelectedIdx(idx)}
            >
              <div className="gs-result-left">
                <span className="gs-result-title">{item.title}</span>
                <div className="gs-result-meta">
                  <span className="badge" style={{
                    background: `color-mix(in srgb, ${diffColor(item.difficulty)} 10%, transparent)`,
                    color: diffColor(item.difficulty), fontSize: 9, padding: "1px 5px"
                  }}>{item.difficulty}</span>
                  {item.neetcodeTopicTitle && (
                    <span className="gs-tag neetcode">
                      <Zap size={9} /> {item.neetcodeTopicTitle}
                    </span>
                  )}
                  {item.pattern && (
                    <span className="gs-tag">{item.pattern}</span>
                  )}
                  {item.companies.length > 0 && (
                    <span className="gs-companies">
                      {item.companies.slice(0, 4).map((n) => (
                        <CompanyLogo key={n} name={n} size={11} />
                      ))}
                      {item.companies.length > 4 && (
                        <span className="gs-more">+{item.companies.length - 4}</span>
                      )}
                    </span>
                  )}
                  {item.hasNotes && (
                    <BookOpen size={10} style={{ color: "var(--accent-soft)", flexShrink: 0 }} />
                  )}
                </div>
              </div>
              <ArrowRight size={12} style={{ color: "var(--text-ghost)", flexShrink: 0 }} />
            </button>
          ))}
        </div>

        {/* Footer hint */}
        <div className="gs-footer">
          <span><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
          <span><kbd>↵</kbd> open</span>
          <span><kbd>esc</kbd> close</span>
        </div>
      </div>
    </div>
  );
}

export default GlobalSearch;