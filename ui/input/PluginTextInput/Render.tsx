"use client";

import { useEffect, useState } from "react";

const formatHandle = (value?: string) => {
  if (!value) return "";
  return value.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
};

const PluginTextInput = ({ row, updateRow }) => {
  const [value, setValue] = useState(row?.value ?? "");
  const multiline = row?.config?.multiline ?? false;
  const title = formatHandle(row?.handle_name) || row?.name;

  useEffect(() => {
    setValue(row?.value ?? "");
  }, [row?.value]);

  const update = (nextValue: string) => {
    setValue(nextValue);
    updateRow({ ...row, value: nextValue });
  };

  const stopPropagation = (event) => {
    event.stopPropagation();
  };

  const sharedClassName =
    "nodrag nopan nowheel w-full rounded-xl border border-violet-200 bg-white/90 px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10";

  return (
    <div className="nodrag nopan space-y-2 rounded-2xl border border-violet-100 bg-violet-50/50 p-3">
      <div>
        {title && <h3 className="text-sm font-bold text-violet-950">{title}</h3>}
        {row?.config?.description && (
          <p className="mt-1 text-xs leading-5 text-violet-700/80">{row.config.description}</p>
        )}
      </div>

      {multiline ? (
        <textarea
          className={`${sharedClassName} min-h-28 resize-y`}
          value={value}
          placeholder={row?.config?.placeholder || "Enter text..."}
          onChange={(event) => update(event.target.value)}
          onKeyDown={stopPropagation}
          onWheel={stopPropagation}
        />
      ) : (
        <input
          className={sharedClassName}
          type="text"
          value={value}
          placeholder={row?.config?.placeholder || "Enter text..."}
          onChange={(event) => update(event.target.value)}
          onKeyDown={stopPropagation}
          onWheel={stopPropagation}
        />
      )}
    </div>
  );
};

export default PluginTextInput;
