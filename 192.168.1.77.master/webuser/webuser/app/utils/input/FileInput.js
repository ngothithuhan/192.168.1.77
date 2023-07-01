import React from 'react'
import moment from 'moment';
import flow from 'lodash.flow';
import { connect } from 'react-redux';
import translate from 'app/utils/i18n/Translate.js';
class FileInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
           
        }
    }
    change=(e)=>{
        if(this.props.onChange)
            this.props.onChange(e);
    }
    render() {
        return (
            <label  id={this.props.id?('lbl'+this.props.id):"lblChoseFile"} className={this.props.className?this.props.className:"btn btn-default"} style={{ padding: "3px 6px", fontSize: "12px" }}>
            {this.props.text?this.props.text:this.props.strings.text}<input id={this.props.id?this.props.id:"btnChoseFile"} name={this.props.name?this.props.name:"fileupload"} className="inputfile" type="file" onChange={(e) => this.change(e)} /></label>
        )
    }
}
const stateToProps = state => ({
    lang: state.language.language
});
const decorators = flow([
    connect(stateToProps),
    translate('FileInput')
]);
module.exports = decorators(FileInput);