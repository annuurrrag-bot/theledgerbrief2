import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 300;

type MarketQuote = {
  symbol: string;
  name: string;
  value: number | null;
  changePercent: number | null;
};

const MARKETS = [
  { symbol: "^GSPC", name: "S&P 500" },
  { symbol: "^IXIC", name: "NASDAQ COMPOSITE" },
  { symbol: "^DJI", name: "DOW JONES" },
  { symbol: "^RUT", name: "RUSSELL 2000" },

  { symbol: "^FTSE", name: "FTSE 100" },
  { symbol: "^STOXX50E", name: "EURO STOXX 50" },
  { symbol: "^N225", name: "NIKKEI 225" },
  { symbol: "^VIX", name: "CBOE VOLATILITY (VIX)" },

  { symbol: "GC=F", name: "GOLD" },
  { symbol: "CL=F", name: "WTI CRUDE" },
  { symbol: "BZ=F", name: "BRENT CRUDE" },

  { symbol: "BTC-USD", name: "BITCOIN" },
  { symbol: "DX-Y.NYB", name: "US DOLLAR INDEX" },
  { symbol: "EURUSD=X", name: "EUR/USD" },
  { symbol: "JPY=X", name: "USD/JPY" },
];

async function getQuote(symbol: string): Promise<{
  value: number | null;
  changePercent: number | null;
}> {
  try {
    const url =
      `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(
        symbol
      )}?range=1d&interval=1m`;

    const response = await fetch(url, {
      next: { revalidate: 300 },
      headers: {
        "User-Agent": "Mozilla/5.0",
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      console.error(
        `Yahoo Finance returned ${response.status} for ${symbol}`
      );

      return {
        value: null,
        changePercent: null,
      };
    }

    const data = await response.json();
    const result = data?.chart?.result?.[0];

    if (!result) {
      return {
        value: null,
        changePercent: null,
      };
    }

    const meta = result.meta;

    const currentPrice =
      meta?.regularMarketPrice ??
      meta?.currentTradingPeriod?.regular?.close ??
      null;

    const previousClose =
      meta?.chartPreviousClose ??
      meta?.previousClose ??
      null;

    let changePercent: number | null = null;

    if (
      typeof currentPrice === "number" &&
      typeof previousClose === "number" &&
      previousClose !== 0
    ) {
      changePercent =
        ((currentPrice - previousClose) / previousClose) * 100;
    }

    return {
      value:
        typeof currentPrice === "number"
          ? currentPrice
          : null,
      changePercent,
    };
  } catch (error) {
    console.error(`Market data error for ${symbol}:`, error);

    return {
      value: null,
      changePercent: null,
    };
  }
}

export async function GET() {
  const quotes: MarketQuote[] = await Promise.all(
    MARKETS.map(async (market) => {
      const quote = await getQuote(market.symbol);

      return {
        symbol: market.symbol,
        name: market.name,
        value: quote.value,
        changePercent: quote.changePercent,
      };
    })
  );

  return NextResponse.json({
    updatedAt: new Date().toISOString(),
    quotes,
  });
}
