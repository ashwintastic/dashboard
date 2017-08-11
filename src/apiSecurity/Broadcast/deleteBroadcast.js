import { getEntitiesList, checkUserPermission, canExecuteAction } from '../commonApi';
import pollingService from '../../service/PollService';
import botService from '../../service/BotService';
import broadcastService from '../../service/BroadcastService';
import { getAllowedPermissions, getUserAccessDocs } from '../../server';
import { permissionError, authenticationError, successResponse, requestFailError } from '../../constants/apiResponseType';
import _ from 'lodash';
import fetch from 'node-fetch';

// TODO
async function preAction() {

}

async function postAction() {

}

export async function executeAction(acl, userId, entityType, permission, broadcastId) {
  const broadcastEntry = await broadcastService.getBroadcastEntry(broadcastId);
  let permissionResp = canExecuteAction(acl, userId, entityType, permission, broadcastEntry)
  if (permissionResp.error) {
    return permissionResp;
  }

  let pollId = '';
  try {
    if (broadcastEntry.jobType === 'poll-broadcast') {
      pollId = broadcastEntry.pollId;
    }
    await broadcastService.deleteBroadcastEntry(broadcastId);
    const poll = await pollingService.getPollData(pollId);

    if (poll && poll.wrapupBroadcastId) {
      poll.wrapupBroadcastId = '';
      await pollingService.save(poll);
    }
    return successResponse;
  } catch (e) {
    console.log(e);
    requestFailError.data = e;
    return requestFailError;
  }
}
