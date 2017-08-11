import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import s from './AnalyticsPageV1.css';
import flexbox from '../../components/flexbox.css';
import chartCss from '../../components/Chart/Chart.css';
import {
    updateChartData, removeFilter, setAnalyticsMenu,
    setCurrentBotId, fetchNodes, clearMetric
} from '../../actions/analytics';
import metrics from '../../constants/metrics';
import Paper from 'material-ui/Paper';
import moment from 'moment';
import SummaryMetric from './summaryMetric';

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
        accountBots: state.accountBots,
        rangeFilter: state.analytics.rangeFilter
    }
};

const mapDispatch = (dispatch) => ({

    updateChartData: (accountId, botId, startDate, endDate) => {
        dispatch(updateChartData(accountId, botId, startDate, endDate, metrics.metricType.NODE_ANALYSIS));
    },

    updateChartSummaryData: (accountId, botId, startDate, endDate, rangeFilter) => {
        dispatch(updateChartData(accountId, botId, startDate, endDate,
            metrics.metricType.TOP_NODES));
        const twiceStartDateString = moment(startDate).subtract(Number(rangeFilter), 'days').format('YYYY-MM-DD');
        dispatch(updateChartData(accountId, botId, twiceStartDateString, endDate,
            metrics.metricType.TOP_NODES_SUMMARY));
    },

    setAnalyticsMenu: (menu) => {
        dispatch(setAnalyticsMenu(menu));
    },

    setCurrentBotId: (botId) => {
        dispatch(setCurrentBotId(botId));
    },

    fetchExistingFlowNodes: (botId, accountId) => {
        dispatch(fetchNodes(botId, accountId));
    },

    removeFilter: () => {
        dispatch(removeFilter('node'));
    },

    removeMetric: (accountId, botId, metric) => {
        dispatch(clearMetric(accountId, botId, metric))
    },

});
const styles = {
    tableCol: {
        width: '50%',
        textAlign: 'center'
    },
    tableColLeft: {
        width: '50%',
        textAlign: 'left',
        whiteSpace: 'wrap'
    }
}
class NodeAnalysisAnalyticsComponent extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount(nextProps) {
        const { updateChartData, updateChartSummaryData, accountId, botId, startDate, endDate, setAnalyticsMenu,
            accountBots, fetchExistingFlowNodes, setCurrentBotId, rangeFilter, analytics } = this.props;

        setAnalyticsMenu(metrics.metricType.NODE_ANALYSIS);
        let selBotId = botId;
        if (!selBotId || selBotId.toLowerCase() === 'all') {
            if (accountBots && accountBots.accountBots[accountId] && accountBots.accountBots[accountId].length) {
                if (accountBots.accountBots[accountId].length === 1) {
                    selBotId = accountBots.accountBots[accountId][0].id; //select the first bot
                    setCurrentBotId(selBotId);
                }
            }
        }
        fetchExistingFlowNodes(selBotId, accountId);

