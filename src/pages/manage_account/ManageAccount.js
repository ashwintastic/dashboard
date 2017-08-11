import React, { PropTypes, Component } from 'react';

import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';
import ViewReportIcon from 'material-ui/svg-icons/editor/insert-chart';
import RemoveIcon from 'material-ui/svg-icons/action/delete';
import FbAccountIcon from 'material-ui/svg-icons/action/input';
import EditBotIcon from 'material-ui/svg-icons/image/edit';
import CreateBotIcon from 'material-ui/svg-icons/content/add-box';
import { blue500, red500, green500, indigo500, indigo900, purple500, blue900, green900, cyan600, brown500, blueGrey500 } from 'material-ui/styles/colors';
import ViewFlowsIcon from 'material-ui/svg-icons/action/view-list';
import BroadcastIcon from 'material-ui/svg-icons/communication/message';
import RefreshIcon from 'material-ui/svg-icons/navigation/refresh';
import Divider from 'material-ui/Divider';
import Snackbar from 'material-ui/Snackbar';
import UserIcon from 'material-ui/svg-icons/social/person';
import PollIcon from 'material-ui/svg-icons/action/question-answer';
import SubscriptionIcon from 'material-ui/svg-icons/action/assignment';
import NoDataFound from '../noDataFound/noDataFound'
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

import Link from '../../components/Link';
import s from './ManageAccount.css';
import flexbox from '../../components/flexbox.css';
import DeleteIcon from '../../components/DeleteIcon/DeleteIcon';

const title = 'BotWorx.Ai - Manage Account';

class ManageAccount extends Component{

  constructor(props) {
    super(props);
    this.state = {
      nextPropsArrived: false
    };
  }

  componentWillReceiveProps(nextProps){
    this.setState({nextPropsArrived: true});

  }

  componentDidMount() {
    const { setCurrentAccountTimeZone, allAccounts, accountDetails  } = this.props;
    if(allAccounts && accountDetails) {
        const tz = allAccounts[accountDetails.id].timezone;
        console.log(`tz is ${tz}`);
        setCurrentAccountTimeZone(tz);
    }
  }




