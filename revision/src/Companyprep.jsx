import { useState, useMemo } from "react";
import {
  Search, ChevronDown, Check, Star, Flame, BookOpen,
  ArrowUpDown, Layers, Filter, CircleCheck, CircleDashed,
  List,
} from "lucide-react";
import { useLocalStorage } from "./Uselocalstorage";

// ── Data loading ──────────────────────────────────────────────
const companyModules = import.meta.glob("./data/company/*.json", { eager: true });
const COMPANIES_RAW = Object.entries(companyModules)
  .map(([path, mod]) => {
    const name = path.split("/").pop().replace(".json", "");
    return { name, problems: mod.default };
  })
  .sort((a, b) => b.problems.length - a.problems.length);

const COMPANY_NAMES = COMPANIES_RAW.map((c) => c.name);

// Neetcode enrichment
const neetcodeModules = import.meta.glob("./data/neetcode/*.json", { eager: true });
const NEETCODE_DATA = Object.values(neetcodeModules).map((m) => m.default);
const neetcodeBySlug = {};
NEETCODE_DATA.forEach((topic) => {
  topic.problems.forEach((p) => {
    neetcodeBySlug[p.id] = { ...p, topicTitle: topic.title, topicIcon: topic.icon };
  });
});

// ── Helpers ───────────────────────────────────────────────────
const diffColor = (d) => `var(--${d.toLowerCase()})`;

function parseFreq(f) {
  if (!f) return 0;
  const m = f.match(/(\d+)\/(\d+)/);
  return m ? parseInt(m[1]) / parseInt(m[2]) : 0;
}

function CompanyLogo({ name, size = 18 }) {
  const slug = name.toLowerCase().replace(/\s+/g, "-");
  return (
    <img
      src={`/company/${slug}.svg`}
      alt={name}
      width={size}
      height={size}
      style={{ borderRadius: 4, objectFit: "contain", flexShrink: 0 }}
      onError={(e) => { e.target.style.display = "none"; }}
    />
  );
}

// slug → which companies ask it
const slugToCompanyNames = {};
COMPANIES_RAW.forEach(({ name, problems }) => {
  problems.forEach((p) => {
    if (!slugToCompanyNames[p.slug]) slugToCompanyNames[p.slug] = [];
    slugToCompanyNames[p.slug].push(name);
  });
});

