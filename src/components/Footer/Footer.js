import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import AppBar from 'material-ui/AppBar';
import s from './Footer.css';
// import timestamp from 'timestamp.json'

const styles = {
    footer: {
        float: 'right',
        color: 'gray',
        margin: '10px',
    }
};


function Footer() {
    return <div style={styles.footer}>{__VERSION__}</div>
}

export default withStyles(s)(Footer);
