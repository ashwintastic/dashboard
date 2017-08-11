import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import s from './CreateBroadcast.css';
import flexbox from '../../components/flexbox.css';
import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import EditIcon from 'material-ui/svg-icons/image/edit';
import { blue500, red500, green500 } from 'material-ui/styles/colors';
import Link from '../../components/Link';
import CreateBroadcastEntryIcon from 'material-ui/svg-icons/content/add-box'
import JsonEditor from '../../components/JsonEditor';
import Timer from '../../components/Timer';
import RaisedButton from 'material-ui/RaisedButton';
import RemoveIcon from 'material-ui/svg-icons/action/delete';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import DateTimePicker from '../../components/DateTimePicker/DateTimePicker';

import TextField from 'material-ui/TextField';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import moment from 'moment-timezone';
import _ from 'lodash';
//import { RadioGroup, RadioButton } from 'react-radio-buttons'

const styles = {
  customWidth: {
    width: 250
  },
  radioButton: {
    marginBottom: 16,
    marginRight: 30,
    width: 200,
    display: 'inline-block'
  },
  columnThree: {
    display: 'inline-block',
    width: 250,
    marginTop: -20,
    marginLeft: 180,
  },
  columnTwo: {
    display: 'inline-block',
    width: 250,
    marginLeft: 180,
  },
  columnOne: {
    display: 'inline-block',
    width: 250,
  },
  timer: {
    display: 'inline-block',
    marginTop: 10,
    width: 250,
    float: 'right',
    textAlign: 'right'
  },
  header: {
    display: 'inline-block'
  },
  dialogBox: {
    width: 700,
    marginLeft: 300
  },
  selectBox: {
    display: 'inline-block',
    float: 'right'
  },
};
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

const title = 'BotWorx.Ai - Broadcast';


class CreateBroadcast extends Component {
  constructor(props) {
    super(props);
    this.state = {
      broadcastEntryData: {}
    };
    const { allAccounts, accountId } = this.props;
    this.tz = allAccounts[accountId] ? allAccounts[accountId].timezone : '';
    const tzMoment = moment.tz(this.tz);
    this.tzOffset = tzMoment ? tzMoment._offset : 0;
  }
  static propTypes = {
    broadcastEntries: PropTypes.array,
  };
  static defaultProps = {
    broadcastEntries: [],
    timeZone: '',
    broadcastDate: '',
    broadcastTime: '',
    repeat: '',
    broadcastType: '',
    name: '',
  };

  static contextTypes = { setTitle: PropTypes.func.isRequired };

