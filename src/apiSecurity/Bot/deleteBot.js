import { getEntitiesList, checkUserPermission, canExecuteAction } from '../commonApi';
import accountService from '../../service/AccountService';
import botService from '../../service/BotService';
import userAccessService from '../../service/UserAccessService';
import { getAllowedPermissions, getUserAccessDocs } from '../../server';
import { permissionError, authenticationError, successResponse } from '../../constants/apiResponseType';
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

  const userAccessDocs = await getUserAccessDocs(userId);
  await botService.deleteBotData(botId);
  const entityAccessDoc = await userAccessService.getAccessDocByEntityId(userId, botId);
  if (entityAccessDoc) {
    await userAccessService.deleteUserAccessDoc(entityAccessDoc._id);
  }

  return successResponse;
}