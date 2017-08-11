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
    const botId = params.botId;
    const userAccessToken = params.userAccessToken;
    const platform = params.platform;
    const fbPage = params.platformBot;
    const name = fbPage.name;
    const category = fbPage.category;
    const accessToken = fbPage.access_token;
    const platformBotId = fbPage.id;
    const config = { pageAccessToken: accessToken };

    const publishingUserResp = await fetch(`https://graph.facebook.com/me?access_token=${userAccessToken}`);
    const publishingUser = await publishingUserResp.json();
    const deploymentDetails = { user: publishingUser, page: { name, category } };

    const fetchUrl = 'https://graph.facebook.com/v2.6/' + platformBotId +
      '/subscribed_apps?access_token=' + accessToken;
    const resp = await fetch(fetchUrl, { method: 'POST' });
    const pageStatus = await resp.json();

    if (pageStatus.success) {
      await botService.createPlatformBotDoc({ botId, platformBotId, name, config, platform, deploymentDetails });
    }
    successResponse.data = { pageStatus };
    return successResponse;
  }
  catch (e) {
    /* eslint-disable no-console */
    console.log(e);
    requestFailError.data = e;
    return requestFailError;
    /* eslint-enable no-console */
  }

}