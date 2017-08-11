import {
    NOTIFICATION_SET
} from '../constants/actionTypes';

export default function notification (state = {}, action) {
    switch (action.type) {
        case NOTIFICATION_SET:
            return {
                type: action.payload.type,
                message: action.payload.message,
            };

        default:
            return state;
    }
}
