import React, { PropTypes } from 'react';
import Link from '../Link';
import s from './Breadcrumbs.css'
//import { Toolbar as MUIToolbar, ToolbarGroup } from 'material-ui/Toolbar';

const breadCrumbsContainerStyle = {
  marginTop: "1em",
  fontSize: "1em"
};

function Breadcrumbs({ links }) {
  if (!links.length) {
    return (<div></div>);
  }
  /*const lastLink = links.pop();*/
  if (links.length > 0) {
    return (
      <div className={s.breadCrumbsContainer} style={breadCrumbsContainerStyle}>
        {links.map(l => (
          <span key={l.label}>
            { (l.path !== '')? 
            <Link to={l.path}>
              <span>{l.label}</span>
            </Link>:
              <span>{l.label}</span>
           }
            <span className={s.breadCrumbSeparator}> > </span>
          </span>
        ))} 
      </div>
    );
  } /*else {
    return (
      <div style={breadCrumbStyle}>
        <span style={lastLinkStyle} key={lastLink.label}>
          <span>{lastLink.label}</span>
        </span>
      </div>
    );
  }*/
}
Breadcrumbs.propTypes = {
  links: PropTypes.arrayOf(PropTypes.shape({
    to: PropTypes.string,
    label: PropTypes.string,
  })),
};

export default Breadcrumbs;
