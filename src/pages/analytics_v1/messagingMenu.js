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

const MessagingMenu = ({ styles, selected, handleClick }) => {

    const messagesStyle = cx({[s.selectedMenu]: selected == metrics.metricType.MESSAGE_COUNT});
    const sessionsStyle = cx({[s.selectedMenu]: selected == metrics.metricType.MESSAGE_SESSION_ENGAGED});
    const engagementStyle = cx({[s.selectedMenu]: selected == metrics.metricType.MESSAGE_ENGAGEMENT});

    let location = '/analytics/v1/';


    return(
        <Paper className={cx(s.listContainer)} zDepth={1}>
            <List className={cx(s.listStyle)}  listStyle={styles.menu}>
                <Subheader className={cx(s.listHeader)}>Messaging</Subheader>
                <Divider />

                <Link to={location + `messages`} title="View Reports">
                    <ListItem primaryText="Messages" value={1} className={messagesStyle} />
                </Link>

                <Divider />
                <Link to={location + `sessions`} title="View Reports">
                    <ListItem primaryText="Sessions" value={2} className={sessionsStyle}  />
                </Link>

                <Divider />

                <Link to={location + `engagement`} title="View Reports">
                    <ListItem primaryText="Engagement" value={3} className={engagementStyle} />
                </Link>
            </List>
        </Paper>
    );
}

export default MessagingMenu;
