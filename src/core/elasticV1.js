import logger from './logger';
import { ElasticService, ElasticSearchHelper } from 'botworx-utils/lib/elastic';
import { elastic } from '../config'

const config = {
  host: elastic.host,
  log: 'error',
  retryOnConflict: 0
};

const elasticService = new ElasticService(config);
const elasticSearchHelper = new ElasticSearchHelper(elasticService, logger);

export async function getUsersData(accountId, botId, startDate, endDate, filters, antiFilters) {
  const userData = await elasticSearchHelper.runUserQuery(accountId, botId, startDate, endDate, filters, antiFilters);
  const groupByDate = userData.aggregations.date.buckets;

  const data = groupByDate.reduce((obj, dateData) => {
    const date = dateData.key;
    obj[date] = {};
    if (typeof dateData != 'undefined') {
      obj[date]["all"] = dateData.all.value;
      obj[date]["engaged"] = dateData.engaged.value;
      obj[date]["new"] = dateData.new.value;
      obj[date]["active"] = dateData.active.value;
    }
    return obj;
  }, {});

  return data;
}

export async function getUserChangeData(accountId, botId, startDate, endDate, filters, antiFilters) {
  const userChangeData = await elasticSearchHelper.runUserChangeQuery(accountId, botId, startDate, endDate, filters, antiFilters);
  const groupByDate = userChangeData.aggregations.date.buckets;

  const data = groupByDate.reduce((obj, dateData) => {
    const date = dateData.key;
    obj[date] = {};
    if (typeof dateData != 'undefined') {
      obj[date]["new"] = dateData.new.value;
      obj[date]["unblocked"] = dateData.unblocked.value;
      obj[date]["blocked"] = dateData.blocked.value;
    }
    return obj;
  }, {});

  return data;
}

export async function getMessagesCount(accountId, botId, startDate, endDate, filters, antiFilters) {
  const messagesCount = await elasticSearchHelper.runMessagesQuery(accountId, botId, startDate, endDate, filters, {});
  //return messagesCount.aggregations.date.buckets;
  let retVal = {};
  messagesCount.aggregations.date.buckets.forEach(function (val) {
    retVal[val.key] = val;
  });
  return retVal;
}

export async function getMessagesSessionEngagedCount(accountId, botId, startDate, endDate, filters, antiFilters) {
  const sessionsCount = await elasticSearchHelper.runSessionsQuery(accountId, botId, startDate, endDate, filters, {});
  //return sessionsCount.aggregations.date.buckets;
  let retVal = {};
  sessionsCount.aggregations.date.buckets.forEach(function (val) {
    retVal[val.key] = val;
  });
  return retVal;
}

export async function getEngagementCount(accountId, botId, startDate, endDate, filters, antiFilters) {
  const userEngagement = await elasticSearchHelper.runEngagementQueryUserPart1(accountId, botId, startDate, endDate, filters, {});
  const msgEngagement = await elasticSearchHelper.runEngagementQueryMessagingPart2(accountId, botId, startDate, endDate, filters, {});
  const userBuckets = userEngagement.aggregations.date.buckets;
  const messageBuckets = msgEngagement.aggregations.date.buckets;

  let engagementData = { users: {}, messages: {} };
  userBuckets.forEach(function (val) {
    engagementData.users[val.key] = val.all.value;
  });
  messageBuckets.forEach(function (val) {
    engagementData.messages[val.key] = val;
  });
  return engagementData;
}

export async function getUserRetentionData(accountId, botId, startDate, endDate, filters, antiFilters) {
  const userRetentionData = await elasticSearchHelper.runRetentionQuery(accountId, botId, startDate, endDate, filters, antiFilters);
  const groupByDate = userRetentionData.aggregations.date.buckets;

  const data = groupByDate.reduce((obj, dateData) => {
    const date = dateData.key;
    obj[date] = dateData.day.buckets.reduce((msgObj, d) => {
      msgObj[d.key] = {}
      if (typeof d !== 'undefined') {
        msgObj[d.key]["new"] = d.new.value;
        msgObj[d.key]["active"] = d.active.value;
      }
      return msgObj;
    }, {});
    return obj;
  }, {});

  return data;
}

export async function getGenderCount(accountId, botId, startDate, endDate, filters, antiFilters) {
  const genderCount = await elasticSearchHelper.runGenderQuery(accountId, botId, startDate, endDate, filters, {});
  return genderCount.aggregations.gender.buckets;
}

export async function getCountsByLocale(accountId, botId, startDate, endDate, filters, antiFilters) {
  const localeCount = await elasticSearchHelper.runLocaleQuery(accountId, botId, startDate, endDate, filters, {});
  return localeCount.aggregations.locale.buckets;
}

export async function getSentMessagesCount(accountId, botId, startDate, endDate, filters, antiFilters) {
  const sentMessagesCount = await elasticSearchHelper.runSentMessagesQuery(accountId, botId, startDate, endDate, filters, {});
  //return sentMessagesCount.aggregations.date.buckets;
  let retVal = {};
  sentMessagesCount.aggregations.date.buckets.forEach(function (val) {
    retVal[val.key] = val;
  });
  return retVal;
}

