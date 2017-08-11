import { flows as flowService } from '../db/botData/services';
import { testLinks as testLinksService } from '../db/botData/services';

class FlowService {
  getFlowsForBot(botId) {
    return flowService.findAll({ botId });
  }
  getAllFlows() {
    // temporary fix, change the logic to just get flows for a specific bot.
    return flowService.findAll({}, {limit: 1000});
  }

  getFlowData(flowId) {
    return flowService.findById(flowId);
  }

  saveFlowData(flow) {
    return flowService.save(flow);
  }
  deleteFlowData(flowId) {
    return flowService.removeById(flowId);
  }
  createFlowDoc(botId, flow) {
    return flowService.create({ ...flow, botId });
  }

  createTestLink(testLinkParams) {
      return testLinksService.create(testLinkParams);
  }

  getTestLink(testlinkId) {
      return testLinksService.findById(testlinkId);
  }

  getTestLinks(flowId) {
      return testLinksService.findAll({flowId : flowId});
  }

  saveTestLinks(testlink) {
      return testLinksService.save(testlink);
  }
}

export default new FlowService();
