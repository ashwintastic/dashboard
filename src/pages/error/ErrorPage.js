import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './ErrorPage.css';

function ErrorPage({ error, message }, context) {
    let title = 'Error';
    let content = 'Sorry, a critical error occurred on this page.';
    let errorMessage = error.message;

    switch (error.status) {
        case 404:
            title = 'Page Not Found';
            content = 'Sorry, the page you were trying to view does not exist.';
            break;
        case 401:
            title = 'Not Authorized';
            content = 'Sorry, you are not authorized to perform the given request.';
            break;
    }
    if (process.env.NODE_ENV !== 'production' && error.stack) {
        errorMessage = <pre>{error.stack}</pre>;
    }

    if (context.setTitle) {
        context.setTitle(title);
    }

    return (
        <div>
            <h1>{title}</h1>
            <p>{content}</p>
            {message}
            <br />
            {errorMessage}
        </div>
    );
}

ErrorPage.propTypes = { error: PropTypes.object.isRequired };
ErrorPage.propTypes = { message: PropTypes.string };
ErrorPage.contextTypes = { setTitle: PropTypes.func.isRequired };

export { ErrorPage as ErrorPageWithoutStyle };
export default withStyles(s)(ErrorPage);
