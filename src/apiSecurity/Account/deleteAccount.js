import { checkUserPermission, isAuthenticated } from '../commonApi';
import accountService from '../../service/AccountService';
import botService from '../../service/BotService';
import { getAllowedPermissions, getUserAccessDocs } from '../../server';
import userAccessService from '../../service/UserAccessService';
import { permissionError, authenticationError, successResponse } from '../../constants/apiResponseType';
import _ from 'lodash';


// TODO
async function canExecuteAction(acl, userId, entityType, permission,entityId) {
  if (!checkUserPermission(acl, userId, entityType, permission)) {
    return permissionError;
  }
  const userAccessDocs = await getUserAccessDocs(userId);
  if (!isAuthenticated(userAccessDocs, userId, entityType, '', entityId)) {
    return authenticationError;
  }
  return successResponse;
}

async function preAction() {

}

async function postAction() {

}

export async function executeAction(acl, userId, entityType, permission, accountId) {
  let permissionResp = canExecuteAction(acl, userId, entityType, permission, accountId);
  if (permissionResp.error) {
    return permissionResp;
  }
  await accountService.deleteAccountEntry(accountId);
  const entityAccessDoc = await userAccessService.getAccessDocByEntityId(userId, accountId);
  if (entityAccessDoc) {
    await userAccessService.deleteUserAccessDoc(entityAccessDoc._id);
  }
  return successResponse;
}

