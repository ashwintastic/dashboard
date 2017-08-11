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

const UserMenu = ({ styles, selected, handleClick }) => {

    const userStyle = cx({[s.selectedMenu]: selected == metrics.metricType.USER});
    const userChangeStyle = cx({[s.selectedMenu]: selected == metrics.metricType.USER_CHANGE});
    const retentionStyle = cx({[s.selectedMenu]: selected == metrics.metricType.RETENTION});

    let location = '/analytics/v1/';

    return(
        <Paper className={cx(s.listContainer)} zDepth={1}>
            <List className={cx(s.listStyle)}  listStyle={styles.menu}>
                <Subheader className={cx(s.listHeader)}>Audience</Subheader>
                <Divider />
                <Link to={location + `users`} title="View Reports">
                    <ListItem primaryText="User Activity" className={userStyle} />
                </Link>
                <Divider />

                <Link to={location + `userChange`} title="View Reports">
                    <ListItem primaryText="User Change" className={userChangeStyle} />
                </Link>
                <Divider />

                <Link to={location + `retention`} title="View Reports">
                    <ListItem primaryText="Retention" className={retentionStyle} />
                </Link>
            </List>
        </Paper>
    );
}

export default UserMenu;
