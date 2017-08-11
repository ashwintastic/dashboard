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
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import UserMenu from './userMenu';
import MessagingMenu from './messagingMenu';
import DemographicsMenu from './demographicsMenu';
import DatePicker from 'material-ui/DatePicker';
import moment from 'moment-timezone';
import {
  setCurrentBotId,
  setCurrentAccountId,
  changeEndDate,
  changeStartDate,
  updateDateRangeCharts,
  updateGlobalCharts,
  addFilter,
  removeFilter,
} from '../../actions/analytics';
import { fetchBotList } from '../../actions/accountBots';
import langList from '../../utils/locale-list';
import metrics from '../../constants/metrics';
import timeZones from '../../utils/timeZoneList';
const queryString = require('query-string');

const title = 'BotWorx.Ai - Analytics';

class FilterAnalyticsComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
        accountId: null,
        botId: null,
        startDate: null,
        endDate: null,
        gender: null,
        timeZone: null,
        locale: null,
        isCustomDateRangeSelected: false,
        isFilterBtnDisabled: true
    };
  }

  componentDidMount() {
    const { accountId, setCurrentAccountId, fetchBotList, fetchLanguageList,
        onDateRangeChange, onBotChange, botId, refreshUserDetails, analytics,
        setCurrentAccountTimeZone, allAccounts, fetchNodes, enableGoBtn } = this.props;
    if(accountId) {
        setCurrentAccountId(accountId);
        const tz = allAccounts[accountId].timezone;
        setCurrentAccountTimeZone(tz);
    } else {
        refreshUserDetails();
    }
    if(!botId && analytics.selectedMenu !== metrics.metricType.NODE_ANALYSIS) {
        onBotChange(null, "All");
    }
    fetchBotList(accountId);
    if (analytics.selectedMenu === metrics.metricType.NODE_ANALYSIS) {
        fetchNodes(botId, accountId);
    }
    fetchLanguageList();
    onDateRangeChange("7", allAccounts, accountId); // initialize range to last 7 days

    //This means page is refreshed and accountId is not available, so get it from URL
    if(!accountId) {
        const parsed = queryString.parse(location.search);
        const accountId = parsed.accountId;
        setCurrentAccountId(accountId);
        fetchBotList(accountId);
        onBotChange(null, "All");
        enableGoBtn(true);
    }
  }

  componentWillReceiveProps(nextProps) {
    // if(nextProps.accountBots && !nextProps.botId) { // select first bot for dropdown upon landing.
    //     this.props.onBotChange(nextProps.accountBots[0]["accountId"], nextProps.accountBots[0]["id"]);
    // }
    // if((nextProps.accountId != this.props.accountId)) { //user has changed accountId, fetch him bot
    //     if(nextProps.accountBots && nextProps.accountBots[0]) { // if bots exists
    //         this.props.onBotChange(nextProps.accountBots[0]["accountId"], nextProps.accountBots[0]["id"]);
    //     }
    // }
  }

  handleDateRangeChange = (selectedRange, allAccounts, accountId) => {
    const { onDateRangeChange, enableGoBtn } = this.props;
    onDateRangeChange(selectedRange, allAccounts, accountId);
    if(selectedRange == 'custom') {
        this.setState({isCustomDateRangeSelected: true});
        if(!(this.state.startDate && this.state.endDate)) {
            // this.setState({isFilterBtnDisabled: true});
            enableGoBtn(false);
        }
    } else {
        this.setState({isCustomDateRangeSelected: false});
        // this.setState({isFilterBtnDisabled: false});
        enableGoBtn(true);
    }
  };

  disableAfterTodayAndEndDate = (date) => {
    console.log('date', date);
    let receivedDateMoment = moment(date);
    let receivedDate = moment(date).format('YYYY-MM-DD');
    const { currentAccountTimeZone } = this.props;
    let today = moment().tz(currentAccountTimeZone).format('YYYY-MM-DD')
    // let tomorrow = moment().add(1, 'days');
    return moment(receivedDate).isAfter(today, 'day') || moment(receivedDateMoment).isAfter(moment(this.state.endDate))
  }

  disableAfterStartDate = (date) => {
    let receivedDateMoment = moment(date);
    // let receivedDate = moment(date).get('date');
    let receivedDate = moment(date).format('YYYY-MM-DD');
    const { currentAccountTimeZone } = this.props;
    // let today = moment().tz(currentAccountTimeZone).get('date');
    let today = moment().tz(currentAccountTimeZone).format('YYYY-MM-DD')

    // let today = moment();
    // let tomorrow = moment().add(1, 'days');
    return moment(receivedDate).isAfter(today, 'day') || moment(receivedDateMoment).isBefore(moment(this.state.startDate))
}

  handleStartDateChange = (date) => {
    const { updateStartDate, enableGoBtn } = this.props;
    this.setState({startDate: date});
    updateStartDate(date);
    // this.setState({isFilterBtnDisabled: false});
    enableGoBtn(true);
    // if(!(this.state.endDate)) {
    //     this.setState({isFilterBtnDisabled: true});
    // } else {
    //     this.setState({isFilterBtnDisabled: false});
    // }
  }

  handleEndDateChange = (date) => {
    const { updateEndDate, enableGoBtn } = this.props;
    this.setState({endDate: date});
    updateEndDate(date);
    // this.setState({isFilterBtnDisabled: false});
    enableGoBtn(true);
    // if(!(this.state.startDate)) {
    //     this.setState({isFilterBtnDisabled: true});
    // } else {
    //     this.setState({isFilterBtnDisabled: false});
    // }
  }

  fetchAnalyticsGraph = (analytics, accountId, botId, startDate, endDate, rangeFilter) => {
    const { fetchAnalyticsGraph, enableGoBtn, currentAccountTimeZone } = this.props;
    fetchAnalyticsGraph(analytics, accountId, botId, startDate, endDate, rangeFilter, currentAccountTimeZone);
    // this.setState({isFilterBtnDisabled: true});
    enableGoBtn(false);
  }

  onAccountChange = (selectedAccountId) => {
    const { onAccountChange, analytics, allAccountBots, enableGoBtn, allAccounts } = this.props;
    onAccountChange(selectedAccountId, analytics, allAccountBots, allAccounts);
//   this.setState({isFilterBtnDisabled: false});
    enableGoBtn(true);
  }

  onBotChange = (accountId, selectedBotId) => {
    const { onBotChange, enableGoBtn } = this.props;
    onBotChange(accountId, selectedBotId);
//   this.setState({isFilterBtnDisabled: false});
    enableGoBtn(true);
  }

  onGenderChange = (gender) => {
    const { onGenderChange, enableGoBtn } = this.props;
    onGenderChange(gender);
//   this.setState({isFilterBtnDisabled: false});
    enableGoBtn(true);
  }

  onTimeZoneChange = (timeZone) => {
    const { onTimeZoneChange, enableGoBtn } = this.props;
    onTimeZoneChange(timeZone);
//   this.setState({isFilterBtnDisabled: false});
    enableGoBtn(true);
  }

  onLocaleChange = (locale) => {
    const { onLocaleChange, enableGoBtn } = this.props;
    onLocaleChange(locale);
//   this.setState({isFilterBtnDisabled: false});
    enableGoBtn(true);
  }

  onMsgSubTypeChange = (selMsgType) => {
    const { onMsgSubTypeChange, enableGoBtn } = this.props;
    onMsgSubTypeChange(selMsgType);
//   this.setState({isFilterBtnDisabled: false});
    enableGoBtn(true);
  }

  onTextInputTypeChange = (selTextType) => {
    const { onTextInputTypeChange, enableGoBtn } = this.props;
    onTextInputTypeChange(selTextType);
//   this.setState({isFilterBtnDisabled: false});
    enableGoBtn(true);
  }

  onReferralChange = (selReferral) => {
    const { onReferralChange, enableGoBtn } = this.props;
    onReferralChange(selReferral);
    //   this.setState({isFilterBtnDisabled: false});
    enableGoBtn(true);
  }

  onNodeChange = (selNode) => {
    const { onNodeChange, enableGoBtn } = this.props;
    onNodeChange(selNode);
    if (selNode !== '--noselection--') {
        //   this.setState({isFilterBtnDisabled: false});
        enableGoBtn(true);
    } else {
        //   this.setState({isFilterBtnDisabled: true});
        enableGoBtn(false);
      }
  }
  onSubscriptionChange = (selSubscription) => {
    const { onSubscriptionChange, enableGoBtn } = this.props;
    onSubscriptionChange(selSubscription);
    enableGoBtn(true);
  }
  static contextTypes = { setTitle: PropTypes.func.isRequired };

  render() {
    const { analytics, accountBots, allAccounts, onDateRangeChange, gender, timeZone, locale, rangeFilter, accountId,
        botId, languages, startDate, endDate, onTextInputTypeChange, referrals, onReferralChange, nodes,
        onNodeChange, isGoBtnEnabled, subscriptions, onSubscriptionChange
    }  = this.props;

    this.context.setTitle(title);
    let customDateStyle = cx({[s.hidden]: this.state.isCustomDateRangeSelected == false});
    let botMenuItems = [];
    if(accountBots && accountBots.length > 0) {
        botMenuItems.push(<MenuItem value={"All"} primaryText={"All"} key={"All"}/>);
        accountBots.map(b => botMenuItems.push(<MenuItem value={b.id} primaryText={b.name} key={b.id} />))
    } else {
        botMenuItems = null;
    }

    return (
        <div>
        <div className="row">
            <div className={cx(s.overFlowElipsis, "col-lg-3")}>
                <SelectField
                    value={accountId}
                    className={cx(s.overFlowElipsis)}
                    floatingLabelText={'Select Account'}
                    onChange={(e, i, selectedAccountId) =>this.onAccountChange(selectedAccountId)}
                >
                    {
                   Object.keys(allAccounts) &&  Object.keys(allAccounts).map(accountId => allAccounts[accountId]).map(account => (
                        <MenuItem
                            value={account.id}
                            primaryText={account.name}
                            key={account.id}
                        />
                    ))
                    }
                </SelectField>
            </div>

            <div className={cx(s.overFlowElipsis, "col-lg-3")}>
                <SelectField
                    value={botId}
                    className={cx(s.overFlowElipsis)}
                    floatingLabelText={'Select Bot'}
                    onChange={(e, i, selectedBotId) => this.onBotChange(accountId, selectedBotId)}
                >
                    {
                        botMenuItems
                    }
                </SelectField>
            </div>

            <div className={cx(s.overFlowElipsis, "col-lg-3")}>
                <SelectField
                    value={rangeFilter}
                    className={cx(s.overFlowElipsis)}
                    floatingLabelText={'Time Range'}
                    onChange={(e, i, selectedRange) => this.handleDateRangeChange(selectedRange, allAccounts, accountId)}
                >
                    <MenuItem value={"7"} primaryText={"Last 7 days"} />
                    <MenuItem value={"14"} primaryText={"Last 14 days"} />
                    <MenuItem value={"30"} primaryText={"Last 30 days"} />
                    <MenuItem value={"custom"} primaryText={"Custom"} />
                </SelectField>
            </div>

            <div className={cx(s.overFlowElipsis, "col-lg-3" , customDateStyle)}>
                <DatePicker
                    floatingLabelText="Start Date"
                    shouldDisableDate={this.disableAfterTodayAndEndDate}
                    onChange={(e, date) => this.handleStartDateChange(date)}
                    container="inline"
                    autoOk={true}
                    value={startDate}
                />
            </div>
        </div>
        <div className="row">
             <div className={cx(s.overFlowElipsis, "col-lg-3", customDateStyle)}>
                <DatePicker
                    floatingLabelText="End Date"
                    shouldDisableDate={this.disableAfterStartDate}
                    onChange={(e, date) => this.handleEndDateChange(date)}
                    container="inline"
                    autoOk={true}
                    value={endDate}
                />
            </div>
            <div className={cx(s.overFlowElipsis, "col-lg-3")}>
                <SelectField
                    value={gender}
                    className={cx(s.overFlowElipsis)}
                    floatingLabelText={'Gender'}
                    onChange={(e, i, gender) => this.onGenderChange(gender)}
                >
                    <MenuItem value={"All"} primaryText={"All"} />
                    <MenuItem value={"male"} primaryText={"Male"} />
                    <MenuItem value={"female"} primaryText={"Female"} />
                </SelectField>
            </div>

            <div className={cx(s.overFlowElipsis, "col-lg-3")}>
                <SelectField
                    value={timeZone}
                    className={cx(s.overFlowElipsis)}
                    floatingLabelText={'Time Zone'}
                    onChange={(e, i, timeZone) => this.onTimeZoneChange(timeZone)}
                >
                    <MenuItem value={"All"} primaryText={"All"} />

                    {timeZones.map(tz => (
                        <MenuItem value={tz.value} primaryText={tz.name} key={tz.name} />)
                    )}
                </SelectField>
            </div>

            <div className={cx(s.overFlowElipsis, "col-lg-3")}>
                <SelectField
                    value={locale}
                    className={cx(s.overFlowElipsis)}
                    floatingLabelText={'Locale'}
                    onChange={(e, i, locale) => this.onLocaleChange(locale)}
                >
                <MenuItem value={"All"} primaryText={"All"} />

                {langList && langList.map(l => (
                    <MenuItem value={l.shortName} primaryText={`${l.englishName} [${l.shortName}]`} key={l.shortName} />)
                )}
                </SelectField>
            </div>
      </div>
        <div className="row">
            <div className={cx(s.overFlowElipsis, "col-lg-3")}>
            {(analytics.selectedMenu === metrics.metricType.MESSAGE_COUNT)?
                <SelectField
                    value={(analytics.filters.messageSubType ? analytics.filters.messageSubType.term.messageSubType : null)|| 'all'}
                    className={cx(s.overFlowElipsis)}
                    floatingLabelText={'Message Type'}
                    onChange={(e, i, selMsgType) => this.onMsgSubTypeChange(selMsgType)}
                >
                    <MenuItem value='all' primaryText='All' key='All' />
                    <MenuItem value='signup' primaryText='Sign Up' key='Sign Up' />
                    <MenuItem value='referral' primaryText='Referral' key='Referral' />
                    <MenuItem value='tap' primaryText='Tap' key='Tap' />
                    <MenuItem value='type' primaryText='Type' key='Type' />
                    <MenuItem value='broadcast' primaryText='Broadcast' key='Broadcast' />
                </SelectField>:null
            }
            {(analytics.selectedMenu === metrics.metricType.SENT_MESSAGES)?
                <SelectField
                    value={(analytics.filters.messageSubType ? analytics.filters.messageSubType.term.messageSubType : null)|| 'all'}
                    className={cx(s.overFlowElipsis)}
                    floatingLabelText={'Message Type'}
                    onChange={(e, i, selMsgType) => this.onMsgSubTypeChange(selMsgType)}
                >
                    <MenuItem value='all' primaryText='All' key='All' />
                    <MenuItem value='broadcast' primaryText='Broadcast' key='Broadcast' />
                </SelectField>:null
            }
            {(analytics.selectedMenu === metrics.metricType.TOP_TEXT_INPUTS)?
                <SelectField
                    value={analytics.filters.recognized ? analytics.filters.recognized.term.recognized : 'all'}
                    className={cx(s.overFlowElipsis)}
                    floatingLabelText={'Text Type'}
                    onChange={(e, i, selTextType) => this.onTextInputTypeChange(selTextType)}
                >
                    <MenuItem value='all' primaryText='All' key='All' />
                    <MenuItem value={true} primaryText='Recognized' key='recognized' />
                    <MenuItem value={false} primaryText='Not Recognized' key='notRecognized' />
                </SelectField>:null
            }
            {(analytics.selectedMenu === metrics.metricType.REFERRALS)?
                <SelectField
                    value={(analytics.filters.referenceId ? analytics.filters.referenceId.term.referenceId : null) || 'all'}
                    className={cx(s.overFlowElipsis)}
                    floatingLabelText={'Reference'}
                    onChange={(e, i, selReference) => this.onReferralChange(selReference)}
                >
                    <MenuItem value={"all"} primaryText={"All"} />
                    {referrals && referrals.map(r => (
                        <MenuItem value={r} primaryText={(analytics.referralNames ? analytics.referralNames[r]:null) || r} key={r} />)
                    )}
                </SelectField>:null
            }
            {(analytics.selectedMenu === metrics.metricType.NODE_ANALYSIS)?
                <SelectField
                    value={(analytics.filters.node ? analytics.filters.node.term.node : null) || '--noselection--'}
                    className={cx(s.overFlowElipsis)}
                    floatingLabelText={'Node'}
                    onChange={(e, i, selNode) => this.onNodeChange(selNode)}
                >
                    <MenuItem value={"--noselection--"} primaryText={"Select Node"} />
                    {nodes && nodes.map(n => (
                        <MenuItem value={n} primaryText={n} key={n} />)
                    )}
                </SelectField>:null
            }
            {(analytics.selectedMenu === metrics.metricType.SUBSCRIPTION_CHANGE)?
                <SelectField
                    value={(analytics.filters.subscriptionId ? analytics.filters.subscriptionId.term.subscriptionId : null) || 'all'}
                    className={cx(s.overFlowElipsis)}
                    floatingLabelText={'Subscription'}
                    onChange={(e, i, selSubscription) => this.onSubscriptionChange(selSubscription)}
                >
                    <MenuItem value={"all"} primaryText={"All"} />
                    {subscriptions && subscriptions.map(s => (
                        <MenuItem value={s._id} primaryText={s.name} key={s._id} />)
                    )}
                </SelectField>:null
            }
            </div>
            <div style={{ width:'75%', textAlign: 'right'}}>
                <RaisedButton style={{ marginTop: '1.5em'}}
                className={cx(flexbox.rowItem, flexbox.withHorzMargin, s.goButton)}
                onClick={() => this.fetchAnalyticsGraph(analytics, accountId, botId, startDate, endDate, rangeFilter)}
                label="Go" primary disabled={!isGoBtnEnabled}
                />
            </div>
        </div>
      </div>
    )
  }
}

export default withStyles(flexbox, s)(FilterAnalyticsComponent);
