import React, { PropTypes } from 'react';

import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';
import ViewReportIcon from 'material-ui/svg-icons/editor/insert-chart';
import RemoveIcon from 'material-ui/svg-icons/action/delete';
import FbAccountIcon from 'material-ui/svg-icons/action/account-box';
import EditBotIcon from 'material-ui/svg-icons/image/edit';
import CreateBotIcon from 'material-ui/svg-icons/content/add-box';
import { blue500, red500, green500, indigo500, purple500 } from 'material-ui/styles/colors';
import ViewFlowsIcon from 'material-ui/svg-icons/action/view-list';

import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from 'material-ui/Table';

import Link from '../../components/Link';
import s from './User.css';
import flexbox from '../../components/flexbox.css';


const title = 'BotWorx.Ai - Manage Account';

function ManageAccount(
  {
    accountDetails,
    unusedBots,
    flowList,
    botName,
    botId,
    userId,
    botDetail,
    onBotNameChange,
    selectedBot,
    selectedFlow,
    onBotSelect,
    onFlowSelect,
    accountBots,
    onRemoveBotClick,
    onCreateBotClick,
    dialogstate,
    onCloseBot,
    onSubmitBotClick,
    onBotDescriptionChange,
    onEditBotClick,
    onFbAccountClick,
    errorText,
    userRole
  },
  context
) {
  context.setTitle(title);
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
    />
  ];
  return (
    <div className={cx(s.root, flexbox.fullHeight, flexbox.column)}>
      <Paper className={cx(s.section, flexbox.columnItem)}>
        <h2>Account Details</h2>
        <div className={s.accountDetails}>
          <div className={s.accountDetail}>
            <span className={s.detailLabel}>Account</span>
            <span>{accountDetails.account}</span>
          </div>

          <div className={s.accountDetail}>
            <span className={s.detailLabel}>Manager</span>
            <span>{accountDetails.managerEmail}</span>
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
            {((userRole[0] === 'SuperAdmin')|| (userRole[0] === 'BotworxAdmin')
                  || (userRole[0] === 'BotOwner')) == true ?
            <CreateBotIcon
              onClick={() => onCreateBotClick(botId)}
              color={green500}
              hoverColor={blue500}             
              style={{ width: '86px', height: '86px', padding: '24px' }}
              className={cx(s.createBot)}
              title="Add New Bot"
             />:null}
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
              <br/>
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
              <TableHeaderColumn>Bot Id</TableHeaderColumn>
              <TableHeaderColumn>Bot Name</TableHeaderColumn>
              <TableHeaderColumn>Actions</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            {accountBots.map(b => (
              <TableRow selectable={false} key={b.id}>
                <TableRowColumn>{b.id}</TableRowColumn>
                <TableRowColumn>{b.name}</TableRowColumn>
                <TableRowColumn className={cx(flexbox.row, s.actions)}>
                  <Link
                    to={`/analytics/account/${accountDetails.id}/bot/${b.id}`}
                    title="View Reports"
                    className={cx(flexbox.rowItem, s.action)}
                  >
                    <ViewReportIcon color={blue500} />
                  </Link>
                  {((userRole[0] === 'SuperAdmin') || (userRole[0] === 'BotworxAdmin')
                  || (userRole[0] === 'BotOwner')) ?
                  <IconButton
                    onClick={() => onEditBotClick(accountDetails.id, b.id, b.name)}
                    title="Edit Bot"
                    className={cx(flexbox.rowItem, s.action)}
                  >
                    <EditBotIcon color={green500} />
                  </IconButton> : null}
                  <Dialog
                      title="Edit Selected Bot"
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
                        placeholder="Bot Name"
                        value={botName}
                        onChange={onBotNameChange}
                      />
                      <div className={cx(s.errotText)}>{errorText}</div>
                      <br/>
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

                  <Link
                    to={`/flow/account/${accountDetails.id}/bot/${b.id}`}
                    title="View associated Flows"
                    className={cx(flexbox.rowItem, s.action)}
                  >
                    <ViewFlowsIcon color={indigo500} />
                  </Link>
                  {((userRole[0] === 'SuperAdmin') || (userRole[0] === 'BotworxAdmin')
                  || (userRole[0] === 'BotOwner')) ?
                  <IconButton
                    onClick={() => onFbAccountClick(userId, b.id, b.name)}
                    title="Deploy on Facebook"
                    className={cx(flexbox.rowItem, s.action)}
                  >
                    <FbAccountIcon color={purple500} />
                 </IconButton> : null}
                  {((userRole[0] === 'SuperAdmin') || (userRole[0] === 'BotworxAdmin')
                  || (userRole[0] === 'BotOwner')) ?
                  <IconButton
                    onClick={() => onRemoveBotClick(accountDetails.id, b.id)}
                    title="Remove"
                    className={cx(flexbox.rowItem, s.action)}
                  >
                    <RemoveIcon color={red500} />
                  </IconButton> : null}
                </TableRowColumn>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </div>
  );
}

ManageAccount.propTypes = {
  accountDetails: PropTypes.shape({
    bots: PropTypes.array
  }),
  unusedBots: PropTypes.array,
  userRole: PropTypes.array,
  flowList: PropTypes.array,
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
  errorText: PropTypes.string
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
  dialogstate: false
};

ManageAccount.contextTypes = { setTitle: PropTypes.func.isRequired };

export default withStyles(flexbox, s)(ManageAccount);
