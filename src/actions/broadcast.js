import apiActionFactory from './factory/apiActionFactory';
import apiData from '../utils/apiData';
import {
    BOT_BROADCAST_ENTRIES_FAILED,
    BOT_BROADCAST_ENTRIES_FETCHING,
    BOT_BROADCAST_ENTRIES_FETCHED,
    BOT_BROADCAST_ENTRY_SAVE_COMPLETED,
    BOT_BROADCAST_ENTRY_SAVE_STARTING,
    BOT_BROADCAST_ENTRY_SAVE_FAILED,
    BOT_BROADCAST_ENTRY_DELETE_STARTING,
    BOT_BROADCAST_ENTRY_DELETE_COMPLETED,
    BOT_BROADCAST_ENTRY_DELETE_FAILED,
    BOT_BROADCAST_ENTRY_CREATE,
    BOT_BROADCAST_ENTRY_FORM_FLAG,
    BOT_BROADCAST_ENTRY_EDIT,
    BOT_FLOW_EXISTING_NODES_FAILED,
    BOT_FLOW_EXISTING_NODES_COMPLETED,
    BOT_FLOW_EXISTING_NODES_STARTING,
    BOT_BROADCAST_VAL_CHANGE,
    BOT_SUBSCRIPTION_ENTRIES_FETCHING,
    BOT_SUBSCRIPTION_ENTRIES_FETCHED,
    BOT_SUBSCRIPTION_ENTRIES_FAILED,
    BOT_BROADCAST_ENTRY_GET_STARTING,
    BOT_BROADCAST_ENTRY_GET_COMPLETED,
    BOT_BROADCAST_ENTRY_GET_FAILED,
    WEB_UPDATES_STARTING,
    WEB_UPDATES_COMPLETED,
    WEB_UPDATES_FAILED,
    SET_BOT_BROADCAST_VALIDATION_TEXT
} from '../constants/actionTypes';

import moment from 'moment';
import { setErrorNotification, setSuccessNotification } from './notification';
import {
    BROAD_CREATED_SUCCESSFULLY,
    BROAD_DELETED_SUCCESSFULLY,
    BROAD_ERROR_MESSAGE,
    ERROR_MESSAGE,
    POLL_BROADCAST_DATA_FETCH_FAILED
} from '../noticationMessages/messages';
import { redirect } from './route';
import { dateDisplayFormatType } from '../config'
import {displayLocalDate} from '../utils/displayDate';

export function fetchSubscriptionEntries(accountId, botId) {
  const fetchSubscriptionEntries = apiActionFactory({
    fetchingActionType: BOT_SUBSCRIPTION_ENTRIES_FETCHING,
    fetchedActionType: BOT_SUBSCRIPTION_ENTRIES_FETCHED,
    fetchFailedActionType: BOT_SUBSCRIPTION_ENTRIES_FAILED,
    fetchApi: `/api/subscription_broadcast/accounts/${accountId}/bots/${botId}`,
    actionMeta: {
      accountId
    },
    transform: ({ subscriptionEntries }) => ({
      subscriptionEntries
    }),

  });
  return fetchSubscriptionEntries.fetchThunk;
}

