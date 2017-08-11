/**
 * Created by root on 2/3/17.
 */
import React, { PropTypes, Component } from 'react';
import cx from 'classnames';
import s from './PollsList.css';
import flexbox from '../../components/flexbox.css';
import IconButton from 'material-ui/IconButton';
import TestIcon from 'material-ui/svg-icons/content/link';
import SubscriptionIcon from 'material-ui/svg-icons/communication/message';
import EditIcon from 'material-ui/svg-icons/image/edit';
import { blue500, green500, indigo500, green900 } from 'material-ui/styles/colors';
import DeleteIcon from '../../components/DeleteIcon/DeleteIcon';
import PollSummaryIcon from 'material-ui/svg-icons/device/dvr';
import { host } from '../../config';


export function EditPollIcon(props) {
  const onEditClick = props.onEditClick;
  const pollId = props.pollId;
  const botId = props.botId;
  const accountId = props.accountId;

  return <IconButton
    onClick={() => onEditClick(pollId, botId, accountId)}
    title="Edit"
    className={cx(flexbox.rowItem, s.action)}
  >
    <EditIcon color={green500} />
  </IconButton>;

}

export function DeletePollIcon(props) {
  const onDeleteClick = props.onDeleteClick;
  const pollId = props.pollId;
  const botId = props.botId;
  const pollName = props.pollName;
  const pollType = props.pollType;
  return <DeleteIcon
    onDelete={() => { return onDeleteClick(botId, pollId, pollType); }}
    itemType='Poll'
    itemName={`${pollName} (${pollId})`}
  />
}

export function BroadcastPollIcon(props) {
  const onBroadcastPollClick = props.onBroadcastPollClick;
  const pollId = props.pollId;
  const pollName = props.pollName;

  return <IconButton
    onClick={() => onBroadcastPollClick(pollId, pollName, props.pollEndDate)}
    title="Add Wrapup Broadcast"
    className={cx(flexbox.rowItem, s.action)}
    style={{ marginLeft: -10, marginTop: 8 }}
  >
    <SubscriptionIcon color={indigo500} />
  </IconButton>;
}

export function TestPollIcon(props) {
  const pollId = props.pollId;

  return <a href={`/pollTesting/${pollId}`}
    className={cx(flexbox.rowItem, s.action)}
    title="Test Poll"
    target="_blank"
  >  <TestIcon color={blue500} style={{ marginTop: 4, marginLeft: -4 }} /></a>;
}

export function SummaryIcon(props) {
  const pollId = props.pollId;

  return <a href={`/poll_summary/?pollid=${pollId}&viewcount=true`}
    className={cx(flexbox.rowItem, s.action)}
    title="Get Poll Summary"
    target="_blank"
  >  <PollSummaryIcon color={green900} style={{ marginTop: 6, marginRight: 5 }} /></a>;
}
