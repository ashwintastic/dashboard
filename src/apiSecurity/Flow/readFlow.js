import { getEntitiesList, checkUserPermission, canExecuteAction } from '../commonApi';
import botService from '../../service/BotService';
import flowService from '../../service/FlowService';
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
  const flowData = await flowService.getFlowData(params.flowId);
  let permissionResp = canExecuteAction(acl, userId, entityType, permission, flowData)
  if (permissionResp.error) {
    return permissionResp;
  }
  const flowId = params.flowId;
  const botdata = await botService.getBotData(params.botId);
  const flow = await flowService.getFlowData(flowId);
  const userAccessDocs = await getUserAccessDocs(userId);
  successResponse.data = { flow };
  return successResponse;
}