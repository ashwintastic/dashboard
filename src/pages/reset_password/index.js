import React from 'react';
import ResetPassword from './ResetPassword';
import { connect } from 'react-redux';
import {
    setNewPassword,
    setResetPasswordFlag,
} from '../../actions/auth';
import { setErrorNotification } from '../../actions/notification';
import {
    NEW_PASSWORD_MATCH_ERROR,
    INVALID_PASSWORD,
    MINLENGTH_VALIDATION_FAILED,
} from '../../noticationMessages/messages';

const mapStateToProps = (state) => {
    return {
        mailId: state.auth.mailId,
        resetFlag: state.auth.resetPasswordFlag
    };
};

const mapDispatch = (dispatch) => ({
    onSetNewPasswordClick: (data) => {
        if ((!data.newPassword) || (/\s/.test(data.newPassword))) {
            dispatch(setErrorNotification(INVALID_PASSWORD));
            return
        }
        if ((data.newPassword.length < 8)) {
            dispatch(setErrorNotification(MINLENGTH_VALIDATION_FAILED));
            return
        }
        if (data.newPassword !== data.confirmedPassword) {
            dispatch(setErrorNotification(NEW_PASSWORD_MATCH_ERROR));
            return
        }
        dispatch(setNewPassword(data.newPassword))
    },

});
//export default ({ params, context }) => <Home />;
const ResetPasswordPage = connect(mapStateToProps, mapDispatch)(ResetPassword);

export default function ({ params, context }) {
    (function dispatchActions(dispatch) {
        dispatch(setResetPasswordFlag(false));
    }(context.store.dispatch));
    return <ResetPasswordPage />;
}