
import apiActionFactory from './factory/apiActionFactory';
import apiData from '../utils/apiData';
import {
    BOT_SUBSCRIPTION_ENTRIES_FETCHING,
    BOT_SUBSCRIPTION_ENTRIES_FETCHED,
    BOT_SUBSCRIPTION_ENTRIES_FAILED,
    BOT_SUBSCRIPTION_CREATE,
    BOT_SUBSCRIPTION_VAL_CHANGE,
    BOT_SUBSCRIPTION_SHOW_DIALOG,
    BOT_SUBSCRIPTION_SET_SUBSCRIPTION,
    BOT_SUBSCRIPTION_SET_SUBSCRIPTION_NAME,
    BOT_SUBSCRIPTION_SET_ADD_EDIT_MODE
} from '../constants/actionTypes';
import {
    fetchSubscriptionEntries
} from './broadcast';

import { redirect } from './route';

export function saveSubscription(accountId, subscription) {
  return (dispatch, getState) => {
    apiData({
      api: `/api/subscriptions/bot/${subscription.botId}/save`,
      method: 'post',
      body: {
        subscription
      }
    }, dispatch).then(resp => {
      if (resp.status === 200) {
        dispatch(fetchSubscriptionEntries(accountId, subscription.botId));
      }
    });
  };
}

export function setAddEditDialogState(showAddEditDialog) {
  return {
        type: BOT_SUBSCRIPTION_SHOW_DIALOG,
        payload: {
            showAddEditDialog
        },
    };
}

export function setCurrentSubscription(currSubscription) {
  return {
        type: BOT_SUBSCRIPTION_SET_SUBSCRIPTION,
        payload: {
            currSubscription
        },
    };
}

export function setCurrentSubscriptionName(subscriptionName) {
  return {
        type: BOT_SUBSCRIPTION_SET_SUBSCRIPTION_NAME,
        payload: {
            subscriptionName
        },
    };
}

export function setAddEditMode(addEditMode) {
  return {
        type: BOT_SUBSCRIPTION_SET_ADD_EDIT_MODE,
        payload: {
            addEditMode
        },
    };
}

export const createSubscriptionEntry = (botId) => ({
  type: BOT_SUBSCRIPTION_CREATE,
  payload: {
    botId
  }
});

export const subscriptionValueChange = (payload) => ({
  type: BOT_SUBSCRIPTION_VAL_CHANGE,
  payload
});
