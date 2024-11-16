"use client";

import * as React from "react";
import { ChevronRight, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Bond, TransactionState } from "@/lib/types";
import { ErrorIcon, SuccessIcon } from "../svg";
import { useAvailableBonds } from "@/lib/hooks/use-available-bonds";
import { useAccount } from "wagmi";
import { useDepositAmount } from "@/lib/hooks/use-deposit-amount";
import { useBondBalance } from "@/lib/hooks/use-bond-balance";
import { formatEther } from "viem";

export function IssueBondDialog() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [step, setStep] = React.useState(1);
  const [selectedBond, setSelectedBond] = React.useState<Bond | null>(null);
  const [amount, setAmount] = React.useState(0);
  const [txState, setTxState] = React.useState<TransactionState>("idle");
  const [error, setError] = React.useState("");

  const { address } = useAccount();
  const { balance: depositInGwei } = useDepositAmount(address);
  const { balance: bondBalanceInGwei } = useBondBalance(address);

  const totalGwei = depositInGwei - (bondBalanceInGwei ?? BigInt(0));
  const availableDeposit = Number(formatEther(totalGwei));

  const { bonds }: { bonds: Bond[] } = useAvailableBonds();
  const sortedBonds = [...bonds].sort((a, b) => a.maturity - b.maturity);

  const resetDialog = () => {
    setStep(1);
    setSelectedBond(null);
    setAmount(0);
    setTxState("idle");
    setError("");
  };

  const handleClose = () => {
    setIsOpen(false);
    resetDialog();
  };

  const processTransaction = async () => {
    setTxState("loading");
    try {
      // Simulate API call
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (Math.random() > 0.2) {
            resolve(true);
          } else {
            reject(new Error("Transaction failed"));
          }
        }, 2000);
      });
      setTxState("success");
      // Reset after success
      setTimeout(handleClose, 2000);
    } catch (err) {
      setTxState("error");
      setError(err instanceof Error ? err.message : "Transaction failed");
    }
  };

  const renderContent = () => {
    if (txState === "loading") {
      return (
        <div className="flex flex-col items-center justify-center space-y-4 py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-center">Issuing Bond for {amount} ETH...</p>
        </div>
      );
    }

    if (txState === "success") {
      return (
        <div className="flex flex-col items-center justify-center space-y-4 py-8">
          <div className="rounded-full bg-primary/10 p-3">
            <div className="rounded-full bg-primary/20 p-2">
              <SuccessIcon />
            </div>
          </div>
          <p className="text-center">
            Successfully issued bond for {amount} ETH
          </p>
        </div>
      );
    }

    if (txState === "error") {
      return (
        <div className="flex flex-col items-center justify-center space-y-4 py-8">
          <div className="rounded-full bg-destructive/10 p-3">
            <ErrorIcon />
          </div>
          <p className="text-center text-destructive">{error}</p>
          <Button variant="outline" onClick={() => setTxState("idle")}>
            Try Again
          </Button>
        </div>
      );
    }

    if (step === 1) {
      return (
        <div className="space-y-4 py-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Maturity Date</TableHead>
                <TableHead>Liquidity</TableHead>
                <TableHead>Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedBonds.map((bond) => (
                <TableRow
                  key={bond.maturity}
                  className={`cursor-pointer hover:bg-accent/50 ${
                    selectedBond?.maturity === bond.maturity ? "bg-accent" : ""
                  }`}
                  onClick={() => setSelectedBond(bond)}
                >
                  <TableCell>
                    {new Date(bond.maturity).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell>{bond.totalSupply} ETH</TableCell>
                  <TableCell>{bond.price} ETH</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex justify-end">
            <Button onClick={() => setStep(2)} disabled={!selectedBond}>
              Proceed
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      );
    }

    const maxAmount = availableDeposit * selectedBond!.marginRatio;

    return (
      <div className="space-y-6 py-4">
        <div className="rounded-lg border p-4">
          <div className="grid gap-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">
                Maturity Date
              </span>
              <span className="font-medium">
                {new Date(selectedBond!.maturity).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Price</span>
              <span className="font-medium">{selectedBond!.price} ETH</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-sm font-medium">Amount</span>
            <span className="text-sm text-muted-foreground">
              {amount.toFixed(4)} ETH
            </span>
          </div>
          <Slider
            value={[amount]}
            onValueChange={([value]) => setAmount(value)}
            max={maxAmount}
            step={0.0001}
            className="py-4"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0 ETH</span>
            <span>Max: {maxAmount.toFixed(2)} ETH</span>
          </div>
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={() => setStep(1)}>
            Back
          </Button>
          <Button onClick={processTransaction} disabled={amount === 0}>
            Issue Bond
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full" disabled={availableDeposit === 0}>
          Issue New Bond
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {txState === "idle"
              ? step === 1
                ? "Select Bond Maturity"
                : "Issue Bond"
              : "Issue Bond"}
          </DialogTitle>
          <DialogDescription>
            {txState === "idle" && step === 1
              ? "Choose the maturity date for your new bond."
              : "Specify the amount of ETH to bond."}
          </DialogDescription>
        </DialogHeader>
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
}
