import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import s from './ResetPassword.css';
import flexbox from '../../components/flexbox.css';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import logoImage from '../../public/apple-touch-icon.png';

import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

const styles = {
  formField: {
    width: 300,
    padding: '5px 10px 10px 5px',
  },
  successMsg: {
    color: 'green',
    fontFamily: "Georgia, 'Times New Roman', Times, serif",
    fontSize:'12px'
  }
};

const title = 'BotWorx.Ai - Reset User Password';

class ResetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newPassword: '',
      confirmedPassword: '',
    };

  }
  static propTypes = {
    newPassword: PropTypes.string,
    confirmedPassword: PropTypes.string,
  };

  static contextTypes = { setTitle: PropTypes.func.isRequired };

  render() {
    const {mailId, onSetNewPasswordClick, resetFlag } = this.props;
    this.context.setTitle(title);
    return (
      <div className={cx(s.root, flexbox.rowItem)} >
        <Paper className={cx(flexbox.column, flexbox.columnItem, s.container)}>
          <img src={logoImage} alt="Logo" className={cx(s.logoImg)} />
          <h2 className={cx(flexbox.columnItem, s.loginTitle)}>
            Reset Password
            </h2>
          <TextField
            floatingLabelText="New Password"
            key='newPwd'
            value={this.state.newPassword}
            type={'password'}
            style={styles.formField}
            onChange={(e) => {
              this.setState({ newPassword: e.target.value })
            }}
          />
          <TextField
            floatingLabelText="Confirm New Password"
            key='confirmedPwd'
            value={this.state.confirmedPassword}
            type={'password'}
            style={styles.formField}
            onChange={(e) => {
              this.setState({ confirmedPassword: e.target.value })
            }}
          /><br />
          <RaisedButton
            onClick={() => onSetNewPasswordClick(this.state)}
            className={cx(s.setPasswordButton)}
            label="Set New Password" primary
          /><br/>
          {(resetFlag) ? <div style={styles.successMsg}>Password Changed. Proceed to <a href='/accounts'>Login</a></div> : null}
        </Paper>
      </div>
    )
  }
}

export default withStyles(flexbox, s)(ResetPassword);
