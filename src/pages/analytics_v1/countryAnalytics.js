import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import s from './AnalyticsPageV1.css';
import flexbox from '../../components/flexbox.css';
import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';
import EditIcon from 'material-ui/svg-icons/image/edit';
import { blue500, red500, green500 } from 'material-ui/styles/colors';
import Link from '../../components/Link';
import CreateUserEntryIcon from 'material-ui/svg-icons/content/add-box'
import RaisedButton from 'material-ui/RaisedButton';
import RemoveIcon from 'material-ui/svg-icons/action/delete';
import Form from "react-jsonschema-form";
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import UserMenu from './userMenu';
import MessagingMenu from './messagingMenu';
import DemographicsMenu from './demographicsMenu'

import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

const styles = {
  userInfo: {
    width: 550,
    minHeight: 250,
    marginLeft: 330,
    marginTop: -200,
    padding: '25px 0px 15px 20px',
  },
  formField: {
    width: 400,
    padding: '5px 10px 10px 5px',
  },
  menu: {
    paddingTop: '0 px',
    paddingBottom: '0 px'
  }
};

const title = 'BotWorx.Ai - Analytics';

class CountryAnalytics extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };

  }

  static contextTypes = { setTitle: PropTypes.func.isRequired };

  render() {
    const {userData, userPassword, onSaveUserDataClick, onSavePasswordDataClick, onUserDataChange, onPasswordDataChange, passwordValidationData } = this.props;
    this.context.setTitle(title);
    return (
      <div className={cx(s.root, flexbox.rowItem)} >
          Country Analytics
          </div>
    )
  }
}

export default withStyles(flexbox, s)(CountryAnalytics);
