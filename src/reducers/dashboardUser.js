import {
  DASHBOARD_USER_ENTRY_CREATE,
  DASHBOARD_USER_ENTRIES_FETCHING,
  DASHBOARD_USER_ENTRIES_FETCHED,
  DASHBOARD_USER_ENTRIES_FAILED,
  DASHBOARD_USER_ENTRY_DATA_CHANGE,
  DASHBOARD_USER_ENTRY_EDIT,
  SET_ADD_USER_FLAG,
  ALL_USERS_ENTRIES_FETCHING,
  ALL_USERS_ENTRIES_FETCHED,
  ALL_USERS_ENTRIES_FAILED,
  SET_SELECTED_USER_NAME,
  BOT_USER_ENTRIES_FETCHING,
  BOT_USER_ENTRIES_FETCHED,
  BOT_USER_ENTRIES_FAILED,
  SET_EDIT_USER_ID,
  DASHBOARD_USER_MAP_LIST,
} from '../constants/actionTypes';
import _ from 'lodash';

const userState = {
  userEntries: [],
  allUsers: [],
  edituserId: '',
  userEntryFormFlag: false,
  addUserFlag: false,
  selectedUser: '',
  ExistingUserMapList: [],
  userEntryData: {
    auth: {
      local: {
      }
    }
  },
};

function linkedUsers(state = userState, action = null) {
  switch (action.type) {
    case SET_ADD_USER_FLAG:
      return {
        ...state,
        addUserFlag: action.payload,
      };
    case DASHBOARD_USER_MAP_LIST:
      return {
        ...state,
        ExistingUserMapList: _.differenceWith(state.allUsers, state.userEntries, _.isEqual),
      };
    case SET_EDIT_USER_ID:
      return {
        ...state,
        edituserId: action.payload,
      };
    case ALL_USERS_ENTRIES_FETCHING:
      return {
        ...state,
      };
    case ALL_USERS_ENTRIES_FETCHED:
      return {
        ...state,
        allUsers: action.payload.allUsers,
      };
    case ALL_USERS_ENTRIES_FAILED:
      return {
        ...state,
      };
    case DASHBOARD_USER_ENTRIES_FETCHING:
      return {
        ...state,
      };
    case DASHBOARD_USER_ENTRIES_FETCHED:
      return {
        ...state,
        userEntries: action.payload.userEntries,
      };
    case DASHBOARD_USER_ENTRIES_FAILED:
      return {
        ...state,
      };
    case BOT_USER_ENTRIES_FETCHING:
      return {
        ...state,
      };
    case BOT_USER_ENTRIES_FETCHED:
      return {
        ...state,
        userEntries: action.payload.userEntries,
      };
    case BOT_USER_ENTRIES_FAILED:
      return {
        ...state,
      };
    case DASHBOARD_USER_ENTRY_DATA_CHANGE:
      return {
        ...state,
        userEntryData: Object.assign({}, state.userEntryData, action.payload)
      };
    case DASHBOARD_USER_ENTRY_EDIT:
      return {
        ...state,
        userEntryData: Object.assign({}, state.userEntries.find((entry) => {
          return entry.id == action.payload
        })),
      };
    case DASHBOARD_USER_ENTRY_CREATE:
      const newState = Object.assign(state, {
        userEntryData: {
          FirstName: '',
          LastName: '',
          auth: {
            local: {
              password: ''
            }
          },
          accounts: [],
          email: '',
          roles: [],
        }
      });
      return newState;
    case SET_SELECTED_USER_NAME:
      return {
        ...state,
        selectedUser: action.payload,
      };
    default:
      return state;
  }
}
export default linkedUsers;
