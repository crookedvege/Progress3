const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  const API_KEY = process.env.AIRTABLE_API_KEY;
  const BASE_ID = "appWPBQxrTk0Z2Knj";
  const TABLE_NAME = "Progress";

  const url = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    });

    if (!response.ok) {
      console.error("Airtable API error:", response.statusText);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Failed to fetch Airtable data" }),
      };
    }

    const json = await response.json();
    const data = json.records[0]; // assuming first record is relevant

    if (!data || !data.fields) {
      console.error("Missing data or fields from Airtable response:", data);
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
    console.error("Error in Netlify function:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server error" }),
    };
  }
};
