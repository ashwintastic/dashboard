import { getEntitiesList, checkUserPermission, canExecuteAction } from '../commonApi';
import accountService from '../../service/AccountService';
import botService from '../../service/BotService';
import userAccessService from '../../service/UserAccessService';
import { getAllowedPermissions, getUserAccessDocs, getUserRole } from '../../server';
import { permissionError, authenticationError, successResponse } from '../../constants/apiResponseType';
import _ from 'lodash';


// TODO

async function preAction() {

}

async function postAction() {

}

export async function executeAction(acl, userId, entityType, permission, params) {
  let permissionResp = canExecuteAction(acl, userId, entityType, permission, params)
  if (permissionResp.error) {
    return permissionResp;
  }
  const name = params.name;
  const account = params.account;
  const description = params.description;
  const flowId = params.flowId;
  const userAccessDocs = await getUserAccessDocs(userId);
  const userRole = await getUserRole(userId);
  await botService.createNewBotDoc(name, account, description, flowId);
  if (!_(userAccessDocs).find(x => (x.entityType === '*') && x.entityId === '*')) {
    const newbot = await botService.getBotByDetail(name, account);
    if (newbot) {
      await userAccessService.createUserAccessDoc(userId, userRole, entityType, newbot._id);
    }
  }
  return successResponse;
}
