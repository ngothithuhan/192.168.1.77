import React from 'react'
import axios from 'axios'
import RestfulUtils from "app/utils/RestfulUtils";
import { connect } from 'react-redux'
class DropdownFactory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            CDVAL: "",
            firstvalue: ""
        }
    }
    componentDidMount() {
        let { CDNAME, CDTYPE, where_CDVAL, listShowOptions } = this.props;
      
        var that = this;
        //console.log("componentDidMount.Haki=====Begin", CDNAME, CDTYPE, where_CDVAL);
        RestfulUtils.post('/allcode/getlist', { CDTYPE: CDTYPE, CDNAME: CDNAME, CDVAL: where_CDVAL })
            .then((res) => {
                //console.log("componentDidMount.Haki=====",res);
                if (res.errCode == 0) {
                    // console.log(res.data);
                    let dataShow = that.getShowData(res.data, listShowOptions);
                    that.setState({ data: dataShow })
                }
            })
            .catch((e) => {

            })
    }
    componentWillReceiveProps(nextProps) {
        
        if(nextProps.isrefesh){
        let { CDNAME, CDTYPE, where_CDVAL, listShowOptions } = nextProps;
        var that = this;
        //console.log("componentWillReceiveProps.Haki=====Begin", CDNAME, CDTYPE, where_CDVAL);
        RestfulUtils.post('/allcode/getlist', { CDTYPE: CDTYPE, CDNAME: CDNAME, CDVAL: where_CDVAL })
            .then((res) => {
                //console.log("componentWillReceiveProps.Haki=====",res);
                if (res.data.errCode == 0) {
                    // console.log(res.data);
                    let dataShow = that.getShowData(res.data, listShowOptions);        
                    that.setState({ data: dataShow })
                }
            })
            .catch((e) => {

            })
        }
        //if (nextProps.CDVAL) {
        // console.log(nextProps.CDTYPE,nextProps.CDVAL)
        //this.setState({ target: nextProps.CDVAL })
        //}
    }
    getShowData = (data, listShowOptions) => {
        let newData = [];
        if (listShowOptions && listShowOptions.length > 0) {
            data.length && data.forEach(item => {
                if (listShowOptions.includes(item.CDVAL)) {
                    newData.push(item);
                }
            });
        } else {
            newData = data;
        }
        return newData;
    }
    renderListOption() {
        var that = this;
        return (

            this.state.data.map((option, index) => {

                if (option.CDVAL.trim() === that.props.CDVAL)
                    return <option selected id={"optionval_" + index} value={option.CDVAL} key={index}>{that.props.language == "vie" ? option.CDCONTENT : option.EN_CDCONTENT}</option>;
                else {
                    if (index == 0) {
                        if (this.props.onSetDefaultValue)
                            this.props.onSetDefaultValue(this.props.value, option.CDVAL)
                        return <option selected id={"optionval_" + index} value={option.CDVAL} key={index}>{that.props.language == "vie" ? option.CDCONTENT : option.EN_CDCONTENT}</option>;

                    }
                    else {

                        return <option id={"optionval_" + index} value={option.CDVAL} key={index}>{that.props.language == "vie" ? option.CDCONTENT : option.EN_CDCONTENT}</option>
                    }
                }
                /*
                 return(

                     option.CDVAL.trim()===that.props.CDVAL?
                  <option selected   value={option.CDVAL} key={index}>{that.props.language=="vie"?option.CDCONTENT:option.EN_CDCONTENT}</option>:
                   <option    value={option.CDVAL} key={index}>{that.props.language=="vie"?option.CDCONTENT:option.EN_CDCONTENT}</option>
                 )
                 */
            })
        )
    }
    onChange(event) {
        // this.setState({sotienDK: event.target.value});
        let data = {}
        data.CDTYPE = this.props.CDTYPE

        data.CDNAME = this.props.CDNAME
        data.CDVAL = event.target.value

        data.value = this.props.value;
        this.setState({ target: data.CDVAL })
        this.props.onChange(this.props.value, { type: 'dropdown', value: event.target.value })
    }
    render() {
        let tmp = this.props.style;
        if (this.props.style){
            tmp = this.props.style
        }
        else 
        {
            tmp = ""
        }
        return (

            this.props.disabled ?
                <select ref={this.props.ref} disabled onChange={this.onChange.bind(this)} ref={this.props.type} id={this.props.ID} isrefesh={this.props.isrefesh} className = {"form-control " + tmp} >

                    {
                        this.renderListOption()
                    }

                </select>
                : <select ref={this.props.ref} onChange={this.onChange.bind(this)} ref={this.props.type} id={this.props.ID} isrefesh={this.props.isrefesh} className = {"form-control " + tmp}>

                    {
                        this.renderListOption()
                    }

                </select>



        )
    }
}
module.exports = connect(function (state) {
    return {
        language: state.language.language
    }
})(DropdownFactory);