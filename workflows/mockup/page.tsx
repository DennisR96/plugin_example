"use client";

import { useState } from "react";
import { BarChart3, Loader2, Send, Sparkles, Trash2 } from "lucide-react";

const EXAMPLE_TEXT = "CGNodes plugins are useful and make workflow extensions easy to test.";

type AnalysisResult = {
  characters: number;
  words: number;
  lines: number;
  sentiment: "positive" | "negative" | "neutral";
  score: number;
  preview: string;
};

const sentimentStyles = {
  positive: "border-emerald-200 bg-emerald-50 text-emerald-800",
  negative: "border-rose-200 bg-rose-50 text-rose-800",
  neutral: "border-slate-200 bg-slate-50 text-slate-800",
};

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-violet-100 bg-white p-4 shadow-sm">
      <div className="text-xs font-black uppercase tracking-wider text-violet-600">{label}</div>
      <div className="mt-2 text-3xl font-black tracking-tight text-slate-950">{value}</div>
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
      const response = await fetch("/workflows/mockup/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) throw new Error("Workflow API returned an error.");

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setError("Could not reach the mockup workflow API. Check whether the frontend reloaded after installation.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-slate-50 p-6 font-sans text-slate-950 md:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex flex-col justify-between gap-4 rounded-3xl border border-violet-100 bg-white/80 p-6 shadow-sm backdrop-blur md:flex-row md:items-center">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-violet-700">
              <Sparkles size={14} /> Plugin Frontend Template
            </div>
            <h1 className="text-3xl font-black tracking-tight text-slate-950">Text Lab Mockup</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              A small template shipped by the plugin. It talks to a co-installed workflow API endpoint and renders the response in a dashboard-style view.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-mono text-slate-500">
            /workflows/mockup/api/analyze
          </div>
        </header>

        <main className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-5 py-4">
              <h2 className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-700">
                <Send size={16} /> Input Text
              </h2>
              <button
                onClick={() => {
                  setText("");
                  setResult(null);
                }}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-white hover:text-rose-500"
                title="Clear"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <textarea
              value={text}
              onChange={(event) => setText(event.target.value)}
              className="min-h-96 w-full resize-none p-5 text-sm leading-7 text-slate-800 outline-none placeholder:text-slate-400"
              placeholder="Type text to analyze..."
            />

            <div className="border-t border-slate-100 p-4">
              <button
                onClick={analyze}
                disabled={isLoading || !text.trim()}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="animate-spin" size={18} /> : <BarChart3 size={18} />}
                Analyze with Workflow API
              </button>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-black uppercase tracking-wide text-slate-700">Result</h2>

            {error && <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-700">{error}</div>}

            {!error && !result && (
              <div className="flex min-h-96 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-sm text-slate-400">
                Run the analysis to see plugin API output.
              </div>
            )}

            {result && (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <StatCard label="Chars" value={result.characters} />
                  <StatCard label="Words" value={result.words} />
                  <StatCard label="Lines" value={result.lines} />
                </div>

                <div className={`rounded-2xl border p-5 ${sentimentStyles[result.sentiment]}`}>
                  <div className="text-xs font-black uppercase tracking-wider opacity-70">Sentiment</div>
                  <div className="mt-2 text-4xl font-black capitalize tracking-tight">{result.sentiment}</div>
                  <div className="mt-1 text-sm font-bold opacity-80">Score: {result.score}</div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="mb-2 text-xs font-black uppercase tracking-wider text-slate-500">Preview</div>
                  <p className="text-sm leading-6 text-slate-700">{result.preview}</p>
                </div>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
