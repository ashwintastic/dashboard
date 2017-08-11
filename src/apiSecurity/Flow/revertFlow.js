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
export async function executeAction(acl, userId, entityType, permission, params) {
  const flowData = await flowService.getFlowData(params.flowId);
  let permissionResp = canExecuteAction(acl, userId, entityType, permission, flowData)
  if (permissionResp.error) {
    return permissionResp;
  }
  try {
    const botId = params.botId;
    const bot = await botService.getBotData(botId);
    if (bot.prevFlowId) {
      bot.flowId = bot.prevFlowId;
    }
    bot.prevFlowId = null;
    await botService.save(bot);
    return successResponse;
  } catch (e) {
    /* eslint-disable no-console */
    console.log(e);
    requestFailError.data = e;
    return requestFailError;
    /* eslint-enable no-console */
  }

}