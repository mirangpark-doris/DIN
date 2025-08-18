import { Tranche } from '../types/din';

// --------------- Mock Data -----------------
const now = new Date();
const daysFromNow = (d: number) => new Date(now.getTime() + d * 86400 * 1000).toISOString();

export const MOCK_TRANCHES: Tranche[] = [
  {
    id: "t-btc-10",
    productId: "p-btc",
    asset: "BTC",
    trigger: { type: "percent_drop", value: -10 },
    maturity: daysFromNow(14),
    premium: 4.2,
    caps: { total: 500000, minPerUser: 100, maxPerUser: 20000 },
    pool: { tvl: 220000, remainingCapacity: 280000, nav: 1.0 },
    oracle: { primary: "pyth", fallbacks: ["witnet", "oo-lite"], rule: "median" },
    status: "on_sale",
  },
  {
    id: "t-btc-15",
    productId: "p-btc",
    asset: "BTC",
    trigger: { type: "percent_drop", value: -15 },
    maturity: daysFromNow(21),
    premium: 6.8,
    caps: { total: 400000, minPerUser: 100, maxPerUser: 15000 },
    pool: { tvl: 110000, remainingCapacity: 290000, nav: 1.0 },
    oracle: { primary: "pyth", fallbacks: ["orakl"], rule: "median" },
    status: "on_sale",
  },
  {
    id: "t-eth-20",
    productId: "p-eth",
    asset: "ETH",
    trigger: { type: "percent_drop", value: -20 },
    maturity: daysFromNow(30),
    premium: 9.1,
    caps: { total: 300000, minPerUser: 50, maxPerUser: 10000 },
    pool: { tvl: 120000, remainingCapacity: 180000, nav: 1.0 },
    oracle: { primary: "orakl", fallbacks: ["witnet"], rule: "median" },
    status: "on_sale",
  },
];

// --------------- Utilities -----------------
export function formatUSD(n: number) {
  return n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 2 });
}

export function formatPct(n: number) {
  return `${n.toFixed(2)}%`;
}

export function timeLeft(targetISO: string) {
  const t = new Date(targetISO).getTime();
  const d = Math.max(0, t - Date.now());
  const days = Math.floor(d / 86400000);
  const hours = Math.floor((d % 86400000) / 3600000);
  const minutes = Math.floor((d % 3600000) / 60000);
  const seconds = Math.floor((d % 60000) / 1000);
  return { days, hours, minutes, seconds };
}

// --------------- Mock Services -----------------
export const MockAPI = {
  async listTranches() {
    await sleep(200);
    return MOCK_TRANCHES;
  },
  async getTranche(id: string) {
    await sleep(150);
    return MOCK_TRANCHES.find(t => t.id === id)!;
  },
  async quoteBuy(trancheId: string, amount: number) {
    await sleep(120);
    const t = MOCK_TRANCHES.find(x => x.id === trancheId)!;
    const premium = (amount * t.premium) / 100;
    return { premium, total: amount + premium };
  },
  async quoteSell(trancheId: string, collateral: number) {
    await sleep(120);
    const t = MOCK_TRANCHES.find(x => x.id === trancheId)!;
    const premiumEarn = (collateral * t.premium) / 100;
    return { premiumEarn };
  },
  async buy(trancheId: string, amount: number) {
    await sleep(500);
    return { txHash: makeTxHash(), positionId: `pos-${Math.random().toString(36).slice(2)}` };
  },
  async sell(trancheId: string, collateral: number) {
    await sleep(500);
    return { txHash: makeTxHash(), positionId: `pos-${Math.random().toString(36).slice(2)}` };
  },
};

function sleep(ms: number) { return new Promise(res => setTimeout(res, ms)); }
function makeTxHash() { return `0x${Array.from({length:64},()=>Math.floor(Math.random()*16).toString(16)).join("")}`; }
