import React from 'react';
import { connect } from 'react-redux';
import { redirect } from '../../actions/route';
import ViewSubscription from './ViewSubscription';
import {
    fetchSubscriptionEntries
} from '../../actions/broadcast';
import {
    setAddEditDialogState, setCurrentSubscription, setSubscriptionName, saveSubscription,
    setCurrentSubscriptionName, setAddEditMode
} from '../../actions/subscriptions';

const mapStateToProps = (state) => {
  return {
    subscriptionEntries: state.broadcast.subscriptionEntries,
    accountBots: state.accountBots.accountBots[state.manageAccount.currentAccountId] || [],
    showAddEditDialog: state.subscriptions.showAddEditDialog,
    currSubscription: state.subscriptions.currSubscription,
    subscriptionName: state.subscriptions.subscriptionName,
    addEditMode: state.subscriptions.addEditMode
  };
};

const mapDispatch = (dispatch) => ({
  
  onCreateSubscription: (botId) => {
    //dispatch(redirect(`/accounts/${accountId}/bots/${botId}/subscriptions/create`));
    dispatch(setAddEditDialogState(true));
    dispatch(setCurrentSubscription({ botId: botId, name: ''}));
    dispatch(setCurrentSubscriptionName(''));
    dispatch(setAddEditMode('add'));
  },
  onSubscriptionNameChange: (e) => {
    dispatch(setCurrentSubscriptionName(e.target.value));
  },
  onEditSubscription: (botId, subscriptionId, subscriptionName) => {
    dispatch(setCurrentSubscription({ botId: botId, _id: subscriptionId, name: subscriptionName }));
    dispatch(setCurrentSubscriptionName(subscriptionName));
    dispatch(setAddEditMode('edit'));
    dispatch(setAddEditDialogState(true));
  },
  onSaveSubscriptionClick: (accountId, subscriptionName, currSubscription) => {
    currSubscription.name = subscriptionName;
    dispatch(saveSubscription(accountId, currSubscription));
    dispatch(setAddEditDialogState(false));
  },
  onCloseAddEdit: () => {
    dispatch(setAddEditDialogState(false));
  }
});

const ViewSubscriptionPage = connect(mapStateToProps, mapDispatch)(ViewSubscription);

export default function({ params, context }) {
  const botId = params.botId;
  const accountId = params.accountId;
  (function dispatchActions(dispatch) {
    dispatch(fetchSubscriptionEntries(accountId, botId));
  } (context.store.dispatch));
  return (
        <ViewSubscriptionPage botId={botId} accountId={accountId}/>
  );
}