// ══════════════════════════════════════════════════════════════
// Component
// ══════════════════════════════════════════════════════════════
function CompanyPrep({ completed, sidebarOpen, setSidebarOpen }) {
  // Persisted
  const [view, setView] = useLocalStorage("companyView", "list"); // list | overlap
  const [selectedCompany, setSelectedCompany] = useLocalStorage("selectedCompany", COMPANY_NAMES[0]);

  // Overlap: which companies are enabled (all by default)
  const [overlapEnabled, setOverlapEnabled] = useLocalStorage(
    "overlapEnabled",
    Object.fromEntries(COMPANY_NAMES.map((n) => [n, true]))
  );

  // Session state
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("frequency");
  const [sortDir, setSortDir] = useState("desc");
  const [expandedSlug, setExpandedSlug] = useState(null);

  // ── Overlap logic ───────────────────────────────────────────
  const enabledNames = useMemo(() => COMPANY_NAMES.filter((n) => overlapEnabled[n]), [overlapEnabled]);

  const toggleOverlap = (name) => {
    setOverlapEnabled((prev) => {
      const enabledCount = Object.values(prev).filter(Boolean).length;
      // Don't allow disabling last company
      if (prev[name] && enabledCount <= 1) return prev;
      return { ...prev, [name]: !prev[name] };
    });
  };

  const setAllOverlap = (val) => {
    if (!val) {
      // Keep only the largest
      setOverlapEnabled(Object.fromEntries(COMPANY_NAMES.map((n, i) => [n, i === 0])));
    } else {
      setOverlapEnabled(Object.fromEntries(COMPANY_NAMES.map((n) => [n, true])));
    }
  };

  // Overlap: start from smallest company, check against all others
  const overlapProblems = useMemo(() => {
    const selected = COMPANIES_RAW.filter((c) => overlapEnabled[c.name]);
    if (selected.length <= 1) {
      // Single company = just show that company's problems
      const comp = selected[0];
      return (comp?.problems || []).map((p) => ({
        ...p,
        neetcode: neetcodeBySlug[p.slug] || null,
        maxFreq: parseFreq(p.frequency),
        anySolved: p.status === "Solved",
        anyStarred: p.starred,
        companyData: { [comp?.name]: { frequency: p.frequency, starred: p.starred, status: p.status } },
      }));
    }

    const sorted = [...selected].sort((a, b) => a.problems.length - b.problems.length);
    const smallest = sorted[0];
    const otherSets = sorted.slice(1).map((c) => new Set(c.problems.map((p) => p.slug)));

    // Build per-company data for all selected
    const companyDataBySlug = {};
    selected.forEach(({ name, problems }) => {
      problems.forEach((p) => {
        if (!companyDataBySlug[p.slug]) companyDataBySlug[p.slug] = {};
        companyDataBySlug[p.slug][name] = { frequency: p.frequency, starred: p.starred, status: p.status };
      });
    });

    return smallest.problems
      .filter((p) => otherSets.every((s) => s.has(p.slug)))
      .map((p) => {
        const cd = companyDataBySlug[p.slug] || {};
        return {
          ...p,
          neetcode: neetcodeBySlug[p.slug] || null,
          companyData: cd,
          maxFreq: Math.max(...Object.values(cd).map((d) => parseFreq(d.frequency))),
          anySolved: Object.values(cd).some((d) => d.status === "Solved"),
          anyStarred: Object.values(cd).some((d) => d.starred),
        };
      });
  }, [overlapEnabled]);

  // ── List mode data ──────────────────────────────────────────
  const listProblems = useMemo(() => {
    const comp = COMPANIES_RAW.find((c) => c.name === selectedCompany);
    return (comp?.problems || []).map((p) => ({
      ...p,
      neetcode: neetcodeBySlug[p.slug] || null,
      maxFreq: parseFreq(p.frequency),
      otherCompanies: (slugToCompanyNames[p.slug] || []).filter((n) => n !== selectedCompany),
    }));
  }, [selectedCompany]);

  // ── Current dataset ─────────────────────────────────────────
  const rawProblems = view === "list" ? listProblems : overlapProblems;

  // Filter & sort
  const filteredProblems = useMemo(() => {
    let result = rawProblems.filter((p) => {
      const q = searchQuery.toLowerCase();
      const matchSearch = !q || p.title.toLowerCase().includes(q) || p.slug.includes(q);
      const matchDiff = difficultyFilter === "All" || p.difficulty === difficultyFilter;
      const solved = view === "list" ? p.status === "Solved" : p.anySolved;
      const matchStatus =
        statusFilter === "All" ||
        (statusFilter === "Solved" && solved) ||
        (statusFilter === "Not Solved" && !solved);
      return matchSearch && matchDiff && matchStatus;
    });

    result.sort((a, b) => {
      let cmp = 0;
      switch (sortBy) {
        case "frequency": cmp = (a.maxFreq || 0) - (b.maxFreq || 0); break;
        case "difficulty": {
          const ord = { Easy: 1, Medium: 2, Hard: 3 };
          cmp = (ord[a.difficulty] || 0) - (ord[b.difficulty] || 0); break;
        }
        case "number": cmp = a.number - b.number; break;
        case "title": cmp = a.title.localeCompare(b.title); break;
        default: cmp = 0;
      }
      return sortDir === "desc" ? -cmp : cmp;
    });
    return result;
  }, [rawProblems, searchQuery, difficultyFilter, statusFilter, sortBy, sortDir, view]);

  const handleSort = (key) => {
    if (sortBy === key) setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    else { setSortBy(key); setSortDir("desc"); }
  };

  // Stats
  const stats = useMemo(() => {
    const p = rawProblems;
    const total = p.length;
    const easy = p.filter((x) => x.difficulty === "Easy").length;
    const med = p.filter((x) => x.difficulty === "Medium").length;
    const hard = p.filter((x) => x.difficulty === "Hard").length;
    const hasNotes = p.filter((x) => x.neetcode).length;
    return { total, easy, med, hard, hasNotes };
  }, [rawProblems]);

  return (
    <>
      {/* ── Sidebar ────────────────────────────────────────── */}
      <aside className={`app-sidebar company-sidebar ${sidebarOpen ? "open" : ""}`}>

        {/* View switcher at top of sidebar */}
        <div className="sidebar-view-switch">
          <button className={`sv-btn ${view === "list" ? "active" : ""}`}
            onClick={() => setView("list")}>
            <List size={12} /> List
          </button>
          <button className={`sv-btn ${view === "overlap" ? "active" : ""}`}
            onClick={() => setView("overlap")}>
            <Layers size={12} /> Overlap
          </button>
        </div>

        {/* Quick stats */}
        <div className="sidebar-dashboard">
          <div className="dash-stat">
            <div className="dash-num">{stats.total}</div>
            <div className="dash-label">Problems</div>
          </div>
          <div className="dash-stat">
            <div className="dash-num" style={{ color: "var(--accent-soft)" }}>{stats.hasNotes}</div>
            <div className="dash-label">Notes</div>
          </div>
        </div>
        {stats.total > 0 && (
          <div style={{ padding: "0 8px", marginBottom: 10 }}>
            <div className="diff-bar-stack" style={{ height: 5, borderRadius: 3 }}>
              <div className="diff-bar easy" style={{ width: `${(stats.easy / stats.total) * 100}%` }} />
              <div className="diff-bar medium" style={{ width: `${(stats.med / stats.total) * 100}%` }} />
              <div className="diff-bar hard" style={{ width: `${(stats.hard / stats.total) * 100}%` }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 3, fontSize: 9, color: "var(--text-faint)" }}>
              <span style={{ color: "var(--easy)" }}>{stats.easy} E</span>
              <span style={{ color: "var(--medium)" }}>{stats.med} M</span>
              <span style={{ color: "var(--hard)" }}>{stats.hard} H</span>
            </div>
          </div>
        )}

        <div className="glow-line" style={{ margin: "4px 0 10px" }} />

        {/* Company list */}
        <div className="sidebar-section-label">
          {view === "list" ? "SELECT COMPANY" : (
            <>
              OVERLAP
              <div style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
                <button className="mini-btn" onClick={() => setAllOverlap(true)}>All</button>
                <button className="mini-btn" onClick={() => setAllOverlap(false)}>Clear</button>
              </div>
            </>
          )}
        </div>

        <div className="sidebar-topics-scroll">
          {COMPANIES_RAW.map((c) => {
            if (view === "list") {
              const isActive = selectedCompany === c.name;
              return (
                <button key={c.name}
                  className={`topic-btn ${isActive ? "active" : ""}`}
                  onClick={() => { setSelectedCompany(c.name); setExpandedSlug(null); setSidebarOpen(false); }}
                  style={{ width: "100%", marginBottom: 3, justifyContent: "space-between" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <CompanyLogo name={c.name} size={15} />
                    <span>{c.name}</span>
                  </span>
                  <span style={{ fontSize: 10, color: "var(--text-faint)" }}>{c.problems.length}</span>
                </button>
              );
            }

            // Overlap mode — checkboxes
            const isOn = !!overlapEnabled[c.name];
            return (
              <button key={c.name}
                className={`company-row ${isOn ? "on" : "off"}`}
                onClick={() => toggleOverlap(c.name)}>
                <div className="company-row-left">
                  <div className={`company-check ${isOn ? "checked" : ""}`}>
                    {isOn && <Check size={10} strokeWidth={3} />}
                  </div>
                  <CompanyLogo name={c.name} size={15} />
                  <span className="company-row-name">{c.name}</span>
                </div>
                <span className="company-row-count">{c.problems.length}</span>
              </button>
            );
          })}
        </div>
      </aside>

      {/* ── Main ───────────────────────────────────────────── */}
      <main className="app-main">
        {/* Heading */}
        <div style={{ marginBottom: 16 }}>
          <div className="topic-heading">
            {view === "list" ? (
              <CompanyLogo name={selectedCompany} size={26} />
            ) : (
              <Layers size={24} style={{ color: "var(--accent-soft)" }} />
            )}
            <h2 className="heading-primary topic-title">
              {view === "list"
                ? selectedCompany
                : enabledNames.length === COMPANY_NAMES.length
                  ? "All Companies Overlap"
                  : `${enabledNames.length} Companies Overlap`}
            </h2>
            <span className="badge" style={{ background: "var(--tag-bg)", color: "var(--text-muted)" }}>
              {rawProblems.length} problems
            </span>
          </div>
          {view === "overlap" && enabledNames.length > 1 && (
            <div className="overlap-companies-row">
              {enabledNames.map((n) => (
                <span key={n} className="overlap-chip">
                  <CompanyLogo name={n} size={12} /> {n}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="controls-bar">
          <div className="search-wrap">
            <Search size={14} className="search-icon" />
            <input className="search-input has-icon" placeholder="Search problems..." value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
          <div className="diff-pills">
            {["All", "Easy", "Medium", "Hard"].map((d) => (
              <button key={d} className={`diff-pill ${difficultyFilter === d ? "active" : ""}`}
                style={difficultyFilter === d ? {
                  background: d === "All" ? "var(--pill-active-all-bg)" : undefined,
                  borderColor: d === "All" ? "var(--pill-active-all-border)" : diffColor(d),
                  color: d === "All" ? "var(--text-primary)" : diffColor(d),
                  ...(d !== "All" && { background: "color-mix(in srgb, currentColor 12%, transparent)" })
                } : {}}
                onClick={() => setDifficultyFilter(d)}>{d}</button>
            ))}
          </div>
          <div className="diff-pills">
            {["All", "Solved", "Not Solved"].map((s) => (
              <button key={s} className={`diff-pill ${statusFilter === s ? "active" : ""}`}
                style={statusFilter === s ? { background: "var(--pill-active-all-bg)", borderColor: "var(--pill-active-all-border)", color: "var(--text-primary)" } : {}}
                onClick={() => setStatusFilter(s)}>
                {s === "Solved" && <CircleCheck size={11} style={{ marginRight: 3 }} />}
                {s === "Not Solved" && <CircleDashed size={11} style={{ marginRight: 3 }} />}
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Sort bar */}
        <div className="sort-bar">
          <ArrowUpDown size={12} style={{ color: "var(--text-ghost)" }} />
          {[
            { key: "frequency", label: "Freq" },
            { key: "difficulty", label: "Diff" },
            { key: "number", label: "#" },
            { key: "title", label: "Name" },
          ].map((s) => (
            <button key={s.key} className={`sort-btn ${sortBy === s.key ? "active" : ""}`}
              onClick={() => handleSort(s.key)}>
              {s.label} {sortBy === s.key && (sortDir === "desc" ? "↓" : "↑")}
            </button>
          ))}
          <span style={{ fontSize: 11, color: "var(--text-faint)", marginLeft: "auto" }}>
            {filteredProblems.length} results
          </span>
        </div>

        {/* Problem list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {filteredProblems.map((p) => {
            const isExp = expandedSlug === p.slug;
            const isSolved = view === "list" ? p.status === "Solved" : p.anySolved;
            const isStarred = view === "list" ? p.starred : p.anyStarred;

            return (
              <div key={p.slug} className={`problem-card ${isExp ? "expanded" : ""}`}>
                <div className="problem-header" onClick={() => setExpandedSlug(isExp ? null : p.slug)}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0, flex: 1 }}>
                    <button className={`check-btn ${completed.isOn(p.slug) ? "done" : ""}`}
                      onClick={(e) => { e.stopPropagation(); completed.toggle(p.slug); }}>
                      {completed.isOn(p.slug) && <Check size={12} strokeWidth={3} style={{ color: "var(--check-icon)" }} />}
                    </button>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div className="problem-title-row">
                        <span style={{
                          fontSize: 13, fontWeight: 500,
                          color: completed.isOn(p.slug) ? "var(--completed-text)" : "var(--text-primary)",
                          textDecoration: completed.isOn(p.slug) ? "line-through" : "none"
                        }}>{p.title}</span>
                        <span className="badge" style={{
                          background: `color-mix(in srgb, ${diffColor(p.difficulty)} 10%, transparent)`,
                          color: diffColor(p.difficulty)
                        }}>{p.difficulty}</span>
                        {isStarred && <Star size={12} fill="var(--medium)" color="var(--medium)" />}
                        {p.neetcode && (
                          <span className="badge notes-badge" title="Has revision notes">
                            <BookOpen size={9} style={{ marginRight: 2 }} /> Notes
                          </span>
                        )}
                      </div>

                      <div className="company-freq-row">
                        {/* List mode: single freq + other companies */}
                        {view === "list" && (
                          <>
                            <div className="company-freq-pill" title={`Frequency: ${p.frequency}`}>
                              <div className="freq-micro-bar">
                                <div className="freq-micro-fill" style={{ width: `${parseFreq(p.frequency) * 100}%` }} />
                              </div>
                              <span className="freq-micro-label">{p.frequency}</span>
                            </div>
                            <span className={`status-dot ${isSolved ? "solved" : ""}`}>
                              {isSolved ? <CircleCheck size={12} /> : <CircleDashed size={12} />}
                            </span>
                            {/* Other company logos */}
                            {p.otherCompanies?.length > 0 && (
                              <div className="other-companies">
                                {p.otherCompanies.slice(0, 5).map((n) => (
                                  <span key={n} title={n}><CompanyLogo name={n} size={13} /></span>
                                ))}
                                {p.otherCompanies.length > 5 && (
                                  <span className="more-badge">+{p.otherCompanies.length - 5}</span>
                                )}
                              </div>
                            )}
                          </>
                        )}

                        {/* Overlap mode: per-company freq pills */}
                        {view === "overlap" && enabledNames.map((cname) => {
                          const cd = p.companyData?.[cname];
                          if (!cd) return null;
                          return (
                            <div key={cname} className="company-freq-pill" title={`${cname}: ${cd.frequency}`}>
                              <CompanyLogo name={cname} size={12} />
                              <div className="freq-micro-bar">
                                <div className="freq-micro-fill" style={{ width: `${parseFreq(cd.frequency) * 100}%` }} />
                              </div>
                              <span className="freq-micro-label">{cd.frequency}</span>
                            </div>
                          );
                        })}

                        <div className="problem-links">
                          <a href={p.url || `https://leetcode.com/problems/${p.slug}/`} target="_blank" rel="noopener noreferrer"
                            className="ext-link lc" onClick={(e) => e.stopPropagation()}>LC</a>
                          <a href={`https://neetcode.io/solutions/${p.slug}`} target="_blank" rel="noopener noreferrer"
                            className="ext-link nc" onClick={(e) => e.stopPropagation()}>NC</a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <ChevronDown size={16} className="expand-arrow-icon" style={{
                    transform: isExp ? "rotate(180deg)" : "none",
                    color: "var(--text-ghost)",
                    transition: "transform 0.2s",
                    flexShrink: 0,
                  }} />
                </div>

                {/* Expanded: neetcode enrichment */}
                {isExp && (
                  <div className="card-divider">
                    {p.neetcode ? (
                      <div className="tab-content">
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
                          <span className="pattern-tag">{p.neetcode.topicIcon} {p.neetcode.topicTitle}</span>
                          <span className="pattern-tag">{p.neetcode.pattern}</span>
                        </div>
                        <div style={{ marginBottom: 14 }}>
                          <div style={{ fontSize: 10, color: "var(--accent)", letterSpacing: "1px", marginBottom: 6 }}>TLDR</div>
                          <p style={{ fontSize: 13, lineHeight: 1.7, color: "var(--text-secondary)" }}>{p.neetcode.tldr}</p>
                        </div>
                        <div className="trick-box">
                          <div style={{ fontSize: 10, color: "var(--easy)", letterSpacing: "1px", marginBottom: 6 }}>
                            <Flame size={10} style={{ marginRight: 4, verticalAlign: "middle" }} /> KEY INSIGHT
                          </div>
                          <p style={{ fontSize: 13, lineHeight: 1.7, color: "var(--text-secondary)" }}>{p.neetcode.keyTrick}</p>
                        </div>
                        {p.neetcode.approaches && (
                          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
                            <div style={{ fontSize: 10, color: "var(--accent)", letterSpacing: "1px" }}>APPROACHES</div>
                            {p.neetcode.approaches.map((a, i) => (
                              <div key={i} className={`approach-card ${a.isOptimal ? "optimal" : ""}`}>
                                <div className="approach-header">
                                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <span style={{ fontSize: 11, fontWeight: 600, color: a.isOptimal ? "var(--easy)" : "var(--text-muted)" }}>
                                      {a.isOptimal ? "★ OPTIMAL" : `#${i + 1}`}
                                    </span>
                                    <span style={{ fontSize: 12.5, fontWeight: 500, color: "var(--text-secondary)" }}>{a.name}</span>
                                  </div>
                                  <code className="complexity-tag">{a.complexity}</code>
                                </div>
                                <p style={{ fontSize: 12, color: "var(--text-dimmed)", lineHeight: 1.6 }}>{a.description}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="tab-content" style={{ textAlign: "center", padding: "30px 18px", color: "var(--text-dimmed)" }}>
                        <BookOpen size={22} style={{ marginBottom: 8, opacity: 0.5 }} />
                        <p style={{ fontSize: 12.5 }}>No revision notes yet for this problem.</p>
                        <p style={{ fontSize: 11, color: "var(--text-faint)", marginTop: 4 }}>
                          Add it to your neetcode data to see TLDR, tricks & approaches here.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filteredProblems.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--text-ghost)" }}>
            <Filter size={32} style={{ opacity: 0.3, marginBottom: 12 }} />
            <div style={{ fontSize: 13 }}>
              {rawProblems.length === 0
                ? "No problems overlap across all selected companies"
                : "No problems match your filters"}
            </div>
          </div>
        )}
        <div style={{ height: 40 }} />
      </main>
    </>
  );
}

export default CompanyPrep;