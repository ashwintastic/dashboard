import React from 'react';
import { connect } from 'react-redux';
// import { validateDBFlow } from 'botworx-schema/validator';
import Flow from './CreateEditFlow';
import {
  fetchFlowList,
  setCurrentFlowId,
  setCurrentBotId,
  fetchFlowData,
  updateFlowData,
  saveFlowData,
  createNewFlow,
  deleteFlow,
  cloneFlow,
  fetchBotData,
  makeFlowLive,
  revertFlow,
  setOpenModalFlag,
  testLinkFlow,
  setShowTestLink,
  validateFlowData,
  loadSchemaRefs,
  setFetchedFlowData
} from '../../actions/flow';
import {
  setManageAccountId,
} from '../../actions/manageAccount';
import { redirect } from '../../actions/route';

const mapStateToProps = (state) => {
  const flowState = state.botFlows;
  return {
    flows: flowState.botFlows[flowState.botId] || [],
    flowJson: flowState.displayFlowData,
    flowId: flowState.currentFlowId || null,
    botId: flowState.botId || null,
    botFlowId: flowState.botFlowId,
    openModalFlag: flowState.openModalFlag,
    userRole: state.auth.user.roles,
    testLinkDialogFlag: flowState.testLinkDialogFlag,
    setLink: flowState.setLink,
    flowPerms: flowState.flowPerms,
    flowCreationFlag: flowState.flowCreationFlag,
    accountId: state.manageAccount.currentAccountId,
    schemaRefs: flowState.schemaRefs,
  };
};

const mapDispatch = (dispatch) => ({
  onFlowChange: (flowId) => {
    dispatch(setCurrentFlowId(flowId));
  },

  onSaveFlow: (accountId) => {
    dispatch(saveFlowData(accountId));
  },

  onFlowDataChange: (flowJson) => {
    dispatch(updateFlowData(flowJson));
  },

  onTestLinkFlow: (botId, currentFlowId) => {
    dispatch(testLinkFlow(botId, currentFlowId));
  },
  onModalSubmit: () => {
    dispatch(makeFlowLive());
    dispatch(setOpenModalFlag(false));
  },
  onModalFlagChange: (botId) => {
    dispatch(setOpenModalFlag(false));
    dispatch(fetchFlowList(-1, botId));
    dispatch(fetchBotData(-1, botId));
  },
  onTestDialogClose: () => {
    dispatch(setShowTestLink(false));
  },
  onFlowAddEditClose: (accountId, botId) => {
    dispatch(redirect('/accounts/' + accountId + '/bots/' + botId + '/flows'));
  }
});

const FlowPage = connect(mapStateToProps, mapDispatch)(Flow);

/* eslint-disable react/prop-types */
export default function ({ params, context }) {
  const botId = params.botId;
  const accountId = params.accountId;
  const pageOrigin = context.origin;
  const flowId = params.flowId;
  (function dispatchActions(dispatch) {
    dispatch(fetchFlowList(accountId, botId));
    dispatch(setCurrentBotId(botId));
    dispatch(setManageAccountId(accountId));
    dispatch(fetchBotData(accountId, botId));
    dispatch(loadSchemaRefs());
    if (flowId && flowId !== '') {
      dispatch(setCurrentFlowId(flowId));
      dispatch(fetchFlowData(accountId, botId, flowId));
    } else {
      dispatch(setFetchedFlowData({}));
      dispatch(createNewFlow(accountId, botId));
    }
  }(context.store.dispatch));

  return (
    <FlowPage pageOrigin={pageOrigin}
    />
  );
}
/* eslint-enable react/prop-types */
