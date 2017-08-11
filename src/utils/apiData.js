import fetch from '../core/fetch';
import { botEngine } from '../config';
import { propmtUserForLogin } from '../actions/auth'
import { authenticationError } from '../constants/apiResponseType';

// TODO handle http error (throw error on statusCode >= 400)
export default async function apiData({ api, method = 'get', body = null }, dispatch) {
  let credentials = 'include';
  if (api.indexOf('https://graph.facebook.com/') >= 0 || api.indexOf(botEngine.url) >= 0 || api.indexOf(botEngine.url + "/dev/createtestref/") >= 0) {
    credentials = 'omit';
  }
  const opts = {
    method: body ? 'post' : method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    credentials: credentials,
  };

  if (body) {
    opts.body = JSON.stringify(body);
  }

//   return fetch(api, opts);
    const res = await fetch(api, opts);

    if(res.status == authenticationError.status) {
        if(typeof dispatch == 'function'){
            dispatch(propmtUserForLogin());
        }
    }

    return res;
}
