"use client";

import React, { useState } from "react";
import { ArrowDownUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAccount, useBalance } from "wagmi";
import { ConnectWallet, Wallet } from "@coinbase/onchainkit/wallet";
import Image from "next/image";
import { Bond } from "@/lib/types";
import { formatDateToYYYYMMDD } from "@/lib/utils";
import { formatEther } from "viem";

type SwapUIProps = {
  bond: Bond;
};

export function SwapUI({ bond }: SwapUIProps) {
  const { address, isConnected } = useAccount();

  const { data: balance, isPending } = useBalance({
    address,
  });

  const [sellAmount, setSellAmount] = useState("");
  const [buyAmount, setBuyAmount] = useState("");
  const [isSelling, setIsSelling] = useState(true);

  const bondName = `${bond.name}_${formatDateToYYYYMMDD(bond.maturity)}`;

  const handleSwap = () => {
    // Implement actual swap logic here
    console.log("Swap executed");
  };

  const handleFlipCurrencies = () => {
    setIsSelling(!isSelling);
    setSellAmount("");
    setBuyAmount("");
  };

  const handleSellAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amount = e.target.value;
    setSellAmount(amount);
    setBuyAmount((parseFloat(amount) / bond.price).toFixed(6));
  };

  const handleBuyAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amount = e.target.value;
    setBuyAmount(amount);
    setSellAmount((parseFloat(amount) * bond.price).toFixed(6));
  };

  const isSwapDisabled = !isConnected || !sellAmount || !buyAmount;

  return (
    <Card className="w-full max-w-md bg-slate-900 text-white">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Swap</CardTitle>
        <CardDescription className="text-slate-400">
          Trade {bondName}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm">{isSelling ? "Buy Bond" : "Sell Bond"}</p>
        <div className="rounded-lg bg-slate-800 p-4">
          <div className="flex items-center justify-between">
            <Input
              type="number"
              value={isSelling ? sellAmount : buyAmount}
              onChange={
                isSelling ? handleSellAmountChange : handleBuyAmountChange
              }
              placeholder="0.0"
              className="w-2/3 bg-transparent text-2xl font-bold text-white border-none focus:outline-none focus:ring-0"
            />
            <div className="flex items-center space-x-2">
              {!isSelling ? (
                <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center">
                  <span className="font-bold text-sm">B</span>
                </div>
              ) : (
                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                  <Image
                    alt="ETH"
                    width={24}
                    height={24}
                    src="https://dynamic-assets.coinbase.com/dbb4b4983bde81309ddab83eb598358eb44375b930b94687ebe38bc22e52c3b2125258ffb8477a5ef22e33d6bd72e32a506c391caa13af64c00e46613c3e5806/asset_icons/4113b082d21cc5fab17fc8f2d19fb996165bcce635e6900f7fc2d57c4ef33ae9.png"
                  />
                </div>
              )}

              <span className="font-semibold">
                {isSelling ? "ETH" : bondName}
              </span>
            </div>
          </div>
          <div className="mt-2 flex justify-between text-sm text-slate-400">
            <span>
              Balance: {isPending ? "Loading..." : formatEther(balance!.value)}
            </span>
            <Button
              variant="link"
              className="p-0 h-auto text-blue-400 hover:text-blue-300"
              onClick={() => {
                setSellAmount(formatEther(balance!.value));
                setBuyAmount(
                  (
                    parseFloat(formatEther(balance!.value)) / bond.price
                  ).toFixed(6)
                );
              }}
            >
              Max
            </Button>
          </div>
        </div>

        <div className="flex justify-center">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-slate-700 hover:bg-slate-600"
            onClick={handleFlipCurrencies}
          >
            <ArrowDownUp className="h-4 w-4" />
          </Button>
        </div>

        <div className="rounded-lg bg-slate-800 p-4">
          <div className="flex items-center justify-between">
            <Input
              type="number"
              value={isSelling ? buyAmount : sellAmount}
              onChange={
                isSelling ? handleBuyAmountChange : handleSellAmountChange
              }
              placeholder="0.0"
              className="w-2/3 bg-transparent text-2xl font-bold text-white border-none focus:outline-none focus:ring-0"
            />
            <div className="flex items-center space-x-2">
              {isSelling ? (
                <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center">
                  <span className="font-bold text-sm">B</span>
                </div>
              ) : (
                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                  <Image
                    alt="ETH"
                    width={24}
                    height={24}
                    src="https://dynamic-assets.coinbase.com/dbb4b4983bde81309ddab83eb598358eb44375b930b94687ebe38bc22e52c3b2125258ffb8477a5ef22e33d6bd72e32a506c391caa13af64c00e46613c3e5806/asset_icons/4113b082d21cc5fab17fc8f2d19fb996165bcce635e6900f7fc2d57c4ef33ae9.png"
                  />
                </div>
              )}
              <span className="font-semibold">
                {isSelling ? bondName : "ETH"}
              </span>
            </div>
          </div>
        </div>

        {isConnected ? (
          <Button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors"
            onClick={handleSwap}
            disabled={isSwapDisabled}
          >
            {isSwapDisabled ? "Enter an amount" : "Swap"}
          </Button>
        ) : (
          <Wallet className="w-full">
            <ConnectWallet
              className="w-full"
              withWalletAggregator
            ></ConnectWallet>
          </Wallet>
        )}
      </CardContent>
    </Card>
  );
}