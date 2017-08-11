import React, { PropTypes } from 'react';

import DatePicker from 'material-ui/DatePicker';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import { Tabs, Tab } from 'material-ui/Tabs';
import cx from 'classnames';


import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './AnalyticsPage.css';
import flexbox from '../../components/flexbox.css';
import FilterBar from '../../components/FilterBar';

import BarChart from '../../components/Chart/BarChart';
import PieChart from '../../components/Chart/PieChart';
import AreaChart from '../../components/Chart/AreaChart';

const title = 'BotWorx.Ai - Analytics';

function Analytics(
  {
    analytics, accountBots, onBotChange, accountId, botId, analyticsFilters,
    startDate, endDate, onStartDateChange, onEndDateChange,
    onUpdateDateRangeCharts, onAnalyticsTab, onAudienceTab, onMessagesTab, onDeleteFilter,
    fetchingAnalytics, onUserAgePieClick, onGenderPieClick, onCountryPieClick, onLocalePieClick,
  },
  context
) {
  context.setTitle(title);

  let userMetrics = null;
  let sessionMetrics = null;
  let genderMetrics = null;
  let countryMetrics = null;
  let localeMetrics = null;
  let messageSessionMetrics = null;
  let messageUserMetrics = null;
  let responseMetrics = null;
  let readMetrics = null;
  let profileAgeMetrics = null;
  let messageMetrics = null;


  if (botId) {
    const accountData = analytics.metrics[accountId];
    if (accountData) {
      const botData = accountData[botId];
      if (botData) {
        userMetrics = botData.data.User || null;
        sessionMetrics = botData.data.Session || null;
        genderMetrics = botData.data.Gender || null;
        countryMetrics = botData.data.Country || null;
        localeMetrics = botData.data.Locale || null;
        messageSessionMetrics = botData.data.MessageSession || null;
        messageUserMetrics = botData.data.MessageUser || null;
        responseMetrics = botData.data.ResponseDelay || null;
        readMetrics = botData.data.ReadDelay || null;
        profileAgeMetrics = botData.data.ProfileAge || null;
        messageMetrics = botData.data.MessageCount || null;
      }
    }
  }

  return (
    <div className={s.root}>
      <h2>Bot Analytics</h2>
      <div className={cx(flexbox.column, s.container)}>
        <div className={cx(flexbox.columnItem, flexbox.row, s.formRow)}>

          <SelectField
            value={botId}
            className={cx(flexbox.rowItem, flexbox.withHorzMargin, s.selectBot)}
            floatingLabelText={'Select Bot'}
            onChange={(e, i, selectedBotId) => onBotChange(accountId, selectedBotId)}
          >
            {
              accountBots.map(b => (
                <MenuItem
                  value={b.id}
                  primaryText={b.name}
                  key={b.id}
                />
              ))
            }
          </SelectField>

          <div className={cx(flexbox.row, flexbox.rowItem, s.formRow)}>
            <DatePicker
              className={cx(flexbox.rowItem, s.startDate)}
              hintText="Start Date"
              floatingLabelText="From"
              value={startDate}
              onChange={onStartDateChange}
              container="inline"
              autoOk
            />

            <DatePicker
              className={cx(flexbox.rowItem, s.endDate)}
              hintText="End Date"
              floatingLabelText="To"
              value={endDate}
              onChange={onEndDateChange}
              container="inline"
              autoOk
            />

            <RaisedButton
              className={cx(flexbox.rowItem, flexbox.withHorzMargin, s.goButton)}
              onClick={() => onUpdateDateRangeCharts(accountId, botId, startDate, endDate)}
              label="Go" primary disabled={!botId}
            />
          </div>
        </div>
        { botId ? (
          <FilterBar filters={analyticsFilters} onDeleteFilter={onDeleteFilter} />
        ) : null }
        { botId ? (
          <Tabs className={s.tabs}>
            <Tab label="Audience" onActive={onAudienceTab}>
              <div className={cx(flexbox.columnItem, flexbox.row, s.charts)}>
                <AreaChart
                  metrics={userMetrics}
                  label="Users"
                  loading={fetchingAnalytics.User}
                />

                <PieChart
                  metrics={profileAgeMetrics}
                  label="User Aging"
                  loading={fetchingAnalytics.ProfileAge}
                  onclick={onUserAgePieClick}
                />

                <PieChart
                  metrics={genderMetrics}
                  label="Demographics"
                  loading={fetchingAnalytics.Gender}
                  onclick={onGenderPieClick}
                />

                <PieChart
                  metrics={countryMetrics}
                  label="Country"
                  loading={fetchingAnalytics.Country}
                  onclick={onCountryPieClick}
                />

                <PieChart
                  metrics={localeMetrics}
                  label="Locale"
                  loading={fetchingAnalytics.Locale}
                  onclick={onLocalePieClick}
                />
              </div>
            </Tab>

            <Tab label="Conversations" onActive={onMessagesTab}>
              <div className={cx(flexbox.columnItem, flexbox.row, s.charts)}>
                <BarChart
                  metrics={messageMetrics}
                  label="Message Count"
                  loading={fetchingAnalytics.MessageCount}
                />
                <BarChart
                  metrics={messageSessionMetrics}
                  label="Messages per Session"
                  loading={fetchingAnalytics.MessageSession}
                />
                <BarChart
                  metrics={messageUserMetrics}
                  label="Messages per User"
                  loading={fetchingAnalytics.MessageUser}
                />
                <BarChart
                  metrics={sessionMetrics}
                  label="Sessions per User"
                  loading={fetchingAnalytics.Session}
                />
              </div>
            </Tab>
            <Tab label="Analytics" onActive={onAnalyticsTab}>
              <div className={cx(flexbox.columnItem, flexbox.row, s.charts)}>
                <PieChart
                  metrics={responseMetrics}
                  label="Customer Response"
                  loading={fetchingAnalytics.ResponseDelay}
                />
                <PieChart
                  metrics={readMetrics} label="Average Read Time"
                  loading={fetchingAnalytics.ReadDelay}
                />
              </div>
            </Tab>

          </Tabs>
        ) : null }

      </div>
    </div>
  );
}

Analytics.propTypes = {
  analytics: PropTypes.object,
  accountBots: PropTypes.array,
  accountId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  botId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  startDate: PropTypes.instanceOf(Date),
  endDate: PropTypes.instanceOf(Date),
  fetchingAnalytics: PropTypes.object,
  onBotChange: PropTypes.func,
  onStartDateChange: PropTypes.func,
  onEndDateChange: PropTypes.func,
  onUpdateDateRangeCharts: PropTypes.func,
  onAnalyticsTab: PropTypes.func,
  onAudienceTab: PropTypes.func,
  onMessagesTab: PropTypes.func,
  onGenderPieClick: PropTypes.func,
  onCountryPieClick: PropTypes.func,
  onLocalePieClick: PropTypes.func,
  onUserAgePieClick: PropTypes.func,
  analyticsFilters: PropTypes.object,
  onDeleteFilter: PropTypes.func,
};

Analytics.defaultProps = {
  accountBots: [],
  analytics: {},
};

Analytics.contextTypes = { setTitle: PropTypes.func.isRequired };

export default withStyles(flexbox, s)(Analytics);
