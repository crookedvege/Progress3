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
  body: JSON.stringify({
    progress: total / goal,
    goal,
    total,
    stretchGoal: 12000 // <-- updated
  }),
};

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
