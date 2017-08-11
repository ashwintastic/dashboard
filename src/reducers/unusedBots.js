import {
  UBOTS_FETCH_BOTS_FAILED,
  UBOTS_FETCHED_BOTS,
  UBOTS_FETCHING_BOTS
} from '../constants/actionTypes';

const unusedBotsState = {
  fetching: false,
  bots: [],
};

export default function unusedBots(state = unusedBotsState, action = null) {
  switch (action.type) {
  case UBOTS_FETCH_BOTS_FAILED:
    return {
      fetching: false,
      bots: state.bots
    };

  case UBOTS_FETCHING_BOTS:
    return {
      fetching: true,
      bots: state.bots
    };

  case UBOTS_FETCHED_BOTS:
    return {
      fetching: false,
      bots: action.payload.bots
    };

  default: return state;
  }
}
