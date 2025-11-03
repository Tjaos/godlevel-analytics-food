"use client";
import { useState } from "react";

export function useDetailModal<T = unknown>() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function fetchAndOpen(url: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setData(json);
      setOpen(true);
    } catch (err) {
      console.error("fetchAndOpen error", err);
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }

  function close() {
    setOpen(false);
    // opcional: setData(null)
  }

  return { open, loading, data, error, fetchAndOpen, close, setData, setError };
}
