import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import Analytics from './AnalyticsPage';
import {
  setCurrentBotId,
  setCurrentAccountId,
  changeEndDate,
  changeStartDate,
  updateDateRangeCharts,
  updateGlobalCharts,
  addFilter,
  removeFilter,
} from '../../actions/analytics';
import { fetchBotList } from '../../actions/accountBots';
import { navigate } from '../../actions/route';


const mapStateToProps = (state) => ({
  analytics: state.analytics,
  accountBots: state.accountBots.accountBots[state.analytics.currentAccountId],
  accountId: state.analytics.currentAccountId,
  botId: state.analytics.currentBotId,
  startDate: state.analytics.startDate,
  endDate: state.analytics.endDate,
  date: state.analytics.date,
  fetchingAnalytics: state.fetchingAnalytics,
  analyticsFilters: state.analytics.filters,
});

const mapDispatch = (dispatch) => ({
  onBotChange: (accountId, botId) => {
    dispatch(setCurrentBotId(botId));
    dispatch(navigate(`/accounts/${accountId}/bots/${botId}/analytics`));
  },
  onStartDateChange: (e, date) => dispatch(changeStartDate(date)),
  onEndDateChange: (e, date) => dispatch(changeEndDate(date)),

  onUpdateDateRangeCharts: (
    accountId, botId, startDate, endDate
  ) => {
    dispatch(updateDateRangeCharts(accountId, botId, startDate, endDate));
    dispatch(updateGlobalCharts(accountId, botId));
  },

  onGenderPieClick: ({ id }) => dispatch(addFilter('gender', 'Demographics', id)),
  onLocalePieClick: ({ id }) => dispatch(addFilter('locale', 'Locale', id)),
  onCountryPieClick: ({ id }) => dispatch(addFilter('country', 'Country', id)),
  onUserAgePieClick: ({ id }) => dispatch(addFilter('profileAge', 'User Aging', id)),
  onDeleteFilter: (filter) => dispatch(removeFilter(filter)),
});

const AnalyticsPage = connect(mapStateToProps, mapDispatch)(Analytics);

/* eslint-disable react/prop-types */
export default function ({ params, context }) {
  const botId = params.botId;
  const accountId = params.accountId;
  const state = context.store.getState().analytics;
  const currentUTCDate = new Date(moment.utc().format('YYYY-MM-DD HH:mm:ss'));

  const startDate = state.startDate ?
    new Date(state.startDate) :
    moment(currentUTCDate).subtract(7, 'days').toDate();
  const endDate = state.endDate ? new Date(state.endDate) : currentUTCDate;

  (function dispatchActions(dispatch) {
    dispatch(changeStartDate(startDate));
    dispatch(changeEndDate(endDate));
    dispatch(fetchBotList(accountId));
    dispatch(setCurrentBotId(botId));
    dispatch(setCurrentAccountId(accountId));
    dispatch(updateDateRangeCharts(
      accountId, botId, startDate, endDate)
    );
    dispatch(updateGlobalCharts(accountId, botId));
  }(context.store.dispatch));

  return <AnalyticsPage />;
}
/* eslint-enable react/prop-types */
