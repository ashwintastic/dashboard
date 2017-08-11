import React, { PropTypes, Component } from 'react';
import Paper from 'material-ui/Paper';
import cx from 'classnames';
import s from './AnalyticsPageV1.css';
import {List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import Link from '../../components/Link';
import metrics from '../../constants/metrics';

const SourcesMenu = ({ styles, selected, handleClick }) => {

    const referralsStyle = cx({[s.selectedMenu]: selected == metrics.metricType.REFERRALS});
    let location = '/analytics/v1/';

    return(
        <Paper className={cx(s.listContainer)} zDepth={1}>
            <List className={cx(s.listStyle)}  listStyle={styles.menu}>
                <Subheader className={cx(s.listHeader)}>Sources</Subheader>
                <Divider />
                <Link to={location + `referrals`} title="View Reports">
                    <ListItem primaryText="Referrals" value={1} className={referralsStyle} />
                </Link>
                
            </List>
        </Paper>
    );
}

export default SourcesMenu;


