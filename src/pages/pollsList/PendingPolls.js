import React, { PropTypes, Component } from 'react';
import cx from 'classnames';
import s from './PollsList.css';
import flexbox from '../../components/flexbox.css';
import IconButton from 'material-ui/IconButton';
import DeactivatePollIcon from 'material-ui/svg-icons/av/not-interested';
import ActivatePollIcon from 'material-ui/svg-icons/av/play-arrow';
import { green900, red900 } from 'material-ui/styles/colors';
import CustomPager from '../pager/pager';
import Griddle, { plugins } from 'griddle-react';
import { connect } from 'react-redux';
import Paper from 'material-ui/Paper';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import NoDataFound from '../noDataFound/noDataFound';
import {
  PENDING_POLL
} from '../pollTypes/pollType';

import {
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

import {
  DeletePollIcon,
  BroadcastPollIcon,
  TestPollIcon,
  EditPollIcon
} from './PollActions';

function AddPendingPolls(props) {
  const Filter = () => (null);
  const SettingsToggle = () => (null);
  const Pagination = () => (null);
  const editAction = props.EditAction;
  const deleteAction = props.DeleteAction;
  const addBroadcastClick = props.BroadcastAction;
  const activateAction = props.ActivateAction;
  const deactivateAction = props.DeactivateAction;
  const data = props.data;
  const botId = props.botparam;
  const accountId = props.accountId;
  const onNextClick = props.onNextClick;
  const onPreviousClick = props.onPreviousClick;
  const onPageNumberSelect = props.onPageNumberSelect;
  let currentPage = props.currentPage;
  let pageSize = props.pageSize;
  let recordCount = props.recordCount;
  const CustomRowComponent = connect(
    (state, props) => {
      return (
        {
          rowData: plugins.LocalPlugin.selectors.rowDataSelector(state, props)
        }
      );
    })(({ rowData }) => {
      return (
        <TableRow key={rowData.Action} selectable={false}>
          <TableRowColumn>
            {rowData.Name}
          </TableRowColumn>

          <TableRowColumn>
            {rowData.StartDate}
          </TableRowColumn>

          <TableRowColumn>
            {rowData.EndDate}
          </TableRowColumn>

          <TableRowColumn>
            <EditPollIcon onEditClick={editAction}
              accountId={accountId}
              botId={botId} pollId={rowData.Action} />
            <IconButton
              onClick={() => activateAction(rowData.Action, PENDING_POLL)}
              title="Open Poll"
              className={cx(flexbox.rowItem, s.action)}
              style={{ marginLeft: -12 }}
            >
              <ActivatePollIcon color={green900} />
            </IconButton>

            <IconButton
              onClick={() => deactivateAction(rowData.Action, PENDING_POLL)}
              title="Deactivate Poll"
              className={cx(flexbox.rowItem, s.action)}
              style={{ marginLeft: -12 }}
            >
              <DeactivatePollIcon color={red900} />
            </IconButton>
            <TestPollIcon pollId={rowData.Action} />
            <BroadcastPollIcon onBroadcastPollClick={addBroadcastClick}
              pollId={rowData.Action}
              pollName={rowData.Name}
              pollEndDate={rowData.EndDate} 
            />
            <DeletePollIcon
              onDeleteClick={deleteAction}
              pollName={rowData.Name}
              pollId={rowData.Action}
              botId={botId}
              pollType={PENDING_POLL} />
          </TableRowColumn>
        </TableRow>
      )
    });

  return data.length ? (
    <div>
      <Griddle data={data}
        components={{
          Filter, SettingsToggle,
          Row: CustomRowComponent,
          Pagination
        }}
        pageProperties={{
          currentPage: currentPage,
          pageSize: pageSize,
          recordCount: recordCount
        }}
      >
      </Griddle>
      <CustomPager onNextClick={onNextClick}
        accountId={accountId}
        botId={botId}
        pollType={PENDING_POLL}
        currentPage={currentPage}
        pageSize={pageSize}
        recordCount={recordCount}
        onPreviousClick={onPreviousClick}
        onPageNumberSelect={onPageNumberSelect}
      />
    </div>
  ) : <NoDataFound>
      <div className={s.noresultmsg}>No Pending Polls</div>
    </NoDataFound>;

}

export default withStyles(s)(AddPendingPolls);
