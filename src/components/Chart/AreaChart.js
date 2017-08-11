import React, { PropTypes } from 'react';
import ChartWrapper from './ChartWrapper';
import C3AreaChart from '../C3Chart/AreaChart';
import Loading from './Loading';

function AreaChart({ metrics, loading, label }) {
  return (
    <ChartWrapper label={label} loading={loading}>
      {metrics ? <C3AreaChart {...metrics} /> : <Loading />}
    </ChartWrapper>
  );
}

AreaChart.propTypes = {
  metrics: PropTypes.object,
  loading: PropTypes.bool,
  label: PropTypes.string,
};

export default AreaChart;
