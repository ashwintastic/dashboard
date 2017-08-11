import {
  checkUserPermission, 
  canExecuteAction,
  getTestlinkUrl,
  removeFlowOverrides
} from '../commonApi';
import testlinkService from '../../service/TestlinkService';
import flowOverridesService from '../../service/FlowOverridesService';
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
  let permissionResp = canExecuteAction(acl, userId, entityType, permission, params);
  if (permissionResp.error) {
    return permissionResp;
  }

  try {
    const testerId = params.testerId;
    const flowId = params.flowId;
    const testLinks = await testlinkService.getTestLinksForTester(testerId);
    const testLinkIds = testLinks.map(function (testLink) {
      return testLink._id;
    });
    await testlinkService.deleteTester(testerId, flowId);
    removeFlowOverrides(testLinkIds);
    return successResponse;
  } catch (e) {
    console.log(e);
    requestFailError.data = e;
    return requestFailError;
  }

}