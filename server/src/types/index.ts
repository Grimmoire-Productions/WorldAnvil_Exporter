export * from '../../../shared/types/worldAnvilTypes.js';

// Session types
declare module 'express-session' {
  interface SessionData {
    userToken?: string;
    appKey?: string;
    userId?: string;
  }
}