import React from 'react';
var Select = require('react-select');

var styles = {
  section: {
    marginBottom: 40,
  },
  selectField: {
    width: 200,
    color: "blue",
  }
}
var MultiSelect = React.createClass({
  displayName: 'MultiSelect',
  propTypes: {
    label: React.PropTypes.string,
  },
  getInitialState() {
    return {
      disabled: false,
      crazy: false,
      options: {},
      value: this.props.selectedVal,
    };
  },
  handleSelectChange(value) {
    this.props.onDataChange(value, this.props.userEntry);
    this.setState({ value });
  },

  render() {
    return (
      <div style={{ width: '280px', marginLeft: '50px' }}>
        <link rel="stylesheet" href="https://unpkg.com/react-select/dist/react-select.css" />
        <h4 className="section-heading">{this.props.label}</h4>
        <Select multi simpleValue disabled={this.state.disabled} value={this.state.value} options={this.props.options} onChange={this.handleSelectChange} />
      </div>
    );
  }
});

export default MultiSelect;