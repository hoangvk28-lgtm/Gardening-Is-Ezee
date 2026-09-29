"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

interface Props {
  placeholder?: string;
}

export function HeroSearch({ placeholder = "Search products, guides, categories…" }: Props) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (q) {
      router.push(`/compare?q=${encodeURIComponent(q)}`);
    } else {
      router.push("/compare");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-3 px-4 py-3 rounded-xl max-w-md transition-all cursor-text"
      style={{
        background: focused ? "rgba(255,255,255,0.16)" : "rgba(255,255,255,0.10)",
        border: focused
          ? "1px solid rgba(255,255,255,0.55)"
          : "1px solid rgba(255,255,255,0.22)",
        backdropFilter: "blur(8px)",
      }}
      onClick={() => inputRef.current?.focus()}
    >
      <svg
        className="w-4 h-4 shrink-0 transition-colors"
        style={{ color: focused ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.55)" }}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607z" />
      </svg>

      <input
        ref={inputRef}
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        className="flex-1 bg-transparent border-0 outline-none text-sm min-w-0"
        style={{ color: "rgba(255,255,255,0.92)", caretColor: "#93c5fd" }}
        autoComplete="off"
        spellCheck={false}
        aria-label="Search products and guides"
      />

      {query && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); setQuery(""); inputRef.current?.focus(); }}
          className="shrink-0 text-white/50 hover:text-white/80 transition-colors"
          aria-label="Clear search"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      )}

      <button
        type="submit"
        className="shrink-0 text-xs font-semibold px-2.5 py-1 rounded-lg transition-all"
        style={{
          background: query ? "rgba(59,130,246,0.8)" : "rgba(255,255,255,0.15)",
          color: "rgba(255,255,255,0.75)",
        }}
        aria-label="Search"
      >
        {query ? "Go →" : "Browse →"}
      </button>
    </form>
  );
}
