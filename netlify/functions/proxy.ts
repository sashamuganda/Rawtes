import { Handler } from '@netlify/functions';

export const handler: Handler = async (event) => {
  const targetUrl = event.queryStringParameters?.url;

  if (!targetUrl) {
    return { statusCode: 400, body: 'Missing "url" parameter' };
  }

  if (!targetUrl.startsWith('https://github.com/login/')) {
    return { statusCode: 403, body: 'Only GitHub login URLs are allowed' };
  }

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': '*',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers };
  }

  try {
    const response = await fetch(targetUrl, {
      method: event.httpMethod,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: event.body,
    });

    const data = await response.json();
    return {
      statusCode: response.status,
      headers,
      body: JSON.stringify(data),
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
