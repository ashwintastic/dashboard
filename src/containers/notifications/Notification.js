import React from 'react';
import { connect } from 'react-redux';
import NotificationSystem from 'react-notification-system'

function mapStateToProps (state){
    return {
        notification: state.notification
    };
}

class Notifications extends React.Component {

    _addNotification(info) {
        this._notificationSystem.addNotification({
            message: info.message.label,
            level: info.type,
            position: info.message.position,
            autoDismiss: info.message.autoDismiss
        })
    }

    componentDidMount() {
        this._notificationSystem = this.refs.notificationSystem;
    }

    componentWillReceiveProps(nextProps){
        this._addNotification(nextProps.notification)
    }

    shouldComponentUpdate(){
        return false;
    }

    render() {
        return(
            <div>
                <NotificationSystem ref="notificationSystem" />
            </div>
        )

    }
}

export default connect(mapStateToProps)(Notifications)


