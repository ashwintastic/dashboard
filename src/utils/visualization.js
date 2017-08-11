class Visualization
{
    constructor(flow){
        this.nodeList = [];
        this.nodeEdges = [];
        this.urlList = [];
        this.urlEdges = [];
        this.generateVisNodes(flow);
    }

    generateVisNodes(flow){
        if(!flow || !flow.nodes){
            return;
        }
        const flowNodes = flow.nodes;
        this.createNodes(flow);
        for (const nodeName of Object.keys(flowNodes)) {
            const flowNode = flowNodes[nodeName];
            if (flowNode.type === 'conditional') {
                this.conditionalNodesBuilder(flowNode, nodeName)
            }
            else {
                this.messageActionCreator(flowNode.messages,nodeName);
            }
        }
    }

    createNodes(flow) {
        let initialNode = flow.initialNode;

        for (let key in flow.nodes) {
            const node = flow.nodes[key];
            const visnode = { nodeData: flow.nodes[key] };
            if (key === initialNode) {
                this.nodeList.push({ ...visnode, "id": key, "label": key, shape: "box", color: "#F39A18", x: 0, y: 0, physics: false, fixed: true })
            } else if (node && node.type === 'conditional') {
                this.nodeList.push({ ...visnode, "id": key, "label": key, shape: "box", color: "lightgreen" })
            } else {
                this.nodeList.push({ ...visnode, "id": key, "label": key, shape: "box" })
            }
        }
    }

    messageActionCreator(messages,keys) {
        if (!messages) {
            return;
        }
        // TODO support older format till flow is fixed
        const messagesArr = Array.isArray(messages) ? messages : [messages];
        for (const message of messagesArr) {
            if (!message.data) {
                continue;
            }
            switch (message.data.type) {
                case 'text':
                case 'image':
                    this.actionBuilder(keys, message.actions);
                    break;
                case 'gallery':
                    this.galleryNodesBuilder(message, keys);
                    if(keys=='QUOTE_ONE')
                        break;
                default:
                    break;
            }
            //Handling the case where messages have their own actions.
            // Length==0 to avoid node replication with this.actionBuilder(keys, message.actions);
            if((Object.keys(message.data).length==0) && (message.actions)) {
                this.messageActionBuilder(message,keys)
            }
        }
    }

    messageActionBuilder(message,keys){
        let messageActions = message.actions;
        for (const messageAction of messageActions) {
            if (messageAction.nextNodes) {
                const messageActionId = keys + "#" + messageAction.label + "#" + messageAction.nextNodes[0];
                this.actionNodesPush(messageActionId, messageAction.label, messageAction)
                this.nodeEdges.push({ "from": keys, "to": messageActionId }, {
                    "from": messageActionId,
                    "to": messageAction.nextNodes[0]
                })
            }
        }
    }

    addWeightToEdge(actionListAction, keys, label) {
        let actionNodeId = keys + "#" + label
        this.actionNodesPush(actionNodeId, label, actionListAction)
        this.nodeEdges.push({ "from": keys, "to": actionNodeId })
        let weight = 1;
        for (var nextNode of actionListAction.nextNodes) {
            this.nodeEdges.push({
                "from": actionNodeId,
                "to": nextNode,
                label: weight
            })
            weight++;
        }
    }

    addActionNodesAndEdges(actionListAction, keys, label) {
        let actionNodeId = keys + "#" + label + "#" + actionListAction.nextNodes[0]
        this.actionNodesPush(actionNodeId, label, actionListAction)
        //pushing action edges
        this.nodeEdges.push({ "from": keys, "to": actionNodeId }, {
            "from": actionNodeId,
            "to": actionListAction.nextNodes[0]
        })
    }

    createEdges(actionListAction, keys, label) {
        if(actionListAction.nextNodes){
            if (actionListAction.nextNodes.length > 1) {
                this.addWeightToEdge(actionListAction, keys, label)
            }
            else {
                this.addActionNodesAndEdges(actionListAction, keys, label)
            }
        }
    }

    actionBuilder(keys, actions) {
        if(!actions){
            return;
        }
        for (const action of actions) {
            const label = Array.isArray(action.label)
                ? action.label.join('/')
                : action.label;
            this.createEdges(action, keys, label)
        }
    }

    galleryNodesBuilder(message, keys) {
        if(message.actions){
            this.messageActionBuilder(message,keys)
        }
        if(message.data.actions){
            this.messageActionBuilder(message.data,keys)
        }
        if(!message.data.value){
            return;
        }
        if(message.data.value.actions){
            this.messageActionBuilder(message.data.value,keys)
        }
        if(!message.data.value.items){
            return;
        }
        let galleryItems = message.data.value.items;
        for (const galleryItem of galleryItems) {
            if(galleryItem.actions){
                for (const galleryAction of galleryItem.actions) {
                    if (galleryAction.url) {
                        this.galleryUrlBuilder(keys, galleryAction)
                    }
                    if (galleryAction.nextNodes) {
                        const galleryActionNodeId = keys + "#" + galleryAction.label + "#" + galleryAction.nextNodes[0];
                        this.actionNodesPush(galleryActionNodeId, galleryAction.label, galleryAction)
                        this.nodeEdges.push({"from": keys, "to": galleryActionNodeId}, {
                            "from": galleryActionNodeId,
                            "to": galleryAction.nextNodes[0]
                        })
                    }
                }
            }
        }
    }

    galleryUrlBuilder(keys, galleryNodeActions) {
        let galleryActionNodeId = keys + "#" + galleryNodeActions.label + "#" + galleryNodeActions.url;
        this.urlList.push({
            "id": galleryActionNodeId,
            "label": galleryNodeActions.label,
            color: { background: 'white' }
        })
        this.urlEdges.push({ "from": keys, "to": galleryActionNodeId })
        for (const node of this.nodeList) {
            if (node.id === keys) {
                Object.assign(node, {"color": {"border": 'red', background: '#97C2FC'}});
            }
        }
    }

    conditionalNodesBuilder(nodeName, keys) {
        for (const condition of nodeName.conditions) {
            let nextNodes = condition.nextNodes[0];
            this.nodeEdges.push({ "from": keys, "to": nextNodes })
        }
    }

    actionNodesPush(id, label, action) {
        this.nodeList.push({
            "id": id,
            "label": label,
            color: {background: 'white'},
            nodeData: action
        });
    }
}

export default Visualization;
