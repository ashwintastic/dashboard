import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import s from './AnalyticsPageV1.css';
import flexbox from '../../components/flexbox.css';
import { updateChartData, setAnalyticsMenu, removeFilter, clearMetric } from '../../actions/analytics';
import { fetchSubscriptionEntries } from '../../actions/broadcast';
import metrics from '../../constants/metrics';
import LineChart from '../../components/Chart/LineChart';
import SummaryMetric from './summaryMetric';
import moment from 'moment';
import HelpLink from '../../components/HelpLink';
import languages from '../../languages/default.json';
const queryString = require('query-string');

const title = 'BotWorx.Ai - Analytics';

const mapStateToProps = (state) => {
    return {
        analytics: state.analytics,
        accountId: state.analytics.currentAccountId,
        botId: state.analytics.currentBotId,
        startDate: state.analytics.startDate,
        endDate: state.analytics.endDate,
        fetchingAnalytics: state.fetchingAnalytics,
        rangeFilter: state.analytics.rangeFilter,
    }
};

const mapDispatch = (dispatch) => ({
    loadSubscriptions: (accountId, botId) => {
        dispatch(fetchSubscriptionEntries(accountId, botId));
    },

    updateChartData: (accountId, botId, startDate, endDate) => {
        dispatch(updateChartData(accountId, botId, startDate, endDate, metrics.metricType.SUBSCRIPTION_CHANGE));
    },

    updateChartSummaryData: (accountId, botId, startDate, endDate, rangeFilter) => {
        if (rangeFilter != 'custom') {
            const twiceStartDateString = moment(startDate).subtract(Number(rangeFilter), 'days').format('YYYY-MM-DD');
            dispatch(updateChartData(accountId, botId, twiceStartDateString, endDate, metrics.metricType.SUBSCRIPTION_CHANGE_SUMMARY));
        }
    },

    setAnalyticsMenu: (menu) => {
        dispatch(setAnalyticsMenu(menu));
    },

    removeFilter: () => {
        dispatch(removeFilter('subscriptionId'));
    },

    removeMetric: (accountId, botId, metric) => {
        dispatch(clearMetric(accountId, botId, metric))
    },
});

class SubscriptionsChangeAnalyticsComponent extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount(nextProps) {
        const { updateChartData, accountId, botId, startDate, endDate, updateChartSummaryData,
            rangeFilter, setAnalyticsMenu, loadSubscriptions } = this.props;

        setAnalyticsMenu(metrics.metricType.SUBSCRIPTION_CHANGE);
        if (accountId) {
            loadSubscriptions(accountId, botId);
        }
        if (accountId && startDate && endDate) {
            updateChartData(accountId, botId, startDate, endDate);
            updateChartSummaryData(accountId, botId, startDate, endDate, rangeFilter);
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

    componentWillUnmount() {
        const { removeFilter, removeMetric, accountId, botId } = this.props;
        removeFilter();
        removeMetric(accountId, botId, metrics.metricType.SUBSCRIPTION_CHANGE);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.analytics.metrics != this.props.analytics.metrics;
    }

    add(a, b) {
        return Number(a) + Number(b);
    }

    calculatePercentageChange(currentData, pastData, idx) {

        const { rangeFilter } = this.props;
        if (rangeFilter == 'custom') {
            return;
        }
        if (typeof pastData[idx - 1] != 'undefined') {
            let currentNo = currentData.number;
            let totalNo = pastData[idx - 1].number;
            let pastNo = totalNo - currentNo;
            // Any one is not a number
            if (!this.isNumeric(currentNo) || !this.isNumeric(totalNo)) {
                return "N/A";
            }

            // If both are 0, increase % is also 0
            if (currentNo == 0 && pastNo == 0) {
                return 0;
            }

            // If just past number is 0, increase % is infinite and should be displayed as N/A
            if (pastNo == 0) {
                return "N/A";
            }

            let increment = (currentNo - pastNo) * 100 / pastNo;

            return increment % 1 == 0 ? increment : increment.toFixed(1);
        }
    }

    isNumeric(number) {
        return !isNaN(parseFloat(number)) && isFinite(number);
    }

    static contextTypes = { setTitle: PropTypes.func.isRequired };

    render() {
        const { accountId, botId, startDate, endDate, analytics, fetchingAnalytics } = this.props;
        let graphData, graphSummaryData = {};
        let accountMetrics = null;
        if (analytics) {
            accountMetrics = analytics.metrics[this.props.accountId];
        }
        if (accountMetrics && accountMetrics[this.props.botId] && accountMetrics[this.props.botId].data[metrics.metricType.SUBSCRIPTION_CHANGE]) {
            graphData = accountMetrics[this.props.botId].data[metrics.metricType.SUBSCRIPTION_CHANGE];
            graphSummaryData = accountMetrics[this.props.botId].data[metrics.metricType.SUBSCRIPTION_CHANGE_SUMMARY];
            this.context.setTitle(title);

            let metricSummaryData = [];
            let rawMetricSummaryData = graphSummaryData ? graphSummaryData.data.columns : [];
            rawMetricSummaryData.map((column, idx) => {
                if (idx != 0) {// 0 index contains date data
                    let metricObj = {};
                    let clonedColumn = [...column];
                    metricObj.metric = clonedColumn.splice(0, 1); // 0 index contains metric name
                    metricObj.number = clonedColumn.reduce(this.add, 0);
                    metricSummaryData.push(metricObj);
                }
            })

            let metricData = [];
            let rawMetricData = graphData ? graphData.data.columns : [];
            rawMetricData.map((column, idx) => {
                if (idx != 0) {// 0 index contains date data
                    let metricObj = {};
                    let clonedColumn = [...column];
                    metricObj.metric = clonedColumn.splice(0, 1); // 0 index contains metric name
                    metricObj.number = clonedColumn.reduce(this.add, 0);
                    metricObj.change = this.calculatePercentageChange(metricObj, metricSummaryData, idx);
                    metricData.push(metricObj);
                }
            })

            return (
                <div>
                    <HelpLink content={languages.analytics.subscriptionChange.helpContent} label="Subscription Change Types" />
                    <SummaryMetric metricData={metricData} />
                    <div className={cx(s.root, flexbox.rowItem)} >
                        <LineChart metrics={graphData} label="Subscription Change" />
                    </div>
                </div>
            )
        } else {
            return (<div></div>);
        }
    }
}

const SubscriptionsChangeAnalytics = connect(mapStateToProps, mapDispatch)(SubscriptionsChangeAnalyticsComponent);

export default withStyles(flexbox, s)(SubscriptionsChangeAnalytics);
