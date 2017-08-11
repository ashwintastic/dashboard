import React, { PropTypes } from 'react';
import ChartWrapper from './ChartWrapper';
import C3PieChart from '../C3Chart/PieChart';
import Loading from './Loading';

function PieChart({ metrics, loading, label, ...otherProps }) {
  return (
    <ChartWrapper label={label} loading={loading}>
      {metrics ? <C3PieChart {...metrics} {...otherProps} /> : <Loading />}
    </ChartWrapper>
  );
}

PieChart.propTypes = {
  metrics: PropTypes.object,
  loading: PropTypes.bool,
  label: PropTypes.string,
};

export default PieChart;
