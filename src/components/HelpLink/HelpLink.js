import React, {  Component } from 'react';
import Popover from 'material-ui/Popover';
import FontIcon from 'material-ui/FontIcon';
import HelpIcon from 'material-ui/svg-icons/action/help';
import ClearIcon from 'material-ui/svg-icons/content/clear';
import IconButton from 'material-ui/IconButton';
import Paper from 'material-ui/Paper';
import s from './HelpLink.css';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';


class HelpLink extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false
        };
    }

    handlePopOverClick = (event) => {
    // This prevents ghost click.
        event.preventDefault();

        this.setState({
        helpPopOverOpen: true,
        anchorEl: event.currentTarget,
        });
    };

    handleRequestClose = () => {
        this.setState({
            helpPopOverOpen: false,
        });
    };

    render() {
        const { content, label } = this.props;
        return(
        <div className={cx(s.helpLinkStyle)}>
        <IconButton title="Help" onClick={this.handlePopOverClick}>
            <HelpIcon color={"rgb(0, 188, 212)"}/>
        </IconButton>

            <Popover
                open={this.state.helpPopOverOpen}
                anchorEl={this.state.anchorEl}
                anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                targetOrigin={{horizontal: 'left', vertical: 'top'}}
                onRequestClose={this.handleRequestClose}
            >
                <Paper className={cx(s.helpLinkContainer)} zDepth={1}>
                    <div>
                        <span className = {cx(s.label)}> {label} </span>
                        <span className={cx(s.closeContainer)} onClick={this.handleRequestClose}>
                            <ClearIcon className={cx(s.close)}/>
                        </span>
                    </div>
                    {content.map((c, idx) => (
                        <div key={idx}>
                            <span className = {cx(s.label)}>{c.label}</span>
                            <span style={{color:'rgb(187, 183, 183)', fontWeight: 700}}>{c.legend}</span>
                            {c.text}
                        </div>
                    ))}
                </Paper>
            </Popover>
        </div>
        );
    }
}

export default withStyles(s)(HelpLink);
