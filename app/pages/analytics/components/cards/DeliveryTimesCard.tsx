"use client";
import { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AnalyticsCardContainer from "../AnalyticsCardContainer";
import AnalyticsFilterPanel from "../AnalyticsFilterPanel";
import DeliveryList from "../DeliveryList";

interface DeliveryData {
  day: number;
  hour?: number;
  avgTime: number;
}
interface Store {
  id: number;
  name: string;
}

const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export default function DeliveryTimesCard() {
  const [data, setData] = useState<DeliveryData[]>([]);
  const [modalData, setModalData] = useState<DeliveryData[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [selectedStore, setSelectedStore] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  async function fetchSummary() {
    try {
      setLoading(true);
      const res = await fetch("/api/analytics/delivery-times?mode=summary", {
        cache: "no-store",
      });
      const result = await res.json();
      setData(Array.isArray(result) ? result : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchDetailed() {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedStore) params.set("store", selectedStore);
      if (fromDate && toDate) {
        params.set("from", fromDate);
        params.set("to", toDate);
      }
      const res = await fetch(`/api/analytics/delivery-times?${params}`, {
        cache: "no-store",
      });
      const result = await res.json();
      setModalData(Array.isArray(result) ? result : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchStores() {
    try {
      const res = await fetch("/api/stores", { cache: "no-store" });
      const data = await res.json();
      setStores(data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchSummary();
    fetchStores();
  }, []);

  return (
    <>
      <AnalyticsCardContainer
        title="Tempo Médio de Entrega"
        icon={<Clock className="w-5 h-5 text-blue-400" />}
        subtitle="Clique para detalhes"
        onClick={() => setOpen(true)}
      >
        <DeliveryList data={data} loading={loading} days={days} />
      </AnalyticsCardContainer>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-5xl bg-slate-900 border border-slate-800 text-slate-100">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Tempo Médio de Entrega Detalhado
            </DialogTitle>
          </DialogHeader>

          <AnalyticsFilterPanel
            stores={stores}
            selectedStore={selectedStore}
            fromDate={fromDate}
            toDate={toDate}
            loading={loading}
            onStoreChange={setSelectedStore}
            onFromChange={setFromDate}
            onToChange={setToDate}
            onFilter={fetchDetailed}
          />

          <div className="mt-6">
            <DeliveryList
              data={modalData}
              loading={loading}
              days={days}
              detailed
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
