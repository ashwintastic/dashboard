import {
    BOTFLOW_FETCHING_FLOW_DATA,
    BOTFLOW_FETCHED_FLOW_DATA,
    BOTFLOW_FETCH_FLOW_DATA_FAILED,
    VISUALIZATION_GRAPH_DATA
} from '../constants/actionTypes';

import apiActionFactory from './factory/apiActionFactory';

export function visualize(accountId, botId, flowId) {
    const fetchFlowDataActions = apiActionFactory({
        fetchingActionType: BOTFLOW_FETCHING_FLOW_DATA,
        fetchedActionType: BOTFLOW_FETCHED_FLOW_DATA,
        fetchFailedActionType: BOTFLOW_FETCH_FLOW_DATA_FAILED,
        fetchApi: `/api/flow/account/${accountId}/bot/${botId}/flow/${flowId}`,
        actionMeta: {
            accountId,
            botId,
            flowId,
        },

        transform: ({ flow }) => ({
            flow: { ...flow },
        }),

    });
    return fetchFlowDataActions.fetchThunk;
}

export function sendDataToStore(data){
    return {
        type: VISUALIZATION_GRAPH_DATA,
        payload: data
    }
}

