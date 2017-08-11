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

  BOT_SET_NEWBOT_DATA,
  BOT_SET_CREATE_DIALOG,
  BOT_SET_SHOW_TESTLINK,
  SET_BOT_TESTLINK,
  PAGE_PROGRESS_BAR_FLAG,
  REQUIRE_PERMISSION_FLAG,
  SET_FB_PERMISSION_DATA,
  FLOW_ENTRY_FORM_FLAG,
  SET_SCHEMA_REFS_DATA,
  FETCHING_ALL_PLATFORM_BOTS,
  ALL_PLATFORM_BOTS_FETCH_FAILED,
  FETCHED_ALL_PLATFORM_BOTS,
  BOTFLOW_SET_FLOW_DATA_FOR_EDIT,
  BOT_SET_DEPLOYED_BOT
} from '../constants/actionTypes';

const botFlowsState = {
  botId: null,
  fetching: false,
  botFlows: {},
  allFlows: [],
  botName: '',
  currentUserPages: [],
  otherUserPages: [],
  platformBotInfo: [],
  botDescription: '',
  currentFlowId: null,
  currentFlowData: {},
  displayFlowData: {},
  fetchingFlowData: false,
  fetchingBotData: false,
  fetchingLinkedPage: false,
  botFlowId: '',
  openModalFlag: false,
  createBotFlag: false,
  testLinkDialogFlag: false,
  setLink: '',
  loadProgressBarFlag: false,
  requirePermissionFlag: false,
  userPermissions: [],
  flowCreationFlag: false,
  allPlatformBots: [],
  schemaRefs: {},
  fetchingPlatformBots: false,
  deployedPlatformBot: ''
};

