import mongoose from 'mongoose';
import apiData from '../utils/apiData';
import { botEngine } from '../config';
import flowService from './FlowService';
import { testLinks as testLinksService } from '../db/botData/services';

class TestlinkService {
    async createTestLink(testLinkParams) {
        // Create an object id, pass it to bot-engine and get a testRef from bot-engine
        // TODO make changes in botworx-data to return unique id for db insert
        testLinkParams._id = mongoose.Types.ObjectId();

        const resp = await apiData({
            api: botEngine.url + `/dev/createtestref/`,
            method: 'post',
            body: {
                overrideFlowId: testLinkParams.flowId,
                id: testLinkParams._id,
                type: "testLink"
            }
        });
        if (resp.status === 200) {
            const respValue = await resp.text();
            testLinkParams.testRef = respValue;
            return await flowService.createTestLink(testLinkParams);

        } else {
            console.log("Broken! didn't get response from Bot Engine");
        }
    }

    deleteTester(testerEmail, flowId) {
        return testLinksService.removeAll({ testerEmail: testerEmail, flowId: flowId});
    }

    getTestLinksForTester(testerEmail) {
      return testLinksService.findAll({testerEmail : testerEmail});
  }

}

export default new TestlinkService();
