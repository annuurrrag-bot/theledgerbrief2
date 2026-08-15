export type MacroSnapshot = {
  updatedAt: string;

  inflation: {
    headlineCpi: number | null;
    headlineCpiPrior: number | null;

    coreCpi: number | null;
    coreCpiPrior: number | null;
  };

  labor: {
    unemployment: number | null;
    unemploymentPrior: number | null;

    payrolls: number | null;
    payrollsPrior: number | null;
  };

  policy: {
    fedLower: number | null;
    fedUpper: number | null;
  };
};

type BlsObservation = {
  year: string;
  period: string;
  value: string;
};

async function fetchBlsSeries(
  seriesId: string
): Promise<BlsObservation[]> {
  try {
    const year = new Date().getUTCFullYear();

    const response = await fetch(
      "https://api.bls.gov/publicAPI/v2/timeseries/data/",
      {
        method: "POST",
        next: {
          revalidate: 3600,
        },
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          seriesid: [seriesId],
          startyear: String(year - 1),
          endyear: String(year),
        }),
      }
    );

    if (!response.ok) {
      throw new Error(
        `BLS returned ${response.status}`
      );
    }

    const data = await response.json();

    return (
      data?.Results?.series?.[0]?.data ?? []
    );
  } catch (error) {
    console.error(
      `BLS data error for ${seriesId}:`,
      error
    );

    return [];
  }
}

function monthlyOnly(
  observations: BlsObservation[]
) {
  return observations.filter(
    (item) =>
      /^M(0[1-9]|1[0-2])$/.test(item.period) &&
      Number.isFinite(Number(item.value))
  );
}

function latestValue(
  observations: BlsObservation[]
): number | null {
  const monthly = monthlyOnly(observations);

  if (!monthly.length) return null;

  const value = Number(monthly[0].value);

  return Number.isFinite(value) ? value : null;
}

function previousValue(
  observations: BlsObservation[]
): number | null {
  const monthly = monthlyOnly(observations);

  if (monthly.length < 2) return null;

  const value = Number(monthly[1].value);

  return Number.isFinite(value) ? value : null;
}

function yoyChange(
  observations: BlsObservation[]
): {
  latest: number | null;
  prior: number | null;
} {
  const monthly = monthlyOnly(observations);

  if (monthly.length < 13) {
    return {
      latest: null,
      prior: null,
    };
  }

  const current = Number(monthly[0].value);
  const previousMonth = Number(monthly[1].value);

  const yearAgo = Number(monthly[12].value);
  const priorYearAgo = Number(monthly[13]?.value);

  const latest =
    Number.isFinite(current) &&
    Number.isFinite(yearAgo) &&
    yearAgo !== 0
      ? ((current - yearAgo) / yearAgo) * 100
      : null;

  const prior =
    Number.isFinite(previousMonth) &&
    Number.isFinite(priorYearAgo) &&
    priorYearAgo !== 0
      ? ((previousMonth - priorYearAgo) /
          priorYearAgo) *
        100
      : null;

  return {
    latest,
    prior,
  };
}

export async function getMacroSnapshot(): Promise<MacroSnapshot> {
  const [
    headlineCpiSeries,
    coreCpiSeries,
    unemploymentSeries,
    payrollSeries,
  ] = await Promise.all([
    // CPI-U All Items, U.S. city average
    fetchBlsSeries("CUUR0000SA0"),

    // CPI-U All Items Less Food and Energy
    fetchBlsSeries("CUUR0000SA0L1E"),

    // Civilian unemployment rate
    fetchBlsSeries("LNS14000000"),

    // Total nonfarm payroll employment
    fetchBlsSeries("CES0000000001"),
  ]);

  const headline = yoyChange(
    headlineCpiSeries
  );

  const core = yoyChange(coreCpiSeries);

  const unemployment =
    latestValue(unemploymentSeries);

  const unemploymentPrior =
    previousValue(unemploymentSeries);

  /*
   * CES0000000001 is employment level in thousands.
   * Monthly payroll growth = latest level - prior level.
   */
  const payrollLevel =
    latestValue(payrollSeries);

  const payrollPriorLevel =
    previousValue(payrollSeries);

  const payrollPriorPriorLevel =
    monthlyOnly(payrollSeries).length >= 3
      ? Number(
          monthlyOnly(payrollSeries)[2].value
        )
      : null;

  const payrolls =
    payrollLevel !== null &&
    payrollPriorLevel !== null
      ? payrollLevel - payrollPriorLevel
      : null;

  const payrollsPrior =
    payrollPriorLevel !== null &&
    payrollPriorPriorLevel !== null &&
    Number.isFinite(payrollPriorPriorLevel)
      ? payrollPriorLevel -
        payrollPriorPriorLevel
      : null;

  /*
   * Current Fed target range.
   *
   * For now this remains explicit because the Federal Reserve
   * does not expose the target-range endpoints in the same
   * simple JSON shape as BLS.
   *
   * Keep this small section manually updated after FOMC meetings.
   */
  const fedLower = 3.5;
  const fedUpper = 3.75;

  return {
    updatedAt: new Date().toISOString(),

    inflation: {
      headlineCpi: headline.latest,
      headlineCpiPrior: headline.prior,

      coreCpi: core.latest,
      coreCpiPrior: core.prior,
    },

    labor: {
      unemployment,
      unemploymentPrior,

      payrolls,
      payrollsPrior,
    },

    policy: {
      fedLower,
      fedUpper,
    },
  };
}
