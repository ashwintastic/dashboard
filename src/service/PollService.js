import {
  polls as pollsService
} from '../db/botData/services';
import { lang } from 'botworx-utils/lib/lang';


class PollingService {

  save(poll) {
    return pollsService.save(poll);
  }

  createPoll(poll) {
    return pollsService.create(poll);
  }

  deletePoll(id) {
    return pollsService.removeById(id);
  }

  getAllPolls(botId, paging) {
    return pollsService.findByPage(botId, paging);
  }

  getAllActivePolls(botId, paging){
    return pollsService.findAllActivePollsByPage(botId, paging);
  }

  getAllPendingPolls(botId, paging){
    return pollsService.findAllPendingPollsByPage(botId, paging);
  }

  getAllClosedPolls(botId, paging){
    return pollsService.findAllClosedPollsByPage(botId, paging);
  }

  getAllInactivePolls(botId, paging){
    return pollsService.findAllInactivePollsByPage(botId, paging);
  }

  getPollStatus(poll) {
    return pollsService.pollStatus(poll);
  }
  getPollData(pollId) {
    return pollsService.findById(pollId);
  }
  getAllLanguages() {
    return lang.langs();
  }

}
export default new PollingService();
