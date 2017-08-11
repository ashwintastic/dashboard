import React from 'react';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import flexbox from '../../components/flexbox.css';
import loadingImage from './loading.gif';
import s from './Chart.css';

function Loading() {
  return (
    <div className={cx(flexbox.column, flexbox.alignCenter)}>
      <img
        alt="Loading.."
        className={cx(flexbox.columnItem, s.loadingImage)}
        src={loadingImage}
      />
    </div>
  );
}

export default withStyles(flexbox, s)(Loading);
