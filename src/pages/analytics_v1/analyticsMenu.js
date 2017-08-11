import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Paper from 'material-ui/Paper';
import cx from 'classnames';
import s from './AnalyticsPageV1.css';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import UserMenu from './userMenu';
import MessagingMenu from './messagingMenu';
import DemographicsMenu from './demographicsMenu';
import DeliveryMenu from './deliveryMenu';
import SubscriptionMenu from './subscriptionMenu';
import ContentMenu from './contentMenu';
import OverviewMenu from './overviewMenu'
import SourcesMenu from './sourcesMenu';
import {List, ListItem} from 'material-ui/List';
import {
  setAnalyticsMenu,
} from '../../actions/analytics';

const mapStateToProps = (state) => ({
  selectedMenu: state.analytics.selectedMenu,
});

const mapDispatch = (dispatch) => ({
  handleMenuClick: (menuOption) => {
    dispatch(setAnalyticsMenu(menuOption));
  },
});

class AnalyticsMenuSection extends Component {

    render() {
        const { styles } = this.props;
        return(
            <div>
                <OverviewMenu styles={styles} selected={this.props.selectedMenu} handleClick={this.props.handleMenuClick} />
                <UserMenu styles={styles} selected={this.props.selectedMenu} handleClick={this.props.handleMenuClick} />
                <MessagingMenu styles={styles} selected={this.props.selectedMenu} handleClick={this.props.handleMenuClick} />
                <DemographicsMenu styles={styles} selected={this.props.selectedMenu} handleClick={this.props.handleMenuClick} />
                <DeliveryMenu styles={styles} selected={this.props.selectedMenu} handleClick={this.props.handleMenuClick} />
                <SubscriptionMenu styles={styles} selected={this.props.selectedMenu} handleClick={this.props.handleMenuClick} />
                <ContentMenu styles={styles} selected={this.props.selectedMenu} handleClick={this.props.handleMenuClick} />
                <SourcesMenu styles={styles} selected={this.props.selectedMenu} handleClick={this.props.handleMenuClick} />
            </div>
        );
    }
}

const AnalyticsMenu = connect(mapStateToProps, mapDispatch)(AnalyticsMenuSection);

export default AnalyticsMenu;

