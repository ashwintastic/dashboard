

import React, { Component } from 'react';
import { Tabs, Tab } from 'material-ui/Tabs';
import DatePicker from 'material-ui/DatePicker/Calendar.js';
import moment from 'moment';
import Popover from 'material-ui/Popover';
import TextField from 'material-ui/TextField';
import TimePicker from 'material-ui/TimePicker/Clock.js';
import FlatButton from 'material-ui/FlatButton';
import s from './DateTimePicker.css';

let CurrentDateTime = () => moment().subtract(moment().utcOffset(), 'minutes').toDate();

class DateTimePicker extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        let minDate = props.minDate;
        if (!minDate) {
            minDate = new Date();
            minDate.setFullYear(1970);// minDate can't be null. Setting 1970 as start.
        }
        this.state = {
            dateDisplay: this.getDisplayDate(props.value),
            timeDisplay: this.getDisplayTime(props.value),
            calendarDisplay: false,
            label: props.floatingLabelText,
            value: this.getDateTime(props.value),
            selTabIndex: 0,
            anchorEl: null,
            minutes: 0,
            hours:0,
            style: {
                whiteSpace: 'nowrap',
                display: 'inline-block'
            },
            minDate: minDate,
            errorText: ''
        }
        const styleProps = this.props.style;
        for (var prop in styleProps) {
            this.state.style[prop] = styleProps[prop];
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({errorText : nextProps.errorText});
        if (nextProps.minDate) {
            this.setState({minDate : nextProps.minDate});
        }
        this.setState({value : this.getDateTime(nextProps.value)});
        this.setState({hours : moment(this.getDateTime(nextProps.value)).hours()});
        this.setState({minutes : moment(this.getDateTime(nextProps.value)).minutes()});
        this.setState({dateDisplay : this.getDisplayDate(nextProps.value)});
        this.setState({timeDisplay : this.getDisplayTime(nextProps.value)});
    }

    toggleCtrl = (e, tabIndex) => {
        let showHide = (this.state.calendarDisplay === false)? true : false;
        this.setState({ selTabIndex: tabIndex });
        if (showHide) {
            this.setState({ calendarDisplay: showHide, anchorEl: e.currentTarget });
        } else {
            this.setState({ calendarDisplay: showHide });
        }
        //this.refs.timeDialog.show();
    }
    showTime = (e) => {
        this.toggleCtrl(e, 1);
    }
    showDate = (e) => {
        this.toggleCtrl(e, 0);
    }
    
    /*setMinutes = (time) => {
        let minutes = moment(time).minutes();
        this.setState({ minutes: minutes });
    }
    setHours = (time) => {
        let hours = moment(time).hours();
        this.setState({ hours: hours });
    }*/
   
    setDateTime = () => {
        let dateTime = this.refs.datePicker.getSelectedDate();
        let time = this.refs.timePicker.getSelectedTime();
        dateTime.setHours(time.getHours());
        dateTime.setMinutes(time.getMinutes());
        this.setState({ value: dateTime });
        this.setState({ dateDisplay: this.getDisplayDate(dateTime) });
        this.setState({ timeDisplay: this.getDisplayTime(dateTime) });
        if (this.props.onChange) {
            this.props.onChange(dateTime);
        }
        this.toggleCtrl();
    }
    getDateTime = (dateObj) => {
        if (!dateObj) {
            return CurrentDateTime();
        }
        return dateObj;
    }
    getDisplayDate = (dateObj) => {
        if (dateObj) {
            return moment(dateObj).format('YYYY-MM-DD');
        } else {
            return '';
        }
    }
    getDisplayTime = (dateObj) => {
        if (dateObj) {
            return moment(dateObj).format('h:mm a')
        } else {
            return '';
        }
    }

    render() {
        const calendarDisplay = {
            show: {
                display: '',
                position: 'absolute',
                top: '200px',
                zIndex: '1000',
                backgroundColor: 'white'
            },
            hide: {
                display: 'none'    
            }
        }
        const styles = {
            dateText: {
                width: '12em'
            },
            timeText: {
                width: '8em',
                marginLeft: '0.5em'
            },
            errorText: {
                bottom: '15px',
                fontSize: '12px',
                lineHeight: '12px',
                color: 'rgb(244, 67, 54)',
                transition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms'
            }
        }

        return (
            <div style={this.state.style} className={s.dateTimeCtrl} >
                <TextField 
                    floatingLabelText={this.props.floatingLabelText}
                    onTouchTap={this.showDate}
                    style={styles.dateText}
                    value={this.state.dateDisplay}>
                </TextField>
                <TextField 
                    floatingLabelText=' '
                    onTouchTap={this.showTime}
                    style={styles.timeText}
                    value={this.state.timeDisplay}>
                </TextField>
                <div style={styles.errorText}>{this.state.errorText}</div>
                <Popover open={this.state.calendarDisplay}
                    onRequestClose={this.toggleCtrl}
                    anchorEl={this.state.anchorEl}
                    anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                    targetOrigin={{horizontal: 'left', vertical: 'top'}}
                >
                    <Tabs initialSelectedIndex={this.state.selTabIndex} >
                        <Tab label="Date" value='date'>
                            <DatePicker
                                floatingLabelText="Date"
                                container="inline"
                                mode="portrait"
                                initialDate={this.state.value}
                                firstDayOfWeek={1}
                                ref='datePicker'
                                onTouchTap={this.showDate}
                                minDate={this.state.minDate}
                            />
                        </Tab>
                        <Tab label="Time" value='time'>
                            <TimePicker
                                floatingLabelText="Time (UTC)"
                                initialTime={this.state.value}
                                onTouchTap={this.showTime}
                                format='ampm'
                                ref='timePicker'
                            />
                        </Tab>
                    </Tabs>
                    <div style={{textAlign:'right'}}>
                        <FlatButton label="Cancel" primary={true} 
                            onTouchTap={this.toggleCtrl}/>
                        <FlatButton label="OK" primary={true} 
                            onTouchTap={this.setDateTime}/>
                    </div>
                </Popover>
            </div>
        );
    }
}

export default DateTimePicker;
