import React from 'react';
import Paper from 'material-ui/Paper';
import cx from 'classnames';

const style = {
    paperStyle: {
        height: 100,
        width: '100%',
        textAlign: 'center',
        display: 'inline-block',
        margin: '0px 10px',
        fontWeight: 600
     },
    positive: {
        color: 'green',
        fontSize: '15px'
    },

    negative: {
        color: 'red',
        fontSize: '15px'
    },

    metricNumber: {
        color: '#bbb7b7',
        fontSize: '50px'
    },

    cursorStyle: {
        cursor: 'pointer'
    },

    NAStyle: {
        color: '#bbb7b7',
    }

};

const OnMetricClick = (clickable, metric, handleMetricClick) => {
    if(clickable) {
        handleMetricClick(metric);
    }
}




const SummaryMetric = ({metricData, clickable, handleMetricClick}) => {
    return(
         <div>
            <Paper style={style.paperStyle}>
                <div className="row">
                    {metricData.map((data, idx) => (
                        <SummaryData data={data} key={idx} clickable={clickable}
                            handleMetricClick={handleMetricClick} />
                    ))}
                </div>
            </Paper>
        </div>
    );
}

const SummaryData = ({data, clickable, handleMetricClick}) => {
    // let change = (typeof data.change != 'undefined'  && !isNaN(data.change)) ? ` (${data.change}%)` : '';
    // let change = 0;
    // if(typeof data.change != 'undefined') {
    //     if(!isNaN(data.change) && data.change != Infinity) {
    //         change = ` (${data.change}%)`;
    //     }
    //     else if(data.change == Infinity || isNaN(data.change)) {
    //         change = ` N/A`;
    //     } else {
    //         change = '';
    //     }
    // }
    let changeStyle = null;
    if(data.change == 'N/A' || data.change == 0) {
        changeStyle = style.NAStyle;
    }
    else if(data.change > 0) {
        changeStyle = style.positive;
    }
    else if(data.change < 0) {
        changeStyle = style.negative;
    }

    let change;
    if(data.change != undefined || data.change != Infinity) {
        if(!isNaN(data.change)) {
            change = ` (${data.change}%)`;
        }
        else if(data.change == 'N/A') {
            change = ` ${data.change}`
        } else{
            change = '';
        }
    } else {
        change = '';
    }
    let summaryStyle = clickable ? style.cursorStyle : null;
    return(
        <span className="col-lg" style={summaryStyle}
            onClick={() => {OnMetricClick(clickable, data.metric, handleMetricClick)}}>
            <div style={style.metricNumber}>
                {data.number}
            </div>

            <div>
                <span>{data.metric}</span>
                <span style={changeStyle}>{change}</span>
            </div>
        </span>
    );
}

export default SummaryMetric;
