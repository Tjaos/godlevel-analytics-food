"use client";

import { TooltipProps } from "recharts";

export default function DarkTooltip(
  props: TooltipProps<number, string> & {
    payload?: Array<{
      payload?: { label?: string; name?: string; [key: string]: unknown };
      name?: string;
      value?: number | string | null;
    }>;
  }
) {
  const { active, payload } = props;
  if (!active || !payload || payload.length === 0) return null;

  // Tenta extrair um label útil a partir do payload quando a prop `label` não existe no tipo
  const labelValue =
    payload[0]?.payload?.label ??
    payload[0]?.payload?.name ??
    payload[0]?.name ??
    undefined;

  return (
    <div className="bg-slate-900/95 border border-slate-700 rounded-xl shadow-lg p-3 text-slate-100">
      {/* Label (ex: nome do produto ou dia) */}
      {labelValue && (
        <p className="text-sm font-semibold text-yellow-400 mb-1">
          {labelValue}
        </p>
      )}

      {/* Valores */}
      {payload.map((entry, index) => (
        <p
          key={`tooltip-${index}`}
          className="text-sm flex justify-between gap-3"
        >
          <span className="text-slate-300">{entry.name}</span>
          <span className="font-medium text-green-400">
            {typeof entry.value === "number"
              ? `R$ ${entry.value.toFixed(2)}`
              : entry.value}
          </span>
        </p>
      ))}
    </div>
  );
}
