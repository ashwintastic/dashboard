import React, { PropTypes, Component } from 'react';
//import TextField from 'material-ui/TextField';
import TextField from '../../components/TextField/TextField'
import FlatButton from 'material-ui/FlatButton';
import cx from 'classnames';
import s from './Poll.css';
import flexbox from '../../components/flexbox.css';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import { blue500, red500, green500 } from 'material-ui/styles/colors';
import AddIcon from 'material-ui/svg-icons/content/add-box';
import IconButton from 'material-ui/IconButton';
import Divider from 'material-ui/Divider';
import uuid from 'node-uuid';
import Paper from 'material-ui/Paper';
import UpIcon from 'material-ui/svg-icons/navigation/arrow-upward'
import DownIcon from 'material-ui/svg-icons/navigation/arrow-downward'

const newOption = {
    seqId: 0,
    text: '',
    label:'',
    image: '',
    labelValidation: '',
    textValidation: ''
};
const styles = {
    optionDivStyle: {
        whiteSpace: 'nowrap',
        textAlign: 'left',
        width: '100%',
        padding: '0.5em 0 0 1em',
        marginTop: '0.5em'
    },
    columnTwo: {
        display: 'inline-block',
        width: 500,
        marginLeft: 30,
    },
    columnThree: {
        display: 'inline-block',
        width: 790,
    },
    columnOne: {
        display: 'inline-block',
    },
    headerQ: {
        display: 'inline-block',
    }
}

export function getDefaultOptions() {
    let optionsDefault = [];
    let option1 = JSON.parse(JSON.stringify(newOption));
    option1.seqId = 0;
    option1.id = uuid.v4();
    optionsDefault.push(option1);
    let option2 = JSON.parse(JSON.stringify(newOption));
    option2.seqId = 1;
    option2.id = uuid.v4();
    optionsDefault.push(option2);
    return optionsDefault;
}

class PollQuestionComponent extends Component {

    constructor(props) {
        super(props);
        this.props = props;

        if (!props.question.options.length) {
            props.question.options = getDefaultOptions();
        }
        this.state = {
            questionSeqId: props.question.seqId,
            options: props.question.options
        };

        this.styles = {
            button: {
                fontSize: 11,
                fontWeight: 300
            }
        }
    }


    addPollOption = (index) => {
        const newOption = {
            seqId: 0,
            text: '',
            label:'',
            image: '',
            labelValidation: '',
            textValidation: ''
        };
        let newO = JSON.parse(JSON.stringify(newOption));
        let seqId = 1;
        for (var i = 0, len = this.state.options.length; i < len; i++) {
            if (this.state.options[i].seqId > seqId) {
                seqId = this.state.options[i].seqId;
            }
        }
        newO.seqId = seqId + 1;
        newO.id = uuid.v4();
        this.state.options.splice(index + 1, 0, newO);
        this.setState(Object.assign({}, this.state, { pollOptions: this.state.options }));
        this.props.onDataChange(this.state);
    }
    delPollOption = (index) => {
        this.state.options.splice(index, 1)
        this.setState(Object.assign({}, this.state, { questions: this.state.options }));
        this.props.onDataChange(this.state);
    }
    setOptionProp = (seqId, attribute, e) => {
        let options = this.state.options;
        let option = options.filter(o => o.seqId === seqId);
        const data = e.target.value;
        option[0][attribute] = data;
        if (attribute === 'label' || attribute === 'text') {
            if (data.replace(/\s/g,'') !== '') {
                if (attribute === 'label') {
                    option[0].labelValidation = '';
                }
                if (attribute === 'text') {
                    option[0].textValidation = '';
                }
            }
        }
        this.setState(Object.assign({}, this.state, { options: options }));
        this.props.onDataChange(this.state);
    }
    movePollOption = (currentIndex, moveDirection) => {
        let options = this.state.options;
        const newIndex = currentIndex + moveDirection;
        if (newIndex < 0 || newIndex >= options.length) {
            return;
        }
        let optionToMove = options.splice(currentIndex, 1);
        options.splice(newIndex, 0 , optionToMove[0]);
        this.setState(Object.assign({}, this.state, { options: options }));
        this.props.onDataChange(this.state);
    }

    render() {
        this.state.questionSeqId = this.props.question.seqId;
        this.state.options = this.props.question.options;

        return (
            <div style={{marginTop:'2em'}}>
                <h4>Options</h4>
                {this.state.options.map((input, index) =>
                    <Paper style={styles.optionDivStyle} zDepth={2} key={`optText_${index}`}>
                        <div style={{float:'right', verticalAlign:'bottom'}}>

                            <IconButton key={`optAdd_${index}`} title="Add Option" onClick={() => this.addPollOption(index)}>
                                <AddIcon
                                    color={green500}
                                    hoverColor={blue500}
                                    className={cx(s.createFlow)}
                                />
                            </IconButton>
                            <IconButton key={`optDel_${index}`} title="Delete Option"
                                disabled={(this.state.options.length<=2)}
                                onClick={() => this.delPollOption(index)}>
                                <DeleteIcon
                                    color={red500}
                                    className={cx(s.createFlow)} />
                            </IconButton>
                            <IconButton key={`optUp_${index}`} title="Move Up"
                                disabled={(index ===0)}
                                onClick={() => this.movePollOption(index, -1)}>
                                <UpIcon
                                    color={blue500}
                                    className={cx(s.createFlow)} />
                            </IconButton>
                            <IconButton key={`optDown_${index}`} title="Move Down"
                                disabled={(index ===this.state.options.length-1)}
                                onClick={() => this.movePollOption(index, 1)}>
                                <DownIcon
                                    color={blue500}
                                    className={cx(s.createFlow)} />
                            </IconButton>
                        </div>
                        <div>
                            <TextField key={`optLbl_${index}`}
                                className={s.labelField}
                                floatingLabelText='Button Label (20 characters max.)'
                                value={this.state.options[index].label}
                                style={styles.columnOne}
                                onChange={(e) => { this.setOptionProp(input.seqId, 'label', e) }}
                                errorText={this.state.options[index].labelValidation}
                                maxLength='20'
                                required={true}
                            />
                            <TextField key={`optText_${index}`}
                                floatingLabelText='Description'
                                value={this.state.options[index].text}
                                style={styles.columnTwo}
                                onChange={(e) => { this.setOptionProp(input.seqId, 'text', e) }}
                                errorText={this.state.options[index].textValidation}
                            />
                            <br/>
                            <TextField key={`optImg_${index}`}
                                floatingLabelText='Button Image URL'
                                value={this.state.options[index].image}
                                style={styles.columnThree}
                                onChange={(e) => { this.setOptionProp(input.seqId, 'image', e) }}
                            />
                        </div>
                    </Paper>
                )}
            </div>
        )
    }
}

export default PollQuestionComponent;
