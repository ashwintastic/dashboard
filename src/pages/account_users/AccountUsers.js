import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import s from './AccountUsers.css';
import flexbox from '../../components/flexbox.css';
import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';
import Divider from 'material-ui/Divider';
import EditIcon from 'material-ui/svg-icons/image/edit';
import AddIcon from 'material-ui/svg-icons/content/add-box'
import { blue500, red500, green500 } from 'material-ui/styles/colors';
import Link from '../../components/Link';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import RemoveIcon from 'material-ui/svg-icons/action/delete';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import { userRoleList } from '../../config'
import DeleteIcon from '../../components/DeleteIcon/DeleteIcon';
import NoDataFound from '../noDataFound/noDataFound'
var _ = require('lodash');

import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';

const title = 'BotWorx.Ai - Dashboard User';

function AccountUsersPage({userEntries, accountId, botId,
    onDeleteUserEntry, onEditUserEntry, onSaveUserEntry, onCreateUserEntry,
    userEntryData, userId, currentUserRole, onAddUserFlag, addUserFlag,
    userType, allUsers, onExistingUserSave, onExistingUserValChange, selectedUser,
    onCreateNewUserClick, existingUserList}, context) {
  context.setTitle(title);
  var filteredUserList = [];
  if (currentUserRole) {
    filteredUserList = _(userEntries).filter(x => {
      var val = userRoleList[currentUserRole].createRole.includes(x.roles) ? true : false;
      return val;
    }).value();
  }

  return (
        <div className={cx(s.root, flexbox.fullHeight, flexbox.column)}>
            <Paper className={cx(s.section, flexbox.columnItem)}>
                <h2 className={cx(s.headerelem)}> Associated Users</h2>
                <Table>
                    <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                        <TableRow>
                            <TableHeaderColumn>User Name</TableHeaderColumn>
                            <TableHeaderColumn>Email</TableHeaderColumn>
                            <TableHeaderColumn>Roles</TableHeaderColumn>
                            <TableHeaderColumn>Actions</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    {(filteredUserList.length) ?
                        <TableBody displayRowCheckbox={false}>
                            {filteredUserList.map(ue => (
                                <TableRow selectable={false} key={ue.id}>
                                    <TableRowColumn>
                                        {ue.FirstName + ' ' + ue.LastName}
                                    </TableRowColumn>
                                    <TableRowColumn>
                                        {ue.email}
                                    </TableRowColumn>
                                    <TableRowColumn>
                                        {ue.roles}
                                    </TableRowColumn>
                                    <TableRowColumn className={cx(flexbox.row, s.actions)}>
                                        <IconButton
                                            onClick={() => {
                                              onEditUserEntry(accountId, botId, ue.id);
                                            } }
                                            title="Edit"
                                            className={cx(s.action)}
                                            >
                                            <EditIcon color={green500} />
                                        </IconButton>
                                        <DeleteIcon
                                            onDelete={() => { return onDeleteUserEntry(accountId, botId, ue.id); }}
                                            itemType='User'
                                            itemName={`${ue.FirstName + ' ' + ue.LastName}`}
                                        />
                                    </TableRowColumn>
                                </TableRow>
                            ))}
            </TableBody> :
            <TableBody displayRowCheckbox={false}>
              <TableRow ><TableRowColumn className={s.noresultmsg}>
                No user found</TableRowColumn>
              </TableRow >
            </TableBody>
          }
                </Table><br /><Divider /><br /> <br />
                <RaisedButton
                    primary={true}
                    label="New User"
                    style={{ marginLeft: 20, marginTop: -20 }}
                    icon={<AddIcon />}
                    onTouchTap={() => onCreateNewUserClick(accountId, botId)}
                    />
            </Paper>
        </div>
  )
}

AccountUsersPage.propTypes = {
  userEntries: PropTypes.array
};

AccountUsersPage.defaultProps = {
  userEntries: []
};

AccountUsersPage.contextTypes = { setTitle: PropTypes.func.isRequired };

export default withStyles(flexbox, s)(AccountUsersPage);