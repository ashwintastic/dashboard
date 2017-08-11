import { AggregateBuilder } from './queryBuilder';


export function uniqueUserAggregate() {
  const aggBuilder = new AggregateBuilder();
  return aggBuilder.cardinality('botUserId');
}

export function uniqueSessionAggregate() {
  const aggBuilder = new AggregateBuilder();
  return aggBuilder.cardinality('chatSessionId');
}

export function uniqueMessageAggregate() {
  const aggBuilder = new AggregateBuilder();
  return aggBuilder.cardinality('messageId');
}

export function usersByCreatedDateAggregate() {
  const aggBuilder = new AggregateBuilder();
  return aggBuilder.dateHistogram('createdAt');
}

export function messageByDateAggregate(dateField) {
  dateField = dateField ? dateField : 'messageTime';
  const aggBuilder = new AggregateBuilder();
  return aggBuilder.dateHistogram(dateField);
}

export function dateAggregate() {
  const aggBuilder = new AggregateBuilder();
  return aggBuilder.terms('date');
}

export function uniqueMessageCountByTypeAggregate(aggField) {
  aggField = aggField ? aggField : 'flowType';
  const aggBuilder = new AggregateBuilder();
  return aggBuilder
    .terms(aggField)
    .aggregate('unique_messages', uniqueMessageAggregate().getAggregate());
}

export function uniqueUsersByCreatedDateAggregate() {
  return usersByCreatedDateAggregate()
    .aggregate('unique_users', uniqueUserAggregate().getAggregate());
}

export function uniqueUsersByActiveDateAggregate() {
  return messageByDateAggregate()
    .aggregate('unique_users', uniqueUserAggregate().getAggregate());
}

export function uniqueSessionsByActiveDateAggregate() {
  return messageByDateAggregate()
    .aggregate('unique_sessions', uniqueSessionAggregate().getAggregate());
}

export function uniqueMessagesByDateAggregate() {
  return messageByDateAggregate()
    .aggregate('unique_messages', uniqueMessageAggregate().getAggregate());
}

export function messageCountByTypeAggregate(dateField, aggLabel, aggField) {
  aggLabel = aggLabel ? aggLabel : 'total_messages_count';
  return messageByDateAggregate(dateField)
    .aggregate(aggLabel, uniqueMessageCountByTypeAggregate().getAggregate());
}

export function groupUsersByAggregate(field) {
  const aggBuilder = new AggregateBuilder();
  return aggBuilder
    .terms(field)
    .aggregate('unique_users', uniqueUserAggregate().getAggregate());
}

export function averageAggregate(field) {
  const aggBuilder = new AggregateBuilder();
  return aggBuilder.avg(field);
}

export function minAggregate(field) {
  const aggBuilder = new AggregateBuilder();
  return aggBuilder.min(field);
}

export function sumAggregate(field) {
  const aggBuilder = new AggregateBuilder();
  return aggBuilder.sum(field);
}

export function userAverageResponseDelayAggregate() {
  const aggBuilder = new AggregateBuilder();
  return aggBuilder
    .terms('botUserId')
    .aggregate('avg_response_delay', averageAggregate('responseDelay').getAggregate());
}

export function userAverageReadDelayAggregate() {
  const aggBuilder = new AggregateBuilder();
  return aggBuilder
    .terms('botUserId')
    .aggregate('avg_read_delay', averageAggregate('readDelay').getAggregate());
}

export function userCountByProfileAgeAggregate() {
  const aggBuilder = new AggregateBuilder();
  return aggBuilder
    .terms('botUserId')
    .aggregate('createdAt', minAggregate('createdAt').getAggregate());
}
