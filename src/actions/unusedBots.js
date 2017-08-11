/* eslint-disable import/prefer-default-export */
import {
  UBOTS_FETCH_BOTS_FAILED,
  UBOTS_FETCHED_BOTS,
  UBOTS_FETCHING_BOTS,
} from '../constants/actionTypes';

import apiActionFactory from './factory/apiActionFactory';

const unusedBotsActions = apiActionFactory({
  fetchingActionType: UBOTS_FETCHING_BOTS,
  fetchedActionType: UBOTS_FETCHED_BOTS,
  fetchFailedActionType: UBOTS_FETCH_BOTS_FAILED,
  fetchApi: '/api/bots/unused',
  transform: ({ bots }) => ({
    bots: bots.map(b => ({
      id: b._id,
      name: b.name
    }))
  })
});

export function fetchUnusedBots() {
  return unusedBotsActions.fetchThunk;
}
