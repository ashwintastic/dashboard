import React, { PropTypes } from 'react';

import withStyles from 'isomorphic-style-loader/lib/withStyles';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import cx from 'classnames';
import s from './ForgotPassword.css';
import logoImage from '../../public/apple-touch-icon.png';
import flexbox from '../../components/flexbox.css';

const title = 'BotWorx.Ai- Forgot Password';


function ForgotPassword({mailId, onEditEmail, onResetPasswordClick}, context) {
  context.setTitle(title);

  return (
    <div className={cx(s.root, flexbox.fullHeight)}>
      <div className={cx(flexbox.column, flexbox.columnItem)}>
        <Paper className={cx(flexbox.column, flexbox.columnItem, s.container)}>
          <img src={logoImage} alt="Logo" className={cx(s.logoImg)} />
          <h2 className={cx(flexbox.columnItem, s.loginTitle)}>
            Forgot Password
            </h2>
          <div className={cx(flexbox.columnItem, s.textMsg)}>
            Enter the email address with which you have signed up. An email will be sent with reset instructions.
            </div>
          <TextField
            name="email"
            className={flexbox.columnItem}
            value={mailId}
            onChange={onEditEmail}
            floatingLabelText="Email Address *"
            fullWidth
          />
          <RaisedButton
            onClick={() => onResetPasswordClick(mailId)}
            className={cx(flexbox.columnItem, s.loginButton)}
            label="Send Reset Instructions" primary
          />
        </Paper>
      </div>
    </div>
  );
}

ForgotPassword.propTypes = {};

ForgotPassword.contextTypes = { setTitle: PropTypes.func.isRequired };

export default withStyles(s, flexbox)(ForgotPassword);
