let svgWidth = 400; // default svgWidth

function getPollSummaryDetails() {
    const url = `/api/pollsummary${window.location.search}`;
    return qwest.get(url)
        .then((xhr, resp) => {

            let pollData = resp.summary;
            document.title = `Botworx - Poll Result - ${resp.name}`;
            document.getElementById("poll-name").innerText = resp.name;
            document.getElementById("poll-desc").innerText = resp.description;

            if (resp.isCount) {
                document.getElementById("total-users").innerText =
                    `Total Users - Started: ${resp.totalStarted}, Completed: ${resp.totalFinished}`;
            } else {
                const totalUsersNode = document.getElementById("total-users");
                totalUsersNode.className = "invisible";
            }

            if (!resp) {
                document.getElementById("error").innerText = "Sorry, unable to fetch data.";
                return;
            }
            /* graph generation */
            for (const questionData of pollData) {
                let graphArr = [];
                let optionDetails = {};
                for (const option of questionData.data) {
                    let optionlabel = option.label;
                    const responsecount = option.count;

                    if (resp.isCount) {
                        // we get the actual count from the server, showing that beside label
                        optionlabel = `${optionlabel} (${responsecount})`
                    }
                    optionDetails[optionlabel] = responsecount;
                }
                graphArr.push(optionDetails);
                generateD3Graph(graphArr, questionData.question, questionData.text);
            }
        });
}

function getNode(type, id, className) {
    let node = document.createElement(type);
    id && (node.id = id);
    className && (node.className = className);
    return node;
}

let graphCount = 0;
function generateD3Graph(data, questionLabel, questionDesc) {
    let colorArray = ["#2484c1", "#0c6197", "#4daa4b", "#90c469", "#e98125", "#cb2121"]
    let content = [];
    let counter = 0;
    for (let key in data[0]) {
        let temp = {}
        temp['label'] = key;
        temp['value'] = data[0][key];
        temp['color'] = colorArray[counter];
        content.push(temp);
        counter += 1;
    }

    console.log(svgWidth);
    const graphId = `graph${graphCount++} `;
    const parentNode = document.getElementById("graph");
    let divGraphContainer = getNode('div', null, 'graph-container');
    let divTitle = getNode('div', null, 'graph-title');
    divTitle.innerText = questionLabel;
    let divSubtitle = getNode('div', null, 'graph-subtitle');
    divSubtitle.innerText = questionDesc;
    let divGraph = getNode('div', graphId, 'graph-pie-container');
    divGraphContainer.appendChild(divTitle);
    divGraphContainer.appendChild(divSubtitle);
    divGraphContainer.appendChild(divGraph);
    parentNode.appendChild(divGraphContainer);

    new d3pie(graphId, {
        "footer": {
            "color": "#999999",
            "fontSize": 10,
            "font": "open sans",
            "location": "bottom-left"
        },
        "size": {
            "canvasWidth": svgWidth,
            "canvasHeight": svgWidth - 100,
            "pieOuterRadius": "50%"
        },
        "data": {
            "sortOrder": "value-desc",
            "content": content,
        },
        "labels": {
            "outer": {
                "pieDistance": 10
            },
            "inner": {
                "hideWhenLessThanPercentage": 3
            },
            "mainLabel": {
                "fontSize": 11
            },
            "percentage": {
                "color": "#ffffff",
                "decimalPlaces": 0
            },
            "value": {
                "color": "#adadad",
                "fontSize": 11
            },
            "lines": {
                "enabled": true
            },
            "truncation": {
                "enabled": true,
                "truncateLength": 40
            }
        },
        "effects": {
            "pullOutSegmentOnClick": {
                "effect": "linear",
                "speed": 400,
                "size": 8
            }
        },
        "misc": {
            "gradient": {
                "enabled": true,
                "percentage": 100
            },
            "pieCenterOffset": {
                "x": 0,
                "y": 0
            }
        }
    });
}

