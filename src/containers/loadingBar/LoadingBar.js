import React from 'react';
import { connect } from 'react-redux';
import spinnerImg from '../../public/loadingBarImage.gif';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './loadingBar.css'

class LoadingBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {showOverlay: false};
        this.timer = null;
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.loadingbar > 0) {
            if(this.timer){
                return;
            }
            this.timer = setTimeout(() => {
                this.setState({showOverlay: true})
            }, 400);
        }
        if(nextProps.loadingbar === 0){
            if(this.timer){
                clearTimeout(this.timer);
                this.timer = null;
            }
            this.setState({showOverlay: false});
        }
    }

    showSpinner(){
        return (
            <div className= {s.oveylay}>
                <img className={s.spinner} src={spinnerImg}/>
            </div>
        )
    }

    render() {
        if (this.state.showOverlay) {
            return (
                this.showSpinner()
            )
        }
        else {
            return(<div></div>)
        }
    }
}

function mapStateToProps (state){
    return {
        loadingbar: state.botworxLoadingBar
    };
}

export default withStyles (s)(connect(mapStateToProps)(LoadingBar))
