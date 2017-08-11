import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import s from './AnalyticsPageV1.css';
import flexbox from '../../components/flexbox.css';
import { updateChartData, removeFilter, setAnalyticsMenu, clearMetric } from '../../actions/analytics';
import metrics from '../../constants/metrics';
import LineChart from '../../components/Chart/LineChart';
import SummaryMetric from './summaryMetric';
import moment from 'moment';
import { navigate } from '../../actions/route';
import HelpLink from '../../components/HelpLink';
import languages from '../../languages/default.json';
const queryString = require('query-string');

const title = 'BotWorx.Ai - Analytics';

let dataMetric = [metrics.metricType.USER_CHANGE, metrics.metricType.MESSAGE_SESSION_ENGAGED,
metrics.metricType.MESSAGE_COUNT, metrics.metricType.SUBSCRIPTION_CHANGE];
let summaryMetric = [metrics.metricType.USER_CHANGE_SUMMARY, metrics.metricType.MESSAGE_SESSION_ENGAGED_SUMMARY,
metrics.metricType.MESSAGE_COUNT_SUMMARY, metrics.metricType.SUBSCRIPTION_CHANGE_SUMMARY];

const mapStateToProps = (state) => {
    return {
        analytics: state.analytics,
        accountId: state.analytics.currentAccountId,
        botId: state.analytics.currentBotId,
        startDate: state.analytics.startDate,
        endDate: state.analytics.endDate,
        date: state.analytics.date,
        fetchingAnalytics: state.fetchingAnalytics,
        analyticsFilters: state.analytics.filters,
        rangeFilter: state.analytics.rangeFilter,
    }
};

const mapDispatch = (dispatch) => ({

    updateOverviewData: (accountId, botId, startDate, endDate, rangeFilter) => {
        const summaryStartDate = moment(startDate).subtract(Number(rangeFilter), 'days').format('YYYY-MM-DD');
        dispatch(updateChartData(accountId, botId, startDate, endDate, metrics.metricType.OVERVIEW, summaryStartDate))
    },
    setAnalyticsMenu: (menu) => {
        dispatch(setAnalyticsMenu(menu));
    },

    removeMetric: (accountId, botId, metric) => {
        dispatch(clearMetric(accountId, botId, metric))
    },

    handleMetricClick: (metric) => {
        switch (metric) {
            case "New Users": {
                dispatch(navigate('/analytics/v1/users'));
                break;
            }
            case "New Sessions": {
                dispatch(navigate('/analytics/v1/sessions'));
                break;
            }
            case "Total Messages": {
                dispatch(navigate('/analytics/v1/messages'));
                break;
            }
            case "In Messages": {
                dispatch(navigate('/analytics/v1/messages'));
                break;
            }
            case "Out Messages": {
                dispatch(navigate('/analytics/v1/messages'));
                break;
            }
            case "New Subscriptions": {
                dispatch(navigate('/analytics/v1/subscriptionChange'));
                break;
            }
            case "New Referrals": {
                dispatch(navigate('/analytics/v1/referrals'));
                break;
            }
        }
    }
});

class OverviewAnalyticsComponent extends Component {
    constructor(props) {
        super(props);
        this.metricData = null;
        this.firstTimeFetchMetrics = true;
    }

    componentWillMount(nextProps) {
        const { updateOverviewData, accountId, botId, startDate, endDate, rangeFilter,
            setAnalyticsMenu } = this.props;

        setAnalyticsMenu(metrics.metricType.OVERVIEW);

        if (accountId && startDate && endDate) {
            updateOverviewData(accountId, botId, startDate, endDate, rangeFilter);
        }
    }

    componentDidMount() {
        // Append selected accountId as query param in window location
        let parsedQS = {};
        let selectedAccountId;
        if (this.props.accountId) {
            selectedAccountId = this.props.accountId;
        } else {
            const parsed = queryString.parse(location.search);
            const accountId = parsed.accountId;
            if (accountId) {
                selectedAccountId = accountId;
            } else {
                selectedAccountId = '';
            }
        }
        parsedQS.accountId = selectedAccountId;
        const stringified = queryString.stringify(parsedQS);
        let newUrl = window.location.origin + window.location.pathname + '?' + stringified;
        window.history.pushState({}, null, newUrl);
    }

    componentWillReceiveProps(nextProps) {
        const { updateOverviewData, accountId, botId, startDate, endDate, rangeFilter, analytics } = this.props;
        if (this.firstTimeFetchMetrics && accountId && nextProps.startDate && nextProps.endDate &&
            !startDate && !endDate) {
            updateOverviewData(accountId, nextProps.botId, nextProps.startDate, nextProps.endDate, nextProps.rangeFilter)
            this.firstTimeFetchMetrics = false;
        }
    }

    componentWillUnmount() {
        const { removeMetric, accountId, botId, } = this.props;
        removeMetric(accountId, botId, metrics.metricType.OVERVIEW);
    }

    static contextTypes = { setTitle: PropTypes.func.isRequired };

    render() {
        const { analytics, accountId, botId, handleMetricClick } = this.props;
        let graphData, graphSummaryData = {}, accountMetrics = null, metrics = null;

        if (botId) {
            const accountData = analytics.metrics[accountId];
            if (accountData) {
                const botData = accountData[botId];
                if (botData) {
                    metrics = botData.data.Overview || null;

                    return metrics ? (
                        <div>
                            <HelpLink content={languages.analytics.overview.helpContent} label="Overview" />
                            <SummaryMetric metricData={metrics.firstRow} clickable={true}
                                handleMetricClick={handleMetricClick} />
                            <SummaryMetric metricData={metrics.secondRow} clickable={true}
                                handleMetricClick={handleMetricClick} />
                            <SummaryMetric metricData={metrics.thirdRow} clickable={true}
                                handleMetricClick={handleMetricClick} />
                        </div>
                    ) :
                        (<div></div>)
                }
            }
        }
        return (<div></div>)
    }
}


const OverviewAnalytics = connect(mapStateToProps, mapDispatch)(OverviewAnalyticsComponent);

export default withStyles(flexbox, s)(OverviewAnalytics);
