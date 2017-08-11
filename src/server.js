/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import 'babel-polyfill';
import path from 'path';
import expressStaticGzip from "express-static-gzip";
import url from 'url';

import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import expressJwt from 'express-jwt';
// import expressGraphQL from 'express-graphql';
import jwt from 'jsonwebtoken';
import React from 'react';
import ReactDOM from 'react-dom/server';
import UniversalRouter from 'universal-router';
import PrettyError from 'pretty-error';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import moment from 'moment';

import Html from './components/Html';
//import HtmlSimple from './components/HtmlSimple';
import { ErrorPageWithoutStyle } from './pages/error/ErrorPage';
import errorPageStyle from './pages/error/ErrorPage.css';
import passport from './core/passport';
import logger from './core/logger';
import routes from './routes';
import createHistory from './core/createHistory';
import assets from './assets.json'; // eslint-disable-line import/no-unresolved
import configureStore from './store/configureStore';
import { setRuntimeVariable } from './actions/runtime';
import { appConfig, port, auth, db, host, POLL_STATUS, botEngine, linkHost, flowEditWhitelistUrl } from './config';
import accountService from './service/AccountService';
import userService from './service/UserService';
import botService from './service/BotService';
import flowService from './service/FlowService';
import broadcastService from './service/BroadcastService';
import userAccessService from './service/UserAccessService';
import mailerService from './service/MailerService';
import pollingService from './service/PollService';
import logoImage from './components/Header/logo_full.png';
import loadingImage from './components/Chart/gif-load.gif';
import testlinkService from './service/TestlinkService';
import flowOverridesService from './service/FlowOverridesService';
import webUpdatesService from './service/WebUpdatesService';
import referralService from './service/ReferralService';
import { crypto } from './utils/crypto';
import * as appConstants from './constants/app';
import Promise from 'bluebird';
import {
    execCreateAccountAction,
    execDeleteAccountAction,
    execEditAccountAction,
    execReadAccountAction,
    execViewAnalyticsAction,
    execViewBotsAction
} from './apiSecurity/Account';
import {
    execCreateBotAction,
    execDeleteBotAction,
    execEditBotAction,
    execReadBotAction,
    execDeployBotAction,
    execViewBroadcastsAction,
    execViewFlowsAction,
    execViewPollsAction
} from './apiSecurity/Bot';
import {
    execReadPollAction,
    execActivatePollAction,
    execClosePollAction,
    execCreatePollAction,
    execDeactivatePollAction,
    execDeletePollAction,
    execSavePollAction,
    execViewPollBroadcastAction
} from './apiSecurity/Poll';
import { execCreatePlatformBotAction, execReadPlatformBotAction, execRemovePlatformBotAction } from './apiSecurity/PlatformBot';
import { execCreateBroadcastAction, execDeleteBroadcastAction, execReadBroadcastAction } from './apiSecurity/Broadcast';
import {
    execActivateFlowAction,
    execUpsertFlowAction,
    execCloneFlowAction,
    execDeleteFlowAction,
    execReadFlowAction,
    execRevertFlowAction,
    execViewTestersAction,
    execSaveFlowAction
} from './apiSecurity/Flow';
import { execChangeTestLinkStatusAction, execCreateTestLinkAction, execDeleteTestLinkAction } from './apiSecurity/Testlink';
import {
    execCreateUserAction,
    execDeleteUserAction,
    execSaveUserAction,
    execViewAccountsAction,
    execViewUsersAction
} from './apiSecurity/User';

import {
    execCreateSubscriptionAction,
    execDeleteSubscriptionAction,
    execSaveSubscriptionAction,
    execReadSubscriptionAction
} from './apiSecurity/Subscription';

var generatePassword = require('password-generator');
import {
    accountRouter,
    facebookRouter,
    testingRouter,
    schemaRouter,
    pollTestingRouter,
    pollSummaryRouter
} from './apis';
import { PermissionType } from './constants/entityPermissions';
import { entityType } from './constants/entityType';
import metrics from './constants/metrics';
import _ from 'lodash';

import {
    removeRole
} from './apiSecurity/commonApi';

var fetch = require('node-fetch');
const app = express();


// importing acl
var node_acl = Promise.promisifyAll(require('acl'));
var acl;
var allowedRoles;
var CryptoJS = require("crypto-js");

var mongodb = require('mongodb');

// Setting up node_acl
async function authorization_setup(error, db) {

    var mongoBackend = new node_acl.mongodbBackend(db, 'acl_');

    // Create a new access control list by providing the mongo backend

    acl = new node_acl(mongoBackend);

    // Defining roles and routes
    const systemRoles = await userService.getAllUserRoles();
    const allows = [];
    systemRoles.map(x => {
        delete x._id;
        allows.push(x);
    })
    allowedRoles = allows;
    acl.allow(allowedRoles);
}

export function getAllowedPermissions(userRole, entity) {
    var allowedPerms = [];
    allowedRoles.map(x => {
        if ((x.roles).indexOf(userRole) !== -1) {
            (x.allows).map(y => {
                if ((y.resources).indexOf(entity) !== -1) {
                    allowedPerms = y.permissions;
                    return;
                }
            })
        }
    })

    return allowedPerms;
}

// Connecting to mongo database and setup authorization
mongodb.connect(db.aclUrl, authorization_setup);

export async function getUserRole(userId) {
    const currentUserRole = (await userAccessService.getUserAccessDoc(userId))[0].role;
    return currentUserRole;
}

export async function getUserAccessDocs(userId) {
    const userAccessDocs = await userAccessService.getUserAccessDoc(userId);
    return userAccessDocs;
}



