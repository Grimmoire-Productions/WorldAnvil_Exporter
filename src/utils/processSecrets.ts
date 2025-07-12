import { transformBBCode, transformWorldAnvilLinks, correctPunctuation } from './formatter.ts';
import type { UserContextType } from './types.ts';
import worldAnvilAPI from './worldAnvilAPI.ts';

export async function processSecrets(userToken: UserContextType['accessToken'], arrayContent: string[], applicationKey?: string) {

  let i = 0;

  for (const str of arrayContent) {
    if(str.includes("secret:")) {
      const secretId = str.substring(
        str.indexOf(":")+1,
        str.indexOf("]")
      )
      let secretText = await worldAnvilAPI.fetchSecrets(userToken, secretId, applicationKey);
      if (secretText) {
        secretText = transformBBCode(secretText)
        secretText = transformWorldAnvilLinks(secretText)
        secretText = correctPunctuation(secretText)
        arrayContent[i] = `<p>${secretText}</p>`
      }
    }
    i++;
  }

  return arrayContent;
}