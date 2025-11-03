"use client";
import { useState, useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AnalyticsCardContainer from "../AnalyticsCardContainer";
import AnalyticsFilterPanel from "../AnalyticsFilterPanel";
import LowMarginList from "../LowMarginList";

export default function LowMarginCard() {
  const [products, setProducts] = useState<any[]>([]);
  const [stores, setStores] = useState<any[]>([]);
  const [selectedStore, setSelectedStore] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  async function fetchLowSales() {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedStore) params.set("store", selectedStore);
      if (fromDate && toDate) {
        params.set("from", fromDate);
        params.set("to", toDate);
      }

      const res = await fetch(
        `/api/analytics/low-margin-products?limit=10&${params}`
      );
      if (!res.ok) throw new Error(`Erro HTTP ${res.status}`);
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("Erro ao buscar produtos");
    } finally {
      setLoading(false);
    }
  }

  async function fetchStores() {
    const res = await fetch("/api/stores");
    const data = await res.json();
    setStores(data);
  }

  useEffect(() => {
    fetchStores();
    fetchLowSales();
  }, []);

  return (
    <>
      <AnalyticsCardContainer
        title="Produtos com Menores Saídas"
        icon={<AlertTriangle className="h-5 w-5 text-yellow-400" />}
        onClick={() => setOpen(true)}
      >
        <LowMarginList products={products} loading={loading} error={error} />
      </AnalyticsCardContainer>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-5xl bg-slate-900 border border-slate-800 text-slate-100">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Produtos com Menores Saídas
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
            onFilter={fetchLowSales}
          />

          <div className="mt-6">
            <LowMarginList
              products={products}
              loading={loading}
              error={error}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
