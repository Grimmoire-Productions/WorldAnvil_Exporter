import { APPLICATION_KEY, TOKEN_EXPIRATION_SECONDS } from './consts'
import { setUserToken } from './userToken';
import type {
  User,
  World,
  WorldArticlesResponse,
  UserWorldsResponse,
  UserIdentityResponse,
  ArticleResponse,
  CharacterSheet,
  SecretResponse
} from './types';

const baseURL = 'https://www.worldanvil.com/api/external/boromir'

const worldAnvilAPI = {
  logIn(userToken: string) {

    const options: RequestInit = {
      method: "GET",
      headers: {
        "x-auth-token": userToken,
        "x-application-key": APPLICATION_KEY || "",
        "Content-type": "application/json"
      }
    }

    return fetch(`${baseURL}/identity`, options).then((response: Response) => {
      if (!response.ok) {
        return response.json().then((errorResponse) => {
          console.error('API error: ', errorResponse.error);
          throw new Error('API error')
        });
      }
      return response.json()
    })
      .then((jsonResponse: UserIdentityResponse) => {
        setUserToken(userToken, TOKEN_EXPIRATION_SECONDS)
        const user: User = {
          displayName: jsonResponse.username,
          id: jsonResponse.id,
          worlds: null
        }
        return user;
      })
  },
  getWorlds(userToken: string, userId: string) {
    const options: RequestInit = {
      method: "POST",
      headers: {
        "x-auth-token": userToken,
        "x-application-key": APPLICATION_KEY || "",
        "Content-type": "application/json",
        "accept": "application/json"
      },
      body: JSON.stringify({
        "limit": "50",
        "offset": "0"
      })
    }

    return fetch(`${baseURL}/user/worlds?id=${userId}`, options).then((response: Response) => {
      if (!response.ok) {
        return response.json().then((errorResponse) => {
          if (errorResponse.error) {
            console.error('API error: ', errorResponse.error);
          } else if (errorResponse.value) {
            console.error(`${errorResponse.summary}; ${errorResponse.value.status}`)
            console.error(errorResponse.value.error)
          }
          throw new Error('API error')
        });
      }
      return response.json()
    })
      .then((jsonResponse: UserWorldsResponse) => {
        setUserToken(userToken, TOKEN_EXPIRATION_SECONDS)
        const worlds: World[] = jsonResponse.entities.map((world) => {
          return {
            id: world.id,
            title: world.title,
            cssClassName: world.title.replaceAll(/\s/g, "").replace('&', 'And')
          }
        })
        return worlds;
      })
  },
  getCharacterSheets(userToken: string, worldId: string) {
    const allCharacterSheets: CharacterSheet[] = [];
    const limit = 50;
    let offset = 0;
    let hasMore = true;

    const fetchPage = (): Promise<CharacterSheet[]> => {
      const options: RequestInit = {
        method: "POST",
        headers: {
          "x-auth-token": userToken,
          "x-application-key": APPLICATION_KEY || "",
          "Content-type": "application/json",
          "accept": "application/json"
        },
        body: JSON.stringify({
          "limit": limit.toString(),
          "offset": offset.toString()
        })
      }

      return fetch(`${baseURL}/world/articles?id=${worldId}`, options)
        .then((response: Response) => {
          if (!response.ok) {
            return response.json().then((errorResponse) => {
              if (errorResponse.error) {
                console.error('API error: ', errorResponse.error);
              } else if (errorResponse.value) {
                console.error(`${errorResponse.summary}; ${errorResponse.value.status}`)
                console.error(errorResponse.value.error)
              }
              throw new Error('API error')
            });
          }
          return response.json()
        })
        .then((jsonResponse: WorldArticlesResponse) => {
          let numArticlesInResponse = jsonResponse.entities.length;
          const currentArticles: CharacterSheet[] = jsonResponse.entities.map((article) => {
            if (article.tags?.includes("character_sheet") || article.customArticleTemplate?.toLowerCase().includes("character sheet")) {
              return {
                articleId: article.id,
                title: article.title,
                tags: article.tags?.split(',') || []
              }
            }
          }).filter((item) => item != null)

          if (currentArticles && currentArticles.length > 0) {
            allCharacterSheets.push(...currentArticles)
          }

          // Determine if there are more articles to fetch
          if (numArticlesInResponse < limit) {
            hasMore = false;
          } else {
            offset += limit;
          }

          // If there are more pages, recursively call fetchPage
          if (hasMore) {
            return fetchPage()
          } else {
            return allCharacterSheets;
          }
        })
    }

    return fetchPage();
  },
  fetchCharacter(userToken: string, charId: string) {

    const options: RequestInit = {
      method: "GET",
      headers: {
        "x-auth-token": userToken,
        "x-application-key": APPLICATION_KEY || "",
        "Content-type": "application/json"
      }
    }

    return fetch(`${baseURL}/article?id=${charId}&granularity=2`, options).then((response: Response) => {
      if (!response.ok) {
        return response.json().then((errorResponse) => {
          console.error('API error: ', errorResponse.error);
          throw new Error('API error')
        });
      }
      return response.json()
    })
      .then((jsonResponse: ArticleResponse) => {
        return jsonResponse;
      })
  },
  fetchSecrets(userToken: string, secretId: string) {

    const options: RequestInit = {
      method: "GET",
      headers: {
        "x-auth-token": userToken,
        "x-application-key": APPLICATION_KEY || "",
        "Content-type": "application/json"
      }
    }

    return fetch(`${baseURL}/secret?id=${secretId}&granularity=0`, options).then((response: Response) => {
      if (!response.ok) {
        return response.json().then((errorResponse) => {
          console.error('API error: ', errorResponse.error);
          throw new Error('API error')
        });
      }
      return response.json()
    })
      .then((jsonResponse: SecretResponse) => {
        return jsonResponse.content;
      })
  },
}

export default worldAnvilAPI;