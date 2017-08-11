import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import s from './AnalyticsPageV1.css';
import flexbox from '../../components/flexbox.css';
import { connect } from 'react-redux';
import LineChart from '../../components/Chart/LineChart';
import { updateChartData, setAnalyticsMenu, clearMetric } from '../../actions/analytics';
import metrics from '../../constants/metrics';
import SummaryMetric from './summaryMetric';
import _ from 'lodash';
import moment from 'moment';
import HelpLink from '../../components/HelpLink';
import languages from '../../languages/default.json';
const queryString = require('query-string');

const title = 'BotWorx.Ai - Analytics';

const mapStateToProps = (state) => {
    return {
        analytics: state.analytics,
        accountBots: state.accountBots.accountBots[state.analytics.currentAccountId],
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
        languages: state.botPolls.languagesList
    }
};

const mapDispatch = (dispatch) => ({

    updateChartData: (accountId, botId, startDate, endDate) => {
        dispatch(updateChartData(accountId, botId, startDate, endDate, metrics.metricType.MESSAGE_ENGAGEMENT));
    },

    updateChartSummaryData: (accountId, botId, startDate, endDate, rangeFilter) => {
        if (rangeFilter != 'custom') {
            const twiceStartDateString = moment(startDate).subtract(Number(rangeFilter), 'days').format('YYYY-MM-DD');
            const endDateForSummary = moment(startDate).subtract(1, 'days').format('YYYY-MM-DD');
            dispatch(updateChartData(accountId, botId, twiceStartDateString, endDateForSummary, metrics.metricType.MESSAGE_ENGAGEMENT_SUMMARY));
        }
    },

    setAnalyticsMenu: (menu) => {
        dispatch(setAnalyticsMenu(menu));
    },

    removeMetric: (accountId, botId, metric) => {
        dispatch(clearMetric(accountId, botId, metric))
    },

});

class EngagementAnalyticsComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    componentWillMount(nextProps) {
        const { updateChartData, accountId, botId, startDate, endDate,
            updateChartSummaryData, rangeFilter, setAnalyticsMenu } = this.props;

        setAnalyticsMenu(metrics.metricType.MESSAGE_ENGAGEMENT);

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

    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.analytics.metrics != this.props.analytics.metrics;
    }

    componentWillUnmount() {
        const { removeMetric, accountId, botId, } = this.props;
        removeMetric(accountId, botId, metrics.metricType.MESSAGE_ENGAGEMENT);
    }

    addAndCalculateAverage(a, b, idx, arr) {
        if (idx == arr.length - 1) {
            return Number((Number(a) + Number(b)) / arr.length).toFixed(2);
        } else {
            return Number(a) + Number(b);
        }
    }

    calculatePercentageChange(currentNo, pastNo) {
        const { rangeFilter } = this.props;
        if (rangeFilter == 'custom') {
            return;
        }

        console.log('currentNo', currentNo);
        console.log('pastNo', pastNo);
        // Any one is not a number
        if (!this.isNumeric(currentNo) || !this.isNumeric(pastNo)) {
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

    isNumeric(number) {
        return !isNaN(parseFloat(number)) && isFinite(number);
    }

    static contextTypes = { setTitle: PropTypes.func.isRequired };

    render() {
        const { analytics } = this.props;
        let accountMetrics = null;
        if (analytics) {
            accountMetrics = analytics.metrics[this.props.accountId];
        }
        if (accountMetrics && accountMetrics[this.props.botId] && accountMetrics[this.props.botId].data.MessageEngagement) {
            const engamentGraphData = accountMetrics[this.props.botId].data.MessageEngagement;
            const engamentSummaryData = accountMetrics[this.props.botId].data.MessageEngagementSummary;

            const messagesPerUser = engamentGraphData.messagesPerUser;

            const sessionsPerUser = engamentGraphData.sessionsPerUser;

            const messagePerSession = engamentGraphData.messagePerSession;

            let totalUsersCurrent = engamentGraphData ? engamentGraphData.totalUsers : 0;
            let totalUsersPast = engamentSummaryData ? engamentSummaryData.totalUsers : 0;

            let totalMessagesCurrent = engamentGraphData ? engamentGraphData.totalMessages : 0;
            let totalMessagesPast = engamentSummaryData ? engamentSummaryData.totalMessages : 0;

            let totalSessionsCurrent = engamentGraphData ? engamentGraphData.totalSessions : 0;
            let totalSessionsPast = engamentSummaryData ? engamentSummaryData.totalSessions : 0;


            this.context.setTitle(title);

            let metricData = [
                {
                    metric: 'Avg. Messages Per User',
                    number: Number(Number(totalMessagesCurrent) / Number(totalUsersCurrent)).toFixed(2),
                    change: this.calculatePercentageChange(Number(Number(totalMessagesCurrent) / Number(totalUsersCurrent)).toFixed(2),
                        Number(Number(totalMessagesPast) / Number(totalUsersPast)).toFixed(2))
                },
                {
                    metric: 'Avg. Sessions Per User',
                    number: Number(Number(totalSessionsCurrent) / Number(totalUsersCurrent)).toFixed(2),
                    change: this.calculatePercentageChange(Number(Number(totalSessionsCurrent) / Number(totalUsersCurrent)).toFixed(2),
                        Number(Number(totalSessionsPast) / Number(totalUsersPast)).toFixed(2))
                },
                {
                    metric: 'Avg. Messages Per Session',
                    number: Number(Number(totalMessagesCurrent) / Number(totalSessionsCurrent)).toFixed(2),
                    change: this.calculatePercentageChange(Number(Number(totalMessagesCurrent) / Number(totalSessionsCurrent)).toFixed(2),
                        Number(Number(totalMessagesPast) / Number(totalSessionsPast)).toFixed(2))
                }
            ];

            return (
                <div>
                    <HelpLink content={languages.analytics.engagement.helpContent} label="Engagement" />
                    <SummaryMetric metricData={metricData} />
                    <div>
                        <LineChart metrics={messagesPerUser} label='Messages Per User' />
                        <LineChart metrics={sessionsPerUser} label='Sessions Per User' />
                        <LineChart metrics={messagePerSession} label='Messages Per Session' />
                    </div>
                </div>
            )
        } else {
            return (<div></div>);
        }
    }
}

const EngagementAnalytics = connect(mapStateToProps, mapDispatch)(EngagementAnalyticsComponent);

export default withStyles(flexbox, s)(EngagementAnalytics);
