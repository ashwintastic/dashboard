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
export async function executeAction(acl, userId, entityType, permission, flow, params) {
  const flowData = await flowService.getFlowData(params.flowId);
  let permissionResp = canExecuteAction(acl, userId, entityType, permission, flowData)
  if (permissionResp.error) {
    return permissionResp;
  }

  const flowId = flow._id;
  const botId = flow.botId;
  if (!flowId) {
    requestFailError.data = 'FlowId cannot be null. This ui can only be used to update a flow.'
    return requestFailError;
  }

  // const whitelistApiResp = await fetch(flowEditWhitelistUrl, {
  //   method: 'get',
  //   headers: {
  //     Accept: 'application/json',
  //     'Content-Type': 'application/json',
  //   }
  // });
  // const whitelistBots = (await whitelistApiResp.json()).botIds;
  // console.log('whitelistbots', whitelistBots);

  // // if the bot is not whitelisted, do not save.
  // if (!_(whitelistBots).some(x => x === botId)) {
  //   res.status(401).send(`You do not have permission to edit flow for bot ${botId}. Ask admin to whitelist the bot.`);
  //   return;
  // }
  // // if the flow does not belong to the whitelisted bot, do not save.
  // const flows = await flowService.getFlowsForBot(botId);
  // console.log(flows);
  // if (!_(flows).some(x => x._id === flowId)) {
  //   res.status(401).send(`This flow ${flowId} does not belong to bot ${botId}`);
  //   return;
  // }
  await flowService.saveFlowData(flow);
  return successResponse;

}
