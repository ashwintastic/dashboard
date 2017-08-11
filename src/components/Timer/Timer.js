import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { dateDisplayFormatType } from '../../config';
import { displayLocalDate, displayUtcDate, displayTimeZoneDate } from '../../utils/displayDate';
import moment from 'moment-timezone';
import cx from 'classnames';
import s from './Timer.css';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

const mapStateToProps = (state) => {
    return {
        currentAccountTimeZone: state.analytics.currentAccountTimeZone
    }
};

class TimerComponent extends Component {

  static propTypes = {
    localTime: PropTypes.string,
    botTime: PropTypes.string
  };

  static defaultProps = {
    localTime: '',
    botTime: ''
  };

  constructor(props) {
      super(props);
      this.state = {
          localTime: '',
          botTime: '',
          timeZone: null,
          shouldShowBotTime: false
      }
      this.tzOffset = null;
  }

  setCurrentTime() {
    this.setState({
      localTime: displayLocalDate(moment(), dateDisplayFormatType.FULL_DATE_TIME),
      utcTime: displayUtcDate(moment(), dateDisplayFormatType.FULL_DATE_TIME),
      botTime: displayTimeZoneDate(moment(), dateDisplayFormatType.FULL_DATE_TIME, this.tzOffset)
    });
  }

  componentWillMount() {
    this.setCurrentTime();
  }
  static intrvlId;
  componentDidMount() {
    //if (typeof window !== 'undefined') {
    this.intrvlId = window.setInterval(() => {
      this.setCurrentTime()
    }, 500);
    //}

  }
  componentWillUnmount() {
    window.clearInterval(this.intrvlId);
  }

  componentWillReceiveProps(nextProps) {
      if( nextProps.currentAccountTimeZone && nextProps.currentAccountTimeZone != this.state.timeZone) {
          this.setState({timeZone: nextProps.currentAccountTimeZone});
          this.setState({shouldShowBotTime: true});
          this.tzOffset = moment.tz(nextProps.currentAccountTimeZone)._offset;
          this.setCurrentTime();
      } else {
          this.setState({shouldShowBotTime: false});
      }
  }

  shouldComponentUpdate() {
    return true;
  }

  render() {
    const botTimeStyle = cx({
                            [s.hidden]: this.state.shouldShowBotTime == false,
                        });

    const utcTimeStyle = cx({
                            [s.hidden]: this.state.shouldShowBotTime == true
                        });

    return <div className={cx(s.timer)}>
      <div ref="utcTime" className={utcTimeStyle}>
        UTC Time:
        <span className="bot">{this.state.utcTime || ""}</span>
      </div>

      <div ref="botTime" className={botTimeStyle}>
        Bot Time{this.state.timeZone ? `(${this.state.timeZone})` : ''}:
        <span className="bot">{this.state.botTime || ""}</span>
      </div>

      <div ref="localTime">
        Local Time:
        <span className="local">{this.state.localTime || ""}</span>
      </div>
    </div>
  }
}

const Timer = connect(mapStateToProps)(TimerComponent);

export default withStyles(s)(Timer);
