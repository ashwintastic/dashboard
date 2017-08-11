import React, { PropTypes } from 'react';
import Chart from './Chart';

export default function AreaChart({ className, data, axis }) {
  return (
    <Chart
      className={className}
      data={{ ...data, type: 'area' }}
      axis={axis}
    />
  );
}

AreaChart.propTypes = {
  className: PropTypes.string,
  data: PropTypes.object,
  axis: PropTypes.object,
};
