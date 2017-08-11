import { checkUserPermission, isAuthenticated } from '../commonApi';
import accountService from '../../service/AccountService';
import botService from '../../service/BotService';
import { getAllowedPermissions, getUserAccessDocs } from '../../server';
import { permissionError, authenticationError, successResponse } from '../../constants/apiResponseType';
import { entityType as entityTypeConst } from '../../constants/entityType';
import _ from 'lodash';

// TODO
async function canExecuteAction(acl, userId, entityType, permission, entityId) {
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


export async function executeAction(acl, userId, userRole, entityType, permission, accountId) {
  let permissionResp = canExecuteAction(acl, userId, entityType, permission, accountId);
  if (permissionResp.error) {
    return permissionResp;
  }
  let bots = [];
  let response = {};
  const allbots = await botService.getBotsForAccount(accountId);
  const userAccessDocs = await getUserAccessDocs(userId);
  if (userAccessDocs.length) {
    bots = await getEntitiesList(userAccessDocs, allbots, entityTypeConst.BOT, accountId);
  }
  response = await postAction(bots, userRole, entityType);
  successResponse.data = response;
  return successResponse;
}

async function postAction(bots, userRole, entityType) {
  const allowedPermissions = await getAllowedPermissions(userRole, entityTypeConst.BOT);
  return { bots, allowedPermissions }
}

async function getEntitiesList(userAccessDocs, entities, entityType, accountId) {
  let filteredEntity = [];
  if (_(userAccessDocs).find(x => (x.entityType === '*') && x.entityId === '*')) {
    return entities;
  }
  userAccessDocs.map(x => {
    if (x.entityType === entityType) {
      let entityData = _(entities).find(y => (x.entityId == y._id))
      if (entityData) {
        filteredEntity.push(entityData);
      }
    }
  });
  if (!filteredEntity.length){
    if (_(userAccessDocs).find(x => (x.entityType === entityTypeConst.ACCOUNT) && x.entityId === accountId)){
      return entities;
    }
  }
  return filteredEntity;
}