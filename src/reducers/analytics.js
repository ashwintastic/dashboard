import {
    ANALYTICS_SET_CURRENT_BOT_ID,
    ANALYTICS_SET_CURRENT_ACCOUNT_ID,
    ANALYTICS_SET_CURRENT_ACCOUNT_TIMEZONE,
    ANALYTICS_CLEAR_CURRENT_ACCOUNT_TIMEZONE,
    ANALYTICS_START_DATE_CHANGED,
    ANALYTICS_END_DATE_CHANGED,
    ANALYTICS_ADD_FILTER,
    ANALYTICS_REMOVE_FILTER,
    ANALYTICS_FETCHING_METRICS,
    ANALYTICS_FETCHED_METRICS,
    SET_ANALYTICS_MENU,
    ANALYTICS_SET_FILTER_GENDER,
    ANALYTICS_SET_FILTER_TIMEZONE,
    ANALYTICS_SET_FILTER_LOCALE,
    ANALYTICS_SET_FILTER_RANGE,
    ANALYTICS_FETCHING_REFERRALS,
    ANALYTICS_FETCHED_REFERRALS,
    ANALYTICS_IS_GO_ENABLED,
    ANALYTICS_FETCHING_NODES,
    ANALYTICS_FETCHED_NODES,
    ANALYTICS_FETCH_NODES_FAILED,
    ANALYTICS_CLEAR_METRICS
} from '../constants/actionTypes';

const analyticsState = {
    currentAccountId: null,
    currentBotId: null,
    rangeFilter: null,
    startDate: null,
    endDate: null,
    date: null,
    gender: "All",
    timeZone: "All",
    locale: "All",
    filters: {},
    metrics: {
        // [accountId]: {
        //   [botId]: {
        //     [metric]: {
        //       fetching: false,
        //       params: {},
        //       data: {}
        //     }
        //   }
        // }
    },
    selectedMenu: null,
    isGoBtnEnabled: false
};

function analytics(state = analyticsState, action = null) {
    switch (action.type) {
        case ANALYTICS_SET_CURRENT_ACCOUNT_ID:
            return {
                ...state,
                currentAccountId: action.payload.accountId,

            };
        case ANALYTICS_SET_CURRENT_ACCOUNT_TIMEZONE:
            return {
                ...state,
                currentAccountTimeZone: action.payload.timeZone,
            };

        case ANALYTICS_CLEAR_CURRENT_ACCOUNT_TIMEZONE: {
            return {
                ...state,
                currentAccountTimeZone: null
            }
        }

        case ANALYTICS_SET_CURRENT_BOT_ID:
            return {
                ...state,
                currentBotId: action.payload.botId,
            };

        case ANALYTICS_START_DATE_CHANGED:
            return {
                ...state,
                startDate: action.payload.date,
            };

        case ANALYTICS_END_DATE_CHANGED:
            return {
                ...state,
                endDate: action.payload.date,
            };

        case ANALYTICS_ADD_FILTER:
            return {
                ...state,
                filters: {
                    ...state.filters,
                    [action.payload.filter]: {
                        term: {
                            [action.payload.filter]: action.payload.params
                        }
                    },
                },
            };

        case ANALYTICS_REMOVE_FILTER: {
            const restFilters = Object.keys(state.filters).reduce((rf, k) => {
                if (k !== action.payload.filter) {
                    /* eslint-disable no-param-reassign */
                    rf[k] = state.filters[k];
                    /* eslint-enable no-param-reassign */
                }
                return rf;
            }, {});
            return {
                ...state,
                filters: restFilters,
            };
        }

        case ANALYTICS_FETCHING_METRICS: {
            return state;
        }

        case ANALYTICS_FETCHED_METRICS: {
            const { accountId, botId, metrics, params } = action.payload;
            return {
                ...state,
                metrics: {
                    ...state.metrics,
                    [accountId]: {
                        ...(state.metrics[accountId] || {}),
                        [botId]: {
                            ...(
                                (state.metrics[accountId] && state.metrics[accountId][botId]) || {}
                            ),
                            params,
                            data: {
                                ...(
                                    (state.metrics[accountId] &&
                                        state.metrics[accountId][botId] &&
                                        state.metrics[accountId][botId].data) ||
                                    {}
                                ),
                                ...metrics,
                            },
                        },
                    },
                },
            };
        }

        case ANALYTICS_CLEAR_METRICS: {
            const { accountId, botId, metric } = action.payload;
            return {
                ...state,
                metrics: {
                    ...state.metrics,
                    [accountId]: {
                        ...(state.metrics[accountId] || {}),
                        [botId]: {
                            ...(
                                (state.metrics[accountId] && state.metrics[accountId][botId]) || {}
                            ),
                            ...state.metrics[accountId][botId].params,
                            data: {
                                ...(state.metrics[accountId] && state.metrics[accountId][botId] &&
                                state.metrics[accountId][botId].metrics) || {},
                                metric: null
                            },
                        },
                    },
                },
            };
        }

        case ANALYTICS_FETCHING_REFERRALS: {
            return state;
        }

        case ANALYTICS_FETCHED_REFERRALS: {
            return {
                ...state,
                referralNames: action.payload.referralsMap,
            };
        }
        case ANALYTICS_FETCHING_NODES: {
            return state;
        }

        case ANALYTICS_FETCHED_NODES: {
            return {
                ...state,
                allNodes: action.payload.allNodes,
            };
        }
        case SET_ANALYTICS_MENU:
            return {
                ...state,
                selectedMenu: action.payload.selectedMenu,
            }

        case ANALYTICS_SET_FILTER_GENDER:
            return {
                ...state,
                gender: action.payload.gender,
            }

        case ANALYTICS_SET_FILTER_TIMEZONE:
            return {
                ...state,
                timeZone: action.payload.timeZone,
            }

        case ANALYTICS_SET_FILTER_LOCALE:
            return {
                ...state,
                locale: action.payload.locale,
            }

        case ANALYTICS_SET_FILTER_RANGE:
            return {
                ...state,
                rangeFilter: action.payload.rangeFilter,
            }

        case ANALYTICS_IS_GO_ENABLED:
            return {
                ...state,
                isGoBtnEnabled: action.payload.isGoBtnEnabled,
            }

        default:
            return state;
    }
}

// newState[accountId][botId].data[metric].fetching = false;
export { analytics };

const fetchingAnalyticsState = {};

function fetchingAnalytics(state = fetchingAnalyticsState, action = null) {
    switch (action.type) {
        case ANALYTICS_FETCHING_METRICS: {
            return {
                ...state,
                [action.payload.metric]: true,
            };
        }

        case ANALYTICS_FETCHED_METRICS: {
            return {
                ...state,
                [action.payload.metric]: false,
            };
        }

        default:
            return state;
    }
}

export { fetchingAnalytics };
