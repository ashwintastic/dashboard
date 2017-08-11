import {
  BOTFLOW_SET_CURRENT_BOT_ID,
  BOTFLOW_FETCH_FLOWS_FAILED,
  BOTFLOW_FETCHING_FLOWS,
  BOTFLOW_FETCHED_FLOWS,

  BOTFLOW_FETCH_FLOW_DATA_FAILED,
  BOTFLOW_FETCHING_FLOW_DATA,
  BOTFLOW_FETCHED_FLOW_DATA,

  BOTFLOW_FLOW_DATA_UPDATED,

  BOTFLOW_SET_CURRENT_FLOW_ID,
  BOTFLOW_SET_FLOW_DATA,

  FLOWS_FETCHING_ALL_FLOWS,
  FLOWS_FETCHED_ALL_FLOWS,
  FLOWS_FETCH_FLOWS_FAILED,
  BOT_SET_NEWBOT_NAME,
  BOT_SET_NEWBOT_DESCRIPTION,

  BOT_FETCHING_BOT_DATA,
  BOT_FETCHED_BOT_DATA,
  BOT_FETCH_BOTDATA_FAILED,

  ACCOUNT_FETCHING_PAGE_DATA,
  ACCOUNT_FETCHED_PAGE_DATA,
  ACCOUNT_FETCH_PAGEDATA_FAILED,

  BOT_FETCH_LINKED_PAGES_FAILED,
  BOT_FETCHING_LINKED_PAGES,
  BOT_FETCHED_LINKED_PAGES,
  BOT_FLOW_MODAL_FLAG,
  PAGE_PROGRESS_BAR_FLAG,

  BOT_SET_NEWBOT_DATA,
  BOT_SET_CREATE_DIALOG,
  BOT_SET_SHOW_TESTLINK,
  SET_BOT_TESTLINK,
  REQUIRE_PERMISSION_FLAG,
  SET_FB_PERMISSION_DATA,
  FLOW_ENTRY_FORM_FLAG,
  SET_SCHEMA_REFS_DATA,
  NOTIFICATION_SET,
  FETCHING_ALL_PLATFORM_BOTS,
  ALL_PLATFORM_BOTS_FETCH_FAILED,
  FETCHED_ALL_PLATFORM_BOTS,
  BOTFLOW_SET_FLOW_DATA_FOR_EDIT,
  BOT_SET_DEPLOYED_BOT
} from '../constants/actionTypes';

import { fetchBotList } from './accountBots';
import { refreshBot } from './manageAccount';
import { setErrorNotification, setSuccessNotification } from './notification';
import apiActionFactory from './factory/apiActionFactory';
import apiData from '../utils/apiData';
import { redirect, navigate } from './route';
import { validateJSON, getJsonValidationResult } from '../core/validator';
import _ from 'lodash';
import {
  setErrorText,
} from './manageAccount';
import {
  BOT_CREATED_SUCCESSFULLY,
  BOT_ERROR_MESSAGE,
  BOT_DELETE_MESSAGE,
  BOT_UPDATED_SUCCESSFULLY,
  ERROR_MESSAGE,
  PAGE_DEPLOYED_SUCCESSFULLY,
  PAGE_DEPLOY_FAILED,
  PAGE_ROLLED_BACK_SUCCESSFULLY,
  PAGE_ROLL_BACK_FAILED,
  FLOW_VALIDATION_ERROR,
  FLOW_SAVE_SUCCESSFUL,
  FLOW_FETCH_FAILED
} from '../noticationMessages/messages';

import defaultFlow from 'botworx-schema/flow/defaultFlow.json';


export function setCurrentFlowId(flowId) {
  return {
    type: BOTFLOW_SET_CURRENT_FLOW_ID,
    payload: {
      flowId,
    },
  };
}

export function updateFlowData(flowJson) {
  return {
    type: BOTFLOW_FLOW_DATA_UPDATED,
    payload: {
      flowJson,
    },
  };
}

