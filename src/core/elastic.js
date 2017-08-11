import moment from 'moment';
import { makeQuery as elasticQuery } from './elastic/client';
import {
  profileAgeLabels,
} from './elastic/constants';

import {
  totalUsersOnDateQuery,
  newUsersQuery,
  activeUsersQuery,
  activeSessionsQuery,
  messagesPerSessionQuery,
  messageCountsQuery,
  messagesPerUserQuery,
  countsByLocaleQuery,
  countsByGenderQuery,
  countsByCountryQuery,
  countsByResponseDelayQuery,
  countsByReadDelayQuery,
  countsByProfileAgeQuery,
} from './elastic/queries';


const processDataGroupedByDate = (data, groupName) => data.reduce((obj, r) => ({
  ...obj, [r.key_as_string]: r[groupName].value,
}), {});

const processUsersDataGroupedByField = (data) => data.reduce((obj, r) => ({
  ...obj, [r.key]: r.unique_users.value,
}), {});

function groupDataByRange(data, ranges, order = 'ASC') {
  const groupSize = ranges.length + 1;
  const groups = new Array(groupSize);

  for (let j = 0; j < groupSize; j++) {
    groups[j] = 0;
  }

  data.forEach(value => {
    for (let i = 0; i < ranges.length; i++) {
      if ((order === 'ASC' && value < ranges[i]) || (order === 'DESC' && value > ranges[i])) {
        groups[i]++;
        break;
      } else if (i === ranges.length - 1) {
        groups[groupSize - 1]++;
      }
    }
  });

  return groups;
}

export async function totalUsersOnDate(botId, date, filters) {
  const query = totalUsersOnDateQuery(botId, date)
    .applyFilters(filters)
    .getQuery();
  const searchData = await elasticQuery(query);
  return searchData.aggregations.unique_users.value;
}

export async function getTotalUsers(botId, startDate, endDate, filters) {
  const startDateM = moment(startDate);
  const endDateM = moment(endDate);
  const totalUsers = {};
  for (const m = startDateM; m.isSameOrBefore(endDateM); m.add(1, 'days')) {
    const dateData = m.format('YYYY-MM-DD');
    totalUsers[dateData] = await totalUsersOnDate(botId, dateData, filters);
  }
  return totalUsers;
}

export async function getNewUsers(botId, startDate, endDate, filters) {
  const query = newUsersQuery(botId, startDate, endDate)
    .applyFilters(filters)
    .getQuery();

  const searchData = await elasticQuery(query);
  const data = searchData.aggregations.total_users_by_date.buckets;
  return processDataGroupedByDate(data, 'unique_users');
}

export async function getActiveUsers(botId, startDate, endDate, filters) {
  const query = activeUsersQuery(botId, startDate, endDate)
    .applyFilters(filters)
    .getQuery();
  const searchData = await elasticQuery(query);
  const data = searchData.aggregations.total_users_by_date.buckets;

  return processDataGroupedByDate(data, 'unique_users');
}

export async function getActiveSessions(botId, startDate, endDate, filters) {
  const query = activeSessionsQuery(botId, startDate, endDate)
    .applyFilters(filters)
    .getQuery();

  const searchData = await elasticQuery(query);
  const userData = searchData.aggregations.total_users_by_date.buckets;
  const sessionData = searchData.aggregations.total_sessions_by_date.buckets;

  const userMap = processDataGroupedByDate(userData, 'unique_users');
  const sessionMap = processDataGroupedByDate(sessionData, 'unique_sessions');

  return {
    user: userMap,
    session: sessionMap,
  };
}

export async function getMessageSession(botId, startDate, endDate, filters) {
  const query = messagesPerSessionQuery(botId, startDate, endDate)
    .applyFilters(filters)
    .getQuery();

  const searchData = await elasticQuery(query);

  const sessionData = searchData.aggregations.total_sessions_by_date.buckets;
  const messageData = searchData.aggregations.total_messages_by_date.buckets;

  const sessionMap = processDataGroupedByDate(sessionData, 'unique_sessions');
  const messageMap = processDataGroupedByDate(messageData, 'unique_messages');

  return {
    message: messageMap,
    session: sessionMap,
  };
}

