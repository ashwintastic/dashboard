import React, { PropTypes } from 'react';

import cx from 'classnames';
import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import s from './PublishBot.css';
import flexbox from '../../components/flexbox.css';
import { List, ListItem } from 'material-ui/List';
import ContentSend from 'material-ui/svg-icons/content/send';
import { botworx } from '../../config';

const title = 'BotWorx.Ai - Bot Publishing';

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

function PublishBot({ onFbLoginClick, botId
  , botName, userId, rejectedPermissionsList, requirePermissionFlag }, context) {
  context.setTitle(title);

  return (
    <div className={cx(s.root, flexbox.column)}>
      <Paper className={s.section} zDepth={5}>
        <h1 className={flexbox.columnItem}>Bot publishing</h1>
        <br /><br />
        <Divider />
        {(requirePermissionFlag) ?
          <div><h4>
            <b> You have denied these required permissions.</b><br /><br />
            {rejectedPermissionsList.map(rp => (
              <List key = {rp}>
                <ListItem primaryText={botworx.permissions.required[rp]} leftIcon={<ContentSend />} />
              </List>))}<br />
            We need these permissions to link Botworx to one of
                your facebook page.<br />
            Please login with Facebook below to grant these permissions. </h4>
          </div> :
          <div>
            <h4><b>
              To deploy your bot we first need to link Botworx
         to one of your Facebook pages.</b><br /><br />
              <a>Botworx</a> can handle this for you automatically but will need
         permissions to manage<br />  your pages first.
        Please login with Facebook below to grant these permissions.</h4>
          </div>}
        <br /><br />
        <div className={flexbox.columnItem}>
          <a className={s.facebook} onClick={() => onFbLoginClick(userId, botId, botName)}>
            <FBLogo />
            <span>Login with Facebook</span>
          </a>
        </div>
      </Paper>
    </div>
  );
}

PublishBot.propTypes = {
  onFbLoginClick: PropTypes.func,
  botId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  botName: PropTypes.string
};

PublishBot.contextTypes = { setTitle: PropTypes.func.isRequired };

export default withStyles(flexbox, s)(PublishBot);
