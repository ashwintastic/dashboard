import React, { PropTypes } from 'react';
import Chart from './Chart';

export default function PieChart({ className, data, pie, ...otherProps }) {
  return (
    <Chart
      className={className}
      data={{ ...data, type: 'pie', ...otherProps }}
      pie={pie}
    />
  );
}

PieChart.propTypes = {
  className: PropTypes.string,
  data: PropTypes.object,
};
