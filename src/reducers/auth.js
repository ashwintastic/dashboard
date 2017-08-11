import {
  AUTH_FETCHING_USER_DETAILS,
  AUTH_FETCHED_USER_DETAILS,
  AUTH_FETCH_USER_DETAILS_FAILED,
  USER_BASIC_INFO_CHANGE,
  USER_PASSWORD_VALIDATION_DATA_CHANGE,
  SET_USER_MAIL_ID,
  SET_RESET_PASSWORD_FLAG,
  UNAUTHORIZED_USER_PROMT_LOGIN
} from '../constants/actionTypes';

const authState = {
  fetching: false,
  authenticated: false,
  userData: {
    FirstName: '',
    LastName: ''
  },
  passwordValidationData: {
    CurrentPassword: '',
    NewPassword: '',
    ConfirmedPassword: ''
  },
  resetPasswordFlag: false,
  mailId: '',
  user: {
    email: null,
    roles: '',
  },
  unAuthorizedPrompt: false,
};

export default function (state = authState, action = null) {
  switch (action.type) {
    case AUTH_FETCHING_USER_DETAILS:
      return {
        ...state,
        fetching: true
      };

    case AUTH_FETCHED_USER_DETAILS:
      return {
        fetching: false,
        user: { ...action.payload.user },
        userData: { FirstName: action.payload.user.firstName, LastName: action.payload.user.lastName },
        passwordValidationData: { CurrentPassword: '', NewPassword: '', ConfirmedPassword: '' },
        authenticated: true,
      };
    case AUTH_FETCH_USER_DETAILS_FAILED:
      return {
        ...state,
        fetching: false,
        authenticated: false,
      };
    case USER_BASIC_INFO_CHANGE:
      return {
        ...state,
        userData: Object.assign({}, state.userData, action.payload)
      };
    case USER_PASSWORD_VALIDATION_DATA_CHANGE:
      return {
        ...state,
        passwordValidationData: Object.assign({}, state.passwordValidationData, action.payload)
      };
    case SET_USER_MAIL_ID:
      return {
        ...state,
        mailId: action.payload.mailId
      };
    case SET_RESET_PASSWORD_FLAG:
      return {
        ...state,
        resetPasswordFlag: action.payload.flag
      };
      case UNAUTHORIZED_USER_PROMT_LOGIN:
        return {
            ...state,
            unAuthorizedPrompt: action.payload.unAuthorizedPrompt
        }
    default: return state;
  }
}
