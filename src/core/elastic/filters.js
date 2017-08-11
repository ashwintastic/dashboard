import moment from 'moment';
import { profileAgeLabels } from './constants';

const availableFilters = {
  gender: (qb, filter) => qb.term('gender', filter.value),
  country: (qb, filter) => qb.term('country', filter.value),
  locale: (qb, filter) => qb.term('locale', filter.value),
  profileAge: (qb, filter) => {
    const today = moment().utc().startOf('day');
    const lastWeek = today.clone().subtract(7, 'days');
    const lastMonth = today.clone().subtract(30, 'days');
    const lastSixMonths = today.clone().subtract(180, 'days');

    switch (filter.value) {
      // Today
      case profileAgeLabels[0]:
        qb.range('createdAt', {
          gt: `${today.format('YYYY-MM-DD HH:mm:SS')}`,
        });
        break;

      // Last Week
      case profileAgeLabels[1]:
        qb.range('createdAt', {
          gt: `${lastWeek.format('YYYY-MM-DD HH:mm:SS')}`,
          lt: `${today.format('YYYY-MM-DD HH:mm:SS')}`,
        });
        break;

      // Last Month
      case profileAgeLabels[2]:
        qb.range('createdAt', {
          gt: `${lastMonth.format('YYYY-MM-DD HH:mm:SS')}`,
          lt: `${lastWeek.format('YYYY-MM-DD HH:mm:SS')}`,
        });
        break;

      // Last Six Month
      case profileAgeLabels[3]:
        qb.range('createdAt', {
          gt: `${lastSixMonths.format('YYYY-MM-DD HH:mm:SS')}`,
          lt: `${lastMonth.format('YYYY-MM-DD HH:mm:SS')}`,
        });
        break;

      // > Six Month
      case profileAgeLabels[4]:
        qb.range('createdAt', {
          lt: `${lastSixMonths.format('YYYY-MM-DD HH:mm:SS')}`,
        });
        break;

      default: break;
    }

    return qb;
  },
};

/* eslint-disable import/prefer-default-export */
export function applyFilters(queryBuilder, filters = {}) {
  Object.keys(filters).forEach(f => {
    availableFilters[f](queryBuilder, filters[f]);
  });

  return queryBuilder;
}
/* eslint-enable import/prefer-default-export */
