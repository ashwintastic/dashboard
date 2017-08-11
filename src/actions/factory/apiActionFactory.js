import fetch from '../../core/fetch';
import { redirect } from '../route';

function fetchFromApi({ api, credentials }) {
  return fetch(api, {
    method: 'get',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    credentials: credentials,
  });
}

export default function apiActionFactory(
  {
    fetchingActionType,
    fetchedActionType,
    fetchedAction = null,
    fetchFailedActionType,
    fetchApi,
    actionMeta,
    transform = null,
  }
) {
  function fetchingData() {
    return {
      type: fetchingActionType,
      meta: actionMeta,
    };
  }

  function fetchFailed(err) {
    return {
      type: fetchFailedActionType,
      meta: actionMeta,
      error: true,
      payload: err,
    };
  }

  function fetchedData(payload) {
    return {
      type: fetchedActionType,
      meta: actionMeta,
      payload,
    };
  }

  function fetchThunk(dispatch) {
    dispatch(fetchingData());
    let credentials = 'include';
    if (fetchApi.indexOf("https://graph.facebook.com/") >= 0) {
      credentials = false;
    }

    fetchFromApi({ api: fetchApi, credentials: credentials })
      .then(resp => {
        if (resp.status === 401) {
          console.log('authentication failed');
          dispatch(redirect('/'));
          return;
        }
        if (resp.status !== 200) {
          throw new Error(`Fetch failed for api: ${fetchApi}`);
        }
        return resp.json();
      })
      .then(jsonData => {
        const payload = transform ? transform(jsonData) : jsonData;
        dispatch(fetchedData(payload));
        if (fetchedAction) {
          dispatch(fetchedAction(payload));
        }
      })
      .catch(err => {
        dispatch(fetchFailed(err));
      })
      ;
  }

  return { fetchThunk };
}
