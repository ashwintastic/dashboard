import { getEntitiesList, checkUserPermission, canExecuteAction } from '../commonApi';
import broadcastService from '../../service/BroadcastService';
import { getAllowedPermissions, getUserAccessDocs } from '../../server';
import { permissionError, authenticationError, successResponse } from '../../constants/apiResponseType';
import _ from 'lodash';
import fetch from 'node-fetch';

// TODO
async function preAction() {

}

async function postAction() {

}

export async function executeAction(acl, userId, entityType, permission, broadcastId) {
  const updatedBroadcastEntry = await broadcastService.getBroadcastEntry(broadcastId);
  let permissionResp = canExecuteAction(acl, userId, entityType, permission, updatedBroadcastEntry)
  if (permissionResp.error) {
    return permissionResp;
  }
  successResponse.data = { updatedBroadcastEntry }
  return successResponse;
}
