
import React from 'react';
import flow from 'lodash.flow';
import translate from 'app/utils/i18n/Translate.js';
import { connect } from 'react-redux'
class LabelEx extends React.Component {
  render() {
    if (this.props.type == "literal") {
      return <span>{this.getLabelText()}</span>;
    } else if (this.props.type == "option") {
      return <option value={this.props.value}>{this.getLabelText()}</option>
    }
    return <div style={this.props.style} className={this.props.className}> {this.props.iconclass ? <span className={this.props.iconclass}></span> : ''}{this.getLabelText()}</div>
  }
  getLabelText() {
    let textLabel = this.props.text;
    if (textLabel) {
      return this.props.strings[textLabel] ? this.props.strings[textLabel] : textLabel;
    } else
      return "N/A_Button";
  }
}
LabelEx.defaultProps = {

  strings: {
    create: 'Thêm'
  },
}
const stateToProps = state => ({

});


const decorators = flow([
  connect(stateToProps),
  translate('LabelEx')
]);

module.exports = { LabelEx: decorators(LabelEx) };