export async function getMessageCounts(botId, startDate, endDate, filters) {
  const query = messageCountsQuery(botId, startDate, endDate)
    .applyFilters(filters)
    .getQuery();

  let searchData = null;
  try {
    searchData = await elasticQuery(query);
    searchData = await elasticQuery(query, 'messages');
  } catch (e) {
    /* eslint-disable no-console */
    console.log(e);
    /* eslint-enable no-console */
  }

  const groupByDate = searchData.aggregations.group_by_date.buckets;

  /* eslint-disable no-param-reassign */
  const data = groupByDate.reduce((obj, dateData) => {
    const date = dateData.key_as_string;
    obj[date] = dateData.total_messages_count.buckets.reduce((msgObj, d) => {
      msgObj[d.key] = d.doc_count;
      return msgObj;
    }, {});
    return obj;
  }, {});
  /* eslint-enable no-param-reassign */

  return data;
}

export async function getMessageUser(botId, startDate, endDate, filters) {
  const query = messagesPerUserQuery(botId, startDate, endDate)
    .applyFilters(filters)
    .getQuery();

  const searchData = await elasticQuery(query);

  const userData = searchData.aggregations.total_users_by_date.buckets;
  const messageData = searchData.aggregations.total_messages_by_date.buckets;

  const usersMap = processDataGroupedByDate(userData, 'unique_users');
  const messageMap = processDataGroupedByDate(messageData, 'unique_messages');

  return {
    message: messageMap,
    user: usersMap,
  };
}

export async function getCountsByLocale(botId, filters) {
  const query = countsByLocaleQuery(botId)
    .applyFilters(filters)
    .getQuery();
  const searchData = await elasticQuery(query);
  const data = searchData.aggregations.group_by_locale.buckets;
  return processUsersDataGroupedByField(data);
}

export async function getGenderCount(botId, filters) {
  const query = countsByGenderQuery(botId)
    .applyFilters(filters)
    .getQuery();
  const searchData = await elasticQuery(query);
  const data = searchData.aggregations.group_by_gender.buckets;
  return processUsersDataGroupedByField(data);
}

export async function getCountsByCountry(botId, filters) {
  const query = countsByCountryQuery(botId)
    .applyFilters(filters)
    .getQuery();
  const searchData = await elasticQuery(query);
  const data = searchData.aggregations.group_by_country.buckets;
  return processUsersDataGroupedByField(data);
}

export async function countByResponseDelay(botId, filters) {
  const query = countsByResponseDelayQuery(botId)
    .applyFilters(filters)
    .getQuery();

  let searchData = null;
  const delayBands = {};

  try {
    searchData = await elasticQuery(query);
  } catch (e) {
    /* eslint-disable no-console */
    console.log(e);
    /* eslint-enable no-console */
  }

  if (searchData) {
    const data = searchData.aggregations.group_by_avg_responsedelay.buckets;
    const avgResponseDelayData = data.map(d => d.avg_response_delay.value);
    const delayBandCounts = groupDataByRange(avgResponseDelayData, [
      120, 600, 3600, 43200,
    ]);

    delayBands['< 2 min'] = delayBandCounts[0];
    delayBands['2 min - 10 min'] = delayBandCounts[1];
    delayBands['10 min - 1 hr'] = delayBandCounts[2];
    delayBands['1 hr - 12 hr'] = delayBandCounts[3];
    delayBands['> 12 hr'] = delayBandCounts[4];
  }
  return delayBands;
}

