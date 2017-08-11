import apiActionFactory from './factory/apiActionFactory';
import apiData from '../utils/apiData';
import {
    DASHBOARD_USER_ENTRIES_FETCHING,
    DASHBOARD_USER_ENTRIES_FETCHED,
    DASHBOARD_USER_ENTRIES_FAILED,
    DASHBOARD_USER_ENTRY_SAVE_COMPLETED,
    DASHBOARD_USER_ENTRY_SAVE_STARTING,
    DASHBOARD_USER_ENTRY_SAVE_FAILED,
    DASHBOARD_USER_ENTRY_DELETE_STARTING,
    DASHBOARD_USER_ENTRY_DELETE_COMPLETED,
    DASHBOARD_USER_ENTRY_DELETE_FAILED,
    DASHBOARD_USER_ENTRY_CREATE,
    DASHBOARD_USER_ENTRY_EDIT,
    DASHBOARD_USER_ENTRY_DATA_CHANGE,
    SET_ADD_USER_FLAG,
    ALL_USERS_ENTRIES_FETCHING,
    ALL_USERS_ENTRIES_FETCHED,
    ALL_USERS_ENTRIES_FAILED,
    SET_SELECTED_USER_NAME,
    BOT_USER_ENTRIES_FETCHING,
    BOT_USER_ENTRIES_FETCHED,
    BOT_USER_ENTRIES_FAILED,
    SET_EDIT_USER_ID,
    DASHBOARD_USER_MAP_LIST
} from '../constants/actionTypes';
import { redirect, navigate } from './route';
import { setNotification } from './notification';
import { notificationConfig } from '../config';
var generatePassword = require('password-generator');
import { setErrorNotification, setSuccessNotification } from './notification';
import { USER_CREATED_SUCCESSFULLY,
         USER_UPDATED_SUCCESSFULLY,
         USER_DELETED_SUCCESSFULLY,
         USER_ERROR_MESSAGE,
         USER_DUPLICATE_MESSAGE,
         ERROR_MESSAGE,
} from '../noticationMessages/messages'

export function fetchAccountUserEntries(accountId) {
    const fetchAccountUserEntries = apiActionFactory({
        fetchingActionType: DASHBOARD_USER_ENTRIES_FETCHING,
        fetchedActionType: DASHBOARD_USER_ENTRIES_FETCHED,
        fetchFailedActionType: DASHBOARD_USER_ENTRIES_FAILED,
        fetchApi: `/api/accounts/${accountId}/userlist`,
        actionMeta: {
            accountId
        },
        transform: ({ userEntries }) => ({
            userEntries: userEntries.map(ue => ({
                id: ue._id,
                email: ue.email,
                roles: ue.roles,
                FirstName: ue.FirstName,
                LastName: ue.LastName,
                accounts: ue.accounts ? ue.accounts : [],
                bots: ue.bots ? ue.bots : [],
                auth: {
                    local: {
                        password: ue.auth.local ? ue.auth.local.password : '',
                    }
                },
            })),
        }),
    });
    return fetchAccountUserEntries.fetchThunk;
}

export function fetchBotUserEntries(botId) {
    const fetchBotUserEntries = apiActionFactory({
        fetchingActionType: BOT_USER_ENTRIES_FETCHING,
        fetchedActionType: BOT_USER_ENTRIES_FETCHED,
        fetchFailedActionType: BOT_USER_ENTRIES_FAILED,
        fetchApi: `/api/bots/${botId}/userlist`,
        actionMeta: {
            botId
        },
        transform: ({ userEntries }) => ({
            userEntries: userEntries.map(ue => ({
                id: ue._id,
                email: ue.email,
                roles: ue.roles,
                FirstName: ue.FirstName,
                LastName: ue.LastName,
                accounts: ue.accounts ? ue.accounts : [],
                bots: ue.bots ? ue.bots : [],
                auth: {
                    local: {
                        password: ue.auth.local ? ue.auth.local.password : '',
                    }
                },
            })),
        }),
    });
    return fetchBotUserEntries.fetchThunk;
}

export function fetchAllUsers() {
    const fetchAllUsers = apiActionFactory({
        fetchingActionType: ALL_USERS_ENTRIES_FETCHING,
        fetchedActionType: ALL_USERS_ENTRIES_FETCHED,
        fetchFailedActionType: ALL_USERS_ENTRIES_FAILED,
        fetchApi: `/api/userlist`,
        actionMeta: {
        },
        transform: ({ allUsers }) => ({
            allUsers: allUsers.map(au => ({
                id: au._id,
                email: au.email,
                roles: au.roles,
                FirstName: au.FirstName,
                LastName: au.LastName,
                accounts: au.accounts ? au.accounts : [],
                bots: au.bots ? au.bots : [],
                auth: {
                    local: {
                        password: au.auth.local ? au.auth.local.password : '',
                    }
                },
            })),
        }),
    });
    return fetchAllUsers.fetchThunk;
}

export function saveUserEntry(userEntryData, accountId, userId, botId) {
    return (dispatch, getState) => {
        const state = getState();
        userEntryData.auth.local.password = generatePassword(12);
        apiData({
            api: `/api/accounts/${accountId}/edituser/${userId}`,
            method: 'post',
            body: {
                userEntry: userEntryData,
            },
        }, dispatch).then(resp => {
            if (resp.status === 200) {
                if (location.pathname.indexOf('bots') === -1) {
                    dispatch(fetchAccountUserEntries(accountId));
                    dispatch(redirect('/accounts/' + accountId + '/userlist'));
                    dispatch(setSuccessNotification(USER_UPDATED_SUCCESSFULLY));
                }
                else {
                    dispatch(fetchBotUserEntries(botId));
                    dispatch(redirect('/accounts/' + accountId + '/bots/' + botId + '/userlist'));
                    dispatch(setErrorNotification(USER_ERROR_MESSAGE));
                }
            }
        });
    };
}

