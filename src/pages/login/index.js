import React from 'react';
import Login from './Login';
import { unsetPromptUserFlag } from '../../actions/auth';

// //export default ({ params, context }) => <Home />;
// export default function ({ params, context, query }) {
//   return (<Login />);
// }
import { login } from '../../actions/auth';
import { connect } from 'react-redux';
import { navigate } from '../../actions/route';
import {
  setManageAccountId,
  selectBotId,
  setErrorText,
  refreshBot,
  setBotRefreshState,
} from '../../actions/manageAccount';
import { fetchBotList } from '../../actions/accountBots';

const mapStateToProps = (state) => ({
    shouldPromtUserForLogin: state.auth.unAuthorizedPrompt
});

const mapDispatch = (dispatch) => ({
    onLoginClick: (
        email, password
    ) => {
        console.log('dispatching login ---------', email, password)
        dispatch(setErrorText(''));
        dispatch(login({ email: email, password: password }))
    },
    unsetPromptUserFlag: () => {
        console.log('unsetting prompt flag');
        dispatch(unsetPromptUserFlag())}
    }
);

const mergeProps = (stateProps, dispatchProps) => ({
  ...stateProps,
  ...dispatchProps,
});

const LoginPage = connect(mapStateToProps, mapDispatch, mergeProps)(Login);

/* eslint-disable react/prop-types */
// export default function ({ params, context }) {
//   return <LoginPage />;
// }

export default LoginPage;
