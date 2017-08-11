import React from 'react';
import { connect } from 'react-redux';
import Accounts from './Accounts';
import {
  deleteAccountEntry,
  fetchAccountDetails,
  editAccountEntry,
  createAccountEntry
} from '../../actions/accounts';

import { setCurrentAccountId, clearCurrentAccountTimeZone } from '../../actions/analytics';

import { refreshUserDetails } from '../../actions/auth';
import { redirect, navigate } from '../../actions/route';

const mapStateToProps = (state) => ({
  accounts: state.accounts.list,
  userId: state.auth.user.id,
  accountPerms: state.accounts ? state.accounts.accountPerms : []
});
const mapDispatch = (dispatch) => ({

  onNavigate: (accountId) => {
    dispatch(redirect(`/accounts/manage/${accountId}`));
  },

  onCreateAccountEntry: () => {
    dispatch(createAccountEntry());
    dispatch(navigate('/accounts/createAccount'));
  },

  onRemoveAccountClick: (
    accountId
  ) => { dispatch(deleteAccountEntry(accountId));
  },

  onEditAccountClick: (
    accountId
  ) => {
    dispatch(fetchAccountDetails(accountId));
    dispatch(editAccountEntry(accountId));
    dispatch(navigate('/accounts/' + accountId +'/edit'));
  },

  onAnalyticsClick: (accountId) => {
        dispatch(setCurrentAccountId(accountId));
        dispatch(navigate('/analytics/v1/overview'));
  },

  clearCurrentAccountTimeZone: () => {
      dispatch(clearCurrentAccountTimeZone());
  }

});
const AccountsPage = connect(mapStateToProps, mapDispatch)(Accounts);

/* eslint-disable react/prop-types */
export default ({ context }) => {

  (function dispatchActions(dispatch) {
    dispatch(refreshUserDetails());
  }(context.store.dispatch));
  return <AccountsPage />;
};
/* eslint-enable react/prop-types */