export function createNewAccountUser(userEntryData, accountId) {
    return async (dispatch, getState) => {
        const state = getState();
        userEntryData.auth.local.password = generatePassword(12);
        userEntryData.accounts.push(accountId);
        const resp = await apiData({
            api: `/api/accounts/${accountId}/userlist`,
            method: 'post',
            body: {
                userEntry: userEntryData,
                emailConfirmed: true,
            },
        }, dispatch).then(resp => {
            if (resp.status === 200) {
                dispatch(fetchAccountUserEntries(accountId));
                dispatch(redirect('/accounts/' + accountId + '/userlist'));
                dispatch(setSuccessNotification(USER_CREATED_SUCCESSFULLY));
            }
            else if (resp.status === 409) {
                dispatch(setErrorNotification(USER_DUPLICATE_MESSAGE));
            }
            else if (resp.status >= 400) {
                dispatch(setErrorNotification(USER_ERROR_MESSAGE));
            }
        });
    };
}

export function createNewBotUser(userEntryData, accountId, botId) {
    return async (dispatch, getState) => {
        const state = getState();
        userEntryData.auth.local.password = generatePassword(12);
        userEntryData.accounts.push(accountId);
        apiData({
            api: `/api/accounts/${accountId}/bots/${botId}/userlist`,
            method: 'post',
            body: {
                userEntry: userEntryData,
                emailConfirmed: true,
            },
        }, dispatch).then(resp => {
            if (resp.status === 200) {
                dispatch(fetchBotUserEntries(botId));
                dispatch(redirect('/accounts/' + accountId + '/bots/' + botId + '/userlist'));
                dispatch(setSuccessNotification(USER_CREATED_SUCCESSFULLY));
            }
            else if (resp.status === 409) {
                dispatch(setErrorNotification(USER_DUPLICATE_MESSAGE));
            }
            else if (resp.status >= 400) {
                dispatch(setErrorNotification(USER_ERROR_MESSAGE));
            }
        });
    };
}

export function removeAccountUserEntry(accountId, userId) {
    return (dispatch, getState) => {
        const state = getState();
        const botId = state.botFlows.botId;
        apiData({
            api: `/api/accounts/${accountId}/userlist/${userId}`,
            method: 'delete',
        }, dispatch).then(resp => {
            if (resp.status === 200) {
                dispatch(fetchAccountUserEntries(accountId));
                dispatch(fetchExistingUserMapList());
                dispatch(setSuccessNotification(USER_DELETED_SUCCESSFULLY));
            }
        }).catch(err => {
          dispatch(setErrorNotification(ERROR_MESSAGE));
        });
    };
}

export function removeBotUserEntry(botId, userId) {
    return (dispatch, getState) => {
        const state = getState();
        const botId = state.botFlows.botId;
        return apiData({
            api: `/api/bots/${botId}/userlist/${userId}`,
            method: 'delete',
        }, dispatch).then(resp => {
            if (resp.status === 200) {
                dispatch(fetchBotUserEntries(botId));
                dispatch(fetchExistingUserMapList());
                dispatch(setSuccessNotification(USER_DELETED_SUCCESSFULLY));
            }
        }).catch(err => {
            dispatch(setErrorNotification(ERROR_MESSAGE));
            console.log('user deletion failed!!!')
        });
    };
}

export function addExistingAccountUser(selectedUser, accountId) {
    return (dispatch, getState) => {
        const state = getState();
        apiData({
            api: `/api/accounts/${accountId}/linkExistinguser`,
            method: 'post',
            body: {
                id: selectedUser,
                accountId: accountId,
            },
        }, dispatch).then(resp => {
            if (resp.status === 200) {
                dispatch(fetchAccountUserEntries(accountId));
                dispatch(fetchExistingUserMapList());
            }
        });
    };
}

export function addExistingBotUser(selectedUser, accountId, botId) {
    return (dispatch, getState) => {
        const state = getState();
        apiData({
            api: `/api/accounts/${accountId}/bots/${botId}/linkExistinguser`,
            method: 'post',
            body: {
                id: selectedUser,
                botId: botId,
            },
        }, dispatch).then(resp => {
            if (resp.status === 200) {
                dispatch(fetchBotUserEntries(botId));
                dispatch(fetchExistingUserMapList());
            }
        });
    };
}

export const createNewUserEntry = (payload) => ({
    type: DASHBOARD_USER_ENTRY_CREATE,
    payload
})

export const fetchExistingUserMapList = (payload) => ({
    type: DASHBOARD_USER_MAP_LIST,
    payload
})

export const editUserEntry = (payload) => ({
    type: DASHBOARD_USER_ENTRY_EDIT,
    payload
})

export const userEntryDataChange = (payload) => ({
    type: DASHBOARD_USER_ENTRY_DATA_CHANGE,
    payload
})

export const setAddUserFlag = (payload) => ({
    type: SET_ADD_USER_FLAG,
    payload
})

export const setExistingUserName = (payload) => ({
    type: SET_SELECTED_USER_NAME,
    payload
})

export const setEditUserId = (payload) => ({
    type: SET_EDIT_USER_ID,
    payload
})