export async function getTimeZoneCount(accountId, botId, startDate, endDate, filters, antiFilters) {
  const timeZoneCount = await elasticSearchHelper.runTimezoneQuery(accountId, botId, startDate, endDate, filters, {});
  return timeZoneCount.aggregations.timeZone.buckets;
}

export async function getSubscriptionChangeCount(accountId, botId, startDate, endDate, filters, antiFilters) {
  const subscriptionChangeCount = await elasticSearchHelper.runSubscriptionChangeQuery(accountId, botId, startDate, endDate, filters, {});
  let retVal = {};
  subscriptionChangeCount.aggregations.date.buckets.forEach(function (val) {
    retVal[val.key] = val;
  });
  return retVal;
}

export async function getDeliveryTime(accountId, botId, startDate, endDate, filters, antiFilters) {
  const deliveryTime = await elasticSearchHelper.runDeliveryTimeQuery(accountId, botId, startDate, endDate, filters, {});
  return deliveryTime.aggregations.timeBand.buckets;
}

export async function getReadTime(accountId, botId, startDate, endDate, filters, antiFilters) {
  const readTime = await elasticSearchHelper.runReadTimeQuery(accountId, botId, startDate, endDate, filters, {});
  return readTime.aggregations.timeBand.buckets;
}

export async function getEngagementTime(accountId, botId, startDate, endDate, filters, antiFilters) {
  const engagementTime = await elasticSearchHelper.runEngagementTimeQuery(accountId, botId, startDate, endDate, filters, {});
  return engagementTime.aggregations.timeBand.buckets;
}

export async function getTopNodes(accountId, botId, startDate, endDate, filters, antiFilters) {
  const topNodesVisitsTime = await elasticSearchHelper.runTopNodeVisitsQuery(accountId, botId, startDate, endDate, filters, {});
  const topNodesClicksTime = await elasticSearchHelper.runTopNodeClicksQuery(accountId, botId, startDate, endDate, filters, {});
  let retVal = {};
  retVal.visits = topNodesVisitsTime.aggregations.node.buckets;
  retVal.clicks = topNodesClicksTime.aggregations.actionNode.buckets;
  return retVal;
}

export async function getTopActions(accountId, botId, startDate, endDate, filters, antiFilters) {
  const topActions = await elasticSearchHelper.runTopActionsQuery(accountId, botId, startDate, endDate, filters, {});
  return topActions.aggregations.actionLabel.buckets;
}

export async function getTopTextInputs(accountId, botId, startDate, endDate, filters, antiFilters) {
  const topTextInputs = await elasticSearchHelper.runTopTextInputQuery(accountId, botId, startDate, endDate, filters, {});
  return topTextInputs.aggregations.input.buckets;
}

export async function getTopContentItems(accountId, botId, startDate, endDate, filters, antiFilters) {
  const topContentItems = await elasticSearchHelper.runTopContentItemsQuery(accountId, botId, startDate, endDate, filters, {});
  return topContentItems.aggregations.itemName.buckets;
}

export async function getReferralsCount(accountId, botId, startDate, endDate, filters, antiFilters) {
  const topReferrals = await elasticSearchHelper.runReferralsQueryTopPart1(accountId, botId, startDate, endDate, {}, {});
  const referralsByDate = await elasticSearchHelper.runReferralsQueryGroupByDatePart2(accountId, botId, startDate, endDate, filters, {});
  let dateAgg = {}, refIdAgg = [], refIds = [];
  let referenceId = '';
  filters.forEach(function (val) {
    if (val.term.referenceId) {
      referenceId = val.term.referenceId;
    }
  });
  topReferrals.aggregations.referenceId.buckets.forEach(function (val) {
    refIds.push(val.key);
    if (referenceId !== '' && val.key !== referenceId) {
      return;
    }
    refIdAgg.push(val);
  });
  referralsByDate.aggregations.date.buckets.forEach(function (val) {
    dateAgg[val.key] = val;
  });
  let retVal = {};
  retVal.dateAgg = dateAgg;
  retVal.refIdAgg = refIdAgg;
  retVal.refIds = refIds;
  return retVal;
}

export async function getNodeAnalysisData(accountId, botId, startDate, endDate, filters, antiFilters) {
  let nodeName = '';
  for (var i = 0, len = filters.length, val; i < len; i++) {
    val = filters[i];
    if (val.term.node) {
      nodeName = val.term.node;
      filters.splice(i, 1);
      break;
    }
  }
  const fromNodes = await elasticSearchHelper.runNodeAnalysisQueryFromNodesPart1(accountId, botId, startDate, endDate, nodeName, filters, {});
  const toNodes = await elasticSearchHelper.runNodeAnalysisQueryToNodesPart2(accountId, botId, startDate, endDate, nodeName, filters, {});
  const actions = await elasticSearchHelper.runNodeAnalysisQueryTopActionsPart3(accountId, botId, startDate, endDate, nodeName, filters, {});
  const textInputs = await elasticSearchHelper.runNodeAnalysisQueryTopTextInputPart4(accountId, botId, startDate, endDate, nodeName, filters, {});
  let retVal = {};
  retVal.fromNodes = fromNodes.aggregations.actionNode.buckets;
  retVal.toNodes = toNodes.aggregations.finalNode.buckets;
  retVal.actions = actions.aggregations.actionLabel.buckets;
  retVal.textInputs = textInputs.aggregations.input.buckets;
  return retVal;
}
