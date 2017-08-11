import React, { PropTypes } from 'react';
import Chart from './Chart';

export default function BarChart({ className, data, axis }) {
  return (
    <Chart
      className={className}
      data={{ ...data, type: 'bar' }}
      axis={axis}
    />
  );
}

BarChart.propTypes = {
  className: PropTypes.string,
  data: PropTypes.object,
  axis: PropTypes.object,
};
