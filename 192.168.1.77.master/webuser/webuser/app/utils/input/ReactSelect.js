var Select = require('react-select');
import React, { Component } from 'react';
import axios from 'axios';
import RestfulUtils from "app/utils/RestfulUtils";
/** 
 *  urlApi, option
 *  type, value 
 *  urlApi_getDetail, option_getDetail 
 *  selects   danh sách các trường cần select 
 * 
 * 
 * 
 */
class ReactSelect extends Component{
    constructor(props){
        super(props);
        this.state = {
             listOptions :[],
             value :{},
             value_detail :{}
        }
    }
   async onChange(e) {
        let that = this;
        let {urlApi_getDetail,type,option_getDetail,optionApi,keyGetDetail} = this.props 
        if(e){

            if(urlApi_getDetail){
                console.log('value',e)
                let optionFilter = option_getDetail|| {}
                optionFilter[keyGetDetail] = e.value
                RestfulUtils.post(urlApi_getDetail,optionFilter)
                .then((res) => {
                    that.setState({ value: e,value_detail:res.data });
                    this.props.onChange(type,{type:'react-select',value:e.value,value_detail:res.data})
    
                })
    
            }
            else{
                this.setState({value:e})
                this.props.onChange(type,{type:'react-select',value:e.value,data:e})
            }
        }
        else{
            if(urlApi_getDetail){
                that.setState({ value: e,value_detail:{} });
                this.props.onChange(type,{type:'react-select',value:{},value_detail:{}})
            }
            else{
                this.setState({value:e})
                this.props.onChange(type,{type:'react-select',value:''})
            }
         
        }
        
         
    }
     getOptions = (input) => {
  
        let {urlApi,optionApi,keyFilter} = this.props
        let optionFilter = optionApi|| {}
        optionFilter[keyFilter] = { 'like': "%" + input + '%' } 
        
        return RestfulUtils.post(urlApi,optionFilter)
            .then((res) => {
                return { options: res.data }
            })
    }
    componentWillReceiveProps(nextProps){
        let self = this

        let {urlApi,optionApi,keyFilter,value} = nextProps
        let optionFilter = optionApi|| {}
        optionFilter[keyFilter] = { 'like': "%" + '' + '%' }
        // optionFilter["select"] = selects;
        if(value){
            let data = this.state.options.filter(e => e.value === value);
            self.setState({value:data[0]});
        }
        if(optionApi){
            console.log('optionApi',optionApi)
            RestfulUtils.post(urlApi,optionFilter)
            .then((res) => {
                 self.setState({options:res.data}) ;
            })
        }
    }
    componentDidMount(){
        let self = this
        let {urlApi,optionApi,keyFilter,value} = this.props
        let optionFilter = optionApi|| {}
        optionFilter[keyFilter] = { 'like': "%" + '' + '%' } 
        // optionFilter["select"] = selects;
    
        RestfulUtils.post(urlApi,optionFilter)    
        .then((res) => {
            
              let data = res.data.filter(e => e.value === value);
             self.setState({options : res.data,value:data[0]}) ;
        })

    }
    
    render(){
        let {value,options} = this.state
        let {placeholder} = this.props
        return(
            <Select.Async
                name="form-field-name"
                
                placeholder={this.props.placeholder}
                 loadOptions={this.getOptions.bind(this)}
                 options = {options}
                value={value}
                onChange={this.onChange.bind(this)}

          />
        )
    }
}

module.exports = ReactSelect 