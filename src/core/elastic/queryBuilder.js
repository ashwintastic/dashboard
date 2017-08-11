import { applyFilters } from './filters';

export class QueryBuilder {

  constructor(botId) {
    this.query = {
      size: 0,
      query: {
        bool: {
          must: { term: { botId } },
          filter: [],
        },
      },
    };
  }

  addFilter(filter) {
    this.query.query.bool.filter.push(filter);
    return this;
  }

  getQuery() {
    return this.query;
  }

  range(field, ranges) {
    const filter = { range: { [field]: ranges } };
    return this.addFilter(filter);
  }

  exists(field) {
    return this.addFilter({
      exists: {
        field,
      },
    });
  }

  term(field, value) {
    return this.addFilter({
      term: {
        [field]: value,
      },
    });
  }

  applyFilters(filters) {
    applyFilters(this, filters);
    return this;
  }

  aggregate(label, agg) {
    this.query.aggs = this.query.aggs || {};
    this.query.aggs[label] = agg;
    return this;
  }
}


export class AggregateBuilder {
  agg = {};

  getAggregate() {
    return this.agg;
  }

  cardinality(field) {
    this.agg = {
      cardinality: {
        field,
        precision_threshold: 40000,
      },
    };
    return this;
  }

  dateHistogram(field, interval = 'day') {
    this.agg = {
      date_histogram: {
        field,
        interval,
      },
    };
    return this;
  }

  terms(field) {
    this.agg = {
      terms: {
        field,
        size: 0
      },
    };
    return this;
  }

  bucketTerms(field) {
    this.agg = {
      terms: {
        field
      }
    };
    return this;
  }

  min(field) {
    this.agg = {
      min: {
        field,
      },
    };
    return this;
  }

  avg(field) {
    this.agg = {
      avg: {
        field,
      },
    };
    return this;
  }

  sum(field) {
    this.agg = {
      sum: {
        field,
      },
    };
    return this;
  }

  aggregate(label, agg) {
    this.agg.aggs = this.agg.aggs || {};
    this.agg.aggs[label] = agg;
    return this;
  }
}
