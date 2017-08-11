import React, { PropTypes } from 'react';
import Chip from 'material-ui/Chip';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './FilterBar.css';

function FilterBar({ filters, onDeleteFilter }) {
  return (
    <div className={s.wrapper}>
      {Object.keys(filters).map(filter => (
        <div className={s.filterChip} key={filter}>
          <Chip onRequestDelete={() => onDeleteFilter(filter)}>
            {`${filters[filter].label}: ${filters[filter].value}`}
          </Chip>
        </div>
      ))}
    </div>
  );
}

FilterBar.propTypes = {
  filters: PropTypes.object,
  onDeleteFilter: PropTypes.func,
};

export default withStyles(s)(FilterBar);
