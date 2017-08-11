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

const ContentMenu = ({ styles, selected, handleClick }) => {

    const topNodesStyle = cx({[s.selectedMenu]: selected == metrics.metricType.TOP_NODES});
    const topActionsStyle = cx({[s.selectedMenu]: selected == metrics.metricType.TOP_ACTIONS});
    const topTextInputsStyle = cx({[s.selectedMenu]: selected == metrics.metricType.TOP_TEXT_INPUTS});
    const topContentItemsStyle = cx({[s.selectedMenu]: selected == metrics.metricType.TOP_CONTENT_ITEMS});
    const nodeAnalysisStyle = cx({[s.selectedMenu]: selected == metrics.metricType.NODE_ANALYSIS});
    let location = '/analytics/v1/';

    return(
        <Paper className={cx(s.listContainer)} zDepth={1}>
            <List className={cx(s.listStyle)}  listStyle={styles.menu}>
                <Subheader className={cx(s.listHeader)}>Content</Subheader>
                <Divider />
                <Link to={location + `topNodes`} title="View Reports">
                    <ListItem primaryText="Top Nodes" value={1} className={topNodesStyle} />
                </Link>
                <Divider />

                <Link to={location + `topActions`} title="View Reports">
                    <ListItem primaryText="Top Actions" value={2} className={topActionsStyle} />
                </Link>
                <Divider />

                <Link to={location + `topTextInputs`} title="View Reports">
                    <ListItem primaryText="Top Text Inputs" value={3} className={topTextInputsStyle} />
                </Link>
                <Divider />

                <Link to={location + `topContentItems`} title="View Reports">
                    <ListItem primaryText="Top Content Items" value={4} className={topContentItemsStyle} />
                </Link>
                <Divider />

                <Link to={location + `nodeAnalysis`} title="View Reports">
                    <ListItem primaryText="Node Analysis" value={5} className={nodeAnalysisStyle} />
                </Link>
            </List>
        </Paper>
    );
}

export default ContentMenu;


