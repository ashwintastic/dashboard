import {
  bots as botService,
  platformBots as platformBotsService,
  testLinks as testLinksService
} from '../db/botData/services';


class BotService {
  getUnusedBots() {
    return botService.findAll({});
  }

  getBotsForAccount(accountId) {
    return botService.findAll({ account: accountId });
  }
  getBotByDetail(name, accountId) {
    return botService.findOne({ name: name, account: accountId });
  }

  getPlatformBotId(botId) {
    return platformBotsService.findOne({ botId })
      .then(platformBot => platformBot.platformBotId);
  }

  save(bot) {
    return botService.save(bot);
  }
  createNewBotDoc(name, account, description, flowId) {
    return botService.create({ name, account, description, flowId });
  }
  getBotData(botId) {
    return botService.findById(botId);
  }

  getTestLinkData(testlinkId) {
    return testLinksService.findById(testlinkId);
  }

  createPlatformBotDoc(platformBot) {
    return platformBotsService.createOrSave(
      platformBot, { platformBotId: platformBot.platformBotId, platform: platformBot.platform });
  }

  deletePageFromBot(pageId, botId) {
    return platformBotsService.removeAll({ botId: botId, platformBotId: pageId });
  }

  getPlatformBots(botId, platform) {
    const query = { botId: botId };
    if (platform) {
      query.platform = platform;
    }
    return platformBotsService.findAll(query);
  }

  savePlatformBot(platformBot) {
    return platformBotsService.save(platformBot);
  }
  deleteBotData(botId) {
    return botService.removeById(botId);
  }

  getPlatformBotData(platformBotId) {
    return platformBotsService.findById(platformBotId);
  }
  getAllPlatformBots() {
    return platformBotsService.findAll({}, 'name platformBotId');
  }
}
export default new BotService();
