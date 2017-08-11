
import { flowOverrides as flowOverridesService } from '../db/botData/services';

class FlowOverridesService {
  deleteFlowOverridesForTestLink(testLinkId) {
    return flowOverridesService.removeAll({ testLinkId: testLinkId});
  }
  getFlowOverridesForFlow(flowId) {
    return flowOverridesService.findAll({ newFlowId: flowId });
  }
}

export default new FlowOverridesService();
