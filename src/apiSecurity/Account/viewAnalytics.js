import { checkUserPermission } from '../commonApi';
import accountService from '../../service/AccountService';
import botService from '../../service/BotService';
import { getAllowedPermissions, getUserAccessDocs } from '../../server';
import metricsConstant from '../../constants/metrics';
import { permissionError, authenticationError, successResponse } from '../../constants/apiResponseType';
import _ from 'lodash';
import moment from 'moment-timezone';
import {
  getNewUsers,
  getActiveUsers,
  getActiveSessions,
  getCountsByCountry,
  getMessageSession,
  countByResponseDelay,
  countByReadDelay,
  getMessageCounts,
  getCountsByProfileAge,
  getMessageUser,
  getTotalUsers,
} from '../../core/elastic';

import {
  getUsersData,
  getUserChangeData,
  getMessagesCount,
  getMessagesSessionEngagedCount,
  getEngagementCount,
  getGenderCount,
  getCountsByLocale,
  getSentMessagesCount,
  getTimeZoneCount,
  getUserRetentionData,
  getSubscriptionChangeCount,
  getDeliveryTime,
  getReadTime,
  getEngagementTime,
  getTopNodes,
  getTopActions,
  getTopTextInputs,
  getTopContentItems,
  getReferralsCount,
  getNodeAnalysisData
} from '../../core/elasticV1';
import langList from '../../utils/locale-list';

const d3 = require('d3-format');

const metricType = metricsConstant.metricType;

function round(value, decimals) {
  return parseFloat(Math.round(value * 100) / 100).toFixed(decimals);
}

function getAllDays(e,s) {
  var a = []
  e = e.add(1,'days');
  // While the updated start date is older, perform the loop.
  while (s.isBefore(e)) {
    a.push(s.format("YYYYMMDD"));
    s = s.add(1,'days');
  }
  return a;
}
// TODO
async function canExecuteAction(acl, userId, entityType, permission) {
  if (!checkUserPermission(acl, userId, entityType, permission)) {
    return false;
  }
  return true;
}

async function preAction() {

}

async function postAction() {

}

function getColors(graphColumns) {

}

function calculatePercentageChange(currentNo, totalNo) {
        let pastNo = totalNo - currentNo;
        	// Any one is not a number
        if( !isNumeric(currentNo) || !isNumeric(totalNo) ){
            return "N/A";
        }

        // If both are 0, increase % is also 0
        if( currentNo == 0 && pastNo == 0) {
            return 0;
        }

        // If just past number is 0, increase % is infinite and should be displayed as N/A
        if(pastNo == 0){
            return "N/A";
        }

        let increment = (currentNo-pastNo)*100/pastNo;

        return increment % 1 == 0 ? increment : increment.toFixed(1);
 }

 function isNumeric(number) {
    return !isNaN(parseFloat(number)) && isFinite(number);
}

function getTopItemsAndOthersForGraph(noOfTopItems, data, isSkipOthers) {
  let othersCount = 0;
  let graphData = [];
  for (var i=0, len=data.length; i<len; i++) {
    if (i < noOfTopItems) {
      graphData.push(data[i]);
    } else {
      othersCount += parseFloat(data[i][1]);
    }
  }
  if (!isSkipOthers) {
    graphData.push(['Others', othersCount]);
  }
  return graphData;
}

