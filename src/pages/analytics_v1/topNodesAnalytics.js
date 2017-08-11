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
        fetchingAnalytics: state.fetchingAnalytics
    }
};
const styles = {
    tableCol: {
        width: '25%',
        textAlign: 'center',
    },
    tableColLeft: {
        width: '25%',
        textAlign: 'left',
        whiteSpace: 'pre-wrap'
    },
    chartColumn: {
        display: 'inline-block',
        width: '45%',
        verticalAlign: 'top',
        marginRight: '5em'
    }
}
const mapDispatch = (dispatch) => ({

    updateChartData: (accountId, botId, startDate, endDate) => {
        dispatch(updateChartData(accountId, botId, startDate, endDate, metrics.metricType.TOP_NODES));
    },

    setAnalyticsMenu: (menu) => {
        dispatch(setAnalyticsMenu(menu));
    },

    removeMetric: (accountId, botId, metric) => {
        dispatch(clearMetric(accountId, botId, metric))
    },
});

class TopNodesAnalyticsComponent extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount(nextProps) {
        const { updateChartData, accountId, botId, startDate, endDate, setAnalyticsMenu } = this.props;

        setAnalyticsMenu(metrics.metricType.TOP_NODES);

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
        removeMetric(accountId, botId, metrics.metricType.TOP_NODES);
    }

    static contextTypes = { setTitle: PropTypes.func.isRequired };

    render() {
        const { accountId, botId, startDate, endDate, analytics, fetchingAnalytics } = this.props;
        let graphData = {};
        let accountMetrics = null;
        if (analytics) {
            accountMetrics = analytics.metrics[this.props.accountId];
        }
        let visitsTableData, clicksTableData = [];
        if (accountMetrics && accountMetrics[this.props.botId] && accountMetrics[this.props.botId].data[metrics.metricType.TOP_NODES]) {
            graphData = accountMetrics[this.props.botId].data[metrics.metricType.TOP_NODES];
            graphData.visits.pie = {
                label: {
                    format: function (value, ratio, id) {
                        return value;
                    }
                }
            }
            graphData.clicks.pie = {
                label: {
                    format: function (value, ratio, id) {
                        return value;
                    }
                }
            }
            visitsTableData = graphData.visitsTable;
            clicksTableData = graphData.clicksTable;
            this.context.setTitle(title);
            return (
                <div>
                    <HelpLink content={languages.analytics.topNodes.helpContent} label="Top Nodes" />
                    <div className={cx(flexbox.columnItem, flexbox.row, s.charts)} style={styles.chartColumn}>
                        <PieChart metrics={graphData.visits} label="Top 50 Nodes Visited" />
                        {(visitsTableData && visitsTableData.length) ?
                            <Table style={{ tableLayout: 'fixed' }} bodyStyle={{ overflow: 'visible' }}>
                                <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                                    <TableRow>
                                        <TableHeaderColumn style={styles.tableCol}>Node</TableHeaderColumn>
                                        <TableHeaderColumn style={styles.tableCol}>Visits</TableHeaderColumn>
                                    </TableRow>
                                </TableHeader>

                                <TableBody displayRowCheckbox={false} showRowHover={true}>
                                    {visitsTableData.map((r, i) =>
                                        <TableRow key={`row${i}`}>
                                            <TableRowColumn style={styles.tableColLeft}>{r[0]}</TableRowColumn>
                                            <TableRowColumn style={styles.tableCol}>{r[1]}</TableRowColumn>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table> : null}
                    </div>
                    <div style={styles.chartColumn}>
                        <PieChart metrics={graphData.clicks} label="Top 50 Nodes Clicked" />
                        {(clicksTableData && clicksTableData.length) ?
                            <Table style={{ tableLayout: 'fixed' }} bodyStyle={{ overflow: 'visible' }}>
                                <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                                    <TableRow>
                                        <TableHeaderColumn style={styles.tableCol}>Node</TableHeaderColumn>
                                        <TableHeaderColumn style={styles.tableCol}>Clicks</TableHeaderColumn>
                                    </TableRow>
                                </TableHeader>

                                <TableBody displayRowCheckbox={false} showRowHover={true}>
                                    {clicksTableData.map((r, i) =>
                                        <TableRow key={`row${i}`}>
                                            <TableRowColumn style={styles.tableColLeft}>{r[0]}</TableRowColumn>
                                            <TableRowColumn style={styles.tableCol}>{r[1]}</TableRowColumn>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table> : null}
                    </div>
                </div>
            )
        } else {
            return (<div></div>);
        }
    }
}

const TopNodesAnalytics = connect(mapStateToProps, mapDispatch)(TopNodesAnalyticsComponent);

export default withStyles(flexbox, s)(TopNodesAnalytics);
