import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import s from './Poll.css';
import flexbox from '../../components/flexbox.css';
import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import EditPollIcon from 'material-ui/svg-icons/image/edit';
import UpIcon from 'material-ui/svg-icons/navigation/arrow-upward'
import DownIcon from 'material-ui/svg-icons/navigation/arrow-downward'
import AddIcon from 'material-ui/svg-icons/content/add-box';
import { blue500, red500, green500 } from 'material-ui/styles/colors';
import Link from '../../components/Link';
import CreatePollEntryIcon from 'material-ui/svg-icons/content/add-box'
import RaisedButton from 'material-ui/RaisedButton';
import RemoveIcon from 'material-ui/svg-icons/action/delete';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';
import DateTimePicker from '../../components/DateTimePicker/DateTimePicker';
import Checkbox from 'material-ui/Checkbox';
//import TextField from 'material-ui/TextField';
import TextField from '../../components/TextField/TextField'
import moment from 'moment-timezone';
import _ from 'lodash';
import PollQuestionComponent from './PollQuestionComponent'
import { getDefaultOptions } from './PollQuestionComponent'
import Divider from 'material-ui/Divider';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import { PollResult } from 'botworx-utils/lib/data/enums';
import uuid from 'node-uuid';

// let CurrentDateTime = () => moment().subtract(moment().utcOffset(), 'minutes').toDate();

const styles = {
  columnTwo: {
    display: 'inline-block',
    width: 300,
    marginLeft: 180,
  },
  columnOne: {
    display: 'inline-block',
    width: 300,
    marginLeft: 30,
  },
  resultAccess: {
    display: 'inline-block',
    width: 400,
    marginLeft: 30,
  },
  header: {
    display: 'inline-block',
    width: '80%'
  },
  dialogBox: {
    width: 700,
    marginLeft: 300
  },
  inlineHeader: {
    display: 'inline-block',
    textAlign: '',
    width: '10em'
  },
  questionTextLabel: {
    display: 'inline-block',
    marginLeft: 30,
  },
  questionTextStyle: {
    display: 'inline-block',
    width: 500,
    marginLeft: 30,
  },
  questionsContainer: {
    /*textAlign: 'center'*/
  },
  pollNameStyle: {
    fontSize: '2em',
    width: '50%'
  },
  headerText: {
    width: '50%'
  },
  checkbox: {
    textTransform: 'uppercase',
    marginLeft: 15,
    display: 'inline-block',
    width: 'auto',
    whiteSpace: 'nowrap',
    top: '6px'
  },
  deleteQ: {
    marginLeft: 10,
  },
  settingsStyle: {
    display: 'inline-block',
    width: '75%',
    borderRight: '1px solid #ddd',
    paddingRight: '2em'
  },
  labelsStyle: {
    display: 'inline-block',
    width: '20%',
    paddingLeft: '2em',
    verticalAlign: 'top'
  },
  headerQ: {
    color: 'rgb(0, 188, 212)',
    display: 'inline-block',
  },
  dialogBox: {
    width: 700,
    marginLeft: 300
  }
};
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

const title = 'BotWorx.Ai - Create Poll';

const newQuestion = {
  seqId: 0,
  label: '',
  text: '',
  options: [],
  showSkipOption: true,
  resultAccess: '',
  image: '',
  labelValidation: '',
  textValidation: ''
};

class BotPoll extends Component {
  constructor(props) {
    super(props);

    //defStartDate.setHours(0, 0, 0, 0);
    let firstQuestion = JSON.parse(JSON.stringify(newQuestion));
    firstQuestion.id = uuid.v4();

    const { allAccounts, accountId } = this.props;
    this.tz = allAccounts[accountId] ? allAccounts[accountId].timezone : '';
    // let CurrentDateTime = () => moment().subtract(moment().utcOffset(), 'minutes').toDate();
    const tzMoment = moment.tz(this.tz);
    this.tzOffset = tzMoment._offset;
    let CurrentDateTime = () => moment().subtract(moment().utcOffset(), 'minutes').add(this.tzOffset, 'minutes').toDate();
    this.state = {
      name: '',
      description: '',
      image: '',
      startDateTime: CurrentDateTime(),
      endDateTime: CurrentDateTime(),
      language: 'en',
      questions: [firstQuestion],
      startLabel: 'Start',
      skipLabel: 'Skip',
      resumeLabel: 'Resume',
      validations: {
        name: '',
        endDate: ''
      },
      labelsShowCss: 'expand',
      skipAll: true
    };

  }
  static propTypes = {
    questions: PropTypes.array,
  };
  static defaultProps = {
    questions: [],
    name: '',
  };

