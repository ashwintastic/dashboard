import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import s from './broadcast.css';
import flexbox from '../../components/flexbox.css';
import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import EditIcon from 'material-ui/svg-icons/image/edit';
import { blue500, red500, green500 } from 'material-ui/styles/colors';
import Link from '../../components/Link';
import CreateBroadcastEntryIcon from 'material-ui/svg-icons/content/add-box'
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

const title = 'BotWorx.Ai - Broadcast';


class BotBroadcast extends Component {
    constructor(props) {
        super(props);
        this.state = {
            broadcastEntryData: {}
        };
        const { allAccounts, accountId } = this.props;
        this.tz = allAccounts[accountId] ? allAccounts[accountId].timezone : '';
        this.tzOffset = moment.tz(this.tz)._offset;
    }
    static propTypes = {
        broadcastEntries: PropTypes.array,
    };
    static defaultProps = {
        broadcastEntries: [],
        timeZone: '',
        broadcastDate: '',
        broadcastTime: '',
        repeat: '',
        broadcastType: '',
        name: '',
    };

    static contextTypes = { setTitle: PropTypes.func.isRequired };

    componentWillReceiveProps(nextProps) {
        this.setState(Object.assign({}, this.state, { broadcastEntryData: nextProps.broadcastEntryData }));
        const { allAccounts, accountId } = nextProps;
        if(!this.tz) {
            this.tz = allAccounts[accountId] ? allAccounts[accountId].timezone : '';
            this.tzOffset = moment.tz(this.tz)._offset;
        }
    }
    render() {
        const {broadcastEntries, botId, accountId, onDeleteBroadcastEntry,
            onEditBroadcastEntry, onCreateBroadcastEntry, broadcastEntryData, existingFlowNodes,
            onBroadcastValueChange,
        } = this.props;
        this.context.setTitle(title);

      if (broadcastEntries.length){
        return (
            <div className={cx(s.root, flexbox.fullHeight, flexbox.column)}>
                <Paper className={cx(s.section, flexbox.columnItem)}>
                    <div>
                        <div style={styles.header}>
                            <h2 className={cx(s.headerelem)}>Broadcast Entries</h2>
                            <IconButton title="Add New Broadcast Entry"
                                onClick={() => {
                                    onCreateBroadcastEntry(accountId, botId)
                                }}>
                                <CreateBroadcastEntryIcon
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
                                <TableHeaderColumn>Broadcast Name</TableHeaderColumn>
                                <TableHeaderColumn>Type</TableHeaderColumn>
                                <TableHeaderColumn>Scheduled Time</TableHeaderColumn>
                                <TableHeaderColumn>TimeZone</TableHeaderColumn>
                                <TableHeaderColumn>Repeat</TableHeaderColumn>
                                <TableHeaderColumn>Actions</TableHeaderColumn>
                            </TableRow>
                        </TableHeader>
                        <TableBody displayRowCheckbox={false}>
                            {broadcastEntries.map(be => (
                                <TableRow selectable={false} key={be._id}>
                                    <TableRowColumn>{be.name}</TableRowColumn>
                                    <TableRowColumn>{be.jobType}</TableRowColumn>
                                    <TableRowColumn>{be.datetime}</TableRowColumn>
                                    {(be.timeZone === "bot")
                                        ? <TableRowColumn>{`Bot Time (${this.tz})`}</TableRowColumn> :
                                        <TableRowColumn>{"User Time"}</TableRowColumn>}
                                    <TableRowColumn>{be.repeat}</TableRowColumn>
                                    <TableRowColumn className={cx(flexbox.row, s.actions)}>
                                        <IconButton
                                            onClick={() => {
                                                onEditBroadcastEntry(botId, accountId, be._id, be.pollId)
                                            }}
                                            title="Edit"
                                            className={cx(flexbox.rowItem, s.action)}
                                        >
                                            <EditIcon color={green500} />
                                        </IconButton>
                                        <DeleteIcon
                                            onDelete={() => { return onDeleteBroadcastEntry(botId, accountId, be._id); }}
                                            itemType='Broadcast'
                                            itemName={be.name}
                                        />
                                    </TableRowColumn>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table><br/><Divider />
                </Paper>
            </div>
        )
      }

      else{
        return (
          <div className={cx(s.root, flexbox.fullHeight, flexbox.column)}>
            <Paper className={cx(s.section, flexbox.columnItem)}>
              <div>
                <div style={styles.header}>
                  <h2 className={cx(s.headerelem)}>Broadcast Entries</h2>
                  <IconButton title="Add New Broadcast Entry"
                              onClick={() => {
                                onCreateBroadcastEntry(accountId, botId)
                              }}>
                    <CreateBroadcastEntryIcon
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
                    <TableHeaderColumn>Broadcast Name</TableHeaderColumn>
                    <TableHeaderColumn>Type</TableHeaderColumn>
                    <TableHeaderColumn>Scheduled Time</TableHeaderColumn>
                    <TableHeaderColumn>TimeZone</TableHeaderColumn>
                    <TableHeaderColumn>Repeat</TableHeaderColumn>
                    <TableHeaderColumn>Actions</TableHeaderColumn>
                  </TableRow>
                </TableHeader>
                <TableBody displayRowCheckbox={false}>
                  <TableRow selectable={false}>
                    <TableRowColumn className={s.noresultmsg}>{'No Entries Found'}</TableRowColumn>

                  </TableRow>
                </TableBody>
              </Table><br/><Divider />
            </Paper>
          </div>
        )
      }




    }
}

export default withStyles(flexbox, s)(BotBroadcast);
