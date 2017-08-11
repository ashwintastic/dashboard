import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import s from './UserSettings.css';
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
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
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
  userInfo: {
    width: 550,
    minHeight: 250,
    marginLeft: 330,
    marginTop: -200,
    padding: '25px 0px 15px 20px',
  },
  formField: {
    width: 400,
    padding: '5px 10px 10px 5px',
  },
  menu: {
    paddingTop: '0 px',
    paddingBottom: '0 px'
  }
};

const title = 'BotWorx.Ai - User Settings';

class SettingsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: {
        FirstName: '',
        LastName: '',
      },
      passwordValidationData: {
        CurrentPassword: '',
        NewPassword: '',
        ConfirmedPassword: ''
      },
      profileFlag: true,
      passwordFlag: false,
    };

  }
  static propTypes = {
    userData: PropTypes.object,
    passwordValidationData: PropTypes.object,
    profileFlag: PropTypes.bool,
    passwordFlag: PropTypes.bool
  };

  static contextTypes = { setTitle: PropTypes.func.isRequired };

  onMenuItemClick = (e, val) => {
    console.log('val', val);
    if (val === 'Profile') {
      this.setState(Object.assign({}, this.state, { profileFlag: true, passwordFlag: false, passwordValidationData: this.props.passwordValidationData }));
    }
    else if (val === 'Password') {
      this.setState(Object.assign({}, this.state, { passwordFlag: true, profileFlag: false, userData: this.props.userData }));
      console.log('onPasswordClick');
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState(Object.assign({}, this.state, { userData: nextProps.userData, passwordValidationData: nextProps.passwordValidationData }));
  }
  render() {
    const {userData, userPassword, onSaveUserDataClick, onSavePasswordDataClick, onUserDataChange, onPasswordDataChange, passwordValidationData } = this.props;
    this.context.setTitle(title);
    return (
      <div className={cx(s.root, flexbox.rowItem)} >
        <Paper className={cx(s.section)}>
          <div className={cx(s.listBox)}>
            <Paper className={cx(s.listContainer)} zDepth={1}>
              <h4 className={cx(s.listHeader)}>Settings</h4>
              <Menu
                disableAutoFocus={true}
                key='menu'
                className={cx(s.listStyle)}
                onChange={this.onMenuItemClick}
                listStyle={styles.menu}
                >
                <MenuItem
                  className={cx(s.listKey)}
                  style={{ borderBottom: '2px solid lightgrey' }}
                  key='profile'
                  primaryText='Profile'
                  value='Profile'
                />
                <MenuItem
                  className={cx(s.listKey)}
                  style={{ borderBottom: '2px solid lightgrey' }}
                  key='password'
                  primaryText='Password'
                  value='Password'
                />
                <MenuItem
                  className={cx(s.listKey)}
                  key='advanced'
                  primaryText='Advanced'
                  value='Advanced'
                  disabled={true}
                />
              </Menu>
            </Paper>
          </div>
          {(!(this.state.userData) || !(this.state.profileFlag)) ? null :
            <Paper style={styles.userInfo} zDepth={1}>
              <h4>Profile</h4>
              <TextField
                floatingLabelText="First Name"
                key='firstName'
                value={this.state.userData.FirstName}
                style={styles.formField}
                onChange={(e) => {
                  let obj = { FirstName: e.target.value };
                  onUserDataChange(obj)
                }}
              />
              <TextField
                floatingLabelText="Last Name"
                key='lastName'
                value={this.state.userData.LastName}
                style={styles.formField}
                onChange={(e) => {
                  let obj = { LastName: e.target.value };
                  onUserDataChange(obj)
                }}
              />
              <SaveButton onSaveData={() => onSaveUserDataClick(this.state.userData)} />
            </Paper>}
          {(!(this.state.passwordValidationData) || !(this.state.passwordFlag)) ? null :
            <Paper style={styles.userInfo} zDepth={1}>
              <h4>Password</h4>
              <TextField
                floatingLabelText="Current Password"
                key='currentPwd'
                value={this.state.passwordValidationData.CurrentPassword}
                type={'password'}
                style={styles.formField}
                onChange={(e) => {
                  let obj = { CurrentPassword: e.target.value };
                  onPasswordDataChange(obj)
                }}
              />
              <TextField
                floatingLabelText="New Password"
                key='newPwd'
                value={this.state.passwordValidationData.NewPassword}
                type={'password'}
                style={styles.formField}
                onChange={(e) => {
                  let obj = { NewPassword: e.target.value };
                  onPasswordDataChange(obj)
                }}
              />
              <TextField
                floatingLabelText="Confirm New Password"
                key='confirmedPwd'
                value={this.state.passwordValidationData.ConfirmedPassword}
                type={'password'}
                style={styles.formField}
                onChange={(e) => {
                  let obj = { ConfirmedPassword: e.target.value };
                  this.setState({ passwordValidationData: { ConfirmedPassword: e.target.value } })
                  onPasswordDataChange(obj)
                }}
              />
              <SaveButton onSaveData={() => onSavePasswordDataClick(userPassword, this.state.passwordValidationData)} />
            </Paper>}
        </Paper>
      </div>
    )
  }
}

function SaveButton(props) {
  const onSaveData = props.onSaveData;
  return <div>
    <RaisedButton
      className={cx(flexbox.rowItem, s.saveButton)}
      label="Save Changes"
      primary
      onClick={onSaveData}
    /></div>
}

export default withStyles(flexbox, s)(SettingsPage);