export function setFlowDataForEdit(displayFlowJson) {
  return {
    type: BOTFLOW_SET_FLOW_DATA_FOR_EDIT,
    payload: {
      displayFlowJson,
    },
  };
}

export function fetchFlowList(accountId, botId) {
  const fetchFlowsActions = apiActionFactory({
    fetchingActionType: BOTFLOW_FETCHING_FLOWS,
    fetchedActionType: BOTFLOW_FETCHED_FLOWS,
    fetchFailedActionType: BOTFLOW_FETCH_FLOWS_FAILED,
    fetchApi: `/api/flow/account/${accountId}/bot/${botId}`,
    actionMeta: {
      accountId,
      botId,
    },
    transform: ({ flows, allowedPermissions }) => ({
      flowPerms: allowedPermissions,
      flows: flows.map(f => ({ id: f._id, name: f.description, allows: allowedPermissions })),
    }),
  });

  return fetchFlowsActions.fetchThunk;
}

// TODO temporary save without jsoneditor
export function uploadFlowData(accountId, flowJson) {
  return async (dispatch, getState) => {
    const currentState = getState().botFlows;
    let { currentFlowId, botId } = currentState;
    flowJson._id = flowJson._id || currentFlowId;
    flowJson.botId = flowJson.botId || botId;
    const state = getState();
    const schemaRef = state.botFlows.schemaRefs;
    if (!schemaRef) {
      dispatch(setErrorNotification('unable to validate - no schema found'));
      return;
    }
    const flowToValidate = _.assignIn({}, flowJson);
    const validationResult = getJsonValidationResult(flowToValidate, schemaRef);
    if (validationResult.errors && validationResult.errors.length) {
      console.log('Schema Validation failed');
      validationResult.errors.forEach(x => console.log("Schema Error: ", x));
      let validationErrorMsg = "Schema Validation errors:\n\n";
      validationErrorMsg += validationResult.errors.join(';\n\n');
      dispatch(setErrorNotification(FLOW_VALIDATION_ERROR));

      dispatch(setErrorNotification(validationErrorMsg));
      return;
    }

    const resp = await apiData({
      api: `/api/flow/bot/${botId}/${currentFlowId}/upload`,
      method: 'post',
      body: {
        flowJson: flowJson,
      },
    }, dispatch);

    if (resp.status === 200) {
      dispatch(setSuccessNotification(FLOW_SAVE_SUCCESSFUL));
      dispatch(navigate(window.location.pathname));
      return;
    };
    const text = await resp.text();
    dispatch(setErrorNotification(text));
  }
}

/* eslint-disable no-empty */
export function saveFlowData(accountId) {
  return async (dispatch, getState) => {
    const currentState = getState().botFlows;
    let { botId, currentFlowId, currentFlowData, displayFlowData } = currentState;
    currentFlowData = _.assignIn(currentFlowData, displayFlowData);
    const resp = await apiData({
      api: `/api/flow/bot/${botId}/${currentFlowId}`,
      method: 'post',
      body: {
        flowJson: currentFlowData,
      },
    }, dispatch);
    if (resp.status === 200) {
      if (currentFlowData._id && (currentState.botFlowId === currentFlowData._id)) {
        dispatch(refreshBot(botId));
      }
      dispatch(redirect('/accounts/' + accountId + '/bots/' + botId + '/flows'));
      //dispatch(fetchFlowList(-1, botId));
    };
  }
}

export function fetchFlowDataRaw(accountId, botId, flowId, validateAndTrim) {
  return async (dispatch, getState) => {
    const resp = await apiData({
      api: `/api/flow/account/${accountId}/bot/${botId}/flow/${flowId}`,
      method: 'get',
    }, dispatch);
    if (resp.status === 200) {
      const flowData = (await resp.json()).flow;
      dispatch(setFlowDataForEdit(flowData));
    }
    else {
      dispatch(setErrorNotification(FLOW_FETCH_FAILED));
    }
  }
}

/* eslint-enable no-empty */

