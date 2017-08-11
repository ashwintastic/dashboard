import express from 'express';
import pollingService from '../service/PollService';
import pollSummaryService from '../service/PollSummaryService';

const router = express.Router();

router.get('/', async (req, res) => {
    const pollId = req.query.pollid;
    const viewCount = req.query.viewcount === "true" ? true : false;
    const poll = await pollingService.getPollData(pollId);
    const pollSummary = await pollSummaryService.getPollSummaryData(pollId);
    const pollSummaryData = getPollSummaryGraphData(poll, pollSummary, viewCount);

    const summaryData = {
        name: poll.name,
        description: poll.description,
        isCount: viewCount,
        summary: pollSummaryData
    };
    if (viewCount && pollSummary) {
        summaryData.totalStarted = pollSummary.totalStarted;
        summaryData.totalFinished = pollSummary.totalFinished;
    }
    return res.send(summaryData);
});

function getPollSummaryGraphData(poll, pollSummary, viewCount) {
    if (!(poll && poll.questions && pollSummary && pollSummary.questions)) {
        return;
    }
    const respData = [];
    for (const questionData of poll.questions) {
        const pollSummaryForQuestion = pollSummary.questions[questionData.id];

        let totalResponses = pollSummaryForQuestion && pollSummaryForQuestion.total
            ? pollSummaryForQuestion.total
            : 0;

        let optionDetails = [];

        for (const option of questionData.options) {
            const optionResponses = pollSummaryForQuestion.options[option.id] || 0;
            const optionDetail = {};
            optionDetail.count = viewCount
                ? optionResponses
                : totalResponses ? ((optionResponses / totalResponses) * 100) : 0;

            optionDetail.label = option.label;
            optionDetails.push(optionDetail);
        }

        respData.push({ question: questionData.label, text: questionData.text, data: optionDetails });
    }
    return respData;
}

export const pollSummaryRouter = router;
