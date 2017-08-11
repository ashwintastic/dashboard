import {
  FETCHING_BOT_POLLS,
  FETCHED_BOT_POLLS,
  FETCH_BOT_POLLS_FAILED,
  SET_POLL_NAME,
  SET_NEW_POLL,
  POLL_SET_CURRENT_BOT_ID,
  POLL_ADD_QUESTION,
  SET_POLL_DATA,
  SET_LANGUAGES_LIST,
  SET_POLL_BROADCAST_DATA,
  EDIT_POLL_BROADCAST_FLAG,
  SET_ACTIVE_POLL_PAGINATION_DETAILS,
  SET_INACTIVE_POLL_PAGINATION_DETAILS,
  SET_CLOSED_POLL_PAGINATION_DETAILS,
  SET_PENDING_POLL_PAGINATION_DETAILS,
  CLEAR_POLL_ENTRIES
} from '../constants/actionTypes';

import {
ACTIVE_POLL,
INACTIVE_POLL,
CLOSED_POLL,
PENDING_POLL,
} from '../pages/pollTypes/pollType'

import apiActionFactory from './factory/apiActionFactory';
import apiData from '../utils/apiData';
import { setNotification } from './notification';
import { createBroadcastEntry } from './broadcast';
import { notificationConfig } from '../config';
import { redirect } from './route';
import { setErrorNotification, setSuccessNotification } from './notification';
import {
  LANGUAGE_LIST_FETCH_FAILED,
  POLL_BROADCAST_DATA_FETCH_FAILED,
} from '../noticationMessages/messages'

import { authenticationError } from '../constants/apiResponseType';

var moment = require('moment');

export function setActicePollPaginationDetails(page, size){
  return {
    type: SET_ACTIVE_POLL_PAGINATION_DETAILS,
    payload: {
      activePoll:{
        page,
        size,
      }
    },
  };
}

export function setInActicePollPaginationDetails(page, size){
  return {
    type: SET_INACTIVE_POLL_PAGINATION_DETAILS,
    payload: {
      inactivePoll:{
        page,
        size,
      }
    },
  };
}

export function setPendingPollPaginationDetails(page, size){
  return {
    type: SET_PENDING_POLL_PAGINATION_DETAILS,
    payload: {
      pendingPoll:{
        page,
        size,
      }
    },
  };
}


export function setClosedPollPaginationDetails(page, size){
  return {
    type:  SET_CLOSED_POLL_PAGINATION_DETAILS,
    payload: {
      closedPoll:{
        page,
        size,
      }
    },
  };
}

export function clearPollsEntries(){
  return {
    type: CLEAR_POLL_ENTRIES,
    payload: {
      botPolls: {}
    }
  }
}

export function fetchPollsEntries(accountId, botId, paging, pollType) {
  let page = 0;
  let size =0;
  if (paging){
    page = paging.page;
    size = paging.size;
  }
  const fetchPollsEntries = apiActionFactory({
    fetchingActionType: FETCHING_BOT_POLLS,
    fetchedActionType: FETCHED_BOT_POLLS,
    fetchFailedActionType: FETCH_BOT_POLLS_FAILED,
    fetchApi: `/api/accounts/${accountId}/bots/${botId}/pollList/?page=${page}&size=${size}&type=${pollType}`,
    actionMeta: {
      accountId,
      botId,
    },
    transform: ({activePolls, inActivePolls, closedPolls, pendingPolls, }) => ({
      activePolls: activePolls,
      inActivePolls: inActivePolls,
      closedPolls: closedPolls,
      pendingPolls: pendingPolls,
    }),
  });

  return fetchPollsEntries.fetchThunk;
}

/**
 *
 * @param getState
 * @param pollType
 * @returns {*}
 * fetching page and size details from store when user deletes a poll
 */
function getPagingDeatils(getState, pollType){
  switch(pollType){
    case ACTIVE_POLL:{
      return getState().pagination.activePoll;
    }
    case PENDING_POLL:{
      return getState().pagination.pendingPoll;
    }
    case INACTIVE_POLL:{
      return getState().pagination.inactivePoll;
    }
    case CLOSED_POLL:{
      return getState().pagination.closedPoll;
    }
  }
}

export function deletePollEntry(botId, pollId, pollType) {
  return (dispatch, getState) => {
    let paging = getPagingDeatils(getState, pollType);
    const accountId = getState().manageAccount.currentAccountId;
    apiData({
      api: `/api/bots/${botId}/pollList/${pollId}`,
      method: 'delete',
    }, dispatch).then(resp => {
      if (resp.status === 200) {
        let notification = notificationConfig.success;
        notification.label = "Deleted poll";
        dispatch(setNotification(notification, "success"));
        dispatch(fetchPollsEntries(accountId, botId, paging, pollType));
      }
      else {
        let notification = notificationConfig.error;
        notification.label = 'failed to delete poll';
        dispatch(setNotification(notification, "error"));
      }
    });
  };
}

