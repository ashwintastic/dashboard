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
import Griddle, { plugins } from 'griddle-react';
import Divider from 'material-ui/Divider';
import metrics from '../../constants/metrics';
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

const percentColors = [
    { pct: 0, color: { r: 0xe1, g: 0xf5, b: 0xfe } },
    { pct: 0.1, color: { r: 0x6c, g: 0xe1, b: 0xff } },
    { pct: 0.2, color: { r: 0x62, g: 0xd7, b: 0xff } },
    { pct: 0.3, color: { r: 0x58, g: 0xcd, b: 0xfa } },
    { pct: 0.4, color: { r: 0x4e, g: 0xc3, b: 0xf0 } },
    { pct: 0.5, color: { r: 0x3a, g: 0xaf, b: 0xdc } },
    { pct: 0.6, color: { r: 0x1c, g: 0x91, b: 0xbe } },
    { pct: 0.7, color: { r: 0x00, g: 0x55, b: 0x82 } },
    { pct: 0.8, color: { r: 0x29, g: 0x5f, b: 0x8e } },
    { pct: 0.9, color: { r: 0x2b, g: 0x56, b: 0x7b } },
    { pct: 1, color: { r: 0x21, g: 0x45, b: 0x64 } }
];

const getHeatMapValue = function (value) {
    if (!value) {
        return 'rgb(255,255,255)';
    }
    let finalVal = value ? Number(value.replace(/\%$/, '')) : 0;
    let pct = finalVal / 100;
    for (var i = 1; i < percentColors.length - 1; i++) {
        if (pct < percentColors[i].pct) {
            break;
        }
    }
    var lower = percentColors[i - 1];
    var upper = percentColors[i];
    var range = upper.pct - lower.pct;
    var rangePct = (pct - lower.pct) / range;
    var pctLower = 1 - rangePct;
    var pctUpper = rangePct;
    var color = {
        r: Math.floor(lower.color.r * pctLower + upper.color.r * pctUpper),
        g: Math.floor(lower.color.g * pctLower + upper.color.g * pctUpper),
        b: Math.floor(lower.color.b * pctLower + upper.color.b * pctUpper)
    };
    return 'rgb(' + [color.r, color.g, color.b].join(',') + ')';
    // or output as hex if preferred
}

const customStyle = function (value) {
    let style = {};
    if (!String(value).includes('%')) {
        if (String(value).length > 10) {
            style.width = '125px';
            style.paddingLeft = '15px';
            style.paddingRight = '15px';
        }
        else {
            style.width = '100px';
        }
        style.backgroundColor = 'rgb(255,255,255)';
    }
    else {
        style.backgroundColor = getHeatMapValue(value);
        let finalVal = value ? Number(value.replace(/\%$/, '')) : 0;
        if (finalVal > 50) {
            style.color = 'white';
        }
        style.width = '7em';
        style.fontWeight = '100';
        style.whiteSpace = 'normal';
    }
    style.textAlign = 'center';
    style.position = 'relative';
    style.textOverflow = 'inherit';
    return style;
}

const customHeaderStyle = function (value) {
    let style = {};
    if (String(value) === 'Date') {
        style.width = '110px';
    } else if (String(value) === 'New Users') {
        style.width = '90px';
    }
    else {
        style.width = '7em';
    }
    style.position = 'relative';
    style.textAlign = 'center';
    style.fontSize = '13px';
    style.paddingLeft = '0px';
    style.paddingRight = '0px';
    return style;
}

const customRowStyle = (obj) => {
    let style = {};
    // need to show different style for Average row
    if (obj.Date == 'Average') {
        console.log('applying style');
        style.borderBottom = '1px solid black';
        style.borderTop = '1px solid black';
    }

    return style;
}

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
    currentAccountTimeZone: state.analytics.currentAccountTimeZone
});

const mapDispatch = (dispatch) => ({

    updateRetentionCharts: (accountId, botId, startDate, endDate, currentAccountTimeZone) => {
        dispatch(updateChartData(accountId, botId, startDate, endDate, metrics.metricType.RETENTION, null, currentAccountTimeZone));
    },

    setAnalyticsMenu: (menu) => {
        dispatch(setAnalyticsMenu(menu));
    },

    removeMetric: (accountId, botId, metric) => {
        dispatch(clearMetric(accountId, botId, metric))
    },

});

class UserRetentionAnalytics extends Component {
    constructor(props) {
        super(props);
        this.userRetentionMetrics = null;
        this.engagementByDayMetrics = null;
    }

    componentWillMount() {
        const { updateRetentionCharts, accountId, botId, startDate, endDate,
            setAnalyticsMenu, currentAccountTimeZone } = this.props;

        setAnalyticsMenu(metrics.metricType.RETENTION);

        if (accountId && startDate && endDate && currentAccountTimeZone) {
            updateRetentionCharts(accountId, botId, startDate, endDate, currentAccountTimeZone);
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
        removeMetric(accountId, botId, metrics.metricType.RETENTION);
    }

    static contextTypes = { setTitle: PropTypes.func.isRequired };

    render() {
        const { accountId, botId, startDate, endDate, analytics, fetchingAnalytics } = this.props;

        if (botId) {
            const accountData = analytics.metrics[accountId];
            if (accountData) {
                const botData = accountData[botId];
                if (botData) {
                    this.userRetentionMetrics = botData.data.UserRetention || null;
                    this.engagementByDayMetrics = botData.data.EngagementByDay || null;
                    this.engagementByDateMetrics = botData.data.EngagementByDate || null;
                }
            }
        }
        return this.userRetentionMetrics && this.engagementByDayMetrics && this.engagementByDateMetrics ? (
            <div>
                <HelpLink content={languages.analytics.retention.helpContent} />
                <div>
                    <LineChart metrics={this.engagementByDayMetrics} label='Retention By Day' />
                </div>
                <br />
                <div>
                    <LineChart metrics={this.engagementByDateMetrics} label='Retention By Date' />
                </div>

                <br />
                <div className={cx(s.root, flexbox.column, s.retentionPage)}>
                    <Paper className={s.retention}>
                        <h4 style={{ marginLeft: "10px", marginTop: "20px" }}>New User Retention</h4>
                        <Table style={{ tableLayout: 'fixed', whiteSpace: 'nowrap' }} bodyStyle={{ overflow: 'visible' }}>
                            <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                                <TableRow>
                                    {Object.keys(this.userRetentionMetrics[0]).map(i =>
                                        <TableHeaderColumn style={customHeaderStyle(i)}>{i}</TableHeaderColumn>
                                    )}
                                </TableRow>
                            </TableHeader>

                            <TableBody displayRowCheckbox={false} showRowHover={true}>
                                {this.userRetentionMetrics.map(u =>
                                    <TableRow key={u.date} style={customRowStyle(u)}>
                                        {Object.keys(u).map(i =>
                                            <TableRowColumn style={customStyle(u[i])}>{u[i]}</TableRowColumn>
                                        )}
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </Paper>
                </div>
            </div>
        ) :
            <div></div>
    }
}

UserRetentionAnalytics = withStyles(flexbox, s)(UserRetentionAnalytics);

export default connect(mapStateToProps, mapDispatch)(UserRetentionAnalytics);
