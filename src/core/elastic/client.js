import elasticsearch from 'elasticsearch';
import { elastic as config } from '../../config';

const client = new elasticsearch.Client({
  host: config.host,
  log: config.log,
});

/* eslint-disable import/prefer-default-export */
export function makeQuery(query, index, type) {
  return client.search({
    index: index || config.botAnalytics.index,
    type: type || config.botAnalytics.type,
    lenient: true,
    fields: [],
    body: query
  });
}
/* eslint-enable import/prefer-default-export */
