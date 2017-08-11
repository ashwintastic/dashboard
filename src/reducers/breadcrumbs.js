import {
    BREADCRUMBS_RESET,
    BREADCRUMBS_APPEND,
} from '../constants/actionTypes';

const breadcrumbsState = [];

export default function breadcrumbs(state = breadcrumbsState, action) {
    switch (action.type) {
        case BREADCRUMBS_RESET:
            return [];
        case BREADCRUMBS_APPEND:
            return [...state,action.payload.breadcrumb];
        default:
            return state;
    }
}
