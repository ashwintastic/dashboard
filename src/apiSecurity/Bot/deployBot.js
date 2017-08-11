import { getEntitiesList, checkUserPermission, canExecuteAction } from '../commonApi';
import accountService from '../../service/AccountService';
import botService from '../../service/BotService';
import userService from '../../service/UserService'; 
import { getAllowedPermissions, getUserAccessDocs } from '../../server';
import { auth } from '../../config';
import { permissionError, authenticationError, successResponse } from '../../constants/apiResponseType';
import _ from 'lodash';
import fetch from 'node-fetch';


// TODO
async function preAction() {

}

async function postAction() {

}

export async function executeAction(acl, userId, entityType, permission, params) {
  const botData = await botService.getBotData(params.botId);
  let permissionResp = canExecuteAction(acl, userId, entityType, permission, botData)
  if (permissionResp.error) {
    return permissionResp;
  }

  var shortAccessToken = params.accessToken;
  var userId = params.userId;
  var fbUserId = params.fbUserId;
  const botId = params.botId;
  const platform = params.platform;
  const currentUserPages = await getPagelist(shortAccessToken, userId, fbUserId)
  //console.log('currentUserPages', currentUserPages);
  const deployedPages = await getDeployedPages(botId, platform);
  //console.log('deployedPages', deployedPages);
  const deployedBots = _(deployedPages).filter(x => x.deployed).value();
  _(currentUserPages).each(x => {
    const plBotForPage = _(deployedBots).find(y => y.id === x.id && y.deployed);
    if (plBotForPage) {
      x.deployed = true;
      x.deploymentDetails = plBotForPage.deploymentDetails;
      _.remove(deployedBots, bot => bot.id === plBotForPage.id);
    }
  });
  const otherUserPages = deployedBots;
  const allPages = { currentUserPages, otherUserPages };
  //console.log(allPages);
  successResponse.data = allPages;
  return successResponse;
}

async function getPagelist(shortAccessToken, userId, fbUserId) {
    const appId = auth.facebook.id;
    const appSecret = auth.facebook.secret;
    // getting Permanent user access token

    const fetchUrl = 'https://graph.facebook.com/oauth/access_token?grant_type=fb_exchange_token&client_id='
        + auth.facebook.id + '&client_secret=' + auth.facebook.secret + '&fb_exchange_token='
        + shortAccessToken;
    const resp = await fetch(fetchUrl);

    let permanentAccessToken = (await resp.json()).access_token;

    const pageResponse = await (await fetch('https://graph.facebook.com/me/accounts?access_token=' + permanentAccessToken)).json();

    const pageList = pageResponse.data;
    await Promise.all(pageList.map(async p => {
        const url = `${auth.facebook.graphApiBase}/${p.id}/picture`
        const pagePicture = await fetch(url, { redirect: 'manual' });
        p.imageUrl = pagePicture.url;
        return p
    }));

    const currentUser = await userService.findUser(userId);
    currentUser.tokens = currentUser.tokens || {};
    currentUser.tokens[fbUserId] = permanentAccessToken;
    await userService.save(currentUser);
    return pageList;
}

// add api to get pagelist on reload

async function getDeployedPages(botId, platform) {
    const platformBots = await botService.getPlatformBots(botId, platform);
    if (!(platformBots || platformbots.length)) {
        return [];
    }

    const asyncCalls = [];
    for (const platformBot of platformBots) {
        // call fb api to see if subscribed
        console.log("platformBot", platformBot)
        // if (!(platformBot.config && platformBot.config.pageAccessToken)) {
        //     console.log('Invalid platform bot');
        //     platformBot.deployed = false;
        //     await markPlatformBotInvalid(platformBot);
        //     continue;
        // }
        const pageAccessToken = platformBot.config.pageAccessToken;
        const fetchUrl = `https://graph.facebook.com/${platformBot.platformBotId}/subscribed_apps?access_token=${pageAccessToken}`;
        const promise = fetch(fetchUrl);
        asyncCalls.push(promise);

    }
    const resp = await Promise.all(asyncCalls);
    for (let [idx, value] of resp.entries()) {
        const subscribedApps = (await value.json()).data;
        const platformBot = platformBots[idx];
        const botworxApp = _(subscribedApps).find(subscribedApp => subscribedApp.id === auth.facebook.id);
        if (!botworxApp) {
            // TODO Our app is not subscribed, some issue with deployement (must be removed)
            await markPlatformBotInvalid(platformBot, true);
            platformBot.deployed = false;
        } else {
            //console.log('deployment found ----------');
            if (platformBot.invalid === true) {
                await markPlatformBotInvalid(platformBot, false);
            }
            platformBot.deployed = true;
        }
    }
    const deployedPages = platformBots.map(x => {
        return {
            id: x.platformBotId,
            access_token: x.config.pageAccessToken,
            category: x.category,
            name: x.name,
            deploymentDetails: x.deploymentDetails,
            deployed: x.deployed
        }
    });
    return deployedPages;
}

async function markPlatformBotInvalid(platformBot, botStatus) {
    platformBot.invalid = botStatus;
    const updatedPlatformBot = await botService.savePlatformBot(platformBot);
}