import React from 'react';
import ForgotPassword from './ForgotPassword';
import { connect } from 'react-redux';
import {
    setEnteredMailId,
    resetPassword
} from '../../actions/auth';
import { setErrorNotification } from '../../actions/notification';
import {
    INVALID_MAIL_ID
} from '../../noticationMessages/messages';

const mapStateToProps = (state) => {
  return {
    mailId: state.auth.mailId
  };
};

const mapDispatch = (dispatch) => ({
  onEditEmail: (e) => dispatch(setEnteredMailId(e.target.value)),
  onResetPasswordClick: (mailId) => {
    const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!emailPattern.test(mailId)) {
      dispatch(setErrorNotification(INVALID_MAIL_ID));
      return;
    }
    dispatch(resetPassword());
  }

});
//export default ({ params, context }) => <Home />;
const ForgotPasswordPage = connect(mapStateToProps, mapDispatch)(ForgotPassword);

export default function ({ params, context }) {
  (function dispatchActions(dispatch) {
  }(context.store.dispatch));
  return <ForgotPasswordPage />;
}