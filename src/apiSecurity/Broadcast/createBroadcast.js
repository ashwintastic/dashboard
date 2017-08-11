import { getEntitiesList, checkUserPermission, canExecuteAction } from '../commonApi';
import pollingService from '../../service/PollService';
import broadcastService from '../../service/BroadcastService';
import { getAllowedPermissions, getUserAccessDocs } from '../../server';
import { permissionError, authenticationError, successResponse,requestFailError } from '../../constants/apiResponseType';
import _ from 'lodash';
import fetch from 'node-fetch';

// TODO
async function preAction() {

}

async function postAction() {

}

export async function executeAction(acl, userId, entityType, permission, botId, broadcastEntry) {
  let permissionResp = canExecuteAction(acl, userId, entityType, permission, broadcastEntry)
  if (permissionResp.error) {
    return permissionResp;
  }

  try {
    if (broadcastEntry.type === "immediate") {
      broadcastEntry.repeat = "None";
    }
    if (broadcastEntry._id) {
      await broadcastService.saveBroadcastEntry(broadcastEntry);
      let broadcastNodeEntry = await broadcastService.getBroadcastNodeEntry(broadcastEntry._id)
      broadcastNodeEntry.nodes = broadcastEntry.nodes;
      await broadcastService.getBroadcastNodeEntry(broadcastNodeEntry)
    }
    else {
      const broadcast = await broadcastService.createBroadcastEntry(broadcastEntry);
      if (broadcast && broadcast.pollId) {
        const poll = await pollingService.getPollData(broadcast.pollId);
        poll.wrapupBroadcastId = broadcast._id;
        await pollingService.save(poll);
      }
    }
    return successResponse;
  } catch (e) {
    console.log(e);
    requestFailError.data = e;
    return requestFailError;
  }

}

export default executeAction;