export function setPollStatusClosed(pollId, pollType) {
  return (dispatch, getState) => {
    const currentState = getState();
    let paging = getPagingDeatils(getState, pollType);
    const botId = currentState.botFlows.botId;
    const accountId = currentState.manageAccount.currentAccountId;
    apiData({
      api: `/api/bots/${botId}/pollList/${pollId}/close`,
      method: 'post',
      body: {
      },
    }, dispatch).then(resp => {
      if (resp.status === 200) {
        let notification = notificationConfig.success;
        notification.label = "Poll has been closed";
        dispatch(setNotification(notification, "success"));
        if(res.status != authenticationError.status) {
            dispatch(fetchPollsEntries(accountId, botId, paging, pollType));
        }
      }
    });
  };
}

export function setPollStatusOpen(pollId, pollType) {
  return (dispatch, getState) => {
    const currentState = getState();
    let paging = getPagingDeatils(getState, pollType);
    const botId = currentState.botFlows.botId;
    const accountId = currentState.manageAccount.currentAccountId;
    apiData({
      api: `/api/bots/${botId}/pollList/${pollId}/open`,
      method: 'post',
      body: {
      },
    }, dispatch).then(resp => {
      if (resp.status === 200) {
        let notification = notificationConfig.success;
        notification.label = "Poll has been activated";
        dispatch(setNotification(notification, "success"));
        dispatch(fetchPollsEntries(accountId, botId, paging, pollType));
      }
    });
  };
}

export function setPollStatusInactive(pollId, pollType) {
  return (dispatch, getState) => {
    const currentState = getState();
    let paging = getPagingDeatils(getState, pollType);
    const botId = currentState.botFlows.botId;
    const accountId = currentState.manageAccount.currentAccountId;
    apiData({
      api: `/api/bots/${botId}/pollList/${pollId}/inactive`,
      method: 'post',
      body: {
      },
    }, dispatch).then(resp => {
      if (resp.status === 200) {
        let notification = notificationConfig.success;
        notification.label = "Poll has been deactivated";
        dispatch(setNotification(notification, "success"));
        dispatch(fetchPollsEntries(accountId, botId, paging, pollType));
      }
    });
  };
}

export function setPollDate(poll) {
  // this will be utc date (technically local date misrepresented as utc date with offset subtraction)
  poll.startDate = moment(poll.startDate).format('YYYY-MM-DD');
  poll.startTime = moment(poll.startTime).format('hh:mm A');
  poll.endDate = moment(poll.endDate).format('YYYY-MM-DD');
  poll.endTime = moment(poll.endTime).format('hh:mm A');
}

export function createPoll(poll) {
  return async (dispatch, getState) => {
    const currentState = getState();
    const accountId = currentState.manageAccount.currentAccountId;
    const botId = currentState.botFlows.botId;
    setPollDate(poll);

    const resp = await apiData({
      api: `/api/bots/${botId}/createPoll`,
      method: 'post',
      body: {
        poll,
      },
    }, dispatch);
    if (resp.status === 200) {
      let notification = notificationConfig.success;
      notification.label = "Poll has been created";
      dispatch(setNotification(notification, "success"));
      dispatch(fetchPollsEntries(accountId, botId));
      dispatch(redirect(`/accounts/${accountId}/bots/${botId}/polls`));
    }
    else {
      let notification = notificationConfig.error;
      notification.label = "Poll creation failed";
      dispatch(setNotification(notification, "error"));
      if(res.status != authenticationError.status) {
        dispatch(fetchPollsEntries(accountId, botId));
      }
    }
  };
}

