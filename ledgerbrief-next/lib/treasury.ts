const TREASURY_URL =
  "https://home.treasury.gov/resource-center/data-chart-center/interest-rates/pages/xml";

export type TreasuryCurve = {
  date: string;
  rates: {
    "1M": number | null;
    "3M": number | null;
    "6M": number | null;
    "1Y": number | null;
    "2Y": number | null;
    "5Y": number | null;
    "10Y": number | null;
    "30Y": number | null;
  };
};

function getNumber(value: string | null | undefined): number | null {
  if (!value || value === "N/A") return null;

  const number = Number(value);

  return Number.isFinite(number) ? number : null;
}

export async function getTreasuryCurve(): Promise<TreasuryCurve | null> {
  try {
    const year = new Date().getUTCFullYear();

    const response = await fetch(
      `${TREASURY_URL}?data=daily_treasury_yield_curve&field_tdr_date_value=${year}`,
      {
        next: {
          revalidate: 3600,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Treasury API returned ${response.status}`);
    }

    const xml = await response.text();

    const rows = [...xml.matchAll(/<d2p1:DailyTreasuryParYieldCurveRate>([\s\S]*?)<\/d2p1:DailyTreasuryParYieldCurveRate>/g)];

    if (!rows.length) {
      throw new Error("No Treasury yield data found");
    }

    const latest = rows[rows.length - 1][1];

    const getField = (field: string) => {
      const match = latest.match(
        new RegExp(`<d2p1:${field}>(.*?)</d2p1:${field}>`)
      );

      return match?.[1] ?? null;
    };

    const date = getField("BC_1MONTH") ? getField("NEW_DATE") : null;

    return {
      date: date ?? new Date().toISOString().slice(0, 10),
      rates: {
        "1M": getNumber(getField("BC_1MONTH")),
        "3M": getNumber(getField("BC_3MONTH")),
        "6M": getNumber(getField("BC_6MONTH")),
        "1Y": getNumber(getField("BC_1YEAR")),
        "2Y": getNumber(getField("BC_2YEAR")),
        "5Y": getNumber(getField("BC_5YEAR")),
        "10Y": getNumber(getField("BC_10YEAR")),
        "30Y": getNumber(getField("BC_30YEAR")),
      },
    };
  } catch (error) {
    console.error("Treasury data error:", error);
    return null;
  }
}
