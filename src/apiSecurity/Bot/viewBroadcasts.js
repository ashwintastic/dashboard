import { getEntitiesList, checkUserPermission, canExecuteAction } from '../commonApi';
import accountService from '../../service/AccountService';
import botService from '../../service/BotService';
import broadcastService from '../../service/BroadcastService';
import pollingService from '../../service/PollService';
import { getAllowedPermissions, getUserAccessDocs, getUserRole } from '../../server';
import {permissionError, authenticationError, successResponse } from '../../constants/apiResponseType';
import _ from 'lodash';


// TODO
async function preAction() {

}

async function postAction() {

}

export async function executeAction(acl, userId, entityType, permission, botId) {
  const botData = await botService.getBotData(botId);
  let permissionResp = canExecuteAction(acl, userId, entityType, permission, botData)
  if (permissionResp.error) {
    return permissionResp;
  }
  const broadcastEntries = await broadcastService.getBroadcastEntriesForBot(botId);
  const userRole = await getUserRole(userId);
  const allowedPermissions = await getAllowedPermissions(userRole, entityType);
  successResponse.data = { broadcastEntries, allowedPermissions }
  return successResponse;
}