export function savePoll(poll) {
  return async (dispatch, getState) => {
    const currentState = getState();
    const accountId = currentState.manageAccount.currentAccountId;
    const botId = currentState.botFlows.botId;
    const editBroadcastFlag = currentState.botPolls.editBroadcastFlag;
	setPollDate(poll);
    const resp = await apiData({
      api: `/api/bots/${botId}/polls/${poll.id}/save`,
      method: 'post',
      body: {
        poll,
      },
    }, dispatch);
    if (resp.status === 200) {
      let notification = notificationConfig.success;
      notification.label = "Poll has been saved";
      dispatch(setNotification(notification, "success"));
      dispatch(fetchPollsEntries(accountId, botId));
      if (editBroadcastFlag && poll.wrapupBroadcastId) {
        dispatch(redirect(`/accounts/${accountId}/bots/${botId}/polls/${poll.id}/broadcast`));
        //dispatch(redirect(`/accounts/${accountId}/bots/${botId}/pollbroadcast/upsert/${poll.wrapupBroadcastId}`));
      }
      else {
        dispatch(redirect(`/accounts/${accountId}/bots/${botId}/polls`));
      }
    }
    else {
      let notification = notificationConfig.error;
      notification.label = "Poll saving failed";
      dispatch(setNotification(notification, "error"));
      if(res.status != authenticationError.status) {
        dispatch(fetchPollsEntries(accountId, botId));
      }
    }
  };
}

export function getPoll(botId, pollId) {
  return (dispatch, getState) => {
    const accountId = getState().manageAccount.currentAccountId;
    apiData({
      api: `/api/bots/${botId}/polls/${pollId}`,
      method: 'get',
    }, dispatch).then(resp => {
      if (resp.status === 200) {
        resp.json().then(r => {
          r.poll.startTime = new Date(r.poll.startDate);
          r.poll.endTime = new Date(r.poll.endDate);
          dispatch(setPollData(r.poll));
        });
      }
      else {
        let notification = notificationConfig.error;
        notification.label = 'failed to get poll';
        dispatch(setNotification(notification, "error"));
      }
    });
  };
}

export function pollValueChange(pollName) {
  return {
    type: SET_POLL_NAME,
    payload: {
      pollName
    },
  };
}

export function editPollBroadcastFlag(editBroadcastFlag) {
  return {
    type: EDIT_POLL_BROADCAST_FLAG,
    payload: {
      editBroadcastFlag
    },
  };
}

export function initNewPoll(newPoll) {
  return {
    type: SET_NEW_POLL,
    payload: {
      newPoll
    },
  };
}

export function addNewQuestion(pollName, question) {
  return {
    type: POLL_ADD_QUESTION,
    meta: {
      pollName
    },
    payload: {
      question
    },
  };
}

export function setPollData(pollData) {
  return {
    type: SET_POLL_DATA,
    payload: {
      pollData
    },
  };
}

export function getLanguagesList() {
  return (dispatch, getState) => {
    const accountId = getState().manageAccount.currentAccountId;
    apiData({
      api: `/api/languagesList`,
      method: 'get',
    }, dispatch).then(resp => {
      if (resp.status === 200) {
        resp.json().then(r => {
          dispatch(setLanguagesList(r.languagesList));
        });
      }
      else {
        dispatch(setErrorNotification(LANGUAGE_LIST_FETCH_FAILED));
      }
    });
  };
}

function setLanguagesList(list) {
  return {
    type: SET_LANGUAGES_LIST,
    payload: {
      list
    },
  };
}

export function getWrapupBroadcast(pollId) {
  return (dispatch, getState) => {
    apiData({
      api: `/api/poll/${pollId}/broadcastData`,
      method: 'get',
    }, dispatch).then(resp => {
      if (resp.status === 200) {
        resp.json().then(r => {
          dispatch(setPollBroadcastData(r.pollBroadcastData));
        });
      }
      else {
        dispatch(setErrorNotification(POLL_BROADCAST_DATA_FETCH_FAILED));
      }
    });
  };
}

function setPollBroadcastData(pollBroadcastData) {
  return {
    type: SET_POLL_BROADCAST_DATA,
    payload: {
      pollBroadcastData
    },
  };
}

export function addPollBroadcast(pollId, pollName, pollEndDate) {
  return async (dispatch, getState) => {
    const currentState = getState();
    const botId = currentState.botFlows.botId;
    const accountId = currentState.manageAccount.currentAccountId;
    /*const resp = await apiData({
      api: `/api/bots/${botId}/polls/${pollId}/pollBroadcast`,
      method: 'get',
    }, dispatch);
    const pollBroadcasts = (await resp.json()).pollBroadcasts;
    if (pollBroadcasts) {
      dispatch(redirect(`/accounts/${accountId}/bots/${botId}/pollbroadcast/upsert/${pollBroadcasts._id}`));
    }
    else {
      dispatch(createBroadcastEntry(botId, 'poll-broadcast', pollId, pollName, 'scheduled', pollEndDate));
      dispatch(redirect(`/accounts/${accountId}/bots/${botId}/pollbroadcast/upsert`));
    }*/
    dispatch(redirect(`/accounts/${accountId}/bots/${botId}/polls/${pollId}/broadcast`));
  }
}
