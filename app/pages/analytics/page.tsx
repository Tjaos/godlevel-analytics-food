import TopProductsCard from "./components/cards/TopProductsCard";
import AvgTicketCard from "./components/cards/AvgTicketCard";
import LowMarginCard from "./components/cards/LowMarginCard";
import DeliveryTimesCard from "./components/cards/DeliveryTimesCard";
import ChurnClientsCard from "./components/cards/ChurnClientsCard";

export default function AnalyticsPage() {
  return (
    <main
      className="
        min-h-screen 
        w-full 
        flex 
        flex-col 
        items-center 
        justify-center 
        bg-slate-950 
        text-white 
        px-6 
        py-16
      "
    >
      {/* Título centralizado */}
      <h1
        className="
          text-4xl 
          md:text-5xl 
          font-bold 
          text-center 
          text-slate-100 
          mb-16 
          tracking-tight
        "
      >
        📊 Análise dos dados
      </h1>

      {/* Wrapper para centralização do grid */}
      <div className="flex justify-center w-full">
        <div
          className="
            grid 
            grid-cols-1 
            md:grid-cols-2 
            xl:grid-cols-3 
            gap-10 
            w-full 
            max-w-[1400px] 
            justify-items-center
          "
        >
          <TopProductsCard />
          <AvgTicketCard />
          <LowMarginCard />
          <DeliveryTimesCard />
          <ChurnClientsCard />
        </div>
      </div>
    </main>
  );
}
