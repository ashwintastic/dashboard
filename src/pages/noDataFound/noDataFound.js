/**
 * Created by root on 9/3/17.
 */
import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './noDataFound.css';

function NoDataFound(props) {
  return (
    <div>
    {props.children}
</div>
);
}

export default withStyles(s)(NoDataFound);