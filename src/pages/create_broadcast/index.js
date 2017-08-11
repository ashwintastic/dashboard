import React from 'react';
import { connect } from 'react-redux';
import CreateBroadcast from './CreateBroadcast';
import {
  fetchBotBroadcastEntries,
  fetchSubscriptionEntries,
  saveBroadcastEntry,
  getBroadcastEntry,
  fetchExistingFlowNodes,
  broadcastValueChange,
  fetchWebUpdates,
  setWebUpdatesValidationText,
  getPollBroadcast,
  createBroadcastEntry
} from '../../actions/broadcast';
import {
  setErrorText,
  setPastDateErrorText
} from '../../actions/manageAccount';
import { refreshUserDetails } from '../../actions/auth';
import { setCreateDialog, loadSchemaRefs } from '../../actions/flow';
import { getPoll } from '../../actions/poll';
import moment from 'moment-timezone';
import { redirect } from '../../actions/route';
import pollSumamryNode from 'botworx-schema/flow/defaultPollSummary.json';
import _ from 'lodash';
const currentUTCDateTime = new Date(moment.utc().format('YYYY-MM-DD HH:mm:ss'));

const broadcastEntrySchema = {
  title: 'Broadcast Nodes',
  type: 'array',
  items: {
    title: 'Node',
    oneOf: [
      {
        type: 'string',
        title: 'Existing Node',
        enum: []
      },
      {
        'title': 'Custom Node',
        '$ref': 'broadcastNode.json'
      }
    ]
  }
};

const pollBroadcastEntrySchema = {
  title: 'Broadcast Nodes',
  type: 'array',
  items: {
    title: 'Node',
    oneOf: [
      {
        type: 'string',
        title: 'Existing Node',
        enum: []
      },
      {
        'title': 'Poll Summary Node',
        'type': 'object',
        'required': ['viewcount'],
        'properties': {
          'viewcount': {
            'title': 'View Count',
            'type': 'boolean',
            'default': true
          }
        }
      },
      {
        'title': 'Custom Node',
        '$ref': 'broadcastNode.json'
      }
    ]
  }
};

const broadcastEntryUISchema = {
  nodes: {
    'ui:options': {
      'orderable': false
    }
  },
  'createnodes': {
    'items': {
      'ui:widget': 'textarea'
    }
  }
};
const mapStateToProps = (state) => {

  const isPollBroadcast = (state.broadcast.broadcastEntryData.jobType === "poll-broadcast");
  let broadcastName = state.broadcast.broadcastEntryData.name;
  let broadcastDate = state.broadcast.broadcastEntryData.date;
  let minBroadcastDate = null;
  let pollName = '';
  let pollEndDate = null;
  if (isPollBroadcast && state.botPolls.currentPoll) {
    pollEndDate = new Date(moment.utc(state.botPolls.currentPoll.endDate).format('YYYY-MM-DD HH:mm:ss'));
    broadcastDate = (broadcastDate) ?  broadcastDate : null;
    minBroadcastDate = pollEndDate;
    broadcastName = (broadcastName) ? broadcastName : null;
    pollName = state.botPolls.currentPoll.name;
  }
  if (!isPollBroadcast) {
    broadcastDate = (broadcastDate) ?  broadcastDate : null;
  }
  return {
    broadcastName: broadcastName,
    broadcastEntries: state.broadcast.broadcastEntries,
    subscriptionEntries: state.broadcast.subscriptionEntries,
    broadcastEntryData: state.broadcast.broadcastEntryData,
    existingFlowNodes: state.broadcast.existingFlowNodes,
    errorText: state.manageAccount.errorText,
    pastDateError: state.manageAccount.pastDateError,
    dialogstate: state.botFlows.createBotFlag,
    schemaRefs: state.botFlows.schemaRefs,
    webUpdates: state.broadcast.webUpdates,
    webUpdatesValidationText: state.broadcast.webUpdatesValidationText || '',
    broadcastDate: broadcastDate,
    minBroadcastDate: minBroadcastDate,
    allAccounts: state.accounts.list,
    pollName,
    isPollBroadcast,
    pollEndDate
  };
};

