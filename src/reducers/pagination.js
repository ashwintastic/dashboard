import {
  SET_ACTIVE_POLL_PAGINATION_DETAILS,
  SET_INACTIVE_POLL_PAGINATION_DETAILS,
  SET_CLOSED_POLL_PAGINATION_DETAILS,
  SET_PENDING_POLL_PAGINATION_DETAILS
} from '../constants/actionTypes';

export default function pagination(state = {}, action) {
  switch (action.type) {
    case SET_ACTIVE_POLL_PAGINATION_DETAILS:
      return {
        ...state,
        activePoll: action.payload.activePoll
      };

    case SET_INACTIVE_POLL_PAGINATION_DETAILS:
      return {
        ...state,
        inactivePoll: action.payload.inactivePoll
      };
    case SET_CLOSED_POLL_PAGINATION_DETAILS:
      return {
        ...state,
        closedPoll: action.payload.closedPoll
      };
    case SET_PENDING_POLL_PAGINATION_DETAILS:
      return {
        ...state,
        pendingPoll: action.payload.pendingPoll
      };
    default:
      return state;
  }
}