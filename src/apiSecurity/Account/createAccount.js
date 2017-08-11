import { getEntitiesList, checkUserPermission } from '../commonApi';
import accountService from '../../service/AccountService';
import botService from '../../service/BotService';
import userService from '../../service/UserService';
import userAccessService from '../../service/UserAccessService';
import { getAllowedPermissions, getUserAccessDocs, getUserRole } from '../../server';
import { permissionError, authenticationError, duplicateDataError, successResponse } from '../../constants/apiResponseType';
import _ from 'lodash';

// TODO
async function canExecuteAction(acl, userId, entityType, permission) {
  if (!checkUserPermission(acl, userId, entityType, permission)) {
    return false;
  }
  return true;
}

async function preAction() {

}

async function postAction() {

}

export async function executeAction(acl, userId, entityType, permission, accountDetail) {
  if (!canExecuteAction(acl, userId, entityType, permission)) {
    return permissionError;
  }
  const userRole = await getUserRole(userId);
  const existingAccount = await accountService.getAccountByDetail(accountDetail.name);
  if (!existingAccount) {
    await accountService.createNewAccount(accountDetail);
    const userAccessDocs = await getUserAccessDocs(userId);
    if (!_(userAccessDocs).find(x => (x.entityType === '*') && x.entityId === '*')) {
      const newaccount = await accountService.getAccountByDetail(accountDetail.name);
      if (newaccount) {
        await userAccessService.createUserAccessDoc(userId, userRole, entityType, newaccount._id);
      }
    }
    return successResponse;
  }
  else {
    console.log('existingAccount', existingAccount);
    return duplicateDataError;
  }
}
