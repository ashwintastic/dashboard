import React, { PropTypes } from 'react';

import withStyles from 'isomorphic-style-loader/lib/withStyles';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import cx from 'classnames';

import s from './Home.css';
import logoImage from '../../components/Header/logo_full.png';
import flexbox from '../../components/flexbox.css';

const title = 'BotWorx.Ai';
const styles = {
  forgotPassword: {
    textDecoration: 'underline',
    cursor: 'pointer',
    fontSize: 'small',
    textAlign: 'right'
  }
}

function FBLogo() {
  return (
    <svg
      className={s.icon}
      width="30"
      height="30"
      viewBox="0 0 30 30"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M22 16l1-5h-5V7c0-1.544.784-2 3-2h2V0h-4c-4.072 0-7 2.435-7 7v4H7v5h5v14h6V16h4z"
      />
    </svg>
  );
}

function Home({authfail, onForgotPasswordClick}, context) {
  context.setTitle(title);

  return (
    <div className={cx(s.root, flexbox.fullHeight)}>
      <div className={cx(flexbox.column, flexbox.columnItem)}>
        <Paper className={cx(flexbox.column, flexbox.columnItem, s.container)}>
          <h2 className={cx(flexbox.columnItem, s.loginTitle)}>
            Login to <img src={logoImage} alt="Logo" height="45px" />
          </h2>

          <div className={flexbox.columnItem}>
            <a className={s.facebook} href="/login/facebook">
              <FBLogo />
              <span>Facebook</span>
            </a>
          </div>

          <strong className={cx(flexbox.columnItem, s.lineThrough)}>
            OR USING EMAIL
          </strong>
          {(authfail) ? <div className={s.errMsg}>Email Address or Password is incorrect</div> : null}
          <form
            className={cx(flexbox.columnItem, flexbox.column, s.botForm)}
            method="post" action={`/login${typeof window === 'object' ? window.location.search : ''}`}
          >
            <TextField
              name="email"
              className={flexbox.columnItem}
              floatingLabelText="Email Address *"
              floatingLabelFixed={true}
              fullWidth
            />
            <TextField
              name="password"
              className={flexbox.columnItem}
              floatingLabelText="Password *"
              floatingLabelFixed={true}
              type="password"
              fullWidth
            /><br />
            <RaisedButton
              type="submit"
              className={cx(flexbox.columnItem, s.loginButton)}
              label="Login" primary
            /><br />
            <a onClick={onForgotPasswordClick} style={styles.forgotPassword}>Forgot password?</a>
          </form>
        </Paper>
      </div>
    </div>
  );
}

Home.propTypes = {};

Home.contextTypes = { setTitle: PropTypes.func.isRequired };

export default withStyles(s, flexbox)(Home);
