import React from 'react'
import RestfulUtils from 'app/utils/RestfulUtils'
import { connect } from 'react-redux'
class DropdownFactory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            datafilter: [],
            CDVAL: "",
            target: '',
            FirstLoad: true,

        }
    }
    //hàm này để lấy objectFilter ;
    getOptionFilter(data, dataFilter) {
        let objectFiler = {}
        for (var property in data) {
            //Nếu là điểu kiện để filter
            if (data[property][dataFilter])
                objectFiler[property] = data[property].value;
        }
        return objectFiler;
    }

    componentDidMount() {
        let { optionFilter, urlApi, callApi, returnOject, typeValue, typeLabel } = this.props;

        var that = this;
        let objectFiler = this.getOptionFilter(optionFilter, 'isFilter')
        that.setState({ data: [] })
        if (callApi)
            RestfulUtils.post(urlApi, objectFiler)
                .then((res) => {
                    //theo chuẩn EC DT EM
                    // console.log("componentDidMount.Haki=res=", res)
                    let EC = res.EC ? res.EC : null
                    EC = EC == null ? res.errCode : EC
                    // console.log("componentDidMount.Haki=EC=", EC)
                    if (EC != null && EC == 0) {
                        let p_data = res.DT ? res.DT : res.data ? res.data : []
                        that.setState({ data: p_data })
                        // console.log("componentDidMount.Haki=p_data=", p_data)
                        if (p_data.length > 0)
                            //mặc định là bản ghi đầu tiên
                            //console.log('optiondiamountlength',that.props.value)

                            //Nếu là chỉnh sửa dữ liệu thì sẽ gán lại data vào option
                            if (that.props.value) {

                                let option = p_data.filter(e => e[typeValue] === that.props.value);
                                //console.log('optiondiamount',option)
                                if (option.length > 0) {
                                    that.props.onChange(that.props.type, { type: 'dropdown', value: that.props.value, dataObject: option[0] })

                                }
                            }
                            else {
                                that.props.onChange(that.props.type, { type: 'dropdown', value: that.props.defaultValue ? that.props.defaultValue : p_data[0][typeValue], dataObject: p_data[0] })

                            }



                    }
                    else {
                        that.setState({ data: res })
                        if (res.length > 0)
                            //mặc định là bản ghi đầu tiên
                            that.props.onChange(that.props.type, { type: 'dropdown', value: that.props.defaultValue ? that.props.defaultValue : res[0][typeValue], dataObject: res[0] })

                        if (that.props.value) {
                            let option = res.filter(e => e[typeValue] === this.props.value);
                            if (option.length > 0) {
                                that.props.onChange(that.props.type, { type: 'dropdown', value: this.props.value, dataObject: option[0] })

                            }
                        }
                        else {
                            that.props.onChange(that.props.type, { type: 'dropdown', value: that.props.defaultValue ? that.props.defaultValue : res[0][typeValue], dataObject: res[0] })

                        }
                    }

                })
                .catch((e) => {

                })

    }
    //kiểm trả optionFilter có thay đổi hay k
    isEquivalent(a, b) {
        // Create arrays of property names
        var aProps = Object.getOwnPropertyNames(a);
        var bProps = Object.getOwnPropertyNames(b);

        // If number of properties is different,
        // objects are not equivalent
        if (aProps.length != bProps.length) {
            return false;
        }

        for (var i = 0; i < aProps.length; i++) {
            var propName = aProps[i];

            // If values of same property are not equal,
            // objects are not equivalent
            if (a[propName] !== b[propName]) {
                return false;
            }
        }

        // If we made it this far, objects
        // are considered equivalent
        return true;
    }
    componentWillReceiveProps(nextProps) {
        //console.log('componentWillReceiveProps',nextProps.value)

        let { optionFilter, urlApi, callApi, value, typeValue, clearData } = nextProps;
        let that = this
        let ojectCheckFilter_Pre = this.getOptionFilter(this.props.optionFilter, 'checkFilter');
        let ojectCheckFilter_Next = this.getOptionFilter(optionFilter, 'checkFilter')
        // let resultCheckOption  = this.isEquivalent(this.props.optionFilter,optionFilter)
        let resultCheckOption = this.isEquivalent(ojectCheckFilter_Pre, ojectCheckFilter_Next)
        // console.log('componentWillReceiveProps',ojectCheckFilter_Next,ojectCheckFilter_Pre,resultCheckOption)
        let objectFiler = this.getOptionFilter(optionFilter, 'isFilter')
        let IsALL = nextProps.IsALL ? true : false
        let IsNULL = nextProps.IsNULL ? true : false
        if (clearData) {
            this.setState({ data: [] })
        }

        else {
            let reCallApi = this.props.clearData != nextProps.clearData
            if (reCallApi || (optionFilter && callApi && !resultCheckOption))
                RestfulUtils.post(urlApi, objectFiler)
                    .then((res) => {
                        // console.log("componentWillReceiveProps.Haki=res=", res)
                        let EC = res.EC ? res.EC : res.errCode ? res.errCode : null
                        if (EC != null && EC == 0) {
                            let p_data = res.DT ? res.DT : res.data ? res.data : []
                            that.setState({ data: p_data })
                            // console.log("componentWillReceiveProps.Haki=p_data=", p_data)
                            let option = p_data.filter(e => e[typeValue] === nextProps.value);
                            if (IsALL) {
                                if (p_data.length > 0) {
                                    that.props.onChange(that.props.type, { type: 'dropdown', value: "ALL", dataObject: {} })
                                }
                            }
                            else {
                                if (IsNULL) {
                                    if (p_data.length > 0) {
                                        that.props.onChange(that.props.type, { type: 'dropdown', value: "NULL", dataObject: {} })
                                    }
                                }
                                else {
                                    if (p_data.length > 0) {
                                        that.props.onChange(that.props.type, { type: 'dropdown', value: option.length > 0 ? option[0][typeValue] : p_data[0][typeValue], dataObject: option.length > 0 ? option[0] : p_data[0] })

                                    }
                                }
                            }
                        }
                        else {
                            // that.setState({ data: [] })
                            that.setState({ data: res })
                            let option = res.filter(e => e[typeValue] === nextProps.value);
                            if (res.length > 0)
                                that.props.onChange(that.props.type, { type: 'dropdown', value: option.length > 0 ? option[0][typeValue] : res[0][typeValue], dataObject: option.length > 0 ? option[0] : res[0] })

                        }
                    })
                    .catch((e) => {

                    })
        }

    }

    renderListOption() {
        var that = this;
        let data = this.state.data;
        let { typeValue, typeLabel, clearData, value } = this.props
        let IsALL = this.props.IsALL ? true : false
        let IsNULL = this.props.IsNULL ? true : false
        let FirstLoad = this.state.FirstLoad
        // console.log("DropdownUtils.:renderListOption.:data1.:==Haki", data)
        if (data.length > 0)
            return (
                data.map((option, index) => {
                    // console.log("DropdownUtils.:typeLabel.:==", data, ".value:", value, ".option[typeLabel]:", option[typeLabel], ".typeValue:", option[typeValue], ".IsNULL", IsNULL, ".FirstLoad", FirstLoad)
                    // console.log("DropdownUtils.:renderListOption.:data2.:==Haki", data)
                    if (typeLabel) {
                        return (
                            option[typeValue] === value ?
                                <option selected={value != undefined && value != "ALL" && value != "NULL" ? true : false} value={option[typeValue]} key={index}>{that.props.language == "vie" ? option[typeLabel] : option.EN_CDCONTENT}</option> :
                                <option value={option[typeValue]} key={index}>{that.props.language == "vie" ? option[typeLabel] : option.EN_CDCONTENT}</option>
                        )
                    }
                    else {
                        return (
                            option[typeValue] === value ?
                                <option selected={value != undefined && value != "ALL" && value != "NULL" ? true : false} value={option[typeValue]} key={index}>{that.props.language == "vie" ? option.CDCONTENT : option.EN_CDCONTENT}</option> :
                                <option value={option[typeValue]} key={index}>{that.props.language == "vie" ? option.CDCONTENT : option.EN_CDCONTENT}</option>
                        )
                    }
                })
            )

    }
    getOptionSelect(value) {
        for (let i = 0; i < this.state.data.length; i++) {
            if (this.state.data[i][this.props.typeValue] == value)
                return this.state.data[i]
        }
        return {}
    }
    onChange(event) {
        // this.setState({sotienDK: event.target.value});
        // this.setState.FirstLoad
        let data = {}
        let { typeValue } = this.props;
        data.value = this.props.value;
        let dataObject = {}
        let result;
        // console.log("onChange=================", event.target.value, this.setState.FirstLoad)
        if (typeValue) {

            dataObject = this.getOptionSelect(event.target.value)


            this.props.onChange(this.props.type, { type: 'dropdown', value: event.target.value, dataObject })

        }
        else {
            // dataObject = this.getOptionSelect(event.target.value)

            this.props.onChange(this.props.type, { type: 'dropdown', value: event.target.value, dataObject })

        }
        this.setState({ target: event.target.value, FirstLoad: false })

    }
    render() {
        let IsALL = this.props.IsALL ? true : false
        let IsNULL = this.props.IsNULL ? true : false
        return (
            this.props.disabled ?
                <select ref={this.props.ref} disabled onChange={this.onChange.bind(this)} className="form-control">
                    {IsNULL ? <option selected value="NULL" hidden></option> : null}
                    {IsALL ? <option selected value="ALL">Tất cả</option> : null}
                    {
                        this.renderListOption()
                    }

                </select>
                : <select ref={this.props.ref} onChange={this.onChange.bind(this)} className="form-control">
                    {IsNULL ? <option selected value="NULL" hidden></option> : null}
                    {IsALL ? <option selected value="ALL">Tất cả</option> : null}
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
