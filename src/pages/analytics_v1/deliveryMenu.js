import React, { PropTypes, Component } from 'react';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Paper from 'material-ui/Paper';
import cx from 'classnames';
import s from './AnalyticsPageV1.css';
import {List, ListItem, MakeSelectable} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import Link from '../../components/Link';
import metrics from '../../constants/metrics';

const DeliveryMenu = ({ styles, selected, handleClick }) => {

    const sentMessagesStyle = cx({[s.selectedMenu]: selected == metrics.metricType.SENT_MESSAGES});
    const deliveryTimeStyle = cx({[s.selectedMenu]: selected == metrics.metricType.DELIVERY_TIME});
    const readTimeStyle = cx({[s.selectedMenu]: selected == metrics.metricType.READ_TIME});
    const engagementTimeStyle = cx({[s.selectedMenu]: selected == metrics.metricType.ENGAGEMENT_TIME});
    let location = '/analytics/v1/';

    return(
        <Paper className={cx(s.listContainer)} zDepth={1}>
            <List className={cx(s.listStyle)}  listStyle={styles.menu}>
                <Subheader className={cx(s.listHeader)}>Delivery</Subheader>
                <Divider />
                <Link to={location + `sentMessages`} title="View Reports">
                    <ListItem primaryText="Sent Messages" value={1} className={sentMessagesStyle} />
                </Link>
                <Divider />

                <Link to={location + `deliveryTime`} title="View Reports">
                    <ListItem primaryText="Delivery Time" value={2} className={deliveryTimeStyle} />
                </Link>
                <Divider />

                <Link to={location + `readTime`} title="View Reports">
                    <ListItem primaryText="Read Time" value={2} className={readTimeStyle} />
                </Link>
                <Divider />

                <Link to={location + `engagementTime`} title="View Reports">
                    <ListItem primaryText="Engagement Time" value={2} className={engagementTimeStyle} />
                </Link>
            </List>
        </Paper>
    );
}

export default DeliveryMenu;


