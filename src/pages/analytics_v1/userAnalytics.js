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

    updateUsersCharts: (accountId, botId, startDate, endDate) => {
        dispatch(updateChartData(accountId, botId, startDate, endDate, metrics.metricType.USER));
    },

    setAnalyticsMenu: (menu) => {
        dispatch(setAnalyticsMenu(menu));
    },

    removeMetric: (accountId, botId, metric) => {
        dispatch(clearMetric(accountId, botId, metric))
    },

});

class UserAnalytics extends Component {
    constructor(props) {
        super(props);
        this.userMetrics = null;
        this.firstTimeFetchMetrics = true;
    }

    componentWillReceiveProps(nextProps) {
        const { updateUsersCharts, accountId, botId, startDate, endDate } = this.props;

        if (this.firstTimeFetchMetrics && accountId && startDate && endDate && !this.userMetrics) {
            updateUsersCharts(accountId, nextProps.botId, startDate, endDate);
            this.firstTimeFetchMetrics = false;
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

    componentWillMount() {
        const { updateUsersCharts, accountId, botId, startDate, endDate, setAnalyticsMenu } = this.props;

        setAnalyticsMenu(metrics.metricType.USER);

        if (accountId && startDate && endDate) {
            updateUsersCharts(accountId, botId, startDate, endDate);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.analytics.metrics != this.props.analytics.metrics;
    }

    componentWillUnmount() {
        const { removeMetric, accountId, botId, } = this.props;
        removeMetric(accountId, botId, metrics.metricType.USER);
    }

    static contextTypes = { setTitle: PropTypes.func.isRequired };

    render() {
        const { accountId, botId, startDate, endDate, analytics, fetchingAnalytics } = this.props;
        if (botId) {
            const accountData = analytics.metrics[accountId];
            if (accountData) {
                const botData = accountData[botId];
                if (botData) {
                    this.userMetrics = botData.data.User || null;
                }
            }
        }
        return this.userMetrics ? (
            <div>
                <HelpLink content={languages.analytics.users.helpContent} label="User Activity Types" />
                <div className={cx(s.root, flexbox.rowItem)} >
                    <LineChart
                        metrics={this.userMetrics}
                        label="User Activity"
                        loading={fetchingAnalytics.User}
                    />
                </div>
            </div>
        )
            :
            <div></div>
    }
}

UserAnalytics = withStyles(flexbox, s)(UserAnalytics);

export default connect(mapStateToProps, mapDispatch)(UserAnalytics);


// export function getUserAnalyticsData(args) {
//         console.log('###args=>', args);
//     const { context: { store: { dispatch } } } = args;
//     const state = store.getState().analytics;
//     const { currentAccountId, currentBotId, startDate, endDate } = state

//     dispatch(updateUsersCharts(currentAccountId, currentBotId, startDate, endDate));
// }
