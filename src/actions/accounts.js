import {
  ACCOUNTS_FETCHING_ACCOUNTS_LIST,
  ACCOUNTS_FETCHED_ACCOUNTS_LIST,
  ACCOUNTS_FETCH_ACCOUNTS_LIST_FAILED,

  ACCOUNTS_FETCHING_ACCOUNT_DETAILS,
  ACCOUNTS_FETCHED_ACCOUNT_DETAILS,
  ACCOUNTS_FETCH_ACCOUNT_DETAILS_FAILED,
  ACCOUNT_ENTRY_DATA_CHANGE,
  ACCOUNT_ENTRY_EDIT,
  ACCOUNT_ENTRY_CREATE
} from '../constants/actionTypes';
import apiData from '../utils/apiData';
import { redirect } from './route';

import apiActionFactory from './factory/apiActionFactory';

import { ACCOUNT_CREATED_SUCCESSFULLY,
         ACCOUNT_ERROR_MESSAGE,
         ACCOUNT_DELETE_MESSAGE,
         ACCOUNT_UPDATE_MESSAGE,
         ERROR_MESSAGE
} from '../noticationMessages/messages';
import { setErrorNotification, setSuccessNotification } from './notification';


export function fetchAccountDetails(accountId) {
  const fetchAccountDetailsActions = apiActionFactory({
    fetchingActionType: ACCOUNTS_FETCHING_ACCOUNT_DETAILS,
    fetchedActionType: ACCOUNTS_FETCHED_ACCOUNT_DETAILS,
    fetchFailedActionType: ACCOUNTS_FETCH_ACCOUNT_DETAILS_FAILED,
    fetchApi: `/api/accounts/${accountId}`,
    actionMeta: {
      accountId
    },
    transform: ({ account }) => ({
      account: {
        id: account._id,
        name: account.name,
        managerEmail: account.managerEmail ? account.managerEmail : 'dummyManager@botworx.ai',
        admin: account.admin,
        adminEmail: account.adminEmail,
        timezone: account.timezone ? account.timezone : 'US/Pacific'
      }
    })
  });

  return fetchAccountDetailsActions.fetchThunk;
}

export function fetchAccountsList(userId) {
  const fetchAccountsListActions = apiActionFactory({
    fetchingActionType: ACCOUNTS_FETCHING_ACCOUNTS_LIST,
    fetchedActionType: ACCOUNTS_FETCHED_ACCOUNTS_LIST,
    fetchFailedActionType: ACCOUNTS_FETCH_ACCOUNTS_LIST_FAILED,
    fetchApi: `/api/accounts/list/${userId}`,
    actionMeta: {
      userId
    },
    transform: ({ accounts, allowedPermissions  }) => ({
      accountPerms: allowedPermissions,
      accounts: accounts.map(a => ({
        id: a._id,
        name: a.name,
        managerEmail: a.managerEmail ? a.managerEmail : 'dummyManager@botworx.ai',
        admin: a.admin,
        adminEmail: a.adminEmail,
        allows: allowedPermissions,
        timezone: a.timezone ? a.timezone : 'US/Pacific'
      }))
    })
  });
  return fetchAccountsListActions.fetchThunk;
}

export function saveAccountEntry(accountEntryData, userId, userEmail, accountId) {
  return (dispatch) => {
    accountEntryData.admin = userId;
    accountEntryData.adminEmail = userEmail;
    apiData({
      api: `/api/accounts/editAccount/${accountId}`,
      method: 'post',
      body: {
        accountEntry: accountEntryData
      },
    }, dispatch).then(resp => {
      if (resp.status === 200) {
        dispatch(fetchAccountsList(userId));
        dispatch(redirect('/accounts'));
        dispatch(setSuccessNotification(ACCOUNT_UPDATE_MESSAGE));
      }
    }).catch(resp => {
      dispatch(setErrorNotification(ACCOUNT_ERROR_MESSAGE));
    });
  };
}

export function createNewAccount(accountEntryData, userId, userEmail) {
  return (dispatch) => {
    accountEntryData.admin = userId;
    accountEntryData.adminEmail = userEmail;
    apiData({
      api: `/api/accounts/createAccount`,
      method: 'post',
      body: {
        accountEntry: accountEntryData,
        userId: userId
      },
    }, dispatch).then(resp => {
      if (resp.status === 200) {
        dispatch(fetchAccountsList(userId));
        dispatch(redirect('/accounts'));
        dispatch(setSuccessNotification(ACCOUNT_CREATED_SUCCESSFULLY));
      }
    }).catch(resp =>{
      dispatch(setErrorNotification(ACCOUNT_ERROR_MESSAGE));
    });
  };
}

export function deleteAccountEntry(accountId, userId) {
  return (dispatch) => {
    apiData({
      api: `/api/accounts/${accountId}`,
      method: 'delete'
    }, dispatch).then(resp => {
      if (resp.status === 200) {
        dispatch(fetchAccountsList(userId));
        dispatch(setSuccessNotification(ACCOUNT_DELETE_MESSAGE));
      }
    }).catch(err => {
      dispatch(setErrorNotification(ERROR_MESSAGE));
    });
  };
}

export const accountEntryDataChange = (payload) => ({
  type: ACCOUNT_ENTRY_DATA_CHANGE,
  payload
})

export const editAccountEntry = (payload) => ({
  type: ACCOUNT_ENTRY_EDIT,
  payload
});

export const createAccountEntry = () => ({
  type: ACCOUNT_ENTRY_CREATE

});