// update the express res to set-cookie with jwt token
async function authSuccess(user, res) {
    const tokenExpiryInSec = appConfig.tokenExpiryInMins * 60;
    const userId = user.id || user._id; // TODO convert _id to id or vice-versa
    const currentUserRole = await getUserRole(userId);
    const token = jwt.sign({
        id: userId,
        email: user.email,
    }, auth.jwt.secret, { expiresIn: tokenExpiryInSec });

    res.cookie('id_token', token, { maxAge: tokenExpiryInSec * 1000, httpOnly: true });
    if (currentUserRole) {
        acl.addUserRoles(userId, currentUserRole);
    }
    acl.allow(allowedRoles);
    return res;
}

const loginSuccess = async (req, res) => {
    return authSuccess(req.user, res);
};

const resetPasswordSuccess = async (user, res) => {
    return authSuccess(user, res);
};

//
// Tell any CSS tooling (such as Material UI) to use all vendor prefixes if the
// user agent is not known.
// -----------------------------------------------------------------------------
global.navigator = global.navigator || {};
global.navigator.userAgent = global.navigator.userAgent || 'all';

//
// Register Node.js middleware
// -----------------------------------------------------------------------------
app.use("/assets", expressStaticGzip(path.join(__dirname, 'public/assets')));

app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//
// Authentication
// -----------------------------------------------------------------------------

const unAuthenticatedPaths = appConfig.unAuthenticatedPaths;

app.use(expressJwt({
    secret: auth.jwt.secret,
    credentialsRequired: true,
    getToken: req => req.cookies.id_token,
}).unless({ path: unAuthenticatedPaths }));

app.get(
    '/logout',
    async (req, res) => {
        if (req.user) {
            const currentUserRole = await getUserRole(req.user.id);
            removeRole(acl, req.user.id, currentUserRole);
        }
        res.clearCookie('id_token');
        res.redirect('/');
    }
);

app.get(
    '/sessionstatus',
    (req, res) => {
        const sessionState = (typeof (req.cookies.id_token) === "undefined");
        res.send(sessionState);
    }
);

// change tester status
app.put(
    '/api/testlink/:testlinkId/status/:status',
    async (req, res) => {
        const apiResponse = await execChangeTestLinkStatusAction(acl, req.user.id, entityType.TESTER, PermissionType.CHANGE_TESTLINK_STATUS, req.params);
        res.status(apiResponse.status).send(apiResponse.data);
    });

// delete flow tester
app.delete(
    '/api/flow/:flowId/testlink/deletetester/:testerId',
    async (req, res) => {
        const apiResponse = await execDeleteTestLinkAction(acl, req.user.id, entityType.TESTER, PermissionType.DELETE_TESTLINK, req.params);
        res.status(apiResponse.status).send(apiResponse.data);
    });

/*

  // GET /
app.get('/', function (req, res) {
  res.render('layout', {
    content: ReactDOMServer.renderToString(<HelloWorld />)
  });
});

*/

app.use(passport.initialize());

app.post(
    '/login',
    async (req, res, next) => {
        passport.authenticate('local', async (err, user, info) => {
            if (err) {
                return next(err);
            }
            if (!user) {
                let failureRedirectUri = `/?authfail=true`;
                failureRedirectUri += req.query.redirect_uri ? `&redirect_uri=${req.query.redirect_uri}` : '';
                return res.redirect(failureRedirectUri);
            }
            req.user = user;
            await loginSuccess(req, res);
            const redirectUri = req.query.redirect_uri ? decodeURIComponent(req.query.redirect_uri) : '/accounts';
            res.redirect(redirectUri);

        })(req, res, next);
    }
);

// app.post(
//     '/login',
//     passport.authenticate('local', { failureRedirect: `/?authfail = true & redirect_uri=${req.query.redirect_uri } `, session: false }),
//     async (req, res) => {
//         await loginSuccess(req, res);
//         const redirectUri = req.query.redirect_uri ? decodeURIComponent(req.query.redirect_uri) : '/accounts';
//         res.redirect(redirectUri);
//     }
// );

app.post(
    '/api/login',
    passport.authenticate('local', { session: false }),
    async (req, res) => {
        console.log("success");
        await loginSuccess(req, res);
        res.send({
            success: true
        });
    }
);


// app.post('/login', function(req, res, next) {
//   passport.authenticate('local', function(err, user, info) {
//     if (err) {
//       return next(err); // will generate a 500 error
//     }
//     // Generate a JSON response reflecting authentication status
//     if (! user) {
//       return res.send(401,{ success : false, message : 'authentication failed' });
//     }
//     req.login(user, function(err){
//       if(err){
//         return next(err);
//       }
//       return res.send({ success : true, message : 'authentication succeeded' });
//     });
//   })(req, res, next);
// });


app.get('/login/facebook',
    passport.authenticate('facebook', {
        //scope: ['email', 'user_location'],
        scope: ['email'], // removing user loaction as it is not needed for now
        session: false,
    })
);

app.get('/login/facebook/return',
    passport.authenticate('facebook', { failureRedirect: '/', session: false }),
    async (req, res) => {
        await loginSuccess(req, res);
        res.redirect('/accounts');
    }
);

async function getCurrentUser(reqUser) {
    const user = await userService.findUser(reqUser.id);
    const accounts = await accountService.findAccountByAdmin(user);
    const currentUserRole = await getUserRole(reqUser.id);
    return {
        id: reqUser.id,
        email: user.email,
        firstName: user.FirstName,
        lastName: user.LastName,
        password: user.auth.local ? user.auth.local.password : '',
        roles: currentUserRole
    }
}

app.get('/api/userDetails', async (req, res) => {
    console.log('in userdeatils --- ', req.user)
    let user = {};
    if (req.user) {
        console.log('fetch curren  user userdeatils --- ', req.user)
        user = await getCurrentUser(req.user)
        res.send(user);
    } else {
        res.send({
            email: null,
        });
    }
});


