import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import momentTimeZone from'moment-timezone';
import FilterAnalyticsComponent from './filterAnalytics';
import {
  setCurrentBotId,
  setCurrentAccountId,
  changeEndDate,
  changeStartDate,
  setAnalyticsFilterGender,
  setAnalyticsFilterTimeZone,
  setAnalyticsFilterLocale,
  changeRangeFilter,
  updateUsersCharts,
  updateUserChangeCharts,
  updateChartData,
  addFilter,
  removeFilter,
  updateRetentionCharts,
  setGoBtn,
  setCurrentAccountTimeZone,
  fetchNodes,
  resetSubscriptionEntries
} from '../../actions/analytics';
import { getLanguagesList } from '../../actions/poll';
import { fetchBotList } from '../../actions/accountBots';
import { fetchSubscriptionEntries } from '../../actions/broadcast';

import { navigate } from '../../actions/route';
import { refreshUserDetails } from '../../actions/auth';
import metrics from '../../constants/metrics';

const queryString = require('query-string');


const mapStateToProps = (state) => {
    let referralData = [];
    if (state.analytics && state.analytics.metrics[state.analytics.currentAccountId]) {
        const analyticsBotInfo = state.analytics.metrics[state.analytics.currentAccountId][state.analytics.currentBotId];
        if (analyticsBotInfo && analyticsBotInfo.data && analyticsBotInfo.data[metrics.metricType.REFERRALS]) {
            referralData = analyticsBotInfo.data[metrics.metricType.REFERRALS].refIds;
        }
    }
   
    return {
        analytics: state.analytics,
        accountBots: state.accountBots.accountBots[state.analytics.currentAccountId],
        allAccountBots: state.accountBots.accountBots,
        accountId: state.analytics.currentAccountId,
        botId: state.analytics.currentBotId,
        startDate: state.analytics.startDate,
        endDate: state.analytics.endDate,
        date: state.analytics.date,
        fetchingAnalytics: state.fetchingAnalytics,
        analyticsFilters: state.analytics.filters,
        allAccounts: state.accounts.list,
        gender: state.analytics.gender,
        timeZone: state.analytics.timeZone,
        locale: state.analytics.locale,
        rangeFilter: state.analytics.rangeFilter,
        isGoBtnEnabled: state.analytics.isGoBtnEnabled,
        languages: state.botPolls.languagesList,
        referrals: referralData,
        nodes: state.analytics.allNodes,
        currentAccountTimeZone: state.analytics.currentAccountTimeZone,
        subscriptions: state.broadcast.subscriptionEntries || []
    }
};