  static contextTypes = { setTitle: PropTypes.func.isRequired };

  componentWillReceiveProps(nextProps) {
    this.setState(Object.assign({}, this.state, { broadcastEntryData: nextProps.broadcastEntryData }));
  }
  addQuestion = (index) => {
    //let newQuestion = `q-${this.state.pollQuestions.length}`;

    /*const lastQ = this.state.questions[this.state.questions.length - 1];
     if (lastQ) {
     newQ.seqId = lastQ.seqId + 1;
     }*/

    let seqId = 1;
    for (var i = 0, len = this.state.questions.length; i < len; i++) {
      if (this.state.questions[i].seqId > seqId) {
        seqId = this.state.questions[i].seqId;
      }
    }
    let newQ = JSON.parse(JSON.stringify(newQuestion));
    newQ.seqId = seqId + 1;
    newQ.id = uuid.v4();
    newQ.options = getDefaultOptions();
    this.state.questions.splice(index + 1, 0, newQ);
    this.setState(Object.assign({}, this.state, { questions: this.state.questions }));

    /*let questions = this.state.questions;
     questions[index + 1] = newQ;
     this.setState(Object.assign({}, this.state, { questions: questions }));*/
  }
  delQuestion = (index) => {
    this.state.questions.splice(index, 1)
    this.setState(Object.assign({}, this.state, { questions: this.state.questions }));
  }
  setQuestionProp = (seqId, e, attribute) => {
    let questions = this.state.questions;
    let question = questions.filter(q => q.seqId === seqId);
    const data = e.target.value;
    question[0][attribute] = data;
    if (attribute === 'label' || attribute === 'text') {
      if (data.replace(/\s/g, '') !== '') {
        if (attribute === 'label') {
          question[0].labelValidation = '';
        }
        if (attribute === 'text') {
          question[0].textValidation = '';
        }
      }
    }
    this.setState(Object.assign({}, this.state, { questions: questions }));
  }

  setSkipValue = (seqId, checked) => {
    let questions = this.state.questions;
    let question = questions.filter(q => q.seqId === seqId);
    question[0].showSkipOption = checked;
    this.setState(Object.assign({}, this.state, { questions: questions }));
    /*if (checked === false) {
     this.setState(Object.assign({}, this.state, { skipAll: checked }));
     } else {
     let skipableQuestions = questions.filter(q => q.showSkipOption === false);
     if (skipableQuestions.length < 1) {
     this.setState(Object.assign({}, this.state, { skipAll: checked }));
     }
     }*/
  }

  setSkipAll = (checked) => {
    let questions = this.state.questions;
    if (checked === true) {
      questions.map(q => q.showSkipOption = checked);
      this.setState(Object.assign({}, this.state, { questions: questions }));
    }
    this.setState(Object.assign({}, this.state, { skipAll: checked }));
  }

  setPollProp = (attribute, data) => {
    let prop = {};
    prop[attribute] = data;
    this.setState(Object.assign({}, this.state, prop));
    if (attribute === 'name' || attribute === 'endDateTime') {
      let validations = this.state.validations;
      if (attribute === 'name') {
        if (data.replace(/\s/g, '') !== '') {
          validations.name = '';
        }
      }
      if (attribute === 'endDateTime') {
        if (data !== null && data > this.state.startDateTime) {
          validations.endDate = '';
        }
      }
      //this.setState(Object.assign({}, this.state, { validations: validations }));
    }
  }
  onOptionsUpdate = (optionsState) => {
    let questions = this.state.questions;
    let question = questions.filter(q => q.seqId === optionsState.questionSeqId);
    if (question.length) {
      question[0].options = optionsState.options;
      this.setState(Object.assign({}, this.state, { questions: this.state.questions }));
    }
  }
  loadState = (pollData) => {
    for (var prop in pollData) {
      if (typeof (pollData[prop]) != 'undefined') {
        if (prop === 'startDate' || prop === 'endDate' || prop === 'startTime' || prop === 'endTime') {
          if (pollData.startDate && pollData.startTime) {
            // we get utc string, subtract current offset which the datepicker will automatically add
            // let startDateTime = moment(pollData.startDate).subtract(moment().utcOffset(), 'minutes').toDate();
            let startDateTime = moment(pollData.startDate).subtract(moment().utcOffset(), 'minutes').add(this.tzOffset, 'minutes').toDate();
            this.state.startDateTime = startDateTime;
          } else if (pollData.startDate || pollData.startTime){
            this.state.startDateTime = null;
          }
          if (pollData.endDate && pollData.endTime) {
            let endDateTime = moment(pollData.endTime).subtract(moment().utcOffset(), 'minutes').add(this.tzOffset, 'minutes').toDate();
            this.state.endDateTime = endDateTime;
          } else if (pollData.endDate || pollData.endTime) {
            this.state.endDateTime = null;
          }
        } else {
          this.state[prop] = pollData[prop];
          if (prop === 'questions') {
            for (var i = 0, len = this.state[prop].length; i < len; i++) {
              this.state[prop][i].seqId = i;
              this.state[prop][i].labelValidation = '';
              if (this.state[prop].showSkipOption === false) {
                this.state.skipAll = false;
              }
              if (!this.state[prop][i].id) {
                this.state[prop][i].id = uuid.v4();
              }
              for (var j = 0, lenJ = this.state[prop][i].options.length; j < lenJ; j++) {
                this.state[prop][i].options[j].seqId = j;
                this.state[prop][i].options[j].labelValidation = '';
                if (!this.state[prop][i].options[j].id) {
                  this.state[prop][i].options[j].id = uuid.v4();
                }
              }
            }
          }
        }
      }
    }
  }

