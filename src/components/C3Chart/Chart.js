import React, { PropTypes } from 'react';
import C3Chart from './C3Chart';

export default function Chart({ className, ...otherProps }) {
  return (
    <div className={className}>
      <C3Chart {...otherProps} />
    </div>
  );
}

Chart.propTypes = {
  className: PropTypes.string,
};
