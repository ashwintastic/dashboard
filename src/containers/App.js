import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import AppHeader from './AppHeader';
import Footer from '../components/Footer';
import AppBreadcrumbs from './AppBreadcrumbs';
import Toolbar from '../components/Toolbar';
import Notifications from '../containers/notifications/Notification';
import s from './App.css';
import LoadingBar from './loadingBar/LoadingBar'
import LoginPage from '../pages/login'

const mapStateToProps = (state) => ({
  loggedIn: state.isAuthenticated,
  isSuperAdmin: (state.auth.user.roles === 'SuperAdmin') ||
  (state.auth.user.roles === 'BotworxAdmin'),
});

const AppContainer = ({ children, isSuperAdmin, loggedIn }) => {
  // const links = isSuperAdmin ?
  //   [{ to: '/accounts', label: 'Accounts' }] :
  //   [{ to: '/user/bots', label: 'Bots' }];
  const links = [{ to: '/accounts', label: 'Accounts' }]
  let location = "/";
  if (typeof (window) !== 'undefined') {
    location = window.location.pathname;
  }
  const isHomePage = (location === "/");

  return (
    <div>
      {isHomePage ? null : <AppHeader />}
      {isHomePage ? null : <Notifications />}
      <LoadingBar />
      <div className={s.pageContent}>
        <AppBreadcrumbs />
        {children}
      </div>
      {isHomePage ? null : <Footer />}
      <LoginPage />
    </div>
  );
};

AppContainer.propTypes = {
  children: PropTypes.node,
  isSuperAdmin: PropTypes.bool,
  loggedIn: PropTypes.bool,
};

export default withStyles(s)(connect(mapStateToProps)(AppContainer));
