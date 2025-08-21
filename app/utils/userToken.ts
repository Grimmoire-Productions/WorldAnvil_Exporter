import { WA_TOKEN } from './consts'
import type {UserToken} from './types'

// https://www.sohamkamani.com/javascript/localstorage-with-ttl-expiry/

export function getExpiresAt(seconds: number) {
  const now = new Date()

  return now.getTime() + seconds * 1000;
}

export function setUserToken(userToken: string, seconds: number) {

  // `item` is an object which contains the original value
  // as well as the time when it's supposed to expire
  
  const item = {
    value: userToken,
    expiry: getExpiresAt(seconds)
  }

  localStorage.setItem(WA_TOKEN, JSON.stringify(item))
}

export function getUserToken(): UserToken | null {
  const now = new Date()
  const itemStr = localStorage.getItem(WA_TOKEN)

  // if the item doesn't exist, return null
  if (!itemStr) {
    return null
  }
  const item = JSON.parse(itemStr)

  // compare the expiry time of the item with the current time
  if (now.getTime() > item.expiry) {
    // If the item is expired, delete the item from storage
    // and return null
    localStorage.removeItem(WA_TOKEN)
    return null
  }
  return item;
}