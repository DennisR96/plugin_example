"use client";

import { useState, type CSSProperties } from "react";
import { BarChart3, Loader2, Send, Sparkles, Trash2 } from "lucide-react";

const EXAMPLE_TEXT = "CGNodes plugins are useful and make workflow extensions easy to test.";
const API_ENDPOINT = "/api/interactive/mockup/text-lab/analyze";
const DISPLAY_ENDPOINT = "/interactive/mockup/text-lab/analyze";

type AnalysisResult = {
  characters: number;
  words: number;
  lines: number;
  sentiment: "positive" | "negative" | "neutral";
  score: number;
  preview: string;
};

const sentimentStyles = {
  positive: { borderColor: "#a7f3d0", background: "#ecfdf5", color: "#065f46" },
  negative: { borderColor: "#fecdd3", background: "#fff1f2", color: "#9f1239" },
  neutral: { borderColor: "#e2e8f0", background: "#f8fafc", color: "#1e293b" },
};

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: "100vh",
    padding: "32px",
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    color: "#020617",
    background: "linear-gradient(135deg, #f5f3ff 0%, #ffffff 48%, #f8fafc 100%)",
  },
  shell: { maxWidth: 1180, margin: "0 auto", display: "grid", gap: 24 },
  header: {
    display: "flex",
    justifyContent: "space-between",
    gap: 24,
    padding: 24,
    border: "1px solid #ede9fe",
    borderRadius: 28,
    background: "rgba(255,255,255,0.86)",
    boxShadow: "0 1px 3px rgba(15, 23, 42, 0.08)",
  },
  eyebrow: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "4px 12px",
    border: "1px solid #ddd6fe",
    borderRadius: 999,
    background: "#f5f3ff",
    color: "#6d28d9",
    fontSize: 12,
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  },
  title: { margin: "14px 0 0", fontSize: 36, lineHeight: 1.1, fontWeight: 900, letterSpacing: -0.6 },
  description: { margin: "10px 0 0", maxWidth: 720, color: "#64748b", fontSize: 14, lineHeight: 1.6 },
  endpoint: {
    alignSelf: "center",
    padding: "12px 16px",
    border: "1px solid #e2e8f0",
    borderRadius: 16,
    background: "#f8fafc",
    color: "#64748b",
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
    fontSize: 12,
    whiteSpace: "nowrap",
  },
  main: { display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(340px, 0.9fr)", gap: 24 },
  panel: {
    overflow: "hidden",
    border: "1px solid #e2e8f0",
    borderRadius: 28,
    background: "#ffffff",
    boxShadow: "0 1px 3px rgba(15, 23, 42, 0.08)",
  },
  panelHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 20px",
    borderBottom: "1px solid #f1f5f9",
    background: "#f8fafc",
  },
  heading: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    margin: 0,
    color: "#334155",
    fontSize: 13,
    fontWeight: 900,
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  },
  clearButton: {
    border: 0,
    borderRadius: 10,
    padding: 8,
    color: "#94a3b8",
    background: "transparent",
    cursor: "pointer",
  },
  textarea: {
    width: "100%",
    minHeight: 384,
    padding: 20,
    border: 0,
    resize: "none",
    outline: "none",
    color: "#1f2937",
    fontSize: 14,
    lineHeight: 1.7,
    boxSizing: "border-box",
    font: "inherit",
  },
  actionBar: { padding: 16, borderTop: "1px solid #f1f5f9" },
  button: {
    width: "100%",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: "12px 16px",
    border: 0,
    borderRadius: 14,
    background: "#7c3aed",
    color: "#ffffff",
    fontSize: 14,
    fontWeight: 800,
    cursor: "pointer",
    boxShadow: "0 1px 2px rgba(15, 23, 42, 0.12)",
  },
  resultPanel: { padding: 20, border: "1px solid #e2e8f0", borderRadius: 28, background: "#ffffff" },
  empty: {
    minHeight: 384,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px dashed #e2e8f0",
    borderRadius: 20,
    background: "#f8fafc",
    color: "#94a3b8",
    fontSize: 14,
  },
  error: { padding: 16, border: "1px solid #fecdd3", borderRadius: 20, background: "#fff1f2", color: "#be123c" },
  resultGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 },
  statCard: { padding: 16, border: "1px solid #ede9fe", borderRadius: 20, background: "#fff" },
  statLabel: { color: "#7c3aed", fontSize: 11, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.06em" },
  statValue: { marginTop: 8, color: "#020617", fontSize: 32, fontWeight: 900, lineHeight: 1 },
  sentiment: { marginTop: 16, padding: 20, border: "1px solid", borderRadius: 20 },
  preview: { marginTop: 16, padding: 16, border: "1px solid #e2e8f0", borderRadius: 20, background: "#f8fafc" },
};

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div style={styles.statCard}>
      <div style={styles.statLabel}>{label}</div>
      <div style={styles.statValue}>{value}</div>
    </div>
  );
}

