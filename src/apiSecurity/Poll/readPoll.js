import { canExecuteAction } from '../commonApi';
import pollingService from '../../service/PollService';
import { getAllowedPermissions, getUserAccessDocs } from '../../server';
import { permissionError, authenticationError, successResponse } from '../../constants/apiResponseType';
import _ from 'lodash';
import fetch from 'node-fetch';


// TODO
async function preAction() {

}

async function postAction() {

}

export async function executeAction(acl, userId, entityType, permission, params) {
  const botId = params.botId;
  const poll = await pollingService.getPollData(params.pollId);
  let permissionResp = canExecuteAction(acl, userId, entityType, permission, poll);
  if (permissionResp.error) {
    return permissionResp;
  }
  successResponse.data = { poll };
  return successResponse;

}