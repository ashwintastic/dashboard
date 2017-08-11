import React from 'react';
import { connect } from 'react-redux';
// import { validateDBFlow } from 'botworx-schema/validator';
import Flow from './UploadFlow';
import {
  fetchFlowList,
  setCurrentFlowId,
  setCurrentBotId,
  fetchFlowDataRaw,
  updateFlowData,
  uploadFlowData,
  fetchBotData,
  makeFlowLive,
  setOpenModalFlag,
  validateFlowData,
  loadSchemaRefs,
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

  /*onFetchFlow: (accountId, botId, flowId) => {
    dispatch(setCurrentFlowId(flowId));
    dispatch(fetchFlowData(accountId, botId, flowId));
  },*/

  onSaveFlow: (accountId, flowJson) => {
    dispatch(uploadFlowData(accountId, flowJson));
    //dispatch(flowEntryFormFlag(false));
  },

  /* onCreateFlow: (botId) => {
     dispatch(createNewFlow(botId));
       dispatch(flowEntryFormFlag(true));
   },*/

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
    dispatch(setCurrentFlowId(flowId));
    dispatch(fetchFlowDataRaw(accountId, botId, flowId));
  }(context.store.dispatch));

  return (
    <FlowPage pageOrigin={pageOrigin}
    />
  );
}
/* eslint-enable react/prop-types */
