import moment from 'moment';
import apiActionFactory from './factory/apiActionFactory';
import {
    ANALYTICS_SET_CURRENT_BOT_ID,
    ANALYTICS_SET_CURRENT_ACCOUNT_ID,

    ANALYTICS_START_DATE_CHANGED,
    ANALYTICS_END_DATE_CHANGED,

    ANALYTICS_ADD_FILTER,
    ANALYTICS_REMOVE_FILTER,

    ANALYTICS_FETCH_METRICS_FAILED,
    ANALYTICS_FETCHING_METRICS,
    ANALYTICS_FETCHED_METRICS,
    SET_ANALYTICS_MENU,
    ANALYTICS_SET_FILTER_GENDER,
    ANALYTICS_SET_FILTER_TIMEZONE,
    ANALYTICS_SET_FILTER_LOCALE,
    ANALYTICS_SET_FILTER_RANGE,
    ANALYTICS_FETCHING_REFERRALS,
    ANALYTICS_FETCHED_REFERRALS,
    ANALYTICS_FETCH_REFERRALS_FAILED,
    ANALYTICS_SET_CURRENT_ACCOUNT_TIMEZONE,
    ANALYTICS_CLEAR_CURRENT_ACCOUNT_TIMEZONE,
    ANALYTICS_IS_GO_ENABLED,
    ANALYTICS_FETCHING_NODES,
    ANALYTICS_FETCHED_NODES,
    ANALYTICS_FETCH_NODES_FAILED,
    BOT_SUBSCRIPTION_ENTRIES_FETCHED,
    ANALYTICS_CLEAR_METRICS

} from '../constants/actionTypes';
import metrics from '../constants/metrics';
import fetchDataAction from '../utils/fetchDataAction';
import { setErrorNotification } from './notification';

import {
    ERROR_MESSAGE_AND_TRY
} from '../noticationMessages/messages';

export function setCurrentBotId(botId) {
    return {
        type: ANALYTICS_SET_CURRENT_BOT_ID,
        payload: {
            botId
        }
    };
}

export function setCurrentAccountId(accountId) {
    return {
        type: ANALYTICS_SET_CURRENT_ACCOUNT_ID,
        payload: {
            accountId
        }
    };
}

export function setCurrentAccountTimeZone(timeZone) {
    return {
        type: ANALYTICS_SET_CURRENT_ACCOUNT_TIMEZONE,
        payload: {
            timeZone
        }
    };
}

export function clearCurrentAccountTimeZone() {
    return {
        type: ANALYTICS_CLEAR_CURRENT_ACCOUNT_TIMEZONE,
    };
}

export function changeStartDate(date) {
    return {
        type: ANALYTICS_START_DATE_CHANGED,
        payload: {
            date
        }
    };
}

export function changeEndDate(date) {
    return {
        type: ANALYTICS_END_DATE_CHANGED,
        payload: {
            date
        }
    };
}

export function addFilter(filter, label, value) {
    return {
        type: ANALYTICS_ADD_FILTER,
        payload: {
            filter,
            label,
            params: value
        }
    };
}

export function removeFilter(filter) {
    return {
        type: ANALYTICS_REMOVE_FILTER,
        payload: {
            filter
        }
    };
}

export function fetchingMetrics(accountId, botId, metric) {
    return {
        type: ANALYTICS_FETCHING_METRICS,
        payload: {
            accountId, botId, metric
        }
    };
}

export function fetchMetricsFailed() {
    return {
        type: ANALYTICS_FETCH_METRICS_FAILED
    };
}

export function fetchedMetrics(accountId, botId, metric, params, metricsData) {
    return {
        type: ANALYTICS_FETCHED_METRICS,
        payload: {
            accountId,
            botId,
            metrics: metricsData,
            params,
            metric
        }
    };
}

export function clearMetric(accountId, botId, metric) {
    return {
        type: ANALYTICS_CLEAR_METRICS,
        payload: {
            accountId,
            botId,
            metric
        }
    };
}

export function fetchMetrics(
    accountId, botId, metric, params = {}, filters = {}
) {
    let url = `/api/metrics/${accountId}/${botId}/${metric}?`;
    Object.keys(params).forEach(
        key => (url += `${key}=${params[key]}&`)
    );

    return fetchDataAction(
        url,
        fetchingMetrics(accountId, botId, metric),
        [
            setErrorNotification(ERROR_MESSAGE_AND_TRY),
            setGoBtn(true)
        ],
        ({ metrics: m }) => fetchedMetrics(accountId, botId, metric, params, m),
        {
            filters
        }
    );
}

