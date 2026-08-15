export type EquityQuote = {
  symbol: string;
  name: string;
  value: number | null;
  changePercent: number | null;
};

export type SectorSnapshot = {
  name: string;
  symbol: string;
  description: string;
  changePercent: number | null;
};

export type EquitiesSnapshot = {
  updatedAt: string;
  sectors: SectorSnapshot[];
  heatmap: EquityQuote[];
};

const SECTORS = [
  {
    symbol: "XLK",
    name: "Technology",
    description:
      "Semiconductor capex, AI infrastructure spend, and platform margins.",
  },
  {
    symbol: "XLV",
    name: "Healthcare",
    description:
      "Drug pricing policy, biotech M&A, and payer economics.",
  },
  {
    symbol: "XLF",
    name: "Financials",
    description:
      "Net interest margins, credit quality, and capital markets activity.",
  },
  {
    symbol: "XLE",
    name: "Energy",
    description:
      "Capex discipline, supply decisions, and refining margins.",
  },
  {
    symbol: "XLI",
    name: "Industrials",
    description:
      "Reshoring capex, defense budgets, and supply chain realignment.",
  },
  {
    symbol: "XLY",
    name: "Consumer",
    description:
      "Discretionary spend, consumer demand, and pricing power.",
  },
  {
    symbol: "XLRE",
    name: "Real Estate",
    description:
      "Cap rates, refinancing conditions, and property fundamentals.",
  },
  {
    symbol: "XLU",
    name: "Utilities",
    description:
      "Grid investment, data-center power demand, and regulated returns.",
  },
];

const HEATMAP = [
  { symbol: "NVDA", name: "NVIDIA" },
  { symbol: "MSFT", name: "Microsoft" },
  { symbol: "AAPL", name: "Apple" },
  { symbol: "AMZN", name: "Amazon" },

  { symbol: "JPM", name: "JPMorgan" },
  { symbol: "BAC", name: "Bank of America" },
  { symbol: "XOM", name: "Exxon Mobil" },
  { symbol: "CVX", name: "Chevron" },

  { symbol: "LLY", name: "Eli Lilly" },
  { symbol: "JNJ", name: "Johnson & Johnson" },
  { symbol: "CAT", name: "Caterpillar" },
  { symbol: "GE", name: "GE Aerospace" },

  { symbol: "PLD", name: "Prologis" },
  { symbol: "AMT", name: "American Tower" },
  { symbol: "NEE", name: "NextEra Energy" },
  { symbol: "DUK", name: "Duke Energy" },
];

async function getQuote(
  symbol: string
): Promise<{
  value: number | null;
  changePercent: number | null;
}> {
  try {
    const url =
      `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(
        symbol
      )}?range=1d&interval=1m`;

    const response = await fetch(url, {
      next: {
        revalidate: 300,
      },
      headers: {
        "User-Agent": "Mozilla/5.0",
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      console.error(
        `Equities data returned ${response.status} for ${symbol}`
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
    console.error(
      `Equities quote error for ${symbol}:`,
      error
    );

    return {
      value: null,
      changePercent: null,
    };
  }
}

export async function getEquitiesSnapshot(): Promise<EquitiesSnapshot> {
  const [sectorResults, heatmapResults] =
    await Promise.all([
      Promise.all(
        SECTORS.map(async (sector) => {
          const quote = await getQuote(
            sector.symbol
          );

          return {
            ...sector,
            changePercent:
              quote.changePercent,
          };
        })
      ),

      Promise.all(
        HEATMAP.map(async (company) => {
          const quote = await getQuote(
            company.symbol
          );

          return {
            ...company,
            value: quote.value,
            changePercent:
              quote.changePercent,
          };
        })
      ),
    ]);

  return {
    updatedAt: new Date().toISOString(),
    sectors: sectorResults,
    heatmap: heatmapResults,
  };
}
