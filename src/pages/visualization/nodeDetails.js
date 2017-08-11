import { default as React } from 'react';
import ss from './Visualization.css';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import JSONTree from 'react-json-tree'
const closeButton={
    position: 'fixed',
    fontSize: '15px',
    cursor: 'pointer',
    fontFamily: 'monospace',
    /* width: 15px; */
    zIndex: '100',
    borderRadius: '18px',
    color: '#757575',
    /* margin-left: -15px; */
    backgroundColor: 'cornflowerblue',
    color: 'wheat',
    padding: '1px 6px 1px 6px',
    boxShadow: '1px 1px 2px -2px black',
    right: '40px',
    top: '150px',
    width: '20px',
    textAlign: 'center'
}
    const nodeDetails={
    position: 'fixed',
    top: '130px',
    right: '10px',
    width: '300px',
    backgroundColor: 'white',
    height: '300px',
    overflowX: 'scroll',
    overflowY: 'scroll',
    zIndex: '100',
    boxShadow: '0px 0px 6px 0px',
    padding: '2% 3% 3% 2%',
    wordWrap: 'normal'
}

class NodeDetails extends React.Component {

    constructor(props) {
        super(props);
        this.theme = {
            scheme: 'monokai',
            author: 'wimer hazenberg (http://www.monokai.nl)',
            base00: '#272822',
            base01: '#383830',
            base02: '#49483e',
            base03: '#75715e',
            base04: '#a59f85',
            base05: '#f8f8f2',
            base06: '#f5f4f1',
            base07: '#f9f8f5',
            base08: '#f92672',
            base09: '#fd971f',
            base0A: '#f4bf75',
            base0B: '#a6e22e',
            base0C: '#a1efe4',
            base0D: '#FF0000',
            base0E: '#ae81ff',
            base0F: '#cc6633'
        }
        this.state = {
            nodeDetails: '',
            isVisible: false
        }
    }

    hideNodeDetails() {
        this.setState({ isVisible: false });
    }

    showNodeDetails(nodeJson) {
        this.setState({ isVisible: true, nodeDetails: nodeJson });
    }

    render() {
        let data = this.state.nodeDetails;
        if (!this.state.isVisible) {
            return (<div></div>)
        }
         return (
            <div style={nodeDetails}>
                <div style={closeButton} onClick={this.hideNodeDetails.bind(this)}>
                    <span>x</span>
                </div>
                <div className="jsondetails">
                    <JSONTree data={data} theme={{
                        extend: this.theme
                    }} />
                </div>
            </div>
        )
    }
}

export default (NodeDetails);
