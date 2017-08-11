import React from 'react';
import { connect } from 'react-redux';
import CreateAccountPage from './CreateAccount';
import { refreshUserDetails } from '../../actions/auth';
import {
  saveAccountEntry,
  accountEntryDataChange,
  createNewAccount,
  fetchAccountDetails
} from '../../actions/accounts';
import { redirect } from '../../actions/route';
import {
  setManageAccountId
} from '../../actions/manageAccount';
import {
  setErrorText
} from '../../actions/manageAccount';

const mapStateToProps = (state) => {
  return {
    accountEntryData: state.accounts.accountEntryData,
    userId: state.auth.user.id,
    userEmail: state.auth.user.email,
    accountId: state.manageAccount.currentAccountId,
    errorText: state.manageAccount.errorText
  };
};

const mapDispatch = (dispatch) => ({
  onSaveAccountEntry: (accountEntryData, userId, userEmail, accountId) => {
    if (accountEntryData.name) {
      dispatch(setErrorText(''));
      if (accountId) {
        dispatch(saveAccountEntry(accountEntryData, userId, userEmail, accountId));
      }
      else {
        dispatch(createNewAccount(accountEntryData, userId, userEmail));
      }
    }
    else {
      dispatch(setErrorText('Account name is required.'));
    }
  },
  onAccountEntryDataChange: (obj) => {
    dispatch(accountEntryDataChange(obj));
  },
  onCancelAccountEntry: () => {
    dispatch(setErrorText(''));
    dispatch(redirect('/accounts'));
  }

});

const AccountCreationPage = connect(mapStateToProps, mapDispatch)(CreateAccountPage);

/* eslint-disable react/prop-types */
export default ({ params, context }) => {
  const accountId = params.accountId || '';
  let isCreateFlow = true;
  (function dispatchActions(dispatch) {
    dispatch(refreshUserDetails());
    if (accountId) {
      dispatch(setManageAccountId(accountId));
      dispatch(fetchAccountDetails(accountId));
      isCreateFlow = false;
    } else {
        dispatch(setManageAccountId(''));
        isCreateFlow = true;
    }
    dispatch(setErrorText(''));
  }(context.store.dispatch));
  return <AccountCreationPage isCreateFlow={isCreateFlow}/>;
};
/* eslint-enable react/prop-types */
