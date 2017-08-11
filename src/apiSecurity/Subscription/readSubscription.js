import { getEntitiesList, checkUserPermission, canExecuteAction } from '../commonApi';
import subscriptionService from '../../service/SubscriptionService';
import  broadcastService  from '../../service/BroadcastService';
import  botService  from '../../service/BotService';
import { getAllowedPermissions, getUserAccessDocs } from '../../server';
import { permissionError, authenticationError, successResponse } from '../../constants/apiResponseType';
import _ from 'lodash';
import fetch from 'node-fetch';

// TODO
async function preAction() {

}

async function postAction() {

}

export async function executeAction(acl, userId, entityType, permission, botId, accountId) {
  let subscriptionEntries;
  if(botId){
    subscriptionEntries = await broadcastService.getSubscriptionsForBot(botId);
  } else if(accountId){
    subscriptionEntries = await subscriptionsService.get(accountId);
  }
  const botData = await botService.getBotData(botId);
  let permissionResp = await canExecuteAction(acl, userId, entityType, permission, botData);
  if (permissionResp.error) {
    return permissionResp;
  }
  successResponse.data = { subscriptionEntries }
  return successResponse;
}
