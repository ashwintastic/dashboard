import React from 'react';
import { connect } from 'react-redux';
// import { validateDBFlow } from 'botworx-schema/validator';
import Flow from './Flow';
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
} from '../../actions/flow';
import {
  setManageAccountId,
} from '../../actions/manageAccount';

const mapStateToProps = (state) => {
  const flowState = state.botFlows;
  return {
    flows: flowState.botFlows[flowState.botId] || [],
    flowJson: flowState.currentFlowData,
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
  onEditFlowClick: (accountId, botId, flowId) => {
    dispatch(setCurrentFlowId(flowId));
    dispatch(fetchFlowData(accountId, botId, flowId));
  },
  onFlowChange: (flowId) => {
    dispatch(setCurrentFlowId(flowId));
  },

  onFlowDataChange: (flowJson) => {
    dispatch(updateFlowData(flowJson));
  },

  onCreateFlow: (accountId, botId) => {
    dispatch(createNewFlow(accountId, botId));
  },
  onCloneFlow: (botId, currentFlowId) => {
    dispatch(cloneFlow(botId, currentFlowId));
  },
  onMakeFlowLive: (botId, flowId) => {
    dispatch(setCurrentFlowId(flowId));
    dispatch(setCurrentBotId(botId));
    dispatch(setOpenModalFlag(true));
  },
  onRevertFlow: (botId) => {
    dispatch(revertFlow(botId));
  },
  onDeleteFlow: (botId, currentFlowId) => {
    dispatch(deleteFlow(botId, currentFlowId));
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
  }
});

const BotFlowPage = connect(mapStateToProps, mapDispatch)(Flow);

/* eslint-disable react/prop-types */
export default function ({ params, context }) {
  const botId = params.botId;
  const accountId = params.accountId;
  const pageOrigin = context.origin;
  (function dispatchActions(dispatch) {
    dispatch(fetchFlowList(accountId, botId));
    dispatch(setCurrentBotId(botId));
    dispatch(setManageAccountId(accountId));
    dispatch(fetchBotData(accountId, botId));
    dispatch(loadSchemaRefs());
  }(context.store.dispatch));

  return (
    <BotFlowPage pageOrigin={pageOrigin}
    />
  );
}
/* eslint-enable react/prop-types */
