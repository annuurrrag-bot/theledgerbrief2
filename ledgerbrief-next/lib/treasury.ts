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

  const number = Number(value.trim());

  return Number.isFinite(number) ? number : null;
}

function getXmlField(xml: string, field: string): string | null {
  const regex = new RegExp(
    `<(?:\\w+:)?${field}\\b[^>]*>(.*?)</(?:\\w+:)?${field}>`,
    "i"
  );

  const match = xml.match(regex);

  return match?.[1]?.trim() ?? null;
}

export async function getTreasuryCurve(): Promise<TreasuryCurve | null> {
  try {
    const year = new Date().getUTCFullYear();

    const url =
      `${TREASURY_URL}` +
      `?data=daily_treasury_yield_curve` +
      `&field_tdr_date_value=${year}`;

    const response = await fetch(url, {
      next: {
        revalidate: 3600,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Treasury API returned ${response.status}`
      );
    }

    const xml = await response.text();

    /*
     * Treasury's XML feed is an Atom/XML document.
     *
     * Each <entry> contains the actual Treasury rate fields.
     * We extract all entries and use the most recent one.
     */

    const entries = [
      ...xml.matchAll(
        /<entry\b[^>]*>([\s\S]*?)<\/entry>/gi
      ),
    ];

    if (!entries.length) {
      throw new Error("No Treasury entries found");
    }

    const latest = entries[entries.length - 1][1];

    const date = getXmlField(latest, "NEW_DATE");

    const rates = {
      "1M": getNumber(
        getXmlField(latest, "BC_1MONTH")
      ),

      "3M": getNumber(
        getXmlField(latest, "BC_3MONTH")
      ),

      "6M": getNumber(
        getXmlField(latest, "BC_6MONTH")
      ),

      "1Y": getNumber(
        getXmlField(latest, "BC_1YEAR")
      ),

      "2Y": getNumber(
        getXmlField(latest, "BC_2YEAR")
      ),

      "5Y": getNumber(
        getXmlField(latest, "BC_5YEAR")
      ),

      "10Y": getNumber(
        getXmlField(latest, "BC_10YEAR")
      ),

      "30Y": getNumber(
        getXmlField(latest, "BC_30YEAR")
      ),
    };

    /*
     * Make sure we actually received Treasury yield data.
     * This prevents the site from displaying fake/empty values.
     */
    const validRates = Object.values(rates).filter(
      (value) => value !== null
    );

    if (!validRates.length) {
      throw new Error(
        "Treasury entry found, but no yield values were parsed"
      );
    }

    return {
      date: date
        ? new Date(date).toISOString().slice(0, 10)
        : new Date().toISOString().slice(0, 10),

      rates,
    };
  } catch (error) {
    console.error(
      "Treasury data error:",
      error
    );

    return null;
  }
}