export function fetchBotBroadcastEntries(accountId, botId) {
  const fetchBotBroadcastEntries = apiActionFactory({
    fetchingActionType: BOT_BROADCAST_ENTRIES_FETCHING,
    fetchedActionType: BOT_BROADCAST_ENTRIES_FETCHED,
    fetchFailedActionType: BOT_BROADCAST_ENTRIES_FAILED,
    fetchApi: `/api/broadcast/accounts/${accountId}/bots/${botId}`,
    actionMeta: {
      accountId
    },
    transform: ({ broadcastEntries, allowedPermissions }) => ({
      broadcastPerms: allowedPermissions,
      broadcastEntries: broadcastEntries.map(be => ({
        _id: be._id,
        botId: be.botId,
        name: be.name,
        datetime: (be.date && be.time)? be.date + '  ' + displayLocalDate(moment(be.time, 'HH:mm'), dateDisplayFormatType.TIME_12HR) : null,
        description: be.description,
        repeat: be.repeat,
        type: be.type,
        timeZone: be.timeZone,
        jobType: be.jobType,
        date: be.date? moment(be.date, dateDisplayFormatType.DATE).toDate(): null,
        time: be.time? moment(be.time, dateDisplayFormatType.TIME_12HR).toDate(): null,
        nodes: be.nodes,
        allows: allowedPermissions,
        pollId: be.pollId
      }))
    })

  });
  return fetchBotBroadcastEntries.fetchThunk;
}
export function fetchExistingFlowNodes(botId, accountId) {
  const fetchExistingFlowNodes = apiActionFactory({
    fetchingActionType: BOT_FLOW_EXISTING_NODES_STARTING,
    fetchedActionType: BOT_FLOW_EXISTING_NODES_COMPLETED,
    fetchFailedActionType: BOT_FLOW_EXISTING_NODES_FAILED,
    fetchApi: `/api/broadcast/existingflownodes/accounts/${accountId}/bots/${botId}`,
    actionMeta: {
      botId
    },
    transform: ({ existingFlowNodes }) => ({
      existingFlowNodes
    }),
  });
  return fetchExistingFlowNodes.fetchThunk;
}
export function saveBroadcastEntry(botId, nodeData, accountId) {
  return (dispatch, getState) => {
    const state = getState();
        //state.broadcast.broadcastEntryData.botId = botId;
    state.broadcast.broadcastEntryData.nodes = nodeData;
    const broadcastEntry = state.broadcast.broadcastEntryData;
    broadcastEntry.date = moment(broadcastEntry.date).format(dateDisplayFormatType.DATE);
    broadcastEntry.time = moment(broadcastEntry.time).format(dateDisplayFormatType.TIME_24HR);
    if (broadcastEntry.jobType !== 'poll-broadcast') {
      delete broadcastEntry.pollId;
      delete broadcastEntry.targetOnlyFinishedUsers;
    }
    if (broadcastEntry.type === 'automatic') {
      broadcastEntry.date = null;
      broadcastEntry.time = null;
    }
    dispatch(saveBroadcastEntryStarting(botId));
    apiData({
      api: `/api/broadcast/accounts/${accountId}/bots/${botId}`,
      method: 'post',
      body: {
        broadcastEntry: broadcastEntry
      },
    }, dispatch).then(resp => {
      if (resp.status === 200) {
        dispatch(saveBroadcastEntryCompleted(botId));
        dispatch(fetchBotBroadcastEntries(accountId, botId));
        if (location.pathname.indexOf('/accounts/'+ accountId +'/bots/'+ botId +'/polls') === -1) {
        //if (broadcastEntry.jobType !== 'poll-broadcast') {
          dispatch(redirect(`/accounts/${accountId}/bots/${botId}/broadcast`));
        }
        else {
          dispatch(redirect(`/accounts/${accountId}/bots/${botId}/polls`));
        }
        dispatch(setSuccessNotification(BROAD_CREATED_SUCCESSFULLY));
      }
    }).catch(err => {
      dispatch(saveBroadcastEntryFailed(botId));
      dispatch(setErrorNotification(BROAD_ERROR_MESSAGE));
    });
  };
}

export function getBroadcastEntry(botId, accountId, broadcastId) {
  const getBroadcastEntry = apiActionFactory({
    fetchingActionType: BOT_BROADCAST_ENTRY_GET_STARTING,
    fetchedActionType: BOT_BROADCAST_ENTRY_GET_COMPLETED,
    fetchFailedActionType: BOT_BROADCAST_ENTRY_GET_FAILED,
    fetchApi: `/api/broadcast/accounts/${accountId}/bots/${botId}/${broadcastId}`,
    actionMeta: {
      broadcastId
    },
    transform: ({ updatedBroadcastEntry }) => ({
      updatedBroadcastEntry
    })

  });
  return getBroadcastEntry.fetchThunk;
}

