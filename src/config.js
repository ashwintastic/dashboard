/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* eslint-disable max-len */
import { LogLevel } from 'botworx-utils/lib/logger';

export const port = process.env.PORT || 3000;
export const host = process.env.HOST || `localhost:${port}`;
export const linkHost = process.env.HOST || `localhost:3001`;

export const databaseUrl = process.env.DATABASE_URL || 'sqlite:database.sqlite';

export const resourceList = [
'user',
'account',
'bot',
'flow',
'broadcast',
'platformbot',
'tester',
'poll'
];

export const log = {
  app: { name: 'dashboard-logs', loglevel: LogLevel.DEBUG },
  db: { name: 'db-logs', loglevel: LogLevel.INFO }
};

export const db = {
  url: process.env.DB_URL || 'mongodb://localhost/botworx',
  aclUrl: process.env.DB_ACLURL || 'mongodb://localhost/acl',
  agendaUrl: process.env.DB_AGENDAURL || 'mongodb://localhost/agenda',
  config: {
    autoIndex: false
  }
};

export const elastic = {
  host: process.env.ELASTIC_HOST || "http://54.209.104.34:9200",
  log: 'error',
  botAnalytics: {
    index: 'chat_index',
    type: 'chat_details'
  }
};

export const analytics = {
  // https://analytics.google.com/
  google: {
    trackingId: process.env.ANALYTICS_GOOGLE_TRACKINGID // UA-XXXXX-X
  }
};

export const auth = {

  jwt: { secret: process.env.AUTH_JWT_SECRET || 'React Starter Kit' },

  // https://developers.facebook.com/
  facebook: {
    id: process.env.AUTH_FACEBOOK_APPID || '900617613376037',
    secret: process.env.AUTH_FACEBOOK_APPSECRET || '74e1312c4adb2572e7aa1b743805be9b',
    testPageId: process.env.AUTH_FACEBOOK_TESTPAGEID || '1201407956580516',
    graphApiBase: `https://graph.facebook.com/v2.8`
  },
};

export const botEngine = {
  url: process.env.BOTENGINE_URL || 'https://ia.botworx.ai'
};

export const mailerConfig = {
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // use SSL
  auth: {
    user: process.env.MAILERCONFIG_AUTH_USER,
    pass: process.env.MAILERCONFIG_AUTH_PASS
  }
};

export const botworx = {
  permissions: {
    required: {
      'manage_pages': 'Allow Botworx to manage your Pages so that bots can be deployed to them.',
      'pages_messaging': 'Allow Botworx to send messages from Pages you manage.',
      'pages_messaging_subscriptions': 'Allow Botworx to send messages from Pages you manage 24 hours or more after last interaction.',
      'pages_messaging_phone_number': 'Allow Botworx to send messages from Pages you manage to users using their phone number.',
      'pages_messaging_payments': 'Allow Botworx to enables user payments within your bots.',
      'read_page_mailboxes': 'Allow Botworx to read from the Page Inboxes of the Pages you manage. This permission does not let your app read the page owner\'s mailbox.It only applies to the page\'s mailbox.'
    },
    optional: {
    }
  }
};

export const notificationConfig = {
  success: {
    autoDismiss: 5,
    position: 'tr'
  },
  error: {
    autoDismiss: 10,
    position: 'tr'
  }
};

export const userRoleList = {
  SuperAdmin: {
    createRole: ['SuperAdmin', 'BotworxAdmin', 'AccountOwner', 'AccountEditor', 'BotOwner', 'BotEditor']
  },
  BotworxAdmin: {
    createRole: ['BotworxAdmin', 'AccountOwner', 'AccountEditor', 'BotOwner', 'BotEditor']
  },
  AccountOwner: {
    createRole: ['AccountOwner', 'AccountEditor', 'BotOwner', 'BotEditor']
  },
  AccountEditor: {
    createRole: ['AccountEditor', 'BotOwner', 'BotEditor']
  },
  BotOwner: {
    createRole: ['BotOwner', 'BotEditor']
  },
  BotEditor: {
    createRole: ['BotEditor']
  }
};

export const POLL_STATUS = {
  ACTIVE:'active',
  CLOSED:'closed',
  PENDING:'pending',
  INACTIVE:'inactive'
};

export const INITIAL_PAGING_DETAILS = {
  page: 1,
  size: 10
};

export const flowEditWhitelistUrl = 'https://s3.amazonaws.com/botworx-test-apis/whitelisted_botids_for_flow_uploader.json';

// token expires in 24 hrs
export const appConfig = {
  tokenExpiryInMins: 24 * 60,
  loginPage: '/',
  // adding api list on which
  // TODO: remove authfail=true (we should not need that once we start using api)
  unAuthenticatedPaths: [
    '/login',
    '/login/forgot',
    /^\/(\?.*)?$/, // base path('/') with optional query params, eg. '/', '/?a=1' etc.
    '/logout',
    '/?authfail=true',
    /^\/user\/reset\-password/,
    /^\/testing\/.*/,
    /\/reset\-password/,
    /^\/api\/pollsummary.*/,
    /^\/poll_summary.*/,
    /\/setPassword/,
    '/api/login'
  ]
}

export const dateDisplayFormatType = {
  TIME_12HR: 'hh:mm A',
  TIME_24HR: 'HH:mm',
  LONG_TIME: 'hh:mm:ss A',
  DATE:'YYYY-MM-DD',
  DATE_TIME: 'YYYY-MM-DD hh:mm A',
  FULL_DATE_TIME:'MMM DD, hh:mm:ss A'
}
