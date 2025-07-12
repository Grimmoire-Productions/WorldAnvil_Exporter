// Simple token management for backend
// In a production app, you'd want to use a proper session store or JWT

const userTokens = new Map<string, { token: string; expiresAt: number }>();

export function setUserToken(sessionId: string, token: string, expirationSeconds: number) {
  const expiresAt = Date.now() + (expirationSeconds * 1000);
  userTokens.set(sessionId, { token, expiresAt });
}

export function getUserToken(sessionId: string): string | null {
  const tokenData = userTokens.get(sessionId);
  
  if (!tokenData) {
    return null;
  }
  
  if (Date.now() > tokenData.expiresAt) {
    userTokens.delete(sessionId);
    return null;
  }
  
  return tokenData.token;
}

export function removeUserToken(sessionId: string) {
  userTokens.delete(sessionId);
}