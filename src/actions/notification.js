import {
    NOTIFICATION_SET
} from '../constants/actionTypes';
import { notificationConfig } from '../config';
import {SUCCESS, ERROR} from '../noticationMessages/messages'

export function setErrorNotification(notificationMsg, config ={}){
  let configNotification = notificationConfig.error || {};
  Object.assign(configNotification, config);
  return setNotificationForType(configNotification, notificationMsg, ERROR);
}

export function setSuccessNotification(notificationMsg, config = {}){
  let configNotification = notificationConfig.success || {};
  Object.assign(configNotification, config);
  return setNotificationForType(configNotification, notificationMsg, SUCCESS);
}

function setNotificationForType(notificationConfig, notificationMsg, type){
  return {
    type: NOTIFICATION_SET,
    payload: {
      type,
      message: {...notificationConfig, label: notificationMsg},
    },
  };
}

/**
 * Do not use this, use the specific type instead.
 */
// TODO change the existing code to not use this.
export function setNotification(message, type) {
    return {
        type: NOTIFICATION_SET,
        payload: {
            type,
            message,
        },
    };
}