  render()
  {
    if(!this.state.nextPropsArrived){
      return(<div></div>)
    }
    const {
        accountDetails, unusedBots, flowList, botName, botId, userId, botDetail, onBotNameChange, selectedBot,
        selectedFlow, onBotSelect, onFlowSelect, accountBots, onRemoveBotClick, onCreateBotClick, dialogstate,
        onCloseBot, onSubmitBotClick, onBotDescriptionChange, onEditBotClick, onFbAccountClick, errorText,
        userRole, onRefreshBotClick, snackbarState, onSnackbarStateClose, botPerms, onAnalyticsClick
    } = this.props;

    document.title = title;
  const actions = [
    <FlatButton
      label="Cancel"
      primary={true}
      onTouchTap={onCloseBot}
    />,
    <FlatButton
      label="Save"
      primary={true}
      keyboardFocused={true}
      onTouchTap={() => onSubmitBotClick(botId, botName, botDetail)}
    />,
  ];

  return (
    <div className={cx(s.root, flexbox.fullHeight, flexbox.column)}>
      <Paper className={cx(s.topSection, flexbox.columnItem)}>
        <h3>Account Details</h3>
        <Divider /><br />
        <div className={s.accountDetails}>
          <div className={s.accountDetail}>
            <span className={s.detailLabel}>Account</span>
            <span>{accountDetails.name}</span>
          </div>

          <div className={s.accountDetail}>
            <span className={s.detailLabel}>Admin</span>
            <span>{accountDetails.adminEmail}</span>
          </div>
        </div>
      </Paper>

      <Paper className={cx(s.section)}>
        <div>
          <h2 className={cx(s.headerelem)}>Account Bots</h2>
          {(botPerms && botPerms.length && (botPerms.includes('createBot') || botPerms.includes('*'))) ?
            <CreateBotIcon
              onClick={() => onCreateBotClick(botId)}
              color={green500}
              hoverColor={blue500}
                style={{width: '86px', height: '86px', padding: '24px'}}
              className={cx(s.createBot)}
              title="Add New Bot"
            /> : null}
          <Dialog
            title="Create New Bot"
            actions={actions}
            modal={false}
            open={dialogstate}
            onRequestClose={onCloseBot}
          >
            <form className={cx(flexbox.column, flexbox.rowItem)}>
              <b>Bot Name:</b>
              <input
                className={cx(s.createForm)}
                type="text"
                required="true"
                placeholder="Bot Name"
                value={botName}
                onChange={onBotNameChange}
              />
              <div className={cx(s.errotText)}>{errorText}</div>
              <br />
              <b>Bot Description:</b>
              <input
                className={cx(s.createForm)}
                type="text"
                placeholder="Bot Description"
                value={botDetail}
                onChange={onBotDescriptionChange}
              />
            </form>
          </Dialog>
        </div>
        <Table>
          <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
            <TableRow>
              <TableHeaderColumn>Bot Name</TableHeaderColumn>
              <TableHeaderColumn>Actions</TableHeaderColumn>
            </TableRow>
          </TableHeader>
            {(accountBots.length) ?
          <TableBody displayRowCheckbox={false}>
            {accountBots.map(b => (
              <TableRow selectable={false} key={b.id}>
                <TableRowColumn>{b.name + ' (' + b.id + ')'}</TableRowColumn>
                <TableRowColumn className={cx(flexbox.row, s.actions)}>
                  {((b.allows.indexOf('editBot') !== -1) || (b.allows.indexOf('*') !== -1)) ?
                    <IconButton
                      onClick={() => onEditBotClick(accountDetails.id, b.id, b.name)}
                      title="Edit"
                      className={cx(flexbox.rowItem, s.action)}
                    >
                          <EditBotIcon color={green500}/>
                    </IconButton> : null}
                  {((b.allows.indexOf('viewAnalytics') !== -1) || (b.allows.indexOf('*') !== -1)) ?
                    <IconButton
                        onClick={() => {
                            onAnalyticsClick(accountDetails.id, b.id);
                        }}
                        title="View Reports"
                        className={cx(flexbox.rowItem, s.action)}
                      >
                        <ViewReportIcon color={blue500} />
                      </IconButton> : null
                    }

                  {((b.allows.indexOf('viewUsers') !== -1) || (b.allows.indexOf('*') !== -1)) ?
                    <Link
                      to={`/accounts/${accountDetails.id}/bots/${b.id}/userlist`}
                      title="View Bot Users"
                      className={cx(flexbox.rowItem, s.action)}
                    >
                          <UserIcon color={green900}/>
                    </Link> : null}
                  <Dialog
                    title="Edit Selected Bot"
                    actions={actions}
                    modal={false}
                    open={dialogstate}
                    onRequestClose={onCloseBot}
                  >
                    <form className={cx(flexbox.column, flexbox.rowItem)}>
                      <b>Bot Name<span style={{color:'red'}}>*</span>:</b>
                      <input
                        className={cx(s.createForm)}
                        type="text"
                        placeholder="Bot Name"
                        value={botName}
                        onChange={onBotNameChange}
                      />
                      <div className={cx(s.errotText)}>{errorText}</div>
                      <br />
                      <b>Bot Description:</b>
                      <input
                        className={cx(s.createForm)}
                        type="text"
                        placeholder="Bot Description"
                        value={botDetail}
                        onChange={onBotDescriptionChange}
                      />
                    </form>
                  </Dialog>
                  {((b.allows.indexOf('viewBroadcasts') !== -1) || (b.allows.indexOf('*') !== -1)) ?
                    <Link
                      to={`/accounts/${accountDetails.id}/bots/${b.id}/broadcast`}
                      title="View Broadcasts"
                      className={cx(flexbox.rowItem, s.action)}
                    >
                          <BroadcastIcon color={indigo500}/>
                    </Link> : null}
                  {((b.allows.indexOf('viewFlows') !== -1) || (b.allows.indexOf('*') !== -1)) ?
                    <Link
                      to={`/accounts/${accountDetails.id}/bots/${b.id}/flows`}
                      title="View Flows"
                      className={cx(flexbox.rowItem, s.action)}
                    >
                          <ViewFlowsIcon color={cyan600}/>
                    </Link> : null}
                  {((b.allows.indexOf('deployBot') !== -1) || (b.allows.indexOf('*') !== -1)) ?
                    <IconButton
                      onClick={() => onFbAccountClick(userId, b.id, b.name, accountDetails.id)}
                      title="Deploy"
                      className={cx(flexbox.rowItem, s.action)}
                          style={{marginLeft: -10}}
                    >
                          <FbAccountIcon color={purple500}/>
                    </IconButton> : null}
                  {((b.allows.indexOf('viewPolls') !== -1) || (b.allows.indexOf('*') !== -1)) ?
                    <Link
                      to={`/accounts/${accountDetails.id}/bots/${b.id}/polls`}
                      title="View Polls"
                      className={cx(flexbox.rowItem, s.action)}
                    >
                          <PollIcon color={brown500}/>
                    </Link> : null}
                  {((b.allows.indexOf('initializeBot') !== -1) || (b.allows.indexOf('*') !== -1)) ?
                    <IconButton
                      onClick={() => onRefreshBotClick(b.id)}
                      title="Refresh"
                          style={{marginLeft: -12}}
                      className={cx(flexbox.rowItem, s.action)}
                    >
                          <RefreshIcon color={blue900}/>
                    </IconButton> : null}
                    {((b.allows.indexOf('viewSubscription') !== -1) || (b.allows.indexOf('*') !== -1)) ?
                      <Link
                        to={`/accounts/${accountDetails.id}/bots/${b.id}/subscriptions`}
                        title="View Subscriptions"
                        className={cx(flexbox.rowItem, s.action)}
                      >
                        <SubscriptionIcon color={blueGrey500}/>
                    </Link> : null}
                  <Snackbar
                    open={snackbarState}
                    message="Bot Refreshed"
                    autoHideDuration={4000}
                    onRequestClose={onSnackbarStateClose}
                  />
                  {((b.allows.indexOf('deleteBot') !== -1) || (b.allows.indexOf('*') !== -1)) ?
                    <DeleteIcon
                          onDelete={() => {
                            return onRemoveBotClick(accountDetails.id, b.id);
                          }}
                      itemType='Bot'
                      itemName={`${b.name} (${b.id})`}
                    /> : null}
                </TableRowColumn>
              </TableRow>
            ))}
              </TableBody> :
              <TableBody displayRowCheckbox={false}>
                <NoDataFound>
                  <div className={s.noresultmsg}>No Bot Found</div>
                </NoDataFound>
          </TableBody>
            }
        </Table><br /><Divider />
      </Paper>
    </div>
    )
  }
}

