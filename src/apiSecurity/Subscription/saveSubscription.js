import { checkUserPermission, canExecuteAction } from '../commonApi';
import subscriptionService from '../../service/SubscriptionService';
import { getAllowedPermissions, getUserAccessDocs } from '../../server';
import { permissionError, authenticationError, successResponse, 
    duplicateDataError } from '../../constants/apiResponseType';
import _ from 'lodash';
import fetch from 'node-fetch';


// TODO
async function preAction() {

}

async function postAction() {

}

export async function executeAction(acl, userId, entityType, permission, params, subscription) {
  let permissionResp = canExecuteAction(acl, userId, entityType, permission, subscription);
  if (permissionResp.error) {
    return permissionResp;
  }
  if (subscription) {
    await subscriptionService.save(subscription);
    return successResponse;
  }
  return duplicateDataError;

}