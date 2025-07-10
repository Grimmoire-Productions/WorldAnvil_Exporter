import { APPLICATION_KEY, TOKEN_EXPIRATION_SECONDS } from './consts'
import { setUserToken } from './userToken';
import type { User, World, UserWorldsResponse, UserIdentityResponse, ArticleResponse, SecretResponse } from './types';

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
            title: world.title
          }
        })
        return worlds;
    })
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