//change user password
app.post('/api/user/changepassword', async (req, res) => {
    const newPassword = (CryptoJS.MD5(req.body.newPassword)).toString();
    const oldPassword = req.body.oldPassword;
    try {
        const user = await userService.findUser(req.user.id);
        if (user.auth.local.password == oldPassword) {
            user.auth.local.password = newPassword;
            await userService.save(user);
            res.status(200).send({});
        }
        else {
            res.status(401).send({ data: 'Current password validation failed.' });
        }
    }
    catch (e) {
        console.log(e);
        res.send({ e });
    }
});

//change user basic info
app.post('/api/user/basicinfo', async (req, res) => {
    const userInfo = req.body.userInfo;
    try {
        const user = await userService.findUser(req.user.id);
        user.FirstName = userInfo.FirstName;
        user.LastName = userInfo.LastName;
        await userService.save(user);
        res.status(200).send({});
    }
    catch (e) {
        console.log(e);
        res.send({ e });
    }
});

// initialize bots to update persistent menu
app.get('/api/initialize/bots/:botId', async (req, res) => {
    const botId = req.params.botId;
    try {
        const fetchUrl = botEngine.url + '/initializebots/' + botId;
        const res = await fetch(fetchUrl);
        res.send({});
    }
    catch (e) {
        console.log(e);
        res.send({ e });
    }
});

// reset password
app.post(
    '/api/user/:mailId/setPassword',
    async (req, res) => {
        const mailId = req.params.mailId;
        const user = await userService.getDashboardUserByMail(mailId);
        if (user) {
            const userName = user.FirstName || ''
            const expiryTime = moment().add(8, 'hours').toDate();
            const resetPasswordDoc = await userService.addResetPasswordLink(mailId, expiryTime);

            const data = { expiry: expiryTime, id: resetPasswordDoc._id };
            const encryptedData = crypto.encryptAesBase64(JSON.stringify(data), true);

            const resetLink = `${linkHost}/reset-password?${appConstants.encryption.PARAM_NAME}=${encryptedData}`
            await sendResetPasswordLink(userName, mailId, expiryTime, resetLink);
            res.status(200).send({});
        }
        else {
            res.status(404).send({});
        }
    }
);

/**
 * Get the reset data for the given encrypted string
 *
 * @param {any} encryptedData
 * @returns
 * @throws Will throw an error if the decryption fails (eg. invalid data)
 */
async function getResetLinkData(encryptedData) {
    logger.debug('encrypted data', encryptedData)
    const decryptedData = JSON.parse(crypto.decryptAesBase64(encryptedData, true));

    // check if link is expired or not first
    if (moment(decryptedData.expiry) < moment().toDate()) {
        return null;
    }
    const link = await userService.getResetLinkData(decryptedData.id);
    const user = await userService.getDashboardUserByMail(link.email);

    // if we could not find resetlink data, then the link might be already used or invalid
    // if we could not find user, then the email in the link might be invalid
    if (!(link && user)) {
        return null;
    }

    return { link, user };
}

// save new password in db on successful reset of password
app.post(
    '/api/reset-password',
    async (req, res) => {
        try {
            const encryptedData = req.query[appConstants.encryption.PARAM_NAME];
            const resetLinkData = await getResetLinkData(encryptedData);
            if (!resetLinkData) {
                throw new Error('Unable to find resetlink.');
                return;
            }
            const email = resetLinkData.link.email;
            let newPassword = req.body.newPassword;
            const userData = await userService.getDashboardUserByMail(email);

            if (userData) {
                userData.auth.local.password = (CryptoJS.MD5(newPassword)).toString();
                await userService.save(userData);
                await userService.deleteResetPasswordLink(email);
                res.status(200).send({});
            }
            throw new Error('Unable to find userdata.');
        } catch (err) {
            const statusCode = 401;
            res.status(statusCode).send(getErrorPage({ message: 'Unable to reset password.', statusCode, err }));
        }
    });

app.get(
    '/reset-password',
    async (req, res) => {
        try {
            let pageResponse = '';
            const encryptedData = req.query[appConstants.encryption.PARAM_NAME];

            if (await getResetLinkData(encryptedData)) {
                res.redirect(`/user/reset-password?${appConstants.encryption.PARAM_NAME}=${encryptedData}`);
                return;
            }
            logger.debug('Link is invalid');
            throw new Error('Invalid link');
        } catch (err) {
            const statusCode = 401;
            res.status(statusCode).send(getErrorPage({ message: 'Please check if the link is valid.', statusCode, err }));
        }
    });

// Send reset password link to users
async function sendResetPasswordLink(UserName, email, expiryTime, resetLink) {
    const subject = `Botworx Password Reset`;
    const body = `
                <p>Hi ${UserName},</p>
                <p>
                    Here is the link to reset your password:
                </p >
                <a href='${resetLink}'>${resetLink}</a>
                <p>This link is good upto <b>${expiryTime}</b> and can only be used once.</p>
                <p>If you didn't request this, you can ignore this email. Your password won't change until you create a new password.</p>
                <p>
                    <span>Regards,</span>
                    <br />
                    <span>Botworx</span>
                </p>`;
    return mailerService.sendMail('test@botworx.ai', subject, body, [email]);
}

// get users associated with account
app.get('/api/accounts/:accountId/userlist', async (req, res) => {
    const apiResponse = await execViewUsersAction(acl, req.user.id, entityType.ACCOUNT, PermissionType.VIEW_USERS, req.params.accountId, req.user.email);
    res.status(apiResponse.status).send(apiResponse.data);
});

// get users associated with bot
app.get('/api/bots/:botId/userlist', async (req, res) => {
    const apiResponse = await execViewUsersAction(acl, req.user.id, entityType.BOT, PermissionType.VIEW_USERS, req.params.botId, req.user.email);
    res.status(apiResponse.status).send(apiResponse.data);
});


// get all users
app.get('/api/userlist', async (req, res) => {
    const allUsers = await userService.getAllUsers();
    res.send({ allUsers });
});