function botFlows(state = botFlowsState, action = null) {
  switch (action.type) {
    case BOT_SET_SHOW_TESTLINK:
      return {
        ...state,
        testLinkDialogFlag: action.payload.dialogstate,
      };
    case SET_SCHEMA_REFS_DATA:
      return {
        ...state,
        schemaRefs: action.payload,
      };
    case FLOW_ENTRY_FORM_FLAG:
      return {
        ...state,
        flowCreationFlag: action.payload,
      };
    case SET_BOT_TESTLINK:
      return {
        ...state,
        setLink: action.payload.testLink,
      };
    case BOTFLOW_SET_CURRENT_BOT_ID:
      return {
        ...state,
        botId: action.payload.botId,
      };

    case BOTFLOW_SET_CURRENT_FLOW_ID:
      return {
        ...state,
        currentFlowId: action.payload.flowId,
      };

    case BOTFLOW_FLOW_DATA_UPDATED:
      return {
        ...state,
        displayFlowData: {
          ...state.displayFlowData,
          ...action.payload.flowJson,
        },
      };

    case BOTFLOW_FETCHING_FLOWS:
      return {
        ...state,
        fetching: true,
      };

    case BOTFLOW_FETCH_FLOWS_FAILED:
      return {
        ...state,
        fetching: false,
      };

    case BOTFLOW_FETCHED_FLOW_DATA:
      return {
        ...state,
        currentFlowData: action.payload,
        fetchingFlowData: false,
      };

    case BOTFLOW_FETCHING_FLOW_DATA:
      return {
        ...state,
        fetchingFlowData: true,
      };

    case BOTFLOW_FETCH_FLOW_DATA_FAILED:
      return {
        ...state,
        fetchingFlowData: false,
      };

    case BOTFLOW_FETCHED_FLOWS: {
      const newState = {
        ...state,
      };
      newState.botFlows[action.meta.botId] = action.payload.flows || [];
      newState.flowPerms = action.payload.flowPerms || [];
      return newState;
    }

    case BOTFLOW_SET_FLOW_DATA:
      return {
        ...state,
        currentFlowData: { ...action.payload.flowJson },
      };

    // fetching all flows
    case FLOWS_FETCHING_ALL_FLOWS:
      return {
        ...state,
        fetching: true,
      };

    case FLOWS_FETCH_FLOWS_FAILED:
      return {
        ...state,
        fetching: false,
      };

    case FLOWS_FETCHED_ALL_FLOWS: {
      const newState = {
        ...state,
      };
      newState.allFlows = action.payload.allFlows || [];
      return newState;
    };

    case BOT_SET_NEWBOT_NAME:
      return {
        ...state,
        botName: action.payload.name,
      };
    case BOT_SET_NEWBOT_DESCRIPTION:
      return {
        ...state,
        botDescription: action.payload.description,
      };

    case BOT_FETCH_BOTDATA_FAILED:
      return {
        ...state,
        fetchingBotData: false,
      };

    case BOT_FETCHED_BOT_DATA:
      return {
        ...state,
        botName: action.payload.bot.name,
        botDescription: action.payload.bot.description || '',
        botFlowId: action.payload.bot.flowId,
        fetchingBotData: false,
      };
    case BOT_FETCHING_BOT_DATA:
      return {
        ...state,
        fetchingBotData: true,
      };

    case ACCOUNT_FETCHING_PAGE_DATA:
      return {
        ...state,
        fetchingPageData: true,
      };
    case ACCOUNT_FETCHED_PAGE_DATA:
      return {
        ...state,
        otherUserPages: {
          ...(state.otherUserPages || {}),
          [action.payload.botId]: action.payload.PageList.otherUserPages,
        },
        currentUserPages: {
          ...(state.currentUserPages || {}),
          [action.payload.botId]: action.payload.PageList.currentUserPages,
        },
      };

    case ACCOUNT_FETCH_PAGEDATA_FAILED:
      return {
        ...state,
        fetchingPageData: false,
      };

    case BOT_FETCHING_LINKED_PAGES:
      return {
        ...state,
        fetchingLinkedPage: true,
      };

    case BOT_FETCH_LINKED_PAGES_FAILED:
      return {
        ...state,
        fetchingLinkedPage: false,
      };

    case BOT_FETCHED_LINKED_PAGES: {
      const newState = {
        ...state,
      };
      newState.platformBotInfo = action.payload.platformBots || [];
      return newState;
    };

    case BOT_FLOW_MODAL_FLAG: {
      return {
        ...state,
        openModalFlag: action.payload.flag,
      };
    }
    case PAGE_PROGRESS_BAR_FLAG: {
      return {
        ...state,
        loadProgressBarFlag: action.payload.flag,
      };
    }
    case REQUIRE_PERMISSION_FLAG: {
      return {
        ...state,
        requirePermissionFlag: action.payload.flag,
      };
    }
    case SET_FB_PERMISSION_DATA: {
      return {
        ...state,
        userPermissions: action.payload.permissionsList,
      };
    }
    case BOT_SET_NEWBOT_DATA:
      return {
        ...state,
        accountId: state.currentAccountId,
      };
    case BOT_SET_CREATE_DIALOG:
      return {
        ...state,
        createBotFlag: action.payload.dialogstate,
      };
      case BOT_SET_DEPLOYED_BOT:
      return {
        ...state,
        deployedPlatformBot: action.payload.deployedPlatformBot,
      };
    case FETCHING_ALL_PLATFORM_BOTS:
      return {
        ...state,
        fetchingPlatformBots: true,
      };

    case ALL_PLATFORM_BOTS_FETCH_FAILED:
      return {
        ...state,
        fetchingPlatformBots: false,
      };

    case FETCHED_ALL_PLATFORM_BOTS: {
      const newState = {
        ...state,
      };
      newState.allPlatformBots = action.payload.allPlatformBots;
      return newState;
    };
    case BOTFLOW_SET_FLOW_DATA_FOR_EDIT: {
      return {
        ...state,
        displayFlowData: { ...action.payload.displayFlowJson },
      };
    };

    default:
      return state;
  }
}

export default botFlows;
