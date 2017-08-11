import apiData from './apiData';
import { propmtUserForLogin } from '../actions/auth';
import { authenticationError } from '../constants/apiResponseType';

function fetchDataAction(
  api, fetchingAction, failedAction, successAction, body = null
) {
  return function fetchDataActionThunk(dispatch) {
    dispatch(fetchingAction);

    apiData({ api, body }, dispatch)
      .then(resp => {
        if (resp.status !== 200) {
          handleFailedActions(dispatch, failedAction);
          if(resp.status == authenticationError.status) {
            if(typeof dispatch == 'function'){
                dispatch(propmtUserForLogin());
            }
          }
        } else {
          resp.json().then((data) => {
            const toDispatch = !Array.isArray(successAction) ?
              [successAction] : successAction;
            toDispatch.forEach(action => dispatch(action(data)));
          });
        }
      });
  };
}

function handleFailedActions(dispatch, action) {
    Array.isArray(action) ? action.map(each => dispatch(each)) : dispatch(action);

}

export default fetchDataAction;
