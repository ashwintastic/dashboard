import { getEntitiesList, checkUserPermission, canExecuteAction } from '../commonApi';
import pollingService from '../../service/PollService';
import botService from '../../service/BotService';
import { getAllowedPermissions, getUserAccessDocs } from '../../server';
import {permissionError, authenticationError, successResponse } from '../../constants/apiResponseType';
import _ from 'lodash';
import {
    ACTIVE_POLL,
    INACTIVE_POLL,
    CLOSED_POLL,
    PENDING_POLL,
} from '../../pages/pollTypes/pollType';


// TODO
async function preAction() {

}

async function postAction() {

}


export async function executeAction(acl, userId, entityType, permission, botId, query) {
  const botData = await botService.getBotData(botId);
  let permissionResp = canExecuteAction(acl, userId, entityType, permission, botData)
  if (permissionResp.error) {
    return permissionResp;
  }
  let inActivePolls = {};
  let closedPolls = {};
  let pendingPolls = {};
  let activePolls = {};
  let paging = {
    "page": parseInt(query.page),
    "size": parseInt(query.size),
  };
  let pollType = query.type;
  switch (pollType) {
    case ACTIVE_POLL: {
      activePolls = await pollingService.getAllActivePolls({ botId }, { paging });

      break;
    }
    case INACTIVE_POLL: {
      inActivePolls = await pollingService.getAllInactivePolls({ botId }, { paging });

      break;
    }
    case CLOSED_POLL: {
      closedPolls = await pollingService.getAllClosedPolls({ botId }, { paging });

      break;
    }
    case PENDING_POLL: {
      pendingPolls = await pollingService.getAllPendingPolls({ botId }, { paging });
      break;
    }
  }
  successResponse.data = {
    activePolls,
    inActivePolls,
    closedPolls,
    pendingPolls,
  }
  return successResponse;
}
