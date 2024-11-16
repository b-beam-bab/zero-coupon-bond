import { Bond } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import Link from "next/link";

export const BondCard = ({ bond }: { bond: Bond & { amount: number } }) => {
  return (
    <Card key={bond.id} className="w-[300px] shrink-0">
      <CardHeader>
        <CardTitle>{bond.amount} ETH</CardTitle>
        <CardDescription>Bond #{bond.id}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2">
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Current Price</span>
          <span className="font-medium">{bond.price} ETH</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Maturity Date</span>
          <span className="font-medium">
            {new Date(bond.maturityDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Fixed APY</span>
          <span className="font-medium">{bond.fixedAPY}%</span>
        </div>
      </CardContent>
      <CardFooter>
        <Link href={`/market/${bond.maturityDate}`}>
          <Button variant="outline" className="w-full">
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};