export async function countByReadDelay(botId, filters) {
  const query = countsByReadDelayQuery(botId)
    .applyFilters(filters)
    .getQuery();

  let searchData = null;
  const delayBands = {};

  try {
    searchData = await elasticQuery(query);
  } catch (e) {
    /* eslint-disable no-console */
    console.log(e);
    /* eslint-enable no-console */
  }

  if (searchData) {
    const data = searchData.aggregations.group_by_avg_readdelay.buckets;
    const avgReadDelayData = data.map(d => d.avg_read_delay.value);
    const delayBandCounts = groupDataByRange(avgReadDelayData, [
      120, 600, 3600, 43200,
    ]);

    delayBands['< 2 min'] = delayBandCounts[0];
    delayBands['2 min - 10 min'] = delayBandCounts[1];
    delayBands['10 min - 1 hr'] = delayBandCounts[2];
    delayBands['1 hr - 12 hr'] = delayBandCounts[3];
    delayBands['> 12 hr'] = delayBandCounts[4];
  }
  return delayBands;
}

export async function getCountsByProfileAge(botId, filters) {
  const query = countsByProfileAgeQuery(botId)
    .applyFilters(filters)
    .getQuery();

  let searchData = null;

  try {
    searchData = await elasticQuery(query);
  } catch (e) {
    /* eslint-disable no-console */
    console.log(e);
    /* eslint-enable no-console */
  }

  const ageBands = {};

  if (searchData) {
    const data = searchData.aggregations.unique_users.buckets;
    const createdAtData = data.map(d => moment(d.createdAt.value).valueOf());

    const today = moment().utc().startOf('day');
    const todayMorning = today.valueOf();
    const lastWeek = today.clone().subtract(7, 'days').valueOf();
    const lastMonth = today.clone().subtract(30, 'days').valueOf();
    const lastSixMonths = today.clone().subtract(180, 'days').valueOf();

    const ageBandsCount = groupDataByRange(createdAtData, [
      todayMorning, lastWeek, lastMonth, lastSixMonths,
    ], 'DESC');

    ageBandsCount.forEach((count, i) => (ageBands[profileAgeLabels[i]] = count));

    // ageBands[profileAgeLabels[0]] = ageBandsCount[0];
    // ageBands['Last Week'] = ageBandsCount[1];
    // ageBands['Last Month'] = ageBandsCount[2];
    // ageBands['Last Six Months'] = ageBandsCount[3];
    // ageBands['> Six Months'] = ageBandsCount[4];
  }

  return ageBands;
}


//
// export async function messageCountByReadDelay(botId) {
//   const q = {
//     "size": 0,
//     "query": {
//       "bool": {
//         "must": [{
//           "term": { "botId": botId }
//         }, {
//           "exists": {
//             "field": "readDelay"
//           }
//         }]
//       }
//     },
//     "aggs": {
//       "read-delay-ranges": {
//
//         "range": {
//           "field": "readDelay",
//           "ranges": [
//             { "to": 120000 },
//             { "from": 120000, "to": 600000 },
//             { "from": 600000, "to": 3600000 },
//             { "from": 3600000, "to": 43200000 },
//             { "from": 43200000 }
//           ]
//         }
//       }
//     }
//   };
//
//   let searchData = null;
//   let delayBands = {
//     A: 0, B: 0, C: 0, D: 0, E: 0
//   };
//
//   try {
//     searchData = await makeSearchRequest(q);
//   } catch (e) {
//     console.log(e);
//   }
//
//   console.log(searchData);
//
//   // if (searchData) {
//   //   const data = searchData.aggregations.group_by_avg_readdelay.buckets;
//   //
//   //   delayBands = data.reduce((obj, r) => {
//   //     const avgDelay = r.avg_read_delay.value / 1000;
//   //
//   //     if (avgDelay < 120) {
//   //       obj.A++;
//   //     } else if (avgDelay < 600) {
//   //       obj.B++;
//   //     } else if (avgDelay < 3600) {
//   //       obj.C++
//   //     } else if (avgDelay < 43200) {
//   //       obj.D++;
//   //     } else {
//   //       obj.E++;
//   //     }
//   //
//   //     return obj;
//   //   }, delayBands);
//   // }
//   return delayBands;
// }
//
//
