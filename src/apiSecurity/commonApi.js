import { resourceList, host } from '../config';
import flowOverridesService from '../service/FlowOverridesService';
import userAccessService from '../service/UserAccessService';
import botService from '../service/BotService';
import flowService from '../service/FlowService';
import mailerService from '../service/MailerService';
import { entityType as entityTypeConst } from '../constants/entityType';
import { permissionError, authenticationError, successResponse } from '../constants/apiResponseType';
import { getUserAccessDocs } from '../server';
import _ from 'lodash';
import moment from 'moment';
import Promise from 'bluebird';

export async function hasAccess(acl, userId, resource, permission) {
  const isAllowed = await acl.isAllowed(userId, resource, permission);
  return isAllowed;
}

export function removeRole(acl, userId, userRole) {
  acl.removeUserRoles(userId, userRole, function (err) {
    if (err) {
      console.log('unable to remove roles', err);
    }
  });
  Object.keys(resourceList).map(x => (acl.allowedPermissions(userId, x, async (err, permissionlist) => {
    if (err) {
      console.log('error', err);
      return;
    }
    if (permissionlist) {
      acl.removeAllow(userRole, Object.keys(resourceList), permissionlist[x], (err) => {
        if (err) {
          console.log('no permissions!!');
          return;
        }
      });
    }
  })));
}

export async function checkUserPermission(acl, userId, entityType, permission) {
  const permissionFlag = await hasAccess(acl, userId, entityType, permission);
  return permissionFlag;
}

export async function canExecuteAction(acl, userId, entityType, permission, entity) {
    let check = await checkUserPermission(acl, userId, entityType, permission);
    console.log(`Permission for userId: ${userId}, for entityType: ${entityType},
    for permission ${permission} and entity: ${entity} is ${check}`);
  if (!check) {
    return permissionError;
  }
  const userAccessDocs = await getUserAccessDocs(userId);
  if (!isAuthenticated(userAccessDocs, userId, entityType, entity)) {
    return authenticationError;
  }
  return successResponse;
}

export async function isAuthenticated(userAccessDocs, userId, entityType, entity, entityId) {
  if (_(userAccessDocs).find(x => (x.entityType === '*') && x.entityId === '*')) {
    return true;
  }
  switch (entityType) {
    case entityTypeConst.ACCOUNT:
      return checkAccountAuthentication(userId, entityId);

    case entityTypeConst.BOT:
      return checkBotAuthentication(userId, entity);

    case entityTypeConst.FLOW:
      return checkBotChildAuthentication(userId, entity);

    case entityTypeConst.BROADCAST:
      return checkBotChildAuthentication(userId, entity);

    case entityTypeConst.POLL:
      return checkBotChildAuthentication(userId, entity);

    case entityTypeConst.PLATFORMBOT:
      return checkBotChildAuthentication(userId, entity);

    case entityTypeConst.TESTER:
      return checkFlowChildAuthentication(userId, entity);

    case entityTypeConst.SUBSCRIPTION:
      return checkBotChildAuthentication(userId, entity);

    default: return true;


  }
}

// check account authentication
export async function checkAccountAuthentication(userId, accountId) {
  const entityAccessDoc = await userAccessService.getAccessDocByEntityId(userId, accountId);
  if (!entityAccessDoc) {
    return false;
  }
  return true;
}

// check bot authentication
export async function checkBotAuthentication(userId, entity) {
  return checkAccountAuthentication(userId, entity.account);
}

// check authentication for entities which belongs to bot
export async function checkBotChildAuthentication(userId, entity) {
  const botData = await botService.getBotData(entity.botId);
  return checkBotAuthentication(userId, botData);
}

// check authentication for entities which belongs to flow
export async function checkFlowChildAuthentication(userId, entity) {
  const flowData = await flowService.getFlowData(entity.flowId);
  return checkBotChildAuthentication(userId, flowData);
}

export function getTestlinkUrl(testLink) {
  return `${host}/testing/${testLink._id}`;
}

export function removeFlowOverrides(testLinkIds) {
  for (var i = 0, len = testLinkIds.length; i < len; i++) {
    flowOverridesService.deleteFlowOverridesForTestLink(testLinkIds[i]);
  }
}

// Send a mail to the the users testing the flow
export function sendTestInvitationMail(testLink, botName, flowName) {
  const subject = `Invitation to test flow for "${botName}" bot`;
  const testlinkAddress = getTestlinkUrl(testLink);
  const body = `
                <p>Hi,</p>
                <p>You have been invited to test the flow "${flowName}".
                <br/>
                Please click on the link below to accept and start testing.
                <br/><br/>
                <a href='${testlinkAddress}'>${testlinkAddress}</a>
                <p>
                    <span>Regards,</span>
                    <br />
                    <span>Botworx</span>
                </p>`;
  return mailerService.sendMail('test@botworx.ai', subject, body, [testLink.testerEmail]);
}

export function processPollBeforeSave(poll) {
  // concat the string as utc date (not local date)
  // because whatever string we get is utc string (not local date)
  poll.startDate = moment.utc(poll.startDate + ' ' + poll.startTime, "YYYY-MM-DD hh:mm A").toDate();
  if (poll.endDate) {
    poll.endDate = moment.utc(poll.endDate + ' ' + poll.endTime, "YYYY-MM-DD hh:mm A").toDate();
  }
  return poll;
}
