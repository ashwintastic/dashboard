import { checkUserPermission } from '../commonApi';
import userService from '../../service/UserService';
import userAccessService from '../../service/UserAccessService';
import { getAllowedPermissions, getUserAccessDocs, getUserRole } from '../../server';
import { permissionError, authenticationError, duplicateDataError, successResponse } from '../../constants/apiResponseType';
import {entityType as entityTypeConst} from '../../constants/entityType';
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

export async function executeAction(acl, userId, entityType, permission, entityId, loggedInUserId) {
  if (!canExecuteAction(acl, userId, entityType, permission)) {
    return permissionError;
  }
  const userAccessDocs = await userAccessService.getUsersByEntity(entityId);
  const userEntries = [];

  await Promise.all(userAccessDocs.map(async x => {
    const user = await userService.findUser(x.dashboardUserId);
    if (user && (user.email !== loggedInUserId)) {
      user.roles = x.role;
      user.accounts = await getUserEntitiesList(x.dashboardUserId, entityTypeConst.ACCOUNT);
      user.bots = await getUserEntitiesList(x.dashboardUserId, entityTypeConst.BOT);
      userEntries.push(user);
    }
  }));
  successResponse.data = { userEntries };
  return successResponse;

}

// get user accounts/bots list
async function getUserEntitiesList(dashboardUserId, entityType) {
    let entityList = [];
    let entityDocs = await userAccessService.getEntityDocs(dashboardUserId, entityType);
    entityDocs.map(x => {
        entityList.push(x.entityId);
    });
    return entityList;
}
