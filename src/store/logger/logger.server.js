import { inspect } from 'util';

// Server side redux action logger
export default function createLogger() {
  return store => next => action => { // eslint-disable-line no-unused-vars
    let payload = action ? action.payload : null;
    const formattedPayload = inspect(payload, {
      colors: true,
    });
    console.log(` * ${action && action.type}: ${formattedPayload}`); // eslint-disable-line no-console
    return next(action);
  };
}
