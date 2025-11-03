"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

interface AnalyticsFilterPanelProps {
  stores: { id: number; name: string }[];
  selectedStore: string;
  fromDate: string;
  toDate: string;
  loading: boolean;
  onStoreChange: (v: string) => void;
  onFromChange: (v: string) => void;
  onToChange: (v: string) => void;
  onFilter: () => void;
}

export default function AnalyticsFilterPanel({
  stores,
  selectedStore,
  fromDate,
  toDate,
  loading,
  onStoreChange,
  onFromChange,
  onToChange,
  onFilter,
}: AnalyticsFilterPanelProps) {
  return (
    <div className="grid grid-cols-[160px_1fr_1fr_120px] gap-4 mt-4 items-end">
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Select onValueChange={onStoreChange} value={selectedStore}>
              <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-200 truncate w-full md:w-[160px]">
                <SelectValue placeholder="Loja" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 text-slate-200 max-h-[300px]">
                {stores.map((store) => (
                  <SelectItem
                    key={store.id}
                    value={String(store.id)}
                    className="truncate text-ellipsis whitespace-nowrap"
                  >
                    {store.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </TooltipTrigger>
          {selectedStore && (
            <TooltipContent className="bg-slate-800 text-slate-100 border border-slate-700 text-sm px-3 py-1 rounded-md shadow-lg">
              {stores.find((s) => String(s.id) === selectedStore)?.name}
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>

      <Input
        type="date"
        value={fromDate}
        onChange={(e) => onFromChange(e.target.value)}
        className="bg-slate-800 border-slate-700 text-slate-200"
      />
      <Input
        type="date"
        value={toDate}
        onChange={(e) => onToChange(e.target.value)}
        className="bg-slate-800 border-slate-700 text-slate-200"
      />

      <Button
        onClick={onFilter}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white"
      >
        {loading ? <Loader2 className="animate-spin w-4 h-4" /> : "Filtrar"}
      </Button>
    </div>
  );
}
