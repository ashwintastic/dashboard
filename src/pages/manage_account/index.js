import React from 'react';
import { connect } from 'react-redux';
import ManageAccount from './ManageAccount';
import { fetchAccountsList } from '../../actions/accounts';
import { fetchUnusedBots } from '../../actions/unusedBots';
import { navigate } from '../../actions/route';
import {
  setManageAccountId,
  selectBotId,
  setErrorText,
  refreshBot,
  setBotRefreshState,
} from '../../actions/manageAccount';
import { fetchBotList } from '../../actions/accountBots';
import {
  fetchAllFlows,
  setCurrentFlowId,
  setNewBotName,
  setNewBotDetail,
  fetchBotData,
  reloadPageList,
  setCurrentBotId,
  createNewBot,
  setCreateDialog,
  saveBotData,
  deleteBot,
  checkUserPermissions,
  setProgressBarFlag,
} from '../../actions/flow';
import { setCurrentAccountTimeZone } from '../../actions/analytics';
import { refreshUserDetails } from '../../actions/auth';
import { setCurrentAccountId, setCurrentBotId as  setCurrentBotIdForAnalytics} from '../../actions/analytics';

const mapStateToProps = (state) => ({
  flowList: state.botFlows.allFlows,
  botName: state.botFlows.botName,
  botId: state.botFlows.botId,
  botDetail: state.botFlows.botDescription,
  accountDetails: state.accounts.list[state.manageAccount.currentAccountId],
  unusedBots: state.unusedBots.bots,
  selectedBot: state.manageAccount.selectedBotId,
  selectedFlow: state.botFlows.currentFlowId,
  accountBots: state.accountBots.accountBots[state.manageAccount.currentAccountId] || [],
  dialogstate: state.botFlows.createBotFlag,
  errorText: state.manageAccount.errorText,
  userRole: state.auth.user.roles,
  snackbarState: state.manageAccount.snackbarState,
  userId: state.auth.user.id,
  botPerms: state.accountBots.botPerms,
  allAccounts: state.accounts.list,
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
  onRefreshBotClick: (botId) => {
    dispatch(refreshBot(botId))
  },
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
  onFbAccountClick: (userId, botId, botName, accountId) => {
    console.log('logging');
    window.FB.getLoginStatus(function (response) {
      const url = '/accounts/'+ accountId +'/bots/' + botId + '/user/' + userId + '/platform';
      if (response.status === 'connected') {
        // Logged into your app and Facebook.
        dispatch(setProgressBarFlag(true));
        dispatch(checkUserPermissions(response.authResponse.accessToken, response.authResponse.userID,
        userId, botId, botName, accountId));
      }
      else if (response.status === 'not_authorized'){
        dispatch(navigate(url));
      }
      else {
        console.log('status', response);
        dispatch(navigate(url));
        dispatch(setNewBotName(botName));
        dispatch(setCurrentBotId(botId));
      }
    }, true);
  },
  /* eslint-enable no-console */

  onRemoveBotClick: (
    accountId, botId
  ) => dispatch(deleteBot(accountId, botId)),

  onSnackbarStateClose: () => dispatch(
    setBotRefreshState(false)),

  onAnalyticsClick: (accountId, botId) => {
        dispatch(setCurrentAccountId(accountId));
        dispatch(setCurrentBotIdForAnalytics(botId));
        dispatch(navigate('/analytics/v1/overview'));
  },

  setCurrentAccountTimeZone: (tz) => {
      dispatch(setCurrentAccountTimeZone(tz));
  }

});

const mergeProps = (stateProps, dispatchProps) => ({
  ...stateProps,
  ...dispatchProps,
});

const ManageAccountPage = connect(mapStateToProps, mapDispatch, mergeProps)(ManageAccount);

/* eslint-disable react/prop-types */
export default function ({ params, context }) {
  const accountId = params.accountId;
  (function dispatchActions(dispatch) {
    const currentstate = context.store.getState();
    dispatch(refreshUserDetails());
    dispatch(fetchAllFlows(accountId));
    dispatch(fetchUnusedBots());
    dispatch(fetchAccountsList(currentstate.auth.user.id));
    dispatch(setManageAccountId(accountId));
    dispatch(fetchBotList(accountId));
  } (context.store.dispatch));

  return <ManageAccountPage />;
}
