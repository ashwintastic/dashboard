import {
    VISUALIZATION_GRAPH_DATA
} from '../constants/actionTypes';
function visualizationGraphData(state = {}, action) {
    switch (action.type) {

        case VISUALIZATION_GRAPH_DATA:
            return {
                ...state,
                visualizationGraphData: action.payload
            };
        default:
            return state;
    }
}
export default visualizationGraphData;
