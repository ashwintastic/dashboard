import {
  FETCHING_BOT_POLLS,
  FETCHED_BOT_POLLS,
  FETCH_BOT_POLLS_FAILED,
  SET_POLL_DATA,
  SET_LANGUAGES_LIST,
  SET_POLL_BROADCAST_DATA,
  EDIT_POLL_BROADCAST_FLAG,
} from '../constants/actionTypes';

const pollState = {
  activePolls: [],
  inActivePolls: [],
  closedPolls: [],
  pendingPolls: [],
  fetchingPolls: false,
  currentPoll: null,
  languagesList: [],
  pollBroadcast: {},
  editBroadcastFlag: false,
};

function botPolls(state = pollState, action = null) {
  switch (action.type) {
    case SET_LANGUAGES_LIST:
      return {
        ...state,
        languagesList: action.payload.list,
      };
    case EDIT_POLL_BROADCAST_FLAG:
      return {
        ...state,
        editBroadcastFlag: action.payload.editBroadcastFlag,
      };
    case SET_POLL_BROADCAST_DATA:
      return {
        ...state,
        pollBroadcast: action.payload.pollBroadcastData,
      };

    case FETCHING_BOT_POLLS:
      return {
        ...state,
        fetchingPolls: true,
      };

    case FETCH_BOT_POLLS_FAILED:
      return {
        ...state,
        fetchingPolls: false,
      };

    case FETCHED_BOT_POLLS:
      return {
        ...state,
        activePolls: action.payload.activePolls,
        inActivePolls: action.payload.inActivePolls,
        closedPolls: action.payload.closedPolls,
        pendingPolls: action.payload.pendingPolls,
      };
    case SET_POLL_DATA:
      return {
        ...state,
        currentPoll: action.payload.pollData
      };
    default:
      return state;
  }
}
export default botPolls;
