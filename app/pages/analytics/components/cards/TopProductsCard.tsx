"use client";
import { useState, useEffect } from "react";
import { Loader2, BarChart3 } from "lucide-react";
import AnalyticsCardContainer from "../AnalyticsCardContainer";
import AnalyticsFilterBar from "../AnalyticsFilterBar";
import AnalyticsBarChart from "../AnalyticsBarChart";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const channelColors = {
  iFood: "#EA1D2C",
  Rappi: "#FF6F00",
  "Uber Eats": "#06C167",
  WhatsApp: "#25D366",
  Presencial: "#FACC15",
  "App Próprio": "#3B82F6",
};

type Product = {
  id?: string | number;
  name: string;
  totalSold: number;
  // additional fields from the API can be present but are typed as unknown
  [key: string]: unknown;
};

export default function TopProductsCard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [channel, setChannel] =
    useState<keyof typeof channelColors>("App Próprio");
  const [selectedDay, setSelectedDay] =
    useState<keyof typeof weekdayMap>("thu");
  const [startHour, setStartHour] = useState<number | null>(null);
  const [endHour, setEndHour] = useState<number | null>(null);
  const [open, setOpen] = useState(false);

  const weekdayMap = {
    sun: 0,
    mon: 1,
    tue: 2,
    wed: 3,
    thu: 4,
    fri: 5,
    sat: 6,
  } as const;

  useEffect(() => {
    fetchData();
  }, [channel, selectedDay]);

  async function fetchData() {
    setLoading(true);
    try {
      const weekday = weekdayMap[selectedDay];
      const res = await fetch(
        `/api/analytics/top-products?channel=${channel}&weekday=${weekday}`
      );
      const data = await res.json();
      setProducts(data.slice(0, 10));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <AnalyticsCardContainer
        title="Produtos Mais Vendidos"
        icon={<BarChart3 className="h-5 w-5 text-green-400" />}
        subtitle={`Canal: ${channel}`}
        onClick={() => setOpen(true)}
      >
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin text-green-400 w-6 h-6" />
          </div>
        ) : (
          <AnalyticsBarChart
            data={products}
            dataKey="totalSold"
            labelKey="name"
            color={channelColors[channel] || "#22c55e"}
          />
        )}
      </AnalyticsCardContainer>

      {/* Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-5xl bg-slate-900 border border-slate-800 text-slate-100">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold flex justify-between items-center">
              <span>Produtos Mais Vendidos</span>
              <AnalyticsFilterBar
                channel={channel}
                selectedDay={selectedDay}
                startHour={startHour}
                endHour={endHour}
                channelOptions={Object.keys(channelColors)}
                onChannelChange={(v: string) =>
                  setChannel(v as keyof typeof channelColors)
                }
                onDayChange={(v: string) =>
                  setSelectedDay(v as keyof typeof weekdayMap)
                }
                onStartHourChange={setStartHour}
                onEndHourChange={setEndHour}
                onFilter={fetchData}
              />
            </DialogTitle>
          </DialogHeader>

          <div className="mt-6 h-[380px]">
            {loading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="animate-spin text-green-400 w-6 h-6" />
              </div>
            ) : (
              <AnalyticsBarChart
                data={products}
                dataKey="totalSold"
                labelKey="name"
                color={channelColors[channel] || "#22c55e"}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
