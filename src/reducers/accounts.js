import { combineReducers } from 'redux';
import {
  SET_CURRENT_ACCOUNT_ID,
  ACCOUNTS_FETCH_ACCOUNTS_LIST_FAILED,
  ACCOUNTS_FETCHED_ACCOUNTS_LIST,
  ACCOUNTS_FETCHING_ACCOUNTS_LIST,

  ACCOUNTS_FETCHING_ACCOUNT_DETAILS,
  ACCOUNTS_FETCHED_ACCOUNT_DETAILS,
  ACCOUNTS_FETCH_ACCOUNT_DETAILS_FAILED,
  ACCOUNT_ENTRY_DATA_CHANGE,
  ACCOUNT_ENTRY_EDIT,
  ACCOUNT_ENTRY_CREATE
} from '../constants/actionTypes';

const accountsState = {
  list: {},
  accountPerms: [],
  currentAccountId: '',
  accountEntryData: {},
  accountEntries: [],
};

function accounts(state = accountsState, action = null) {
  switch (action.type) {
    case ACCOUNTS_FETCH_ACCOUNTS_LIST_FAILED:
    case ACCOUNTS_FETCH_ACCOUNT_DETAILS_FAILED:
      return state;

    case ACCOUNTS_FETCHING_ACCOUNTS_LIST:
    case ACCOUNTS_FETCHING_ACCOUNT_DETAILS:
      return state;

    case ACCOUNTS_FETCHED_ACCOUNTS_LIST:
      return {
        ...state,
        accountEntries: action.payload.accounts,
        accountPerms: action.payload.accountPerms,
        list: action.payload.accounts.reduce((accountsObj, a) => {
          /* eslint-disable no-param-reassign */
          accountsObj[a.id] = a;
          /* eslint-enable no-param-reassign */
          return accountsObj;
        }, {})
      }

    case ACCOUNTS_FETCHED_ACCOUNT_DETAILS: {
      return {
        ...state,
        [action.meta.accountId]: action.payload.account,
      };
    }
    case SET_CURRENT_ACCOUNT_ID: {
      return {
        ...state,
        currentAccountId: action.payload.id,
      };
    }
    case ACCOUNT_ENTRY_DATA_CHANGE:
      return {
        ...state,
        accountEntryData: Object.assign({}, state.accountEntryData, action.payload)
      };
    case ACCOUNT_ENTRY_EDIT:
      return {
        ...state,
        accountEntryData: Object.assign({}, state.accountEntries.find((x) => {
          return x.id === action.payload
        })),
      };
    case ACCOUNT_ENTRY_CREATE:
      const newState = Object.assign(state, {
        accountEntryData: {
          name: '',
          admin: '',
          adminEmail: '',
          manager: 'dummyManager',
          managerEmail: '',
          timezone: ''
        }
      });
      return newState;
    default: return state;
  }
}

export default accounts;