export default function MockupWorkflowPage() {
  const [text, setText] = useState(EXAMPLE_TEXT);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = async () => {
    if (!text.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) throw new Error("Plugin API returned an error.");

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setError("Could not reach the mockup plugin API. Check whether the frontend reloaded after installation.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.shell}>
        <header style={styles.header}>
          <div>
            <div style={styles.eyebrow}>
              <Sparkles size={14} /> Plugin Frontend Template
            </div>
            <h1 style={styles.title}>Text Lab Mockup</h1>
            <p style={styles.description}>
              A small template shipped by the plugin. It talks to a co-installed API endpoint and renders the response in a dashboard-style view.
            </p>
          </div>
          <div style={styles.endpoint}>{DISPLAY_ENDPOINT}</div>
        </header>

        <main style={styles.main}>
          <section style={styles.panel}>
            <div style={styles.panelHeader}>
              <h2 style={styles.heading}>
                <Send size={16} /> Input Text
              </h2>
              <button
                onClick={() => {
                  setText("");
                  setResult(null);
                }}
                style={styles.clearButton}
                title="Clear"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <textarea
              value={text}
              onChange={(event) => setText(event.target.value)}
              style={styles.textarea}
              placeholder="Type text to analyze..."
            />

            <div style={styles.actionBar}>
              <button
                onClick={analyze}
                disabled={isLoading || !text.trim()}
                style={{ ...styles.button, opacity: isLoading || !text.trim() ? 0.55 : 1, cursor: isLoading || !text.trim() ? "not-allowed" : "pointer" }}
              >
                {isLoading ? <Loader2 size={18} /> : <BarChart3 size={18} />}
                Analyze with Plugin API
              </button>
            </div>
          </section>

          <section style={styles.resultPanel}>
            <h2 style={{ ...styles.heading, marginBottom: 16 }}>Result</h2>

            {error && <div style={styles.error}>{error}</div>}

            {!error && !result && <div style={styles.empty}>Run the analysis to see plugin API output.</div>}

            {result && (
              <div>
                <div style={styles.resultGrid}>
                  <StatCard label="Chars" value={result.characters} />
                  <StatCard label="Words" value={result.words} />
                  <StatCard label="Lines" value={result.lines} />
                </div>

                <div style={{ ...styles.sentiment, ...sentimentStyles[result.sentiment] }}>
                  <div style={{ fontSize: 11, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.06em", opacity: 0.72 }}>Sentiment</div>
                  <div style={{ marginTop: 8, fontSize: 40, fontWeight: 900, lineHeight: 1, textTransform: "capitalize" }}>{result.sentiment}</div>
                  <div style={{ marginTop: 6, fontSize: 14, fontWeight: 800, opacity: 0.82 }}>Score: {result.score}</div>
                </div>

                <div style={styles.preview}>
                  <div style={{ marginBottom: 8, color: "#64748b", fontSize: 11, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.06em" }}>Preview</div>
                  <p style={{ margin: 0, color: "#334155", fontSize: 14, lineHeight: 1.6 }}>{result.preview}</p>
                </div>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
