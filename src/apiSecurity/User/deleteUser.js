import { checkUserPermission } from '../commonApi';
import accountService from '../../service/AccountService';
import botService from '../../service/BotService';
import userService from '../../service/UserService';
import userAccessService from '../../service/UserAccessService';
import { getAllowedPermissions, getUserAccessDocs, getUserRole } from '../../server';
import { permissionError, authenticationError, successResponse, requestFailError } from '../../constants/apiResponseType';
import _ from 'lodash';

// TODO

async function canExecuteAction(acl, userId, entityType, permission) {
  if (!checkUserPermission(acl, userId, entityType, permission)) {
    return false;
  }
  return true;
}

async function postAction() {

}

async function postAction() {

}

export async function executeAction(acl, userId, entityType, permission, entityId, editUserId) {
  if (!canExecuteAction(acl, userId, entityType, permission)) {
    return permissionError;
  }
  try {
    const entityDoc = await userAccessService.getAccessDocByEntityId(editUserId, entityId);
    await userAccessService.deleteUserAccessDoc(entityDoc._id);
    return successResponse;
  } catch (e) {
    console.log(e);
    requestFailError.data = e;
    return requestFailError;
  }

}