import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import s from './CreateAccount.css';
import flexbox from '../../components/flexbox.css';
import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';
import EditIcon from 'material-ui/svg-icons/image/edit';
import { blue500, red500, green500 } from 'material-ui/styles/colors';
import Link from '../../components/Link';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import RemoveIcon from 'material-ui/svg-icons/action/delete';
import Form from "react-jsonschema-form";
import TextField from '../../components/TextField/TextField'
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import MultiSelect from '../../components/MultiSelect';
import Select, { Option, OptGroup } from 'rc-select';
import momentTimeZone from "moment-timezone";
import Dialog from 'material-ui/Dialog';
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

const title = 'BotWorx.Ai - Account Creation';

class CreateAccountPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            accountEntryData: {
            },
            warningForTimeZone: false,
            timeZoneWarningOpen: false,
        };

    }

    static contextTypes = { setTitle: PropTypes.func.isRequired };

    componentDidMount() {
        this.setState({ accountEntryData: this.props.accountEntryData });
        if(!this.props.accountEntryData.timezone) {
            this.props.onAccountEntryDataChange({ timezone: 'US/Pacific'});
        }
    }
    componentWillReceiveProps(nextProps) {
        this.setState(Object.assign({}, this.state, { accountEntryData: nextProps.accountEntryData }));
        const { isCreateFlow, timezone } = this.props;
        if(!isCreateFlow && timezone != nextProps.accountEntryData.timezone) {
            console.log('edited, changed ans saving');
            this.setState({warningForTimeZone: true});
        }
    }

    handleWarningModalOpen = () => {
     this.setState({timeZoneWarningOpen: true});
    }

    handleWarningModalClose = () => {
     this.setState({timeZoneWarningOpen: false});
    }

    handleWarningModalSave = () => {
        const { onSaveAccountEntry, accountEntryData, userId, userEmail, accountId} = this.props;
        onSaveAccountEntry(accountEntryData, userId, userEmail, accountId);
        this.handleWarningModalClose();
        this.setState({warningForTimeZone: false});
    }

    render() {
        const { onSaveAccountEntry, accountEntryData, userId, userEmail, onAccountEntryDataChange,
            onCancelAccountEntry, accountId, errorText, isCreateFlow
        } = this.props;
        this.context.setTitle(title);
        const accountTitle = isCreateFlow ? "Create New Account Entry" : "Edit Account Entry";

        const actions = [
            <FlatButton
                label="Cancel"
                primary={true}
                onTouchTap={this.handleWarningModalClose}
            />,
            <FlatButton
                label="Save"
                primary={true}
                onTouchTap={this.handleWarningModalSave}
            />,
        ];

        return (
            <div className={cx(s.root, flexbox.rowItem)}>
                <Paper className={cx(s.section)} zDepth={5}>
                    <h3 className={cx(s.root)}> {accountTitle} </h3>
                    <form className={cx(flexbox.rowItem)}>
                        <TextField
                            floatingLabelText="Account Name"
                            required={true}
                            value={this.state.accountEntryData.name}
                            className={cx(flexbox.rowItem, s.withHorzMargin)}
                            onChange={(e) => {
                                let obj = { name: e.target.value };
                                onAccountEntryDataChange(obj)
                            }}
                            />
                        <div className={cx(s.errotText)}>{errorText}</div>
                        <TextField
                            floatingLabelText="Manager Email"
                            value={this.state.accountEntryData.managerEmail}
                            className={cx(flexbox.rowItem, s.withHorzMargin)}
                            onChange={(e) => {
                                let obj = { managerEmail: e.target.value };
                                onAccountEntryDataChange(obj)
                            }}
                            />
                            <SelectField
                                value={this.state.accountEntryData.timezone}
                                className={cx(flexbox.rowItem, s.withHorzMargin)}
                                floatingLabelText={'Time Zone'}
                                onChange={(e, i, timeZone) => {
                                    let obj = { timezone: timeZone };
                                    onAccountEntryDataChange(obj)
                                }}
                            >
                                <MenuItem value={"All"} primaryText={"All"} />

                                {momentTimeZone.tz.names().map(tz => (
                                    <MenuItem value={tz} primaryText={tz} key={tz} />)
                                )}
                            </SelectField>
                        <div>
                            <RaisedButton
                                className={cx(flexbox.rowItem, s.saveButton)}
                                label="Save"
                                primary
                                onClick={(e) => {
                                    this.state.warningForTimeZone ?
                                    this.handleWarningModalOpen() :
                                    onSaveAccountEntry(accountEntryData, userId, userEmail, accountId)
                                }}
                                />
                            <RaisedButton
                                className={cx(flexbox.rowItem, s.saveButton)}
                                label="Cancel"
                                primary
                                onClick={(e) => {
                                    onCancelAccountEntry()
                                }}
                                /></div>
                    </form>
                    <Dialog
                        title="Please Note:"
                        actions={actions}
                        modal={true}
                        open={this.state.timeZoneWarningOpen}
                        >
                        Account TimeZone impacts the reporting for your bots. Changing this will impact all future reporting. Are you sure you want to change it?
                        </Dialog>
                </Paper>
            </div>
        )
    }
}

export default withStyles(flexbox, s)(CreateAccountPage);
