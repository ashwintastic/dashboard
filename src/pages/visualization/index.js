import React,{ PropTypes } from 'react';
import { connect } from 'react-redux';
import Visualization from './visualization';
import {
    visualize,
    } from '../../actions/visualization';
const mapStateToProps = (state) => {
    const VisualizationState = state.visualizationState;
    return {
        flowJson: VisualizationState.currentFlowData,
    };
};
const mapDispatch = (dispatch) => ({
    onVisualizeFlow: (botId, flowId) => {
        dispatch(visualize(null, botId, flowId));
    },
});
const VisualizationFlow = connect(mapStateToProps, mapDispatch)(Visualization);

export default function ({ params, context }) {
    const botId = params.botId;
    const flowId = params.flowId;
    //const accountId = params.accountId;
    (function dispatchActions(dispatch) {
        dispatch(visualize(null, botId, flowId));
    }(context.store.dispatch));
    return (
        <VisualizationFlow />
    );
}
