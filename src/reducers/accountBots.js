import {
  ACCOUNT_BOTS_FETCHING_BOTS,
  ACCOUNT_BOTS_FETCHED_BOTS,
  ACCOUNT_BOTS_FETCH_BOTS_FAILED,
  FETCHING_ALL_BOTS,
  FETCHED_ALL_BOTS,
  FETCH_ALL_BOTS_FAILED
} from '../constants/actionTypes';


const accountBotsState = {
  fetching: false,
  accountBots: {},
  botPerms: [],
  allBots: [],
};

function accountBots(state = accountBotsState, action = null) {
  switch (action.type) {
    case ACCOUNT_BOTS_FETCHING_BOTS:
      return {
        ...state,
        fetching: true,
      };

    case ACCOUNT_BOTS_FETCH_BOTS_FAILED:
      return {
        ...state,
        fetching: false,
      };

    case ACCOUNT_BOTS_FETCHED_BOTS:
      return {
        ...state,
        botPerms: action.payload.botPerms,
        accountBots: {
          ...(state.accountBots || {}),
          [action.meta.accountId]: action.payload.bots || [],
        },
      };
    case FETCHING_ALL_BOTS:
      return {
        ...state,
        fetching: true,
      };

    case FETCH_ALL_BOTS_FAILED:
      return {
        ...state,
        fetching: false,
      };

    case FETCHED_ALL_BOTS: {
      const newState = {
        ...state,
      };
      newState.allBots = action.payload.allBots || [];
      return newState;
    };
    default: return state;
  }
}

export default accountBots;
