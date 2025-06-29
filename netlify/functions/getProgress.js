exports.handler = async function (event, context) {
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
      return {
        statusCode: 500,
        body: JSON.stringify({ error: `Airtable API error: ${response.statusText}` }),
      };
    }

    const json = await response.json();
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
    console.error("Server error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server error" }),
    };
  }
};