export function fetchFlowData(accountId, botId, flowId) {
  return async (dispatch, getState) => {
    const resp = await apiData({
      api: `/api/flow/account/${accountId}/bot/${botId}/flow/${flowId}`,
      method: 'get',
    }, dispatch);
    if (resp.status === 200) {
      const flowData = (await resp.json()).flow;
      if (flowData.keywords === null || flowData.keywords === undefined) {
        flowData.keywords = {};
      }
      if (flowData.nodes === null || flowData.nodes === undefined) {
        flowData.nodes = {};
      }
      const state = getState();
      const schemaRef = state.botFlows.schemaRefs;
      const flowToValidate = _.assignIn({}, flowData);
      const validationStatus = validateJSON(flowToValidate, schemaRef);

      if (validationStatus === true) {
        dispatch(setFetchedFlowData(flowData));
        const attribsToHide = ['_id', 'createdDate', 'lastUpdatedDate', '__v', 'botId'];
        for (var index in attribsToHide) {
          delete flowToValidate[attribsToHide[index]];
        }
        dispatch(setFlowDataForEdit(flowToValidate));
        if (location.pathname.indexOf('/edit') === -1) {
          dispatch(redirect(`/accounts/${accountId}/bots/${botId}/flows/${flowId}/edit`));
        }
      }
      else {
        //dispatch(flowEntryFormFlag(false));
        dispatch(setErrorNotification(FLOW_VALIDATION_ERROR));
      }

    }
  };
}

export function deleteFlow(botId, currentFlowId) {
  return (dispatch) => {
    apiData({
      api: `/api/flow/bot/${botId}/${currentFlowId}`,
      method: 'delete',
    }, dispatch).then(resp => {
      if (resp.status === 200) {
        dispatch(fetchFlowList(-1, botId));
      }
    });
  };
}

export function cloneFlow(botId, currentFlowId) {
  return (dispatch) => {
    apiData({
      api: `/api/flow/bot/${botId}/${currentFlowId}`,
      method: 'put',
    }, dispatch).then(resp => {
      if (resp.status === 200) {
        dispatch(fetchFlowList(-1, botId));
      }
    });
  };
}

export function fetchAllFlows(accountId) {
  const fetchFlowsActions = apiActionFactory({
    fetchingActionType: FLOWS_FETCHING_ALL_FLOWS,
    fetchedActionType: FLOWS_FETCHED_ALL_FLOWS,
    fetchFailedActionType: FLOWS_FETCH_FLOWS_FAILED,
    fetchApi: `/api/accounts/${accountId}/flowlist`,
    actionMeta: {
      accountId,
    },
    transform: ({ allFlows }) => ({
      allFlows: allFlows.map(f => ({ id: f._id, name: f.description })),
    }),
  });

  return fetchFlowsActions.fetchThunk;
}

export function setCurrentBotId(botId) {
  return {
    type: BOTFLOW_SET_CURRENT_BOT_ID,
    payload: {
      botId,
    },
  };
}

export function setFlowData(flowJson) {
  return {
    type: BOTFLOW_SET_FLOW_DATA,
    payload: {
      flowJson,
    },
  };
}

export function createNewFlow(accountId, botId) {
  return (dispatch) => {
    dispatch(setCurrentBotId(botId));
    dispatch(setCurrentFlowId(-1));
    dispatch(setFlowDataForEdit(defaultFlow));
    if (location.pathname.indexOf('/create') === -1) {
      dispatch(redirect(`/accounts/${accountId}/bots/${botId}/flows/create`))
    }
  };
}

export function setNewBotName(name) {
  return {
    type: BOT_SET_NEWBOT_NAME,
    payload: {
      name,
    },
  };
}

export function setNewBotDetail(description) {
  return {
    type: BOT_SET_NEWBOT_DESCRIPTION,
    payload: {
      description,
    },
  };
}

