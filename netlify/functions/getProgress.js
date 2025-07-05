const fetch = require('node-fetch');

exports.handler = async function (event, context) {
  // DEBUG: Log all environment variables (TEMPORARY!)
  console.log("ENVIRONMENT VARIABLES:", JSON.stringify(process.env, null, 2));

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

  const url = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`;

  console.log("✅ Using Airtable URL:", url);
  console.log("✅ API Key starts with:", API_KEY.substring(0, 8) + "...");

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    });

    console.log("📡 Airtable response status:", response.status);

    const responseBody = await response.text();
    console.log("📦 Airtable response body:", responseBody);

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({
          error: `Airtable API error: ${response.statusText}`,
          details: responseBody,
        }),
      };
    }

    const json = JSON.parse(responseBody);
    const data = json.records[0];

    if (!data || !data.fields) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Airtable data missing fields" }),
      };
    }

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        progress: data.fields.Progress ?? null,
        goal: data.fields.Goal ?? null,
        total: data.fields["Donation Value Rollup (from Table 1)"] ?? null,
        stretchGoal: 12000
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
