"use client";

import { useEffect, useMemo, useState } from "react";

const loadMarkdownValue = async (value) => {
  if (typeof value === "string" && value.endsWith(".md")) {
    const response = await fetch(`/api/media/${value}`);
    if (response.ok) return response.text();
  }
  return String(value ?? "");
};

const PluginSentimentBadge = ({ row }) => {
  const [content, setContent] = useState(String(row?.value ?? ""));

  useEffect(() => {
    let active = true;

    loadMarkdownValue(row?.value)
      .then((value) => {
        if (active) setContent(value);
      })
      .catch(() => {
        if (active) setContent("Sentiment unavailable");
      });

    return () => {
      active = false;
    };
  }, [row?.value]);

  const sentiment = useMemo(() => {
    const lower = content.toLowerCase();
    if (lower.includes("positive")) return "positive";
    if (lower.includes("negative")) return "negative";
    return "neutral";
  }, [content]);

  const styles = {
    positive: "border-emerald-200 bg-emerald-50 text-emerald-800",
    negative: "border-rose-200 bg-rose-50 text-rose-800",
    neutral: "border-slate-200 bg-slate-50 text-slate-800",
  };

  const icon = sentiment === "positive" ? "😊" : sentiment === "negative" ? "😕" : "😐";

  return (
    <div className={`inline-flex min-w-64 flex-col rounded-2xl border p-5 shadow-sm ${styles[sentiment]}`}>
      <div className="text-xs font-black uppercase tracking-[0.2em] opacity-70">Mock Sentiment</div>
      <div className="mt-3 flex items-center gap-3">
        <span className="text-4xl" aria-hidden>{icon}</span>
        <span className="text-3xl font-black capitalize tracking-tight">{sentiment}</span>
      </div>
      <pre className="mt-4 whitespace-pre-wrap rounded-xl bg-white/60 p-3 text-xs leading-5 text-slate-700">
        {content.replace(/\*\*/g, "")}
      </pre>
    </div>
  );
};

export default PluginSentimentBadge;