// create new account user
app.post(
    '/api/accounts/:accountId/userlist',
    async (req, res) => {
        const apiResponse = await execCreateUserAction(acl, req.user.id, entityType.USER, PermissionType.CREATE_USER, req.body);
        res.status(apiResponse.status).send(apiResponse.data);
    }
);

// create new bot user
app.post(
    '/api/accounts/:accountId/bots/:botId/userlist',
    async (req, res) => {
        const apiResponse = await execCreateUserAction(acl, req.user.id, entityType.USER, PermissionType.CREATE_USER, req.body);
        res.status(apiResponse.status).send(apiResponse.data);
    }
);

// save existing userdata
app.post(
    '/api/accounts/:accountId/edituser/:userId',
    async (req, res) => {
        const apiResponse = await execSaveUserAction(acl, req.user.id, entityType.USER, PermissionType.SAVE_USER, req.body, req.params.userId);
        res.status(apiResponse.status).send(apiResponse.data);
    }
);

// remove account user
app.delete(
    '/api/accounts/:accountId/userlist/:userId',
    async (req, res) => {
        const apiResponse = await execDeleteUserAction(acl, req.user.id, entityType.USER, PermissionType.DELETE_USER, req.params.accountId, req.params.userId);
        res.status(apiResponse.status).send(apiResponse.data);
    }
);

// remove bot user
app.delete(
    '/api/bots/:botId/userlist/:userId',
    async (req, res) => {
        const apiResponse = await execDeleteUserAction(acl, req.user.id, entityType.USER, PermissionType.DELETE_USER, req.params.botId, req.params.userId);
        res.status(apiResponse.status).send(apiResponse.data);
    }
);

// save account data
app.post(
    '/api/accounts/editAccount/:accountId',
    async (req, res) => {
        const apiResponse = await execEditAccountAction(acl, req.user.id, entityType.ACCOUNT, PermissionType.EDIT_ACCOUNT, req.body.accountEntry, req.params.accountId);
        res.status(apiResponse.status).send(apiResponse.data);
    }
);

// create new account
app.post(
    '/api/accounts/createAccount',
    async (req, res) => {
        const accountDetail = req.body.accountEntry;
        accountDetail.manager = 'dummyManager';
        const apiResponse = await execCreateAccountAction(acl, req.user.id, entityType.ACCOUNT, PermissionType.CREATE_ACCOUNT, accountDetail);
        res.status(apiResponse.status).send(apiResponse.data);

    }
);

// delete existing account
app.delete(
    '/api/accounts/:accountId',
    async (req, res) => {
        const apiResponse = await execDeleteAccountAction(acl, req.user.id, entityType.ACCOUNT, PermissionType.DELETE_ACCOUNT, req.params.accountId);
        res.status(apiResponse.status).send(apiResponse.data);
    }
);

// get accounts list
app.get(
    '/api/accounts/list/:userId',
    async (req, response) => {
        const apiResponse = await execViewAccountsAction(acl, req.user.id, entityType.USER, PermissionType.VIEW_ACCOUNTS);
        response.send(apiResponse.status, apiResponse.data);
    });

app.get(
    '/api/accounts/:accountId',
    async (req, res) => {
        const apiResponse = await execReadAccountAction(acl, req.user.id, entityType.ACCOUNT, PermissionType.READ_ACCOUNT, req.params.accountId);
        res.status(apiResponse.status).send(apiResponse.data);
    }
);

// adding api to get all flows
app.get(
    '/api/accounts/:accountId/flowlist',
    async (req, res) => {
        const allFlows = await flowService.getAllFlows();
        res.send({ allFlows });
    }
);

// api to get all web updates
app.get(
    '/api/accounts/:accountId/bots/:botId/webupdates',
    async (req, res) => {
        const allWebUpdates = await webUpdatesService.getAllWebUpdates(req.params.botId);
        console.log(allWebUpdates);
        res.send({ allWebUpdates });
    }
);

app.get(
    '/api/accounts/:accountId/bots/:botId/referrals',
    async (req, res) => {
        let botId = req.params.botId;
        if (botId.toLowerCase() === 'all') {
            botId = '';
        }
        const referrals = await referralService.getReferrals(req.params.accountId, botId);
        let referralsMap = {};
        referrals.forEach((val) => {
            referralsMap[val.encryptedRefId] = val.name;
        });
        res.send({ referralsMap });
    }
);
// app.use('/api/accounts', accountRouter);

// adding api to create new bot

app.post(
    '/api/accounts/:accountId/botlist',
    async (req, res) => {
        const apiResponse = await execCreateBotAction(acl, req.user.id, entityType.BOT, PermissionType.CREATE_BOT, req.body);
        res.status(apiResponse.status).send(apiResponse.data);
    });

// adding api to save bot data

app.post(
    '/api/accounts/:accountId/botlist/:botId',
    async (req, res) => {
        const apiResponse = await execEditBotAction(acl, req.user.id, entityType.BOT, PermissionType.EDIT_BOT, req.params.botId, req.body.botName, req.body.description);
        res.status(apiResponse.status).send(apiResponse.data);
    });

// get subscription nodes for account
app.get(
    '/api/subscription_broadcast/accounts/:accountId/',
    async (req, res) => {
        const apiResponse = await execReadSubscriptionAction(acl, req.user.id, entityType.SUBSCRIPTION, PermissionType.READ_SUBSCRIPTION, null, req.params.accountId);
        res.status(apiResponse.status).send(apiResponse.data);
    }
);

// get subscription nodes for bot
app.get(
    '/api/subscription_broadcast/accounts/:accountId/bots/:botId',
    async (req, res) => {
        // const subscriptionEntries = await broadcastService.getSubscriptionsForBot(req.params.botId);
        // res.send({
        //     subscriptionEntries,
        // });
        const apiResponse = await execReadSubscriptionAction(acl, req.user.id, entityType.SUBSCRIPTION, PermissionType.READ_SUBSCRIPTION, req.params.botId);
        res.status(apiResponse.status).send(apiResponse.data);
    }
);

