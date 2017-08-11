import { getEntitiesList, checkUserPermission, canExecuteAction } from '../commonApi';
import botService from '../../service/BotService';
import flowService from '../../service/FlowService';
import { getAllowedPermissions, getUserAccessDocs, getUserRole } from '../../server';
import { permissionError, authenticationError, successResponse } from '../../constants/apiResponseType';
import _ from 'lodash';


// TODO
async function preAction() {

}

async function postAction() {

}

export async function executeAction(acl, userId, entityType, permission, botId) {
  const botData = await botService.getBotData(botId);
  let permissionResp = canExecuteAction(acl, userId, entityType, permission, botData)
  if (permissionResp.error) {
    return permissionResp;
  }
  const userRole = await getUserRole(userId);
  const userAccessDocs = await getUserAccessDocs(userId);
  const flows = await flowService.getFlowsForBot(botId);
  const allowedPermissions = await getAllowedPermissions(userRole, 'flow');
  successResponse.data = { flows, allowedPermissions };
  return successResponse;
}
