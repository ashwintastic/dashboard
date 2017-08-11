import React, { PropTypes, Component } from 'react';

import cx from 'classnames';
import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import FbDeployIcon from 'material-ui/svg-icons/action/assignment-turned-in';
import FbRollbackIcon from 'material-ui/svg-icons/action/assignment-return';
import { green500, orange500 } from 'material-ui/styles/colors';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import CircularProgress from 'material-ui/CircularProgress';
import Dialog from 'material-ui/Dialog';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from 'material-ui/Table';

import s from './FbSubscribe.css';
import flexbox from '../../components/flexbox.css';

const title = 'BotWorx.Ai - Facebook Pages';
const fbLink = 'https://www.facebook.com/'

class FbUserPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageData: {}
    };

  }
  static propTypes = {
    pageList: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
        name: PropTypes.string.isRequired,
        category: PropTypes.string.isRequired
      })
    ),
    botId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    botName: PropTypes.string,
    DeployedPageList: PropTypes.array,
    onDeployBotClick: PropTypes.func,
    onRollbackBotClick: PropTypes.func
  };

  static contextTypes = { setTitle: PropTypes.func.isRequired };

  handleDeployClick = (page, allPlatformBots, botFlowId, accountBots) => {
    this.setState({ pageData: page });
    this.props.onDeployBotClick(page, allPlatformBots, botFlowId, accountBots);
  }

  render() {
    const { otherUserPageList, currentUserPageList, onDeployBotClick, onRollbackBotClick,
      botId, DeployedPageList, botName, deployStatus, loadProgressBarFlag, allPlatformBots, onYesClick, dialogstate, onCloseDialog, botFlowId,
      deployedPlatformBot, accountBots } = this.props;
    this.context.setTitle(title);
    const warningText = "This page is deployed with bot '"+ deployedPlatformBot +"'. Do you want to proceed with undeploy previous bot and create link with this bot?";
    const titleText = 'Warning';
    const actions = [
      <FlatButton
        label="Cancel"
        style={{ marginRight: 10 }}
        primary={true}
        onTouchTap={onCloseDialog}
      />,
      <FlatButton
        label="Deploy"
        primary={true}
        keyboardFocused={true}
        onTouchTap={() => onYesClick(this.state.pageData, botFlowId)}
      />,
    ];
    return (
      <div className={cx(s.root, flexbox.column)}>
        <Dialog
          title={titleText}
          actions={actions}
          style={{ width: 700, marginLeft: 300 }}
          modal={false}
          open={dialogstate}
          onRequestClose={onCloseDialog}
        >
          <div>
            {warningText}
          </div>
        </Dialog>
        <Paper className={s.section}>
          <h1 className={cx(s.headerelem)}>Bot publishing</h1>
          {(loadProgressBarFlag) ?
            <div style={{ 'display': 'inline-block' }}><br />
              <CircularProgress
                size={1}
                color={green500}
                thickness={7}
                style={{ 'marginLeft': '30px' }} />
            </div> : null}
          <br /><br />
          <Divider />
          <h3>{botName}</h3><br /><Divider /><br />
          {(otherUserPageList && otherUserPageList.length) ?
            <div>
              <Divider />
              <h4 className={flexbox.columnItem}>Other's Facebook Pages</h4>
              <Table>
                <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                  <TableRow>
                    <TableHeaderColumn>Page Name</TableHeaderColumn>
                    <TableHeaderColumn>Category</TableHeaderColumn>
                    <TableHeaderColumn>Deploy on Facebook</TableHeaderColumn>
                    <TableHeaderColumn>Status</TableHeaderColumn>
                  </TableRow>
                </TableHeader>

                <TableBody displayRowCheckbox={false}>
                  {otherUserPageList.map(
                    page => (
                      <TableRow key={page.id} data={page} selectable={false}>
                        <TableRowColumn>
                          <FBPageName pageInfo={page} />
                        </TableRowColumn>
                        <TableRowColumn>
                          {page.category}
                        </TableRowColumn>
                        <TableRowColumn className={cx(flexbox.row, s.actions)}>
                          {
                            (page.deployed === true) ?
                              <div>
                                <IconButton
                                  title="Deploy" disabled
                                  onClick={() => this.handleDeployClick(page, allPlatformBots, botFlowId, accountBots)}
                                  className={cx(flexbox.rowItem, s.action)}
                                >
                                  <FbDeployIcon color={green500} />
                                </IconButton>
                                <IconButton
                                  title="Rollback"
                                  onClick={() => onRollbackBotClick(page.access_token, page.id, botId)}
                                  className={cx(flexbox.rowItem, s.action)}
                                >
                                  <FbRollbackIcon color={orange500} />
                                </IconButton></div> :
                              <div>
                                <IconButton
                                  title="Deploy"
                                  onClick={() => this.handleDeployClick(page, allPlatformBots, botFlowId, accountBots)}
                                  className={cx(flexbox.rowItem, s.action)}
                                >
                                  <FbDeployIcon color={green500} />
                                </IconButton>

                                <IconButton
                                  title="Rollback" disabled
                                  onClick={() => onRollbackBotClick(page.access_token, page.id, botId)}
                                  className={cx(flexbox.rowItem, s.action)}
                                >
                                  <FbRollbackIcon color={orange500} />
                                </IconButton></div>
                          }
                        </TableRowColumn>
                        <TableRowColumn>
                          {
                            (page.deployed === true) ?
                              <div>Deployed by {
                                (page.deploymentDetails && page.deploymentDetails.user
                                  && page.deploymentDetails.user.name) || ""}</div> : 'Not Deployed'
                          }
                        </TableRowColumn>
                      </TableRow>
                    ))}
                </TableBody>
              </Table><Divider /><br /><br /><Divider /></div> : null}
          {(currentUserPageList && currentUserPageList.length) ?
            <div>
              <h4 className={flexbox.columnItem}>My Facebook Pages</h4>
              <Table>
                <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                  <TableRow>
                    <TableHeaderColumn>Page Name</TableHeaderColumn>
                    <TableHeaderColumn>Category</TableHeaderColumn>
                    <TableHeaderColumn>Deploy on Facebook</TableHeaderColumn>
                    <TableHeaderColumn>Status</TableHeaderColumn>
                  </TableRow>
                </TableHeader>

                <TableBody displayRowCheckbox={false}>
                  {currentUserPageList.map(
                    page => (
                      <TableRow key={page.id} selectable={false}>
                        <TableRowColumn>
                          <FBPageName pageInfo={page} />
                        </TableRowColumn>
                        <TableRowColumn>
                          {page.category}
                        </TableRowColumn>
                        <TableRowColumn className={cx(flexbox.row, s.actions)}>
                          {
                            (page.deployed === true) ?
                              <div>
                                <IconButton
                                  title="Deploy" disabled
                                  onClick={() => this.handleDeployClick(page, allPlatformBots, botFlowId, accountBots)}
                                  className={cx(flexbox.rowItem, s.action)}
                                >
                                  <FbDeployIcon color={green500} />
                                </IconButton>
                                <IconButton
                                  title="Rollback"
                                  onClick={() => onRollbackBotClick(page.access_token, page.id, botId)}
                                  className={cx(flexbox.rowItem, s.action)}
                                >
                                  <FbRollbackIcon color={orange500} />
                                </IconButton></div> :
                              <div>
                                <IconButton
                                  title="Deploy"
                                  onClick={() => this.handleDeployClick(page, allPlatformBots, botFlowId, accountBots)}
                                  className={cx(flexbox.rowItem, s.action)}
                                >
                                  <FbDeployIcon color={green500} />
                                </IconButton>

                                <IconButton
                                  title="Rollback" disabled
                                  onClick={() => onRollbackBotClick(page.access_token, page.id, botId)}
                                  className={cx(flexbox.rowItem, s.action)}
                                >
                                  <FbRollbackIcon color={orange500} />
                                </IconButton></div>
                          }
                        </TableRowColumn>
                        <TableRowColumn>
                          {
                            (page.deployed === true) ?
                              <div>Deployed {
                                (page.deploymentDetails && page.deploymentDetails.user
                                  && page.deploymentDetails.user.name)? "by "+ page.deploymentDetails.user.name : ""}</div> : 'Not Deployed'
                          }
                        </TableRowColumn>
                      </TableRow>
                    ))}
                </TableBody>
              </Table></div> : null}
        </Paper>
      </div>
    );
  }
}

function FBPageName(props) {
  const page = props.pageInfo;

  return <div>
    <img src={page.imageUrl} width="36" height="36" />&nbsp;&nbsp;
    <a href={`${fbLink}${page.name}-${page.id}`}
      target='_blank'
    ><span>{page.name + ' (' + page.id + ')'}</span></a></div>;
}

export default withStyles(flexbox, s)(FbUserPage);
