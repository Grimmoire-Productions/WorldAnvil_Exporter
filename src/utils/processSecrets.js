import { transformBBCode, transformWorldAnvilLinks, correctPunctuation } from './formatter';

export async function FetchSecret(secretId) {
  const response = await fetch(`https://www.worldanvil.com/api/external/boromir/secret?id=${secretId}&granularity=0`, {
    headers: {
      "accept": "application/json",
      "x-auth-token": process.env.REACT_APP_WA_GP_API_TOKEN,
      "x-application-key": process.env.REACT_APP_WA_API_KEY
    }
  })

  const data = await response.json();
  return data.content;
}

export async function processSecrets(arrayContent) {

  let i = 0;

  for (const str of arrayContent) {
    if(str.includes("secret:")) {
      const secretId = str.substring(
        str.indexOf(":")+1,
        str.indexOf("]")
      )
      let secretText = await FetchSecret(secretId);
      secretText = transformBBCode(secretText)
      secretText = transformWorldAnvilLinks(secretText)
      secretText = correctPunctuation(secretText)
      arrayContent[i] = `<p>${secretText}</p>`
    }
    i++;
  }

  return arrayContent;
}