export function fetchBotData(accountId, botId) {
  const fetchBotDataActions = apiActionFactory({
    fetchingActionType: BOT_FETCHING_BOT_DATA,
    fetchedActionType: BOT_FETCHED_BOT_DATA,
    fetchFailedActionType: BOT_FETCH_BOTDATA_FAILED,
    fetchApi: `/api/accounts/${accountId}/bots/${botId}`,
    actionMeta: {
      accountId,
      botId,
    },
    transform: ({ bot }) => ({
      bot: { name: bot.name, description: bot.description, flowId: bot.flowId },
    }),
  });
  return fetchBotDataActions.fetchThunk;
}

export function makeFlowLive() {
  return (dispatch, getState) => {
    const botId = getState().botFlows.botId;
    const currentFlowId = getState().botFlows.currentFlowId;
    apiData({
      api: `/api/makeliveflow/${botId}/${currentFlowId}`,
      method: 'post',
    }, dispatch).then(resp => {
      if (resp.status === 200) {
        dispatch(refreshBot(botId));
        dispatch(fetchFlowList(-1, botId));
        dispatch(fetchBotData(-1, botId));
      }
    });
  };
}

// get pages linked wth account

export function getLinkedPages(PageList, botId) {
  return {
    type: ACCOUNT_FETCHED_PAGE_DATA,
    payload: {
      PageList,
      botId
    },
  };
}
// reload page list

export function setProgressBarFlag(flag) {
  return {
    type: PAGE_PROGRESS_BAR_FLAG,
    payload: {
      flag,
    },
  };
}

export function reloadPageList(userId, accessToken, fbUserId) {
  return async (dispatch, getState) => {
    const currentState = getState().botFlows;
    const { botId } = currentState;
    const resp = await apiData({
      api: `/api/users/${userId}/accounts/bots/pagelist`,
      method: 'post',
      body: {
        fbUserId,
        accessToken,
        userId,
        botId,
        platform: 'facebook',
      },
    }, dispatch);
    if (resp.status === 200) {
      const pagelist = await resp.json();
      dispatch(getLinkedPages(pagelist, botId));
    }
    dispatch(setProgressBarFlag(false));
    //dispatch(setNewBotName(botName));
  };
}
// get linked pages

export function fetchLinkedPages(botId) {
  const accountId = 'abc';
  const fetchLinkedPagesActions = apiActionFactory({
    fetchingActionType: BOT_FETCHING_LINKED_PAGES,
    fetchFailedActionType: BOT_FETCH_LINKED_PAGES_FAILED,
    fetchedActionType: BOT_FETCHED_LINKED_PAGES,
    fetchApi: `/api/accounts/${accountId}/bots/${botId}/platformbot`,
    actionMeta: {
      botId,
    },
    transform: ({ platformBots }) => ({
      platformBots: platformBots.map(p => ({ pageid: p.platformBotId })),
      platformBots: platformBots.map(p => ({ pageid: p.platformBotId, name: p.name })),
    }),
  });
  return fetchLinkedPagesActions.fetchThunk;
}

// fetch all platform Bots

export function fetchAllPlatformBots() {
  const fetchPlatformBotDataActions = apiActionFactory({
    fetchingActionType: FETCHING_ALL_PLATFORM_BOTS,
    fetchFailedActionType: ALL_PLATFORM_BOTS_FETCH_FAILED,
    fetchedActionType: FETCHED_ALL_PLATFORM_BOTS,
    fetchApi: `/api/allPlatformBots`,
    actionMeta: {
    },
    transform: ({ allPlatformBots }) => ({
      allPlatformBots: allPlatformBots.map(p => ({ pageid: p.platformBotId, pagename: p.name, botId: p.botId, invalid: p.invalid ? p.invalid : '' })),
    }),
  });
  return fetchPlatformBotDataActions.fetchThunk;
}

// add platform bot on deploy

