import React, { PropTypes } from 'react';

import withStyles from 'isomorphic-style-loader/lib/withStyles';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import cx from 'classnames';

import s from './Login.css';
import flexbox from '../../components/flexbox.css';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

const title = 'BotWorx.Ai';

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

export class Login extends React.Component {
  static propTypes = {
    onLoginClick: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = { email: '', password: '', shouldDisplay: false };

    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onLoginClick = props.onLoginClick;
  }

  componentWillReceiveProps(nextProps) {
      if(nextProps.shouldPromtUserForLogin) {
          this.setState({shouldDisplay: true});
      } else {
           this.setState({shouldDisplay: false});
      }
  }

  handleEmailChange(event) {
    console.log('value change', event.target.value)
    this.setState({ email: event.target.value });
    console.log(this.state)
  }

  handlePasswordChange(event) {
    console.log('value change', event.target.value)
    this.setState({ password: event.target.value });
  }

  handleSubmit(event) {
    console.log('on submit login', this.state);
    this.onLoginClick(this.state.email, this.state.password);
    event.preventDefault();
  }

  handleModalClose = () => {
    this.props.unsetPromptUserFlag();
    this.setState({shouldDisplay: false});
  };

  render() {
      const actions = [
        <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleModalClose}
        />
    ];

    const customContentStyle = {
        width: '40%',
        maxWidth: 'none',
    };

    return(<div>
        <Dialog
            title="Please login to continue."
            actions={actions}
            modal={true}
            open={this.state.shouldDisplay}
            onRequestClose={this.handleModalClose}
            contentStyle={customContentStyle}
            autoScrollBodyContent={true}
            >
        <div className={cx(s.root, flexbox.fullHeight)}>
            <div className={cx(flexbox.column, flexbox.columnItem)}>
                <Paper className={cx(flexbox.column, flexbox.columnItem, s.container)}>
                    <h2 className={cx(flexbox.columnItem, s.loginTitle)}>
                        Login to BotWorx.Ai
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

                    <form
                        className={cx(flexbox.columnItem, flexbox.column, s.botForm)}
                    >
                        <TextField
                        name="email"
                        className={flexbox.columnItem}
                        onChange={this.handleEmailChange}
                        floatingLabelText="Email Address *"
                        floatingLabelFixed={true}
                        fullWidth
                        />

                        <TextField
                        name="password"
                        className={flexbox.columnItem}
                        onChange={this.handlePasswordChange}
                        floatingLabelText="Password *"
                        floatingLabelFixed={true}
                        type="password"
                        fullWidth
                        />

                        <RaisedButton
                        onClick={this.handleSubmit}
                        className={cx(flexbox.columnItem, s.loginButton)}
                        label="Login" primary
                        />
                    </form>
                </Paper>
            </div>
    </div>
    </Dialog> </div>
    )
  }
}

export default withStyles(s, flexbox)(Login);
