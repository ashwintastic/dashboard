import React, { PropTypes } from 'react';
import ChartWrapper from './ChartWrapper';
import C3LineChart from '../C3Chart/LineChart';
import Loading from './Loading';

function LineChart({ metrics, loading, label }) {
  return (
    <ChartWrapper label={label} loading={loading}>
      {metrics ? <C3LineChart {...metrics} /> : <Loading />}
    </ChartWrapper>
  );
}

LineChart.propTypes = {
  metrics: PropTypes.object,
  loading: PropTypes.bool,
  label: PropTypes.string,
};

export default LineChart;
