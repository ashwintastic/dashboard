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
import { FLOW_VALIDATION_ERROR } from '../../noticationMessages/messages'

const title = 'BotWorx.Ai - Accounts';
// by MenuItem

class FlowValidate extends Component {

  constructor(props) {
    super(props);
    this.state = {
      nextPropsArrived: false
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ nextPropsArrived: true });
  }

  render() {
    if (!this.state.nextPropsArrived) {
      return (<div></div>)
    }
    const {
      flows,
      flowId,
      botId,
      flowJson,
      editorOptions,
      botFlowId,
      testerIds,
      onFetchFlow,
      onModalSubmit,
      openModalFlag,
      onModalFlagChange,
      onFlowDataChange,
      onSaveFlow,
      userRole,
      onTestDialogClose,
      onCreateTestLinkFlow,
      onTestLinkFlow,
      onTesterIdsEntry,
      testLinkDialogFlag,
      setLink,
      pageOrigin,
      flowPerms,
      accountId,
      schemaRefs,
      onFlowAddEditClose,
    } = this.props;
    document.title = title;
    var url = pageOrigin;
    var flowSchema = schemaRefs['flow.json'];
    if (!flowSchema) {
      return;
    }

    return (
      <div>
        <div>
          <div style={{ textAlign: 'right', marginBottom: '1em' }}>
            <RaisedButton
              className={(s.flowButton)}
              label="Cancel"
              primary
              style={{ marginTop: 0 }}
              onClick={() => onFlowAddEditClose(accountId, botId)}
            />
            <RaisedButton
              className={(s.flowButton)}
              label="Save"
              primary
              style={{ marginTop: 0, marginRight: 20 }}
              onClick={() => onSaveFlow(accountId)}
            />
          </div>
          <Paper className={cx(s.section, flexbox.columnItem, s.flowalignment)}>
            <JsonEditor
              jsonData={flowJson}
              schema={flowSchema}
              options={{ refs: schemaRefs }}
              displayRequired={true}
              onDataChange={onFlowDataChange}
            />
          </Paper>
          <div style={{ textAlign: 'right', marginBottom: '1em' }}>
            <RaisedButton
              className={(s.flowButton)}
              label="Cancel"
              primary
              style={{ marginTop: 0 }}
              onClick={() => onFlowAddEditClose(accountId, botId)}
            />
            <RaisedButton
              className={(s.flowButton)}
              label="Save"
              primary
              style={{ marginTop: 0, marginRight: 20 }}
              onClick={() => onSaveFlow(accountId)}
            />
          </div>
        </div>
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
  onFetchFlow: PropTypes.func,
  onSaveFlow: PropTypes.func,
  onFlowDataChange: PropTypes.func,
  onModalFlagChange: PropTypes.func,
  onModalSubmit: PropTypes.func,
  openModalFlag: PropTypes.bool,
  userRole: PropTypes.string
};

FlowValidate.defaultProps = {
  flows: [],
  flowJson: {},
  flowSchema: {},
  testerIds: ''
};

FlowValidate.contextTypes = { setTitle: PropTypes.func.isRequired };

export default withStyles(flexbox, s)(FlowValidate);
