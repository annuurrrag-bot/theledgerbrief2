export type PortfolioAsset = {
  name: string;
  weight: number;
  symbol: string;
};

export type AssetPerformance = {
  symbol: string;
  name: string;
  weight: number;
  oneMonth: number | null;
  ytd: number | null;
  oneYear: number | null;
};

export type PortfolioPerformance = {
  updatedAt: string;
  assets: AssetPerformance[];
  portfolio: {
    oneMonth: number | null;
    ytd: number | null;
    oneYear: number | null;
  };
};

/*
 * Change the model allocation HERE.
 *
 * The Portfolio page will eventually read these values directly,
 * so you only need to change the percentages in one place.
 *
 * IMPORTANT: weights should add up to 100.
 */
export const MODEL_PORTFOLIO: PortfolioAsset[] = [
  {
    name: "Global Equities",
    weight: 45,
    symbol: "VT",
  },
  {
    name: "Fixed Income",
    weight: 20,
    symbol: "BND",
  },
  {
    name: "Real Assets",
    weight: 17,
    symbol: "VNQ",
  },
  {
    name: "Alternatives",
    weight: 10,
    symbol: "GLD",
  },
  {
    name: "Cash",
    weight: 8,
    symbol: "BIL",
  },
];

type YahooChartResult = {
  timestamp?: number[];
  indicators?: {
    adjclose?: Array<{
      adjclose?: Array<number | null>;
    }>;
    quote?: Array<{
      close?: Array<number | null>;
    }>;
  };
};

async function getHistory(
  symbol: string,
  range: "1mo" | "1y"
): Promise<YahooChartResult | null> {
  try {
    const url =
      `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(
        symbol
      )}` +
      `?range=${range}&interval=1d`;

    const response = await fetch(url, {
      next: {
        revalidate: 3600,
      },
      headers: {
        "User-Agent": "Mozilla/5.0",
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      console.error(
        `Portfolio data returned ${response.status} for ${symbol}`
      );

      return null;
    }

    const data = await response.json();

    const result =
      data?.chart?.result?.[0] ?? null;

    return result;
  } catch (error) {
    console.error(
      `Portfolio history error for ${symbol}:`,
      error
    );

    return null;
  }
}

function calculateReturn(
  result: YahooChartResult | null,
  startTimestamp?: number
): number | null {
  if (!result) return null;

  const timestamps = result.timestamp ?? [];

  const closes =
    result.indicators?.adjclose?.[0]?.adjclose ??
    result.indicators?.quote?.[0]?.close ??
    [];

  const observations = timestamps
    .map((timestamp, index) => {
      return {
        timestamp,
        value: closes[index],
      };
    })
    .filter(
      (
        observation
      ): observation is {
        timestamp: number;
        value: number;
      } =>
        typeof observation.value === "number" &&
        Number.isFinite(observation.value)
    );

  if (observations.length < 2) {
    return null;
  }

  let start = observations[0];

  if (startTimestamp !== undefined) {
    const firstAfterStart =
      observations.find(
        (observation) =>
          observation.timestamp >= startTimestamp
      );

    if (firstAfterStart) {
      start = firstAfterStart;
    }
  }

  const end =
    observations[observations.length - 1];

  if (
    start.value === 0 ||
    !Number.isFinite(start.value) ||
    !Number.isFinite(end.value)
  ) {
    return null;
  }

  return (
    ((end.value - start.value) /
      start.value) *
    100
  );
}

function calculateWeightedReturn(
  assets: AssetPerformance[],
  field: "oneMonth" | "ytd" | "oneYear"
): number | null {
  let weightedReturn = 0;
  let availableWeight = 0;

  for (const asset of assets) {
    const performance = asset[field];

    if (performance === null) {
      continue;
    }

    weightedReturn +=
      performance * (asset.weight / 100);

    availableWeight += asset.weight;
  }

  if (availableWeight === 0) {
    return null;
  }

  /*
   * Re-normalizes the calculation if one data source
   * is temporarily unavailable.
   */
  return (
    weightedReturn /
    (availableWeight / 100)
  );
}

export async function getPortfolioPerformance(): Promise<PortfolioPerformance> {
  const now = new Date();

  const yearStartTimestamp = Math.floor(
    Date.UTC(
      now.getUTCFullYear(),
      0,
      1
    ) / 1000
  );

  const assets = await Promise.all(
    MODEL_PORTFOLIO.map(
      async (asset): Promise<AssetPerformance> => {
        const [monthData, yearData] =
          await Promise.all([
            getHistory(
              asset.symbol,
              "1mo"
            ),
            getHistory(
              asset.symbol,
              "1y"
            ),
          ]);

        return {
          symbol: asset.symbol,
          name: asset.name,
          weight: asset.weight,

          oneMonth:
            calculateReturn(monthData),

          ytd: calculateReturn(
            yearData,
            yearStartTimestamp
          ),

          oneYear:
            calculateReturn(yearData),
        };
      }
    )
  );

  return {
    updatedAt: new Date().toISOString(),

    assets,

    portfolio: {
      oneMonth:
        calculateWeightedReturn(
          assets,
          "oneMonth"
        ),

      ytd:
        calculateWeightedReturn(
          assets,
          "ytd"
        ),

      oneYear:
        calculateWeightedReturn(
          assets,
          "oneYear"
        ),
    },
  };
}
