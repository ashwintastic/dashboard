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
import moment from 'moment';
import SummaryMetric from './summaryMetric';
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

    updateChartData: (accountId, botId, startDate, endDate) => {
      dispatch(updateChartData(accountId, botId, startDate, endDate, metrics.metricType.READ_TIME));
    },

    updateChartSummaryData: (accountId, botId, startDate, endDate, rangeFilter) => {
        if(rangeFilter != 'custom') {
            const twiceStartDateString = moment(startDate).subtract(Number(rangeFilter), 'days').format('YYYY-MM-DD');
            const endDateForSummary = moment(startDate).subtract(1, 'days').format('YYYY-MM-DD');
            dispatch(updateChartData(accountId, botId, twiceStartDateString, endDateForSummary, metrics.metricType.READ_TIME_SUMMARY));
        }
   },

    setAnalyticsMenu: (menu) => {
      dispatch(setAnalyticsMenu(menu));
    },

    removeMetric: (accountId, botId, metric) => {
      dispatch(clearMetric(accountId, botId, metric))
    },
});

class ReadTimeAnalyticsComponent extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount(nextProps) {
    const { updateChartData, accountId, botId, startDate, endDate, setAnalyticsMenu,
        updateChartSummaryData, rangeFilter } = this.props;

    setAnalyticsMenu(metrics.metricType.READ_TIME);

    if(accountId && startDate && endDate) {
        updateChartData(accountId, botId, startDate, endDate);
        updateChartSummaryData (accountId, botId, startDate, endDate, rangeFilter);
    }
  }

  componentDidMount() {
    // Append selected accountId as query param in window location
    let parsedQS = {};
    let selectedAccountId;
    if(this.props.accountId) {
        selectedAccountId = this.props.accountId;
    } else {
        const parsed = queryString.parse(location.search);
        const accountId = parsed.accountId;
        if(accountId) {
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
    removeMetric(accountId, botId, metrics.metricType.READ_TIME);
  }

  calculateAverage(data) {
     if(typeof data != 'undefined') {
         return Number(data.readTimeTotal / data.readTotal).toFixed(2);
     }
   }

  calculatePercentageChange(currentNo, pastNo) {

        const { rangeFilter } = this.props;
        if (rangeFilter == 'custom') {
            return;
        }
        	// Any one is not a number
        if( !this.isNumeric(currentNo) || !this.isNumeric(pastNo) ){
            return "N/A";
        }

        // If both are 0, increase % is also 0
        if( currentNo == 0 && pastNo == 0) {
            return 0;
        }

        // If just past number is 0, increase % is infinite and should be displayed as N/A
        if(pastNo == 0){
            return "N/A";
        }

        let increment = (currentNo-pastNo)*100/pastNo;

        return increment % 1 == 0 ? increment : increment.toFixed(1);
 }

    isNumeric(number) {
    return !isNaN(parseFloat(number)) && isFinite(number);
    }

    getDisplayTime( time ) {
        let unit = 'seconds';
        if(time > 100){
        time = time/60;
        unit = 'minutes';
    }

    if(time>100){
        time = time/60;
        unit = 'hours';
    }

    return (time %1 == 0 ? time : Number(time).toFixed(1)) + ' ' + unit;
    }

  static contextTypes = { setTitle: PropTypes.func.isRequired };

  render() {
    const { accountId, botId, startDate, endDate, analytics, fetchingAnalytics } = this.props;
    let graphData, graphSummaryData = {};
    let accountMetrics = null;
    if(analytics) {
     accountMetrics = analytics.metrics[this.props.accountId];
    }
    if (accountMetrics && accountMetrics[this.props.botId] && accountMetrics[this.props.botId].data[metrics.metricType.READ_TIME]) {
      graphData = accountMetrics[this.props.botId].data[metrics.metricType.READ_TIME];
      graphSummaryData = accountMetrics[this.props.botId].data[metrics.metricType.READ_TIME_SUMMARY];

      this.context.setTitle(title);

      let metricData = [];
      let metricObj = {}, pastSummaryAvg = this.calculateAverage(graphSummaryData);;
      metricObj.metric = 'Avg. Read Time';
      metricObj.number = this.getDisplayTime(this.calculateAverage(graphData));
      metricObj.change = this.calculatePercentageChange(metricObj.number, pastSummaryAvg);
      metricData.push(metricObj);

      return (
          <div>
            <HelpLink content={languages.analytics.readTime.helpContent} label="Read Time"/>
            <SummaryMetric metricData={metricData}/>
                <div className={cx(s.root, flexbox.rowItem)} >
                    <PieChart metrics={graphData} label="Read Time" />
                </div>
         </div>
      )
    } else {
      return (<div></div>);
    }
  }
}

const ReadTimeAnalytics = connect(mapStateToProps, mapDispatch)(ReadTimeAnalyticsComponent);

export default withStyles(flexbox, s)(ReadTimeAnalytics);
