import { getEntitiesList, checkUserPermission, canExecuteAction } from '../commonApi';
import accountService from '../../service/AccountService';
import botService from '../../service/BotService';
import { getAllowedPermissions, getUserAccessDocs } from '../../server';
import { permissionError, authenticationError, successResponse } from '../../constants/apiResponseType';
import _ from 'lodash';


// TODO
async function preAction() {

}

async function postAction() {

}

export async function executeAction(acl, userId, entityType, permission, botId, botName, description) {
  const bot = await botService.getBotData(botId);
  let permissionResp = canExecuteAction(acl, userId, entityType, permission, bot)
  if (permissionResp.error) {
    return permissionResp;
  }

  bot.name = botName;
  bot.description = description;
  const userAccessDocs = await getUserAccessDocs(userId);
  await botService.save(bot);
  return successResponse;
}
