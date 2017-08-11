import React from 'react';
import { connect } from 'react-redux';
import TestLinks from './TestLinks';
import {
  setOpenModalFlag,
  testLinkFlow,
  setShowTestLink,
  setTesterIds,
  fetchTestLinks,
  deactivateTestLink,
  setSelectedTester,
  deleteTester,
  setUserEntry,
  setSelectedPlatformBot,
  fetchFlowData,
  setTestLink,
  setTestersValidationText
} from '../../actions/testLinks';
import { fetchBotData, fetchLinkedPages } from '../../actions/flow';
import { auth } from '../../config';
let _ = require('lodash');

const mapStateToProps = (state) => {
  const testLinksState = state.testLinksState;
  let platformBots = state.botFlows.platformBotInfo;
  let selPlatformBot = testLinksState.selPlatformBot;
  if (selPlatformBot === "") {
    if (platformBots.length) {
      selPlatformBot = platformBots[0].pageid;
    } else {
      selPlatformBot = auth.facebook.testPageId
    }
  }
  const testLinks = testLinksState.testLinks[testLinksState.flowId];
  _.forEach(testLinks, function(testlink) {
    const platformBot = _(platformBots).find(p => (p.pageid === testlink.platformBotId));
    if (platformBot) {
      testlink.platformBotName = platformBot.name;
    } else {
      testlink.platformBotName = "Botworx Test Page";
    }
  }); 

  if (state.botFlows.botFlowId === testLinksState.flowId) {//for active flow, load only default
    platformBots = [];
    selPlatformBot = auth.facebook.testPageId;
  }
  return {
      testLinks: testLinks || [],
      testerEmails: testLinksState.testers[testLinksState.flowId] || [],
      flowId: testLinksState.flowId || null,
      botId: testLinksState.botId || null,
      userRole: state.auth.user.roles,
      testLinkDialogFlag: testLinksState.testLinkDialogFlag,
      setLink: testLinksState.setLink,
      testerIds: testLinksState.testerIds,
      testLinkEmailSent: testLinksState.testLinkEmailSent || false,
      isDeactivated: testLinksState.isDeactivated || false,
      selectedTester: testLinksState.selectedTester || "",
      userTyping: testLinksState.userTyping || false,
      platformBots: platformBots || [],
      selPlatformBot: selPlatformBot || "",
      showPlatformBots: testLinksState.showPlatformBots || true,
      flow: testLinksState.flow || {},
      showTestLinkDialogFlag : testLinksState.showTestLinkDialogFlag  || false,
      currTestLink : testLinksState.currTestLink || {},
      testersValidationText: testLinksState.testersValidationText || ""
  };
};

const mapDispatch = (dispatch) => ({

    onTesterIdsEntry: (e) => {
      dispatch(setTesterIds(e.target.value));
		  dispatch(setUserEntry(true));
      dispatch(setTestersValidationText(""));
	  },
    onTestLinkFlow: (botId, currentFlowId, testerIds, platformBotId, testLinks) => {
      const testerIdsArr = testerIds.trim().split(/\s*,\s*/);
      const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
      let isEmailInvalid = false;
      for (var i=0, len=testerIdsArr.length; i<len; i++) {
        if (!emailPattern.test(testerIdsArr[i])) {
          isEmailInvalid = true;
          break;
        } 
      }
      let isDuplicate = false, duplicateEmail = "", duplicatePage = "";
      for (var i=0, len=testLinks.length, testLink; i<len; i++) {
          testLink = testLinks[i];
          if (testerIdsArr.indexOf(testLink.testerEmail) > -1 && testLink.platformBotId === platformBotId) {
            isDuplicate = true;
            duplicateEmail = testLink.testerEmail;
            duplicatePage = testLink.platformBotName;
            break;
          }
      }
      if (isEmailInvalid) {
        dispatch(setTestersValidationText("Enter valid e-mail addresses."));
      } else if (isDuplicate) {
        dispatch(setTestersValidationText("'"+ duplicateEmail +"' already has a test link for '"+ duplicatePage +"'."));
      } else {
        dispatch(setTestersValidationText(""));
        dispatch(testLinkFlow(botId, currentFlowId, testerIds, platformBotId));
	  	  dispatch(setUserEntry(false));
      }
    },
    onDeactivateTestLink :(testlinkId, currStatus, flowId, botId) => {
        const status = (currStatus === "deactivated" || currStatus === "expired")?"inactive": "deactivated";
        dispatch(deactivateTestLink(testlinkId, status, flowId, botId));
        //dispatch(fetchTestLinks(flowId, botId));
    },
    onTestDialogClose: (currentFlowId, botId) => {
        dispatch(setShowTestLink(false));
    },
    onTesterSelected:(e, i, val) => {
        dispatch(setSelectedTester(val));
    },
    onDeleteTester:(testerId, botId, flowId) => {
        dispatch(deleteTester(testerId, botId, flowId));
    },
    onPlatformBotSelected:(e, i, val) => {
        dispatch(setSelectedPlatformBot(val));
    },
    getTestPageName:(platformBotId) => {
        dispatch(setSelectedPlatformBot(val));
    },
    onShowTestLink: (testLink) => {
      dispatch(setTestLink(testLink));
      dispatch(setShowTestLink(true));
    },
    onShowLinkDialogClose:() => {
      dispatch(setShowTestLink(false));
    },
    copyToClipboard: () => {
      var copyTextarea = document.querySelector('#testLinkUrl');
      copyTextarea.select();

      try {
        var successful = document.execCommand('copy');
      } catch (err) {
      }
    }
});

const TestLinkPage = connect(mapStateToProps, mapDispatch)(TestLinks);

/* eslint-disable react/prop-types */
export default function ({ params, context }) {
    const botId = params.botId;
    const flowId = params.flowId;
    const pageOrigin= context.origin;
    const accountId = 'acId';
    (function dispatchActions(dispatch) {
        dispatch(fetchTestLinks(flowId, botId));
        dispatch(fetchBotData(accountId, botId));
        dispatch(fetchLinkedPages(botId));
        dispatch(fetchFlowData(accountId, botId, flowId));
    }(context.store.dispatch));

    return (
      <TestLinkPage flowId={flowId} />
  );
}
/* eslint-enable react/prop-types */