export function createNewPlatformBot(pageDetail, userAccessToken, fbUserId) {
  return async (dispatch, getState) => {
    const currentState = getState().botFlows;
    const userId = getState().auth.user.id;
    const accountId = getState().manageAccount.currentAccountId;
    const { botId, botName } = currentState;
    const resp = await apiData({
      api: `/api/accounts/${accountId}/bots/${botId}/platformbot`,
      method: 'post',
      body: {
        botId: botId,
        platformBot: pageDetail,
        platform: 'facebook',
        userAccessToken: userAccessToken,
      },
    }, dispatch);
    if (resp.status === 200) {
      const deployStatus = await resp.json();
      if (deployStatus.pageStatus.success) {
        dispatch(refreshBot(botId));
        dispatch(reloadPageList(userId, userAccessToken, fbUserId));
        //dispatch(fetchLinkedPages(botId));
        dispatch(setSuccessNotification(PAGE_DEPLOYED_SUCCESSFULLY));
        dispatch(fetchAllPlatformBots());
      }
      else {
        dispatch(setErrorNotification(PAGE_DEPLOY_FAILED));
        dispatch(setProgressBarFlag(false));
      }
    }
  };
}

export function removePlatformBot(accessToken, platformBotId, botId, userAccessToken, fbUserId) {
  return async (dispatch, getState) => {
    const currentState = getState();
    const userId = currentState.auth.user.id;
    let accountId = currentState.manageAccount.currentAccountId;
    if (accountId == null) {
      accountId = 'test'
    }
    const currBotId = currentState.botFlows.botId;
    const resp = await apiData({
      api: `/api/accounts/${accountId}/bots/${currBotId}/platformbot/${platformBotId}/${accessToken}`,
      method: 'delete',
    }, dispatch);

    if (resp.status === 200) {
      const deployStatus = await resp.json();
      if (deployStatus.pageStatus.success) {
        dispatch(reloadPageList(userId, userAccessToken, fbUserId));
        dispatch(setSuccessNotification(PAGE_ROLLED_BACK_SUCCESSFULLY));
        dispatch(fetchAllPlatformBots());
        //dispatch(fetchLinkedPages(botId));
      }
      else {
        dispatch(setErrorNotification(PAGE_ROLL_BACK_FAILED));
        dispatch(setProgressBarFlag(false));
      }
    }
  };
}

export function revertFlow(botId) {
  return (dispatch) => {
    apiData({
      api: `/api/revertFlow/${botId}`,
      method: 'post',
    }, dispatch).then(resp => {
      if (resp.status === 200) {
        dispatch(fetchFlowList(-1, botId));
        dispatch(fetchBotData(-1, botId))
      }
    });
  };
}

export function loadSchemaRefs() {
  return async (dispatch, getState) => {
    const state = getState();
    const resp = await apiData({
      api: `/api/loadSchema/refs`,
      method: 'get',
    }, dispatch);
    if (resp.status === 200) {
      const schemaRef = (await resp.json()).schemaRef;
      dispatch(setSchemaRefs(schemaRef));
    }
  };
}

export function checkUserPermissions(accessToken, fbUserId, userId, botId, botName, accountId) {
  return async (dispatch, getState) => {
    const state = getState();
    const botName = state.botFlows.botName;
    const resp = await apiData({
      api: ` /api/facebook/permissions`,
      method: 'post',
      body: {
        accessToken,
        fbUserId,
      },
    }, dispatch);
    if (resp.status === 200) {
      const permissionsList = (await resp.json()).data;

      dispatch(setApprovedPermissions(permissionsList));
      const baseUrl = '/accounts/' + accountId + '/bots/' + botId;
      // new user
      if (((permissionsList.approved).length === 0) && ((permissionsList.rejected).length === 0)) {
        if (location.pathname.indexOf("/platform") === -1) {
          dispatch(redirect(baseUrl + '/user/' + userId + '/platform'));
        }
        //dispatch(setNewBotName(botName));
        dispatch(setCurrentBotId(botId));
      }
      // existing user - rejected required permissions
      else if ((permissionsList.requiredRejected).length != 0) {
        dispatch(userPermissionFlag(true));
        if (location.pathname.indexOf("/platform") === -1) {
          dispatch(redirect(baseUrl + '/user/' + userId + '/platform'));
        }
      }
      // existing user - new permissions added
      else if ((permissionsList.additionalRequired).length != 0) {
        if (location.pathname.indexOf("/platform") === -1) {
          dispatch(redirect(baseUrl + '/user/' + userId + '/platform'));
        }
      }
      // existing user - granted all permissions
      else if ((permissionsList.requiredRejected).length === 0) {
        //dispatch(setNewBotName(botName));
        dispatch(setCurrentBotId(botId));
        dispatch(reloadPageList(userId, accessToken, fbUserId));
        dispatch(userPermissionFlag(false));
        if (location.pathname.indexOf("/pagelist") === -1) {
          dispatch(redirect(baseUrl + '/user/' + userId + '/pagelist'));
        }
      } // default
      else {
        console.log('condition unhandled!!!', permissionsList);
        dispatch(setProgressBarFlag(false));
        dispatch(userPermissionFlag(false));
      }
    }
  };
}

