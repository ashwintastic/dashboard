import React, { PropTypes } from 'react';
import Chart from './Chart';

export default function LineChart({ className, data, axis }) {
  return (
    <Chart className={className} data={{ ...data, type: 'line' }} axis={axis} padding={{right:'3'}}/>
  );
}

LineChart.propTypes = {
  className: PropTypes.string,
  data: PropTypes.object,
};