ManageAccount.propTypes = {
  accountDetails: PropTypes.shape({
    bots: PropTypes.array
  }),
  unusedBots: PropTypes.array,
  flowList: PropTypes.array,
  userRole: PropTypes.string,
  botName: PropTypes.string,
  botId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  userId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  botDetail: PropTypes.string,
  selectedBot: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  selectedFlow: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onBotSelect: PropTypes.func,
  onFlowSelect: PropTypes.func,
  accountBots: PropTypes.array,
  onRemoveBotClick: PropTypes.func,
  onCreateBotClick: PropTypes.func,
  onBotNameChange: PropTypes.func,
  dialogstate: PropTypes.bool,
  onCloseBot: PropTypes.func,
  onSubmitBotClick: PropTypes.func,
  onBotDescriptionChange: PropTypes.func,
  onEditBotClick: PropTypes.func,
  onFbAccountClick: PropTypes.func,
  onCloseModal: PropTypes.func,
  errorText: PropTypes.string,
  snackbarState: PropTypes.bool
};

ManageAccount.defaultProps = {
  accountDetails: {
    bots: []
  },
  unusedBots: [],
  flowList: [],
  botName: '',
  botDetail: '',
  selectedBot: null,
  selectedFlow: null,
  accountBots: [],
  dialogstate: false,
  snackbarState: false
};

ManageAccount.contextTypes = { setTitle: PropTypes.func.isRequired };

export default withStyles(flexbox, s)(ManageAccount);
