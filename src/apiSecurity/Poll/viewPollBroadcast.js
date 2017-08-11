import { canExecuteAction, processPollBeforeSave } from '../commonApi';
import broadcastService from '../../service/BroadcastService';
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
  const pollData = await pollingService.getPollData(params.pollId);
  let permissionResp = canExecuteAction(acl, userId, entityType, permission, pollData);
  if (permissionResp.error) {
    return permissionResp;
  }

  const botId = params.botId;
  const pollId = params.pollId;
  const pollBroadcasts = await broadcastService.getBroadcastEntriesForPoll(botId, pollId);
  successResponse.data = { pollBroadcasts };
  return successResponse;

}