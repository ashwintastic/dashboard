import {
    BOTFLOW_FETCHED_FLOW_DATA,
    BOTFLOW_FETCHING_FLOW_DATA,
    BOTFLOW_FETCH_FLOW_DATA_FAILED
} from '../constants/actionTypes';

const visualizationState = {
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
};
function visualization(state = visualizationState, action = null) {
    switch (action.type) {

        case BOTFLOW_FETCHED_FLOW_DATA:
            return {
                ...state,
                currentFlowData: action.payload.flow,
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
        default:
            return state;
    }
}
export default visualization;
