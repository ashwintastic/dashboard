import { default as React , PropTypes } from 'react';
const vis = require('vis');
const uuid = require('uuid');
import NodeDetails from './nodeDetails';
import ss from './Visualization.css';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {
    sendDataToStore,
} from '../../actions/visualization';
import VisulizationData from '../../utils/visualization';

const visOptions = {
    layout: {
        randomSeed: 1,
    },
    interaction: {
        dragNodes: true,
        dragView: true,
        hideEdgesOnDrag: false,
        hideNodesOnDrag: false,
        hover: false,
        hoverConnectedEdges: true,
        keyboard: {
            enabled: true,
            speed: { x: 10, y: 10, zoom: 0.02 },
            bindToWindow: true
        },
        multiselect: true,
        navigationButtons: true,
        selectable: true,
        selectConnectedEdges: true,
        tooltipDelay: 300,
        zoomView: true
    },
    edges: {
        color: {
            color: '#000000',
            highlight: 'red'
        },
        arrows: {
            to: { enabled: true, scaleFactor: 0.5, type: 'arrow' },
        },
        width: 0.5,
        length: 1,
    },
    nodes: {
        borderWidth: 1,
    },

    physics: {
        enabled: true,
        barnesHut: {
            gravitationalConstant: -2000,
            centralGravity: 0.3,
            springLength: 95,
            springConstant: 0.02,
            damping: 0.09,
            avoidOverlap: 0
        },

    }
};

class Visualization extends React.Component {

    constructor(props) {
        super(props);
        const {identifier} = this.props;
        this.updateGraph = this.updateGraph.bind(this);
        this.data = null,
        this.visNetwork = null;
        this.state = {
            hierarchicalLayout: true,
            identifier: identifier ? identifier : 'vis-flow-canvas'
        };
    }

    componentDidMount() {
        this.nodeDeatilsInstance = this.refs.nodeDetails;
        this.updateGraph();
    }

    componentDidUpdate() {
        this.props.sendDataToStore(this.props.graph)
        this.updateGraph();
    }

    graphEventListener(networkInstance,visData) {
        networkInstance.addEventListener('click', (params) => {
            this.visNetwork.stopSimulation();
            if (!(params && params.nodes.length)) {
                return;
            }
            const nodeId = params.nodes[0];
            const nodeJson = visData.nodeList.find(x => x.id === nodeId).nodeData;
            this.nodeDeatilsInstance.showNodeDetails(nodeJson);
        });
    }

    updateGraph() {
        let container = document.getElementById(this.state.identifier);
        const visData = new VisulizationData(this.props.flowJson);
       // console.log("visData",visData)
        this.visNetwork = new vis.Network(container, {nodes: visData.nodeList, edges: visData.nodeEdges}, visOptions);
        this.visNetwork.once('initRedraw', () => {
            var d = this.visNetwork.DOMtoCanvas({ x: 150, y: 150 });
            this.visNetwork.moveNode(this.props.flowJson.initialNode, d.x, d.y);
        })
        this.graphEventListener(this.visNetwork,visData);
    }
    render() {
        const {identifier} = this.state;

        return (
            <div className={ss.canvasSizeRenderer}>
                <NodeDetails ref='nodeDetails' />
                <div id={identifier}
                     className={ss.canvasSizeRenderer}>
                </div>
            </div >
        )
    }
}

function mapStateToProps()
{
    return {}
};
export default withStyles(ss)(connect(mapStateToProps, mapDispatchToProps)(Visualization))

function mapDispatchToProps(dispatch) {
    return bindActionCreators({sendDataToStore: sendDataToStore}, dispatch)
}

Visualization.PropTypes = {
    flowJson: PropTypes.object,
    graph: PropTypes.object
};

Visualization.defaultProps = {
    flowJson: {},
    graph: {}
};
