import React from 'react';
import { connect } from 'react-redux';
import User from './User';
import { fetchAccountsList } from '../../actions/accounts';
import { fetchUnusedBots } from '../../actions/unusedBots';
import { navigate } from '../../actions/route';
import {
  setManageAccountId,
  selectBotId,
  setErrorText,
} from '../../actions/manageAccount';
import { fetchBotList } from '../../actions/accountBots';
import {
  fetchAllFlows,
  setCurrentFlowId,
  setNewBotName,
  setNewBotDetail,
  fetchBotData,
  setCurrentBotId,
  createNewBot,
  setCreateDialog,
  saveBotData,
  deleteBot,
  checkUserPermissions,
  setProgressBarFlag,
} from '../../actions/flow';

const mapStateToProps = (state) => ({
  flowList: state.botFlows.allFlows,
  botName: state.botFlows.botName,
  botId: state.botFlows.botId,
  botDetail: state.botFlows.botDescription,
  accountDetails: state.accounts.list[state.manageAccount.currentAccountId],
  unusedBots: state.unusedBots.bots,
  selectedBot: state.manageAccount.selectedBotId,
  selectedFlow: state.botFlows.currentFlowId,
  accountBots: state.accountBots.accountBots[state.manageAccount.currentAccountId],
  dialogstate: state.botFlows.createBotFlag,
  errorText: state.manageAccount.errorText,
  userId: state.auth.user.id,
  userRole: state.auth.user.roles,
});


const mapDispatch = (dispatch) => ({
  onBotSelect: (e, i, botId) => dispatch(selectBotId(botId)),
  onCreateBotClick: (botId) => {
    dispatch(setErrorText(''));
    dispatch(setCurrentBotId(''));
    dispatch(setNewBotName(''));
    dispatch(setNewBotDetail(''));
    dispatch(setCreateDialog(true));
  },
  onSubmitBotClick: (botId, botName, botDetail) => {
    if (botName) {
      dispatch(setNewBotName(botName));
      dispatch(setNewBotDetail(botDetail));
      if (botId) {
        dispatch(saveBotData(botId));
      }
      else {
        dispatch(createNewBot());
      }
      dispatch(setCreateDialog(false));
    }
    else {
      dispatch(setErrorText('Bot Name is required'));
    }
  },
  onCloseBot: () => dispatch(setCreateDialog(false)),
  onFlowSelect: (e, i, flowId) => dispatch(setCurrentFlowId(flowId)),
  onBotNameChange: (e) => dispatch(setNewBotName(e.target.value)),
  onBotDescriptionChange: (e) => dispatch(setNewBotDetail(e.target.value)),
  onEditBotClick: (accountId, botId) => {
    dispatch(setErrorText(''));
    dispatch(fetchBotData(accountId, botId));
    dispatch(setCurrentBotId(botId));
    dispatch(setCreateDialog(true));
  },
  /* eslint-disable no-console */
  onFbAccountClick: (userId, botId, botName) => {
    console.log('logging');
    window.FB.getLoginStatus(function (response) {
      if (response.status === 'connected') {
        // Logged into your app and Facebook.
        dispatch(setProgressBarFlag(true));
        dispatch(checkUserPermissions(response.authResponse.accessToken,
        response.authResponse.userID, userId, botId, botName));
      }
      else if (response.status === 'not_authorized') {
        dispatch(navigate('/accounts/user/' + userId + '/bot/' + botId + '/platform'));      
      }
      else {
        console.log('status', response);
        dispatch(navigate('/accounts/user/' + userId + '/bot/' + botId + '/platform'));
        dispatch(setNewBotName(botName));
        dispatch(setCurrentBotId(botId));
      }
    }, true);
  },
 /* eslint-enable no-console */

  onRemoveBotClick: (
    accountId, botId
  ) => dispatch(deleteBot(accountId, botId)),
});

const mergeProps = (stateProps, dispatchProps) => ({
  ...stateProps,
  ...dispatchProps,
});

const UserPage = connect(mapStateToProps, mapDispatch, mergeProps)(User);

/* eslint-disable react/prop-types */
export default function ({ params, context }) {
   const accountId = context.store.getState().auth.user.account || params.accountId;

  (function dispatchActions(dispatch) {
    const currentstate = context.store.getState();
    dispatch(fetchAllFlows(accountId));
    dispatch(fetchUnusedBots());
    dispatch(fetchAccountsList(currentstate.auth.user.id));
    dispatch(setManageAccountId(accountId));
    dispatch(fetchBotList(accountId));
  }(context.store.dispatch));

  return <UserPage />;
}
