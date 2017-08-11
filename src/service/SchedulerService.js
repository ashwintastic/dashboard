import * as config from '../config';
import { services } from '../db/botData/services';
const moment = require('moment');
const _ = require('lodash');
const uuid = require('node-uuid');

const botworxSchedulerConfig = {
    botEngineURL: config.botEngine.url,
    db: {
        address: config.db.agendaUrl
    }
};

// TODO Not able to overwrite console.trace on object created with 'Object.create'. 'Console.trace' generates stack trace.
// Implement a custom logger
const logger = console;
logger.debug = logger.info;
logger.trace = logger.info;

// Need to only start scheduler not processor. BE is currently processing jobs.
const BotworxSchedulerHandler = require('botworx-scheduler');
BotworxSchedulerHandler.BotworxScheduler.InitializeJobScheduler(services, botworxSchedulerConfig, logger);

class SchedulerService {
    getBroadcastDateTimeUtc(broadcast) {
        return moment.utc(broadcast.date + "-" + broadcast.time, "YYYY-MM-DD-HH:mm").format();
    }

    async cancelJob(broadcast) {
        return BotworxSchedulerHandler.BotworxScheduler.GetInstance().cancelJob(
            { 'data.broadcastId': broadcast._id })
            .then(x => {
                console.log('cancelled job from agenda for broadcast', broadcast);
                return true;
            })
            .catch(err => {
                console.log(err);
                return false;
            });
    }
    async scheduleBroadcastJob(broadcast, jobConfig) {
        if ((broadcast.type && broadcast.type.toLowerCase() !== 'scheduled')) {
            console.log('scheduling immediate broadcast job');
            return this.scheduleJobNow(broadcast, jobConfig);
        }

        // if broadcast time less than 10 minutes in the past, set that as now job
        const diff = moment().diff(this.getBroadcastDateTimeUtc(broadcast), 'minutes');
        console.log('scheduled broadcast diff with current time (in mins)', diff);

        // if repeat is set, schedule as a repeat job
        if (broadcast.repeat !== "None") {
            console.log('scheduling repeat job');
            return this.scheduleRepeatJob(broadcast, jobConfig);
        }
        // scheduled time is in the past "currentMillis - scheduledMillis", +ve means past, -ve means future
        if (diff > 10) {
            throw new Error('Scheduled time cannot be a past time.')
        }
        // Scheduled time, but in the past less than 10 mins. Process as now job.
        if (diff > 0) {
            console.log('scheduled broadcast in past but less than 10 mins, scheduling immediate job');
            return this.scheduleJobNow(broadcast, jobConfig);
        }
        console.log('scheduling one time broadcast job');
        return this.scheduleOneTimeJob(broadcast, jobConfig);
    }

    async scheduleJob(broadcast) {
        console.log('creating schedule for ', broadcast);
        if (broadcast.type === 'automatic') {
            return;
        }
        const jobConfig = {
            broadcastId: broadcast._id,
            broadcastNodeId: broadcast.broadcastNodeId,
            botId: broadcast.botId,
            nodes: broadcast.nodes
        };
        switch (broadcast.jobType) {
            // Do nothing
            case BotworxSchedulerHandler.JobType.BROADCAST: break;
            // Add subscriptionId for subscriptionbroadcast job
            case BotworxSchedulerHandler.JobType.SUBSCRIPTION_BROADCAST: {
                jobConfig.subscriptionId = broadcast.subscriptionId;
                break;
            }
        }
        this.scheduleBroadcastJob(broadcast, jobConfig);
    }

    scheduleJobNow(broadcast, jobConfig) {
        return BotworxSchedulerHandler.BotworxScheduler.GetInstance().scheduleJobNow(broadcast.jobType, jobConfig);
    }

    scheduleOneTimeJob(broadcast, jobConfig) {
        // scheduling in UTC time now, so referenceTimeUTCOffsetInMinutes = 0
        return BotworxSchedulerHandler.BotworxScheduler.GetInstance().scheduleOneTimeJob(
            broadcast.jobType,
            moment(this.getBroadcastDateTimeUtc(broadcast)).toDate(),
            0,
            broadcast.timeZone === 'user',
            jobConfig);
    }

    scheduleRepeatJob(broadcast, jobConfig) {
        // scheduling in UTC time now, so referenceTimeUTCOffsetInMinutes = 0
        return BotworxSchedulerHandler.BotworxScheduler.GetInstance().scheduleRepeatJob(
            broadcast.jobType,
            moment(this.getBroadcastDateTimeUtc(broadcast)).toDate(),
            0,
            broadcast.repeat.toLowerCase().replace(/every/, 'one'),
            broadcast.timeZone === 'user',
            jobConfig);
    }
}

export default new SchedulerService();
