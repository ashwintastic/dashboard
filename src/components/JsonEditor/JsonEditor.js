import React, { PropTypes, Component } from 'react';

class JsonEditor extends Component {
  constructor(props) {
    super(props);
    this.WebJsonEditor = null;

  }

  static propTypes = {
    schema: PropTypes.object,
    jsonData: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.object,
    ]),
    displayRequired: PropTypes.bool,
    onDataChange: PropTypes.func,
    onError: PropTypes.func,
    options: PropTypes.shape({
      ajax: PropTypes.bool,
      refs: PropTypes.object,
    }),
  };

  static defaultProps = {
    schema: {
      type: 'object',
      properties: {
        prop1: {
          type: 'string',
        },
      },
    },
    displayRequired: true,
    options: {
      ajax: true,
      refs: {},
    },

    jsonData: [] || {},
    onDataChange: () => { },
    onError: () => { },
  };

  componentDidMount() {
    if (!this.WebJsonEditor) {
      /* eslint-disable global-require */
      require('json-editor');
      /* eslint-enable global-require */
      this.WebJsonEditor = window.JSONEditor;

      this.WebJsonEditor.defaults.options.theme = 'bootstrap3';
      this.WebJsonEditor.defaults.options.iconlib = 'bootstrap3';
      this.WebJsonEditor.defaults.editors.object.options.collapsed = true;
      this.WebJsonEditor.defaults.editors.object.options.grid_columns = 6;
      this.WebJsonEditor.defaults.options.display_required_only = this.props.displayRequired;
    }

    this.initEditor();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.jsonData !== nextProps.jsonData && this.editor) {
      this.editor.setValue(nextProps.jsonData);
      this.editor.validate();
    }
  }

  shouldComponentUpdate() {
    return false;
  }

  componentWillUnmount() {
    this.removeEditor();
  }

  onDataChange = () => {
    const errors = this.editor.validate();
    const jsonData = this.editor.getValue();
    if (errors.length) {
      this.props.onError(errors, jsonData);
    } else {
      this.props.onDataChange(jsonData);
    }
  };

  initEditor() {
    this.editor = new this.WebJsonEditor(this.editorDiv, {
      ...this.props.options,
      schema: this.props.schema,
    });
    this.editor.setValue(this.props.jsonData);
    this.editor.validate();
    this.editor.on('change', this.onDataChange);
  }

  removeEditor() {
    if (this.editor) {
      this.editor.off('change', this.onDataChange);
      this.editor.destroy();
      this.editor = null;
    }
  }

  render() {
    return <div ref={(c) => (this.editorDiv = c)} />;
  }

  getJsonData() {
    const errors = this.editor.validate();
    const jsonData = this.editor.getValue();
    return {
      errors,
      jsonData
    }
  }
}

export default JsonEditor;
