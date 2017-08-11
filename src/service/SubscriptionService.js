import {
    subscriptions as subscriptionsService
} from '../db/botData/services';

import _ from 'lodash';

class SubscriptionService {
    getSubscriptionsForBot(botId) {
        return subscriptionsService.findAll({ botId });
    }

    createSubscription(subscription) {
        return subscriptionsService.create(subscription);
    }

    save(subscription) {
        return subscriptionsService.save(subscription);
    }

    getAllSubscriptionsForAccount(accountId) {
        return subscriptionsService.getAllSubscriptionsForAccount(accountId);
    }

}

export default new SubscriptionService();
