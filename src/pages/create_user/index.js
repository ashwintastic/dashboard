import React from 'react';
import { connect } from 'react-redux';
import CreateUserPage from './CreateUser';
import {
    fetchUserEntries,
    saveUserEntry,
    deleteUserEntry,
    createNewUserEntry,
    userEntryDataChange,
    createNewAccountUser,
    createNewBotUser,
    setEditUserId,
} from '../../actions/dashboardUser';
import { fetchBotList, fetchAllBots } from '../../actions/accountBots';
import { refreshUserDetails } from '../../actions/auth';
import { setCurrentBotId } from '../../actions/flow';
import { redirect, navigate } from '../../actions/route';
import {
    setErrorText,
    setPastDateErrorText,
    setManageAccountId,
} from '../../actions/manageAccount';

const mapStateToProps = (state) => {
    return {
        userEntryData: state.linkedUsers.userEntryData,
        userId: state.auth.user.id,
        userRoles: state.auth.user.roles,
        currentUserRole: state.auth.user.roles,
        accountId: state.manageAccount.currentAccountId,
        accountList: state.accounts.list,
        botList: state.accountBots.accountBots[state.manageAccount.currentAccountId],
        edituserId: state.linkedUsers.edituserId,
        botId: state.botFlows.botId,
        errorText: state.manageAccount.errorText,
        userRoleError: state.manageAccount.pastDateError,
        allBots: state.accountBots.allBots,
    };
};

const mapDispatch = (dispatch) => ({
    onSaveUserEntry: (userEntryData, accountId, edituserId, botId) => {
        let isValidEmail = false, isUserRoles = false;
        if (!userEntryData.email) {
            dispatch(setErrorText('Email id is required.'));
        } else {
            const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
            if (!emailPattern.test(userEntryData.email)) {
                dispatch(setErrorText('Email id is invalid.'));
            } else {
                dispatch(setErrorText(''));
                isValidEmail = true;
            }
        }

        if (userEntryData.roles.length === 0) {
            dispatch(setPastDateErrorText('User role is required.'));
        } else {
            dispatch(setPastDateErrorText(''));
            isUserRoles = true;
        }

        if (isValidEmail && isUserRoles) {
            if (edituserId) {
                dispatch(saveUserEntry(userEntryData, accountId, edituserId, botId));
            }
            else {
                if (location.pathname.indexOf('bots') === -1) {
                    dispatch(createNewAccountUser(userEntryData, accountId));
                }
                else {
                    dispatch(createNewBotUser(userEntryData, accountId, botId));
                }
            }
        }
    },
    onUserEntryDataChange: (obj) => {
        dispatch(userEntryDataChange(obj));
    },
    onCancelUserEntry: (accountId, botId) => {
        if (location.pathname.indexOf('bots') === -1) {
            dispatch(redirect('/accounts/' + accountId + '/userlist'));
        }
        else {
            dispatch(redirect('/accounts/' + accountId + '/bots/' + botId + '/userlist'));
        }
    },
    onAccountValueSelect: (val, userEntryData) => {
        userEntryData.accounts = [];
        let accountArray = val.split(",");
        accountArray.map(x => userEntryData.accounts.push(x));
    },
    onBotValueSelect: (val, userEntryData) => {
        userEntryData.bots = [];
        let botArray = val.split(",");
        botArray.map(x => userEntryData.bots.push(x));
    }

});

const DashboardUserPage = connect(mapStateToProps, mapDispatch)(CreateUserPage);

/* eslint-disable react/prop-types */
export default ({ params, context }) => {
    const edituserId = params.userId || '';
    const botId = params.botId || '';
    (function dispatchActions(dispatch) {
        const currentstate = context.store.getState();
        const accountId = params.accountId;
        dispatch(refreshUserDetails());
        dispatch(setCurrentBotId(botId));
        dispatch(setManageAccountId(accountId));
        dispatch(setErrorText(''));
        dispatch(setPastDateErrorText(''));
        dispatch(fetchBotList(accountId));
        dispatch(setEditUserId(edituserId));
        dispatch(fetchAllBots());
    } (context.store.dispatch));
    return <DashboardUserPage />;
};
/* eslint-enable react/prop-types */
