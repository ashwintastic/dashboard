import { getEntitiesList, checkUserPermission, canExecuteAction } from '../commonApi';
import accountService from '../../service/AccountService';
import botService from '../../service/BotService';
import { getAllowedPermissions, getUserAccessDocs } from '../../server';
import {permissionError, authenticationError, successResponse, requestFailError } from '../../constants/apiResponseType';
import _ from 'lodash';
import fetch from 'node-fetch';

// TODO
async function preAction() {

}

async function postAction() {

}

export async function executeAction(acl, userId, entityType, permission, params) {
  let permissionResp = canExecuteAction(acl, userId, entityType, permission, params);
  if (permissionResp.error) {
    return permissionResp;
  }
  try {
    const platformBotId = params.platformBotId; // page id
    const botId = params.botId; // bot id
    const accessToken = params.accesstoken;

    const fetchUrl = 'https://graph.facebook.com/v2.6/' + platformBotId +
      '/subscribed_apps?access_token=' + accessToken;

    const resp = await fetch(fetchUrl, { method: 'DELETE' });
    const pageStatus = await resp.json();
    if (pageStatus.success) {
      await botService.deletePageFromBot(platformBotId, botId);
    }
    else {
      console.log('throw error');
    }
    successResponse.data = { pageStatus };
    return successResponse;

  } catch (e) {
    /* eslint-disable no-console */
    console.log(e);
    requestFailError.data = e;
    return requestFailError;
    /* eslint-enable no-console */
  }
}