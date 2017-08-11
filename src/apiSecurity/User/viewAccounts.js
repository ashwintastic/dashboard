import { checkUserPermission } from '../commonApi';
import accountService from '../../service/AccountService';
import botService from '../../service/BotService';
import { getAllowedPermissions, getUserAccessDocs, getUserRole } from '../../server';
import { permissionError, authenticationError, successResponse } from '../../constants/apiResponseType';
import {entityType as entityTypeConst } from '../../constants/entityType';
import _ from 'lodash';

// TODO
async function preAction() {

}

async function canExecuteAction(acl, userId, entityType, permission) {
  if (!checkUserPermission(acl, userId, entityType, permission)) {
    return false;
  }
  return true;
}

export async function executeAction(acl, userId, entityType, permission) {
  let response = {};
  let accounts = [];
  if (!canExecuteAction(acl, userId, entityType, permission)) {
    return permissionError;
  }

  const sortOptions = {
      sortBy : "name",
      isAscending : true
  }
  const allAccounts = await accountService.getAccountsList(sortOptions);
  const userRole = await getUserRole(userId);
  const userAccessDocs = await getUserAccessDocs(userId);
  if (userAccessDocs.length) {
    accounts = await getEntitiesList(userAccessDocs, allAccounts, entityTypeConst.ACCOUNT);
  }
  response = await postAction(accounts, userRole, entityType);
  successResponse.data = response;
  return successResponse;
}

async function postAction(accounts, userRole, entityType) {
  const allowedPermissions = await getAllowedPermissions(userRole, entityTypeConst.ACCOUNT);
  return { accounts, allowedPermissions }

}

async function getEntitiesList(userAccessDocs, entities, entityType) {
  let filteredEntity = [];
  if (_(userAccessDocs).find(x => (x.entityType === '*') && x.entityId === '*')) {
    return entities;
  }
  userAccessDocs.map(x => {
    if (x.entityType === entityType) {
      filteredEntity.push(_(entities).find(y => (x.entityId == y._id)));
    }
  });
  return filteredEntity;
}
