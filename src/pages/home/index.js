import React from 'react';
import Home from './Home';
import { connect } from 'react-redux';
import { navigate } from '../../actions/route'

const mapStateToProps = (state) => {
    return {
        mailId: state.auth.mailId,
    };
};

const mapDispatch = (dispatch) => ({
    onForgotPasswordClick: () => dispatch(navigate('/login/forgot')),
});
//export default ({ params, context }) => <Home />;
const HomePage = connect(mapStateToProps, mapDispatch)(Home);

export default function ({ params, context, query }) {
    const authfail = (query.authfail === "true");
    (function dispatchActions(dispatch) {
    }(context.store.dispatch));
    return <HomePage authfail={authfail} />;
}