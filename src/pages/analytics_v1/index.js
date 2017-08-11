import React from 'react';
import Analytics from './AnalyticsPageV1.js'
import MessagesAnalytics from './messagesAnalytics';
import SessionAnalytics from './sessionAnalytics';
import EngagementAnalytics from './engagementAnalytics';
import Paper from 'material-ui/Paper';
import FilterAnalytics from './filterAnalyticsContainer';
import UserAnalytics from './userAnalytics';
import UserChangeAnalytics from './userChangeAnalytics';
import RetentionAnalytics from './retentionAnalytics';
import GenderAnalytics from './genderAnalytics';
import CountryAnalytics from './countryAnalytics';
import TimeZoneAnalytics from './timeZoneAnalytics';
import LanguageAnalytics from './languageAnalytics';
import SentMessagesAnalytics from './sentMessagesAnalytics';
import SubscriptionsChangeAnalytics from './subscriptionsChangeAnalytics';
import DeliveryTimeAnalytics from './deliveryTimeAnalytics';
import ReadTimeAnalytics from './readTimeAnalytics';
import EngagementTimeAnalytics from './engagementTimeAnalytics';
import TopNodesAnalytics from './topNodesAnalytics';
import TopActionsAnalytics from './topActionsAnalytics';
import TopTextInputsAnalytics from './topTextInputsAnalytics';
import TopContentItemsAnalytics from './topContentItemsAnalytics';
import OverviewAnalytics from './overviewAnalytics';
import ReferralsAnalytics from './referralsAnalytics';
import NodeAnalysisAnalytics from './nodeAnalysisAnalytics';
import { fetchMetrics } from '../../actions/analytics';
import moment from 'moment';

export function AnalyticsPageV1 ({ params, context }) {
  return (
      <div>
        <Analytics>
            <Paper>
                <div className="">
                    This is analytics page
                </div>
            </Paper>
        </Analytics>
      </div>
  );
}

    /*const botId = '585984475907b62de714a2b3';//params.botId;
    const accountId = '5858275b501efdd6b509d006';//params.accountId;
    const endDate = moment().format('YYYYMMDD');
    const startDate = moment().subtract(17, 'days').format('YYYYMMDD');*/

export function OverviewAnalyticsPage (args) {
    const { context: { store : { dispatch} } } = args;

    return (
      <div>
        <Analytics>
            <div className="">
                <FilterAnalytics />
                <OverviewAnalytics />
            </div>
        </Analytics>
      </div>
    );
}

export function MessagesAnalyticsPage (args) {
    const { context: { store : { dispatch} } } = args;

    return (
      <div>
        <Analytics>
            <div className="">
                <FilterAnalytics />
                <MessagesAnalytics />
            </div>
        </Analytics>
      </div>
    );
}

export function SessionAnalyticsPage (args) {
    /*const botId = params.botId;
    const accountId = params.accountId;
    const endDate = moment().format('YYYYMMDD');
    const startDate = moment().subtract(17, 'days').format('YYYYMMDD');

    const params1 = {
        startDate: startDate,
        endDate: endDate
    }

    const { context: { store : { dispatch} } } = args;
    dispatch(fetchMetrics(accountId, botId, 'MessageSessionEngaged', params1, {}));*/
    return (
      <div>
        <Analytics>
            <div className="">
                <FilterAnalytics />
                <SessionAnalytics />
            </div>
        </Analytics>
      </div>
  );
}

export function EngagementAnalyticsPage (args) {
     /*const botId = params.botId;
    const accountId = params.accountId;
    const endDate = moment().format('YYYYMMDD');
    const startDate = moment().subtract(17, 'days').format('YYYYMMDD');

    const params1 = {
        startDate: startDate,
        endDate: endDate
    }

    const { context: { store : { dispatch} } } = args;
    dispatch(fetchMetrics(accountId, botId, 'MessageEngagement', params1, {}));*/

  return (
      <div>
        <Analytics>
            <div className="">
                <FilterAnalytics />
                <EngagementAnalytics />
            </div>
        </Analytics>
      </div>
  );
}

export function UserAnalyticsPage ({ params, context }) {
  return (
      <div>
        <Analytics>
            <div className="">
                <FilterAnalytics />
                <UserAnalytics />
            </div>
        </Analytics>
      </div>
  );
}

