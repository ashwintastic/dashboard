import React from 'react';
import { connect } from 'react-redux';
import PublishBot from './PublishBot';
import { redirect, navigate } from '../../actions/route';
import {
  fetchLinkedPages,
  setNewBotName,
  setCurrentBotId,
  getLinkedPages,
  reloadPageList,
  setProgressBarFlag,
  checkUserPermissions,
} from '../../actions/flow';
import { refreshUserDetails } from '../../actions/auth';
import { botworx } from '../../config';

const mapStateToProps = (state) => ({
  pageList: state.botFlows.allPages,
  botId: state.botFlows.botId,
  botName: state.botFlows.botName,
  DeployedPageList: state.botFlows.platformBotInfo,
  userId: state.auth.user.id,
  rejectedPermissionsList: state.botFlows.userPermissions.length != 0 ?
    state.botFlows.userPermissions.requiredRejected : [],
  requirePermissionFlag: state.botFlows.requirePermissionFlag,
});

const mapDispatch = (dispatch) => ({
  /* eslint-disable no-console */
  onFbLoginClick: (userId, botId, botName) => {
    console.log('logging');
    const requiredPerm = Object.keys(botworx.permissions.required);
    const optionalPerm = Object.keys(botworx.permissions.optional);
    const permissionScope = (requiredPerm).concat(optionalPerm);
    window.FB.login(function (response) {
      console.log(response);
      if (response.status === 'connected') {
        // Logged into your app and Facebook.
        dispatch(setProgressBarFlag(true));
        dispatch(checkUserPermissions(response.authResponse.accessToken, response.authResponse.userID,
          userId, botId, botName));
      } else if (response.status === 'not_authorized') {
        // The person is logged into Facebook, but not authorized to your app.
        console.log('Please log into this app');
        dispatch(navigate('/accounts/user/' + userId + '/bot/' + botId + '/platform'));
      } else {
        // The person is not logged into Facebook, so we're not sure if
        // they are logged into this app or not.
        console.log('Please log into facebook');
        dispatch(navigate('/accounts/user/' + userId + '/bot/' + botId + '/platform'));
        dispatch(setNewBotName(botName));
        dispatch(setCurrentBotId(botId));
      }
    }, {
        scope: permissionScope.toString(),
        return_scopes: true,
        auth_type: 'rerequest',
      });
  },
  /* eslint-enable no-console */
});

const PublishBotPage = connect(mapStateToProps, mapDispatch)(PublishBot);

/* eslint-disable react/prop-types */
export default ({ context, params }) => {

  (function dispatchActions(dispatch) {
    const currentstate = context.store.getState();
    const botId = currentstate.botFlows.botId || params.botId;
    const botName = currentstate.botFlows.botName || '';
    const userId = currentstate.auth.user.id || params.userId;
    dispatch(setCurrentBotId(botId));
    dispatch(refreshUserDetails());
    if (typeof window !== 'undefined') {
      window.FB.getLoginStatus(function (response) {
        if ((response.status === 'connected')) {
          dispatch(checkUserPermissions(response.authResponse.accessToken, response.authResponse.userID,
            userId, botId, botName))
        }
        else {
          console.log('Not Connected')
        }
      }, true);
    }
    dispatch(fetchLinkedPages(botId));
  } (context.store.dispatch));
  return <PublishBotPage />;
};
/* eslint-enable react/prop-types */
