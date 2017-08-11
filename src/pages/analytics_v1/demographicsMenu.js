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

const DemographicsMenu = ({ styles, selected, handleClick }) => {

    const genderStyle = cx({[s.selectedMenu]: selected == metrics.metricType.GENDER});
    const countryStyle = cx({[s.selectedMenu]: selected == metrics.metricType.COUNTRY});
    const timeZoneStyle = cx({[s.selectedMenu]: selected == metrics.metricType.TIME_ZONE});
    const languageStyle = cx({[s.selectedMenu]: selected == metrics.metricType.LOCALE});
    let location = '/analytics/v1/';

    return(
        <Paper className={cx(s.listContainer)}>
            <List className={cx(s.listStyle)}  listStyle={styles.menu}>
                <Subheader className={cx(s.listHeader)}>Demographics</Subheader>
                <Divider />
                <Link to={location + `gender`} title="View Reports">
                    <ListItem primaryText="Gender" value={1} className={genderStyle} />
                </Link>
                <Divider />

                <Link to={location + `timezone`} title="View Reports">
                    <ListItem primaryText="Time Zone" value={3} className={timeZoneStyle} />
                </Link>

                <Divider />

                <Link to={location + `locale`} title="View Reports">
                    <ListItem primaryText="Locale" value={4} className={languageStyle} />
                </Link>
            </List>
        </Paper>
    );
}

export default DemographicsMenu;