  savePoll = (callback, pollBroadcastTime, pollData) => {
    let isValidPoll = true;
    let validations = this.state.validations;
    if (this.state.name.replace(/\s/g, '') === '') {
      validations.name = 'Enter Poll Name.';
      this.setState(Object.assign({}, this.state, { validations: validations }));
      isValidPoll = false;
    }
    if (this.state.endDateTime === null) {
      validations.endDate =  'Select End Date.';
      this.setState(Object.assign({}, this.state, { validations: validations }));
      isValidPoll = false;
    } else {
      if (this.state.endDateTime <= this.state.startDateTime) {
        validations.endDate =  'End Date should be greater than Start Date.';
        this.setState(Object.assign({}, this.state, { validations: validations }));
        isValidPoll = false;
      }
    }

    let questions = this.state.questions;
    for (var i = 0, len = questions.length, options; i < len; i++) {
      if (questions[i].label.replace(/\s/g, '') === '') {
        questions[i].labelValidation = 'Enter Question label.';
        isValidPoll = false;
      }
      if (!questions[i].text || questions[i].text.replace(/\s/g, '') === '') {
        questions[i].textValidation = 'Enter Question Text.';
        isValidPoll = false;
      }
      options = questions[i].options;
      for (var j = 0, lenJ = options.length; j < lenJ; j++) {
        if (!options[j].label || options[j].label.replace(/\s/g, '') === '') {
          options[j].labelValidation = 'Enter Option Label.';
          isValidPoll = false;
        }
      }
    }
    if (!isValidPoll) {
      this.setState(Object.assign({}, this.state, { questions: questions }));
    }

    if (isValidPoll) {
        // let CurrentDateTime = () => moment().subtract(moment().utcOffset(), 'minutes').add(this.tzOffset, 'minutes').toDate();
        let stateToSave = _.clone(this.state);
        stateToSave.startDateTime = moment(stateToSave.startDateTime).subtract(this.tzOffset, 'minutes').toDate();
        stateToSave.endDateTime = moment(stateToSave.endDateTime).subtract(this.tzOffset, 'minutes').toDate();
        callback(stateToSave, pollBroadcastTime, pollData);
    }
  }
  toggleCollapse = () => {
    let collapseState = (this.state.labelsShowCss === 'expand') ? 'collapse' : 'expand';
    this.setState(Object.assign({}, this.state, { labelsShowCss: collapseState }));
  }

  movePollQuestion = (currentIndex, moveDirection) => {
    let questions = this.state.questions;
    const newIndex = currentIndex + moveDirection;
    if (newIndex < 0 || newIndex >= questions.length) {
      return;
    }
    let questionToMove = questions.splice(currentIndex, 1);
    questions.splice(newIndex, 0, questionToMove[0]);
    this.setState(Object.assign({}, this.state, { questions: questions }));
    this.props.onDataChange(this.state);
  }


