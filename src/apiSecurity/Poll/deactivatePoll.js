import { canExecuteAction } from '../commonApi';
import pollingService from '../../service/PollService';
import { getAllowedPermissions, getUserAccessDocs } from '../../server';
import { permissionError, authenticationError, successResponse, duplicateDataError } from '../../constants/apiResponseType';
import _ from 'lodash';
import fetch from 'node-fetch';


// TODO
async function preAction() {

}

async function postAction() {

}

export async function executeAction(acl, userId, entityType, permission, params) {
  const pollId = params.pollId;
  const poll = await pollingService.getPollData(pollId);
  let permissionResp = canExecuteAction(acl, userId, entityType, permission, poll);
  if (permissionResp.error) {
    return permissionResp;
  }
  if (poll) {
    poll.startDate = null;
    poll.endDate = null;
    await pollingService.save(poll);
    return successResponse;
  }
  return duplicateDataError;

}