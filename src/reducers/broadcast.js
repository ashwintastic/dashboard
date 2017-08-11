import {
    BOT_BROADCAST_ENTRIES_FETCHING,
    BOT_BROADCAST_ENTRIES_FETCHED,
    BOT_BROADCAST_ENTRIES_FAILED,
    BOT_BROADCAST_ENTRY_CREATE,
    BOT_BROADCAST_ENTRY_FORM_FLAG,
    BOT_BROADCAST_ENTRY_EDIT,
    BOT_FLOW_EXISTING_NODES_FAILED,
    BOT_FLOW_EXISTING_NODES_COMPLETED,
    BOT_FLOW_EXISTING_NODES_STARTING,
    BOT_BROADCAST_VAL_CHANGE,
    BOT_SUBSCRIPTION_ENTRIES_FETCHING,
    BOT_SUBSCRIPTION_ENTRIES_FETCHED,
    BOT_SUBSCRIPTION_ENTRIES_FAILED,
    BOT_BROADCAST_ENTRY_GET_STARTING,
    BOT_BROADCAST_ENTRY_GET_COMPLETED,
    BOT_BROADCAST_ENTRY_GET_FAILED,
    WEB_UPDATES_STARTING,
    WEB_UPDATES_COMPLETED,
    WEB_UPDATES_FAILED,
    SET_BOT_BROADCAST_VALIDATION_TEXT
} from '../constants/actionTypes';
var moment = require('moment');
var CurrentDateTime = () => moment().subtract(moment().utcOffset(), 'minutes').toDate();

const broadcastState = {
    broadcastEntries: [],
    subscriptionEntries: [],
    broadcastPerms: [],
    broadcastEntryFormFlag: false,
    broadcastEntryData: {
        name: '',
        description: '',
    },
    existingFlowNodes: [],
    webUpdates: [],
    webupdateContentId: '',
    webUpdatesValidationText: ''
};

function broadcastEntries(state = broadcastState, action = null) {
    switch (action.type) {
        case BOT_BROADCAST_ENTRIES_FETCHING:
            return {
                ...state,
            };
        case BOT_BROADCAST_ENTRIES_FETCHED:
            return {
                ...state,
                broadcastEntries: action.payload.broadcastEntries,
                broadcastPerms: action.payload.broadcastPerms,
            };
        case BOT_BROADCAST_ENTRIES_FAILED:
            return {
                ...state,
            };
        case BOT_FLOW_EXISTING_NODES_STARTING:
            return {
                ...state,
            };
        case BOT_FLOW_EXISTING_NODES_COMPLETED:
            return {
                ...state,
                existingFlowNodes: action.payload.existingFlowNodes,
            };
        case BOT_FLOW_EXISTING_NODES_FAILED:
            return {
                ...state,
            };
        case BOT_BROADCAST_ENTRY_FORM_FLAG:
            return {
                ...state,
                broadcastEntryFormFlag: action.payload,
            };
        case BOT_BROADCAST_ENTRY_EDIT:
            return {
                ...state,
                broadcastEntryData: Object.assign({}, state.broadcastEntries.find((entry) => {
                    return entry._id === action.payload
                })),
            };
        case BOT_BROADCAST_ENTRY_GET_STARTING:
            return {
                ...state,
            };
        case BOT_BROADCAST_ENTRY_GET_COMPLETED:
            const date = action.payload.updatedBroadcastEntry.date;
            const time = action.payload.updatedBroadcastEntry.time;
            const datetime = (date && time) ? moment(date +' '+ time).toDate() :  CurrentDateTime();
            return {
                ...state,
                broadcastEntryData: Object.assign({}, {
                    ...action.payload.updatedBroadcastEntry,
                    date: datetime,
                    time: datetime
                }),
            };
        case BOT_BROADCAST_ENTRY_GET_FAILED:
            return {
                ...state,
            };
        case BOT_BROADCAST_VAL_CHANGE:
            return {
                ...state,
                broadcastEntryData: Object.assign({}, state.broadcastEntryData, action.payload)
            };
        case BOT_BROADCAST_ENTRY_CREATE:
            const newState = Object.assign(state, {
                broadcastEntryData: {
                    botId: action.payload.botId,
                    name: '',
                    description: '',
                    timeZone: 'bot',
                    jobType: action.payload.jobType,
                    date: action.payload.datetime,
                    time: action.payload.datetime,
                    repeat: 'None',
                    type: action.payload.type ? action.payload.type : 'immediate',
                    nodes: [],
                    pollId: action.payload.pollId,
                    targetOnlyFinishedUsers: true,
                }
            });
            return newState;
        case BOT_SUBSCRIPTION_ENTRIES_FETCHING:
            return {
                ...state,
            };
        case BOT_SUBSCRIPTION_ENTRIES_FETCHED:
            return {
                ...state,
                subscriptionEntries: action.payload.subscriptionEntries,
            };
        case BOT_SUBSCRIPTION_ENTRIES_FAILED:
            return {
                ...state,
            };
        case WEB_UPDATES_STARTING:
            return {
                ...state,
            };
        case WEB_UPDATES_COMPLETED:
            return {
                ...state,
                webUpdates: action.payload.allWebUpdates,
            };
        case WEB_UPDATES_FAILED:
            return {
                ...state,
            };
        case SET_BOT_BROADCAST_VALIDATION_TEXT:
            return {
                ...state,
                webUpdatesValidationText: action.payload.webUpdatesValidationText,
            };
        default:
            return state;
    }
}
export default broadcastEntries;
