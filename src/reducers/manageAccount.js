import {
  MANAGE_ACCOUNT_SET_ACCOUNT_ID,
  MANAGE_ACCOUNT_SELECT_BOT_ID,
  BOT_SET_ERROR_MSG,
  BOT_REFRESHED,
  PAST_DATE_ERROR_MSG,
} from '../constants/actionTypes';

const manageAccountState = {
  currentAccountId: null,
  selectedBotId: null,
  errorText: '',
  pastDateError: '',
  snackbarState: false,
};

function manageAccount(state = manageAccountState, action = null) {
  switch (action.type) {
    case MANAGE_ACCOUNT_SET_ACCOUNT_ID:
      return {
        currentAccountId: action.payload.accountId,
        selectedBotId: null,
      };

    case MANAGE_ACCOUNT_SELECT_BOT_ID:
      return {
        ...state,
        currentAccountId: state.currentAccountId,
        selectedBotId: action.payload.botId,
      };

    case BOT_SET_ERROR_MSG: {
      return {
        ...state,
        errorText: action.payload.errormsg || '',
      };
    }
    case PAST_DATE_ERROR_MSG: {
      return {
        ...state,
        pastDateError: action.payload.errormsg,
      };
    }
    case BOT_REFRESHED: {
      return {
        ...state,
        snackbarState: action.payload,
      };
    }
    default: return state;
  }
}


export default manageAccount;
