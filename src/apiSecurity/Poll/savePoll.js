import { canExecuteAction, processPollBeforeSave } from '../commonApi';
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

export async function executeAction(acl, userId, entityType, permission, params, poll) {
  let permissionResp = canExecuteAction(acl, userId, entityType, permission, poll);
  if (permissionResp.error) {
    return permissionResp;
  }
  const pollId = params.pollId;

  poll = processPollBeforeSave(poll);
  if (poll) {
    delete poll.startTime;
    delete poll.endTime;
    await pollingService.save(poll);
    return successResponse;
  }
  return duplicateDataError;

}