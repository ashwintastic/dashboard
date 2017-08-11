import {
  BOT_SET_SHOW_TESTLINK,
  SET_BOT_TESTLINK,
  SET_BOT_TESTERIDS,
  BOTFLOW_FETCHING_TESTLINKS,
  BOTFLOW_FETCHED_TESTLINKS,
  BOTFLOW_FETCH_TESTLINKS_FAILED,
  SET_BOT_TESTLINK_EMAIL_SENT,
  TESTLINK_POST_DEACTIVATE,
  TESTLINK_DELETE_USER,
  SET_USER_TYPING,
  SET_PLATFORM_BOT,
  BOTFLOW_FETCH_FLOW_DATA_FAILED,
  BOTFLOW_FETCHING_FLOW_DATA,
  BOTFLOW_FETCHED_FLOW_DATA,
  SET_TESTERS_VALIDATION_TEXT
} from '../constants/actionTypes';
import { setNotification } from './notification';

import { fetchBotList } from './accountBots';
import { fetchLinkedPages } from './flow';
import apiActionFactory from './factory/apiActionFactory';
import apiData from '../utils/apiData';
import { botEngine, notificationConfig } from '../config';


const moment = require("moment");

export function fetchTestLinks(flowId, botId) {
  const fetchTestLinks = apiActionFactory({
    fetchingActionType: BOTFLOW_FETCHING_TESTLINKS,
    fetchedActionType: BOTFLOW_FETCHED_TESTLINKS,
    fetchFailedActionType: BOTFLOW_FETCH_TESTLINKS_FAILED,
    fetchApi: `/api/flow/${flowId}/testlinks`,
    actionMeta: {
      flowId,
      botId
    },
    transform: ({ testLinks }) => ({
      testLinks: testLinks.map(f => ({
        id: f._id, flowId: f.flowId,
        testerEmail: f.testerEmail, expiry: moment(new Date(f.expiry)).format('YYYY-MM-DD, HH:mm:ss Z'),
        status: getTestLinkStatus(f),
        platformBotId: f.platformBotId,
        url: f.url
      })),
    }),
  });

  return fetchTestLinks.fetchThunk;
}

export function getTestLinkStatus(testlinkObj) {
  if (new Date(testlinkObj.expiry) < Date.now() && testlinkObj.status === "inactive") {
    return "expired";
  }
  return testlinkObj.status;
}

export function testLinkFlow(botId, currentFlowId, testerIds, platformBotId) {
  return (dispatch) => {
    apiData({
        api: `/api/createTestLink`,
        method: 'post',
        body: {
          botId: botId,
          flowId: currentFlowId,
          platformBotId: platformBotId,
          testerIds: testerIds.trim().split(/\s*,\s*/) // trim the whitespaces first, then split
        }
      }, dispatch).then(resp => {
      if (resp.status === 200) {
        dispatch(setTestLinkEmailSent(true));
        dispatch(fetchTestLinks(currentFlowId, botId));
        dispatch(fetchLinkedPages(botId));
      } else {
        console.log('Some Problem!');
      }
    }).catch(err => { console.log("ERROR!"); });
  };
}

export function deactivateTestLink(testlinkId, status, flowId, botId) {
  return (dispatch) => {
    apiData({
      api: `/api/testlink/${testlinkId}/status/${status}`,
      method: 'put',
    }, dispatch).then(resp => {
      if (resp.status === 200) {
        //resp.json().then(r => {
        dispatch(fetchTestLinks(flowId, botId));
        dispatch(fetchLinkedPages(botId));
        //});
      }
    });
  };
}

export function deleteTester(testerId, botId, flowId) {
  return (dispatch) => {
    apiData({
      api: `/api/flow/${flowId}/testlink/deletetester/${testerId}`,
      method: 'delete'
    }, dispatch).then(resp => {
      if (resp.status === 200) {
        dispatch(fetchTestLinks(flowId, botId));
        dispatch(fetchLinkedPages(botId));
        let notification = notificationConfig.success;
        notification.label = "Tester deleted.";
        dispatch(setNotification(notification, "success"));
      }
    });
  };
}

export function setShowTestLink(dialogstate) {
  return {
    type: BOT_SET_SHOW_TESTLINK,
    payload: {
      dialogstate,
    },
  };
}

export function setTestLink(testLink) {
  return {
    type: SET_BOT_TESTLINK,
    payload: {
      testLink,
    },
  };
}

export function setTestLinkEmailSent(isEmailSent) {
  return {
    type: SET_BOT_TESTLINK_EMAIL_SENT,
    payload: {
      isEmailSent,
    },
  };
}

export function setTesterIds(testerIds) {
  return {
    type: SET_BOT_TESTERIDS,
    payload: {
      testerIds,
    },
  };
}

export function setTestLinkObj(testLink) {
  return {
    type: TESTLINK_POST_DEACTIVATE,
    payload: {
      testLink,
    },
  };
}

export function setSelectedTester(selTester) {
  return {
    type: TESTLINK_DELETE_USER,
    payload: {
      selTester,
    },
  };
}

export function setSelectedPlatformBot(selPlatformBot) {
  return {
    type: SET_PLATFORM_BOT,
    payload: {
      selPlatformBot,
    },
  };
}

export function setUserEntry(userTyping) {
    return {
        type: SET_USER_TYPING,
        payload: {
            userTyping
        },
    };
}

export function fetchFlowData(accountId, botId, flowId) {
  const fetchFlowDataActions = apiActionFactory({
    fetchingActionType: BOTFLOW_FETCHING_FLOW_DATA,
    fetchedActionType: BOTFLOW_FETCHED_FLOW_DATA,
    fetchFailedActionType: BOTFLOW_FETCH_FLOW_DATA_FAILED,
    fetchApi: `/api/flow/account/${accountId}/bot/${botId}/flow/${flowId}`,
    actionMeta: {
      accountId,
      botId,
      flowId
    },
    transform: ({ flow }) => ({
      flow: { ...flow }
    }),
  });

  return fetchFlowDataActions.fetchThunk;
}

export function setTestersValidationText(testersValidationText) {
  return {
        type: SET_TESTERS_VALIDATION_TEXT,
        payload: {
            testersValidationText
        }
    };
}
