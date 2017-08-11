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
import s from './Flow.css';
import flexbox from '../../components/flexbox.css';
import JsonEditor from '../../components/JsonEditor';
import DeleteIcon from '../../components/DeleteIcon/DeleteIcon';

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
      onMakeFlowLive,
      onRevertFlow,
      onFlowChange,
      onModalSubmit,
      openModalFlag,
      onModalFlagChange,
      onFlowDataChange,
      onSaveFlow,
      onCreateFlow,
      onDeleteFlow,
      onCloneFlow,
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
      flowCreationFlag,
      onEditFlowClick
    } = this.props;
    document.title = title;
    var url = pageOrigin;
    var flowSchema = schemaRefs['flow.json'];

    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={() => onModalFlagChange(botId)}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        keyboardFocused={true}
        onTouchTap={onModalSubmit}
      />,
    ];
    const actionsTestLink = [
      <FlatButton
        label="Close"
        primary={true}
        onTouchTap={() => onTestDialogClose(false)}
      />
    ];


    return (
      <div>
        <div className={cx(s.root, flexbox.fullHeight, flexbox.column)}>
          <Dialog
            title="Set Live Flow"
            actions={actions}
            modal={false}
            open={openModalFlag}
            style={{ width: 700, marginLeft: 300 }}
            onRequestClose={() => onModalFlagChange(botId)}
          >
            Are you sure to set current Flow as Live Flow?
        </Dialog>
          <Dialog
            title="Create Test link"
            actions={actionsTestLink}
            modal={false}
            open={testLinkDialogFlag}
            onRequestClose={() => onTestDialogClose()}
          >
            <TextField onChange={onTesterIdsEntry} hintText="Add Tester Ids" value={testerIds} type="email" />&nbsp;
              <RaisedButton label="Create Test Link" onTouchTap={() => onTestLinkFlow(botId, flowId, testerIds)} />
            <br /><br />
            <a href={url + '/testing/' + setLink} target='_blank'>{url}/testing/{setLink}</a>
            <br /><br />Use the url above to test your flow.
        </Dialog>
          <Paper className={cx(s.section, flexbox.columnItem)}>
            <h2 className={cx(s.headerelem)}>Flows</h2>
            {(flowPerms && flowPerms.length && (flowPerms.includes('createFlow') || flowPerms.includes('*'))) ?
              <IconButton title="Create New Flow" onClick={() => onCreateFlow(accountId, botId)}>
                <CreateFlowIcon
                  color={green500}
                  hoverColor={blue500}
                  className={cx(s.createFlow)}
                />
              </IconButton>
              : null}
            {(flowPerms && flowPerms.length && (flowPerms.includes('revertFlow') || flowPerms.includes('*'))) ?
              <IconButton title="Revert Flow" onClick={() => onRevertFlow(botId)}>
                <RevertFlowIcon
                  color={green500}
                  hoverColor={blue500}
                  className={cx(s.createFlow)}
                />
              </IconButton> : null}
            <Table>
              <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                <TableRow>
                  <TableHeaderColumn>Flow Name</TableHeaderColumn>
                  <TableHeaderColumn>Flow Status</TableHeaderColumn>
                  <TableHeaderColumn>Actions</TableHeaderColumn>
                </TableRow>
              </TableHeader>
              {(flows.length) ?

                <TableBody displayRowCheckbox={false}>
                  {flows.map(f => (
                    <TableRow selectable={false} key={f.id}>
                      <TableRowColumn>{f.name + ' (' + f.id + ')'}</TableRowColumn>
                      {((f.allows.indexOf('activateFlow') !== -1) || (f.allows.indexOf('*') !== -1)) ?
                        <TableRowColumn>
                          {botFlowId === f.id ?
                            <p style={{ fontWeight: 'bold', margin: 20 }}>Active</p> :
                            <Toggle
                              label="InActive"
                              toggled={botFlowId === f.id ? true : false}
                              onToggle={() => onMakeFlowLive(botId, f.id)}
                              labelPosition="right"
                              style={{ margin: 20 }}
                            />
                          }
                        </TableRowColumn> : <TableRowColumn>
                          {botFlowId === f.id ?
                            <p style={{ fontWeight: 'bold', margin: 20 }}>Active</p> :
                            <p style={{ fontWeight: 'bold', margin: 20 }}>InActive</p>
                          }
                        </TableRowColumn>}
                      <TableRowColumn className={cx(flexbox.row, s.actions)}>
                        {(botFlowId === f.id) ?
                          <div>
                            {((f.allows.indexOf('editLiveFlow') !== -1) || (f.allows.indexOf('*') !== -1)) ?
                              <IconButton
                                title="Edit"
                                onClick={() => onEditFlowClick(accountId, botId, f.id)}
                                className={cx(flexbox.rowItem, s.action)}
                              >
                                <EditIcon color={green500} />
                              </IconButton>
                              :
                              <IconButton
                                title="Edit"
                                disabled
                                className={cx(flexbox.rowItem, s.action)}
                              >
                                <EditIcon color={green500} />
                              </IconButton>
                            }</div> : <div>
                            {((f.allows.indexOf('editNonLiveFlow') !== -1) || (f.allows.indexOf('*') !== -1)) ?
                              <IconButton
                                title="Edit"
                                onClick={() => onEditFlowClick(accountId, botId, f.id)}
                                className={cx(flexbox.rowItem, s.action)}
                              >
                                <EditIcon color={green500} />
                              </IconButton>
                              :
                              <IconButton
                                title="Edit"
                                disabled
                                className={cx(flexbox.rowItem, s.action)}
                              >
                                <EditIcon color={green500} />
                              </IconButton>
                            }</div>}
                        <Link
                          to={`/accounts/${accountId}/bots/${botId}/flows/${f.id}/visualization`}
                          title="Visualize"
                          className={cx(flexbox.rowItem, s.action)}
                        >
                          <VisibilityIcon color={blue800} />
                        </Link>
                        {((f.allows.indexOf('cloneFlow') !== -1) || (f.allows.indexOf('*') !== -1)) ?
                          <IconButton
                            onClick={() => onCloneFlow(botId, f.id)}
                            title="Clone"
                            className={cx(flexbox.rowItem, s.action)}
                            style={{ marginLeft: -10 }}
                          >
                            <CloneIcon color={green800} />
                          </IconButton> : null}
                        {((f.allows.indexOf('viewTesters') !== -1) || (f.allows.indexOf('*') !== -1)) ?
                          <div>
                            <Link
                              to={`/accounts/${accountId}/bots/${botId}/flows/${f.id}/testlinks`}
                              title="View Testers"
                              className={cx(flexbox.rowItem, s.action)}
                            >
                              <LinkIcon color={blue500} />
                            </Link>
                          </div> : null}
                        {((f.allows.indexOf('deleteFlow') !== -1) || (f.allows.indexOf('*') !== -1)) ?
                          <div>
                            <DeleteIcon
                              onDelete={() => {
                                return onDeleteFlow(botId, f.id);
                              }}
                              itemType='Flow'
                              itemName={`${f.name} (${f.id})`}
                              disabled={botFlowId === f.id}
                            />
                          </div> : null}
                      </TableRowColumn>
                    </TableRow>
                  ))}
                </TableBody> :
                <TableBody displayRowCheckbox={false}>
                  <TableRow>
                    <TableRowColumn className={s.noresultmsg}> No Flow Found </TableRowColumn>
                  </TableRow>
                </TableBody>}
            </Table><br /><Divider />
          </Paper>

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
  onFlowChange: PropTypes.func,
  onEditFlowClick: PropTypes.func,
  onSaveFlow: PropTypes.func,
  onFlowDataChange: PropTypes.func,
  onModalFlagChange: PropTypes.func,
  onModalSubmit: PropTypes.func,
  onMakeFlowLive: PropTypes.func,
  onRevertFlow: PropTypes.func,
  onCreateFlow: PropTypes.func,
  onDeleteFlow: PropTypes.func,
  onCloneFlow: PropTypes.func,
  openModalFlag: PropTypes.bool,
  userRole: PropTypes.string,
  flowCreationFlag: PropTypes.bool
};

FlowValidate.defaultProps = {
  flows: [],
  flowJson: {},
  flowSchema: {},
  testerIds: ''
};

FlowValidate.contextTypes = { setTitle: PropTypes.func.isRequired };

export default withStyles(flexbox, s)(FlowValidate);
