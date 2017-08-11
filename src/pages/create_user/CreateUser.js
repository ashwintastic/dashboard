import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import s from './CreateUser.css';
import flexbox from '../../components/flexbox.css';
import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';
import EditIcon from 'material-ui/svg-icons/image/edit';
import { blue500, red500, green500 } from 'material-ui/styles/colors';
import Link from '../../components/Link';
import CreateUserEntryIcon from 'material-ui/svg-icons/content/add-box'
import RaisedButton from 'material-ui/RaisedButton';
import RemoveIcon from 'material-ui/svg-icons/action/delete';
import Form from "react-jsonschema-form";
//import TextField from 'material-ui/TextField';
import TextField from '../../components/TextField/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import MultiSelect from '../../components/MultiSelect';
import { userRoleList } from '../../config'
//var Select = require('react-select');

import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';

const styles = {
    columnThree: {
        width: 450,
    },
    columnTwo: {
        width: 450,
    },
    columnOne: {
        width: 450,
    }
};

const title = 'BotWorx.Ai - User Creation';

class CreateUserPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userEntryData: {
            }
        };

    }
    static propTypes = {
        userEntries: PropTypes.array,
    };

    static contextTypes = { setTitle: PropTypes.func.isRequired };

    componentDidMount() {
        this.setState({ userEntryData: this.props.userEntryData });
    }

    componentWillReceiveProps(nextProps) {
        this.setState(Object.assign({}, this.state, { userEntryData: nextProps.userEntryData }));
    }
    render() {
        const {userEntries, userEntrySchema,
            onSaveUserEntry, userEntryData, userId, userRoles, onUserEntryDataChange,
            onCancelUserEntry, accountId, accountList, onAccountValueSelect, botList, onBotValueSelect,
            currentUserRole, edituserId, botId, errorText, userRoleError, allBots
        } = this.props;
        this.context.setTitle(title);
        var accountOptions = [];
        var botOptions = [];
        if (currentUserRole && (currentUserRole === 'SuperAdmin') || (currentUserRole === 'SuperAdmin')) {
            if (allBots && allBots.length > 0) {
                allBots.map(y => { botOptions.push({ value: y.id, label: y.name + ' (' + y.id + ')' }) })
            }
        }
        else {
            if (botList && botList.length > 0) {
                botList.map(y => { botOptions.push({ value: y.id, label: y.name + ' (' + y.id + ')' }) })
            }
        }


        if (accountList && Object.keys(accountList).length > 0) {
            Object.keys(accountList).map(accountId => {
                accountOptions.push({ value: accountId, label: accountList[accountId].name + ' (' + accountId + ')' })
            });
        }

        const formTitle = edituserId ? 'Edit User Entry' : 'Create New User Entry';
        return (
            <div className={cx(s.root, flexbox.rowItem)} >
                <Paper className={cx(s.section)} zDepth={5}>
                    <h3 className={cx(s.root)}>{formTitle}</h3>
                    <form className={cx(flexbox.rowItem)}>
                        <TextField
                            floatingLabelText="First Name"
                            value={this.state.userEntryData.FirstName}
                            className={cx(flexbox.rowItem, s.withHorzMargin)}
                            onChange={(e) => {
                                let obj = { FirstName: e.target.value };
                                onUserEntryDataChange(obj)
                            } }
                            />
                        <TextField
                            floatingLabelText="Last Name"
                            value={this.state.userEntryData.LastName}
                            className={cx(flexbox.rowItem, s.withHorzMargin)}
                            onChange={(e) => {
                                let obj = { LastName: e.target.value };
                                onUserEntryDataChange(obj)
                            } }
                            />
                        <TextField
                            floatingLabelText="Email Id"
                            value={this.state.userEntryData.email}
                            className={cx(flexbox.rowItem, s.withHorzMargin)}
                            onChange={(e) => {
                                let obj = { email: e.target.value };
                                onUserEntryDataChange(obj)
                            } }
                            required={true}
                            />
                        <div className={cx(s.errotText)}>{errorText}</div>
                        {(currentUserRole && userRoleList[currentUserRole]) ?
                            <SelectField
                                floatingLabelText="Roles"
                                value={Array.isArray(this.state.userEntryData.roles) ? this.state.userEntryData.roles[0] : this.state.userEntryData.roles}
                                className={cx(flexbox.rowItem, s.withHorzMargin)}
                                onChange={(e, index, value) => {
                                    let obj = { roles: value };
                                    onUserEntryDataChange(obj)
                                } }
                                >
                                {userRoleList[currentUserRole].createRole.map(x => (
                                    <MenuItem value={x} primaryText={x} />))}
                            </SelectField> : null}
                        <div className={cx(s.errotText)}>{userRoleError}</div>
                        {((this.state.userEntryData.roles === "AccountOwner") || (this.state.userEntryData.roles === "AccountEditor")) ?
                            <div className={cx(flexbox.rowItem)}>
                                <MultiSelect label="Accounts" options={accountOptions} userEntry={userEntryData} onDataChange={onAccountValueSelect} selectedVal={userEntryData.accounts} /></div> : null}
                        {((this.state.userEntryData.roles === "BotOwner") || (this.state.userEntryData.roles === "BotEditor")) ?
                            <div className={cx(flexbox.rowItem)}>
                                <MultiSelect label="Bots" options={botOptions} userEntry={userEntryData} onDataChange={onBotValueSelect} selectedVal={userEntryData.bots} /></div> : null}
                        <br /><br />
                        <div>
                            <RaisedButton
                                className={cx(flexbox.rowItem, s.saveButton)}
                                label="Save"
                                primary
                                onClick={(e) => {
                                    onSaveUserEntry(userEntryData, accountId, edituserId, botId)
                                } }
                                />
                            <RaisedButton
                                className={cx(flexbox.rowItem, s.saveButton)}
                                label="Cancel"
                                primary
                                onClick={(e) => {
                                    onCancelUserEntry(accountId, botId)
                                } }
                                /></div>
                    </form>
                </Paper>
            </div >
        )
    }
}

export default withStyles(flexbox, s)(CreateUserPage);
