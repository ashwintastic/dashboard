import React from 'react';
import { connect } from 'react-redux';
import AccountUsersPage from './AccountUsers';
import {
    fetchAccountUserEntries,
    fetchBotUserEntries,
    fetchAllUsers,
    editUserEntry,
    removeAccountUserEntry,
    removeBotUserEntry,
    setAddUserFlag,
    setExistingUserName,
    addExistingAccountUser,
    addExistingBotUser,
    createNewUserEntry,
    fetchExistingUserMapList,
} from '../../actions/dashboardUser';
import {
    setManageAccountId,
} from '../../actions/manageAccount';
import { refreshUserDetails } from '../../actions/auth';
import { setCurrentBotId } from '../../actions/flow';
import { navigate } from '../../actions/route';

const mapStateToProps = (state) => {
    return {
        userEntries: state.linkedUsers.userEntries,
        allUsers: state.linkedUsers.allUsers,
        userEntryData: state.linkedUsers.userEntryData,
        userId: state.auth.user.id,
        botId: state.botFlows.botId,
        accountId: state.manageAccount.currentAccountId,
        currentUserRole: state.auth.user.roles,
        addUserFlag: state.linkedUsers.addUserFlag,
        selectedUser: state.linkedUsers.selectedUser,
        existingUserList: state.linkedUsers.ExistingUserMapList,
    };
};

const mapDispatch = (dispatch) => ({
    onDeleteUserEntry: (accountId, botId, userId) => {
        if (location.pathname.indexOf('bots') === -1) {
            dispatch(removeAccountUserEntry(accountId, userId));
        }
        else {
            dispatch(removeBotUserEntry(botId, userId));
        }
    },
    onEditUserEntry: (accountId, botId, userId) => {
        dispatch(editUserEntry(userId));
        if (location.pathname.indexOf('bots') === -1) {
            dispatch(navigate('/accounts/' + accountId + '/edituser/' + userId));
        }
        else {
            dispatch(navigate('/accounts/' + accountId + '/bots/' + botId + '/edituser/' + userId));
        }
    },
    onAddUserFlag: () => {
        dispatch(setAddUserFlag(true));
        dispatch(fetchExistingUserMapList());
    },
    onCreateNewUserClick: (accountId, botId) => {
        if (location.pathname.indexOf('bots') === -1) {
            dispatch(navigate(`/accounts/${accountId}/createAccountUser`));
        }
        else {
            dispatch(navigate(`/accounts/${accountId}/bots/${botId}/createBotUser`));
        }
        dispatch(createNewUserEntry());
    },
    onExistingUserSave: (selectedUser, accountId, botId) => {
        if (location.pathname.indexOf('bots') === -1) {
            dispatch(addExistingAccountUser(selectedUser, accountId));
        }
        else {
            dispatch(addExistingBotUser(selectedUser, accountId, botId));
        }
        console.log('save clicked');
    },
    onExistingUserValChange: (value) => dispatch(setExistingUserName(value)),
});

const AccountUsersListPage = connect(mapStateToProps, mapDispatch)(AccountUsersPage);

/* eslint-disable react/prop-types */
export default ({ params, context }) => {
    const accountId = params.accountId || '';
    const botId = params.botId || '';
    (function dispatchActions(dispatch) {
        dispatch(refreshUserDetails());

        if (location.pathname.indexOf('bots') === -1) {
            dispatch(fetchAccountUserEntries(accountId));
        }
        else {
            dispatch(fetchBotUserEntries(botId));
        }
        dispatch(setManageAccountId(accountId));
        dispatch(setCurrentBotId(botId));
        dispatch(setAddUserFlag(false));
        dispatch(fetchAllUsers());
    } (context.store.dispatch));
    return <AccountUsersListPage />;
};
/* eslint-enable react/prop-types */
