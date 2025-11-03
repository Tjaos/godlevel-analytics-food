"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AnalyticsFilterBarProps {
  channel: string;
  selectedDay: string;
  startHour: number | null;
  endHour: number | null;
  channelOptions: string[];
  onChannelChange: (v: string) => void;
  onDayChange: (v: string) => void;
  onStartHourChange: (v: number | null) => void;
  onEndHourChange: (v: number | null) => void;
  onFilter: () => void;
}

export default function AnalyticsFilterBar({
  channel,
  selectedDay,
  startHour,
  endHour,
  channelOptions,
  onChannelChange,
  onDayChange,
  onStartHourChange,
  onEndHourChange,
  onFilter,
}: AnalyticsFilterBarProps) {
  return (
    <div className="flex flex-wrap gap-3 justify-end">
      {/* CANAL */}
      <Select value={channel} onValueChange={onChannelChange}>
        <SelectTrigger className="w-[120px] bg-slate-800 border-slate-700 text-slate-100">
          <SelectValue placeholder="Canal" />
        </SelectTrigger>
        <SelectContent className="bg-slate-800 text-slate-100">
          {channelOptions.map((c) => (
            <SelectItem key={c} value={c}>
              {c}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* DIA */}
      <Select value={selectedDay} onValueChange={onDayChange}>
        <SelectTrigger className="w-[120px] bg-slate-800 border-slate-700 text-slate-100">
          <SelectValue placeholder="Dia" />
        </SelectTrigger>
        <SelectContent className="bg-slate-800 text-slate-100">
          <SelectItem value="mon">Segunda</SelectItem>
          <SelectItem value="tue">Terça</SelectItem>
          <SelectItem value="wed">Quarta</SelectItem>
          <SelectItem value="thu">Quinta</SelectItem>
          <SelectItem value="fri">Sexta</SelectItem>
          <SelectItem value="sat">Sábado</SelectItem>
          <SelectItem value="sun">Domingo</SelectItem>
        </SelectContent>
      </Select>

      {/* HORAS */}
      {[
        { label: "Início", value: startHour, onChange: onStartHourChange },
        { label: "Fim", value: endHour, onChange: onEndHourChange },
      ].map((h, idx) => (
        <Select
          key={idx}
          value={h.value !== null ? String(h.value) : "all"}
          onValueChange={(v) => h.onChange(v === "all" ? null : Number(v))}
        >
          <SelectTrigger className="w-[100px] bg-slate-800 border-slate-700 text-slate-100">
            <SelectValue placeholder={h.label} />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 text-slate-100 max-h-[250px] overflow-y-auto">
            <SelectItem value="all">Todo dia</SelectItem>
            {Array.from({ length: 24 }, (_, i) => (
              <SelectItem key={i} value={String(i)}>
                {i}h
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ))}

      <button
        onClick={onFilter}
        className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg text-sm font-semibold"
      >
        Filtrar
      </button>
    </div>
  );
}
