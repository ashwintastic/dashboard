import React, { PropTypes } from 'react';
import cx from 'classnames';
import Paper from 'material-ui/Paper';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import flexbox from '../../components/flexbox.css';
import s from './Chart.css';
import ChartLoading from './ChartLoading';


function ChartWrapper({ label, children, loading }) {
  return (
    <Paper
      rounded
      className={cx(flexbox.rowItem, flexbox.column, s.chart, s.chartLarge)}
    >
      <h5 className={cx(flexbox.columnItem, flexbox.row, s.chartLabelLarge)}>
        <span className={flexbox.rowItem}>{label}</span>
        <ChartLoading
          className={cx(s.loadingSmall, flexbox.rowItem)} loading={loading}
        />
      </h5>
      <div className={cx(flexbox.columnItem)}>
        {children}
      </div>
    </Paper>
  );
}

ChartWrapper.propTypes = {
  label: PropTypes.string,
  children: PropTypes.node,
  loading: PropTypes.bool,
};

export default withStyles(flexbox, s)(ChartWrapper);
