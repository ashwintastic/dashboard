import React, { PropTypes } from 'react';
import ChartWrapper from './ChartWrapper';
import C3BarChart from '../C3Chart/BarChart';
import Loading from './Loading';

function BarChart({ metrics, loading, label }) {
  return (
    <ChartWrapper label={label} loading={loading}>
      {metrics ? <C3BarChart {...metrics} /> : <Loading />}
    </ChartWrapper>
  );
}

BarChart.propTypes = {
  metrics: PropTypes.object,
  loading: PropTypes.bool,
  label: PropTypes.string,
};

export default BarChart;