  render() {
    const {pollEntries, botId, accountId, errorText, onPollValueChange, pollNameValidation,
        addQuestion, pollName, onSavePoll, pollData, languages, onCloseDialog, dialogstate,
        onSaveClick, onSaveEditClick, pollBroadcastTime, onCancelClick, allAccounts } = this.props;
    this.context.setTitle(title);
    const tz = allAccounts[accountId] ? allAccounts[accountId].timezone : null;
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={onCloseDialog}
      />,
      <FlatButton
        label="Save"
        primary={true}
        onTouchTap={() => onSaveClick(this.state)}
      />,
      <FlatButton
        label="Save and Edit"
        primary={true}
        style={{ marginLeft: 10 }}
        keyboardFocused={true}
        onTouchTap={() => onSaveEditClick(this.state, pollData)}
      />,
    ];
    if (pollData && !pollData.init) {
      this.loadState(pollData);
      pollData.init = true;
    }
    return (
      <div>
        <div className={cx(s.fixedbutton)}>
          <RaisedButton
            className={cx(s.cancelButton)}
            label="Cancel"
            primary
            onClick={() => onCancelClick(accountId, botId)}
          />
          <RaisedButton
            className={cx(s.saveButton)}
            label="Save"
            primary
            onClick={(e) => { this.savePoll(onSavePoll, pollBroadcastTime, pollData) }}
          />
        </div>
        <div className={cx(s.root, flexbox.fullHeight, flexbox.column)}>
          <Paper className={cx(s.section, flexbox.columnItem, s[this.state.labelsShowCss])}>
            <div>
              <div className={cx(s.divStyle)} style={styles.settingsStyle}>
                <Dialog
                  title="Warning"
                  actions={actions}
                  style={styles.dialogBox}
                  modal={false}
                  open={dialogstate}
                  onRequestClose={onCloseDialog}
                >
                  {'You have a wrapup broadcast scheduled at ' + pollBroadcastTime +
                  '. Do you want to save poll and proceed for editing broadcast?'}
                </Dialog>
                <div>
                  <TextField key='pollname'
                             onChange={(e) => { this.setPollProp('name', e.target.value) }}
                             value={this.state.name}
                             floatingLabelText="Poll Name"
                             style={styles.columnOne}
                             errorText={this.state.validations.name}
                             required={true}>
                  </TextField>
                  <TextField key='description'
                             onChange={(e) => { this.setPollProp('description', e.target.value) }}
                             style={styles.columnTwo}
                             floatingLabelText="Poll Description"
                             value={this.state.description}>
                  </TextField><br />
                </div>
                <TextField key='pollImage'
                           onChange={(e) => { this.setPollProp('image', e.target.value) }}
                           floatingLabelText="Poll Image"
                           style={styles.columnOne}
                           value={this.state.image}>
                </TextField>
                <SelectField
                  floatingLabelText="Select Languages"
                  value={this.state.language}
                  onChange={(e, index, value) => {
                    this.setPollProp('language', value);
                  }
                  }
                  style={styles.columnTwo}
                >
                  {languages.map(l => (
                    <MenuItem value={l['1']} primaryText={l.local} key={l.name} />))}
                </SelectField>
                <div>
                  <DateTimePicker
                    className={cx(s.divStyle)}
                    floatingLabelText={`Poll Start Date/Time(${this.tz} timezone)`}
                    container="inline"
                    mode="portrait"
                    value={this.state.startDateTime}
                    style={styles.columnOne}
                    autoOk={true}
                    onChange={(dateTime) => {
                      this.setPollProp('startDateTime', dateTime)
                    }}
                    minDate={new Date}
                  />
                  <DateTimePicker
                    className={cx(s.divStyle)}
                    floatingLabelText={`Poll End Date/Time(${this.tz} timezone)`}
                    container="inline"
                    mode="portrait"
                    value={this.state.endDateTime}
                    style={styles.columnTwo}
                    autoOk={true}
                    onChange={(dateTime) => {
                      this.setPollProp('endDateTime', dateTime)
                    }}
                    minDate={this.state.startDateTime}
                    errorText={this.state.validations.endDate}
                  />
                </div>
                <SelectField
                  floatingLabelText="Poll Result Access"
                  value={this.state.resultAccess}
                  onChange={(e, index, value) => {
                    this.setPollProp('resultAccess', value);
                  }
                  }
                  style={styles.resultAccess}
                >
                  {Object.entries(PollResult).map(pe => (
                    <MenuItem value={pe[1]} primaryText={pe[1]} key={pe[1]} />))}
                </SelectField>
              </div>
              <div style={styles.labelsStyle}>
                <h4>Labels</h4>
                <TextField key='startLabel'
                           onChange={(e) => { this.setPollProp('startLabel', e.target.value) }}
                           value={this.state.startLabel}
                           floatingLabelText="Start Button Label"
                >
                </TextField><br />
                <TextField key='skipLabel'
                           onChange={(e) => { this.setPollProp('skipLabel', e.target.value) }}
                           floatingLabelText="Skip Button Label"
                           value={this.state.skipLabel}>
                </TextField><br />
                <TextField key='resumeLabel'
                           onChange={(e) => { this.setPollProp('resumeLabel', e.target.value) }}
                           floatingLabelText="Resume Button Label"
                           value={this.state.resumeLabel}>
                </TextField>
              </div>
            </div><br />
          </Paper>

          <div>
            <h3 style={styles.inlineHeader}><b>Questions</b></h3>
            <Checkbox
              label="Skip All"
              style={styles.checkbox}
              defaultChecked={this.state.skipAll}
              onCheck={(e, checked) => {
                this.setSkipAll(checked)
              }}
            />
          </div>

          <div>
            {this.state.questions.map((input, index) =>
              <Paper key={`qDiv_${index}`}
                     style={{ paddingTop: '1em', marginBottom: '2em' }}
                     className={cx(s.section, flexbox.columnItem, s[this.state.questions[index].labelsShowCss])}>
                <div>
                  <h4 style={styles.headerQ}><b>{`Question ${index + 1}`}</b></h4>
                  <IconButton key={`qAdd_${index}`} title="Add Question"
                              onClick={() => { this.addQuestion(index) }}>
                    <AddIcon
                      color={green500}
                      hoverColor={blue500}
                      className={cx(s.createFlow)}
                    />
                  </IconButton>
                  <IconButton key={`qUp_${index}`} title="Move Up"
                              disabled={(index === 0)}
                              onClick={() => this.movePollQuestion(index, -1)}>
                    <UpIcon
                      color={blue500}
                      className={cx(s.createFlow)} />
                  </IconButton>
                  <IconButton key={`qDown_${index}`} title="Move Down"
                              disabled={(index === this.state.questions.length - 1)}
                              onClick={() => this.movePollQuestion(index, 1)}>
                    <DownIcon
                      color={blue500}
                      className={cx(s.createFlow)} />
                  </IconButton>
                  <IconButton
                    key={`qDel_${index}`}
                    title="Delete Question"
                    style={styles.deleteQ}
                    onClick={() => this.delQuestion(index)}
                    disabled={this.state.questions.length <= 1}>
                    <DeleteIcon color={red500} className={cx(s.createFlow)} />
                  </IconButton>
                  <Checkbox
                    label="Skip"
                    style={styles.checkbox}
                    defaultChecked={this.state.questions[index].showSkipOption}
                    disabled={this.state.skipAll}
                    onCheck={(e, checked) => {
                      this.setSkipValue(input.seqId, checked)
                    }}
                  />
                </div>
                <TextField
                  className={s.labelField}
                  style={styles.questionTextLabel}
                  floatingLabelText='Title'
                  value={this.state.questions[index].label}
                  onChange={(e) => { this.setQuestionProp(input.seqId, e, 'label') }}
                  errorText={this.state.questions[index].labelValidation}
                  maxLength='20'
                  required={true}
                />
                <TextField
                  style={styles.questionTextStyle}
                  floatingLabelText='Question Text'
                  value={this.state.questions[index].text}
                  onChange={(e) => { this.setQuestionProp(input.seqId, e, 'text') }}
                  errorText={this.state.questions[index].textValidation}
                  required={true}
                />
                <TextField
                  style={styles.questionTextStyle}
                  floatingLabelText='Image Url'
                  value={this.state.questions[index].image}
                  onChange={(e) => { this.setQuestionProp(input.seqId, e, 'image') }}
                />
                <PollQuestionComponent key={`q_${index}`}
                                       style={styles.questionTextStyle}
                                       qIndex={index + 1}
                                       question={this.state.questions[index]}
                                       onDataChange={this.onOptionsUpdate} />

              </Paper>
            )}

          </div>
        </div>
        <div className={cx(s.fixedbutton)}>
          <RaisedButton
            className={cx(s.cancelButton)}
            label="Cancel"
            primary
            onClick={() => onCancelClick(accountId, botId)}
          />
          <RaisedButton
            className={cx(s.saveButton)}
            label="Save"
            primary
            onClick={(e) => { this.savePoll(onSavePoll, pollBroadcastTime, pollData) }}
          />
        </div>
      </div>
    )
  }
}
export default withStyles(flexbox, s)(BotPoll);
