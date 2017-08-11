import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import s from './Subscription.css';
import flexbox from '../../components/flexbox.css';
import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import EditIcon from 'material-ui/svg-icons/image/edit';
import { blue500, red500, green500 } from 'material-ui/styles/colors';
import Link from '../../components/Link';
import CreateSubscriptionEntryIcon from 'material-ui/svg-icons/content/add-box'
import Timer from '../../components/Timer';
import RaisedButton from 'material-ui/RaisedButton';
import RemoveIcon from 'material-ui/svg-icons/action/delete';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import moment from 'moment-timezone';
import Divider from 'material-ui/Divider';
import _ from 'lodash';
//import { RadioGroup, RadioButton } from 'react-radio-buttons'
import DeleteIcon from '../../components/DeleteIcon/DeleteIcon';
import NoDataFound from '../noDataFound/noDataFound';
import { displayTimeZoneDate } from '../../utils/displayDate';
import { dateDisplayFormatType } from '../../config'
const styles = {
    header: {
        display: 'inline-block'
    },
    dialogBox: {
        width: 700,
        marginLeft: 300
    }
};
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';

const title = 'BotWorx.Ai - Subscriptions';


class ViewSubscription extends Component {
    constructor(props) {
        super(props);
    }
    static defaultProps = {
        broadcastEntries: [],
    };

    static contextTypes = { setTitle: PropTypes.func.isRequired };

    getBotName = (accountBots, botId) => {
        let currentBot = _.find(accountBots, { 'id' : botId})
        //return currentBot ? `${currentBot.name} (${currentBot.id})` : '';
        if (currentBot) {
            return currentBot.name ? `${currentBot.name}`: `${currentBot.id}`;
        }
        return '';
    }

    render() {
        const { onCreateSubscription, subscriptionEntries,
            onEditSubscription, onDeleteSubscription, accountBots, accountId, botId,
            showAddEditDialog, onCloseAddEdit, onSaveSubscriptionClick, currSubscription,
            onSubscriptionNameChange, subscriptionName, addEditMode } = this.props;

        const actions = [
            <FlatButton
            label="Cancel"
            primary={true}
            onTouchTap={onCloseAddEdit}
            />,
            <FlatButton
            label="Save"
            primary={true}
            keyboardFocused={true}
            onTouchTap={() => onSaveSubscriptionClick(accountId, subscriptionName, currSubscription)}
            />,
        ];

        return (
            <div className={cx(s.root, flexbox.fullHeight, flexbox.column)}>
                <Dialog
                    title={(addEditMode === 'add')? "Add Subscription" : "Edit Subscription" }
                    actions={actions}
                    modal={false}
                    open={showAddEditDialog}
                    onRequestClose={onCloseAddEdit}
                    >
                    <TextField
                        floatingLabelText="Subscription Name"
                        value={subscriptionName}
                        onChange={ onSubscriptionNameChange }
                    />
                </Dialog>

                <Paper className={cx(s.section, flexbox.columnItem)}>
                    <div>
                        <div style={styles.header}>
                            <h2 className={cx(s.headerelem)}>Subscriptions for '{this.getBotName(accountBots, botId)}'</h2>
                            <IconButton title="Add New Subscription"
                                onClick={() => {
                                    onCreateSubscription(botId)
                                }}>
                                <CreateSubscriptionEntryIcon
                                    color={green500}
                                    hoverColor={blue500}
                                    className={cx(s.createFlow)}
                                />
                            </IconButton>
                        </div>
                    </div>
                    <Table>
                        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                            <TableRow>
                                <TableHeaderColumn>Subscription Name</TableHeaderColumn>
                                <TableHeaderColumn>Actions</TableHeaderColumn>
                            </TableRow>
                        </TableHeader>
                        
                        {(subscriptionEntries.length) ?

                        <TableBody displayRowCheckbox={false}>
                            {subscriptionEntries.map(s => (
                                <TableRow selectable={false} key={s._id}>
                                    <TableRowColumn>{s.name}</TableRowColumn>
                                    <TableRowColumn style={{textAlign:'left'}}>
                                        <IconButton
                                            onClick={() => {
                                                onEditSubscription(botId, s._id, s.name)
                                            }}
                                            title="Edit"
                                            className={cx(flexbox.rowItem, s.action)}
                                        >
                                            <EditIcon color={green500} />
                                        </IconButton>
                                    </TableRowColumn>
                                </TableRow>
                            ))}
                        </TableBody>:
                        <TableBody displayRowCheckbox={false}>
                            <TableRow selectable={false}>
                                <TableRowColumn className={s.noresultmsg}>{'No Entries Found'}</TableRowColumn>

                            </TableRow> 
                        </TableBody>}
                    </Table><br/><Divider />
                </Paper>
            </div>
        )
    }
}
export default withStyles(flexbox, s)(ViewSubscription);
