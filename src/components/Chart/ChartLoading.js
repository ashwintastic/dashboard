import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import chartLoadingImage from './gif-load.gif';
import s from './Chart.css';

function ChartLoading({ loading }) {
  return loading ? (
    <img
      alt="Loading.."
      src={chartLoadingImage}
      className={s.chartLoadingImage}
    />
  ) : null;
}

ChartLoading.propTypes = {
  loading: PropTypes.bool,
};

export default withStyles(s)(ChartLoading);
