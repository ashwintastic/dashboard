import React, { PropTypes } from 'react';
import FlatButton from 'material-ui/FlatButton';
import { Toolbar as MUIToolbar, ToolbarGroup } from 'material-ui/Toolbar';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Link from '../Link';
import s from './Toolbar.css';

function Toolbar({ links }) {
  return (
    <MUIToolbar>
      <ToolbarGroup firstChild>
        {links.map(l => (
          <Link to={l.to} key={l.label} className={s.link}>
            <FlatButton label={l.label} />
          </Link>
        ))}
      </ToolbarGroup>
    </MUIToolbar>
  );
}

Toolbar.propTypes = {
  links: PropTypes.arrayOf(PropTypes.shape({
    to: PropTypes.string,
    label: PropTypes.string,
  })),
};

export default withStyles(s)(Toolbar);
