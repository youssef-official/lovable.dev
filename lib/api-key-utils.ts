import { NextRequest } from 'next/server';

/**
 * Utility functions for handling API keys in API routes
 */

export interface ApiKeyHeaders {
  'x-minimax-api-key'?: string;
  'x-e2b-api-key'?: string;
}

/**
 * Get API key from request headers or environment variables
 */
export function getApiKey(
  request: NextRequest,
  provider: 'minimax' | 'e2b'
): string | undefined {
  // First try to get from headers
  const headerKey = `x-${provider}-api-key`;
  const fromHeader = request.headers.get(headerKey);
  
  if (fromHeader) {
    return fromHeader;
  }

  // Fallback to environment variables
  const envKey = `${provider.toUpperCase()}_API_KEY`;
  return process.env[envKey];
}

/**
 * Get API key from request body or environment variables
 */
export function getApiKeyFromBody(
  body: any,
  provider: 'minimax' | 'e2b'
): string | undefined {
  // First try to get from body
  const bodyKey = `${provider}ApiKey`;
  if (body[bodyKey]) {
    return body[bodyKey];
  }

  // Fallback to environment variables
  const envKey = `${provider.toUpperCase()}_API_KEY`;
  return process.env[envKey];
}

/**
 * Get all API keys from request headers
 */
export function getAllApiKeysFromHeaders(request: NextRequest): {
  minimax?: string;
  e2b?: string;
} {
  return {
    minimax: getApiKey(request, 'minimax'),
    e2b: getApiKey(request, 'e2b'),
  };
}

/**
 * Get all API keys from request body
 */
export function getAllApiKeysFromBody(body: any): {
  minimax?: string;
  e2b?: string;
} {
  return {
    minimax: getApiKeyFromBody(body, 'minimax'),
    e2b: getApiKeyFromBody(body, 'e2b'),
  };
}

/**
 * Validate that required API keys are present
 */
export function validateRequiredApiKeys(keys: {
  minimax?: string;
  e2b?: string;
}): { isValid: boolean; missing: string[] } {
  const missing: string[] = [];

  if (!keys.minimax) missing.push('MiniMax');
  if (!keys.e2b) missing.push('E2B');

  return {
    isValid: missing.length === 0,
    missing
  };
}
