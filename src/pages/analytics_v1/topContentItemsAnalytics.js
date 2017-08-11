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
import Paper from 'material-ui/Paper';
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';
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
        fetchingAnalytics: state.fetchingAnalytics
    }
};

const mapDispatch = (dispatch) => ({

    updateChartData: (accountId, botId, startDate, endDate) => {
        dispatch(updateChartData(accountId, botId, startDate, endDate, metrics.metricType.TOP_CONTENT_ITEMS));
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
        textAlign: 'center'
    },
    tableColLeft: {
        width: '50%',
        textAlign: 'left',
        whiteSpace: 'pre-wrap'
    }
}
class TopActionsAnalyticsComponent extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount(nextProps) {
        const { updateChartData, accountId, botId, startDate, endDate, setAnalyticsMenu } = this.props;

        setAnalyticsMenu(metrics.metricType.TOP_CONTENT_ITEMS);

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
        removeMetric(accountId, botId, metrics.metricType.TOP_CONTENT_ITEMS);
    }

    static contextTypes = { setTitle: PropTypes.func.isRequired };

    render() {
        const { accountId, botId, startDate, endDate, analytics, fetchingAnalytics } = this.props;
        let graphData = {};
        let accountMetrics = null;
        if (analytics) {
            accountMetrics = analytics.metrics[this.props.accountId];
        }
        if (accountMetrics && accountMetrics[this.props.botId] && accountMetrics[this.props.botId].data[metrics.metricType.TOP_CONTENT_ITEMS]) {
            graphData = accountMetrics[this.props.botId].data[metrics.metricType.TOP_CONTENT_ITEMS];
            this.context.setTitle(title);
            return (
                <div>
                    <HelpLink content={languages.analytics.topContentItems.helpContent} label="Top Content Items" />
                    <h4 style={{ paddingTop: '1em' }}>Top Content Items</h4>
                    <Paper>
                        <Table style={{ tableLayout: 'fixed' }} bodyStyle={{ overflow: 'visible' }}>
                            <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                                <TableRow>
                                    <TableHeaderColumn style={styles.tableCol}>Content Item</TableHeaderColumn>
                                    <TableHeaderColumn style={styles.tableCol}>Count</TableHeaderColumn>
                                </TableRow>
                            </TableHeader>

                            <TableBody displayRowCheckbox={false} showRowHover={true}>
                                {graphData.data.columns.map((r, i) =>
                                    <TableRow key={`row${i}`}>
                                        <TableRowColumn style={styles.tableColLeft}>{r[0]}</TableRowColumn>
                                        <TableRowColumn style={styles.tableCol}>{r[1]}</TableRowColumn>
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

const TopActionsAnalytics = connect(mapStateToProps, mapDispatch)(TopActionsAnalyticsComponent);

export default withStyles(flexbox, s)(TopActionsAnalytics);
