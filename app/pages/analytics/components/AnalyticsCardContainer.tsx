"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface AnalyticsCardContainerProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
  subtitle?: string;
}

export default function AnalyticsCardContainer({
  title,
  icon,
  subtitle,
  children,
  onClick,
}: AnalyticsCardContainerProps) {
  return (
    <Card
      onClick={onClick}
      className={`
        cursor-pointer w-full max-w-[850px] min-h-[260px]
        bg-slate-900/90 border border-slate-800 text-slate-100
        rounded-2xl shadow-lg hover:shadow-2xl hover:scale-[1.01]
        transition-all duration-300 ease-in-out
      `}
    >
      <CardHeader className="flex justify-between items-center pb-2">
        <CardTitle className="text-2xl font-semibold tracking-tight flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
        {subtitle && <span className="text-sm text-slate-400">{subtitle}</span>}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
