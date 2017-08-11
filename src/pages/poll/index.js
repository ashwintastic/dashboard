import React from 'react';
import { connect } from 'react-redux';
import Poll from './Poll';

import {
    fetchPollsEntries,
    fetchPollDetails,
    initNewPoll,
    pollValueChange,
    addNewQuestion,
    createPoll,
    getPoll,
    savePoll,
    getLanguagesList,
    getWrapupBroadcast,
    setPollDate,
    editPollBroadcastFlag,
    setPollData
} from '../../actions/poll';
import {
    setManageAccountId,
} from '../../actions/manageAccount';
import {
    setCurrentBotId,
    setCreateDialog,
} from '../../actions/flow';
import { redirect} from '../../actions/route';
import { refreshUserDetails } from '../../actions/auth';
import moment from 'moment';

const mapStateToProps = (state) => {
    let pollState = state.botPolls;
    return {
        pollData: pollState.currentPoll,
        languages: pollState.languagesList,
        pollBroadcastTime: pollState.pollBroadcast ? moment(pollState.pollBroadcast.date + ' ' + pollState.pollBroadcast.time, "YYYY-MM-DD hh:mm A").toDate() : null,
        dialogstate: state.botFlows.createBotFlag,
        allAccounts: state.accounts.list,
    };
};

const mapDispatch = (dispatch) => ({

    onPollValueChange: (e) => {
        dispatch(pollValueChange(e.target.value));
    },
    addQuestion: (pollName) => {
        dispatch(addNewQuestion(pollName, newQuestion));
        //var newQuestion = `q-${this.state.pollQuestions.length}`;
        //this.setState(Object.assign({}, this.state, { pollQuestions: this.state.pollQuestions.concat([newQuestion]) }));
    },
    onCloseDialog: () => dispatch(setCreateDialog(false)),
    onCancelClick: (accountId, botId) => dispatch(redirect(`/accounts/${accountId}/bots/${botId}/polls`)),
    onSaveClick: (poll) => {
        dispatch(setCreateDialog(false));
        delete poll.init;
        dispatch(savePoll(poll));
    },
    onSaveEditClick: (poll) => {
        dispatch(setCreateDialog(false));
        dispatch(editPollBroadcastFlag(true));
        delete poll.init;
        dispatch(savePoll(poll));
    },
    onSavePoll: (poll, pollBroadcastTime, prevPollData) => {
        for (var i = 0, len = poll.questions.length; i < len; i++) {
            delete poll.questions[i].seqId;
            delete poll.questions[i].validations;
            delete poll.questions[i].labelsShowCss;
            delete poll.questions[i].skipAll;
            for (var j = 0, lenJ = poll.questions[i].options.length; j < lenJ; j++) {
                delete poll.questions[i].options[j].seqId;
            }
        }
        poll.startDate = poll.startDateTime;
        poll.startTime = poll.startDateTime;
        poll.endDate = poll.endDateTime;
        poll.endTime = poll.endDateTime;

        if (poll._id) {
            let pollEndDate = moment(poll.endDate, "YYYY-MM-DD hh:mm A").toDate();
            if (prevPollData) {
                prevPollData.endTime = moment(prevPollData.endTime).subtract(moment().utcOffset(), 'minutes').format('hh:mm A');
                prevPollData.endDate = moment(prevPollData.endDate).subtract(moment().utcOffset(), 'minutes').format('YYYY-MM-DD');
                let prevEndDate = moment(prevPollData.endDate + ' ' + prevPollData.endTime, "YYYY-MM-DD hh:mm A").toDate()
                if (poll.wrapupBroadcastId && pollEndDate && prevEndDate && (JSON.stringify(pollEndDate) != JSON.stringify(prevEndDate))) {
                    dispatch(setCreateDialog(true));
                    return
                }
            }
            delete poll.init;
            delete poll.startDateTime;
            delete poll.endDateTime;
            delete poll.validations;
            dispatch(savePoll(poll));
        } else {
            dispatch(createPoll(poll));
        }
    }
});

const PollingPage = connect(mapStateToProps, mapDispatch)(Poll);

export default function ({ params, context }) {
    const botId = params.botId;
    const accountId = params.accountId;
    const pollId = params.pollId;
    (function dispatchActions(dispatch) {
        dispatch(refreshUserDetails());
        dispatch(getLanguagesList());
        dispatch(getWrapupBroadcast(pollId));
        dispatch(setManageAccountId(accountId));
        dispatch(editPollBroadcastFlag(false));
        dispatch(setCurrentBotId(botId));
        if (pollId) {
            dispatch(getPoll(botId, pollId));
        } else {
           dispatch(setPollData({})); // empty the poll data for create flow
        }
    }(context.store.dispatch));
    return (
        <PollingPage botId={botId}
            accountId={accountId} />
    );
}
