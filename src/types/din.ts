export type OracleSource = "pyth" | "orakl" | "witnet" | "oo-lite";

export type RoundStatus = "upcoming" | "on_sale" | "sale_ended" | "settled";

export type Tranche = {
  id: string;
  productId: string;
  asset: string; // "BTC", "ETH", ...
  trigger: { type: "percent_drop"; value: number }; // e.g., -10
  maturity: string; // ISO timestamp
  premium: number; // %
  caps: { total: number; minPerUser: number; maxPerUser: number };
  pool: { tvl: number; remainingCapacity: number; nav: number };
  oracle: { primary: OracleSource; fallbacks: OracleSource[]; rule: "median" | "weighted" };
  status: RoundStatus;
};

export type Position = {
  id: string;
  type: "buy" | "sell";
  trancheId: string;
  amount: number; // USDT
  filled: number; // 0~1
  avgPremium: number;
  txHash?: string;
  state: "active" | "matured_paid" | "expired" | "refunded";
};

export type Tab = "catalog" | "product" | "buy" | "sell" | "portfolio" | "settlement" | "admin";
