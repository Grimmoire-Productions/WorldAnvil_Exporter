export const APPLICATION_KEY = import.meta.env.VITE_PUBLIC_APPLICATION_KEY;

export const WA_TOKEN = 'WA_TOKEN';

// (24 hrs * 60)min * 60 = seconds
export const TOKEN_EXPIRATION_SECONDS = 24 * 60 * 60

export const LIES_VARS = [
  {
    name: "ton-grimmoireproductions",
    term: "Ton",
    description: "The Ton was the high society in the United Kingdom during the Regency era."
  },
  {
    name: "marquess-grimmoireproductions",
    term: "Marquess",
    description: "Pronounced “MAR-kwess” not “mar-KEY”"
  }
]

export const WORLD_CSS_STYLE_MAPPING = {
  'Lies & Liability': 'liesAndLiability',
  'Hawkins': 'hawkins'
}