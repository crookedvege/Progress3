exports.handler = async function () {
  const AIRTABLE_PAT = process.env.AIRTABLE_PAT;
  const BASE_ID = 'appWPBQxrTk0Z2Knj';
  const TABLE_NAME = 'Progress';
  const RECORD_ID = 'recXwynFh17wbdqJs';

  const url = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}/${RECORD_ID}`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${AIRTABLE_PAT}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Airtable API error: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        progress: data.fields?.Progress ?? null,
        goal: data.fields?.Goal ?? null,
        total: data.fields?.["Donation Value Rollup (from Table 1)"] ?? null
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
