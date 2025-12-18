import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { provider, apiKey } = await request.json();

    console.log(`[validate-api-key] Validating ${provider} API key`);

    if (!provider || !apiKey) {
      return NextResponse.json({
        valid: false,
        error: 'Provider and API key are required'
      }, { status: 400 });
    }

    let isValid = false;
    let error = '';

    switch (provider) {
      case 'openrouter':
        try {
          // Test OpenRouter API key by making a simple API call
          const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              model: 'mistralai/mistral-7b-instruct:free', // Use a free/cheap model for validation
              messages: [{ role: 'user', content: 'test' }],
              max_tokens: 1
            })
          });

          console.log(`[validate-api-key] OpenRouter response status: ${response.status}`);

          if (response.ok || response.status === 200) {
            isValid = true;
          } else if (response.status === 401 || response.status === 403) {
            error = 'Invalid OpenRouter API key';
          } else {
            // Be lenient with other status codes
            isValid = true;
            console.log(`[validate-api-key] OpenRouter validation inconclusive, assuming valid`);
          }
        } catch (err: any) {
          console.error('[validate-api-key] OpenRouter error:', err);
          // Be lenient with network errors
          isValid = true;
          console.log(`[validate-api-key] OpenRouter validation error, assuming valid: ${err.message}`);
        }
        break;

      case 'e2b':
        try {
          console.log(`[validate-api-key] Testing E2B API key...`);

          // Test E2B API key using the correct X-API-KEY header (not Bearer token)
          const response = await fetch('https://api.e2b.dev/sandboxes', {
            method: 'GET',
            headers: {
              'X-API-KEY': apiKey,
              'Content-Type': 'application/json'
            }
          });

          console.log(`[validate-api-key] E2B response status: ${response.status}`);

          if (response.ok || response.status === 404) {
            // 404 is OK - means no sandboxes but API key is valid
            isValid = true;
          } else if (response.status === 401 || response.status === 403) {
            error = 'Invalid E2B API key';
          } else {
            // For other status codes, try alternative endpoint
            console.log(`[validate-api-key] E2B primary endpoint returned ${response.status}, trying alternatives...`);

            try {
              const altResponse = await fetch('https://api.e2b.dev/templates', {
                method: 'GET',
                headers: {
                  'X-API-KEY': apiKey,
                  'Content-Type': 'application/json'
                }
              });

              console.log(`[validate-api-key] E2B templates response status: ${altResponse.status}`);

              if (altResponse.ok || altResponse.status === 404) {
                isValid = true;
              } else if (altResponse.status === 401 || altResponse.status === 403) {
                error = 'Invalid E2B API key';
              } else {
                // If both fail but not with auth errors, assume valid
                isValid = true;
                console.log(`[validate-api-key] E2B validation inconclusive, assuming valid`);
              }
            } catch (altErr) {
              // If alternative also fails, be lenient
              isValid = true;
              console.log(`[validate-api-key] E2B alternative validation failed, assuming valid`);
            }
          }
        } catch (err: any) {
          console.error('[validate-api-key] E2B error:', err);
          // Be lenient with network errors
          isValid = true;
          console.log(`[validate-api-key] E2B validation error, assuming valid: ${err.message}`);
        }
        break;

      default:
        return NextResponse.json({
          valid: false,
          error: 'Unsupported provider'
        }, { status: 400 });
    }

    console.log(`[validate-api-key] ${provider} validation result:`, { isValid, error });

    return NextResponse.json({
      valid: isValid,
      error: isValid ? undefined : error
    });

  } catch (error: any) {
    console.error('API key validation error:', error);
    return NextResponse.json({
      valid: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
