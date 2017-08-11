import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import Divider from 'material-ui/Divider';
import Download from 'material-ui/svg-icons/file/file-download';
import UserIcon from 'material-ui/svg-icons/action/account-box';
import SettingsIcon from 'material-ui/svg-icons/action/settings';
import LogoutIcon from 'material-ui/svg-icons/action/power-settings-new';
import ArrowDropDown from 'material-ui/svg-icons/navigation/arrow-drop-down';
import s from './Header.css';
import logoImage from './logo_full.png';
import LoadingBar from 'react-redux-loading-bar'
import Timer from '../Timer';

const styles = {
  vertLine: {
    display: 'inline-block',
    borderLeft: '1px solid white',
    marginRight: 20,
    width: 0,
    height: 35,
    position: 'relative'
  },
  userName: {
    display: 'inline-block',
    minWidth: 100,
    margin: '-20px 0px 0px 20px'
  },
  userIcon: {
    color: 'white',
    width: 30,
    height: 30,
    margin: '-10px 0px 0px 10px',
  },
  menuHeader: {
    margin: '-10px 0px 0px -10px',
    color: 'darkgrey'
  }
};

function Header({ userEmail, userName  }) {
  const logo = <a href='/accounts'>
    <img src={logoImage} alt="Logo" height="45px" /></a>;

  let location = "/";
  if (typeof (window) !== 'undefined') {
    location = window.location.pathname;
  }

  const logoutButton = (location !== '/login' && location !== '/login/forgot') ?
    <div style={{ float: 'right' }}>
      <Timer /><div style={styles.vertLine}></div>
      <div style={{ display: 'inline-block', color: 'white' }}>
        <UserIcon style={styles.userIcon} />
        <div style={styles.userName}>{userName}</div>
        <HeaderMenu userEmail={userEmail} /></div> </div> :
    null;

  return (location !== '/' && location !== '/login/forgot' && location !== '/user/reset-password') ? (
    <AppBar
      iconElementLeft={logo}
      className={s.root}
      iconElementRight={logoutButton}
    />) : null;
}

function HeaderMenu(props) {

  return <IconMenu
    iconButtonElement={<IconButton><ArrowDropDown style={{ color: 'white' }} /></IconButton>}
    anchorOrigin={{ horizontal: 'middle', vertical: 'bottom' }}
    targetOrigin={{ horizontal: 'left', vertical: 'top' }}
    menuStyle={{ width: '170px', margin: '0px 10px 0px 10px' }}
  >
    <MenuItem
      primaryText={props.userEmail}
      style={styles.menuHeader}
    /><Divider />
    <MenuItem
      leftIcon={<SettingsIcon />}
      style={{ margin: '-10px 0px -10px 0px' }}
      primaryText="Settings"
      href={'/accounts/settings'}
    />
    <Divider />
    <MenuItem
      leftIcon={<LogoutIcon />}
      style={{ margin: '-10px 0px -5px 0px' }}
      primaryText="Log out"
      href={'/logout'}
    />
  </IconMenu>;
}
Header.propTypes = {
  userEmail: PropTypes.string,
  userName: PropTypes.string
};

export default withStyles(s)(Header);
