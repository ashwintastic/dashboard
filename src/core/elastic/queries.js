import { QueryBuilder } from './queryBuilder';
import { AggregateBuilder } from './queryBuilder';
import { sumAggregate } from './helpers';

import {
  uniqueUserAggregate,
  uniqueUsersByCreatedDateAggregate,
  uniqueUsersByActiveDateAggregate,
  uniqueSessionsByActiveDateAggregate,
  uniqueMessagesByDateAggregate,
  messageCountByTypeAggregate,
  groupUsersByAggregate,
  userAverageResponseDelayAggregate,
  userAverageReadDelayAggregate,
  userCountByProfileAgeAggregate,
} from './helpers';

export function totalUsersOnDateQuery(botId, date) {
  const queryBuilder = new QueryBuilder(botId);
  return queryBuilder
    .range('createdAt', { lt: `${date} 23:59:59` })
    .aggregate(
      'unique_users',
      uniqueUserAggregate().getAggregate()
    );
}

export function newUsersQuery(botId, startDate, endDate) {
  const queryBuilder = new QueryBuilder(botId);
  return queryBuilder
    .range('createdAt', {
      lt: `${endDate} 23:59:59`,
      gte: `${startDate} 00:00:00`,
    })
    .aggregate(
      'total_users_by_date',
      uniqueUsersByCreatedDateAggregate().getAggregate()
    );
}

export function activeUsersQuery(botId, startDate, endDate) {
  const queryBuilder = new QueryBuilder(botId);
  return queryBuilder
    .term('flowType', 'USER_TO_BOT')
    .exists('createdAt')
    .range('messageTime', {
      lt: `${endDate} 23:59:59`,
      gte: `${startDate} 00:00:00`,
    })
    .aggregate(
      'total_users_by_date',
      uniqueUsersByActiveDateAggregate().getAggregate()
    );
}

export function activeSessionsQuery(botId, startDate, endDate) {
  const queryBuilder = new QueryBuilder(botId);
  return queryBuilder
    .term('flowType', 'USER_TO_BOT')
    .range('messageTime', {
      lt: `${endDate} 23:59:59`,
      gte: `${startDate} 00:00:00`,
    })
    .aggregate(
      'total_users_by_date',
      uniqueUsersByActiveDateAggregate().getAggregate()
    )
    .aggregate(
      'total_sessions_by_date',
      uniqueSessionsByActiveDateAggregate().getAggregate()
    );
}

export function messagesPerSessionQuery(botId, startDate, endDate) {
  const queryBuilder = new QueryBuilder(botId);
  return queryBuilder
    .range('messageTime', {
      lt: `${endDate} 23:59:59`,
      gte: `${startDate} 00:00:00`,
    })
    .aggregate(
      'total_messages_by_date',
      uniqueMessagesByDateAggregate().getAggregate()
    )
    .aggregate(
      'total_sessions_by_date',
      uniqueSessionsByActiveDateAggregate().getAggregate()
    );
}

export function messageCountsQuery(botId, startDate, endDate) {
  /*const queryBuilder = new QueryBuilder(botId);
  return queryBuilder
    .range('messageTime', {
      lt: `${endDate} 23:59:59`,
      gte: `${startDate} 00:00:00`,
    })
    .aggregate(
      'group_by_date',
      messageCountByTypeAggregate().getAggregate()
    );*/
  const queryBuilder = new QueryBuilder(botId);
  return queryBuilder
    .range('date', {
      lt: Number(endDate.replace(/-/g, '')),
      gte: Number(startDate.replace(/-/g, '')),
    })
    .aggregate(
      'group_by_date_in',
      new AggregateBuilder().bucketTerms('date')
            .aggregate('messagesIn', sumAggregate('messagesIn').getAggregate()).getAggregate()
    )
    .aggregate(
      'group_by_date_out',
      new AggregateBuilder().bucketTerms('date')
            .aggregate('messagesOut', sumAggregate('messagesOut').getAggregate()).getAggregate()
    );
}

export function messagesPerUserQuery(botId, startDate, endDate) {
  const queryBuilder = new QueryBuilder(botId);
  return queryBuilder
    .range('messageTime', {
      lt: `${endDate} 23:59:59`,
      gte: `${startDate} 00:00:00`,
    })
    .aggregate(
      'total_messages_by_date',
      uniqueMessagesByDateAggregate().getAggregate()
    )
    .aggregate(
      'total_users_by_date',
      uniqueUsersByActiveDateAggregate().getAggregate()
    );
}

export function countsByLocaleQuery(botId) {
  const queryBuilder = new QueryBuilder(botId);
  return queryBuilder
    .exists('createdAt')
    .aggregate(
      'group_by_locale',
      groupUsersByAggregate('locale').getAggregate()
    );
}

export function countsByGenderQuery(botId) {
  const queryBuilder = new QueryBuilder(botId);
  return queryBuilder
    .exists('createdAt')
    .aggregate(
      'group_by_gender',
      groupUsersByAggregate('gender').getAggregate()
    );
}

export function countsByCountryQuery(botId) {
  const queryBuilder = new QueryBuilder(botId);
  return queryBuilder
    .exists('createdAt')
    .aggregate(
      'group_by_country',
      groupUsersByAggregate('country').getAggregate()
    );
}

export function countsByResponseDelayQuery(botId) {
  const queryBuilder = new QueryBuilder(botId);
  return queryBuilder
    .aggregate(
      'group_by_avg_responsedelay',
      userAverageResponseDelayAggregate().getAggregate()
    );
}

export function countsByReadDelayQuery(botId) {
  const queryBuilder = new QueryBuilder(botId);
  return queryBuilder
    .aggregate(
      'group_by_avg_readdelay',
      userAverageReadDelayAggregate().getAggregate()
    );
}

export function countsByProfileAgeQuery(botId) {
  const queryBuilder = new QueryBuilder(botId);
  return queryBuilder
    .exists('createdAt')
    .aggregate(
      'unique_users',
      userCountByProfileAgeAggregate().getAggregate()
    );
}