export function fetchReferrals(accountId, botId) {
    const fetchReferrals = apiActionFactory({
        fetchingActionType: ANALYTICS_FETCHING_REFERRALS,
        fetchedActionType: ANALYTICS_FETCHED_REFERRALS,
        fetchFailedActionType: ANALYTICS_FETCH_REFERRALS_FAILED,
        fetchApi: `/api/accounts/${accountId}/bots/${botId}/referrals`,
        actionMeta: {
            accountId, botId
        },
        transform: ({ referralsMap }) => ({
            referralsMap
        }),
    });
    return fetchReferrals.fetchThunk;
}

export function updateDateRangeCharts(accountId, botId, startDate, endDate) {
    const startDateString = moment(startDate).format('YYYY-MM-DD');
    const endDateString = moment(endDate).format('YYYY-MM-DD');

    return (dispatch, getState) => {
        if (botId) {
            const state = getState();
            Object.keys(metrics.ranged).forEach(
                m => dispatch(fetchMetrics(accountId, botId, m, {
                    startDate: startDateString,
                    endDate: endDateString
                }, state.analytics.filters))
            );
        }
    };
}

export function updateGlobalCharts(accountId, botId) {
    return (dispatch, getState) => {
        if (botId) {
            const state = getState();
            Object.keys(metrics.global).forEach(
                m => dispatch(fetchMetrics(
                    accountId, botId, m, undefined, state.analytics.filters
                ))
            );
        }
    };
}

export function setAnalyticsMenu(selectedMenu) {
    return {
        type: SET_ANALYTICS_MENU,
        payload: {
            selectedMenu
        }
    };
}

export function setAnalyticsFilterGender(gender) {
    return {
        type: ANALYTICS_SET_FILTER_GENDER,
        payload: {
            gender
        }
    };
}

export function setAnalyticsFilterTimeZone(timeZone) {
    return {
        type: ANALYTICS_SET_FILTER_TIMEZONE,
        payload: {
            timeZone
        }
    };
}

export function setAnalyticsFilterLocale(locale) {
    return {
        type: ANALYTICS_SET_FILTER_LOCALE,
        payload: {
            locale
        }
    };
}
export function changeRangeFilter(rangeFilter) {
    return {
        type: ANALYTICS_SET_FILTER_RANGE,
        payload: {
            rangeFilter
        }
    };
}

export function setGoBtn(isGoBtnEnabled) {
    return {
        type: ANALYTICS_IS_GO_ENABLED,
        payload: {
            isGoBtnEnabled
        }
    };
}

export function updateUserChangeSummary(accountId, botId, startDate, endDate, rangeFilter) {
    const startDateString = moment(startDate).subtract(Number(rangeFilter) * 2, 'days').format('YYYY-MM-DD');
    const endDateString = moment(endDate).format('YYYY-MM-DD');

    console.log('Fetching for summary with start and end dates ', startDateString, endDateString);

    return (dispatch, getState) => {
        if (botId) {
            const state = getState();
            let metric = metrics.metricType.USER_CHANGE;
            dispatch(fetchMetrics(accountId, botId, metric, {
                startDate: startDateString,
                endDate: endDateString
            }, state.analytics.filters))
        }
    };
}

export function updateChartData(accountId, botId, startDate, endDate, metric, summaryStartDate, timezone) {
    const startDateString = moment(startDate).format('YYYYMMDD');
    const endDateString = moment(endDate).format('YYYYMMDD');
    const summaryStartDateString = summaryStartDate ? moment(summaryStartDate).format('YYYYMMDD') : null;
    return (dispatch, getState) => {
        if (botId) {
            const state = getState();
            dispatch(fetchMetrics(accountId, botId, metric, {
                startDate: Number(startDateString),
                endDate: Number(endDateString),
                summaryStartDate: Number(summaryStartDateString),
                timezone: timezone
            }, state.analytics.filters))

            // if(summaryMetrics.indexOf(metric) != -1) {
            //     // need to find analytics data for twice the range
            // }
        }
    };
}

export function fetchNodes(botId, accountId) {
    const fetchNodes = apiActionFactory({
        fetchingActionType: ANALYTICS_FETCHING_NODES,
        fetchedActionType: ANALYTICS_FETCHED_NODES,
        fetchFailedActionType: ANALYTICS_FETCH_NODES_FAILED,
        fetchApi: `/api/nodes/accounts/${accountId}/bots/${botId}`,
        actionMeta: {
            accountId, botId
        },
        transform: ({ allNodes }) => ({
            allNodes
        }),
    });
    return fetchNodes.fetchThunk;
}

export function resetSubscriptionEntries() {
    const subscriptionEntries = [];
    return {
        type: BOT_SUBSCRIPTION_ENTRIES_FETCHED,
        payload: {
            subscriptionEntries
        }
    };
}
