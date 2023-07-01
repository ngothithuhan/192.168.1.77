import React, { Component } from 'react';
import RestfulUtils from 'app/utils/RestfulUtils';

class DropdownHeaderTable extends React.Component {
    state = {
        optionsData: []
    };

    componentDidMount() {
        let { urlApi, struct, criteria} = this.props
        var self = this;
        RestfulUtils.post(urlApi, criteria).then((resData) => {
            self.setState({ optionsData: resData })
            // if (resData.EC == 0) {
            //     self.setState({ optionsData: resData.DT })
            // } else {
            //     console.log('DropdownHeaderTable', urlApi, resData.EM);
            // }
        });
    }

    render() {
        let { struct,labelKey,valueKey } = this.props
        var optionsData = this.state.optionsData,
            MakeItem = function (item, index) {
                return <option value={item[valueKey]} key={index}>{item[labelKey]}</option>;
            };


        return (
        <select
            onChange={event => this.props.onChange(event.target.value)}
            style={{ width: "100%" }}
            value={this.props.selected ? this.props.selected.value :''}>
            <option></option>
            {optionsData.map(MakeItem)}
        </select>
        )

    }
}
module.exports =DropdownHeaderTable