import botworxData from 'botworx-utils/lib/data';
import { db } from '../../config';
import { dblogger } from '../../core/logger';

export const mongoConfig = {
    URL: db.url
};

export const services = botworxData.initialize(mongoConfig, dblogger);

export const accounts = services.accounts;
export const bots = services.bots;
export const dashboardUsers = services.dashboardUsers;
export const fbUsers = services.fbUsers;
export const flows = services.flows;
export const ifttts = services.ifttts;
export const sessions = services.sessions;
export const users = services.users;
export const platformBots = services.platformBots;
export const userRoles = services.userRoles;
export const broadcasts = services.broadcasts;
export const broadcastNodes = services.broadcastNodes;
export const testLinks = services.testLinks;
export const subscriptions = services.subscriptions;
export const flowOverrides = services.flowOverrides;
export const dashboardUserAccess = services.dashboardUserAccess;
export const systemPermissions = services.systemPermissions;
export const polls = services.polls;
export const pollSummaries = services.pollSummaries;
export const systemLinks = services.systemLinks;
export const webUpdates = services.webupdates;
export const referrals = services.referrals;
