import {
  MANAGE_ACCOUNT_SET_ACCOUNT_ID,
  MANAGE_ACCOUNT_SELECT_BOT_ID,
  BOT_SET_ERROR_MSG,
  BOT_REFRESHED,
  PAST_DATE_ERROR_MSG
} from '../constants/actionTypes';

import { fetchUnusedBots } from './unusedBots';
import apiData from '../utils/apiData';
import { fetchBotList } from './accountBots';
import { setErrorNotification, setSuccessNotification } from './notification';
import {
  BOT_INITIALIZED_SUCCESS_MESSAGE,
  BOT_INITIALIZED_ERROR_MESSAGE
} from '../noticationMessages/messages';

export function setManageAccountId(accountId) {
  return {
    type: MANAGE_ACCOUNT_SET_ACCOUNT_ID,
    payload: {
      accountId
    }
  };
}

export function selectBotId(botId) {
  return {
    type: MANAGE_ACCOUNT_SELECT_BOT_ID,
    payload: {
      botId
    }
  };
}

export function linkBotId(botId, accountId) {
  return (dispatch) => {
    apiData({
      api: `/api/bots/${botId}/link/${accountId}`,
      method: 'post'
    }, dispatch).then(resp => {
      if (resp.status === 200) {
        dispatch(selectBotId(null));
        dispatch(fetchUnusedBots());
        dispatch(fetchBotList(accountId));
      }
    });
  };
}

export function unlinkBotId(botId, accountId) {
  return (dispatch) => {
    apiData({
      api: `/api/bots/${botId}/unlink`,
      method: 'post'
    }, dispatch).then(resp => {
      if (resp.status === 200) {
        dispatch(fetchUnusedBots());
        dispatch(fetchBotList(accountId));
      }
    });
  };
}

export function setErrorText(errormsg) {
  return {
    type: BOT_SET_ERROR_MSG,
    payload: {
      errormsg
    }
  };
}

export function setPastDateErrorText(errormsg) {
  return {
    type: PAST_DATE_ERROR_MSG,
    payload: {
      errormsg
    }
  };
}

export function setBotRefreshState(flag) {
  return {
    type: BOT_REFRESHED,
    payload: flag
  };
}

export function refreshBot(botId) {
  return (dispatch) => {
    apiData({
      api: `/api/initialize/bots/${botId}`,
      method: 'get',
    }, dispatch).then(resp => {
      if (resp.status >= 200 && resp.status < 300) {
        dispatch(setSuccessNotification(BOT_INITIALIZED_SUCCESS_MESSAGE));
      } else if (resp.status >= 400){
        dispatch(setSuccessNotification(BOT_INITIALIZED_ERROR_MESSAGE));
      }
    })
      .catch(resp => {
        dispatch(setErrorNotification(BOT_INITIALIZED_ERROR_MESSAGE));
      });
  };
}
