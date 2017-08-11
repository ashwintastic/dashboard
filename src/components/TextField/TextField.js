
import React, { Component } from 'react';
import { default as MUI_TextField } from 'material-ui/TextField';
import ReactDOM from 'react-dom';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import flexbox from '../../components/flexbox.css';
import s from './TextField.css';

class TextField extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            value: this.props.value,
            required: '',
            errorText: this.props.errorText
        };
        if (props.required === true) {
            this.state.required = s.required;
        }
    }

    getFloatingLabelText(props) {
        let floatingLabelText = props.floatingLabelText;
        if (props.required === true) {
            //props.style += '*';
        }
        return floatingLabelText;
    }
    componentWillReceiveProps(nextProps) {
        this.setState({value : nextProps.value});
        if (nextProps.required === true) {
            this.setState({required : s.required});
        }
        this.setState({errorText : nextProps.errorText});
    }
    
    render() {
        return (
            <MUI_TextField
                id={this.props.id}
                floatingLabelText={this.props.floatingLabelText}
                value={this.state.value}
                className={cx(this.props.className, this.state.required)}
                onChange={this.props.onChange }
                style={this.props.style}
                maxLength={this.props.maxLength}
                errorText={this.state.errorText}
            />
        );
    }
}

export default withStyles(flexbox, s)(TextField);
