import { isAuthenticated, checkUserPermission } from '../commonApi';
import accountService from '../../service/AccountService';
import botService from '../../service/BotService';
import { getAllowedPermissions, getUserAccessDocs } from '../../server';
import { permissionError, authenticationError, successResponse } from '../../constants/apiResponseType';
import _ from 'lodash';

// TODO

// TODO
async function canExecuteAction(acl, userId, entityType, permission, entityId) {
  if (!checkUserPermission(acl, userId, entityType, permission)) {
    return permissionError;
  }
  const userAccessDocs = await getUserAccessDocs(userId);
  if (!isAuthenticated(userAccessDocs, userId, entityType, '', entityId )) {
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
  const account = await accountService.findAccount(accountId);
  successResponse.data = { account };
  return successResponse;
}
