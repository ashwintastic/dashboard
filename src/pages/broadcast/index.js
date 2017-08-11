import React from 'react';
import { connect } from 'react-redux';
import Broadcast from './broadcast';
import {
    fetchBotBroadcastEntries,
    fetchSubscriptionEntries,
    saveBroadcastEntry,
    getBroadcastEntry,
    deleteBroadcastEntry,
    editBroadcastEntry,
    fetchExistingFlowNodes,
    broadcastValueChange
} from '../../actions/broadcast';
import { redirect } from '../../actions/route';
import {
    setErrorText,
    setPastDateErrorText
} from '../../actions/manageAccount';
import { refreshUserDetails } from '../../actions/auth';
import { setCreateDialog, loadSchemaRefs } from '../../actions/flow';

const mapStateToProps = (state) => {
  return {
    broadcastEntries: state.broadcast.broadcastEntries,
    subscriptionEntries: state.broadcast.subscriptionEntries,
    broadcastEntryData: state.broadcast.broadcastEntryData,
    existingFlowNodes: state.broadcast.existingFlowNodes,
    errorText: state.manageAccount.errorText,
    pastDateError: state.manageAccount.pastDateError,
    dialogstate: state.botFlows.createBotFlag,
    schemaRefs: state.botFlows.schemaRefs,
    allAccounts: state.accounts.list,
  };
};

const mapDispatch = (dispatch) => ({
  onYesClick: (botId, nodeData, accountId) => {
    dispatch(setCreateDialog(false));
    if (nodeData.length === 0) {
        dispatch(setErrorText('Broadcast nodes are mandatory.'));
      }
    else {
        dispatch(saveBroadcastEntry(botId, nodeData, accountId))
      }
  },
  onDeleteBroadcastEntry: (botId, accountId, broadcastId) => {
    dispatch(deleteBroadcastEntry(botId, accountId, broadcastId));
  },
  onCreateBroadcastEntry: (accountId, botId) => {
    dispatch(setErrorText(''));
    dispatch(setPastDateErrorText(''));
    dispatch(redirect(`/accounts/${accountId}/bots/${botId}/broadcast/upsert`));
  },
  onEditBroadcastEntry: (botId, accountId, broadcastId, pollId) => {
    dispatch(setErrorText(''));
    dispatch(setPastDateErrorText(''));
    if (pollId) {
      dispatch(redirect(`/accounts/${accountId}/bots/${botId}/broadcast/${broadcastId}/polls/${pollId}`));
    } else {
      dispatch(redirect(`/accounts/${accountId}/bots/${botId}/broadcast/upsert/${broadcastId}`));
    }
    dispatch(getBroadcastEntry(botId, accountId, broadcastId));
    dispatch(editBroadcastEntry(broadcastId));
  },
  onBroadcastValueChange: (obj) => {
    dispatch(broadcastValueChange(obj));
  }
});

const BroadcastPage = connect(mapStateToProps, mapDispatch)(Broadcast);

export default function({ params, context }) {
  const botId = params.botId;
  const accountId = params.accountId;
  (function dispatchActions(dispatch) {
    dispatch(refreshUserDetails());
    dispatch(fetchExistingFlowNodes(botId, accountId));
    dispatch(fetchBotBroadcastEntries(accountId, botId));
    dispatch(fetchSubscriptionEntries(accountId, botId));
    dispatch(loadSchemaRefs());
  } (context.store.dispatch));
  return (
        <BroadcastPage botId={botId} accountId={accountId}/>
  );
}