// get all broadcast entries for bot
app.get(
    '/api/broadcast/accounts/:accountId/bots/:botId',
    async (req, res) => {
        const apiResponse = await execViewBroadcastsAction(acl, req.user.id, entityType.BOT, PermissionType.VIEW_BROADCASTS, req.params.botId);
        res.status(apiResponse.status).send(apiResponse.data);
    }
);

// get selected flow nodes
app.get(
    '/api/broadcast/existingflownodes/accounts/:accountId/bots/:botId',
    async (req, res) => {
        const bot = await botService.getBotData(req.params.botId);
        const flowId = bot.flowId;
        const flow = await flowService.getFlowData(flowId);
        const existingFlowNodes = Object.keys(flow.nodes);
        res.send({
            existingFlowNodes,
        });
    }
);

// getting flow nodes and broadcast nodes for a bot/account
app.get(
    '/api/nodes/accounts/:accountId/bots/:botId',
    async (req, res) => {
        const botId = req.params.botId;
        let bots = [];
        let allNodes = [];
        if (botId.toLowerCase() === 'all') {
            const userRole = await getUserRole(req.user.id);
            const apiResponse = await execViewBotsAction(acl, req.user.id, userRole, entityType.BOT, PermissionType.VIEW_BOTS, req.params.accountId);
            bots = apiResponse.data.bots;
            for (var i=0, len=bots.length, bot; i<len; i++) {
                bot = bots[i];
                const allNodesForBot = await getNodesForBot(bot);
                allNodes = allNodes.concat(allNodesForBot);
            }
        } else {
            const bot = await botService.getBotData(botId);
            allNodes = await getNodesForBot(bot);
        }
        allNodes = _.sortBy(allNodes);
        allNodes = _.sortedUniq(allNodes);

        res.send({
            allNodes
        });
    }
);

async function getNodesForBot(bot) {
    const botId = bot._id;
    const flowId = bot.flowId;
    let existingFlowNodes = [];
    if (flowId) {
        const flow = await flowService.getFlowData(flowId);
        if (flow) {
            existingFlowNodes = Object.keys(flow.nodes);
        }
    }

    const broadcastsForBot = await broadcastService.getBroadcastNodeEntryForBot(botId);
    let existingBroadcastNodes = [];
    broadcastsForBot.forEach(function(val, i){
        if (val) {
            existingBroadcastNodes = existingBroadcastNodes.concat(Object.keys(val.nodes));
        }
    });
    let allNodesForBot = existingFlowNodes.concat(existingBroadcastNodes);
    return allNodesForBot;
};

// create/edit broadcast entry
app.post(
    '/api/broadcast/accounts/:accountId/bots/:botId',
    async (req, res) => {
        const apiResponse = await execCreateBroadcastAction(acl, req.user.id, entityType.BROADCAST, PermissionType.CREATE_BROADCAST, req.params.botId, req.body.broadcastEntry);
        res.status(apiResponse.status).send(apiResponse.data);
    }
);

// get broadcast data
app.get(
    '/api/broadcast/accounts/:accountId/bots/:botId/:broadcastId',
    async (req, res) => {
        const apiResponse = await execReadBroadcastAction(acl, req.user.id, entityType.BROADCAST, PermissionType.READ_BROADCAST, req.params.broadcastId);
        res.status(apiResponse.status).send(apiResponse.data);
    }
);

// delete broadcast entry
app.delete(
    '/api/broadcast/accounts/:accountId/bots/:botId/:broadcastId',
    async (req, res) => {
        const apiResponse = await execDeleteBroadcastAction(acl, req.user.id, entityType.BROADCAST, PermissionType.DELETE_BROADCAST, req.params.broadcastId);
        res.status(apiResponse.status).send(apiResponse.data);
    }
);

// getting botlist
app.get(
    '/api/accounts/:accountId/bots',
    async (req, res) => {
        const userRole = await getUserRole(req.user.id);
        const apiResponse = await execViewBotsAction(acl, req.user.id, userRole, entityType.BOT, PermissionType.VIEW_BOTS, req.params.accountId);
        res.status(apiResponse.status).send(apiResponse.data);
    }
);

// adding api to delete selected bot
app.delete(
    '/api/accounts/:accountId/botlist/:botId',
    async (req, res) => {
        const apiResponse = await execDeleteBotAction(acl, req.user.id, entityType.BOT, PermissionType.VIEW_BOTS, req.params.botId);
        res.status(apiResponse.status).send(apiResponse.data);
    });


// display polls for pagination
app.get(
    '/api/accounts/:accountId/bots/:botId/pollList',
    async (req, res) => {
        const apiResponse = await execViewPollsAction(acl, req.user.id, entityType.BOT, PermissionType.VIEW_POLLS, req.params.botId, req.query);
        res.status(apiResponse.status).send(apiResponse.data);
    }
);

// get poll data
app.get(
    '/api/bots/:botId/polls/:pollId',
    async (req, res) => {
        const apiResponse = await execReadPollAction(acl, req.user.id, entityType.POLL, PermissionType.READ_POLL, req.params);
        res.status(apiResponse.status).send(apiResponse.data);
    }
);

//get poll broadcast data
app.get(
    '/api/poll/:pollId/broadcastData',
    async (req, res) => {
        const pollId = req.params.pollId;
        const pollBroadcastData = await broadcastService.getPollBroadcastData(pollId);
        res.send({ pollBroadcastData });
    }
);

// delete existing polls
app.delete(
    '/api/bots/:botId/pollList/:pollId',
    async (req, res) => {
        const apiResponse = await execDeletePollAction(acl, req.user.id, entityType.POLL, PermissionType.DELETE_POLL, req.params);
        res.status(apiResponse.status).send(apiResponse.data);
    });

