import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import s from './AnalyticsPageV1.css';
import flexbox from '../../components/flexbox.css';
import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';
import EditIcon from 'material-ui/svg-icons/image/edit';
import { blue500, red500, green500 } from 'material-ui/styles/colors';
import Link from '../../components/Link';
import CreateUserEntryIcon from 'material-ui/svg-icons/content/add-box'
import RaisedButton from 'material-ui/RaisedButton';
import RemoveIcon from 'material-ui/svg-icons/action/delete';
import Form from "react-jsonschema-form";
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import { updateChartData, setAnalyticsMenu, clearMetric } from '../../actions/analytics';
import { connect } from 'react-redux';
import LineChart from '../../components/Chart/LineChart';
import SummaryMetric from './summaryMetric';
import metrics from '../../constants/metrics';
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

const styles = {
    userInfo: {
        width: 550,
        minHeight: 250,
        marginLeft: 330,
        marginTop: -200,
        padding: '25px 0px 15px 20px',
    },
    formField: {
        width: 400,
        padding: '5px 10px 10px 5px',
    },
    menu: {
        paddingTop: '0 px',
        paddingBottom: '0 px'
    }
};

const title = 'BotWorx.Ai - Analytics';

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
    allAccounts: state.accounts.list,
    gender: state.analytics.gender,
    timeZone: state.analytics.timeZone,
    locale: state.analytics.locale,
    rangeFilter: state.analytics.rangeFilter,
    languages: state.botPolls.languagesList,
});

const mapDispatch = (dispatch) => ({

    updateUserChangeCharts: (accountId, botId, startDate, endDate) => {
        dispatch(updateChartData(accountId, botId, startDate, endDate, metrics.metricType.USER_CHANGE));
    },

    updateUserChangeSummary: (accountId, botId, startDate, endDate, rangeFilter) => {
        if (rangeFilter != 'custom') {
            const twiceStartDateString = moment(startDate).subtract(Number(rangeFilter), 'days').format('YYYY-MM-DD');
            dispatch(updateChartData(accountId, botId, twiceStartDateString, endDate, metrics.metricType.USER_CHANGE_SUMMARY));
        }
    },

    setAnalyticsMenu: (menu) => {
        dispatch(setAnalyticsMenu(menu));
    },

    removeMetric: (accountId, botId, metric) => {
        dispatch(clearMetric(accountId, botId, metric))
    },

});

class UserChangeAnalytics extends Component {
    constructor(props) {
        super(props);
        this.userChangeMetrics = null;
    }

    componentWillMount() {
        const { updateUserChangeCharts, accountId, botId, startDate, endDate,
            updateUserChangeSummary, rangeFilter, setAnalyticsMenu } = this.props;

        setAnalyticsMenu(metrics.metricType.USER_CHANGE);

        if (accountId && startDate && endDate) {
            updateUserChangeCharts(accountId, botId, startDate, endDate);
            updateUserChangeSummary(accountId, botId, startDate, endDate, rangeFilter);
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
        const { removeMetric, accountId, botId } = this.props;
        removeMetric(accountId, botId, metrics.metricType.USER_CHANGE);
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
        if (botId) {
            const accountData = analytics.metrics[accountId];
            if (accountData) {
                const botData = accountData[botId];
                if (botData) {
                    this.userChangeMetrics = botData.data.UserChange || null;
                    this.userChangeSummaryMetrics = botData.data.UserChangeSummary || null;
                }
            }
        }
        let metricSummaryData = [];
        let rawMetricSummaryData = this.userChangeSummaryMetrics ? this.userChangeSummaryMetrics.data.columns : [];
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
        let rawMetricData = this.userChangeMetrics ? this.userChangeMetrics.data.columns : [];
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
        return this.userChangeMetrics ? (
            <div>
                <HelpLink content={languages.analytics.userChange.helpContent} label="User Change Types" />
                <SummaryMetric metricData={metricData} />
                <div className={cx(s.root, flexbox.rowItem)} >
                    <LineChart
                        metrics={this.userChangeMetrics}
                        label="User Change"
                        loading={fetchingAnalytics.UserChange}
                    />
                </div>
            </div>
        ) :
            <div></div>
    }
}

UserChangeAnalytics = withStyles(flexbox, s)(UserChangeAnalytics);

export default connect(mapStateToProps, mapDispatch)(UserChangeAnalytics);
