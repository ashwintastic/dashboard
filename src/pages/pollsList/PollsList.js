import React, { PropTypes, Component } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import s from './PollsList.css';
import flexbox from '../../components/flexbox.css';
import Paper from 'material-ui/Paper';
import { blue500, green500 } from 'material-ui/styles/colors';
import Link from '../../components/Link';
import CreatePollEntryIcon from 'material-ui/svg-icons/content/add-box'

import { Tabs, Tab } from 'material-ui/Tabs';
import moment from 'moment-timezone';
import DeleteIcon from '../../components/DeleteIcon/DeleteIcon';
import _ from 'lodash';
import { host, dateDisplayFormatType } from '../../config'

import AddActivePolls from './ActivePoll';
import AddClosedPolls from './ClosedPolls';
import AddPendingPolls from './PendingPolls';
import AddInActivePolls from './InActivePoll';
import { displayUtcDate, displayTimeZoneDate } from '../../utils/displayDate';

import {
  ACTIVE_POLL,
  INACTIVE_POLL,
  CLOSED_POLL,
  PENDING_POLL,
} from '../pollTypes/pollType';

const title = 'BotWorx.Ai - Poll';


class BotPoll extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pollQuestions: ['q-0'],
    };
    this.data = [];

  }
  static propTypes = {
    pollQuestions: PropTypes.array,
  };
  static defaultProps = {

  };

  static contextTypes = { setTitle: PropTypes.func.isRequired };

  componentWillReceiveProps(nextProps) {
    this.setState(Object.assign({}, this.state, { broadcastEntryData: nextProps.broadcastEntryData }));
  }
  addPollQuestion = () => {
    var newQuestion = `q-${this.state.pollQuestions.length}`;
    this.setState(Object.assign({}, this.state, { pollQuestions: this.state.pollQuestions.concat([newQuestion]) }));
  };

  getPagingDetails(pollType) {
    let page = 0;
    let size = 0;
    let pagination = this.props.pagination;
    switch (pollType) {
      case ACTIVE_POLL: {
        page = pagination.activePoll.page;
        size = pagination.activePoll.size;
        break;
      }
      case INACTIVE_POLL: {
        page = pagination.inactivePoll.page;
        size = pagination.inactivePoll.size;
        break;
      }
      case PENDING_POLL: {
        page = pagination.pendingPoll.page;
        size = pagination.pendingPoll.size;
        break;
      }
      case CLOSED_POLL: {
        page = pagination.closedPoll.page;
        size = pagination.closedPoll.size;
        break;
      }

    }
    let paging = {
      page,
      size,
    }
    return paging;
  }

  onNextClick(accountId, botId, pollType) {
    let temp = this.getPagingDetails(pollType);
    let paging = {
      "page": temp.page + 1,
      "size": temp.size
    };
    this.props.fetchPollList(accountId, botId, paging, pollType)
  }

  onPreviousClick(accountId, botId, pollType) {
    let temp = this.getPagingDetails(pollType);
    let paging = {
      "page": temp.page - 1,
      "size": temp.size
    };
    this.props.fetchPollList(accountId, botId, paging, pollType)
  }

  onPageNumberSelect(accountId, botId, pageNumber, pollType) {
    let temp = this.getPagingDetails(pollType);
    let paging = {
      "page": pageNumber,
      "size": temp.size
    };
    this.props.fetchPollList(accountId, botId, paging, pollType)
  }

  getPollsOnTabClick(pollType, accountId, botId) {
    let clearSate = false;
    switch (pollType) {
      case PENDING_POLL: {
        let paging = this.getPagingDetails(PENDING_POLL);
        this.props.fetchPollList(accountId, botId, paging, PENDING_POLL);
        break;
      }
      case CLOSED_POLL: {
        let paging = this.getPagingDetails(CLOSED_POLL);
        this.props.fetchPollList(accountId, botId, paging, CLOSED_POLL);
        break;
      }
      case INACTIVE_POLL: {
        let paging = this.getPagingDetails(INACTIVE_POLL);
        this.props.fetchPollList(accountId, botId, paging, INACTIVE_POLL);
        break;
      }

      case ACTIVE_POLL: {
        let paging = this.getPagingDetails(ACTIVE_POLL);
        this.props.fetchPollList(accountId, botId, paging, ACTIVE_POLL);
        break;
      }

    }
  }

  griddleDataGenerator(polldata) {
    const { allAccounts, accountId } = this.props;
    const tz = allAccounts[accountId] ? allAccounts[accountId].timezone : null;
    const tzOffset = moment.tz(tz)._offset;
    let modifiedpolldata = [];
    polldata.map(p => {
      let temp = {};
      temp.Name = p.name + ' ' + `(${p.id})`;
      temp.StartDate = displayTimeZoneDate(p.startDate, dateDisplayFormatType.DATE_TIME, tzOffset);
      temp.EndDate = displayTimeZoneDate(p.endDate, dateDisplayFormatType.DATE_TIME, tzOffset);
      temp.Action = p.id;
      modifiedpolldata.push(temp);
    });
    return modifiedpolldata;
  }
  render() {
    const { activePolls, inActivePolls, closedPolls, pendingPolls, botId, accountId, broadcastEntryFormFlag,
      onEditPollEntry, onDeletePollEntry, errorText, onClosePollEntry, onOpenPollEntry,
      onDeactivatePollEntry, onAddBroadcastClick, fetchPollList, pagination
    } = this.props;
    this.activePolls = activePolls
    this.context.setTitle(title);
    let data = [];
    let pageSize = 0;
    let recordCount = 0;
    let currentPage = 0;

    if (activePolls.docs) {
      data = this.griddleDataGenerator(activePolls.docs);
      pageSize = activePolls.limit;
      recordCount = activePolls.total;
      currentPage = parseInt(activePolls.page);
    }
    if (inActivePolls.docs) {
      data = this.griddleDataGenerator(inActivePolls.docs);
      pageSize = inActivePolls.limit;
      recordCount = inActivePolls.total;
      currentPage = parseInt(inActivePolls.page);
    }
    if (closedPolls.docs) {
      data = this.griddleDataGenerator(closedPolls.docs);
      pageSize = closedPolls.limit;
      recordCount = closedPolls.total;
      currentPage = parseInt(closedPolls.page);
    }
    if (pendingPolls.docs) {
      data = this.griddleDataGenerator(pendingPolls.docs);
      pageSize = pendingPolls.limit;
      recordCount = pendingPolls.total;
      currentPage = parseInt(pendingPolls.page);
    }
    const otherProps = {
      data,
      EditAction: onEditPollEntry,
      DeleteAction: onDeletePollEntry,
      botparam: botId,
      accountId: accountId,
      pageSize: pageSize,
      recordCount: recordCount,
      currentPage: currentPage,
      onPreviousClick: this.onPreviousClick.bind(this),
      onNextClick: this.onNextClick.bind(this),
      onPageNumberSelect: this.onPageNumberSelect.bind(this),
      BroadcastAction: onAddBroadcastClick
    };

    return (
      <div className={cx(s.root, flexbox.fullHeight, flexbox.column)}>
        <Paper className={cx(s.section, flexbox.columnItem)}>
          <div>
            <div >
              <h2 className={cx(s.headerelem)}>Polls</h2>
              <Link
                to={`/accounts/${accountId}/bots/${botId}/polls/create`}
                title="Create Poll"
                className={cx(flexbox.rowItem, s.action)}
                style={{ width: '86px', height: '86px', padding: '15px' }}
              >
                <CreatePollEntryIcon
                  color={green500}
                  hoverColor={blue500}
                  className={cx(s.createFlow)}
                />
              </Link>
            </div>
          </div>
          <Tabs className={s.tabs}>
            <Tab label="Active" onClick={this.getPollsOnTabClick.bind(this, ACTIVE_POLL, accountId, botId)}>
              <AddActivePolls
                activePolls={activePolls}
                CloseAction={onClosePollEntry}
                {...otherProps}
              />
            </Tab>

            <Tab label="Pending" onClick={this.getPollsOnTabClick.bind(this, PENDING_POLL, accountId, botId)}>
              <AddPendingPolls
                ActivateAction={onOpenPollEntry}
                DeactivateAction={onDeactivatePollEntry}
                {...otherProps}
              />
            </Tab>

            <Tab label="Closed" onClick={this.getPollsOnTabClick.bind(this, CLOSED_POLL, accountId, botId)}>
              <AddClosedPolls {...otherProps} />
            </Tab>

            <Tab label="InActive" onClick={this.getPollsOnTabClick.bind(this, INACTIVE_POLL, accountId, botId)}>
              <AddInActivePolls ActivateAction={onOpenPollEntry} {...otherProps} />
            </Tab>
          </Tabs>
        </Paper>
      </div>
    )
  }
}

export default withStyles(flexbox, s)(BotPoll);
