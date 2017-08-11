import { combineReducers } from 'redux';
import runtime from './runtime';
import accounts from './accounts';
import auth from './auth';
import { analytics, fetchingAnalytics } from './analytics';
import unusedBots from './unusedBots';
import manageAccount from './manageAccount';
import accountBots from './accountBots';
import botFlows from './flow';
import broadcast from './broadcast';
import subscriptions from './subscriptions';
import breadcrumbs from './breadcrumbs';
import visualizationState from './visualization';
import visualizationGraphData from './visualizationGraphData';
import botworxLoadingBar from './loadingBar'
import linkedUsers from './dashboardUser'
import testLinksState from './testLinks';
import notification from './notification';
import botPolls from './poll';
import pagination from './pagination'

export default combineReducers({
  runtime,
  accounts,
  auth,
  analytics,
  unusedBots,
  manageAccount,
  accountBots,
  fetchingAnalytics,
  visualizationState,
  visualizationGraphData,
  botFlows,
  broadcast,
  botworxLoadingBar,
  breadcrumbs,
  testLinksState,
  linkedUsers,
  notification,
  botPolls,
  pagination,
  subscriptions
});
