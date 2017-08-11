import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import s from './AnalyticsPageV1.css';
import flexbox from '../../components/flexbox.css';
import {
    updateChartData, removeFilter, setAnalyticsMenu,
    fetchReferrals, clearMetric
} from '../../actions/analytics';
import metrics from '../../constants/metrics';
import LineChart from '../../components/Chart/LineChart';
import SummaryMetric from './summaryMetric';
import moment from 'moment';
import HelpLink from '../../components/HelpLink';
import languages from '../../languages/default.json';
const queryString = require('query-string');

import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';

const title = 'BotWorx.Ai - Analytics';

const mapStateToProps = (state) => {
    return {
        analytics: state.analytics,
        accountId: state.analytics.currentAccountId,
        botId: state.analytics.currentBotId,
        startDate: state.analytics.startDate,
        endDate: state.analytics.endDate,
        fetchingAnalytics: state.fetchingAnalytics,
        rangeFilter: state.analytics.rangeFilter
    }
};

const mapDispatch = (dispatch) => ({
    loadReferralNames: (accountId, botId) => {
        dispatch(fetchReferrals(accountId, botId));
    },

    updateChartData: (accountId, botId, startDate, endDate) => {
        dispatch(updateChartData(accountId, botId, startDate, endDate, metrics.metricType.REFERRALS));
    },

    updateChartSummaryData: (accountId, botId, startDate, endDate, rangeFilter) => {
        if (rangeFilter != 'custom') {
            const twiceStartDateString = moment(startDate).subtract(Number(rangeFilter), 'days').format('YYYY-MM-DD');
            dispatch(updateChartData(accountId, botId, twiceStartDateString, endDate, metrics.metricType.REFERRALS_SUMMARY));
        }
    },

    removeFilter: () => {
        dispatch(removeFilter('referenceId'));
    },

    setAnalyticsMenu: (menu) => {
        dispatch(setAnalyticsMenu(menu));
    },

    removeMetric: (accountId, botId, metric) => {
        dispatch(clearMetric(accountId, botId, metric))
    },
});
const styles = {
    tableCol: {
        width: '30%',
        textAlign: 'center'
    },
    tableColLeft: {
        width: '40%',
        textAlign: 'left'
    }
}
class ReferralsAnalyticsComponent extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount(nextProps) {
        const { updateChartData, accountId, botId, startDate, endDate, rangeFilter,
            updateChartSummaryData, setAnalyticsMenu, loadReferralNames } = this.props;

        setAnalyticsMenu(metrics.metricType.REFERRALS);
        loadReferralNames(accountId, botId);

        if (accountId && startDate && endDate) {
            updateChartData(accountId, botId, startDate, endDate);
            updateChartSummaryData(accountId, botId, startDate, endDate, rangeFilter);
        }
    }

    componentWillUnmount() {
        const { removeFilter, removeMetric, accountId, botId } = this.props;
        removeFilter();
        removeMetric(accountId, botId, metrics.metricType.REFERRALS);
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
        let tableData = [];
        let accountMetrics, referralData, referralSummaryData = null;
        if (analytics) {
            accountMetrics = analytics.metrics[this.props.accountId];
        }
        if (accountMetrics && accountMetrics[this.props.botId] && accountMetrics[this.props.botId].data[metrics.metricType.REFERRALS]) {
            referralData = accountMetrics[this.props.botId].data[metrics.metricType.REFERRALS];
            referralSummaryData = accountMetrics[this.props.botId].data[metrics.metricType.REFERRALS_SUMMARY];
        }

        if (referralData) {
            if (referralData.refIdAggregation.length > 0) {
                tableData = referralData.refIdAggregation;
            }
            graphData = referralData.dateAggregation;
            graphSummaryData = referralSummaryData ? referralSummaryData.dateAggregation : null;
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
                    <HelpLink content={languages.analytics.referrals.helpContent} label="Referral Click Type" />
                    <SummaryMetric metricData={metricData} />
                    <Table style={{ tableLayout: 'auto' }} bodyStyle={{ overflow: 'visible' }}>
                        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                            <TableRow>
                                <TableHeaderColumn style={styles.tableColLeft}>Reference</TableHeaderColumn>
                                <TableHeaderColumn style={styles.tableCol}>{graphData.data.columns[1][0]}</TableHeaderColumn>
                                <TableHeaderColumn style={styles.tableCol}>{graphData.data.columns[2][0]}</TableHeaderColumn>
                            </TableRow>
                        </TableHeader>

                        <TableBody displayRowCheckbox={false} showRowHover={true}>
                            {tableData.map(r =>
                                <TableRow key={r.key}>
                                    <TableRowColumn style={styles.tableColLeft}>{(analytics.referralNames ? analytics.referralNames[r.key] : null) || r.key}</TableRowColumn>
                                    <TableRowColumn style={styles.tableCol}>{r.newUsers.value}</TableRowColumn>
                                    <TableRowColumn style={styles.tableCol}>{r.repeatUsers.value}</TableRowColumn>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                    <div className={cx(s.root, flexbox.rowItem)} >
                        <LineChart metrics={graphData} label="Referral Clicks" />
                    </div>
                </div>
            )
        } else {
            return (<div></div>);
        }
    }
}

const ReferralsAnalytics = connect(mapStateToProps, mapDispatch)(ReferralsAnalyticsComponent);

export default withStyles(flexbox, s)(ReferralsAnalytics);
