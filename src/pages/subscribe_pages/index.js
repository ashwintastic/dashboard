import React from 'react';
import { connect } from 'react-redux';
import FbUserPage from './FbSubscribe';
import {
  createNewPlatformBot,
  removePlatformBot,
  reloadPageList,
  fetchLinkedPages,
  setCurrentBotId,
  setProgressBarFlag,
  checkUserPermissions,
  fetchAllPlatformBots,
  setCreateDialog,
  fetchBotData,
  fetchAllFlows,
  setDeployedPlatformBot
} from '../../actions/flow';
import { fetchBotList } from '../../actions/accountBots';
import { refreshUserDetails } from '../../actions/auth';
import { redirect } from '../../actions/route';
var _ = require('lodash');

const mapStateToProps = (state) => {
  const allFlows = state.botFlows.allFlows;
  let botFlowId = state.botFlows.botFlowId;
  const botFlow = _(allFlows).find(f => (f.id === botFlowId));
  if (!botFlow) {
    botFlowId = '';
  }
  let currentUserPageList = state.botFlows.currentUserPages[state.botFlows.botId];
  let otherUserPageList = state.botFlows.otherUserPages[state.botFlows.botId];
  if (currentUserPageList) {
    currentUserPageList = _.sortBy(currentUserPageList, ['deployed', 'name']);
  }
  if (otherUserPageList) {
    otherUserPageList = _.sortBy(otherUserPageList, ['deployed', 'name']);
  }

  return {
    currentUserPageList: currentUserPageList,
    otherUserPageList: otherUserPageList,
    botId: state.botFlows.botId,
    botName: state.botFlows.botName,
    botFlowId: botFlowId,
    DeployedPageList: state.botFlows.platformBotInfo,
    errorText: state.manageAccount.errorText,
    loadProgressBarFlag: state.botFlows.loadProgressBarFlag,
    allPlatformBots: state.botFlows.allPlatformBots,
    dialogstate: state.botFlows.createBotFlag,
    deployedPlatformBot: state.botFlows.deployedPlatformBot,
    accountBots: state.accountBots.accountBots
  }
};

import { setErrorNotification } from '../../actions/notification';
import {
  NO_ACTIVE_FLOW_ERROR
} from '../../noticationMessages/messages';

const mapDispatch = (dispatch) => ({

  onDeployBotClick: (pageDetail, allPlatformBots, botFlowId, accountBots) => {
    if (!botFlowId || botFlowId === '') {
      dispatch(setErrorNotification(NO_ACTIVE_FLOW_ERROR));
      return;
    }
    window.FB.getLoginStatus(function (response) {
      dispatch(setDeployedPlatformBot(''));
      const pageLinked = _(allPlatformBots).find(p => (p.pagename === pageDetail.name && p.pageid === pageDetail.id));
      if (pageLinked && !pageLinked.invalid) {
        let allBots = [];
        for (let accountId in accountBots) {
          allBots = allBots.concat(accountBots[accountId]);
        }
        const deployedBot = _(allBots).find(b => (b.id === pageLinked.botId));
        if (deployedBot) {
          dispatch(setDeployedPlatformBot(deployedBot.name));
        }
        dispatch(setCreateDialog(true));
        return;
      }
      dispatch(setProgressBarFlag(true));
      dispatch(createNewPlatformBot(pageDetail, response.authResponse.accessToken, response.authResponse.userID));
    });
  },
  onYesClick: (pageDetail, botFlowId) => {
    if (!botFlowId || botFlowId === '') {
      dispatch(setErrorNotification(NO_ACTIVE_FLOW_ERROR));
      return;
    }
    dispatch(setCreateDialog(false));
    dispatch(setProgressBarFlag(true));
    window.FB.getLoginStatus(function (response) {
      dispatch(createNewPlatformBot(pageDetail, response.authResponse.accessToken, response.authResponse.userID));
    });
  },
  onCloseDialog: () => dispatch(setCreateDialog(false)),

  onRollbackBotClick: (accessToken, pageId, botId) => {
    window.FB.getLoginStatus(function (response) {
      console.log(response);
      dispatch(setProgressBarFlag(true));
      dispatch(removePlatformBot(accessToken, pageId, botId,
        response.authResponse.accessToken, response.authResponse.userID));
    });
  },
});

const FacebookUserPage = connect(mapStateToProps, mapDispatch)(FbUserPage);

/* eslint-disable react/prop-types */
export default ({ params, context }) => {
  (function dispatchActions(dispatch) {
    const currentstate = context.store.getState();
    const accountId = params.accountId || -1;
    const botId = currentstate.botFlows.botId || params.botId;
    const userId = currentstate.auth.user.id || params.userId;
    const rejectedlist = currentstate.botFlows.userPermissions.requiredRejected || [];
    dispatch(refreshUserDetails());
    dispatch(setCurrentBotId(botId));
    dispatch(setProgressBarFlag(true));
    dispatch(setCreateDialog(false));
    dispatch(fetchAllPlatformBots());
    dispatch(fetchAllFlows(accountId));
    dispatch(fetchBotData(accountId, botId));
    dispatch(fetchBotList(accountId));
    if (typeof window !== "undefined") {
      window.FB.getLoginStatus(function (response) {
        if ((response.status === "connected")) {
          dispatch(checkUserPermissions(response.authResponse.accessToken, response.authResponse.userID,
            userId, botId, ''))
        }
        else {
          dispatch(redirect('/accounts/user/' + userId + '/bot/' + botId + '/platform'));
        }

      }, true);
    }
  }(context.store.dispatch));
  return <FacebookUserPage />;
};
    /* eslint-enable react/prop-types */