export function UserChangeAnalyticsPage ({ params, context }) {
  return (
      <div>
        <Analytics>
            <div className="">
                <FilterAnalytics />
                <UserChangeAnalytics />
            </div>
        </Analytics>
      </div>
  );
}

export function RetentionAnalyticsPage ({ params, context }) {
  return (
      <div>
        <Analytics>
            <div className="">
                <FilterAnalytics />
                <RetentionAnalytics />
            </div>
        </Analytics>
      </div>
  );
}

export function GenderAnalyticsPage ({ params, context }) {
  return (
      <div>
        <Analytics>
            <div className="">
                <FilterAnalytics />
                <GenderAnalytics />
            </div>
        </Analytics>
      </div>
  );
}

export function CountryAnalyticsPage ({ params, context }) {
  return (
      <div>
        <Analytics>
            <div className="">
                <FilterAnalytics />
                <CountryAnalytics />
            </div>
        </Analytics>
      </div>
  );
}

export function TimeZoneAnalyticsPage ({ params, context }) {
  return (
      <div>
        <Analytics>
            <div className="">
                <FilterAnalytics />
                <TimeZoneAnalytics />
            </div>
        </Analytics>
      </div>
  );
}

export function LanguageAnalyticsPage ({ params, context }) {
  return (
      <div>
        <Analytics>
            <div className="">
                <FilterAnalytics />
                <LanguageAnalytics />
            </div>
        </Analytics>
      </div>
  );
}

export function SentMessagesAnalyticsPage ({ params, context }) {
  return (
      <div>
        <Analytics>
            <div className="">
                <FilterAnalytics />
                <SentMessagesAnalytics />
            </div>
        </Analytics>
      </div>
  );
}

export function SubscriptionsChangeAnalyticsPage ({ params, context }) {
  return (
      <div>
        <Analytics>
            <div className="">
                <FilterAnalytics />
                <SubscriptionsChangeAnalytics />
            </div>
        </Analytics>
      </div>
  );
}

export function DeliveryTimeAnalyticsPage ({ params, context }) {
  return (
      <div>
        <Analytics>
            <div className="">
                <FilterAnalytics />
                <DeliveryTimeAnalytics />
            </div>
        </Analytics>
      </div>
  );
}

export function ReadTimeAnalyticsPage ({ params, context }) {
  return (
      <div>
        <Analytics>
            <div className="">
                <FilterAnalytics />
                <ReadTimeAnalytics />
            </div>
        </Analytics>
      </div>
  );
}

export function EngagementTimeAnalyticsPage ({ params, context }) {
  return (
      <div>
        <Analytics>
            <div className="">
                <FilterAnalytics />
                <EngagementTimeAnalytics />
            </div>
        </Analytics>
      </div>
  );
}

export function TopNodesAnalyticsPage ({ params, context }) {
  return (
      <div>
        <Analytics>
            <div className="">
                <FilterAnalytics />
                <TopNodesAnalytics />
            </div>
        </Analytics>
      </div>
  );
}

export function TopActionsAnalyticsPage ({ params, context }) {
  return (
      <div>
        <Analytics>
            <div className="">
                <FilterAnalytics />
                <TopActionsAnalytics />
            </div>
        </Analytics>
      </div>
  );
}

export function TopTextInputsAnalyticsPage ({ params, context }) {
  return (
      <div>
        <Analytics>
            <div className="">
                <FilterAnalytics />
                <TopTextInputsAnalytics />
            </div>
        </Analytics>
      </div>
  );
}

export function TopContentItemsAnalyticsPage ({ params, context }) {
  return (
      <div>
        <Analytics>
            <div className="">
                <FilterAnalytics />
                <TopContentItemsAnalytics />
            </div>
        </Analytics>
      </div>
  );
}

export function ReferralsAnalyticsPage ({ params, context }) {
  return (
      <div>
        <Analytics>
            <div className="">
                <FilterAnalytics />
                <ReferralsAnalytics />
            </div>
        </Analytics>
      </div>
  );
}

export function NodeAnalysisAnalyticsPage ({ params, context }) {
  return (
      <div>
        <Analytics>
            <div className="">
                <FilterAnalytics />
                <NodeAnalysisAnalytics />
            </div>
        </Analytics>
      </div>
  );
}