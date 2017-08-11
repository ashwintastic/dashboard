import {
    BREADCRUMBS_RESET,
    BREADCRUMBS_APPEND
} from '../constants/actionTypes';

export function breadcrumbsReset() {

  return {
    type: BREADCRUMBS_RESET
  };
}

export function breadcrumbAppend(label, path) {
  return {
    type: BREADCRUMBS_APPEND,
    payload: {
      breadcrumb: {
        label,
        path
      }
    }
  };
}
