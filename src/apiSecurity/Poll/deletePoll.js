import { canExecuteAction } from '../commonApi';
import pollingService from '../../service/PollService';
import { getAllowedPermissions, getUserAccessDocs } from '../../server';
import { permissionError, authenticationError, successResponse, requestFailError } from '../../constants/apiResponseType';
import _ from 'lodash';
import fetch from 'node-fetch';


// TODO
async function preAction() {

}

async function postAction() {

}

export async function executeAction(acl, userId, entityType, permission, params) {
  const pollData = await pollingService.getPollData(params.pollId);
  let permissionResp = canExecuteAction(acl, userId, entityType, permission, pollData);
  if (permissionResp.error) {
    return permissionResp;
  }
  try {
    const pollId = params.pollId;
    await pollingService.deletePoll(pollId);
    return successResponse;
  } catch (e) {
    console.log(e);
    requestFailError.data = e;
    return requestFailError;
  }

}