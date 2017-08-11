import React from 'react';
import Paper from 'material-ui/Paper';
import cx from 'classnames';
import s from './AnalyticsPageV1.css';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import Link from '../../components/Link';
import metrics from '../../constants/metrics';

const OverviewMenu = ({ styles, selected }) => {

    const userStyle = cx({[s.selectedMenu]: selected == metrics.metricType.OVERVIEW});

    let location = '/analytics/v1/';

    return(
        <Paper className={cx(s.listContainer)} zDepth={1}>
            <List className={cx(s.listStyle)}  listStyle={styles.menu}>
                <Subheader className={cx(s.listHeader)}>Overview</Subheader>
                <Divider />
                <Link to={location + `overview`} title="View Reports">
                    <ListItem primaryText="Overview" className={userStyle} />
                </Link>
            </List>
        </Paper>
    );
}

export default OverviewMenu;
