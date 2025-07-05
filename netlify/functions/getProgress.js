export const handler = async (event, context) => {
  const API_KEY = process.env.AIRTABLE_API_KEY;
  const BASE_ID = "appWPBQxrTk0Z2Knj";
  const TABLE_NAME = "Progress";

  if (!API_KEY) {
    console.error("❌ Missing AIRTABLE_API_KEY environment variable.");
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Missing AIRTABLE_API_KEY environment variable" }),
    };
  }

  const url = `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(TABLE_NAME)}`;

  try {
    // Airtable pagination: fetch all pages and accumulate total donation value
    let totalDonation = 0;
    let offset = null;
    let allRecords = [];

    do {
      const fetchUrl = offset ? `${url}?offset=${offset}` : url;

      const response = await fetch(fetchUrl, {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error("Airtable API error:", response.statusText, errorBody);
        return {
          statusCode: response.status,
          body: JSON.stringify({
            error: `Airtable API error: ${response.statusText}`,
            details: errorBody,
          }),
        };
      }

      const json = await response.json();

      if (!json.records || json.records.length === 0) {
        break;
      }

      allRecords = allRecords.concat(json.records);

      offset = json.offset || null;
    } while (offset);

    // Sum up "Donation Value Rollup (from Table 1)" field from all records
    for (const record of allRecords) {
      const val = record.fields["Donation Value Rollup (from Table 1)"];
      if (typeof val === "number") {
        totalDonation += val;
      }
    }

    // Optional: fallback if no total found in rollups, try to get from first record progress or goal
    const firstRecord = allRecords[0]?.fields || {};
    const progress = firstRecord.Progress ?? null;
    const goal = firstRecord.Goal ?? null;

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        progress,
        goal,
        total: totalDonation,
        stretchGoal: 12000,
      }),
    };
  } catch (err) {
    console.error("🔥 Server error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server error", message: err.message }),
    };
  }
};
