import {
    BOT_SUBSCRIPTION_CREATE,
    BOT_SUBSCRIPTION_SHOW_DIALOG,
    BOT_SUBSCRIPTION_SET_SUBSCRIPTION,
    BOT_SUBSCRIPTION_SET_SUBSCRIPTION_NAME,
    BOT_SUBSCRIPTION_SET_ADD_EDIT_MODE
} from '../constants/actionTypes';
var moment = require('moment');
var CurrentDateTime = () => moment().subtract(moment().utcOffset(), 'minutes').toDate();

const subscriptionsState = {
    currSubscription: {},
    showAddEditDialog: false,
    subscriptionName: '',
    addEditMode: 'edit'
};

function subscriptionEntries(state = subscriptionsState, action = null) {
    switch (action.type) {

        case BOT_SUBSCRIPTION_SET_SUBSCRIPTION:
            return {
             ...state,
                currSubscription: action.payload.currSubscription,
            };
        case BOT_SUBSCRIPTION_SHOW_DIALOG:
            return {
             ...state,
                showAddEditDialog: action.payload.showAddEditDialog,
            };
        case BOT_SUBSCRIPTION_SET_SUBSCRIPTION_NAME:
            return {
             ...state,
                subscriptionName: action.payload.subscriptionName,
            };
        case BOT_SUBSCRIPTION_SET_ADD_EDIT_MODE:
            return {
             ...state,
                addEditMode: action.payload.addEditMode,
            };
        default:
            return state;
    }
}
export default subscriptionEntries;
