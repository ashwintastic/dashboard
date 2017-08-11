import {
  ACCOUNT_BOTS_FETCHING_BOTS,
  ACCOUNT_BOTS_FETCHED_BOTS,
  ACCOUNT_BOTS_FETCH_BOTS_FAILED,
  FETCHING_ALL_BOTS,
  FETCHED_ALL_BOTS,
  FETCH_ALL_BOTS_FAILED
} from '../constants/actionTypes';

import apiActionFactory from './factory/apiActionFactory';

/* eslint-disable import/prefer-default-export */
export function fetchBotList(accountId) {
  const accountBotsActions = apiActionFactory({
    fetchingActionType: ACCOUNT_BOTS_FETCHING_BOTS,
    fetchedActionType: ACCOUNT_BOTS_FETCHED_BOTS,
    fetchFailedActionType: ACCOUNT_BOTS_FETCH_BOTS_FAILED,
    fetchApi: `/api/accounts/${accountId}/bots`,
    actionMeta: {
      accountId
    },
    transform: ({ bots, allowedPermissions }) => ({
      botPerms: allowedPermissions,
      bots: bots.map(b => (
        { id: b._id, name: b.name, accountId: b.account, allows: allowedPermissions }
      ))
    })
  });

  return accountBotsActions.fetchThunk;
}

export function fetchAllBots() {
  const accountBotsActions = apiActionFactory({
    fetchingActionType: FETCHING_ALL_BOTS,
    fetchedActionType: FETCHED_ALL_BOTS,
    fetchFailedActionType: FETCH_ALL_BOTS_FAILED,
    fetchApi: `/api/bots/all`,
    actionMeta: {
    },
    transform: ({ allBots }) => ({
      allBots: allBots.map(b => (
        { id: b._id, name: b.name }
      ))
    })
  });

  return accountBotsActions.fetchThunk;
}