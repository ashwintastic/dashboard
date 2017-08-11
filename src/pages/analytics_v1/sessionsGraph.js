import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import LineChart from '../../components/Chart/LineChart';

class SessionsGraph extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };

  }
  render() {
    let data = this.props.data;

    return (
          <LineChart metrics={data}
                label="Sessions"
            />
    )
  }
}

export default SessionsGraph;
