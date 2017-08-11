import React, { PropTypes, Component } from 'react';
import Paper from 'material-ui/Paper';
import cx from 'classnames';
import s from './AnalyticsPageV1.css';
import {List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import Link from '../../components/Link';
import metrics from '../../constants/metrics';

const SubscriptionMenu = ({ styles, selected, handleClick }) => {

    const subscriptionChangeStyle = cx({[s.selectedMenu]: selected == metrics.metricType.SUBSCRIPTION_CHANGE});
    let location = '/analytics/v1/';

    return(
        <Paper className={cx(s.listContainer)} zDepth={1}>
            <List className={cx(s.listStyle)}  listStyle={styles.menu}>
                <Subheader className={cx(s.listHeader)}>Subscriptions</Subheader>
                <Divider />
                <Link to={location + `subscriptionChange`} title="Subscription Change">
                    <ListItem primaryText="Subscription Change" value={1}
                        className={subscriptionChangeStyle} />
                </Link>

            </List>
        </Paper>
    );
}

export default SubscriptionMenu;


