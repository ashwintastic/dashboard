import { referrals as referralService } from '../db/botData/services';

class ReferralService {
  getReferrals(accountId, botId) {
      if (botId === '') {
        return referralService.findAll({ accountId });
      } else {
        return referralService.findAll({accountId : accountId, botId : botId });
      }
  }

}

export default new ReferralService();
