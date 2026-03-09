import {
  transformBBCode,
  transformWorldAnvilLinks,
  correctPunctuation,
} from "./formatter.ts";
import backendAPI from "./backendAPI.ts";

export async function processSecrets(arrayContent: string[]) {
  let i = 0;

  for (const str of arrayContent) {
    if (str.includes("[secret:")) {
      const secretId = str.substring(str.indexOf(":") + 1, str.indexOf("]"));
      const secretResponse = await backendAPI.fetchSecrets(secretId);
      let secretText = secretResponse.content;
      if (secretText) {
        secretText = transformBBCode(secretText);
        secretText = transformWorldAnvilLinks(secretText);
        secretText = correctPunctuation(secretText);
        arrayContent[i] = `<p>${secretText}</p>`;
      }
    }
    i++;
  }

  return arrayContent;
}
