import { getEntitiesList, checkUserPermission } from '../commonApi';
import { linkHost } from '../../config';
import accountService from '../../service/AccountService';
import botService from '../../service/BotService';
import userService from '../../service/UserService';
import userAccessService from '../../service/UserAccessService';
import mailerService from '../../service/MailerService';
import { getAllowedPermissions, getUserAccessDocs, getUserRole } from '../../server';
import { permissionError, authenticationError, duplicateDataError, successResponse, requestFailError } from '../../constants/apiResponseType';
import {entityType as entityTypeConst} from '../../constants/entityType';
import _ from 'lodash';
import CryptoJS from 'crypto-js';



async function canExecuteAction(acl, userId, entityType, permission) {
  if (!checkUserPermission(acl, userId, entityType, permission)) {
    return false;
  }
  return true;
}

// TODO
async function preAction() {

}

async function postAction() {

}

export async function executeAction(acl, userId, entityType, permission, params) {
  if (!canExecuteAction(acl, userId, entityType, permission)) {
    return permissionError;
  }

  try {
    const userDetail = params.userEntry;
    const userAccounts = userDetail.accounts;
    const userBots = userDetail.bots || [];
    const pwd = userDetail.auth.local.password;
    userDetail.auth.local.password = (CryptoJS.MD5(userDetail.auth.local.password)).toString();
    console.log('user detail', userDetail);
    const emailConfirmed = params.emailConfirmed;
    const existingUser = await userService.getDashboardUser(userDetail.email);
    if (existingUser.length) {
      return duplicateDataError;
    }
    const userToBeCreated = Object.assign({}, userDetail);
    delete userToBeCreated.accounts;
    delete userToBeCreated.roles;
    delete userToBeCreated.bots;
    await userService.createNewUser(userToBeCreated, emailConfirmed);
    await sendUserCreationMail(userDetail.FirstName, userDetail.email, pwd);
    const newUser = (await userService.getDashboardUser(userDetail.email))[0];
    // TO-Do: add role check in security file
    if (userDetail.roles === 'SuperAdmin' || userDetail.roles === 'BotworxAdmin') {
      await userAccessService.createUserAccessDoc(newUser._id, userDetail.roles, '*', '*');
    }
    else {
      if (newUser && userAccounts.length) {
        await Promise.all(userAccounts.map(x => {
          if (x) {
            return userAccessService.createUserAccessDoc(newUser._id, userDetail.roles, entityTypeConst.ACCOUNT, x);
          }
        }));
      }
      if (newUser && userBots.length) {
        await Promise.all(userBots.map(x => {
          if (x) {
            return userAccessService.createUserAccessDoc(newUser._id, userDetail.roles, entityTypeConst.BOT, x);
          }
        }));
      }
    }
    return successResponse;

  } catch (e) {
    console.log(e);
    requestFailError.data = e;
    return requestFailError;
  }
}

// Send a mail to the newly created users
async function sendUserCreationMail(UserName, email, pwd) {
  const subject = `Botworx account has been created for you.`;
  const body = `
                <p>Hi ${UserName},</p>
                <p>
                    An account has been created for you with following details:
                </p >
                <p><b>Username:</b> ${email}</p>
                <p><b>Password:</b> ${pwd}</p>
                <p>You can proceed with login by clicking on below link.</p>
                <a href='${linkHost}'>Botworx login</a>
                <p>
                    <span>Regards,</span>
                    <br />
                    <span>Botworx</span>
                </p>`;
  return mailerService.sendMail('test@botworx.ai', subject, body, [email]);
}