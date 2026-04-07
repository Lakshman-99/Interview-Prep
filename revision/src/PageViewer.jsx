import { useState, useEffect, useRef, useMemo, useCallback, memo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// ── Use PrismLight — register only the languages we need ──────────
// This cuts the JS bundle by ~60% vs the full Prism import
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import python     from "react-syntax-highlighter/dist/esm/languages/prism/python";
import javascript from "react-syntax-highlighter/dist/esm/languages/prism/javascript";
import java       from "react-syntax-highlighter/dist/esm/languages/prism/java";
import cpp        from "react-syntax-highlighter/dist/esm/languages/prism/cpp";
import bash       from "react-syntax-highlighter/dist/esm/languages/prism/bash";

SyntaxHighlighter.registerLanguage("python",     python);
SyntaxHighlighter.registerLanguage("javascript", javascript);
SyntaxHighlighter.registerLanguage("java",       java);
SyntaxHighlighter.registerLanguage("cpp",        cpp);
SyntaxHighlighter.registerLanguage("bash",       bash);

// ── Auto-load .md files ───────────────────────────────────────────
const pageModules = import.meta.glob("./data/page/*.md", {
  eager: true, query: "?raw", import: "default",
});

const PAGES = Object.entries(pageModules)
  .map(([path, content]) => {
    const filename = path.split("/").pop().replace(".md", "");
    const title = filename.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    return { id: filename, title, content };
  })
  .sort((a, b) => a.title.localeCompare(b.title));

// ── Custom syntax-highlight themes (clean, no per-line backgrounds)
const DARK_CODE = {
  'code[class*="language-"]': {
    fontFamily: "'IBM Plex Mono','JetBrains Mono',monospace",
    background: "none", textAlign: "left", whiteSpace: "pre",
    wordSpacing: "normal", wordBreak: "normal",
    lineHeight: "1.7", tabSize: "4", hyphens: "none",
  },
  'pre[class*="language-"]': {
    fontFamily: "'IBM Plex Mono','JetBrains Mono',monospace",
    color: "#d0ccc6", background: "#1c1a2a",
    padding: "1.1em", margin: "0", overflow: "auto",
    borderRadius: "8px", border: "1px solid #2c2c2c", lineHeight: "1.7",
  },
  comment:             { color: "#605c58", fontStyle: "italic" },
  prolog:              { color: "#605c58" },
  doctype:             { color: "#605c58" },
  cdata:               { color: "#605c58" },
  punctuation:         { color: "#888280" },
  namespace:           { opacity: "0.7" },
  property:            { color: "#e0a070" },
  tag:                 { color: "#e0a070" },
  constant:            { color: "#e0a070" },
  symbol:              { color: "#e0a070" },
  deleted:             { color: "#e06870" },
  boolean:             { color: "#bc8cf8" },
  number:              { color: "#f0c874" },
  selector:            { color: "#a8d8a8" },
  "attr-name":         { color: "#e0a070" },
  string:              { color: "#a8d8a8" },
  char:                { color: "#a8d8a8" },
  builtin:             { color: "#e0a070" },
  inserted:            { color: "#a8d8a8" },
  operator:            { color: "#c0c8e0" },
  entity:              { color: "#e0a070", cursor: "help" },
  url:                 { color: "#a8d8a8" },
  variable:            { color: "#e06870" },
  atrule:              { color: "#bc8cf8" },
  "attr-value":        { color: "#a8d8a8" },
  function:            { color: "#7ec8f8" },
  "function-variable": { color: "#7ec8f8" },
  "class-name":        { color: "#f0c874" },
  keyword:             { color: "#bc8cf8" },
  regex:               { color: "#f0c874" },
  important:           { color: "#f0c874", fontWeight: "bold" },
  bold:                { fontWeight: "bold" },
  italic:              { fontStyle: "italic" },
};

const LIGHT_CODE = {
  'code[class*="language-"]': {
    fontFamily: "'IBM Plex Mono','JetBrains Mono',monospace",
    background: "none", textAlign: "left", whiteSpace: "pre",
    wordSpacing: "normal", wordBreak: "normal",
    lineHeight: "1.7", tabSize: "4", hyphens: "none",
  },
  'pre[class*="language-"]': {
    fontFamily: "'IBM Plex Mono','JetBrains Mono',monospace",
    color: "#383432", background: "#eeeaf4",
    padding: "1.1em", margin: "0", overflow: "auto",
    borderRadius: "8px", border: "1px solid #ddd9d0", lineHeight: "1.7",
  },
  comment:             { color: "#9a9490", fontStyle: "italic" },
  prolog:              { color: "#9a9490" },
  doctype:             { color: "#9a9490" },
  cdata:               { color: "#9a9490" },
  punctuation:         { color: "#888480" },
  namespace:           { opacity: "0.7" },
  property:            { color: "#b05800" },
  tag:                 { color: "#b05800" },
  constant:            { color: "#b05800" },
  symbol:              { color: "#b05800" },
  deleted:             { color: "#c0303c" },
  boolean:             { color: "#6030b0" },
  number:              { color: "#a86000" },
  selector:            { color: "#2a7040" },
  "attr-name":         { color: "#b05800" },
  string:              { color: "#2a7040" },
  char:                { color: "#2a7040" },
  builtin:             { color: "#b05800" },
  inserted:            { color: "#2a7040" },
  operator:            { color: "#383432" },
  entity:              { color: "#b05800", cursor: "help" },
  url:                 { color: "#2a7040" },
  variable:            { color: "#c0303c" },
  atrule:              { color: "#6030b0" },
  "attr-value":        { color: "#2a7040" },
  function:            { color: "#1060a0" },
  "function-variable": { color: "#1060a0" },
  "class-name":        { color: "#a86000" },
  keyword:             { color: "#6030b0" },
  regex:               { color: "#a86000" },
  important:           { color: "#a86000", fontWeight: "bold" },
  bold:                { fontWeight: "bold" },
  italic:              { fontStyle: "italic" },
};

// ── Slug generator — matches the MD file's own TOC anchors ────────
function slugify(text) {
  return text
    .replace(/[\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}\u{FE00}-\u{FEFF}\u{200D}]/gu, "")
    .replace(/^\s*\d+[.:]\s*/, "")
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function childText(children) {
  if (typeof children === "string") return children;
  if (Array.isArray(children)) return children.map(childText).join("");
  if (children?.props?.children) return childText(children.props.children);
  return "";
}

// ── Extract h2 headings from raw markdown ─────────────────────────
function extractSections(content) {
  return content
    .split("\n")
    .filter((l) => /^##\s/.test(l))
    .map((l) => {
      const raw = l.replace(/^##\s+/, "");
      const slug = slugify(raw);
      const display = raw
        .replace(/[\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}\u{FE00}-\u{FEFF}\u{200D}]/gu, "")
        .replace(/^\s*\d+[.:]\s*/, "")
        .trim();
      return { slug, display };
    });
}

// ── Memoised ReactMarkdown wrapper — only re-renders when content
//    or components change (NOT on every scroll / state change)     ─
const MDContent = memo(
  function MDContent({ content, components }) {
    return (
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    );
  },
  (prev, next) =>
    prev.content === next.content && prev.components === next.components
);

// ── TOC item button (shared between right panel and mobile sidebar)
function TocItem({ slug, display, active, onClick }) {
  return (
    <button
      className={`toc-item ${active ? "active" : ""}`}
      onClick={onClick}
      title={display}
    >
      {display}
    </button>
  );
}

// ── PageViewer ────────────────────────────────────────────────────
function PageViewer({ isLight, sidebarOpen, setSidebarOpen }) {
  const [selectedPage, setSelectedPage] = useState(PAGES[0]?.id ?? null);
  const [activeSection, setActiveSection] = useState(null);
  const mainRef  = useRef(null);
  const activeRef = useRef(null); // avoid unnecessary state updates on scroll

  const page     = PAGES.find((p) => p.id === selectedPage);
  const sections = useMemo(() => (page ? extractSections(page.content) : []), [page]);

  // ── Scroll to a section by slug ─────────────────────────────
  const scrollToSection = useCallback((slug) => {
    const el = document.getElementById(slug);
    if (!el || !mainRef.current) return;
    const c = mainRef.current;
    const offset = el.getBoundingClientRect().top - c.getBoundingClientRect().top + c.scrollTop - 20;
    c.scrollTo({ top: offset, behavior: "smooth" });
    activeRef.current = slug;
    setActiveSection(slug);
  }, []); // mainRef and setActiveSection are always stable

  // ── Track active section while scrolling ────────────────────
  useEffect(() => {
    const c = mainRef.current;
    if (!c) return;
    const onScroll = () => {
      const headings = c.querySelectorAll("h2[id]");
      let active = null;
      for (const h of headings) {
        if (h.offsetTop <= c.scrollTop + 110) active = h.id;
        else break;
      }
      if (active !== activeRef.current) {
        activeRef.current = active;
        setActiveSection(active);
      }
    };
    c.addEventListener("scroll", onScroll, { passive: true });
    return () => c.removeEventListener("scroll", onScroll);
  }, [selectedPage]);

  // ── Scroll to hash on page change ───────────────────────────
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      setTimeout(() => scrollToSection(hash), 60);
    } else {
      mainRef.current?.scrollTo({ top: 0, behavior: "instant" });
      activeRef.current = null;
      setActiveSection(null);
    }
  }, [selectedPage, scrollToSection]);

  // ── Memoised markdown component map ─────────────────────────
  // Only recreates when theme or scroll function changes
  const components = useMemo(() => {
    const makeH = (Tag) =>
      function H({ children }) {
        return <Tag id={slugify(childText(children))}>{children}</Tag>;
      };
    return {
      h1: makeH("h1"),
      h2: makeH("h2"),
      h3: makeH("h3"),
      h4: makeH("h4"),
      code({ inline, className, children, ...rest }) {
        const lang = /language-(\w+)/.exec(className || "")?.[1];
        if (!inline && lang) {
          return (
            <SyntaxHighlighter
              style={isLight ? LIGHT_CODE : DARK_CODE}
              language={lang}
              PreTag="div"
              customStyle={{ fontSize: "13px", margin: "0" }}
              {...rest}
            >
              {String(children).replace(/\n$/, "")}
            </SyntaxHighlighter>
          );
        }
        return <code className="md-inline-code" {...rest}>{children}</code>;
      },
      a({ href, children, ...rest }) {
        if (href?.startsWith("#")) {
          return (
            <a href={href}
              onClick={(e) => { e.preventDefault(); scrollToSection(href.slice(1)); }}
              {...rest}
            >{children}</a>
          );
        }
        return <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>{children}</a>;
      },
    };
  }, [isLight, scrollToSection]);

  // ── Empty state ──────────────────────────────────────────────
  if (PAGES.length === 0) {
    return (
      <div className="app-main" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", color: "var(--text-ghost)" }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>📄</div>
          <div style={{ fontSize: 14 }}>No pages found in <code>src/data/page/</code></div>
        </div>
      </div>
    );
  }

  const tocItems = sections.map((s) => (
    <TocItem key={s.slug} slug={s.slug} display={s.display}
      active={activeSection === s.slug}
      onClick={() => { scrollToSection(s.slug); setSidebarOpen(false); }}
    />
  ));

  return (
    <>
      {/* ── Left sidebar: pages list (+ sections on mobile) ─── */}
      <aside className={`app-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-topics-scroll">
          <div className="sidebar-label">PAGES</div>
          {PAGES.map((p) => (
            <button key={p.id}
              className={`topic-btn ${selectedPage === p.id ? "active" : ""}`}
              onClick={() => { setSelectedPage(p.id); setSidebarOpen(false); }}
              style={{ width: "100%", marginBottom: 4 }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {p.title}
                </span>
              </span>
            </button>
          ))}

          {/* Mobile-only sections list (hidden on desktop via CSS) */}
          {sections.length > 0 && (
            <div className="mobile-toc-section">
              <div className="glow-line" style={{ margin: "14px 0 12px" }} />
              <div className="sidebar-label">SECTIONS</div>
              {tocItems}
            </div>
          )}
        </div>
      </aside>

      {/* ── Main content ─────────────────────────────────────── */}
      <main ref={mainRef} className="app-main page-content">
        {/* Mobile sticky section indicator — tapping opens sidebar */}
        {sections.length > 0 && (
          <div className="mobile-section-bar">
            <button className="msb-btn" onClick={() => setSidebarOpen(true)}>
              <span className="msb-label">§</span>
              <span className="msb-text">
                {activeSection
                  ? sections.find((s) => s.slug === activeSection)?.display ?? "Sections"
                  : "Jump to section"}
              </span>
              <span className="msb-arrow">›</span>
            </button>
          </div>
        )}

        {page && (
          <div className="md-body">
            <MDContent content={page.content} components={components} />
          </div>
        )}
        <div style={{ height: 60 }} />
      </main>

      {/* ── Right TOC: sections (desktop only) ───────────────── */}
      {sections.length > 0 && (
        <aside className="page-toc">
          <div className="toc-label">ON THIS PAGE</div>
          {tocItems}
        </aside>
      )}
    </>
  );
}

export default PageViewer;
