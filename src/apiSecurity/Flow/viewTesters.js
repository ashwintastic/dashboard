import { checkUserPermission, canExecuteAction, getTestlinkUrl } from '../commonApi';
import botService from '../../service/BotService';
import flowService from '../../service/FlowService';
import { getAllowedPermissions, getUserAccessDocs } from '../../server';
import flowOverridesService from '../../service/FlowOverridesService';
import {permissionError, authenticationError, successResponse } from '../../constants/apiResponseType';
import _ from 'lodash';
import fetch from 'node-fetch';

// TODO
async function preAction() {

}

async function postAction() {

}

export async function executeAction(acl, userId, entityType, permission, flowId) {
  const flowData = await flowService.getFlowData(flowId);
  let permissionResp = canExecuteAction(acl, userId, entityType, permission, flowData)
  if (permissionResp.error) {
    return permissionResp;
  }

  let testLinks = await flowService.getTestLinks(flowId);
  const flowOverridesForFlow = await flowOverridesService.getFlowOverridesForFlow(flowId);
  const testLinksInFlowOverrides = flowOverridesForFlow.map(function (flowOverride) {
    return flowOverride['testLinkId'];
  });

  for (var i = 0, len = testLinks.length, testLink; i < len; i++) {
    testLink = testLinks[i];
    testLinks[i].url = getTestlinkUrl(testLink);
    if (testLink.status === "active") {
      if (testLinksInFlowOverrides.indexOf(testLink._id) < 0) {
        testLinks[i].status = "deactivated";
      }
    }
  }
  const userAccessDocs = await getUserAccessDocs(userId);
  successResponse.data = { testLinks };
  return successResponse;
}
