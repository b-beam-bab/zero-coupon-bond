"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Table, TableBody } from "@/components/ui/table";
import { BondTableHeader, BondTableRow } from "@/components/table/bond-table";
import { useAvailableBonds } from "@/lib/hooks/use-available-bonds";

type SortField = "maturity" | "liquidity" | "currentPrice";
type SortOrder = "asc" | "desc";

export default function MarketPage() {
  const [sortField, setSortField] = useState<SortField>("maturity");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  const { bonds, isPending } = useAvailableBonds();

  const sortedBonds = [...bonds].sort((a, b) => {
    if (sortField === "maturity") {
      return sortOrder === "asc"
        ? a.maturity - b.maturity
        : b.maturity - a.maturity;
    } else if (sortField === "liquidity") {
      return sortOrder === "asc"
        ? Number(a.totalSupply) - Number(b.totalSupply)
        : Number(b.totalSupply) - Number(a.totalSupply);
    } else {
      return sortOrder === "asc" ? a.price - b.price : b.price - a.price;
    }
  });

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  return (
    <div className="pt-4">
      <div className="flex items-center justify-center  h-[236px] bg-gradient-to-r from-[#DAC2D8] to-[#F6EAF5]">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Trade Bonds</h1>
          <p className="text-lg text-muted-foreground">
            Explore and delegate to our unified bond liquidity pool.
          </p>
        </div>
      </div>
      <Card className="bg-background">
        <CardHeader>
          <CardTitle className="text-2xl font-bold"></CardTitle>
          <CardDescription className="text-lg text-center text-muted-foreground">
            Each bond represents a standardized zero-coupon bond with equal
            value,
            <br />
            helping to decentralize the delegation process and reduce capital
            centralization among validators.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <BondTableHeader
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
              />
              <TableBody>
                {isPending ? (
                  <p>Loading...</p>
                ) : (
                  sortedBonds.map((bond) => (
                    <BondTableRow key={Math.random()} bond={bond} />
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
