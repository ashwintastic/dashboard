import { checkUserPermission, canExecuteAction, sendTestInvitationMail } from '../commonApi';
import accountService from '../../service/AccountService';
import botService from '../../service/BotService';
import testlinkService from '../../service/TestlinkService';
import flowService from '../../service/FlowService';
import { getAllowedPermissions, getUserAccessDocs } from '../../server';
import { host } from '../../config';
import {permissionError, authenticationError, successResponse } from '../../constants/apiResponseType';
import _ from 'lodash';
import moment from 'moment';


// TODO
async function preAction() {

}

async function postAction() {

}

export async function executeAction(acl, userId, entityType, permission, params) {
  let permissionResp = canExecuteAction(acl, userId, entityType, permission, params);
  if (permissionResp.error) {
    return permissionResp;
  }

  const testers = params.testerIds;
  if (!(testers && testers.length)) {
    throw new Error('No users to send invitation to.');
  }
  const flowId = params.flowId;
  const botId = params.botId;
  const platformBotId = params.platformBotId;
  const testLinks = await createTestLinks({ flowId, botId, testers, platformBotId });
  successResponse.data = { testLinks };
  return successResponse;

}

async function createTestLinks(params) {
    var testLinks = [];
    for (const testerEmail of params.testers) {
        const testLinkParams = {};
        testLinkParams.flowId = params.flowId;
        testLinkParams.botId = params.botId;
        testLinkParams.testerEmail = testerEmail;
        // Default to botworx test bot
        testLinkParams.platformBotId = params.platformBotId || auth.facebook.testPageId;
        testLinkParams.platform = 'facebook';
        testLinkParams.expiry = moment().add('day', 1);
        testLinkParams.status = "inactive";
        const testLink = await createTestLink(testLinkParams);
        testLinks.push(testLink);
    }
    return testLinks;
}

async function createTestLink(testLinkParams) {
    if (!testLinkParams.testerEmail) {
        return;
    }
    let testLink = await testlinkService.createTestLink(testLinkParams);
    const bot = await botService.getBotData(testLink.botId);
    const flow = await flowService.getFlowData(testLink.flowId);

    sendTestInvitationMail(testLinkParams, bot.name, flow.description);
    return testLink;
}
