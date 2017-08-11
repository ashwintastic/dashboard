import React, { PropTypes, Component } from 'react';

import cx from 'classnames';
import Paper from 'material-ui/Paper';
import ViewReportIcon from 'material-ui/svg-icons/editor/insert-chart';
import ManageIcon from 'material-ui/svg-icons/navigation/apps';
import IconButton from 'material-ui/IconButton';
import UserIcon from 'material-ui/svg-icons/social/person';
import { blue500, blue800, green500, red500, blue900, green900 } from 'material-ui/styles/colors';
import CreateAccountEntryIcon from 'material-ui/svg-icons/content/add-box'
import RemoveIcon from 'material-ui/svg-icons/action/delete';
import EditIcon from 'material-ui/svg-icons/image/edit';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Divider from 'material-ui/Divider';
import NoDataFound from '../noDataFound/noDataFound'
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

import s from './Accounts.css';
import flexbox from '../../components/flexbox.css';
import Link from '../../components/Link';
import DeleteIcon from '../../components/DeleteIcon/DeleteIcon';

const title = 'BotWorx.Ai - Accounts';
const style = {
    width: '33%'
}

class Accounts extends Component  {
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
      // No timezone is available for account page, clear pre-existent timezones.
      this.props.clearCurrentAccountTimeZone();
  }


  render() {

    const {accounts, onNavigate, userId,
      onRemoveAccountClick,
      onEditAccountClick,
      onCreateAccountEntry,
      accountPerms,
      onAnalyticsClick
    }= this.props;

    if(typeof document !== 'undefined') {
        document.title = title;
    }

    if(!this.state.nextPropsArrived){
      return(<div></div>)
    }

    return Object.keys(accounts).length ? (
    <div className={cx(s.root, flexbox.column)}>
      <Paper className={s.section}>
        <h1 className={s.headerelem}>Accounts</h1>
            <AddAccountIcon permissions={accountPerms} onCreateAccount={onCreateAccountEntry}/>
        <Table style={{ tableLayout: 'fixed', whiteSpace: 'nowrap' }}>
          <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
            <TableRow>
              <TableHeaderColumn style={{width: '40%'}}>Account Name</TableHeaderColumn>
              <TableHeaderColumn style={{width: '35%'}}>Admin</TableHeaderColumn>
              <TableHeaderColumn style={{width: '25%'}}>Actions</TableHeaderColumn>
            </TableRow>
          </TableHeader>

          <TableBody displayRowCheckbox={false}>
                <AllAccounts allaccounts={accounts}
                             onEditAccountClick ={onEditAccountClick}
                             onRemoveAccountClick={onRemoveAccountClick}
                             onAnalyticsClick={onAnalyticsClick}
                             userId={userId}
                />
              </TableBody>
            </Table><br/><Divider />
          </Paper>
        </div>
      ) : <NoDataFound>
        <Paper className={s.section}>
          <h1 className={s.headerelem}>Accounts</h1>
          <AddAccountIcon permissions={accountPerms}
                          onCreateAccount={onCreateAccountEntry}/>
          <div className={s.noresultmsg}>No Account Found</div>
        </Paper>
      </NoDataFound>
  }
}


function AddAccountIcon(props) {
  const accountPerms = props.permissions;
  if (!(accountPerms && accountPerms.length)) {
    return null;
  }

  if (!(accountPerms.includes('createAccount') || accountPerms.includes('*'))) {
    return null;
  }

  return <IconButton title="Add New Account"
                     onClick={props.onCreateAccount}>
    <CreateAccountEntryIcon
      color={green500}
      hoverColor={blue500}
      style={{ width: '86px', height: '86px', padding: '24px' }}
      className={cx(s.createAccount)}
    />
  </IconButton>;
}

function AllAccounts(props){
  let accounts = props.allaccounts;
  return (
    <div>
      {
        Object.keys(accounts).map(accountId => accounts[accountId]).map(
              account => (
                <TableRow key={`account_${account.id}`}>
                  <TableRowColumn style={style}>
                    {account.name + ' (' + account.id + ')'}
                  </TableRowColumn>
                  <TableRowColumn style={style}>
                    {account.adminEmail}
                  </TableRowColumn>
                  <TableRowColumn className={cx(flexbox.row, s.actions)}>
                    {((account.allows.indexOf('editAccount') !== -1) || (account.allows.indexOf('*') !== -1)) ?
                      <IconButton
                        onClick={() => {
                      props.onEditAccountClick(account.id);
                        }}
                        title="Edit"
                        className={cx(flexbox.rowItem, s.action)}
                      >
                        <EditIcon color={green500} />
                      </IconButton> : null}
                    {((account.allows.indexOf('viewAnalytics') !== -1) || (account.allows.indexOf('*') !== -1)) ?
                       <IconButton
                            onClick={() => {
                            props.onAnalyticsClick(account.id);
                            }}
                            title="View Reports"
                            className={cx(flexbox.rowItem, s.action)}
                      >
                        <ViewReportIcon color={blue500} />
                      </IconButton> : null}
                    {((account.allows.indexOf('viewUsers') !== -1) || (account.allows.indexOf('*') !== -1)) ?
                      <Link
                        to={`/accounts/${account.id}/userlist`}
                        title="View Account Users"
                        className={cx(flexbox.rowItem, s.action)}
                      >
                        <UserIcon color={green900} />
                      </Link> : null}
                    {((account.allows.indexOf('viewBots') !== -1) || (account.allows.indexOf('*') !== -1)) ?
                      <Link
                        to={`/accounts/${account.id}/bots`}
                        title="View Bots"
                        className={cx(flexbox.rowItem, s.action)}
                      >
                        <ManageIcon color={blue800} />
                      </Link> : null}
                    {((account.allows.indexOf('deleteAccount') !== -1) || (account.allows.indexOf('*') !== -1)) ?
                      <DeleteIcon
                    onDelete={() => { return props.onRemoveAccountClick(account.id); }}
                        itemType='Account'
                        itemName={`${account.name} (${account.id})`}
                        /> : null}
                  </TableRowColumn>
                </TableRow>
              ))}
    </div>
  )
}

Accounts.contextTypes = { setTitle: PropTypes.func.isRequired };

export default withStyles(flexbox, s)(Accounts);
