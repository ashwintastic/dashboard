import { checkUserPermission } from '../commonApi';
import accountService from '../../service/AccountService';
import botService from '../../service/BotService';
import userService from '../../service/UserService';
import userAccessService from '../../service/UserAccessService';
import { getAllowedPermissions, getUserAccessDocs, getUserRole } from '../../server';
import { permissionError, authenticationError, duplicateDataError, successResponse, requestFailError } from '../../constants/apiResponseType';
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

export async function executeAction(acl, userId, entityType, permission, params, editUserId) {
  if (!canExecuteAction(acl, userId, entityType, permission)) {
    return permissionError;
  }
  try {
    const userDetail = params.userEntry;
    console.log('user detail', userDetail);
    const user = await userService.findUser(editUserId);
    user.FirstName = userDetail.FirstName;
    user.LastName = userDetail.LastName;
    user.email = userDetail.email;
    await userService.save(user);

    var userAccountAccesses = await userAccessService.getEntityDocs(editUserId, 'account');
    var userBotAccesses = await userAccessService.getEntityDocs(editUserId, 'bot');

    await Promise.all(userAccountAccesses.map(async x => {
      if (userDetail.accounts.indexOf(x.entityId) === -1) {
        await userAccessService.deleteUserAccessDoc(x._id);
      }
    }));
    await Promise.all(userDetail.accounts.map(async y => {
      if (y) {
        await userAccessService.createUserAccessDoc(editUserId, userDetail.roles, 'account', y)
      }

    }));
    await Promise.all(userBotAccesses.map(async x => {
      if (userDetail.bots.indexOf(x.entityId) === -1) {
        await userAccessService.deleteUserAccessDoc(x._id);
      }
    }));
    await Promise.all(userDetail.bots.map(async y => {
      if (y) {
        await userAccessService.createUserAccessDoc(editUserId, userDetail.roles, 'bot', y)
      }
    }));
    return successResponse;
  } catch (e) {
    console.log(e);
    requestFailError.data = e;
    return requestFailError;
  }

}