  componentWillReceiveProps(nextProps) {
    this.setState(Object.assign({}, this.state, { broadcastEntryData: nextProps.broadcastEntryData }));
    const { onBroadcastValueChange, pollName } = this.props;
    if(nextProps.broadcastName == null) {
        let obj = { name: `${nextProps.pollName} Wrapup` };
        onBroadcastValueChange(obj);
    }

    const { isPollBroadcast, broadcastDate, pollEndDate } = nextProps;
    let broadcastDateTZ;
    if(isPollBroadcast) {
        if(!broadcastDate && pollEndDate) {
            broadcastDateTZ = moment(pollEndDate).add(this.tzOffset, 'minutes').toDate();
            let obj = { date: broadcastDateTZ, time: broadcastDateTZ };
            onBroadcastValueChange(obj);
        }
    }
  }
  render() {
    const { broadcastEntries, botId, broadcastEntrySchema, broadcastEntryUISchema,
      accountId, onSaveBroadcastEntry, broadcastEntryFormFlag, broadcastEntryData,
      existingFlowNodes, flowSchemaRefs, onBroadcastValueChange, errorText, pastDateError,
      onCloseDialog, dialogstate, onYesClick, subscriptionEntries, schemaRefs, onCancelBroadcastClick, pollBroadcastEntrySchema, pollSumamryNode,
      webUpdates, webUpdatesValidationText, broadcastDate, minBroadcastDate, broadcastName, allAccounts,
      isPollBroadcast, pollEndDate
    } = this.props;
    // const tz = allAccounts[accountId] ? allAccounts[accountId].accountTimeZone : '';
    // const tzMoment = moment.tz(tz);
    // const tzOffset = tzMoment ? tzMoment._offset : 0;
    let broadcastDateTZ;
    // if(broadcastDate) {
    //     if(isPollBroadcast) {
    //         // pollBroadcastDate is in UTC, so add its timezone offset
    //         broadcastDateTZ = moment(pollEndDate).add(tzOffset, 'minutes').toDate();
    //         console.log('inside', broadcastDateTZ);
    //     } else {
    //         // user has set broadcast date. Show as it is.
    //         broadcastDateTZ = broadcastDate;
    //     }
    // } else {
    //     // no broadcastdate. Show current date pre filled in the form.
    //     broadcastDateTZ = moment().subtract(moment().utcOffset(), 'minutes').add(tzOffset, 'minutes').toDate();
    // }

    if(isPollBroadcast) {
        if(broadcastDate) {
            broadcastDateTZ = broadcastDate
        } else {
            broadcastDateTZ = moment(pollEndDate).add(this.tzOffset, 'minutes').toDate();
        }
    } else {
        broadcastDateTZ = broadcastDate ?
        broadcastDate :
        moment().subtract(moment().utcOffset(), 'minutes').add(this.tzOffset, 'minutes').toDate();
    }

    // const broadcastDateTZ = broadcastDate ?
    // broadcastDate :
    // moment().subtract(moment().utcOffset(), 'minutes').add(tzOffset, 'minutes').toDate();

    const minBroadcastDateTZ = minBroadcastDate ? minBroadcastDate :
    moment().subtract(moment().utcOffset(), 'minutes').add(this.tzOffset, 'minutes').toDate();

    this.context.setTitle(title);
    const actions = [
      <FlatButton
        label="No"
        primary={true}
        onTouchTap={onCloseDialog}
      />,
      <FlatButton
        label="Yes"
        primary={true}
        keyboardFocused={true}
        onTouchTap={() => onYesClick(botId, this.refs.broadcastEditor.getJsonData().jsonData, accountId)}
      />,
    ];

    const isCurrSchedule = (x) => x.type === 'scheduled' && x.repeat !== 'None';
    const currSchedules = _(broadcastEntries).filter(x => isCurrSchedule(x)).value();
    const historicalSchedules = _(broadcastEntries).filter(x => !isCurrSchedule(x)).value();
      if (existingFlowNodes) {
        broadcastEntrySchema.items.oneOf[0].enum = existingFlowNodes
      }
    let broadCastInfoStyle;
    if (isPollBroadcast) {
        broadCastInfoStyle = "col-lg-3";
    } else if(this.state.broadcastEntryData.jobType == "broadcast") {
         broadCastInfoStyle = "col-lg-6";
    } else {
        broadCastInfoStyle = "col-lg-4"; // subscription-broadcast
    }

    return (
      <div className={cx(s.root, flexbox.fullHeight, flexbox.column)}>
        <div className={cx(s.topbuttoncontainer)}>

          <RaisedButton
            className={cx(s.cancelButton)}
            label="Cancel"
            primary
            onClick={() => onCancelBroadcastClick(accountId, botId, broadcastEntryData.jobType)}
          />
          <RaisedButton
            className={cx(flexbox.rowItem, flexbox.withHorzMargin, s.saveButton)}
            label="Save"
            primary
            onClick={(e) => {
              onSaveBroadcastEntry(botId, broadcastEntryData, this.refs.broadcastEditor.getJsonData().jsonData, accountId, minBroadcastDateTZ, this.tzOffset, isPollBroadcast, broadcastDateTZ)
            }}
          />
        </div>
        <Paper className={cx(flexbox.rowItem, s.formContainer)}>
          <h3><b>Broadcast Entry Data</b></h3>
          <div>
            <Dialog
              title="Warning"
              actions={actions}
              style={styles.dialogBox}
              modal={false}
              open={dialogstate}
              onRequestClose={onCloseDialog}
            >
              {(isPollBroadcast) ?
                <span>You have scheduled a broadcast before Poll End date.</span>
                  : <span>You have selected a past date to schedule a broadcast.</span>
              }
              <br />
              Are you sure you want to proceed?
          </Dialog>
          </div>
          <div className={cx(s.divStyle)}>
            <form className={cx(flexbox.rowItem)}>
              <br /><br />
              <div>
                <h4>Broadcast Jobtype</h4><br />
                {(isPollBroadcast) ?
                  <RadioButtonGroup
                    name="Job Type"
                    valueSelected={this.state.broadcastEntryData.jobType}
                  >
                    <RadioButton
                      value="poll-broadcast"
                      label="Poll Broadcast"
                      disabled={true}
                      style={styles.radioButton}
                    />
                  </RadioButtonGroup> : <RadioButtonGroup
                    name="Job Type"
                    valueSelected={this.state.broadcastEntryData.jobType}
                    onChange={(e, value) => {
                      let obj = { jobType: value };
                      onBroadcastValueChange(obj)
                    }}>
                    <RadioButton
                      value="broadcast"
                      label="Broadcast"
                      style={styles.radioButton}
                    />
                    <RadioButton
                      value="subscription-broadcast"
                      label="Subscription Broadcast"
                      style={styles.radioButton}
                    />
                  </RadioButtonGroup>}</div>

                <div className="row">
                    <div className={broadCastInfoStyle}>
                        <TextField
                            floatingLabelText="Broadcast Name"
                            value={broadcastName}
                            onChange={(e) => {
                                let obj = { name: e.target.value };
                                onBroadcastValueChange(obj)
                            }}
                        />
                    </div>
                    <div className={broadCastInfoStyle}>
                        <TextField
                        floatingLabelText="Broadcast Description"
                        value={this.state.broadcastEntryData.description}
                        onChange={(e) => {
                            let obj = { description: e.target.value };
                            onBroadcastValueChange(obj)
                        }}
                        />
                    </div>
                    {(this.state.broadcastEntryData.jobType === "subscription-broadcast" ||
                        isPollBroadcast) ?
                    <div className={broadCastInfoStyle}>
                      { (isPollBroadcast) ?
                        <SelectField
                            floatingLabelText="Subscription Name"
                            value={this.state.broadcastEntryData.subscriptionId}
                            onChange={(e, index, value) => {
                            let obj = { subscriptionId: value };
                            onBroadcastValueChange(obj)
                            }}
                        >
                           <MenuItem value=' ' primaryText='None' key='noneOption' />
                            {subscriptionEntries && subscriptionEntries.map(se => (
                            <MenuItem value={se._id} primaryText={se.name} key={se._id} />))}
                        </SelectField>:
                        <SelectField
                            floatingLabelText="Subscription Name"
                            value={this.state.broadcastEntryData.subscriptionId}
                            onChange={(e, index, value) => {
                            let obj = { subscriptionId: value };
                            onBroadcastValueChange(obj)
                            }}
                        >
                            {subscriptionEntries && subscriptionEntries.map(se => (
                            <MenuItem value={se._id} primaryText={se.name} key={se._id} />))}
                        </SelectField>
                      }
                    </div>
                    : null
                    }
                    {(isPollBroadcast) ?
                    <div className={broadCastInfoStyle}>
                        <TextField
                            floatingLabelText="Poll Id"
                            value={this.state.broadcastEntryData.pollId}
                            disabled={true}
                        />
                    </div>
                    : null}
                  </div>
              <br />
              <div><div style={{ display: "inline-block" }}>
                <h4>Broadcast Type</h4>
                <RadioButtonGroup
                  name="Broadcast Type"
                  valueSelected={this.state.broadcastEntryData.type}
                  onChange={(e, value) => {
                    let obj = { type: value };
                    onBroadcastValueChange(obj)
                  }}>
                  <RadioButton
                    value="immediate"
                    label="Immediate"
                    style={styles.radioButton}
                  />
                  <RadioButton
                    value="scheduled"
                    label="Future"
                    style={styles.radioButton}
                  />
                  <RadioButton
                    value="automatic"
                    label="Automatic"
                    style={styles.radioButton}
                  />
                </RadioButtonGroup></div>
                <div style={{ display: "inline-block", float: 'right' }}>{(isPollBroadcast) ?
                  <SelectField
                    floatingLabelText="Target Users"
                    value={this.state.broadcastEntryData.targetOnlyFinishedUsers}
                    onChange={(e, index, value) => {
                      let obj = { targetOnlyFinishedUsers: value };
                      onBroadcastValueChange(obj)
                    }}
                    style={styles.selectBox}
                  >
                    <MenuItem value={false} primaryText="Users who started the poll" />
                    <MenuItem value={true} primaryText="Users who finished the poll" />
                  </SelectField> : null}</div>
                <br />
                {(this.state.broadcastEntryData.type === "scheduled") ?
                  <div>
                    <h4>Time Zone</h4>
                    <RadioButtonGroup
                      name="Time Zone"
                      valueSelected={this.state.broadcastEntryData.timeZone}
                      onChange={(e, value) => {
                        let obj = { timeZone: value };
                        onBroadcastValueChange(obj)
                      }}>
                      <RadioButton
                        value="bot"
                        label={`Bot (${this.tz})`}
                        style={styles.radioButton}
                      />
                      <RadioButton
                        value="user"
                        label="User"
                        style={styles.radioButton}
                      />
                    </RadioButtonGroup>
                  </div> : null
                }
              </div>
              {(this.state.broadcastEntryData.type === "scheduled") ?
                <div>
                  <DateTimePicker
                    className={cx(s.divStyle)}
                    floatingLabelText="Broadcast Date/Time"
                    container="inline"
                    mode="portrait"
                    value={broadcastDateTZ}
                    style={styles.columnOne}
                    onChange={(dateTime) => {
                    //   let tzTime = moment(dateTime).add(tzOffset, 'minutes').toDate();
                      let obj = { date: dateTime, time: dateTime };
                      onBroadcastValueChange(obj);
                    }} />
                  {(isPollBroadcast) ? null :
                    <SelectField
                      floatingLabelText="Repeat"
                      value={this.state.broadcastEntryData.repeat}
                      onChange={(e, index, value) => {
                        let obj = { repeat: value };
                        onBroadcastValueChange(obj)
                      }}
                      style={styles.columnThree}
                    >
                      <MenuItem value="None" primaryText="None" />
                      <MenuItem value="Every Hour" primaryText="Every Hour" />
                      <MenuItem value="Every Day" primaryText="Every Day" />
                      <MenuItem value="Every Week" primaryText="Every Week" />
                      <MenuItem value="Every Month" primaryText="Every Month" />
                    </SelectField>}
                  <div className={cx(s.errotText)}>{pastDateError}</div>
                  <br />
                </div> : null
              }
              {(this.state.broadcastEntryData.type === "automatic") ?
                <div>
                  <SelectField
                    floatingLabelText="Web Update"
                    floatingLabelFixed={true}
                    value={this.state.broadcastEntryData.webupdateContentId}
                    onChange={(e, index, value) => {
                      let obj = { webupdateContentId: value };
                      onBroadcastValueChange(obj)
                    }}
                    style={styles.columnOne}
                    errorText={webUpdatesValidationText}
                  >
                    <MenuItem value='' primaryText='None'/>
                    {webUpdates.map(w => (<MenuItem value={w.contentId} primaryText={w.description}/>
                    ))}
                  </SelectField>
                </div>: null
              }
              {(Object.keys(schemaRefs).includes("broadcastNode.json") && (isPollBroadcast)) ?
                <JsonEditor
                  schema={pollBroadcastEntrySchema}
                  jsonData={broadcastEntryData.nodes}
                  displayRequired={true}
                  options={{ refs: schemaRefs }}
                  ref="broadcastEditor"
                /> : null}
              {(Object.keys(schemaRefs).includes("broadcastNode.json") && (!isPollBroadcast)) ?
                <JsonEditor
                  schema={broadcastEntrySchema}
                  jsonData={broadcastEntryData.nodes}
                  displayRequired={true}
                  options={{ refs: schemaRefs }}
                  ref="broadcastEditor"
                /> : null}
              <div className={cx(s.errotText)}>{errorText}</div>
            </form>
          </div>
        </Paper>
        <div className={cx(s.buttomButtom)}>
          <RaisedButton
            className={cx(s.cancelButton)}
            label="Cancel"
            primary
            onClick={() => onCancelBroadcastClick(accountId, botId, broadcastEntryData.jobType)}
          />
          <RaisedButton
            className={cx(flexbox.rowItem, flexbox.withHorzMargin, s.saveButton)}
            label="Save"
            primary
            onClick={(e) => {
              onSaveBroadcastEntry(botId, broadcastEntryData, this.refs.broadcastEditor.getJsonData().jsonData, accountId, minBroadcastDateTZ, this.tzOffset, isPollBroadcast, broadcastDateTZ)
            }}
          />
        </div>
      </div>
    )
  }
}

export default withStyles(flexbox, s)(CreateBroadcast);
