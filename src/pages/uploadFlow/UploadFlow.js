import React, { PropTypes, Component } from 'react';

import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';

// by MenuItem
import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';
import RaisedButton from 'material-ui/RaisedButton';
import RemoveIcon from 'material-ui/svg-icons/action/delete';
import VisibilityIcon from 'material-ui/svg-icons/action/visibility';
import EditIcon from 'material-ui/svg-icons/image/edit';
import CloneIcon from 'material-ui/svg-icons/content/content-copy';
import LinkIcon from 'material-ui/svg-icons/content/link';
import Toggle from 'material-ui/Toggle';
import { blue500, red500, green500, green800, blue800 } from 'material-ui/styles/colors';
import CreateFlowIcon from 'material-ui/svg-icons/content/add-box';
import RevertFlowIcon from 'material-ui/svg-icons/action/settings-backup-restore';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Divider from 'material-ui/Divider';
import TextField from 'material-ui/TextField';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

import Link from '../../components/Link';
import s from '../flow/Flow.css';
import flexbox from '../../components/flexbox.css';
import JsonEditor from '../../components/JsonEditor';
import DeleteIcon from '../../components/DeleteIcon/DeleteIcon';
import { ERROR_MESSAGE } from '../../noticationMessages/messages'

const title = 'BotWorx.Ai - Accounts';
// by MenuItem

class FlowValidate extends Component {

  constructor(props) {
    super(props);
    console.log('flow prop', props);
    this.state = {
      flowStr: null
    }
  }

  handleChange = (evt) => {
    console.log('flow changed');
    this.setState({ flowStr: evt.target.value });
  }

  render() {
    const {
      flows,
      flowId,
      botId,
      flowJson,
      editorOptions,
      botFlowId,
      onFetchFlow,
      onFlowChange,
      onModalSubmit,
      openModalFlag,
      onModalFlagChange,
      onFlowDataChange,
      onSaveFlow,
      userRole,
      setLink,
      pageOrigin,
      flowPerms,
      accountId,
      schemaRefs,
      flowCreationFlag,
      onFlowAddEditClose,
    } = this.props;

    var url = pageOrigin;

    if (!flowJson) {
      return null;
    }
    return (
      <div>
        <textarea
          value={this.state.flowStr}
          onChange={this.handleChange}
          style={{ width: 800, height: 300 }}>
        </textarea>
        <br />
        <RaisedButton
          className={(s.flowButton)}
          label="Save"
          primary
          style={{ margin: 10 }}
          onClick={() => onSaveFlow(accountId, JSON.parse(this.state.flowStr))}
        />
        <br />
        <pre style={{ width: 800, height: 400 }}>{JSON.stringify(flowJson, null, '\t')}</pre>
      </div>
    );
  }
}

FlowValidate.propTypes = {
  flows: PropTypes.array,
  flowId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  botFlowId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  botId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  editorOptions: PropTypes.object,
  flowJson: PropTypes.object,
  schemaRefs: PropTypes.object,
  onFlowChange: PropTypes.func,
  onFetchFlow: PropTypes.func,
  onSaveFlow: PropTypes.func,
  onFlowDataChange: PropTypes.func,
  userRole: PropTypes.string,
};

FlowValidate.defaultProps = {
  flows: [],
  flowJson: {},
  flowSchema: {},
  testerIds: ''
};

FlowValidate.contextTypes = { setTitle: PropTypes.func.isRequired };

export default withStyles(flexbox, s)(FlowValidate);
