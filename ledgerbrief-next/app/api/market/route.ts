import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type MarketQuote = {
  symbol: string;
  name: string;
  value: number | null;
  changePercent: number | null;
};

const MARKETS = [
  {
    symbol: "^GSPC",
    name: "S&P 500",
  },
  {
    symbol: "^IXIC",
    name: "NASDAQ",
  },
  {
    symbol: "^DJI",
    name: "DOW JONES",
  },
  {
    symbol: "GC=F",
    name: "GOLD",
  },
  {
    symbol: "BTC-USD",
    name: "BITCOIN",
  },
  {
    symbol: "CL=F",
    name: "WTI CRUDE",
  },
  {
    symbol: "^TNX",
    name: "10Y YIELD",
  },
  {
    symbol: "DX-Y.NYB",
    name: "US DOLLAR",
  },
];

async function getQuote(symbol: string): Promise<{
  value: number | null;
  changePercent: number | null;
}> {
  try {
    const url =
      `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}` +
      `?range=1d&interval=1m`;

    const response = await fetch(url, {
      cache: "no-store",
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

    const previousClose = meta?.previousClose ?? null;

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

  return NextResponse.json(
    {
      updatedAt: new Date().toISOString(),
      quotes,
    },
    {
      headers: {
        "Cache-Control":
          "no-store, no-cache, must-revalidate, proxy-revalidate",
      },
    }
  );
}
