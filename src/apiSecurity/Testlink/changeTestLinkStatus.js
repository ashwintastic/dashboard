import {
  checkUserPermission,
  removeFlowOverrides,
  sendTestInvitationMail,
  canExecuteAction
} from '../commonApi';
import testlinkService from '../../service/TestlinkService';
import botService from '../../service/BotService';
import flowService from '../../service/FlowService';
import { getAllowedPermissions, getUserAccessDocs } from '../../server';
import { permissionError, authenticationError, successResponse, requestFailError } from '../../constants/apiResponseType';
import _ from 'lodash';
import moment from 'moment';


// TODO
async function preAction() {

}

async function postAction() {

}

export async function executeAction(acl, userId, entityType, permission, params) {
  var testLink = {};
  const testlinkId = params.testlinkId;
  testLink = await flowService.getTestLink(testlinkId);
  let permissionResp = canExecuteAction(acl, userId, entityType, permission, testLink);
  if (permissionResp.error) {
    return permissionResp;
  }

  try {
    testLink.status = params.status;
    if (testLink.status === "inactive") {
      testLink.expiry = moment().add('day', 1);
    }
    await flowService.saveTestLinks(testLink);

    if (testLink.status !== "deactivated" && testLink.status !== "active") {
      const bot = await botService.getBotData(testLink.botId);
      const flow = await flowService.getFlowData(testLink.flowId);
      sendTestInvitationMail(testLink, bot.name, flow.description);
    }
    if (testLink.status === "deactivated") {
      let testlinkIds = [];
      testlinkIds.push(testlinkId)
      removeFlowOverrides(testlinkIds);
    }
    successResponse.data = { testLink };
    return successResponse;
  } catch (e) {
    console.log(e);
    requestFailError.data = e;
    return requestFailError;
  }

}