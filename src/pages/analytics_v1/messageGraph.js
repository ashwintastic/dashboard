import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import s from './AnalyticsPageV1.css';
import flexbox from '../../components/flexbox.css';
import LineChart from '../../components/Chart/LineChart';

class MessagesGraph extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };

  }
  render() {

       /*let data = {
    data: {
        x: 'x',
        //xFormat: '%Y%m%d', // 'xFormat' can be used as custom format of 'x'
        columns: [
            ['x', '2013-01-01', '2013-01-02', '2013-01-03', '2013-01-04', '2013-01-05', '2013-01-06'],
//            ['x', '20130101', '20130102', '20130103', '20130104', '20130105', '20130106'],
            ['Total', 30, 200, 100, 400, 150, 250],
            ['In', 130, 340, 200, 500, 250, 350],
            ['Out', 110, 320, 100, 300, 150, 250]
        ]
    },
    axis: {
        x: {
            type: 'timeseries',
            tick: {
                format: '%Y-%m-%d'
            }
        }
    }
}*/
    let data = this.props.data;

    return (
          <LineChart metrics={data}
                label="Messages"
            />
    )
  }
}

export default withStyles(flexbox, s)(MessagesGraph);
