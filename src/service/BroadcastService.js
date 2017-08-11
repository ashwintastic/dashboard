import {
    broadcasts as broadcastService,
    broadcastNodes as broadcastNodesService,
    subscriptions as subscriptionsService
} from '../db/botData/services';

import schedulerService from './SchedulerService';
import _ from 'lodash';
import uuid from 'node-uuid';

class BroadcastService {
    getSubscriptionsForBot(botId) {
        return subscriptionsService.findAll({ botId });
    }
    getSubscriptionsForAccount(accountId) {

    }
    getBroadcastEntriesForBot(botId) {
        return broadcastService.findAll({ botId });
    }
    getBroadcastEntriesForPoll(botId, pollId) {
        return broadcastService.findOne({ botId: botId, pollId: pollId });
    }
    getPollBroadcastData(pollId) {
        return broadcastService.findOne({ pollId: pollId });
    }

    async getBroadcastEntry(broadcastId) {
        // move custom nodes to broadcast nodes
        const broadcast = await broadcastService.findById(broadcastId);
        if (!(broadcast && broadcast.broadcastNodeId)) {
            return broadcast;
        }
        const broadcastNode = await broadcastNodesService.findById(broadcast.broadcastNodeId);
        if (!(broadcastNode && broadcastNode.nodes)) {
            return broadcast;
        }
        // replace custom node name with custom node objects from broadcast_nodes
        _(broadcast.nodes).each((nodeName, index) => {
            broadcast.nodes[index] = broadcastNode.nodes[nodeName]
                ? broadcastNode.nodes[nodeName]
                : nodeName
        });
        broadcast.nodes = broadcast.nodes.map(x=> {
            if (x.broadcastType === 'poll-summary'){
                x = _.assignIn({}, {'viewcount':x.viewcount});
            }
            return x;
        })
        return broadcast;
    }

    async saveBroadcastEntry(broadcastEntry) {
        // move custom nodes to broadcast nodes
        const broadcastUpdated = await this.processBroadcastForCustomNodes(broadcastEntry);
        const broadcast = await broadcastService.save(broadcastUpdated);
        // remove older schedules from agenda and create new ones
        const cancelOldSchedulesStatus = await schedulerService.cancelJob(broadcast);
        if (!cancelOldSchedulesStatus) {
            console.log('Could not remove old jobs for broadcast', broadcast);
        }
        await schedulerService.scheduleJob(broadcast);
        return broadcast;
    }

    async createBroadcastEntry(broadcastEntry) {
        // move custom nodes to broadcast nodes
        const broadcastUpdated = await this.processBroadcastForCustomNodes(broadcastEntry);
        const broadcast = await broadcastService.create(broadcastUpdated);
        await schedulerService.scheduleJob(broadcast);
        return broadcast;
    }

    // On broadcast delete, remove broadcastNodes and scheduled agendaJobs
    async deleteBroadcastEntry(broadcastId) {
        const broadcast = await broadcastService.findById(broadcastId);
        await broadcastNodesService.removeById(broadcast.broadcastNodeId);
        await schedulerService.cancelJob(broadcast);
        return broadcastService.removeById(broadcastId);
    }

    saveBroadcastNodeEntry(broadcastNodeEntry) {
        return broadcastNodesService.save(broadcastNodeEntry);
    }

    createBroadcastNodeEntry(broadcastNodeEntry) {
        return broadcastNodesService.create(broadcastNodeEntry);
    }

    getBroadcastNodeEntry(broadcastId) {
        return broadcastNodesService.findAll({ broadcastId });
    }

    getBroadcastNodeEntryForBot(botId) {
        return broadcastNodesService.findAll({ botId: botId });
    }

    // saves custom node in broadcast in broadcast_nodes and returns the updated broadcast with broadcast_node id
    async processBroadcastForCustomNodes(broadcast) {
        const customNodes = {};
        const nodes = [];
        console.log('broadcast.nodes!!!!!!!!!!!!!!!!!>',broadcast.nodes)
        _(broadcast.nodes).each(x => {
            if (typeof x !== 'string') {
                const nodeName = 'bn-' + uuid.v4();
                customNodes[nodeName] = x;
                nodes.push(nodeName);
            } else {
                nodes.push(x);
            }
        });
        // replace nodes with new nodes (custom nodes replaced)
        broadcast.nodes = nodes;

        if (!Object.keys(customNodes).length) {
            // There are no custom nodes in the broadcast.
            if (broadcast.broadcastNodeId) {
                // Remove existing broadcast node in db if any.
                await broadcastNodesService.removeById(broadcastNode._id);
                broadcast.broadcastNodeId = null;
            }
            return broadcast; // Return broadcast with null as broadcast_node id.
        }
        // There are custom nodes in the broadcast.
        let broadcastNode = null;
        if (broadcast.broadcastNodeId) {
            broadcastNode = await broadcastNodesService.findById(broadcast.broadcastNodeId);
            // There is an existing broadcast_node. Replace its custom nodes with the new one and save it.
            broadcastNode.nodes = customNodes;
            await broadcastNodesService.save(broadcastNode);
        } else {
            // There is no existing broadcast node in db. Create a new entry.
            const newBroadcastNode = { botId: broadcast.botId, nodes: customNodes };
            broadcastNode = await broadcastNodesService.create(newBroadcastNode);
            broadcast.broadcastNodeId = broadcastNode._id;
        }

        return broadcast;
    }
}

export default new BroadcastService();
