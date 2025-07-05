exports.handler = async function (event, context) {
  console.log("AIRTABLE_API_KEY (first 8 chars):", process.env.AIRTABLE_API_KEY ? process.env.AIRTABLE_API_KEY.slice(0,8) : "NOT SET");
  ...
exports.handler = async function (event, context) {
  const API_KEY = process.env.AIRTABLE_API_KEY;
  const BASE_ID = "appWPBQxrTk0Z2Knj";
  const TABLE_NAME = "Progress";

  if (!API_KEY) {
    console.error("Missing AIRTABLE_API_KEY environment variable");
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Missing API key" }),
    };
  }

  const url = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`;

  try {
    console.log("Fetching Airtable data with URL:", url);
    console.log("Using API key:", API_KEY.substring(0, 5) + "...");

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    });

    console.log("Airtable response status:", response.status, response.statusText);

    if (!response.ok) {
      const text = await response.text();
      console.error("Airtable API error response body:", text);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: `Airtable API error: ${response.statusText}` }),
      };
    }

    const json = await response.json();
    console.log("Airtable JSON response:", JSON.stringify(json));

    const data = json.records[0];

    if (!data || !data.fields) {
      console.error("Airtable data missing fields or empty records");
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Airtable data missing fields" }),
      };
    }

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        progress: Number(data.fields.Progress) || 0,
        goal: Number(data.fields.Goal) || 0,
        total: Number(data.fields["Donation Value Rollup (from Table 1)"]) || 0,
        stretchGoal: 12000,
      }),
    };
  } catch (err) {
    console.error("Server error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server error" }),
    };
  }
};
