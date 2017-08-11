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
import DemographicsMenu from './demographicsMenu';
import AnalyticsMenu from './analyticsMenu';

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
  },
  analyticsSection: {
    minHeight: 1000,
    display: 'inline-block',
    width: '80%',
    verticalAlign: 'top'
  }
};

const title = 'BotWorx.Ai - Analytics';

class Analytics extends Component {
  constructor(props) {
    super(props);
    this.state = {
        availableHeight: '500px'
    };
    this.updateHeight = this.updateHeight.bind(this);
  }

  static contextTypes = { setTitle: PropTypes.func.isRequired };

  updateHeight() {
      if((typeof window == 'undefined') || !document.getElementById('analyticsReport')) {
        return;
      }
      let screenHeight = window.innerHeight;
      let reportTop = 0;
      if (document.getElementById('analyticsReport')) {
        reportTop = document.getElementById('analyticsReport').offsetTop +20; //20px as margint bottom
      }
      let reportHeight = screenHeight - reportTop;
      this.setState({ availableHeight: reportHeight +'px' });
  }
  componentWillMount() {
      this.updateHeight();
      if (typeof window != 'undefined') {
        window.document.body.style.overflow = 'hidden';
      }
  }
  componentDidMount() {
      this.updateHeight();
      if (typeof window != 'undefined') {
        window.addEventListener("resize", this.updateHeight);
      }
  }
  componentWillUnmount() {
      if (typeof window != 'undefined') {
        window.removeEventListener("resize", this.updateHeight);
        window.document.body.style.overflow = 'auto';
      }
  }

  onMenuItemClick = (e, val) => {
    if (val === 'Profile') {
      this.setState(Object.assign({}, this.state, { profileFlag: true, passwordFlag: false, passwordValidationData: this.props.passwordValidationData }));
    }
    else if (val === 'Password') {
      this.setState(Object.assign({}, this.state, { passwordFlag: true, profileFlag: false, userData: this.props.userData }));
      console.log('onPasswordClick');
    }
  }
  render() {
    const {userData, userPassword, onSaveUserDataClick, onSavePasswordDataClick, onUserDataChange, onPasswordDataChange, passwordValidationData } = this.props;
    this.context.setTitle(title);
    return (
      <div id="analyticsReport" className={cx(s.root, flexbox.rowItem)} style={{ whiteSpace:'nowrap' }}>
        <Paper className={cx(s.listBox, "col-lg-2")} style={{ overflow:'auto', display:'inline-block', verticalAlign:'top', height: this.state.availableHeight, overflow:'auto', overflowX:'hidden', padding:'0.5em', paddingLeft:'0.3em',paddingTop:'1em' }}>
            <AnalyticsMenu styles={styles} />
        </Paper>
        <Paper className={cx(s.section)} style={{display: 'inline-block', width: '80%', verticalAlign: 'top', height: this.state.availableHeight, overflow:'auto', overflowX:'hidden' }}>
          {this.props.children}
        </Paper>
      </div>
    )
  }
}

export default withStyles(flexbox, s)(Analytics);
