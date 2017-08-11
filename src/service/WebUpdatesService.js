import { webUpdates as webUpdatesService } from '../db/botData/services';

class WebUpdatesService {
  getAllWebUpdates(botId) {
    return webUpdatesService.findAll({botId});
  }

}

export default new WebUpdatesService();
