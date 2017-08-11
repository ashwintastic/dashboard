import React, { Component } from 'react';
import IconButton from 'material-ui/IconButton';
import { red500 } from 'material-ui/styles/colors';
import RemoveIcon from 'material-ui/svg-icons/action/delete';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';

class DeleteIcon extends Component {
    constructor(props) {
        super(props);
        this.props = props;

        let titleText = 'Delete';
        if (this.props.itemType) {
            titleText += ' ' + this.props.itemType;
        }

        let deleteText = 'Are you sure you want to delete?';
        if (this.props.deleteText) {
            deleteText = this.props.deleteText;
        } else {
            if (this.props.itemName) {
                deleteText = "Do you want to delete '" + this.props.itemName + "'?";
            }
        }

        this.state = {
            open: false,
            onDelete: this.props.onDelete,
            titleText: titleText,
            deleteText: deleteText
        };
    }

    state = {
        open: false,
        onDelete: null
    }

    handleOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    deleteAction = () => {
        if (this.state.onDelete) {
            this.state.onDelete();
        }
        this.handleClose();
    }

    render() {
        const actions = [
            <RaisedButton
                label="Cancel"
                onTouchTap={this.handleClose}
            />,
            <RaisedButton
                label="Delete"
                secondary={true}
                style={{ marginLeft: 10 }}
                onTouchTap={this.deleteAction}
            />
        ];
        return (
            <div style={{ display: 'inline-block', marginLeft: -12, marginTop: -2 }}>
                <Dialog
                    title={this.state.titleText}
                    actions={actions}
                    style={{ width: 700, marginLeft: 300 }}
                    modal={true}
                    open={this.state.open}
                >
                    {this.state.deleteText}
                </Dialog>

                <IconButton
                    onClick={() => this.handleOpen()}
                    title="Delete"
                    disabled={this.props.disabled}
                >
                    <RemoveIcon color={red500} />
                </IconButton>
            </div>
        );
    }
}

export default DeleteIcon;