        if (accountId && startDate && endDate && analytics.filters.node) {
            updateChartData(accountId, botId, startDate, endDate);
            updateChartSummaryData(accountId, botId, startDate, endDate, rangeFilter);
        }
    }

    componentWillUnmount() {
        const { removeFilter, removeMetric, accountId, botId } = this.props;
        removeFilter();
        removeMetric(accountId, botId, metrics.metricType.NODE_ANALYSIS);
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

    calculatePercentageChange(currentData, totalData) {
        const { rangeFilter } = this.props;
        if (rangeFilter === 'custom') {
            return;
        }
        if (currentData && totalData) {
            let currentNo = currentData[1];
            let totalNo = totalData[1];
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
        return "N/A";
    }

    isNumeric(number) {
        return !isNaN(parseFloat(number)) && isFinite(number);
    }
    getNodeData(nodeData, selNode) {
        return nodeData[0] === selNode;
    }

    static contextTypes = { setTitle: PropTypes.func.isRequired };

    render() {
        const { accountId, botId, startDate, endDate, analytics, fetchingAnalytics, removeFilter } = this.props;
        let accountMetrics = null;
        if (analytics) {
            accountMetrics = analytics.metrics[this.props.accountId];
        }
        this.context.setTitle(title);
        if (!analytics.filters.node) {
            return (<div style={{ textAlign: 'center', fontSize: '1.5em', color: 'gray', fontWeight: 'bold', paddingTop: '2em' }}>
                Select a 'Node' and click 'Go' to view the report.</div>);
        }
        let nodeAnalysisData = {};
        let topNodesData, topNodesSummaryData = {};
        if (accountMetrics && accountMetrics[botId] && accountMetrics[botId].data[metrics.metricType.NODE_ANALYSIS]) {
            nodeAnalysisData = accountMetrics[botId].data[metrics.metricType.NODE_ANALYSIS];

            topNodesData = accountMetrics[botId].data[metrics.metricType.TOP_NODES];
            topNodesSummaryData = accountMetrics[botId].data[metrics.metricType.TOP_NODES_SUMMARY];
            let metricData = [];
            let self = this;
            if (topNodesData && topNodesSummaryData) {
                let topNodesClicks = topNodesData.clicksTable;
                let topNodesVisits = topNodesData.visitsTable;
                let topNodesSummaryClicks = topNodesSummaryData.clicksTable;
                let topNodesSummaryVisits = topNodesSummaryData.visitsTable;

                const selNode = analytics.filters.node.term.node;
                let nodeClicks = topNodesClicks.find(function (node) { return self.getNodeData(node, selNode) });
                let nodeClicksSummary = topNodesSummaryClicks.find(function (node) { return self.getNodeData(node, selNode) });
                let nodeVisits = topNodesVisits.find(function (node) { return self.getNodeData(node, selNode) });
                let nodeVisitsSummary = topNodesSummaryVisits.find(function (node) { return self.getNodeData(node, selNode) });

                let visitsSummary = { 'number': 'N/A', 'metric': ["Visits"] };
                let clicksSummary = { 'number': 'N/A', 'metric': ["Clicks"] };
                if (nodeVisits) {
                    visitsSummary.number = Number(nodeVisits[1]);
                    visitsSummary.change = this.calculatePercentageChange(nodeVisits, nodeVisitsSummary);
                }
                if (nodeClicks) {
                    clicksSummary.number = Number(nodeClicks[1]);
                    clicksSummary.change = this.calculatePercentageChange(nodeClicks, nodeClicksSummary);
                }
                metricData.push(visitsSummary);
                metricData.push(clicksSummary);
            }

            return (
                <div>
                    <HelpLink content={languages.analytics.nodeAnalysis.helpContent} label="Node Analysis" />
                    <SummaryMetric metricData={metricData} />
                    <br />
                    <br />
                    <div className="row" style={{ width: '100%', margin: 0 }}>
                        <Paper className="col-lg" style={{ marginRight: '1em' }}>
                            <h4 style={{ borderBottom: '1px solid #eee', padding: '0.5em' }}>Top 50 From Nodes</h4>
                            <Table style={{ tableLayout: 'auto' }} bodyStyle={{ overflow: 'visible' }}>
                                <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                                    <TableRow>
                                        <TableHeaderColumn style={styles.tableCol}>Node</TableHeaderColumn>
                                        <TableHeaderColumn style={styles.tableCol}>Count</TableHeaderColumn>
                                    </TableRow>
                                </TableHeader>

                                <TableBody displayRowCheckbox={false} showRowHover={true}>
                                    {nodeAnalysisData.fromNodes.map((r, i) =>
                                        <TableRow key={`row${i}`}>
                                            <TableRowColumn style={styles.tableColLeft}>{r.key}</TableRowColumn>
                                            <TableRowColumn style={styles.tableCol}>{r.count.value}</TableRowColumn>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </Paper>
                        <Paper className="col-lg">
                            <h4 style={{ borderBottom: '1px solid #eee', padding: '0.5em' }}>Top 50 To Nodes</h4>
                            <Table style={{ tableLayout: 'auto' }} bodyStyle={{ overflow: 'visible' }}>
                                <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                                    <TableRow>
                                        <TableHeaderColumn style={styles.tableCol}>Node</TableHeaderColumn>
                                        <TableHeaderColumn style={styles.tableCol}>Count</TableHeaderColumn>
                                    </TableRow>
                                </TableHeader>

                                <TableBody displayRowCheckbox={false} showRowHover={true}>
                                    {nodeAnalysisData.toNodes.map((r, i) =>
                                        <TableRow key={`row${i}`}>
                                            <TableRowColumn style={styles.tableColLeft}>{r.key}</TableRowColumn>
                                            <TableRowColumn style={styles.tableCol}>{r.count.value}</TableRowColumn>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </Paper>
                    </div>
                    <Paper style={{ marginTop: '1em' }}>
                        <h4 style={{ borderBottom: '1px solid #eee', padding: '0.5em' }}>Top Actions from Node</h4>
                        <Table style={{ tableLayout: 'auto' }} bodyStyle={{ overflow: 'visible' }}>
                            <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                                <TableRow>
                                    <TableHeaderColumn style={styles.tableCol}>Action</TableHeaderColumn>
                                    <TableHeaderColumn style={styles.tableCol}>Count</TableHeaderColumn>
                                </TableRow>
                            </TableHeader>

                            <TableBody displayRowCheckbox={false} showRowHover={true}>
                                {nodeAnalysisData.actions.map((r, i) =>
                                    <TableRow key={`row${i}`}>
                                        <TableRowColumn style={styles.tableColLeft}>{r.key}</TableRowColumn>
                                        <TableRowColumn style={styles.tableCol}>{r.clicks.value}</TableRowColumn>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </Paper>
                    <Paper style={{ marginTop: '1em' }}>
                        <h4 style={{ borderBottom: '1px solid #eee', padding: '0.5em' }}>Top Text Inputs from Node</h4>
                        <Table style={{ tableLayout: 'auto' }} bodyStyle={{ overflow: 'visible' }}>
                            <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                                <TableRow>
                                    <TableHeaderColumn style={styles.tableCol}>Text Input</TableHeaderColumn>
                                    <TableHeaderColumn style={styles.tableCol}>Count</TableHeaderColumn>
                                </TableRow>
                            </TableHeader>

                            <TableBody displayRowCheckbox={false} showRowHover={true}>
                                {nodeAnalysisData.textInputs.map((r, i) =>
                                    <TableRow key={`row${i}`}>
                                        <TableRowColumn style={styles.tableColLeft}>{r.key}</TableRowColumn>
                                        <TableRowColumn style={styles.tableCol}>{r.count.value}</TableRowColumn>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </Paper>
                </div>
            )
            /*<div className={cx(s.root, flexbox.rowItem)} style={{maxHeight:'600'}}>
                  <PieChart metrics={graphData} label="Top 50 Content Items" />

              </div>*/
        } else {
            return (<div>No results found.</div>);
        }
    }
}

const NodeAnalysisAnalytics = connect(mapStateToProps, mapDispatch)(NodeAnalysisAnalyticsComponent);

export default withStyles(flexbox, s)(NodeAnalysisAnalytics);
