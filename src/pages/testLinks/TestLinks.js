import React, { PropTypes, Component } from 'react';

import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';

// by MenuItem
import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';
import RaisedButton from 'material-ui/RaisedButton';
import RemoveIcon from 'material-ui/svg-icons/action/delete';
import EditIcon from 'material-ui/svg-icons/image/edit';
import CloneIcon from 'material-ui/svg-icons/content/content-copy';
import LinkIcon from 'material-ui/svg-icons/content/link';
import Toggle from 'material-ui/Toggle';
import { blue500, red500, green500 } from 'material-ui/styles/colors';
import CreateFlowIcon from 'material-ui/svg-icons/content/add-box';
import RevertFlowIcon from 'material-ui/svg-icons/action/settings-backup-restore';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';
import Divider from 'material-ui/Divider';

import s from './testLinks.css';
import flexbox from '../../components/flexbox.css';

import { auth } from '../../config';

// by MenuItem
const title = 'BotWorx.Ai - Accounts';
class TestLinks extends Component{

  constructor(props) {
    super(props);
    this.state = {
      nextPropsArrived: false
    };
  }

  componentWillReceiveProps(nextProps){
    this.setState({nextPropsArrived: true});
  }


  render() {
    if(!this.state.nextPropsArrived){
      return(<div></div>)
    }
    const {
        testLinks, testerEmails, flowId, botId, testerIds,
        onModalSubmit, openModalFlag, onModalFlagChange, userRole, onTestDialogClose, onTestLinkFlow,
        onTesterIdsEntry, testLinkDialogFlag, setLink, pageOrigin, testLinkEmailSent, onDeactivateTestLink,
        onTesterSelected, selectedTester, onDeleteTester, userTyping,
        platformBots, selPlatformBot, onPlatformBotSelected, showPlatformBots, flow, getTestPageName,
        onShowTestLink, showTestLinkDialogFlag, currTestLink, onShowLinkDialogClose,
        testersValidationText, copyToClipboard
    } = this.props;
    document.title = title;
  const actionsTestLink = [
    <FlatButton
            label='Close'
            primary={true}
            onTouchTap={() => onShowLinkDialogClose()}
        />
  ];
  const textBoxStyle = {
    width: '50%',
    marginRight: '2em'
  };

  const delTesterDivStyle = {
    verticalAlign: 'top',
    whiteSpace: 'nowrap'
  };

  const delTesterDDStyle = {
    marginRight: '2em'
  };
  const leftMarginStyle = {
    marginLeft: '2em'
  };
  const actionBtnTxtStyle = {
    fontSize: '1em',
    textTransform: 'none'
  };
  const actionBtnStyle = {
    width: '5em'
  };
  const actionsColStyle = {
    textAlign: 'left'
  };
  const hiddenElStyle = {
    width: '1px',
    height: '1px',
    position: 'absolute',
    left: '-1000px'
  };

  return (
        <div className={cx(s.root, flexbox.fullHeight, flexbox.column)}>
            <Dialog
                title='Test link for'
                actions={actionsTestLink}
                modal={false}
                open={showTestLinkDialogFlag}
                onRequestClose={() => onShowLinkDialogClose()}
            >
                <div style={leftMarginStyle}>
                    Flow - <b>{currTestLink.flowId}</b><br />
                    Tester - <b>{currTestLink.testerEmail}</b><br />
                    Page - <b>{currTestLink.platformBotName}</b>
                </div>
                <p></p>
                <div><a>{currTestLink.url}</a><textarea id='testLinkUrl' style={hiddenElStyle}>{currTestLink.url}</textarea>
                    &nbsp;&nbsp;<RaisedButton
                        style={actionBtnTxtStyle}
                        label='Copy to Clipboard'
                        onTouchTap={() => copyToClipboard()}>
                    </RaisedButton></div>
            </Dialog>

            <Paper className={cx(s.section, flexbox.columnItem)}>
                <h2 className={cx(s.headerelem)}>Testers for Flow '{flow.description}'</h2>
                {(userRole === 'BotEditor') ? null :
                    <div className={cx(flexbox.column, s.container)}>
                        <div className={cx(flexbox.columnItem, flexbox.row, s.formRow)}>
                            <TextField
                                className={cx(flexbox.rowItem, flexbox.withHorzMargin, s.selectBot)}
                                onChange={onTesterIdsEntry}
                                hintText='Enter Tester e-mail Ids (comma-separated)' value={testerIds}
                                errorText={testersValidationText}
                                type='email'></TextField>

                            {(showPlatformBots) ?
                                <SelectField value={selPlatformBot}
                                    onChange={onPlatformBotSelected}>
                      {platformBots.map(f => (<MenuItem value={f.pageid} primaryText={f.name}/>))}
                      <MenuItem value={auth.facebook.testPageId} primaryText='Botworx Test Page'/>
                                </SelectField> : ''
                            }
                            <RaisedButton
                                className={cx(flexbox.rowItem, flexbox.withHorzMargin, s.createButton)}
                                label='Create' primary
                                onTouchTap={() => onTestLinkFlow(botId, flowId, testerIds, selPlatformBot, testLinks)}>
                            </RaisedButton>

                  {(testLinkEmailSent && !userTyping) ?
                    <span style={leftMarginStyle}>Email has been sent to '{testerIds}'</span> : ''}
                        </div>
                        <div className={cx(flexbox.columnItem, flexbox.row, s.formRow)}>
                  <SelectField style={delTesterDDStyle} value={selectedTester} hintText='Testers'
                               floatingLabelFixed={true} onChange={onTesterSelected}>
                    <MenuItem value={null} primaryText=''/>
                    {testerEmails.map(f => (<MenuItem value={f} primaryText={f}/>
                                ))}
                            </SelectField>
                            <RaisedButton
                                primary
                                label='Delete Tester'
                                onTouchTap={() => onDeleteTester(selectedTester, botId, flowId)}>
                            </RaisedButton>
                        </div>
                    </div>
                }
                <Table>
                    <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                        <TableRow>
                            <TableHeaderColumn>Tester E-mail</TableHeaderColumn>
                            <TableHeaderColumn>Page</TableHeaderColumn>
                            <TableHeaderColumn>Tester Status</TableHeaderColumn>
                            <TableHeaderColumn>Expire Time</TableHeaderColumn>
                            <TableHeaderColumn>Actions</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    {(testLinks.length) ? 
                    <TableBody displayRowCheckbox={false}>
                        {testLinks.map(f => (
                            <TableRow selectable={false} key={f.id}>
                                <TableRowColumn>{f.testerEmail}</TableRowColumn>
                                <TableRowColumn>{f.platformBotName}</TableRowColumn>
                                <TableRowColumn>{f.status}</TableRowColumn>
                                <TableRowColumn>{(f.status === 'active') ? '' : f.expiry}</TableRowColumn>
                                <TableRowColumn style={actionsColStyle}>
                                    <RaisedButton
                                        label={(f.status === 'deactivated' || f.status === 'expired') ? 'Activate' : 'Deactivate'}
                                        primary={(f.status === 'deactivated' || f.status === 'expired')}
                                        secondary={(f.status !== 'deactivated')}
                                        style={actionBtnStyle}
                                        labelStyle={actionBtnTxtStyle}
                                        onTouchTap={() => onDeactivateTestLink(f.id, f.status, flowId, botId)}>
                                    </RaisedButton>&nbsp;
                                    {(f.status === 'deactivated' || f.status === 'expired') ?
                                        null : <RaisedButton label='Show Link'
                                            style={actionBtnStyle}
                                            labelStyle={actionBtnTxtStyle}
                                            onTouchTap={() => onShowTestLink(f)}>
                                        </RaisedButton>
                                    }
                                </TableRowColumn>
                            </TableRow>
                        ))}
                    </TableBody>:
                    <TableBody displayRowCheckbox={false}>
                      <TableRow selectable={false} key={1}>
                        <TableRowColumn className={s.noresultmsg}>{'No tester found'}</TableRowColumn>
                      </TableRow>
                    </TableBody>}
                </Table><br /><Divider />
            </Paper>
        </div>
    );
  }
}

TestLinks.propTypes = {
  flowId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  botId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  testLinks: PropTypes.array,
  testers: PropTypes.array,
  userRole: PropTypes.string
};

TestLinks.defaultProps = {
  testLinks: [],
  testerIds: '',
  testers: [],
  userTyping: false
};

TestLinks.contextTypes = { setTitle: PropTypes.func.isRequired };

export default withStyles(flexbox, s)(TestLinks);
