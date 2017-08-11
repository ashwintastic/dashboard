import 'babel-polyfill';
import ReactDOM from 'react-dom';
import FastClick from 'fastclick';
import UniversalRouter from 'universal-router';
import { readState, saveState } from 'history/lib/DOMStateStorage';
import injectTapEventPlugin from 'react-tap-event-plugin';
import routes from './routes';
import createHistory from './core/createHistory';
import configureStore from './store/configureStore';
import { auth } from './config';
import apiData from './utils/apiData';

import {
  addEventListener,
  removeEventListener,
  windowScrollX,
  windowScrollY,
} from './core/DOMUtils';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

const context = {
  store: null,
  insertCss: (...styles) => {
    const removeCss = styles.map(style => style._insertCss()); // eslint-disable-line no-underscore-dangle, max-len
    return () => {
      removeCss.forEach(f => f());
    };
  },
  setTitle: value => (document.title = value),
  setMeta: (name, content) => {
    // Remove and create a new <meta /> tag in order to make it work
    // with bookmarks in Safari
    const elements = document.getElementsByTagName('meta');
    Array.from(elements).forEach((element) => {
      if (element.getAttribute('name') === name) {
        element.parentNode.removeChild(element);
      }
    });
    const meta = document.createElement('meta');
    meta.setAttribute('name', name);
    meta.setAttribute('content', content);
    document
      .getElementsByTagName('head')[0]
      .appendChild(meta);
  },
};

// Restore the scroll position if it was saved into the state
function restoreScrollPosition({ state, hash }) {
  if (state && state.scrollY !== undefined) {
    window.scrollTo(state.scrollX, state.scrollY);
    return;
  }

  const targetHash = hash && hash.substr(1);
  if (targetHash) {
    const target = document.getElementById(targetHash);
    if (target) {
      window.scrollTo(0, windowScrollY() + target.getBoundingClientRect().top);
      return;
    }
  }

  window.scrollTo(0, 0);
}

let renderComplete = (location, callback) => {
  const elem = document.getElementById('css');
  if (elem) elem.parentNode.removeChild(elem);
  callback(true);
  renderComplete = (l) => {
    restoreScrollPosition(l);

    // Google Analytics tracking. Don't send 'pageview' event after
    // the initial rendering, as it was already sent
    if (window.ga) {
      window.ga('send', 'pageview');
    }

    callback(true);
  };
};

function render(container, location, component) {
  return new Promise((resolve, reject) => {
    try {
      ReactDOM.render(
        component,
        container,
        renderComplete.bind(undefined, location, resolve)
      );
    } catch (err) {
      reject(err);
    }
  });
}

function run() {
  const history = createHistory();
  const container = document.getElementById('app');
  const initialState = JSON.parse(
    document
      .getElementById('source')
      .getAttribute('data-initial-state')
  );
  let currentLocation = history.getCurrentLocation();

  // Make taps on links and buttons work fast on mobiles
  FastClick.attach(document.body);
  context.origin = window.location.origin;
  context.store = configureStore(initialState, { history });
  context.createHref = history.createHref;

  // Re-render the app when window.location changes
  async function onLocationChange(location) {
    const state = context.store.getState();
    // if (!(state && state.auth && state.auth.authenticated) && window.location.pathname !== '/') {
    //   console.log(context.store.getState('auth'))
    //   console.log('send user to login');
    //   history.replace('/');
    //   return;
    // }
    // Save the page scroll position into the current location's state
    if (currentLocation.key) {
      saveState(currentLocation.key, {
        ...readState(currentLocation.key),
        scrollX: windowScrollX(),
        scrollY: windowScrollY(),
      });
  }
  currentLocation = location;

  UniversalRouter.resolve(routes, {
    currentRoute: location.pathname,
    path: location.pathname,
    query: location.query,
    state: location.state,
    context,
    render: render.bind(undefined, container, location), // eslint-disable-line react/jsx-no-bind, max-len
  }).catch(err => console.error(err)); // eslint-disable-line no-console
}

// Add History API listener and trigger initial change
const removeHistoryListener = history.listen(onLocationChange);
history.replace(currentLocation);

// https://developers.google.com/web/updates/2015/09/history-api-scroll-restoration
let originalScrollRestoration;
if (window.history && 'scrollRestoration' in window.history) {
  originalScrollRestoration = window.history.scrollRestoration;
  window.history.scrollRestoration = 'manual';
}

// Prevent listeners collisions during history navigation
addEventListener(window, 'pagehide', function onPageHide() {
  removeEventListener(window, 'pagehide', onPageHide);
  removeHistoryListener();
  if (originalScrollRestoration) {
    window.history.scrollRestoration = originalScrollRestoration;
    originalScrollRestoration = undefined;
  }
});

}

function initializeFB() {
  window.fbAsyncInit = function () {
    FB.init({
      appId: auth.facebook.id,
      cookie: true,  // enable cookies to allow the server to access
      // the session
      xfbml: true,  // parse social plugins on this page
      version: 'v2.8', // use graph api version 2.8
    });
    run();
  };
  // Load the SDK asynchronously
  (function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = '//connect.facebook.net/en_US/sdk.js';
    fjs.parentNode.insertBefore(js, fjs);
  } (document, 'script', 'facebook-jssdk'));
}
// Run the application when both DOM is ready and page content is loaded
if (['complete', 'loaded', 'interactive'].includes(document.readyState) && document.body) {

  initializeFB();
} else {
  document.addEventListener('DOMContentLoaded', initializeFB, false);
}