export function userPermissionFlag(flag) {
  return {
    type: REQUIRE_PERMISSION_FLAG,
    payload: {
      flag,
    },
  };
}

export function setApprovedPermissions(permissionsList) {
  return {
    type: SET_FB_PERMISSION_DATA,
    payload: {
      permissionsList,
    },
  };
}
export function setOpenModalFlag(flag) {
  return {
    type: BOT_FLOW_MODAL_FLAG,
    payload: {
      flag,
    },
  };
}

// create new bot

export function setBotData(accountId) {
  return {
    type: BOT_SET_NEWBOT_DATA,
    payload: {
      accountId,
    },
  };
}

export function createNewBot() {
  return (dispatch, getState) => {
    const currentState = getState().botFlows;
    const accountId = getState().manageAccount.currentAccountId;
    const { botDescription, botName, currentFlowId } = currentState;
    apiData({
      api: `/api/accounts/${accountId}/botlist`,
      method: 'post',
      body: {
        name: botName,
        account: accountId,
        description: botDescription,
        flowId: currentFlowId || '',
      },
    }, dispatch).then(resp => {
      if (resp.status === 200) {
        dispatch(setBotData({
          accountId: '',
        }));
        dispatch(fetchBotList(accountId));
        dispatch(setSuccessNotification(BOT_CREATED_SUCCESSFULLY));
      }
    }).catch(resp => {
      dispatch(setErrorNotification(ERROR_MESSAGE))
    });
  };
}

export function setCreateDialog(dialogstate) {
  return {
    type: BOT_SET_CREATE_DIALOG,
    payload: {
      dialogstate,
    },
  };
}

export function setDeployedPlatformBot(deployedPlatformBot) {
  return {
    type: BOT_SET_DEPLOYED_BOT,
    payload: {
      deployedPlatformBot,
    },
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

/* eslint-disable no-empty */
export function saveBotData(botId) {
  return (dispatch, getState) => {
    const currentState = getState().botFlows;
    const accountId = getState().manageAccount.currentAccountId;
    const { botName, botDescription } = currentState;
    apiData({
      api: `/api/accounts/${accountId}/botlist/${botId}`,
      method: 'post',
      body: {
        botName: botName,
        description: botDescription,
      }
    }, dispatch).then(resp => {
      if (resp.status === 200) {
        dispatch(fetchBotList(accountId));
      }
    });
  };
}
/* eslint-enable no-empty */

export function deleteBot(accountId, botId) {
  return (dispatch) => {
    apiData({
      api: `/api/accounts/${accountId}/botlist/${botId}`,
      method: 'delete',
    }, dispatch).then(resp => {
      if (resp.status === 200) {
        dispatch(fetchBotList(accountId));
        dispatch(setSuccessNotification(BOT_DELETE_MESSAGE))
      }
    }).catch(resp => {
      dispatch(setErrorNotification(ERROR_MESSAGE));
    });
  };
}

export const flowEntryFormFlag = (payload) => ({
  type: FLOW_ENTRY_FORM_FLAG,
  payload
})

export const setFetchedFlowData = (payload) => ({
  type: BOTFLOW_FETCHED_FLOW_DATA,
  payload
})

export const setSchemaRefs = (payload) => ({
  type: SET_SCHEMA_REFS_DATA,
  payload
})
