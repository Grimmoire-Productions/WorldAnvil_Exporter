export let APPLICATION_KEY: string | undefined = undefined;

export function setApplicationKeyMock(value: string | undefined) {
  APPLICATION_KEY = value;
}

export const TOKEN_EXPIRATION_SECONDS = 24 * 60 * 60
