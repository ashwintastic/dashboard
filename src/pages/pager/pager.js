/**
 * Created by root on 3/3/17.
 */
import React from 'react';
import { render } from 'react-dom';
import Pager from 'react-pager';
const paginatorCss = {
  'float': 'left',
  'position': 'relative',
  'left': '36%',
  'cursor': 'pointer'
};
class CustomPager extends React.Component {
  constructor(props) {
    super(props);

    this.handlePageChanged = this.handlePageChanged.bind(this);
    let total = this.props.recordCount;
    let pagesize = this.props.pageSize;
    let numberofPages = Math.ceil(total / pagesize);
    let currentPage = this.props.currentPage;
    this.state = {
      total: numberofPages,
      current: currentPage - 1,
      visiblePage: 4
    };
  }

  componentWillReceiveProps(nextProps) {
    let total = nextProps.recordCount;
    let pagesize = nextProps.pageSize;
    let numberofPages = Math.ceil(total / pagesize);
    this.setState({
      current: nextProps.currentPage - 1,
      total: numberofPages,
      visiblePage: 4
    });
  }


  handlePageChanged(newPage) {
    let diff = (newPage - this.state.current);
    if (diff === 1) {
      this.props.onNextClick(this.props.accountId, this.props.botId, this.props.pollType);
    }    else if (diff === -1) {
      this.props.onPreviousClick(this.props.accountId, this.props.botId, this.props.pollType);
    }    else {
      this.props.onPageNumberSelect(this.props.accountId, this.props.botId, newPage + 1, this.props.pollType);
    }

    this.setState({ current: newPage });
  }

  render() {
    return (
      <div style={paginatorCss}>
        <Pager
          total={this.state.total}
          current={this.state.current}
          visiblePages={this.state.visiblePage}
          titles={{ first: 'First', last: 'Last' }}
          className="pagination-sm pull-right"
          onPageChanged={this.handlePageChanged}
        />
      </div>
    );
  }
}

export default CustomPager;