// close selected poll
app.post(
    '/api/bots/:botId/pollList/:pollId/close',
    async (req, res) => {
        const apiResponse = await execClosePollAction(acl, req.user.id, entityType.POLL, PermissionType.CLOSE_POLL, req.params);
        res.status(apiResponse.status).send(apiResponse.data);
    });

// get languages list
app.get(
    '/api/languagesList',
    async (req, res) => {
        const languagesList = pollingService.getAllLanguages();
        res.send({ languagesList });
    }
);

// save poll data
app.post(
    '/api/bots/:botId/polls/:pollId/save',
    async (req, res) => {
        const apiResponse = await execSavePollAction(acl, req.user.id, entityType.POLL, PermissionType.SAVE_POLL, req.params, req.body.poll);
        res.status(apiResponse.status).send(apiResponse.data);
    });

// activate pending polls
app.post(
    '/api/bots/:botId/pollList/:pollId/open',
    async (req, res) => {
        const apiResponse = await execActivatePollAction(acl, req.user.id, entityType.POLL, PermissionType.ACTIVATE_POLL, req.params);
        res.status(apiResponse.status).send(apiResponse.data);
    });

// deactivate pending polls
app.post(
    '/api/bots/:botId/pollList/:pollId/inactive',
    async (req, res) => {
        const apiResponse = await execDeactivatePollAction(acl, req.user.id, entityType.POLL, PermissionType.DEACTIVATE_POLL, req.params);
        res.status(apiResponse.status).send(apiResponse.data);
    });

//create bot Polls
app.post(
    '/api/bots/:botId/createPoll',
    async (req, res) => {
        const apiResponse = await execCreatePollAction(acl, req.user.id, entityType.POLL, PermissionType.CREATE_POLL, req.params, req.body.poll);
        res.status(apiResponse.status).send(apiResponse.data);
    });

// get poll broadcasts
app.get(
    '/api/bots/:botId/polls/:pollId/pollBroadcast',
    async (req, res) => {
        const apiResponse = await execViewPollBroadcastAction(acl, req.user.id, entityType.POLL, PermissionType.VIEW_POLL_BROADCASTS, req.params);
        res.status(apiResponse.status).send(apiResponse.data);
    }
);

// get all platform bots
app.get(
    '/api/allPlatformBots',
    async (req, res) => {
        const allPlatformBots = await botService.getAllPlatformBots();
        res.send({ allPlatformBots });
    }
);

// adding api to create new platform bot
app.post(
    '/api/accounts/:accountId/bots/:botId/platformbot',
    async (req, res) => {
        const apiResponse = await execCreatePlatformBotAction(acl, req.user.id, entityType.PLATFORMBOT, PermissionType.CREATE_PLATFORMBOT, req.body);
        res.status(apiResponse.status).send(apiResponse.data);
    });

// get platformBot info
app.get(
    '/api/accounts/:accountId/bots/:botId/platformbot',
    async (req, res) => {
        const apiResponse = await execReadPlatformBotAction(acl, req.user.id, entityType.PLATFORMBOT, PermissionType.READ_PLATFORMBOT, req.params);
        res.status(apiResponse.status).send(apiResponse.data);
    }
);

// remove platform bot
app.delete(
    '/api/accounts/:accountId/bots/:botId/platformbot/:platformBotId/:accesstoken',
    async (req, res) => {
        const apiResponse = await execRemovePlatformBotAction(acl, req.user.id, entityType.PLATFORMBOT, PermissionType.DELETE_PLATFORMBOT, req.params);
        res.status(apiResponse.status).send(apiResponse.data);
    });

// adding api to get all flows
app.get(
    '/api/flow/account/:accountId/bot/:botId',
    async (req, res) => {
        const apiResponse = await execViewFlowsAction(acl, req.user.id, entityType.BOT, PermissionType.VIEW_FLOWS, req.params.botId);
        res.status(apiResponse.status).send(apiResponse.data);
    }
);

// adding api for fetching flow data
app.get(
    '/api/flow/account/:accountId/bot/:botId/flow/:flowId',
    async (req, res) => {
        const apiResponse = await execReadFlowAction(acl, req.user.id, entityType.FLOW, PermissionType.READ_FLOW, req.params);
        res.status(apiResponse.status).send(apiResponse.data);
    }
);

// adding api for fetching bot data
app.get(
    '/api/accounts/:accountId/bots/:botId',
    async (req, res) => {
        const apiResponse = await execReadBotAction(acl, req.user.id, entityType.BOT, PermissionType.READ_BOT, req.params);
        res.status(apiResponse.status).send(apiResponse.data);
    }
);

// save or create new flow
/* eslint-disable no-empty */
app.post(
    '/api/flow/bot/:botId/:flowId',
    async (req, res) => {
        const apiResponse = await execUpsertFlowAction(acl, req.user.id, entityType.FLOW, PermissionType.CREATE_FLOW, req.params, req.body.flowJson);
        res.status(apiResponse.status).send(apiResponse.data);
    });
/* eslint-enable no-empty */

// delete flow
app.delete(
    '/api/flow/bot/:botId/:flowId',
    async (req, res) => {
        const apiResponse = await execDeleteFlowAction(acl, req.user.id, entityType.FLOW, PermissionType.DELETE_FLOW, req.params.flowId);
        res.status(apiResponse.status).send(apiResponse.data);
    });

// clone flow
app.put(
    '/api/flow/bot/:botId/:flowId',
    async (req, res) => {
        const apiResponse = await execCloneFlowAction(acl, req.user.id, entityType.FLOW, PermissionType.CLONE_FLOW, req.params);
        res.status(apiResponse.status).send(apiResponse.data);
    });

