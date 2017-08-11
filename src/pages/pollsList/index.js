import React from 'react';
import { connect } from 'react-redux';
import PollList from './PollsList';
import {INITIAL_PAGING_DETAILS} from '../../config';
import {
    fetchPollsEntries,
    deletePollEntry,
    setPollStatusClosed,
    setPollStatusOpen,
    setPollStatusInactive,
    addPollBroadcast,
  getNextPollData,
  setActicePollPaginationDetails,
  setInActicePollPaginationDetails,
  setPendingPollPaginationDetails,
  setClosedPollPaginationDetails,
  clearPollsEntries,
} from '../../actions/poll';
import {
  ACTIVE_POLL,
  INACTIVE_POLL,
  CLOSED_POLL,
  PENDING_POLL,
} from '../pollTypes/pollType';

import {
    changeBroadcastEntryFormFlag,
    fetchBotBroadcastEntries,
} from '../../actions/broadcast';
import {
    setManageAccountId,
} from '../../actions/manageAccount';
import { refreshUserDetails } from '../../actions/auth';
import {
  setCurrentBotId,
} from '../../actions/flow';

import { redirect} from '../../actions/route';

const currentTime = new Date();

const mapStateToProps = (state) => {
    return {
        activePolls: state.botPolls.activePolls,
        inActivePolls: state.botPolls.inActivePolls,
        closedPolls: state.botPolls.closedPolls,
        pendingPolls: state.botPolls.pendingPolls,
        broadcastEntryFormFlag: state.broadcast.broadcastEntryFormFlag,
        botId: state.botFlows.botId,
        accountId: state.manageAccount.currentAccountId,
        pagination: state.pagination,
        allAccounts: state.accounts.list,
    };
};

const mapDispatch = (dispatch) => ({
  onDeletePollEntry: (botId, pollId, pollType) => {
    dispatch(deletePollEntry(botId, pollId, pollType));
    },
    onEditPollEntry: (pollId, botId, accountId) => {
        dispatch(redirect('/accounts/'+ accountId + '/bots/'+ botId +'/polls/'+ pollId));
    },
    onAddBroadcastClick: (pollId, pollName, pollEndDate) => {
        dispatch(addPollBroadcast(pollId, pollName, pollEndDate));
    },
  onClosePollEntry: (pollId, pollType) => {
    dispatch(setPollStatusClosed(pollId, pollType));
        console.log('close poll!!');
    },
  onOpenPollEntry: (pollId, pollType) => {
        console.log('open poll!!');
    dispatch(setPollStatusOpen(pollId,  pollType));
    },
  onDeactivatePollEntry: (pollId, pollType) => {
        console.log('deactivate poll!!');
    dispatch(setPollStatusInactive(pollId, pollType));
    },
  fetchPollList: (accountId, botId, pagination, pollType) => {
    dispatch(fetchPollsEntries(accountId, botId, pagination, pollType));
    switch(pollType){
      case ACTIVE_POLL:{
        dispatch(setActicePollPaginationDetails(pagination.page, pagination.size));
        break;
      }
      case INACTIVE_POLL:{
        dispatch(setInActicePollPaginationDetails(pagination.page, pagination.size));
        break;
      }
      case CLOSED_POLL:{
        dispatch(setClosedPollPaginationDetails(pagination.page, pagination.size));
        break;
      }
      case PENDING_POLL:{
        dispatch(setPendingPollPaginationDetails(pagination.page, pagination.size));
        break;
      }
    }
  }

});

const PollingPage = connect(mapStateToProps, mapDispatch)(PollList);

export default function ({ params, context }) {
  const initialpage = INITIAL_PAGING_DETAILS.page;
  const initialsize = INITIAL_PAGING_DETAILS.size;
    const botId = params.botId;
    const accountId = params.accountId;
    (function dispatchActions(dispatch) {
    dispatch(setActicePollPaginationDetails(initialpage, initialsize));
    dispatch(setInActicePollPaginationDetails(initialpage, initialsize));
    dispatch(setClosedPollPaginationDetails(initialpage, initialsize));
    dispatch(setPendingPollPaginationDetails(initialpage, initialsize));
        dispatch(refreshUserDetails());
        dispatch(setManageAccountId(accountId));
        dispatch(setCurrentBotId(botId));
    let pagination = context.store.getState().pagination.activePoll;
    let pollType = ACTIVE_POLL;
    dispatch(fetchPollsEntries(accountId, botId, pagination, pollType));
        // dispatch(fetchBotBroadcastEntries(accountId, botId));
        dispatch(changeBroadcastEntryFormFlag(false));
  })(context.store.dispatch);
    return (
        <PollingPage botId={botId}
            accountId={accountId} />
    );
}