const mapDispatch = (dispatch) => ({
  onSaveBroadcastEntry: (botId, broadcastEntryData, nodeData, accountId, minBroadcastDate, timezoneOffset, isPollBroadcast, broadcastDateTZ) => {
    if (nodeData.length === 0) {
      dispatch(setErrorText('Broadcast nodes are mandatory.'));
      return;
    }
    else {
      var date = moment(broadcastEntryData.date).format('YYYY-MM-DD');
      var time = moment(broadcastEntryData.time).format('HH:mm');

      var broadcastTime = moment(date + '-' + time, 'YYYY-MM-DD-HH:mm').format();
      let diff = moment(moment(minBroadcastDate).format('YYYY-MM-DD HH:mm:ss')).diff(broadcastTime, 'minutes');
      const broadcastType = broadcastEntryData.type;
      if (broadcastType === 'scheduled') {
        if (broadcastEntryData.jobType === "poll-broadcast") {
          if (diff > 0) {
            dispatch(setErrorText(''));
            dispatch(setPastDateErrorText(''));
            dispatch(setCreateDialog(true));
            return;
          }
        } else {
          if (broadcastEntryData.repeat === 'None') {
            if (diff > 10) {
              // We need to give a buffer of 10 minutes in the past. User can enter date and may take time to fill the form.
              dispatch(setPastDateErrorText('One time Broadcast can\'t be scheduled in past. Please select valid date and time.'));
              return;
            }
          } else if (broadcastEntryData.repeat !== 'None') {
            if (diff > 10) {
              dispatch(setErrorText(''));
              dispatch(setPastDateErrorText(''));
              dispatch(setCreateDialog(true));
              return;
            }
          }
        }
      }
      if (broadcastType === 'automatic') {
        if (broadcastEntryData.webupdateContentId === '' || !broadcastEntryData.webupdateContentId) {
          dispatch(setWebUpdatesValidationText("Select a Web Update."));
          return;
        } else {
          dispatch(setWebUpdatesValidationText(""));
        }
      }
      nodeData = nodeData.map(x => {
        if (x && x.hasOwnProperty('viewcount')) {
          pollSumamryNode.messages[0].data.dynamic.params.id = broadcastEntryData.pollId;
          pollSumamryNode.messages[0].data.value.actions[1].url = `https://partner.botworx.ai/poll_summary?pollid=${broadcastEntryData.pollId}&viewcount=${x.viewcount}`;
          pollSumamryNode.viewcount = x.viewcount;
          x = _.assignIn({}, pollSumamryNode);
        }
          return x;
      })
      dispatch(saveBroadcastEntry(botId, nodeData, accountId))

    }

  },
  onYesClick: (botId, nodeData, accountId) => {
    dispatch(setCreateDialog(false));
    if (nodeData.length === 0) {
      dispatch(setErrorText('Broadcast nodes are mandatory.'));
    }
    else {
      dispatch(saveBroadcastEntry(botId, nodeData, accountId))
    }
  },
  onCancelBroadcastClick: (accountId, botId, jobType) => {
    //if (jobType === "poll-broadcast") {
    if (location.pathname.indexOf('/accounts/'+ accountId +'/bots/'+ botId +'/polls') !== -1) {
      dispatch(redirect(`/accounts/${accountId}/bots/${botId}/polls`));
    } else {
      dispatch(redirect(`/accounts/${accountId}/bots/${botId}/broadcast`))
    }
  },
  onCloseDialog: () => dispatch(setCreateDialog(false)),
  onBroadcastValueChange: (obj) => {
    dispatch(broadcastValueChange(obj));
  }
});

const CreateBroadcastPage = connect(mapStateToProps, mapDispatch)(CreateBroadcast);

export default function ({ params, context }) {
  const botId = params.botId;
  const accountId = params.accountId;
  const broadcastId = params.broadcastId || '';
  const pollId = params.pollId;

  (function dispatchActions(dispatch) {
    dispatch(refreshUserDetails());
    dispatch(loadSchemaRefs());
    dispatch(fetchExistingFlowNodes(botId, accountId));
    dispatch(fetchBotBroadcastEntries(accountId, botId));
    dispatch(fetchSubscriptionEntries(accountId, botId));
    dispatch(fetchWebUpdates(accountId, botId));
    if (pollId) {
      dispatch(getPoll(botId, pollId));
      dispatch(getPollBroadcast(botId, pollId));
    }
    if (broadcastId) {
      dispatch(getBroadcastEntry(botId, accountId, broadcastId));
    } else {
      dispatch(createBroadcastEntry(botId, 'broadcast', '', '', '', currentUTCDateTime));
    }
  }(context.store.dispatch));
  return (
    <CreateBroadcastPage botId={botId} broadcastEntrySchema={broadcastEntrySchema} pollBroadcastEntrySchema={pollBroadcastEntrySchema} broadcastEntryUISchema={broadcastEntryUISchema} accountId={accountId} />
  );
}
