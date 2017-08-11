import React, { PropTypes, Component } from 'react';
import Griddle, { plugins } from 'griddle-react';
import { connect } from 'react-redux';
import CustomPager from '../pager/pager';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Paper from 'material-ui/Paper';
import s from './PollsList.css';
import NoDataFound from '../noDataFound/noDataFound';
import {
  INACTIVE_POLL
} from '../pollTypes/pollType';

import {
  TableRow,
  TableRowColumn
} from 'material-ui/Table';

import {
  DeletePollIcon,
  BroadcastPollIcon,
  TestPollIcon,
  EditPollIcon
} from './PollActions';

function AddInActivePolls(props) {
  const Filter = () => (null);
  const SettingsToggle = () => (null);
  const Pagination = () => (null);
  const editAction = props.EditAction;
  const deleteAction = props.DeleteAction;
  const addBroadcastClick = props.BroadcastAction;
  //const activateAction = props.ActivateAction;
  const botId = props.botparam;
  const accountId = props.accountId;
  const onNextClick = props.onNextClick;
  const onPreviousClick = props.onPreviousClick;
  const onPageNumberSelect = props.onPageNumberSelect;
  let currentPage = props.currentPage;
  let pageSize = props.pageSize;
  let recordCount = props.recordCount;
  const data = props.data;


  const CustomRowComponent = connect(
    (state, props) => {
      return (
        {
          rowData: plugins.LocalPlugin.selectors.rowDataSelector(state, props)
        }
      );
    })

    (({ rowData }) => {
      return (
        <TableRow key={rowData.Action} selectable={false}>
          <TableRowColumn>
            {rowData.Name}
          </TableRowColumn>

          <TableRowColumn>
            {isNaN(Date.parse(rowData.StartDate)) ? '' : rowData.StartDate}
          </TableRowColumn>

          <TableRowColumn>
            {isNaN(Date.parse(rowData.EndDate)) ? '' : rowData.EndDate}
          </TableRowColumn>

          <TableRowColumn>
            <EditPollIcon onEditClick={editAction}
              accountId={props.accountId}
              botId={botId}
              pollId={rowData.Action} />

            <TestPollIcon pollId={rowData.Action} />

            <DeletePollIcon
              onDeleteClick={deleteAction}
              pollName={rowData.Name}
              pollId={rowData.Action}
              botId={botId}
              pollType={INACTIVE_POLL} />
          </TableRowColumn>
        </TableRow>
      );
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
        pollType={INACTIVE_POLL}
        currentPage={currentPage}
        pageSize={pageSize}
        recordCount={recordCount}
        onPreviousClick={onPreviousClick}
        onPageNumberSelect={onPageNumberSelect}
      />
    </div>
  ) : <NoDataFound>
      <div className={s.noresultmsg}>No Inactive Polls</div>
    </NoDataFound>;
}

export default withStyles(s)(AddInActivePolls);
