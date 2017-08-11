import { getEntitiesList, checkUserPermission, canExecuteAction } from '../commonApi';
import botService from '../../service/BotService';
import flowService from '../../service/FlowService';
import { getAllowedPermissions, getUserAccessDocs } from '../../server';
import { permissionError, authenticationError, successResponse, requestFailError } from '../../constants/apiResponseType';
import _ from 'lodash';
import fetch from 'node-fetch';

// TODO

async function preAction() {

}

async function postAction() {

}

export async function executeAction(acl, userId, entityType, permission, params, newFlow) {
  if (!canExecuteAction(acl, userId, entityType, permission)) {
    return permissionError;
  }
  const flowId = params.flowId;
  const botId = params.botId;
  try {
    if (flowId !== -1 && flowId !== '-1') {
      await flowService.saveFlowData(newFlow);
    }
    else {
      const botdata = await botService.getBotData(botId);
      const userAccessDocs = await getUserAccessDocs(userId);
      await flowService.createFlowDoc(botId, newFlow);
    }
    return successResponse;
    //}
  } catch (e) {
    /* eslint-disable no-console */
    console.log(e);
    requestFailError.data = e;
    return requestFailError;
    /* eslint-enable no-console */
  }

}