app.post(
    '/api/flow/bot/:botId/:flowId/upload',
    async (req, res) => {
        const flow = req.body.flowJson;
        if (req.params.botId !== flow.botId || req.params.flowId !== flow._id) {
            console.log(req.params.botId, req.params.flowId, flow.botId, flow._id);
            return res.status(400).send('Something is wrong. The flowId and/or botId in the flow does not match with that from the url');
        }
        const apiResponse = await execSaveFlowAction(acl, req.user.id, entityType.FLOW, PermissionType.SAVE_FLOW, flow, req.params);
        res.status(apiResponse.status).send(apiResponse.data);
    });

app.post(
    '/api/createTestLink',
    async (req, res) => {
        const apiResponse = await execCreateTestLinkAction(acl, req.user.id, entityType.TESTER, PermissionType.CREATE_TESTLINK, req.body);
        res.status(apiResponse.status).send(apiResponse.data);
    }
);

//to fetch testlinks for a flow
app.get(
    '/api/flow/:flowId/testlinks',
    async (req, res) => {
        const apiResponse = await execViewTestersAction(acl, req.user.id, entityType.FLOW, PermissionType.VIEW_TESTERS, req.params.flowId);
        res.status(apiResponse.status).send(apiResponse.data);
    }
);

// make flow live
app.post(
    '/api/makeliveflow/:botId/:flowId',
    async (req, res) => {
        const apiResponse = await execActivateFlowAction(acl, req.user.id, entityType.FLOW, PermissionType.ACTIVATE_FLOW, req.params);
        res.status(apiResponse.status).send(apiResponse.data);
    });

app.post(
    '/api/revertFlow/:botId',
    async (req, res) => {
        const apiResponse = await execRevertFlowAction(acl, req.user.id, entityType.FLOW, PermissionType.REVERT_FLOW, req.params);
        res.status(apiResponse.status).send(apiResponse.data);
    }
);

app.get(
    '/api/bots/all',
    async (req, res) => {
        const allBots = await botService.getUnusedBots();
        res.send({ allBots });
    }
);

app.get(
    '/api/bots/unused',
    async (req, res) => {
        const bots = await botService.getUnusedBots();
        res.send({ bots });
    }
);

app.post(
    '/api/bots/:botId/link/:accountId',
    async (req, res) => {
        const bot = await botService.getBotData(req.params.botId);
        const account = await accountService.findAccount(req.params.accountId);
        if (bot && account) {
            bot.account = account._id.toString();
            await botService.save(bot);
        } else {
            res.status(400);
        }
        res.send({});
    }
);

app.post(
    '/api/bots/:botId/unlink',
    async (req, res) => {
        const bot = await botService.getBotData(req.params.botId);
        if (bot) {
            bot.account = null;
            await botService.save(bot);
        } else {
            res.status(400);
        }
        res.send({});
    }
);

app.post(
    '/api/users/:userId/accounts/bots/pagelist',
    async (req, res) => { // {currentUserPages: [], otherUserPages: []}
        const apiResponse = await execDeployBotAction(acl, req.user.id, entityType.BOT, PermissionType.DEPLOY_BOT, req.body);
        res.status(apiResponse.status).send(apiResponse.data);
    });


// get subscription nodes
app.get(
    '/api/subscriptions/accounts/:accountId/bots/:botId',
    async (req, res) => {
        const subscriptionsNodes = await botService.getSubscriptionsNodesForBot(req.params.botId);
        res.send({
            subscriptionsNodes,
        });
    }
);

// save subscription nodes
app.post(
    '/api/subscriptions/accounts/:accountId/bots/:botId',
    async (req, res) => {
        try {
            const botId = req.params.botId;
            const subscriptionJson = req.body.subscriptionJson;
            const subscriptionsNode = await botService.getSubscriptionsNodesForBot(req.params.botId);
            if (subscriptionsNode && subscriptionsNode.length > 0) {
                subscriptionsNode[0].nodes = subscriptionJson.nodes
                await botService.saveSubscriptionNodes(subscriptionsNode[0]);
            } else {
                const node = subscriptionJson;
                node.botId = botId;
                await botService.createSubscriptionNodes(node);
            }

        } catch (e) {
            console.log(e);
        }
        res.send({});
    }
);

// delete subscription nodes
app.delete(
    '/api/subscriptions/accounts/:accountId/bots/:botId/:subscriptionNodeId',
    async (req, res) => {
        try {
            const subscriptionNodeId = req.params.subscriptionNodeId;
            await botService.deleteSubscriptionNodes(subscriptionNodeId);
        } catch (e) {
            console.log(e);
        }
        res.send({});
    }
);

app.use(
    '/api/metrics/:accountId/:botId/:metric',
    async (req, res) => {
        try {
            const startDate = req.query.startDate;
            const endDate = req.query.endDate;
            const summaryStartDate = req.query.summaryStartDate;
            const timezone = req.query.timezone;
            const filters = req.body.filters;
            const { accountId, botId, metric } = req.params;
            const apiResponse = await execViewAnalyticsAction(acl, req.user.id, entityType.ACCOUNT, PermissionType.VIEW_ANALYTICS, startDate, endDate, accountId, botId, filters, metric, summaryStartDate, timezone);
            res.status(apiResponse.status).send(apiResponse.data);
        } catch(e) {
            console.log(e);
            res.status(500).send(e);
        }
    }
);

// upsert subscription
app.post(
    '/api/subscriptions/bot/:botId/save',
    async (req, res) => {
        const subscription =  req.body.subscription;
        const subscriptionId = subscription._id;
        let apiResponse = {};
        if (!subscriptionId || subscriptionId === '') {
            apiResponse = await execCreateSubscriptionAction(acl, req.user.id, entityType.SUBSCRIPTION,
                                        PermissionType.CREATE_SUBSCRIPTION, req.params, subscription);
        } else {
            apiResponse = await execSaveSubscriptionAction(acl, req.user.id, entityType.SUBSCRIPTION,
                                        PermissionType.SAVE_SUBSCRIPTION, req.params, subscription);
        }
        res.status(apiResponse.status).send(apiResponse.data);
    });