export function getPollBroadcast(botId, pollId) {
  return async (dispatch, getState) => {
    const resp = await apiData({
      api: `/api/bots/${botId}/polls/${pollId}/pollBroadcast`,
      method: 'get',
    });
    const pollBroadcast = (await resp.json()).pollBroadcasts;
    if (pollBroadcast) {
      dispatch(setPollBroadcastEntry(pollBroadcast));
    } else {
      dispatch(createBroadcastEntry(botId, 'poll-broadcast', pollId, '', 'scheduled'));
    }
    //dispatch(setErrorNotification(POLL_BROADCAST_DATA_FETCH_FAILED));
  }
}

export function deleteBroadcastEntry(botId, accountId, broadcastId) {
  return (dispatch) => {
    dispatch(deleteBroadcastEntryStarting(botId))
    apiData({
      api: `/api/broadcast/accounts/${accountId}/bots/${botId}/${broadcastId}`,
      method: 'delete',
    }, dispatch).then(resp => {
      if (resp.status === 200) {
        dispatch(deleteBroadcastEntryCompleted(botId));
        dispatch(fetchBotBroadcastEntries(accountId, botId));
        dispatch(setSuccessNotification(BROAD_DELETED_SUCCESSFULLY));
      }
    }).catch(err => {
      dispatch(deleteBroadcastEntryFailed(botId));
      dispatch(setErrorNotification(ERROR_MESSAGE));
    });
  };
}

export function fetchWebUpdates(accountId, botId) {

  const fetchWebUpdates = apiActionFactory({
    fetchingActionType: WEB_UPDATES_STARTING,
    fetchedActionType: WEB_UPDATES_COMPLETED,
    fetchFailedActionType: WEB_UPDATES_FAILED,
    fetchApi: `/api/accounts/${accountId}/bots/${botId}/webupdates`,
    actionMeta: {
      accountId
    },
    transform: ({ allWebUpdates }) => ({
      allWebUpdates
    }),
  });
  return fetchWebUpdates.fetchThunk;
}

export const saveBroadcastEntryStarting = (payload) => ({
  type: BOT_BROADCAST_ENTRY_SAVE_STARTING,
  payload
});
export const saveBroadcastEntryCompleted = (payload) => ({
  type: BOT_BROADCAST_ENTRY_SAVE_COMPLETED,
  payload
});
export const saveBroadcastEntryFailed = (payload) => ({
  type: BOT_BROADCAST_ENTRY_SAVE_FAILED,
  payload
});
export const deleteBroadcastEntryStarting = (payload) => ({
  type: BOT_BROADCAST_ENTRY_DELETE_STARTING,
  payload
});
export const deleteBroadcastEntryCompleted = (payload) => ({
  type: BOT_BROADCAST_ENTRY_DELETE_COMPLETED,
  payload
});
export const deleteBroadcastEntryFailed = (payload) => ({
  type: BOT_BROADCAST_ENTRY_DELETE_FAILED,
  payload
});
export const changeBroadcastEntryFormFlag = (payload) => ({
  type: BOT_BROADCAST_ENTRY_FORM_FLAG,
  payload
});
export const createBroadcastEntry = (botId, jobType, pollId, pollName, type, broadcastDate) => ({
  type: BOT_BROADCAST_ENTRY_CREATE,
  payload: {
    botId,
    jobType,
    pollId,
    pollName,
    type,
    broadcastDate
  }
});
export const editBroadcastEntry = (payload) => ({
  type: BOT_BROADCAST_ENTRY_EDIT,
  payload
});

export const broadcastValueChange = (payload) => ({
  type: BOT_BROADCAST_VAL_CHANGE,
  payload
});

export function setWebUpdatesValidationText(webUpdatesValidationText) {
  return {
    type: SET_BOT_BROADCAST_VALIDATION_TEXT,
    payload: {
      webUpdatesValidationText
    }
  };
}

export function setPollBroadcastEntry(updatedBroadcastEntry) {
  return {
    type: BOT_BROADCAST_ENTRY_GET_COMPLETED,
    payload: {
      updatedBroadcastEntry
    }
  };
}