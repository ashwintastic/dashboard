/* eslint-disable import/prefer-default-export */
import {
  AUTH_FETCHING_USER_DETAILS,
  AUTH_FETCHED_USER_DETAILS,
  AUTH_FETCH_USER_DETAILS_FAILED,
  AUTH_LOGIN_FAILED,
  USER_BASIC_INFO_CHANGE,
  USER_PASSWORD_VALIDATION_DATA_CHANGE,
  SET_USER_MAIL_ID,
  SET_RESET_PASSWORD_FLAG,
  UNAUTHORIZED_USER_PROMT_LOGIN
} from '../constants/actionTypes';

import { fetchBotList } from './accountBots';
import { fetchAccountDetails, fetchAccountsList } from './accounts';
import apiData from '../utils/apiData';
import { redirect } from './route';
import { setErrorNotification, setSuccessNotification } from './notification';
import {
  PASSWORD_CHANGED_SUCCESSFULLY,
  PASSWORD_CHANGE_FAILED,
  USER_SAVED_SUCCESSFULLY,
  USER_SAVE_FAILED,
  USER_SET_PASSWORD_MESSAGE,
  USER_SET_PASSWORD_ERROR_MESSAGE,
  PASSWORD_RESET_FAILED
} from '../noticationMessages/messages';
import apiActionFactory from './factory/apiActionFactory';
import { setManageAccountId } from './manageAccount';

const fetchUserDetailsActions = apiActionFactory({
  fetchingActionType: AUTH_FETCHING_USER_DETAILS,
  fetchedActionType: AUTH_FETCHED_USER_DETAILS,
  fetchedAction: ({ user }) => (dispatch) => {
    if (user.accounts) {
      dispatch(fetchBotList(user.accounts));
      dispatch(fetchAccountDetails(user.accounts));
      dispatch(setManageAccountId(user.accounts));
    }
    else if (user.id) {
      dispatch(fetchAccountsList(user.id));
    }
  },
  fetchFailedActionType: AUTH_FETCH_USER_DETAILS_FAILED,
  fetchApi: '/api/userDetails',
  transform: (user) => ({ user })
});

export function changeUserPassword(newPassword, oldPwd) {
  return (dispatch) => {
    apiData({
      api: `/api/user/changepassword`,
      method: 'post',
      body: {
        newPassword: newPassword,
        oldPassword: oldPwd
      },
    }, dispatch).then(resp => {
      if (resp.status === 200) {
        dispatch(setSuccessNotification(PASSWORD_CHANGED_SUCCESSFULLY));
        dispatch(refreshUserDetails());
      }
      else {
        dispatch(setErrorNotification(PASSWORD_CHANGE_FAILED));
      }
    });
  };
}

export function saveUserBasicData(userInfo) {
  return (dispatch) => {
    apiData({
      api: `/api/user/basicinfo`,
      method: 'post',
      body: {
        userInfo: userInfo
      },
    }, dispatch).then(resp => {
      if (resp.status === 200) {
        dispatch(setSuccessNotification(USER_SAVED_SUCCESSFULLY));
        dispatch(refreshUserDetails());
      }      else {
        dispatch(setErrorNotification(USER_SAVE_FAILED));
      }
    });
  };
}

export const userDataChange = (payload) => ({
  type: USER_BASIC_INFO_CHANGE,
  payload
})

export const passwordDataChange = (payload) => ({
  type: USER_PASSWORD_VALIDATION_DATA_CHANGE,
  payload
})

export function login(user) {
  return (dispatch) => {
    apiData({
      api: `/api/login`,
      method: 'post',
      body: user
    }, dispatch).then(resp => {
      if (resp.status === 200) {
        // resp.json().then(user => {
        //   dispatch(setUser(user));
        //   dispatch(redirect('/accounts'));
        // })
        dispatch(unsetPromptUserFlag());
      }
      dispatch(loginFailed());
    }).catch((err) => {
      dispatch(loginFailed())
    });
  };
}

export function refreshUserDetails() {
  // ignore refresh user on serverside rendering
  // jwt throws error because it won't get cookie
  if (typeof window !== 'object') {
    return;
  }
  return fetchUserDetailsActions.fetchThunk;
}

function loginFailed() {
  return {
    type: AUTH_LOGIN_FAILED
  };
}

function setUser(user) {
  return {
    type: AUTH_FETCHED_USER_DETAILS,
    payload: {
      user
    }
  };
}

export function setEnteredMailId(mailId) {
  return {
    type: SET_USER_MAIL_ID,
    payload: {
      mailId
    }
  };
}

export function resetPassword() {
  return (dispatch, getState) => {
    const state = getState();
    const mailId = state.auth.mailId;
    apiData({
      api: `/api/user/${mailId}/setPassword`,
      method: 'post'
    }, dispatch).then(resp => {
      if (resp.status === 200) {
        dispatch(setSuccessNotification(USER_SET_PASSWORD_MESSAGE));
      }
      else if (resp.status === 404) {
        dispatch(setErrorNotification(USER_SET_PASSWORD_ERROR_MESSAGE));
      }
    }).catch((err) => {
      dispatch(setErrorNotification('Error'));
    });
  };
}

export function setResetPasswordFlag(flag){
  return {
    type: SET_RESET_PASSWORD_FLAG,
    payload: {
      flag
    }
  };
}

export function setNewPassword(newPassword) {
  return (dispatch) => {
    // send the query params too (which contains the encrypted string)
    apiData({
      api: `/api/reset-password${window.location.search}`,
      method: 'post',
      body: {
        newPassword: newPassword
      },
    }, dispatch).then(resp => {
      if (resp.status === 200) {
        dispatch(setResetPasswordFlag(true));
      }
      else {
        dispatch(setErrorNotification(PASSWORD_RESET_FAILED));
      }
    });
  };
}

export function setPromptUserFlag() {
    return {
        type: UNAUTHORIZED_USER_PROMT_LOGIN,
        payload: {
            unAuthorizedPrompt: true
        },
    };
}

export function unsetPromptUserFlag() {
    return {
        type: UNAUTHORIZED_USER_PROMT_LOGIN,
        payload: {
            unAuthorizedPrompt: false
        },
    };
}

export function propmtUserForLogin(){
    return (dispatch) => {
        dispatch(setPromptUserFlag());
    }
}

export function hideUserLoginPrompt(){
    return (dispatch) => {
        dispatch(unsetPromptUserFlag());
    }
}
