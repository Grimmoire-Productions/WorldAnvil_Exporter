import { APPLICATION_KEY, TOKEN_EXPIRATION_SECONDS } from './consts'
import { setUserToken } from './userToken';
import type { User, UserIdentityResponse } from './types';

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
          id: jsonResponse.id
      }
        return user;
    })
  },
}

export default worldAnvilAPI;