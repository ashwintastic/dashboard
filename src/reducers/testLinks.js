import {
  BOT_SET_SHOW_TESTLINK,
  SET_BOT_TESTLINK,
  SET_BOT_TESTERIDS,
  BOTFLOW_FETCHING_TESTLINKS,
  BOTFLOW_FETCH_TESTLINKS_FAILED,
  BOTFLOW_FETCHED_TESTLINKS,
  SET_BOT_TESTLINK_EMAIL_SENT,
  TESTLINK_POST_DEACTIVATE,
  TESTLINK_DELETE_USER,
  SET_USER_TYPING,
  SET_PLATFORM_BOT,
  BOT_FETCHING_LINKED_PAGES,
  BOT_FETCH_LINKED_PAGES_FAILED,
  BOTFLOW_FETCH_FLOW_DATA_FAILED,
  BOTFLOW_FETCHING_FLOW_DATA,
  BOTFLOW_FETCHED_FLOW_DATA,
  SET_SHOW_TESTLINK,
  SET_TESTERS_VALIDATION_TEXT
} from '../constants/actionTypes';

import {auth} from '../config';

const testLinksState = {
  botId: null,
  flowId: null,
  testLinks: {},
  showTestLinkDialogFlag: false,
  currTestLink: {},
  testerIds:'',
  testLinkEmailSent: false,
  testers: [],
  selectedTester: "",
  userTyping: false,
  selPlatformBot: "",
  showPlatformBots: true,
  flow: {},
  testersValidationText: ""
};

function testLinks(state = testLinksState, action = null) {
    switch (action.type) {
        case BOT_SET_SHOW_TESTLINK:
            return {
              ...state,
                showTestLinkDialogFlag: action.payload.dialogstate,
            };   
        case SET_BOT_TESTLINK:
            return {
              ...state,
                currTestLink: action.payload.testLink,
            };
        case SET_BOT_TESTERIDS:
            return {
              ...state,
                testerIds: action.payload.testerIds,
            };
        case BOTFLOW_FETCHING_TESTLINKS:
      return {
        ...state,
        fetching: true,
      };

        case BOTFLOW_FETCH_TESTLINKS_FAILED:
      return {
        ...state,
        fetching: false,
      };

        case BOTFLOW_FETCHED_TESTLINKS: {
            const newState = {
              ...state,
              };
            newState.flowId = action.meta.flowId;
            newState.botId = action.meta.botId;
            const testLinks = action.payload.testLinks ;
            newState.testLinks[action.meta.flowId] = testLinks || [];
            var testers = [];
            for (var i=0, len=testLinks.length; i<len; i++) {
                if (testers.indexOf(testLinks[i].testerEmail) < 0) {
                    testers.push(testLinks[i].testerEmail);
                }
            }
            newState.testers[action.meta.flowId] = testers || [];
            return newState;
        };

           case SET_BOT_TESTLINK_EMAIL_SENT:
               return {
             ...state,
                   testLinkEmailSent: action.payload.isEmailSent,
               };
        case TESTLINK_POST_DEACTIVATE: {
            const newState = {
             ...state,
             };
            var newTestLink = action.payload.testLink.testLink;
            var testLinkId = newTestLink._id;
            var testLinksforFlows = newState.testLinks;
            for (var flowId in testLinksforFlows) {
                var testLinks =  testLinksforFlows[flowId];
                for (var i=0, len=testLinks.length, testLink; i<len; i++) {
                    testLink = testLinks[i];
                    if (testLink.id === testLinkId) {
                        testLinks[i].status = newTestLink.status;
                    }
                }
            }
            return newState;
        };
        case TESTLINK_DELETE_USER: {
            return {
             ...state,
                selectedTester: action.payload.selTester,
            };
            };
        case SET_PLATFORM_BOT: {
            return {
             ...state,
                selPlatformBot: action.payload.selPlatformBot
            };
        };
        case SET_USER_TYPING: {
            return {
             ...state,
                userTyping: action.payload.userTyping,
            };
            };
        case BOT_FETCHING_LINKED_PAGES:
            return {
                ...state,
                fetching: true,
            };
        case BOT_FETCH_LINKED_PAGES_FAILED:
            return {
                ...state,
                fetching: false,
            };
        case BOTFLOW_FETCHED_FLOW_DATA:
            return {
                ...state,
                flow: action.payload.flow,
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
        case SET_TESTERS_VALIDATION_TEXT:
            return {
                ...state,
                testersValidationText: action.payload.testersValidationText,
            };
    default:
      return state;
  }
}


export default testLinks;