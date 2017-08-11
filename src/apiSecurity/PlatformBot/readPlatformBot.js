import { getEntitiesList, checkUserPermission, canExecuteAction } from '../commonApi';
import botService from '../../service/BotService';
import { getAllowedPermissions, getUserAccessDocs } from '../../server';
import { permissionError, authenticationError, successResponse } from '../../constants/apiResponseType';
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
  const botId = params.botId;
  const botdata = await botService.getBotData(botId);
  const platformBots = await botService.getPlatformBots(botId);
  successResponse.data = { platformBots }
  return successResponse;

}