// NOTE: There is a * router below. Place this before that.
app.use('/api/facebook', facebookRouter);
app.use('/testing', testingRouter);
app.use('/api/loadSchema', schemaRouter);
app.use('/pollTesting', pollTestingRouter);
app.use('/api/pollsummary', pollSummaryRouter);

//
// Register API middleware
// -----------------------------------------------------------------------------
// app.use('/graphql', expressGraphQL(req => ({
//   schema,
//   graphiql: true,
//   rootValue: { request: req },
//   pretty: process.env.NODE_ENV !== 'production',
// })));

//
// Register server-side rendering middleware
// -----------------------------------------------------------------------------
app.get('*', async (req, res, next) => {
    logger.debug('current url is', req.url);
    logger.debug('req.user is', req.user);
    let currentUser = {};
    if (req.user) {
        // fetch the current user if user is valid
        // req.user is only set when jwt is successful
        currentUser = await getCurrentUser(req.user)
    } else {
        // if the path is unauthenticated, render it
        // else send the user to login (i.e. root for now)
        const isCurUrlUnAuthenticated = _(unAuthenticatedPaths).some(x => _.isRegExp(x) ? x.test(req.url) : x === req.url);
        if (!isCurUrlUnAuthenticated) {
            console.log('redirecting user', req.user, req.url);
            res.redirect(getRedirectUri(appConfig.loginPage, req.url));
            return;
        }
    }
    const muiTheme = getMuiTheme({}, {
        userAgent: req.headers['user-agent'],
    });
    logger.debug('server-side rendering');
    const history = createHistory(req.url);
    // let currentLocation = history.getCurrentLocation();
    let sent = false;
    const removeHistoryListener = history.listen(location => {
        const newUrl = `${location.pathname}${location.search}`;
        if (req.originalUrl !== newUrl) {
            // console.log(`R ${req.originalUrl} -> ${newUrl}`); // eslint-disable-line no-console
            if (!sent) {
                res.redirect(303, newUrl);
                sent = true;
                next();
            } else {
                console.error(`${req.path}: Already sent!`); // eslint-disable-line no-console
            }
        }
    });

    try {
        const store = configureStore({ auth: { user: currentUser, authenticated: req.user ? true : false } }, {
            cookie: req.headers.cookie,
            history,
        });

        store.dispatch(setRuntimeVariable({
            name: 'initialNow',
            value: Date.now(),
        }));
        let css = new Set();
        let statusCode = 200;
        const data = {
            title: '',
            description: '',
            style: '',
            children: '',
            scripts: assets,
        };

        await UniversalRouter.resolve(routes, {
            theme: muiTheme,
            currentRoute: req.path,
            path: req.path,
            query: req.query,
            context: {
                store,
                createHref: history.createHref,
                insertCss: (...styles) => {
                    styles.forEach(style => css.add(style._getCss())); // eslint-disable-line no-underscore-dangle, max-len
                },
                setTitle: value => (data.title = value),
                setMeta: (key, value) => (data[key] = value),
            },
            render(component, status = 200) {
                css = new Set();
                statusCode = status;
                data.children = ReactDOM.renderToString(component);
                data.state = store.getState();
                data.style = [...css].join('');
                return true;
            },
        });

        if (!sent) {
            const html = ReactDOM.renderToStaticMarkup(<Html {...data} />);
            res.status(statusCode);
            res.send(`<!doctype html>${html}`);
        }
    } catch (err) {
        next(err);
    } finally {
        removeHistoryListener();
    }
});


//
// Error handling
// -----------------------------------------------------------------------------
const pe = new PrettyError();
pe.skipNodeFiles();
pe.skipPackage('express');

// TODO log exceptions somewhere in the cloud
const expressErrorHandler = (err, req, res, next) => { // eslint-disable-line no-unused-vars
    console.log(pe.render(err)); // eslint-disable-line no-console
    logger.info('in express error handler');

    if (res.headersSent) {
        return next(err);
    }

    // handle jwt 'UnauthorizedError' when user clicks on bookmarks
    //if user is not authorized and the request is not xhr, send him to login page
    if (err.name === 'UnauthorizedError') {
        if (req.xhr) {
            res.status(401).send({});
        } else {
            logger.debug('not authorized non xhr request, sending user to login.')
            req.method = 'get';
            res.redirect(401, getRedirectUri(appConfig.loginPage, req.url));
        }
        next(err);
    }

    const statusCode = err.status || 500;
    if (req.xhr) {
        res.status(statusCode).send({});
        return;
    }
    const html = getErrorPage({ title: 'Internal Server Error', status: statusCode, err: err });
    res.status(statusCode);
    res.send(html);
}

function getErrorPage({ title, message, statusCode, err }) {
    title = title || 'Error';
    err.status = statusCode;
    const html = ReactDOM.renderToStaticMarkup(
        <Html
            title={title}
            description={err.message}
            style={errorPageStyle._getCss()} // eslint-disable-line no-underscore-dangle
        >
            {ReactDOM.renderToString(<ErrorPageWithoutStyle error={err} message={title} />)}
        </Html>
    );
    return `<!doctype html>${html}`
}

function getRedirectUri(url, redirectUrl) {
    return `${url}?redirect_uri=${encodeURIComponent(redirectUrl)}`;
}

// Use our custom error handler
app.use(expressErrorHandler);

process.on('uncaughtException', (err) => {
    console.error('UncaughtException', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('UnhandledRejection', reason);
});

/**
 *  Launch the server
 */
app.listen(port, () => {
    // NOTE: This is important. Some dev process is watching for this.
    // If this message is not valid, dev build will not work properly.
    /* eslint-disable no-console */
    console.log(`The server is running at http://${host}/`);
    /* eslint-enable no-console */
});
