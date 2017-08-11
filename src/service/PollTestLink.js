import apiData from '../utils/apiData';
import { botEngine } from '../config';

class PollTestLinkService {
  async pollTestLink(polltestLinkParams) {
    // Create an object id, pass it to bot-engine and get a testRef from bot-engine
    // TODO make changes in botworx-data to return unique id for db insert
    console.log("botEngine.url", botEngine.url)
    const resp = await apiData({
      api: botEngine.url+`/dev/createmdotmeref/`,
      method: 'post',
      body: {
        id: polltestLinkParams,
        type: "pollTestLink"
      }
    });
    if (resp.status === 200) {
      const respValue = await resp.text();
      return respValue;
    } else {
      console.log("Broken! didn't get response from Bot Engine");
    }
  }

}

export default new PollTestLinkService();
