import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import s from './AnalyticsPageV1.css';
import flexbox from '../../components/flexbox.css';
import { updateChartData, setAnalyticsMenu, clearMetric } from '../../actions/analytics';
import metrics from '../../constants/metrics';
import PieChart from '../../components/Chart/PieChart';
import HelpLink from '../../components/HelpLink';
import languages from '../../languages/default.json';
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';
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
        dispatch(updateChartData(accountId, botId, startDate, endDate, metrics.metricType.LOCALE));
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
        width: '50%',
        textAlign: 'center',
    },
    tableColLeft: {
        width: '50%',
        textAlign: 'left',
        whiteSpace: 'pre-wrap'
    }
}

class LocaleAnalyticsComponent extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount(nextProps) {
        const { updateChartData, accountId, botId, startDate, endDate, setAnalyticsMenu } = this.props;

        setAnalyticsMenu(metrics.metricType.LOCALE);

        if (accountId && startDate && endDate) {
            updateChartData(accountId, botId, startDate, endDate);
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
        removeMetric(accountId, botId, metrics.metricType.LOCALE);
    }



    static contextTypes = { setTitle: PropTypes.func.isRequired };

    render() {
        const { accountId, botId, startDate, endDate, analytics, fetchingAnalytics } = this.props;
        let graphData = {};
        let tableData = {};
        let accountMetrics = null;
        if (analytics) {
            accountMetrics = analytics.metrics[this.props.accountId];
        }
        if (accountMetrics && accountMetrics[this.props.botId] && accountMetrics[this.props.botId].data[metrics.metricType.LOCALE]) {
            graphData = accountMetrics[this.props.botId].data[metrics.metricType.LOCALE];
            tableData = accountMetrics[this.props.botId].data[metrics.metricType.LOCALE_TABULAR_DATA];
            this.context.setTitle(title);
            return (
                <div>
                    <HelpLink content={languages.analytics.locale.helpContent} label="Locale" />

                    <div className={cx(s.root, flexbox.rowItem)} >
                        <PieChart metrics={graphData} label="Locale" />
                    </div>
                    {(tableData && tableData.data.columns.length) ?
                        <Table style={{ tableLayout: 'fixed' }} bodyStyle={{ overflow: 'visible' }}>
                            <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                                <TableRow>
                                    <TableHeaderColumn style={styles.tableCol}>Locale</TableHeaderColumn>
                                    <TableHeaderColumn style={styles.tableCol}>Count</TableHeaderColumn>
                                </TableRow>
                            </TableHeader>

                            <TableBody displayRowCheckbox={false} showRowHover={true}>
                                {tableData.data.columns.map((r, i) =>
                                    <TableRow key={`row${i}`}>
                                        <TableRowColumn style={styles.tableColLeft}>{r[0]}</TableRowColumn>
                                        <TableRowColumn style={styles.tableCol}>{r[1]}</TableRowColumn>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table> : null}
                </div>
            )
        } else {
            return (<div></div>);
        }
    }
}

const LocaleAnalytics = connect(mapStateToProps, mapDispatch)(LocaleAnalyticsComponent);

export default withStyles(flexbox, s)(LocaleAnalytics);
