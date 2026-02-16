import { useState, useEffect } from "react";
import { Zap, Building2, Sun, Moon } from "lucide-react";
import CompanyPrep from "./Companyprep";
import { useLocalStorage, usePersistedSet } from "./Uselocalstorage";
import "./App.css";

// ═══════════════════════════════════════════════════════════════
// DATA: Auto-loaded from all .json files in the data/ folder.
// To add a new topic: just drop a new JSON file in src/data/
// Schema: { id, title, icon, description, patterns[], problems[] }
// ═══════════════════════════════════════════════════════════════

const topicModules = import.meta.glob("./data/neetcode/*.json", { eager: true });
const TOPICS_DATA = Object.values(topicModules).map((m) => m.default).sort((a, b) => a.order - b.order);

function App() {
  // ── Persisted state ─────────────────────────────────────────
  const [theme, setTheme] = useLocalStorage("theme", "dark");
  const [page, setPage] = useLocalStorage("page", "neetcode");
  const [selectedTopic, setSelectedTopic] = useLocalStorage("selectedTopic", TOPICS_DATA[0]?.id);
  const completed = usePersistedSet("completed");
  const [quizState, setQuizState] = useLocalStorage("quiz", {});

  // ── Session-only state ──────────────────────────────────────
  const [expandedProblem, setExpandedProblem] = useState(null);
  const [activeTab, setActiveTab] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [showPatterns, setShowPatterns] = useState(false);
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isLight = theme === "light";

  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 768) setSidebarOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const topic = TOPICS_DATA.find((t) => t.id === selectedTopic);

  const filteredProblems = topic?.problems.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.pattern.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDiff = difficultyFilter === "All" || p.difficulty === difficultyFilter;
    return matchesSearch && matchesDiff;
  }) || [];

  const getTab = (pid) => activeTab[pid] || "tldr";

  const handleQuizAnswer = (pid, qIdx, sel) => {
    setQuizState((prev) => ({ ...prev, [`${pid}-${qIdx}`]: sel }));
  };

  const selectTopic = (id) => {
    setSelectedTopic(id);
    setExpandedProblem(null);
    setShowPatterns(false);
    setSearchQuery("");
    setDifficultyFilter("All");
    setSidebarOpen(false);
  };

  const completedInTopic = topic?.problems.filter((p) => completed.isOn(p.id)).length || 0;
  const totalInTopic = topic?.problems.length || 0;
  const totalCompleted = completed.count;
  const totalProblems = TOPICS_DATA.reduce((s, t) => s + t.problems.length, 0);

  const diffColor = (d) => `var(--${d.toLowerCase()})`;

  return (
    <div className={`app-root ${isLight ? "light" : ""}`}>
      {/* ── Header ────────────────────────────────────────── */}
      <header className="app-header">
        <div className="header-inner">
          <div className="header-left">
            <button className="hamburger" onClick={() => setSidebarOpen((o) => !o)} aria-label="Toggle sidebar">
              <span className={`hamburger-line ${sidebarOpen ? "open" : ""}`} />
              <span className={`hamburger-line ${sidebarOpen ? "open" : ""}`} />
              <span className={`hamburger-line ${sidebarOpen ? "open" : ""}`} />
            </button>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                <h1 className="heading-primary header-title">DSA Revision Engine</h1>
              </div>
              <div className="page-tabs">
                <button className={`page-tab ${page === "neetcode" ? "active" : ""}`}
                  onClick={() => { setPage("neetcode"); setSidebarOpen(false); }}><Zap size={14} /> NeetCode</button>
                <button className={`page-tab ${page === "company" ? "active" : ""}`}
                  onClick={() => { setPage("company"); setSidebarOpen(false); }}><Building2 size={14} /> Companies</button>
              </div>
            </div>
          </div>

          <div className="header-right">
            <div className="header-stats">
              <div style={{ fontSize: 10, color: "var(--text-faint)", marginBottom: 4 }}>OVERALL</div>
              <div style={{ fontSize: 18, color: "var(--text-heading)", fontWeight: 600 }}>
                {totalCompleted}<span style={{ color: "var(--text-faint)" }}>/{totalProblems}</span>
              </div>
            </div>
            <div className="header-progress">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${totalProblems ? (totalCompleted / totalProblems) * 100 : 0}%` }} />
              </div>
            </div>
            <button className="theme-toggle"
              onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
              aria-label="Toggle theme"
              title={isLight ? "Switch to dark mode" : "Switch to light mode"}>
              <div className={`theme-toggle-knob ${isLight ? "is-light" : ""}`}>
                {isLight ? <Sun size={12} /> : <Moon size={12} />}
              </div>
            </button>
          </div>
        </div>
      </header>

      <div className="app-body">
        {sidebarOpen && <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />}

        {page === "company" ? (
          <CompanyPrep
            completed={completed}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />
        ) : (
        <>
        {/* ── NeetCode Sidebar ─────────────────────────────── */}
        <aside className={`app-sidebar ${sidebarOpen ? "open" : ""}`}>
          <div style={{ fontSize: 10, color: "var(--text-ghost)", letterSpacing: "1.5px", padding: "0 8px", marginBottom: 10 }}>TOPICS</div>
          <div className="sidebar-topics-scroll">
            {TOPICS_DATA.map((t) => {
              const done = t.problems.filter((p) => completed.isOn(p.id)).length;
              return (
                <button key={t.id} className={`topic-btn ${selectedTopic === t.id ? "active" : ""}`}
                  onClick={() => selectTopic(t.id)}
                  style={{ width: "100%", marginBottom: 4, justifyContent: "space-between" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 8 }}><span>{t.icon}</span><span>{t.title}</span></span>
                  <span style={{ fontSize: 11, color: "var(--text-faint)" }}>{done}/{t.problems.length}</span>
                </button>
              );
            })}
          </div>
          <div className="glow-line" style={{ margin: "16px 0" }} />
          <div style={{ fontSize: 10, color: "var(--text-ghost)", letterSpacing: "1.5px", padding: "0 8px", marginBottom: 10 }}>CURRENT TOPIC</div>
          <div style={{ padding: "0 8px" }}>
            {["Easy", "Medium", "Hard"].map((d) => {
              const count = topic?.problems.filter((p) => p.difficulty === d).length || 0;
              const doneCount = topic?.problems.filter((p) => p.difficulty === d && completed.isOn(p.id)).length || 0;
              return (
                <div key={d} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 12 }}>
                  <span style={{ color: diffColor(d) }}>{d}</span>
                  <span style={{ color: "var(--text-faint)" }}>{doneCount}/{count}</span>
                </div>
              );
            })}
            <div style={{ marginTop: 8 }}>
              <div className="progress-bar" style={{ marginBottom: 4 }}>
                <div className="progress-fill" style={{ width: `${totalInTopic ? (completedInTopic / totalInTopic) * 100 : 0}%` }} />
              </div>
              <div style={{ fontSize: 11, color: "var(--text-faint)", textAlign: "center" }}>{completedInTopic}/{totalInTopic} done</div>
            </div>
          </div>
        </aside>

        {/* ── NeetCode Main ────────────────────────────────── */}
        <main className="app-main">
          <div style={{ marginBottom: 20 }}>
            <div className="topic-heading">
              <span className="topic-icon">{topic?.icon}</span>
              <h2 className="heading-primary topic-title">{topic?.title}</h2>
              <span className="badge" style={{ background: "var(--tag-bg)", color: "var(--text-muted)" }}>{topic?.problems.length} problems</span>
            </div>
            <p style={{ color: "var(--text-dimmed)", fontSize: 13, lineHeight: 1.6, maxWidth: 640 }}>{topic?.description}</p>
          </div>

          <div className="controls-bar">
            <input className="search-input" placeholder="Search problems or patterns..." value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} />
            <button className="topic-btn"
              style={{ background: showPatterns ? "var(--accent-surface)" : "transparent", borderColor: showPatterns ? "var(--border-accent)" : undefined, color: showPatterns ? "var(--accent-soft)" : undefined }}
              onClick={() => setShowPatterns(!showPatterns)}>🧩 Patterns</button>
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
          </div>

          {showPatterns && (
            <div style={{ marginBottom: 24 }}>
              <div className="pattern-grid">
                {topic?.patterns.map((pat) => (
                  <div key={pat.name} className="pattern-card">
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--pattern-text)", marginBottom: 6 }}>{pat.name}</div>
                    <p style={{ fontSize: 11.5, color: "var(--text-dimmed)", lineHeight: 1.5, marginBottom: 10 }}>{pat.description}</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                      {pat.problems.map((pid) => {
                        const prob = topic.problems.find((p) => p.id === pid);
                        return prob ? (
                          <span key={pid} className="pattern-tag" style={{ fontSize: 10, cursor: "pointer" }}
                            onClick={() => { setExpandedProblem(pid); setShowPatterns(false); setSearchQuery(""); setDifficultyFilter("All"); }}>{prob.title}</span>
                        ) : null;
                      })}
                    </div>
                  </div>
                ))}
              </div>
              <div className="glow-line" style={{ margin: "20px 0" }} />
            </div>
          )}

          {/* Problems */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {filteredProblems.map((problem) => {
              const isExp = expandedProblem === problem.id;
              const tab = getTab(problem.id);
              return (
                <div key={problem.id} className={`problem-card ${isExp ? "expanded" : ""}`}>
                  {/* Header row */}
                  <div onClick={() => setExpandedProblem(isExp ? null : problem.id)} className="problem-header">
                    <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
                      <button className={`check-btn ${completed.isOn(problem.id) ? "done" : ""}`}
                        onClick={(e) => { e.stopPropagation(); completed.toggle(problem.id); }}>
                        {completed.isOn(problem.id) && <span style={{ color: "var(--check-icon)", fontSize: 12, fontWeight: 700 }}>✓</span>}
                      </button>
                      <div style={{ minWidth: 0 }}>
                        <div className="problem-title-row">
                          <span style={{
                            fontSize: 13.5, fontWeight: 500,
                            color: completed.isOn(problem.id) ? "var(--completed-text)" : "var(--text-primary)",
                            textDecoration: completed.isOn(problem.id) ? "line-through" : "none"
                          }}>{problem.title}</span>
                          <span className="badge" style={{
                            background: `color-mix(in srgb, ${diffColor(problem.difficulty)} 10%, transparent)`,
                            color: diffColor(problem.difficulty)
                          }}>{problem.difficulty}</span>
                          <span className="leetcode-num">#{problem.leetcodeNum}</span>
                          <a href={`https://leetcode.com/problems/${problem.id}/`} target="_blank" rel="noopener noreferrer"
                            className="ext-link lc" onClick={(e) => e.stopPropagation()} title="Open on LeetCode">LC</a>
                          <a href={`https://neetcode.io/solutions/${problem.id}`} target="_blank" rel="noopener noreferrer"
                            className="ext-link nc" onClick={(e) => e.stopPropagation()} title="NeetCode Solution">NC</a>
                        </div>
                        <span className="pattern-tag" style={{ marginTop: 4 }}>{problem.pattern}</span>
                      </div>
                    </div>
                    <span className="expand-arrow" style={{ transform: isExp ? "rotate(180deg)" : "none" }}>▾</span>
                  </div>

                  {/* Expanded content */}
                  {isExp && (
                    <div className="card-divider">
                      <div className="tab-bar">
                        {[{ key: "tldr", label: "TLDR" }, { key: "trick", label: "Key Trick" }, { key: "approach", label: "Approaches" }, { key: "quiz", label: "Quiz" }].map((t) => (
                          <button key={t.key} className={`tab-btn ${tab === t.key ? "active" : ""}`}
                            onClick={() => setActiveTab((prev) => ({ ...prev, [problem.id]: t.key }))}>{t.label}</button>
                        ))}
                      </div>
                      <div className="tab-content">
                        {/* TLDR */}
                        {tab === "tldr" && (
                          <div>
                            <p style={{ fontSize: 13.5, lineHeight: 1.7, color: "var(--text-secondary)" }}>{problem.tldr}</p>
                            <div className="pattern-box">
                              <div style={{ fontSize: 10, color: "var(--accent)", letterSpacing: "1px", marginBottom: 4 }}>PATTERN</div>
                              <span style={{ fontSize: 12.5, color: "var(--text-muted)" }}>{problem.pattern}</span>
                            </div>
                          </div>
                        )}

                        {/* Key Trick */}
                        {tab === "trick" && (
                          <div className="trick-box">
                            <div style={{ fontSize: 10, color: "var(--easy)", letterSpacing: "1px", marginBottom: 8 }}>💡 THE KEY INSIGHT</div>
                            <p style={{ fontSize: 13.5, lineHeight: 1.7, color: "var(--text-secondary)" }}>{problem.keyTrick}</p>
                          </div>
                        )}

                        {/* Approaches */}
                        {tab === "approach" && (
                          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                            {problem.approaches.map((a, aIdx) => (
                              <div key={aIdx} className={`approach-card ${a.isOptimal ? "optimal" : ""}`}>
                                <div className="approach-header">
                                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <span style={{ fontSize: 11, fontWeight: 600, color: a.isOptimal ? "var(--easy)" : "var(--text-muted)" }}>{a.isOptimal ? "★ OPTIMAL" : `#${aIdx + 1}`}</span>
                                    <span style={{ fontSize: 13, fontWeight: 500, color: "var(--text-secondary)" }}>{a.name}</span>
                                  </div>
                                  <code className="complexity-tag">{a.complexity}</code>
                                </div>
                                <p style={{ fontSize: 12.5, color: "var(--text-dimmed)", lineHeight: 1.6 }}>{a.description}</p>
                                {aIdx < problem.approaches.length - 1 && !a.isOptimal && (
                                  <div style={{ marginTop: 8, fontSize: 11, color: "var(--text-faint)", display: "flex", alignItems: "center", gap: 6 }}><span>↓</span> Can we do better?</div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Quiz */}
                        {tab === "quiz" && (
                          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                            {problem.quiz.map((q, qIdx) => {
                              const sk = `${problem.id}-${qIdx}`;
                              const sel = quizState[sk];
                              const answered = sel !== undefined;
                              const isCorrect = sel === q.answer;
                              return (
                                <div key={qIdx}>
                                  <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 10, lineHeight: 1.6 }}>
                                    <span style={{ color: "var(--accent)", marginRight: 8 }}>Q{qIdx + 1}.</span>{q.q}
                                  </div>
                                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                    {q.options.map((opt, oIdx) => {
                                      let cls = "quiz-option";
                                      if (answered) { cls += " answered"; if (oIdx === q.answer) cls += " correct"; else if (oIdx === sel) cls += " incorrect"; }
                                      return (
                                        <button key={oIdx} className={cls} onClick={() => !answered && handleQuizAnswer(problem.id, qIdx, oIdx)}
                                          style={{ cursor: answered ? "default" : "pointer" }}>
                                          <span style={{ color: "var(--text-faint)", marginRight: 8 }}>{String.fromCharCode(65 + oIdx)}.</span>{opt}
                                        </button>
                                      );
                                    })}
                                  </div>
                                  {answered && (
                                    <div className={`quiz-feedback ${isCorrect ? "is-correct" : "is-incorrect"}`}>
                                      <span style={{ fontWeight: 600, color: isCorrect ? "var(--easy)" : "var(--hard)" }}>
                                        {isCorrect ? "✓ Correct" : "✗ Incorrect"}
                                      </span>
                                      {" — "}{q.explanation}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {filteredProblems.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--text-ghost)" }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>∅</div>
              <div style={{ fontSize: 13 }}>No problems match your filters</div>
            </div>
          )}
          <div style={{ height: 40 }} />
        </main>
        </>
        )}
      </div>
    </div>
  );
}

export default App;