export async function executeAction(acl, userId, entityType, permission,
                      startDate, endDate, accountId, botId, filters, metric, summaryStartDate, timezone) {
  let data = {};
  if (botId == "All") {
    botId = null;
  }
  filters = Object.keys(filters).map(key => filters[key]);
//   const elasticBotId = await botService.getPlatformBotId(botId);
  const elasticBotId = botId;

  const startDateM = moment(startDate);
  const endDateM = moment(endDate);
  if (!canExecuteAction(acl, userId, entityType, permission)) {
    return permissionError;
  }
  const timeMetricsColors = {
            '<1 minute(s)': '#309100',
            '<5 minute(s)': '#90ce71',
            '<30 minute(s)': '#baf153',
            '<1 hour(s)': '#eff254',
            '<12 hour(s)': '#ff7700',
            '>12 hour(s)': '#f72c04'
        }
  try {
    switch (metric) {
      case metricType.PROFILE_AGE: {
        const counts = await getCountsByProfileAge(elasticBotId, filters);
        data = {
          ProfileAge: {
            data: {
              columns: [],
            },
          },
        };
        Object.keys(counts).forEach(c => {
          data.ProfileAge.data.columns.push([c, counts[c]]);
        });
        break;
      }

      case metricType.MESSAGE_COUNT:
      case metricType.MESSAGE_COUNT_SUMMARY: {
        let currentMetric = metric == metricType.MESSAGE_COUNT ? metricType.MESSAGE_COUNT : metricType.MESSAGE_COUNT_SUMMARY;
        data = {
          [currentMetric]: {
            data: {
              x: 'x',
              columns: [['x'], ['Total'], ['In'], ['Out']]
            },
            axis: {
              x: {
                type: 'timeseries',
                tick: {
                  format: '%Y-%m-%d',
                },
              },
              y: {
                min: 0,
                padding: 0
              }
            },
          },
        };

        let counts = await getMessagesCount(accountId, botId, Number(startDate), Number(endDate), filters);

        //for (var i = 0, len = counts.length, msgIn, msgOut; i < len; i++) {
        for (let m = moment(startDateM), msgIn, msgOut, index, val; m.isSameOrBefore(endDateM); m.add(1, 'days')) {
          msgIn=0;
          msgOut=0;
          data[currentMetric].data.columns[0].push(m.format('YYYY-MM-DD'));
          index = m.format('YYYYMMDD').toString();
          val = counts[index];
          if (val) {
            msgIn = val.messagesIn.value ? val.messagesIn.value : 0;
            msgOut = val.messagesOut.value ? val.messagesOut.value : 0;
          }
          data[currentMetric].data.columns[1].push(msgIn + msgOut);
          data[currentMetric].data.columns[2].push(msgIn);
          data[currentMetric].data.columns[3].push(msgOut);
        }

        break;
      }
      case metricType.MESSAGE_SESSION_ENGAGED:
      case metricType.MESSAGE_SESSION_ENGAGED_SUMMARY: {

        let currentMetric = metric == metricType.MESSAGE_SESSION_ENGAGED ? metricType.MESSAGE_SESSION_ENGAGED : metricType.MESSAGE_SESSION_ENGAGED_SUMMARY;
        data = {
          [currentMetric]: {
            data: {
              x: 'x',
              columns: [['x'], ['Total'], ['Engaged']]
            },
            axis: {
              x: {
                type: 'timeseries',
                tick: {
                  format: '%Y-%m-%d',
                },
              },
              y: {
                min: 0,
                padding: 0
            }
            },
          },
        };
        let counts = await getMessagesSessionEngagedCount(accountId, botId, Number(startDate), Number(endDate), filters);

        //for (var i = 0, len = counts.length, newSessions, engagedSessions; i < len; i++) {
        for (let m = moment(startDateM), newSessions, engagedSessions, index, val; m.isSameOrBefore(endDateM); m.add(1, 'days')) {
          //data.MessageSessionEngaged.data.columns[0].push(moment(counts[i].key, 'YYYYMMDD').format('YYYY-MM-DD'));
          newSessions = 0;
          engagedSessions = 0;
          data[currentMetric].data.columns[0].push(m.format('YYYY-MM-DD'));
          index = m.format('YYYYMMDD').toString();
          val = counts[index];
          if (val) {
            newSessions = val.newSessions.value ? val.newSessions.value : 0;
            engagedSessions = val.engagedSessions.value ? val.engagedSessions.value : 0;
          }
          data[currentMetric].data.columns[1].push(newSessions);
          data[currentMetric].data.columns[2].push(engagedSessions);
        }
        break;
      }
      case metricType.MESSAGE_ENGAGEMENT:
      case metricType.MESSAGE_ENGAGEMENT_SUMMARY: {
        let currentMetric = metric == metricType.MESSAGE_ENGAGEMENT ?
        metricType.MESSAGE_ENGAGEMENT : metricType.MESSAGE_ENGAGEMENT_SUMMARY;

        let messagesPerUser = {
          data: {
            x: 'x',
            columns: [['x'], ['Messages Per User']]
          },
          axis: {
            x: {
              type: 'timeseries',
              tick: {
                format: '%Y-%m-%d',
              },
            },
            y: {
                min: 0,
                padding: 0
            }
          }
        }
        let sessionsPerUser = {
          data: {
            x: 'x',
            columns: [['x'], ['Sessions Per User']]
          },
          axis: {
            x: {
              type: 'timeseries',
              tick: {
                format: '%Y-%m-%d',
              },
            },
            y: {
                min: 0,
                padding: 0
            }
          }
        }
        let messagePerSession = {
          data: {
            x: 'x',
            columns: [['x'], ['Messages Per Session']]
          },
          axis: {
            x: {
              type: 'timeseries',
              tick: {
                format: '%Y-%m-%d',
              },
            },
            y: {
                min: 0,
                padding: 0
            }
          }
        }

        let messagesTotal = 0, usersTotal = 0, sessionsTotal = 0;
        const startDateN = Number(startDate), endDateN = Number(endDate);
        let counts = await getEngagementCount(accountId, botId, startDateN, endDateN, filters);

        //for (let i=startDateN, dateString, usersCount=0, index, messagesCount=0, sessionsCount=0; i<endDateN; i++) {
        for (let m = moment(startDateM), dateString, usersCount=0, index, messagesCount=0, sessionsCount=0; m.isSameOrBefore(endDateM); m.add(1, 'days')) {
          dateString = m.format('YYYY-MM-DD');
          messagesPerUser.data.columns[0].push(dateString);
          sessionsPerUser.data.columns[0].push(dateString);
          messagePerSession.data.columns[0].push(dateString);
          //index = i.toString();
          index = m.format('YYYYMMDD').toString();
          if (counts.users[index]) {
            usersCount = counts.users[index];
            usersTotal +=  usersCount;
          }
          if (counts.messages[index]) {
            messagesCount = counts.messages[index].messagesOut.value + counts.messages[index].messagesIn.value;
            sessionsCount = counts.messages[index].newSessions.value;

            messagesTotal += messagesCount;
            sessionsTotal += sessionsCount;
          }
          if (usersCount === 0) {
            messagesPerUser.data.columns[1].push(0);
            sessionsPerUser.data.columns[1].push(0);
          } else {
            messagesPerUser.data.columns[1].push((messagesCount / usersCount).toFixed(1));
            sessionsPerUser.data.columns[1].push((sessionsCount / usersCount).toFixed(1));
          }
          if (sessionsCount === 0) {
            messagePerSession.data.columns[1].push(0);
          } else {
            messagePerSession.data.columns[1].push((messagesCount / sessionsCount).toFixed(1));
          }
        }
        data[currentMetric] = {
          messagesPerUser: messagesPerUser,
          sessionsPerUser: sessionsPerUser, messagePerSession: messagePerSession,
          totalUsers: usersTotal,
          totalMessages: messagesTotal,
          totalSessions: sessionsTotal
        }
        break;
      }

      case metricType.READ_DELAY: {
        const counts = await countByReadDelay(elasticBotId, filters);
        // const counts2 = await messageCountByReadDelay(elasticBotId);

        data = {
          ReadDelay: {
            data: {
              columns: [],
            },
          },
        };

        Object.keys(counts).forEach(c => {
          data.ReadDelay.data.columns.push([c, counts[c]]);
        });

        break;
      }

      case metricType.RESPONSE_DELAY: {
        const counts = await countByResponseDelay(elasticBotId, filters);
        data = {
          ResponseDelay: {
            data: {
              columns: [],
            },
          },
        };

        Object.keys(counts).forEach(c => {
          data.ResponseDelay.data.columns.push([c, counts[c]]);
        });
        break;
      }

      case metricType.COUNTRY: {
        const countryCounts = await getCountsByCountry(elasticBotId, filters);
        data = {
          Country: {
            data: {
              columns: [],
            },
          },
        };

        Object.keys(countryCounts).forEach(c => {
          data.Country.data.columns.push([c, countryCounts[c]]);
        });
        break;
      }

      case metricType.LOCALE: {
        //const localeCounts = await getCountsByLocale(elasticBotId, filters);
        const counts = await getCountsByLocale(accountId, botId, Number(startDate), Number(endDate), filters);
        data = {};
        data[metricType.LOCALE] = {
            data: {
              columns: [],
            },
        };
        data[metricType.LOCALE_TABULAR_DATA] = {
            data: {
              columns: [],
            },
        };

        const MAX_PIES = 5;
        const allData = [];
        /*Object.keys(localeCounts).forEach(l => {
          data.Locale.data.columns.push([l, localeCounts[l]]);
        });*/
        counts.forEach(g => {
          let locale = _.find(langList, {shortName: g.key});
          let localeName = locale ? locale.englishName : '';
          allData.push([`${localeName} [${g.key}]`, g.all.value.toFixed()]);
        });

        data[metricType.LOCALE_TABULAR_DATA].data.columns = allData;
        if (counts.length > MAX_PIES + 1) {
          data[metricType.LOCALE].data.columns = getTopItemsAndOthersForGraph(MAX_PIES, allData);
        } else {
          data[metricType.LOCALE].data.columns = allData;
        }
        break;
      }


      case metricType.GENDER: {
        //const counts = await getGenderCount(elasticBotId, filters);
        const counts = await getGenderCount(accountId, botId, Number(startDate), Number(endDate), filters);
        data = {
          Gender: {
            data: {
              columns: [],
            },
          },
        };

        counts.forEach(g => {
          data.Gender.data.columns.push([g.key.charAt(0).toUpperCase() + g.key.slice(1), g.all.value.toFixed(1)]);
        });
        break;
      }

      case metricType.USER: {
        const sDate = moment(startDate).format('YYYYMMDD');
        const eDate = moment(endDate).format('YYYYMMDD');

        const usersData = await getUsersData(accountId, botId, sDate, eDate, filters);

        data = {
          User: {
            data: {
              x: 'x',
            //   columns: [['x'], ['All Users'], ['Engaged Users'], ['New Users'], ['Active Users']],
              columns: [['x'], ['All'], ['Active'], ['New'], ['Engaged']],
            },
            axis: {
              x: {
                type: 'timeseries',
                tick: {
                  format: '%Y-%m-%d',
                },
              },
              y: {
                min: 0,
                padding: 0
            }
            },
          },
        };

        for (const m = moment(startDateM); m.isSameOrBefore(endDateM); m.add(1, 'days')) {
          const dateData = m.format('YYYY-MM-DD');
          const dateKey = m.format('YYYYMMDD');
            data.User.data.columns[0].push(dateData);
          if (usersData[dateKey]) {
            data.User.data.columns[1].push(usersData[dateKey]["all"] || 0);
            data.User.data.columns[2].push(usersData[dateKey]["active"] || 0);
            data.User.data.columns[3].push(usersData[dateKey]["new"] || 0);
            data.User.data.columns[4].push(usersData[dateKey]["engaged"] || 0);
          } else {
            data.User.data.columns[1].push(0);
            data.User.data.columns[2].push(0);
            data.User.data.columns[3].push(0);
            data.User.data.columns[4].push(0);
          }
        }

        break;
      }

      case metricType.USER_CHANGE:
      case metricType.USER_CHANGE_SUMMARY: {
        const sDate = moment(startDate).format('YYYYMMDD');
        const eDate = moment(endDate).format('YYYYMMDD');

        const usersData = await getUserChangeData(accountId, botId, sDate, eDate, filters);
        let currentMetric = metric == metricType.USER_CHANGE ? metricType.USER_CHANGE : metricType.USER_CHANGE_SUMMARY;

        data = {
          [currentMetric]: {
            data: {
              x: 'x',
              columns: [['x'], ['New'], ['Blocked'], ['Unblocked']],
            },
            axis: {
              x: {
                type: 'timeseries',
                tick: {
                  format: '%Y-%m-%d',
                },
              },
            },
            y: {
                min: 0,
                padding: 0
            }
          },
        };

        for (const m = moment(startDateM); m.isSameOrBefore(endDateM); m.add(1, 'days')) {
          const dateData = m.format('YYYY-MM-DD');
          const dateKey = m.format('YYYYMMDD');
          data[currentMetric].data.columns[0].push(dateData);
          if (usersData[dateKey]) {
            data[currentMetric].data.columns[1].push(usersData[dateKey]["new"] || 0);
            data[currentMetric].data.columns[2].push(usersData[dateKey]["blocked"] || 0);
            data[currentMetric].data.columns[3].push(usersData[dateKey]["unblocked"] || 0);
          } else {
            data[currentMetric].data.columns[1].push(0);
            data[currentMetric].data.columns[2].push(0);
            data[currentMetric].data.columns[3].push(0);
          }
        }

        break;
      }

      case metricType.MESSAGE_SESSION: {
        const messageSession = await getMessageSession(elasticBotId, startDate, endDate, filters);

        data = {
          MessageSession: {
            data: {
              x: 'x',
              columns: [['x'], ['Messages'], ['Sessions']],
              groups: [['Messages', 'Sessions']],
            },
            axis: {
              x: {
                type: 'timeseries',
                tick: {
                  format: '%Y-%m-%d',
                },
              },
              y: {
                min: 0,
                padding: 0
            }
            },
          },
        };

        for (const m = moment(startDateM); m.isSameOrBefore(endDateM); m.add(1, 'days')) {
          const dateData = m.format('YYYY-MM-DD');
          const d = `${dateData} 00:00:00`;
          data.MessageSession.data.columns[0].push(dateData);
          data.MessageSession.data.columns[1].push(
            messageSession.message[dateData] || messageSession.message[d] || 0
          );
          data.MessageSession.data.columns[2].push(
            messageSession.session[dateData] || messageSession.session[d] || 0
          );
        }

        break;
      }

      case metricType.MESSAGE_USER: {
        const messageUser = await getMessageUser(elasticBotId, startDate, endDate, filters);
        data = {
          MessageUser: {
            data: {
              x: 'x',
              columns: [['x'], ['Messages'], ['Users']],
              groups: [['Messages', 'Users']],
            },
            axis: {
              x: {
                type: 'timeseries',
                tick: {
                  format: '%Y-%m-%d',
                },
              },
              y: {
                min: 0,
                padding: 0
            }
            },
          },
        };

        for (const m = moment(startDateM); m.isSameOrBefore(endDateM); m.add(1, 'days')) {
          const dateData = m.format('YYYY-MM-DD');
          const d = `${dateData} 00:00:00`;
          data.MessageUser.data.columns[0].push(dateData);
          data.MessageUser.data.columns[1].push(
            messageUser.message[dateData] || messageUser.message[d] || 0
          );
          data.MessageUser.data.columns[2].push(
            messageUser.user[dateData] || messageUser.user[d] || 0
          );
        }

        break;
      }

      case metricType.SESSION: {
        const userSession = await getActiveSessions(elasticBotId, startDate, endDate, filters);

        data = {
          Session: {
            data: {
              x: 'x',
              columns: [['x'], ['Users'], ['Sessions']],
              groups: [['Users', 'Sessions']],
            },
            axis: {
              x: {
                type: 'timeseries',
                tick: {
                  format: '%Y-%m-%d',
                },
              },
              y: {
                min: 0,
                padding: 0
            }
            },
          },
        };

        for (const m = moment(startDateM); m.isSameOrBefore(endDateM); m.add(1, 'days')) {
          const dateData = m.format('YYYY-MM-DD');
          const d = `${dateData} 00:00:00`;

          data.Session.data.columns[0].push(dateData);
          data.Session.data.columns[1].push(
            userSession.user[d] || userSession.user[dateData] || 0
          );
          data.Session.data.columns[2].push(
            userSession.session[d] || userSession.session[dateData] || 0
          );
        }

        break;
      }

      case metricType.SENT_MESSAGES:
      case metricType.SENT_MESSAGES_SUMMARY: {
        let currentMetric = metric == metricType.SENT_MESSAGES ? metricType.SENT_MESSAGES : metricType.SENT_MESSAGES_SUMMARY;
        data = {
          [currentMetric]: {
            data: {
              x: 'x',
              columns: [['x'],['Sent'], ['Delivered'], ['Read'], ['Engaged']]
            },
            axis: {
              x: {
                type: 'timeseries',
                tick: {
                  format: '%Y-%m-%d',
                },
              },
              y: {
                min: 0,
                padding: 0
            }
            },
          },
        };
        let counts = await getSentMessagesCount(accountId, botId, Number(startDate), Number(endDate), filters);
        //counts = _.sortBy(counts, ['key']);

        //for (var i=0, len=counts.length, msgEngg, msgDel, msgSent, msgRead; i<len; i++) {
        for (let m = moment(startDateM), msgEngg, msgDel, msgSent, msgRead, index, val; m.isSameOrBefore(endDateM); m.add(1, 'days')) {
          msgEngg=0;
          msgDel=0;
          msgSent=0;
          msgRead=0;
          //data.SentMessages.data.columns[0].push(moment(counts[i].key, 'YYYYMMDD').format('YYYY-MM-DD'));
          data[currentMetric].data.columns[0].push(m.format('YYYY-MM-DD'));
          index = m.format('YYYYMMDD').toString();
          val = counts[index];
          if (val) {
            msgEngg = val.engaged.value ? val.engaged.value : 0;
            msgRead = val.read.value ? val.read.value : 0;
            msgDel = val.delivered.value ? val.delivered.value : 0;
            msgSent = val.sent.value ? val.sent.value : 0;
          }
          data[currentMetric].data.columns[1].push(msgSent);
          data[currentMetric].data.columns[2].push(msgDel);
          data[currentMetric].data.columns[3].push(msgRead);
          data[currentMetric].data.columns[4].push(msgEngg);
        }
        break;
      }
      case metricType.TIME_ZONE: {
        const counts = await getTimeZoneCount(accountId, botId, Number(startDate), Number(endDate), filters);
        data = {};
        data[metricType.TIME_ZONE] = {
            data: {
              columns: [],
            },
        };
        data[metricType.TIME_ZONE_TABULAR_DATA] = {
            data: {
              columns: [],
            },
        };

        const MAX_PIES = 5;
        const allData = [];
        counts.forEach(g => {
          allData.push(['UTC '+ g.key, g.all.value.toFixed()]);
        });

        data[metricType.TIME_ZONE_TABULAR_DATA].data.columns = allData;
        if (counts.length > MAX_PIES + 1) {
          data[metricType.TIME_ZONE].data.columns = getTopItemsAndOthersForGraph(MAX_PIES, allData);
        } else {
          data[metricType.TIME_ZONE].data.columns = allData;
        }
        break;
      }
        case metricType.RETENTION: {
        const sDate = moment(startDate).format('YYYYMMDD');
        const eDate = moment(endDate).format('YYYYMMDD');
        const today = timezone ? moment().tz(timezone).format('YYYYMMDD') : null;

        // End date required to calculate diff date
        const momentEndDate = moment(endDate).add(1, 'days');

        // These two objects get the total no. of users required. Each requires different
        let totalUsersForEngByDateObj = {};
        let totalUsersForEngByDayObj = {};

        const retentionData = await getUserRetentionData(accountId, botId, sDate, eDate, filters);
        const finalData = [];
        const currentDate = moment();
        let totalNew = 0, sumOfNew = 0;
        let dateRange = getAllDays(moment(endDate),moment(startDate));
        let newUsersArr = [];
        let avgValObj = {
            'Date': 'Average',
            'New Users': 0,
        }
        let engagementByDay = {
          data: {
            x: 'x',
            columns: [
                ['x'],
                ['Retention By Day']
            ]
          },
          axis : {
        y : {
            tick: {
                format: d3.format("%")
            //    format: function (d) { return "%" + d; }
            }
        }
    }
        }

        let engagementByDate = {
            data: {
              x: 'x',
              columns: [
                  ['x'],
                  ['Retention By Date']
              ],
            },
            axis: {
              x: {
                type: 'timeseries',
                tick: {
                  format: '%Y-%m-%d',
                },
              },
            },
            y: {
                min: 0,
                padding: 0,
                max: 100
            }
        };

        let engagementByDateData = {};
        // Subracting 1 as BWUI-279 had to reduce the last column of every row.
        let dateRangeLength = dateRange.length - 1;
        dateRange.map(d => {
          const newdata = {};
          newdata['Date'] =moment(d).format('MMM D YYYY'); // for retention table
          if ((Object.keys(retentionData)).includes(d)) {
            newdata['New Users'] = totalNew = (retentionData[d][0] && retentionData[d][0].new) ? retentionData[d][0].new : 0;
          }
          else {
            newdata['New Users'] = 0;
          }
          sumOfNew += newdata['New Users'];
          totalUsersForEngByDayObj[`TotalUsersTillDay${dateRangeLength--}`] = sumOfNew;
          totalUsersForEngByDateObj[moment(d).format('YYYY-MM-DD')] = sumOfNew - newdata['New Users'];
          let diffDate = momentEndDate.diff(moment(d), 'days');

          // Calculating number of days for which data needs to displayed
          let columnNums = Math.min(diffDate, 30);

          let usersTotal = 0;
          _.range(1, columnNums + 1).map(x => {
            let momentDate = moment(d);
            let dateWithRange = moment(d).add(x, 'days').format('YYYYMMDD');

            /* Today's data would be inaccurate as day is not yet completed. So skip today's Date
                everywhere in retention graph and table.
            */
            if(moment(dateWithRange).isBefore(today, 'day')) {
                let engagementDate = momentDate.add(x, 'days').format('YYYY-MM-DD');
                if ((Object.keys(retentionData)).includes(d) && (Object.keys(retentionData[d])).includes(String(x)) && (totalNew>0)) {
                    const rowVal = round(((retentionData[d][x].active) * 100) / totalNew, 2)
                    newdata['Day ' + x] = rowVal>=100? ('100%'): (rowVal + '%');
                    usersTotal += retentionData[d][x].active;
                    avgValObj['Day ' + x] = retentionData[d][x].active + (avgValObj['Day ' + x] ? avgValObj['Day ' + x] : 0);
                    engagementByDateData[engagementDate] = retentionData[d][x].active + (engagementByDateData[engagementDate] ? engagementByDateData[engagementDate] : 0);
            }
                else {
                    newdata['Day ' + x] = '0.00%';
                    avgValObj['Day ' + x] = 0 + (avgValObj['Day ' + x] ? avgValObj['Day ' + x] : 0);
                    engagementByDateData[engagementDate] = 0 + (engagementByDateData[engagementDate] ? engagementByDateData[engagementDate] : 0);
            }
                momentDate = null;
          }
        })
          finalData.push(newdata);
          newUsersArr.push(usersTotal);
        })

        // Calculation logic for retention by date
        dateRange.map(d => {
            let date = moment(d).format('YYYY-MM-DD');
            // Don't show today's data as it maybe incomplete.
            if(moment(date).isBefore(today)) {
                engagementByDate.data.columns[0].push(date);
                let val =  Number(round(((engagementByDateData[date] * 100)/ totalUsersForEngByDateObj[date]), 2));
                if(isNaN(val)) {
                    val = 0;
                }
                engagementByDate.data.columns[1].push(val);
            }
        })

        // By the diagonal logic, we won't have the data for first date. Popping it out.
        engagementByDate.data.columns[0].splice(1,1);
        engagementByDate.data.columns[1].splice(1,1);

        //Get the average no. of users
        avgValObj['New Users'] = round((sumOfNew / dateRange.length),2);

        // Calculate the percentage for engagement by day
        let index = 1;
        _.forEach(avgValObj, (value, key) => {
            if(String(key).includes('Day')) {
                // below regex gets the number in string. Values are stored day wise so we need 'day' number
                let val =  Number(round(((value * 100)/ totalUsersForEngByDayObj[`TotalUsersTillDay${Number(key.match(/\d+/)[0])}`]), 2));
                if(isNaN(val)) {
                    val = 0;
                }
                avgValObj[key] = val + '%';
                engagementByDay.data.columns[0].push(index++);
                engagementByDay.data.columns[1].push(val);
            }
        })

        // Average is the first column after date. So add him in the beginning of array.
        finalData.unshift(avgValObj);

        data = {
          UserRetention: finalData,
          EngagementByDay: engagementByDay,
          EngagementByDate: engagementByDate
        }
        break;
      }
      case metricType.SUBSCRIPTION_CHANGE:
      case metricType.SUBSCRIPTION_CHANGE_SUMMARY: {

        let currentMetric = metric == metricType.SUBSCRIPTION_CHANGE ? metricType.SUBSCRIPTION_CHANGE : metricType.SUBSCRIPTION_CHANGE_SUMMARY;
        let subcriptionChangeGraphData = {
          data: {
            x: 'x',
            columns: [['x'],['New'], ['Canceled']]
          },
          axis: {
            x: {
              type: 'timeseries',
              tick: {
                format: '%Y-%m-%d',
              },
            },
            y: {
                min: 0,
                padding: 0
            }
          },
        };
        let counts = await getSubscriptionChangeCount(accountId, botId, Number(startDate), Number(endDate), filters);

        for (let m = moment(startDateM), newSubscriptions, canceled, index, val; m.isSameOrBefore(endDateM); m.add(1, 'days')) {
          newSubscriptions=0;
          canceled=0;
          subcriptionChangeGraphData.data.columns[0].push(m.format('YYYY-MM-DD'));
          index = m.format('YYYYMMDD').toString();
          val = counts[index];
          if (val) {
            newSubscriptions = val.new.value ? val.new.value : 0;
            canceled = val.canceled.value ? val.canceled.value : 0;
          }
          subcriptionChangeGraphData.data.columns[1].push(newSubscriptions);
          subcriptionChangeGraphData.data.columns[2].push(canceled);
        }
        data[currentMetric] = subcriptionChangeGraphData;
        break;
      }
      case metricType.DELIVERY_TIME:
      case metricType.DELIVERY_TIME_SUMMARY:{

        let currentMetric = metric == metricType.DELIVERY_TIME ? metricType.DELIVERY_TIME : metricType.DELIVERY_TIME_SUMMARY;
        let counts = await getDeliveryTime(accountId, botId, Number(startDate), Number(endDate), filters);
        counts = _.sortBy(counts, ['key']);

        let deliveryTime = {
          data: {
            columns: [],
          },
          deliveredTotal: 0,
          deliveryTimeTotal: 0
        };

        let greaterThan12Val = 0;
        counts.forEach(g => {
          let timeBand = g.key;
          if (g.key === 0) {
            return;
          }
          if (g.key < 0) {
            greaterThan12Val = g.delivered.value;

            /*
             We have to ignore greater > 12 hrs cases as they are outliers and affect the averages.
             Uncomment the below code in case we need to use it in future.
            */
            // deliveryTime.deliveredTotal += Number(g.delivered.value);
            // deliveryTime.deliveryTimeTotal += Number(g.deliveryTime.value);
          } else {
            if (g.key < 60) {
              timeBand = '<'+ g.key +' minute(s)';
            } else {
              timeBand = '<'+ g.key/60 +' hour(s)';
            }
            deliveryTime.data.columns.push([timeBand, g.delivered.value.toFixed(1)]);
            deliveryTime.deliveredTotal += Number(g.delivered.value);
            deliveryTime.deliveryTimeTotal += Number(g.deliveryTime.value);
          }
        });
        deliveryTime.data.columns.push(['>12 hour(s)', greaterThan12Val.toFixed(1)]);
        deliveryTime.colors = timeMetricsColors;
        data[currentMetric] = deliveryTime;
        break;
      }

      case metricType.READ_TIME:
      case metricType.READ_TIME_SUMMARY: {

        let currentMetric = metric == metricType.READ_TIME ? metricType.READ_TIME : metricType.READ_TIME_SUMMARY;
        let counts = await getReadTime(accountId, botId, Number(startDate), Number(endDate), filters);
        counts = _.sortBy(counts, ['key']);

        let readTime = {
          data: {
            columns: [],
          },
          readTotal: 0,
          readTimeTotal: 0
        };

        let greaterThan12Val = 0;
        counts.forEach(g => {
          let timeBand = g.key;
          if (g.key === 0) {
            return;
          }
          if (g.key < 0) {
            greaterThan12Val = g.read.value;

            /*
             We have to ignore greater > 12 hrs cases as they are outliers and affect the averages.
             Uncomment the below code in case we need to use it in future.
            */

            // readTime.readTotal += Number(g.read.value);
            // readTime.readTimeTotal += Number(g.readTime.value);
          } else {
            if (g.key < 60) {
              timeBand = '<'+ g.key +' minute(s)';
            } else {
              timeBand = '<'+ g.key/60 +' hour(s)';
            }
            readTime.data.columns.push([timeBand, g.read.value.toFixed(1)]);
            readTime.readTotal += Number(g.read.value);
            readTime.readTimeTotal += Number(g.readTime.value);
          }
        });
        readTime.data.columns.push(['>12 hour(s)', greaterThan12Val.toFixed(1)]);
        readTime.colors = timeMetricsColors;
        data[currentMetric] = readTime;
        break;
      }
      case metricType.ENGAGEMENT_TIME:
      case metricType.ENGAGEMENT_TIME_SUMMARY: {

        let currentMetric = metric == metricType.ENGAGEMENT_TIME ? metricType.ENGAGEMENT_TIME : metricType.ENGAGEMENT_TIME_SUMMARY;
        let counts = await getEngagementTime(accountId, botId, Number(startDate), Number(endDate), filters);
        counts = _.sortBy(counts, ['key']);

        let engagementTime = {
          data: {
            columns: [],
          },
          engagedTotal: 0,
          engagedTimeTotal: 0
        };

        let greaterThan12Val = 0;
        counts.forEach(g => {
          let timeBand = g.key;
          if (g.key === 0) {
            return;
          }
          if (g.key < 0) {
            greaterThan12Val = g.engaged.value;

            /*
             We have to ignore greater > 12 hrs cases as they are outliers and affect the averages.
             Uncomment the below code in case we need to use it in future.
            */

            // engagementTime.engagedTotal += Number(g.engaged.value);
            // engagementTime.engagedTimeTotal += Number(g.engagedTime.value);
          } else {
            if (g.key < 60) {
              timeBand = '<'+ g.key +' minute(s)';
            } else {
              timeBand = '<'+ g.key/60 +' hour(s)';
            }
            engagementTime.data.columns.push([timeBand, g.engaged.value.toFixed(1)]);
            engagementTime.engagedTotal += Number(g.engaged.value);
            engagementTime.engagedTimeTotal += Number(g.engagedTime.value);
          }
        });
        engagementTime.data.columns.push(['>12 hour(s)', greaterThan12Val.toFixed(1)]);
        engagementTime.colors = timeMetricsColors;
        data[currentMetric] = engagementTime;
        break;
      }
      case metricType.TOP_NODES:
      case metricType.TOP_NODES_SUMMARY: {
        let counts = await getTopNodes(accountId, botId, Number(startDate), Number(endDate), filters);
        let topNodesVisits = counts.visits;
        let topNodesVisitsGraphData = {
          data: {
            columns: [],
          }
        };
        let topVisitsGraphData = [], topVisitsTableData = [];
        topNodesVisits.forEach(g => {
          topVisitsGraphData.push([g.key, g.views.value.toFixed()]);
        });

        let topNodesClicks = counts.clicks;
        let topNodesClicksGraphData = {
          data: {
            columns: [],
          }
        };
        let topClicksGraphData = [], topClicksTableData = [];
        topNodesClicks.forEach(g => {
          topClicksGraphData.push([g.key, g.clicks.value.toFixed()]);
        });

        const MAX_PIES = 5;
        const isSkipOthers = true;
        topVisitsTableData = topVisitsGraphData;
        if (topVisitsGraphData.length > MAX_PIES + 1) {
          topNodesVisitsGraphData.data.columns = getTopItemsAndOthersForGraph(MAX_PIES, topVisitsGraphData, isSkipOthers);
        }
        topClicksTableData = topClicksGraphData;
        if (topClicksGraphData.length > MAX_PIES + 1) {
          topNodesClicksGraphData.data.columns = getTopItemsAndOthersForGraph(MAX_PIES, topClicksGraphData, isSkipOthers);
        }

        data[metric] = {};
        data[metric].visits = topNodesVisitsGraphData;
        data[metric].visitsTable = topVisitsTableData;
        data[metric].clicks = topNodesClicksGraphData;
        data[metric].clicksTable = topClicksTableData;
        break;
      }
      case metricType.TOP_ACTIONS: {
        let counts = await getTopActions(accountId, botId, Number(startDate), Number(endDate), filters);
        let topActions = {
          data: {
            columns: [],
          },
        };
        counts.forEach(g => {
          topActions.data.columns.push([g.key, g.clicks.value]);
        });

        data[metricType.TOP_ACTIONS] = topActions;
        break;
      }
      case metricType.TOP_TEXT_INPUTS: {
        let counts = await getTopTextInputs(accountId, botId, Number(startDate), Number(endDate), filters);
        let topTextInputs = {
          data: {
            columns: [],
          },
        };
        counts.forEach(g => {
          topTextInputs.data.columns.push([g.key, g.count.value]);
        });

        data[metricType.TOP_TEXT_INPUTS] = topTextInputs;
        break;
      }
      case metricType.TOP_CONTENT_ITEMS: {
        let counts = await getTopContentItems(accountId, botId, Number(startDate), Number(endDate), filters);
        let topContentItems = {
          data: {
            columns: [],
          },
        };
        counts.forEach(g => {
          topContentItems.data.columns.push([g.key, g.clicks.value]);
        });

        data[metricType.TOP_CONTENT_ITEMS] = topContentItems;
        break;
      }
      case metricType.REFERRALS:
      case metricType.REFERRALS_SUMMARY: {
        let currentMetric = metric == metricType.REFERRALS ? metricType.REFERRALS : metricType.REFERRALS_SUMMARY;
        let graphData = {
          data: {
            x: 'x',
            columns: [['x'],['New'], ['Repeat']]
          },
          axis: {
            x: {
              type: 'timeseries',
              tick: {
                format: '%Y-%m-%d',
              },
            },
            y: {
                min: 0,
                padding: 0
            }
          }
        };

        let counts = await getReferralsCount(accountId, botId, Number(startDate), Number(endDate), filters);
        const dateAgg = counts.dateAgg;
        for (let m = moment(startDateM), newUsers, repeatUsers, index, val; m.isSameOrBefore(endDateM); m.add(1, 'days')) {
          newUsers=0;
          repeatUsers=0;
          graphData.data.columns[0].push(m.format('YYYY-MM-DD'));
          index = m.format('YYYYMMDD').toString();
          val = dateAgg[index];
          if (val) {
            newUsers = val.newUsers.value ? val.newUsers.value : 0;
            repeatUsers = val.repeatUsers.value ? val.repeatUsers.value : 0;
          }
          graphData.data.columns[1].push(newUsers);
          graphData.data.columns[2].push(repeatUsers);
        }
        data[currentMetric] = {};
        data[currentMetric].dateAggregation = graphData;
        data[currentMetric].refIdAggregation = counts.refIdAgg;
        data[currentMetric].refIds = counts.refIds;
        break;
      }
      case metricType.OVERVIEW: {
          const sDate = moment(startDate).format('YYYYMMDD');
          const eDate = moment(endDate).format('YYYYMMDD');
          const summaryDate = summaryStartDate ? moment(summaryStartDate).format('YYYYMMDD') : null;

          const usersDataCurrentPromise = getUserChangeData(accountId, botId, sDate, eDate, filters);
          const sessionDataCurrentPromise = getMessagesSessionEngagedCount(accountId, botId, Number(startDate), Number(endDate), filters);
          const messagesDataCurrentPromise = getMessagesCount(accountId, botId, Number(startDate), Number(endDate), filters);
          const subscriptionDataCurrentPromise = getSubscriptionChangeCount(accountId, botId, Number(startDate), Number(endDate), filters);
          const referralsDataCurrentPromise =  getReferralsCount(accountId, botId, Number(startDate), Number(endDate), filters);

          const usersDataPastPromise = getUserChangeData(accountId, botId, summaryDate, eDate, filters);
          const sessionDataPastPromise = getMessagesSessionEngagedCount(accountId, botId, Number(summaryDate), Number(endDate), filters);
          const messagesDataPastPromise = getMessagesCount(accountId, botId, Number(summaryDate), Number(endDate), filters);
          const subscriptionDataPastPromise = getSubscriptionChangeCount(accountId, botId, Number(summaryDate), Number(endDate), filters);
          const referralsDataPastPromise =  getReferralsCount(accountId, botId, Number(summaryDate), Number(endDate), filters);


          const usersDataCurrent = await usersDataCurrentPromise;
          const sessionDataCurrent = await sessionDataCurrentPromise;
          const messagesDataCurrent = await messagesDataCurrentPromise;
          const subscriptionDataCurrent = await subscriptionDataCurrentPromise;
          const referralsDataCurrent = await referralsDataCurrentPromise;

          const usersDataPast = await usersDataPastPromise;
          const sessionDataPast = await sessionDataPastPromise;
          const messagesDataPast = await messagesDataPastPromise;
          const subscriptionDataPast = await subscriptionDataPastPromise;
          const referralsDataPast = await referralsDataPastPromise;

          // New Users
          const newUsersCurrent = Object.keys(usersDataCurrent).reduce(function (previous, key) {
                                return previous + usersDataCurrent[key].new;
                            }, 0);
          const newUsersPast = Object.keys(usersDataPast).reduce(function (previous, key) {
                                return previous + usersDataPast[key].new;
                            }, 0);

          // New session
          const newSessionCurrent = Object.keys(sessionDataCurrent).reduce(function (previous, key) {
                                return previous + sessionDataCurrent[key].newSessions.value;
                            }, 0);
          const newSessionPast = Object.keys(sessionDataPast).reduce(function (previous, key) {
                                return previous + sessionDataPast[key].newSessions.value;
                            }, 0);

          // Total <essages
          const totalMessagesCurrent = Object.keys(messagesDataCurrent).reduce(function (previous, key) {
                                return previous + messagesDataCurrent[key].messagesIn.value + messagesDataCurrent[key].messagesOut.value;
                            }, 0);
          const totalMessagesPast = Object.keys(messagesDataPast).reduce(function (previous, key) {
                                return previous + messagesDataPast[key].messagesIn.value + messagesDataPast[key].messagesOut.value;
                            }, 0);

          // In Messages
          const inMessagesCurrent = Object.keys(messagesDataCurrent).reduce(function (previous, key) {
                                return previous + messagesDataCurrent[key].messagesIn.value;
                            }, 0);
          const inMessagesPast = Object.keys(messagesDataPast).reduce(function (previous, key) {
                                return previous + messagesDataPast[key].messagesIn.value;
                            }, 0);

          // Out Messages
          const outMessagesCurrent = Object.keys(messagesDataCurrent).reduce(function (previous, key) {
                                return previous + messagesDataCurrent[key].messagesOut.value;
                            }, 0);
          const outMessagesPast = Object.keys(messagesDataPast).reduce(function (previous, key) {
                                return previous + messagesDataPast[key].messagesOut.value;
                            }, 0);

          // New Subscription
          const newSubscriptionCurrent = Object.keys(subscriptionDataCurrent).reduce(function (previous, key) {
                                return previous + subscriptionDataCurrent[key].new.value;
                            }, 0);
          const newSubscriptionPast = Object.keys(subscriptionDataPast).reduce(function (previous, key) {
                                return previous + subscriptionDataPast[key].new.value;
                            }, 0);

          // Referrals
           const newReferralsCurrent = Object.keys(referralsDataCurrent.dateAgg).reduce(function (previous, key) {
                                return previous + referralsDataCurrent.dateAgg[key].newUsers.value;
                            }, 0);
           const newReferralsPast = Object.keys(referralsDataPast.dateAgg).reduce(function (previous, key) {
                                return previous + referralsDataPast.dateAgg[key].newUsers.value;
                            }, 0);

          const result = {
              firstRow: [
                {
                    metric: 'New Users',
                    number: newUsersCurrent,
                    change: calculatePercentageChange(newUsersCurrent, newUsersPast)
                },
                {
                    metric: 'New Sessions',
                    number: newSessionCurrent,
                    change: calculatePercentageChange(newSessionCurrent, newSessionPast)
                }
              ],
              secondRow: [
                  {
                    metric: 'Total Messages',
                    number: totalMessagesCurrent,
                    change: calculatePercentageChange(totalMessagesCurrent, totalMessagesPast)
                  },
                  {
                    metric: 'In Messages',
                    number: inMessagesCurrent,
                    change: calculatePercentageChange(inMessagesCurrent, inMessagesPast)
                  },
                  {
                    metric: 'Out Messages',
                    number: outMessagesCurrent,
                    change: calculatePercentageChange(outMessagesCurrent, outMessagesPast)
                  }
              ],
              thirdRow: [
                  {
                    metric: 'New Subscriptions',
                    number: newSubscriptionCurrent,
                    change: calculatePercentageChange(newSubscriptionCurrent, newSubscriptionPast)
                  },

                  {
                    metric: 'New Referrals',
                    number: newReferralsCurrent,
                    change: calculatePercentageChange(newReferralsCurrent, newReferralsPast)
                  },
              ]
          }

          data[metricType.OVERVIEW] = result;

      }
      case metricType.NODE_ANALYSIS: {
        let counts = await getNodeAnalysisData(accountId, botId, Number(startDate), Number(endDate), filters);
        data[metricType.NODE_ANALYSIS] = counts;
        break;
      }
      default:
    }
    successResponse.data = { metrics: data };
    return successResponse;
  } catch (e) {
    /* eslint-disable no-console */
    console.log(e);
    return { e }
    /* eslint-enable no-console */
  }
}
