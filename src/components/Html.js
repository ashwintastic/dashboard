import React, { PropTypes } from 'react';
import { analytics } from '../config';

function Html({ title, description, style, scripts, children, state }) {
  return (
    <html className="no-js" lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="icon" href="favicon.ico" type="image/x-icon"/>
        <link rel="stylesheet" href="/c3/c3.min.css" />
        <link rel="stylesheet" href="/bootstrap3/css/bootstrap.min.css" />
        <link rel="stylesheet" href="/flexboxgrid/css/flexboxgrid.min.css" type="text/css" />
        <style id="css" dangerouslySetInnerHTML={{ __html: style }} />
      </head>
      <body>
        <div id="app" dangerouslySetInnerHTML={{ __html: children }} />
        {scripts && (
          <div>
            <script
              id="source"
              src={scripts.main.js}
              data-initial-state={JSON.stringify(state)}
            />
          </div>

        )}
        {analytics.google.trackingId &&
          <script
            dangerouslySetInnerHTML={{ __html:
            'window.ga=function(){ga.q.push(arguments)};ga.q=[];ga.l=+new Date;' +
            `ga('create','${analytics.google.trackingId}','auto');ga('send','pageview')` }}
          />
        }
        {analytics.google.trackingId &&
          <script src="https://www.google-analytics.com/analytics.js" async defer />
        }
      </body>
    </html>
  );
}

Html.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  style: PropTypes.string.isRequired,
  scripts: PropTypes.arrayOf(PropTypes.string.isRequired),
  children: PropTypes.string,
  state: PropTypes.object.isRequired,
};

export default Html;