const mapDispatch = (dispatch) => ({

  onBotChange: (accountId, botId) => {
    dispatch(setCurrentBotId(botId));
    dispatch(fetchNodes(botId, accountId));
    dispatch(removeFilter('subscriptionId'));
    dispatch(fetchSubscriptionEntries(accountId, botId));
  },

  onAccountChange: (selectedAccountId, analytics, allAccountBots, allAccounts) => {

    // Update url query params on accountId change
    let parsed = {};
    parsed.accountId = selectedAccountId;
    const stringified = queryString.stringify(parsed);
    let newUrl = window.location.origin + window.location.pathname + '?' + stringified;
    window.history.pushState({}, null, newUrl);

    dispatch(setCurrentAccountId(selectedAccountId));
    dispatch(fetchBotList(selectedAccountId));

    const tz = allAccounts[selectedAccountId].timezone;
    dispatch(setCurrentAccountTimeZone(tz));
    if (analytics.selectedMenu === metrics.metricType.NODE_ANALYSIS) {
        let selBotId = 'all';
        if (allAccountBots && allAccountBots[selectedAccountId]) {
            selBotId = allAccountBots[selectedAccountId][0].id; //select the first bot
            dispatch(setCurrentBotId(selBotId));
        }
        dispatch(fetchNodes(selBotId, selectedAccountId));
    } else {
        dispatch(setCurrentBotId('All')); // set All as default bot dropdown option.
        if (analytics.selectedMenu === metrics.metricType.SUBSCRIPTION_CHANGE) {
            dispatch(resetSubscriptionEntries());
            dispatch(removeFilter('subscriptionId'));
        }
    }
  },

  onDateRangeChange: (selectedRange, allAccounts, selectedAccountId) => {
    let startDate, endDate ;
    if(selectedRange !== "custom") {
        const accountTimeZone = allAccounts[selectedAccountId]? allAccounts[selectedAccountId].timezone: '';
        const currentUTCDate = new Date(moment.utc().format('YYYY-MM-DD')+'T'+ moment.utc().format('HH:mm:ss'));// should start from yesterday
        let momentEndDate = moment.tz(accountTimeZone).subtract(1, 'days');// should start from yesterday
        endDate = new Date(momentEndDate.format('YYYY-MM-DD') +'T'+ momentEndDate.format('HH:mm:ss'));
        startDate = moment(currentUTCDate).subtract(Number(selectedRange), 'days').toDate();
        dispatch(changeStartDate(startDate));
        dispatch(changeEndDate(endDate));
    }
    dispatch(changeRangeFilter(selectedRange));
  },

  updateStartDate: (startDate) => {
      dispatch(changeStartDate(startDate));
  },

  updateEndDate: (endDate) => {
      dispatch(changeEndDate(endDate));
  },

  onGenderChange: (gender) => {

    if(gender == 'All') {
        dispatch(removeFilter('gender'));
    } else {
        dispatch(addFilter('gender', 'gender', gender));
    }

    dispatch(setAnalyticsFilterGender(gender));
  },

  onTimeZoneChange: (timeZone) => {

    if(timeZone == 'All') {
        dispatch(removeFilter('timeZone'));
    } else {
        dispatch(addFilter('timeZone', 'timeZone', timeZone));
    }
    dispatch(setAnalyticsFilterTimeZone(timeZone));
  },

  onLocaleChange: (locale) => {
    if(locale == 'All') {
        dispatch(removeFilter('locale'));
    } else {
        dispatch(addFilter('locale', 'locale', locale));
    }
    dispatch(setAnalyticsFilterLocale(locale));
  },

  onMsgSubTypeChange: (messageSubType) => {
    if(messageSubType == 'all') {
        dispatch(removeFilter('messageSubType'));
    } else {
        dispatch(addFilter('messageSubType', 'messageSubType', messageSubType));
    }
  },
  onTextInputTypeChange: (recognized) => {
    if(recognized == 'all') {
        dispatch(removeFilter('recognized'));
    } else {
        dispatch(addFilter('recognized', 'recognized', recognized));
    }
  },
 onReferralChange: (referenceId) => {
    if(referenceId == 'all') {
        dispatch(removeFilter('referenceId'));
    } else {
        dispatch(addFilter('referenceId', 'referenceId', referenceId));
    }
 },
 onNodeChange: (node) => {
    if(node === '--noselection--') {
        dispatch(removeFilter('node'));
    } else {
        dispatch(addFilter('node', 'node', node));
    }
 },
 onSubscriptionChange: (subscriptionId) => {
    if(subscriptionId == 'all') {
        dispatch(removeFilter('subscriptionId'));
    } else {
        dispatch(addFilter('subscriptionId', 'subscriptionId', subscriptionId));
    }
 },

 enableGoBtn: (isGoBtnEnabled) => {
     dispatch(setGoBtn(isGoBtnEnabled));
 },


  fetchAnalyticsGraph: (analytics, accountId, botId, startDate, endDate, rangeFilter, currentAccountTimeZone) => {
    const twiceStartDateString = moment(startDate).subtract(Number(rangeFilter), 'days').format('YYYY-MM-DD');
    const endDateForSummaryAverages = moment(startDate).subtract(1, 'days').format('YYYY-MM-DD');
    switch(analytics.selectedMenu) {
        case metrics.metricType.USER_CHANGE: {
            dispatch(updateChartData(accountId, botId, startDate, endDate, metrics.metricType.USER_CHANGE));
            if(rangeFilter != 'custom') {
                dispatch(updateChartData(accountId, botId, twiceStartDateString, endDate, metrics.metricType.USER_CHANGE_SUMMARY));
            }
            break;
        }

        case metrics.metricType.MESSAGE_COUNT: {
            dispatch(updateChartData(accountId, botId, startDate, endDate, metrics.metricType.MESSAGE_COUNT));
            if(rangeFilter != 'custom') {
                dispatch(updateChartData(accountId, botId, twiceStartDateString, endDate, metrics.metricType.MESSAGE_COUNT_SUMMARY));
            }
            break;
        }

        case metrics.metricType.MESSAGE_SESSION_ENGAGED: {
            dispatch(updateChartData(accountId, botId, startDate, endDate, metrics.metricType.MESSAGE_SESSION_ENGAGED));
            if(rangeFilter != 'custom') {
                dispatch(updateChartData(accountId, botId, twiceStartDateString, endDate, metrics.metricType.MESSAGE_SESSION_ENGAGED_SUMMARY));
            }
            break;
        }

        case metrics.metricType.MESSAGE_ENGAGEMENT: {
            dispatch(updateChartData(accountId, botId, startDate, endDate, metrics.metricType.MESSAGE_ENGAGEMENT));
            if(rangeFilter != 'custom') {
                dispatch(updateChartData(accountId, botId, twiceStartDateString, endDateForSummaryAverages, metrics.metricType.MESSAGE_ENGAGEMENT_SUMMARY));
            }
            break;
        }

        case metrics.metricType.SENT_MESSAGES: {
            dispatch(updateChartData(accountId, botId, startDate, endDate, metrics.metricType.SENT_MESSAGES));
            if(rangeFilter != 'custom') {
                dispatch(updateChartData(accountId, botId, twiceStartDateString, endDate, metrics.metricType.SENT_MESSAGES_SUMMARY));
            }
            break;
        }

        case metrics.metricType.DELIVERY_TIME: {
            dispatch(updateChartData(accountId, botId, startDate, endDate, metrics.metricType.DELIVERY_TIME));
            if(rangeFilter != 'custom') {
                dispatch(updateChartData(accountId, botId, twiceStartDateString, endDateForSummaryAverages, metrics.metricType.DELIVERY_TIME_SUMMARY));
            }
            break;
        }

        case metrics.metricType.READ_TIME: {
            dispatch(updateChartData(accountId, botId, startDate, endDate, metrics.metricType.READ_TIME));
            if(rangeFilter != 'custom') {
                dispatch(updateChartData(accountId, botId, twiceStartDateString, endDateForSummaryAverages, metrics.metricType.READ_TIME_SUMMARY));
            }
            break;
        }

        case metrics.metricType.ENGAGEMENT_TIME: {
            dispatch(updateChartData(accountId, botId, startDate, endDate, metrics.metricType.ENGAGEMENT_TIME));
            if(rangeFilter != 'custom') {
                dispatch(updateChartData(accountId, botId, twiceStartDateString, endDateForSummaryAverages, metrics.metricType.ENGAGEMENT_TIME_SUMMARY));
            }
            break;
        }

        case metrics.metricType.SUBSCRIPTION_CHANGE: {
            dispatch(updateChartData(accountId, botId, startDate, endDate, metrics.metricType.SUBSCRIPTION_CHANGE));
            if(rangeFilter != 'custom') {
                dispatch(updateChartData(accountId, botId, twiceStartDateString, endDate, metrics.metricType.SUBSCRIPTION_CHANGE_SUMMARY));
            }
            break;
        }
        case metrics.metricType.REFERRALS: {
            dispatch(updateChartData(accountId, botId, startDate, endDate, metrics.metricType.REFERRALS));
            if(rangeFilter != 'custom') {
                dispatch(updateChartData(accountId, botId, twiceStartDateString, endDate,metrics.metricType.REFERRALS_SUMMARY));
            }
            break;
        }

        case metrics.metricType.OVERVIEW: {
            const summaryStartDate = moment(startDate).subtract(Number(rangeFilter), 'days').format('YYYY-MM-DD');
            dispatch(updateChartData(accountId, botId, startDate, endDate, metrics.metricType.OVERVIEW, summaryStartDate));
            break;
        }
        case metrics.metricType.NODE_ANALYSIS: {
            if (analytics.filters.node) {
                dispatch(updateChartData(accountId, botId, startDate, endDate, analytics.selectedMenu));
                const selNode = analytics.filters.node.term.node;
                dispatch(removeFilter('node'));
                dispatch(updateChartData(accountId, botId, startDate, endDate,metrics.metricType.TOP_NODES));
                dispatch(updateChartData(accountId, botId, twiceStartDateString, endDate,metrics.metricType.TOP_NODES_SUMMARY));
                dispatch(addFilter('node', 'node', selNode));
            }
            break;
        }

    default: // for those that don't need summary data
        dispatch(updateChartData(accountId, botId, startDate, endDate, analytics.selectedMenu, null, currentAccountTimeZone));
    }

  },

  onStartDateChange: (e, date) => dispatch(changeStartDate(date)),
  onEndDateChange: (e, date) => dispatch(changeEndDate(date)),

  setCurrentAccountId: (accountId) => {
      dispatch(setCurrentAccountId(accountId))
  },

  setCurrentAccountTimeZone: (tz) => {
    dispatch(setCurrentAccountTimeZone(tz));
  },

  fetchBotList: (accountId) => {
      dispatch(fetchBotList(accountId));
  },

  fetchLanguageList: () => {
    dispatch(getLanguagesList());
  },

  refreshUserDetails: () => {
    dispatch(refreshUserDetails());
  },

  fetchNodes: (botId, accountId) => {
      dispatch(fetchNodes(botId, accountId));
  }

});

const FilterAnalytics = connect(mapStateToProps, mapDispatch)(FilterAnalyticsComponent);


export default FilterAnalytics;
/* eslint-enable react/prop-types */
