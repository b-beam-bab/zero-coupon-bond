"use client";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { BalanceChartCard } from "@/components/card/balance-chart.card";
import { Suspense } from "react";
import { BondCard } from "@/components/card/bond-card";
import { MOCK_ISSUED_BONDS } from "@/mock/bond";

export default function Investor() {
  return (
    <div className="container mx-auto px-4 py-6 bg-white/90">
      <h1 className="mb-8 text-3xl font-bold">Investor Dashboard</h1>

      {/* Top Section: Chart and Balance */}
      <div className="mb-8 grid gap-4">
        <Suspense>
          <BalanceChartCard />
        </Suspense>
      </div>

      {/* Bonds Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Your Bonds</h2>

        <ScrollArea className="w-full whitespace-nowrap rounded-lg border">
          <div className="flex gap-4 p-4">
            {MOCK_ISSUED_BONDS.map((bond) => (
              <BondCard key={bond.id} bond={bond} />
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  );
}