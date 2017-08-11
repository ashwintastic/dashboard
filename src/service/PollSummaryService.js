import { pollSummaries as pollSummaryService } from '../db/botData/services';

class PollSummary {
  getPollSummaryData(pollId, viewCount) {
    return pollSummaryService.findOne({ pollId: pollId });
  }
}

export default new PollSummary();
