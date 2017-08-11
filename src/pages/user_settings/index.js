import React from 'react';
import { connect } from 'react-redux';
import SettingsPage from './UserSettings';
import {
  refreshUserDetails,
  userDataChange,
  passwordDataChange,
  saveUserBasicData,
  changeUserPassword,
} from '../../actions/auth';
import { setErrorNotification } from '../../actions/notification';
import {
  CURRENT_PASSWORD_VALIDATION_FAILED,
  NEW_PASSWORD_MATCH_ERROR,
  INVALID_PASSWORD,
  MINLENGTH_VALIDATION_FAILED,
} from '../../noticationMessages/messages';
import CryptoJS from 'crypto-js';

const mapStateToProps = (state) => {
  return {
    userData: state.auth.userData,
    userPassword: state.auth.user.password,
    passwordValidationData: state.auth.passwordValidationData,
  };
};

const mapDispatch = (dispatch) => ({
  onSaveUserDataClick: (userData) => {
    dispatch(saveUserBasicData(userData));
  },
  onSavePasswordDataClick: (userPassword, validationData) => {
    if (userPassword !== CryptoJS.MD5(validationData.CurrentPassword).toString()) {
      dispatch(setErrorNotification(CURRENT_PASSWORD_VALIDATION_FAILED));
      return
    }
    if ((!validationData.NewPassword.length) || (/\s/.test(validationData.NewPassword))) {
      dispatch(setErrorNotification(INVALID_PASSWORD));
      return
    }
    if (validationData.NewPassword.length < 8) {
      dispatch(setErrorNotification(MINLENGTH_VALIDATION_FAILED));
      return
    }
    if (validationData.NewPassword !== validationData.ConfirmedPassword) {
      dispatch(setErrorNotification(NEW_PASSWORD_MATCH_ERROR));
      return
    }
    dispatch(changeUserPassword(validationData.NewPassword, userPassword));
  },
  onUserDataChange: (obj) => {
    dispatch(userDataChange(obj));
  },
  onPasswordDataChange: (obj) => {
    dispatch(passwordDataChange(obj));
  }
});

const UserSettingsPage = connect(mapStateToProps, mapDispatch)(SettingsPage);

/* eslint-disable react/prop-types */
export default ({ params, context }) => {
  (function dispatchActions(dispatch) {
    dispatch(refreshUserDetails());
  }(context.store.dispatch));
  return <UserSettingsPage />;
};
/* eslint-enable react/prop-types */
